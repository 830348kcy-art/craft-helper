import type { SearchResultItem } from "./search";

/** ko.minecraft.wiki/w/작물 표시 순서 (블록·아이템 혼합) */
export const WIKI_CROP_ENTRIES: { id: string; type: "block" | "item" }[] = [
  { id: "wheat_seeds", type: "item" },
  { id: "wheat", type: "item" },
  { id: "melon", type: "block" },
  { id: "melon_slice", type: "item" },
  { id: "pumpkin", type: "block" },
  { id: "sugar_cane", type: "block" },
  { id: "potato", type: "item" },
  { id: "poisonous_potato", type: "item" },
  { id: "carrot", type: "item" },
  { id: "cocoa_beans", type: "item" },
  { id: "beetroot", type: "item" },
  { id: "farmland", type: "block" },
  { id: "nether_wart", type: "item" },
  { id: "nether_wart", type: "block" },
  { id: "carrots", type: "block" },
  { id: "potatoes", type: "block" },
  { id: "beetroots", type: "block" },
  { id: "melon_seeds", type: "item" },
  { id: "pumpkin_seeds", type: "item" },
  { id: "beetroot_seeds", type: "item" },
];

export type CropCatalogEntry = SearchResultItem & { displayCategory?: string };

/** 위키 작물 목록 순서로 카탈로그 항목 해석 */
export function resolveWikiCropEntries(catalog: SearchResultItem[]): CropCatalogEntry[] {
  const byKey = new Map(catalog.map((e) => [`${e.type}:${e.id}`, e]));
  const seen = new Set<string>();
  const out: CropCatalogEntry[] = [];

  for (const { id, type } of WIKI_CROP_ENTRIES) {
    const key = `${type}:${id}`;
    if (seen.has(key)) continue;
    const entry = byKey.get(key);
    if (!entry) continue;
    seen.add(key);
    out.push({ ...entry, displayCategory: "작물" });
  }
  return out;
}
