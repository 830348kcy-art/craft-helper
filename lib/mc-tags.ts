import tagsJson from "../data/mc-tags.json";
import blocksCatalog from "../data/blocks.json";
import itemsCatalog from "../data/items.json";
import officialKoJson from "../scripts/ko-lang-official.json";

export type McTagDef = {
  label: string;
  labelKo: string;
  description: string;
  memberIds: string[];
};

const TAGS = tagsJson as Record<string, McTagDef>;

const officialKo = officialKoJson as {
  blocks?: Record<string, string>;
  items?: Record<string, string>;
};

const idToKo = new Map<string, string>();
for (const b of blocksCatalog) if (b.name) idToKo.set(b.id, b.name);
for (const it of itemsCatalog) if (it.name && !idToKo.has(it.id)) idToKo.set(it.id, it.name);
for (const [id, name] of Object.entries(officialKo.blocks ?? {})) {
  if (name && !idToKo.has(id)) idToKo.set(id, name);
}
for (const [id, name] of Object.entries(officialKo.items ?? {})) {
  if (name && !idToKo.has(id)) idToKo.set(id, name);
}

/** 레시피 격자 셀 → 태그 키 (logs, coals, …) */
export function parseTagCell(cell: string): string | null {
  const t = cell.trim();
  if (t.startsWith("#")) return t.slice(1).split(/[\s(·]/)[0] ?? null;
  const m = t.match(/^#?([a-z_]+)\s*태그$/i);
  return m?.[1] ?? null;
}

export function getTag(tagKey: string): McTagDef | undefined {
  return TAGS[tagKey];
}

export function getAllTagKeys(): string[] {
  return Object.keys(TAGS);
}

export function getTagMemberNames(tagKey: string): string[] {
  const tag = TAGS[tagKey];
  if (!tag) return [];
  return tag.memberIds.map((id) => idToKo.get(id) ?? id.replace(/_/g, " "));
}

export function getTagMemberIds(tagKey: string): string[] {
  return TAGS[tagKey]?.memberIds ?? [];
}

export function getTagLabelKo(tagKey: string): string {
  return TAGS[tagKey]?.labelKo ?? `#${tagKey}`;
}

/** 태그에 속한 아이템 ID 목록 (레시피 역참조용) */
export function getTagsForItemId(itemId: string): string[] {
  return Object.entries(TAGS)
    .filter(([, def]) => def.memberIds.includes(itemId))
    .map(([key]) => key);
}

/** 레시피 ID → 이 재료 태그를 쓰는 레시피 (data에서 주입) */
export function tagUsedInRecipes(tagKey: string, recipeIds: string[]): string[] {
  return recipeIds;
}
