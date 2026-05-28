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
