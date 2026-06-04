export type SearchIndexItem = {
  id: string;
  type: "block" | "item" | "recipe" | "mob" | "biome";
  name: string;
  description: string;
  emoji: string;
  image?: string;
  category: string;
  tags: string[];
  href: string;
  dimension?: "overworld" | "nether" | "end";
};

/** search-index.json 항목을 쿼리로 필터·점수 정렬 */
export function filterSearchIndex(
  index: SearchIndexItem[],
  query: string
): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = index.map((entry) => {
    let score = 0;
    const name = entry.name.toLowerCase();
    const desc = entry.description.toLowerCase();
    const id = entry.id.toLowerCase().replace(/_/g, " ");
    const idRaw = entry.id.toLowerCase();
    const tags = entry.tags.map((t) => t.toLowerCase());
    const cat = entry.category.toLowerCase();

    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 40;

    if (idRaw === q || id.includes(q) || idRaw.includes(q.replace(/\s/g, "_")))
      score += 35;

    if (tags.some((t) => t === q)) score += 30;
    else if (tags.some((t) => t.includes(q))) score += 15;

    if (cat.includes(q)) score += 12;
    if (desc.includes(q)) score += 10;

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry);
}

export async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const ver = process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev";
  const res = await fetch(`${base}/search-index.json?v=${ver}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
