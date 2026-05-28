import { loadAllData } from "./sheets";
import { getItemTexture } from "./textures";

export type SearchResultItem = {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  description: string;
  category: string;
  tags: string[];
  type: "block" | "item" | "recipe";
  href: string;
};

async function buildIndex(): Promise<SearchResultItem[]> {
  const { blocks, items, recipes } = await loadAllData();
  return [
    ...blocks.map((b) => ({
      id: b.id,
      name: b.name,
      emoji: b.emoji,
      image: (b as any).image as string | undefined,
      description: b.description,
      category: b.category,
      tags: b.tags,
      type: "block" as const,
      href: `/search/${b.id}?type=block`,
    })),
    ...items.map((it) => ({
      id: it.id,
      name: it.name,
      emoji: it.emoji,
      image: (it as any).image as string | undefined,
      description: it.description,
      category: it.category,
      tags: it.tags,
      type: "item" as const,
      href: `/search/${it.id}?type=item`,
    })),
    ...recipes.map((r) => ({
      id: r.id,
      name: r.name,
      emoji: r.emoji,
      // 레시피 자체는 텍스처 없음 — 결과 아이템 텍스처 사용 (id 기반)
      image: getItemTexture(r.id),
      description: r.description,
      category: r.category,
      tags: r.tags,
      type: "recipe" as const,
      href: `/search/${r.id}?type=recipe`,
    })),
  ];
}

/** 쿼리로 검색. 이름 > 태그 > 설명 순으로 점수 매김 */
export async function searchAll(query: string): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const ALL = await buildIndex();

  const scored = ALL.map((entry) => {
    let score = 0;
    const name = entry.name.toLowerCase();
    const desc = entry.description.toLowerCase();
    const tags = entry.tags.map((t) => t.toLowerCase());

    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 40;

    if (tags.some((t) => t === q)) score += 30;
    else if (tags.some((t) => t.includes(q))) score += 15;

    if (desc.includes(q)) score += 10;

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry);
}

export async function getAllItems(): Promise<SearchResultItem[]> {
  return buildIndex();
}

/**
 * 카테고리 슬러그 → 해당하는 블록·아이템·레시피 목록.
 * 슬러그별로 데이터의 어떤 한국어 category/tag와 매칭할지 정의한다.
 */
const CATEGORY_MATCHERS: Record<
  string,
  {
    blockCats?: string[];   // blocks.json의 category 필드와 매칭
    itemCats?: string[];    // items.json의 category
    recipeCats?: string[];  // recipes.json의 category
    tags?: string[];        // 모든 타입의 tags와 매칭
    blockIds?: string[];    // 명시적 블록 ID
    itemIds?: string[];     // 명시적 아이템 ID
  }
> = {
  blocks: {
    // 모든 블록을 포함
    blockCats: ["자연", "건축", "특수", "나무", "광석", "네더", "엔드", "기능", "레드스톤", "장식", "조명", "자원", "식물"],
  },
  items: {
    // 모든 아이템을 포함
    itemCats: ["자원", "연료", "재료", "특수", "마법", "농작물", "음식", "무기", "탄약", "방어구", "도구", "보관", "기타", "음악", "이동", "크리에이티브"],
    recipeCats: ["도구", "무기", "방어구", "음식", "재료", "기본"],
  },
  mobs: {
    // 몹 관련 (드롭 아이템·알 등)
    tags: ["몹", "스폰", "좀비", "스켈레톤", "거미", "엔더맨", "크리퍼", "닭", "소", "양", "돼지", "늑대", "고양이", "여우", "토끼"],
    itemIds: ["egg", "leather", "feather", "bone", "string", "gunpowder", "ender_pearl", "rotten_flesh", "spider_eye"],
  },
  biomes: {
    // 생물군계 대표 블록·식물
    blockCats: ["자연", "식물", "나무"],
  },
  redstone: {
    blockCats: ["레드스톤"],
    itemCats: ["크리에이티브"],
    recipeCats: ["레드스톤", "기능"],
    tags: ["레드스톤", "회로", "자동화", "신호"],
  },
  enchanting: {
    itemCats: ["마법"],
    tags: ["마법", "마법부여", "정령"],
    blockIds: ["enchanting_table", "bookshelf"],
    itemIds: ["book", "enchanted_book", "experience_bottle", "lapis_lazuli"],
  },
  nether: {
    blockCats: ["네더"],
    tags: ["네더", "지옥", "피글린", "블레이즈", "가스트", "위더"],
    itemIds: ["blaze_rod", "blaze_powder", "ghast_tear", "magma_cream", "netherite_ingot", "netherite_scrap", "nether_quartz"],
  },
  end: {
    blockCats: ["엔드"],
    tags: ["엔드", "엔더", "셜커", "용", "고대도시"],
    itemIds: ["ender_pearl", "ender_eye", "elytra", "shulker_shell", "dragon_breath", "echo_shard"],
  },
};

export async function getEntriesByCategory(slug: string): Promise<SearchResultItem[]> {
  const matcher = CATEGORY_MATCHERS[slug];
  if (!matcher) return [];

  const all = await buildIndex();
  const { blockCats = [], itemCats = [], recipeCats = [], tags = [], blockIds = [], itemIds = [] } = matcher;

  return all.filter((entry) => {
    // 명시적 ID 매칭
    if (entry.type === "block" && blockIds.includes(entry.id)) return true;
    if (entry.type === "item"  && itemIds.includes(entry.id))  return true;

    // 카테고리 매칭
    if (entry.type === "block"  && blockCats.includes(entry.category))  return true;
    if (entry.type === "item"   && itemCats.includes(entry.category))   return true;
    if (entry.type === "recipe" && recipeCats.includes(entry.category)) return true;

    // 태그 매칭
    if (tags.length && entry.tags.some((t) => tags.includes(t))) return true;

    return false;
  });
}
