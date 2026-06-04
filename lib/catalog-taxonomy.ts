/**
 * 블록·아이템 차원(오버월드/네더/엔드) + 세부 카테고리
 */

export type DimensionId = "overworld" | "nether" | "end";

export type DimensionInfo = {
  id: DimensionId;
  name: string;
  emoji: string;
  color: string;
};

export const DIMENSIONS: DimensionInfo[] = [
  {
    id: "overworld",
    name: "오버월드",
    emoji: "🌍",
    color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  },
  {
    id: "nether",
    name: "네더",
    emoji: "🔥",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
  },
  {
    id: "end",
    name: "엔드",
    emoji: "🌌",
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200",
  },
];

/** 블록 세부 카테고리 표시 순서 */
export const BLOCK_SUB_CATEGORY_ORDER = [
  "건축",
  "기능",
  "레드스톤",
  "나무",
  "광석",
  "자원",
  "자연",
  "식물",
  "장식",
  "조명",
  "이동",
  "특수",
] as const;

/** 아이템 세부 카테고리 */
export const ITEM_SUB_CATEGORY_ORDER = [
  "도구",
  "무기",
  "방어구",
  "음식",
  "농작물",
  "자원",
  "재료",
  "양조",
  "마법",
  "이동",
  "음악",
  "특수",
  "기타",
] as const;

const NETHER_ID =
  /^(nether|netherrack|soul_|crimson|warped|magma|basalt|blackstone|gilded|polished_blackstone|chiseled_polished_blackstone|cracked_polished|nether_brick|red_nether|blue_nether|weeping|twisting|shroomlight|ancient|respawn_anchor|lodestone|nether_gold|nether_quartz|nether_wart|nether_sprouts|fungus|roots|hyphae|nylium|stripped_crimson|stripped_warped|crimson|warped)/;

const END_ID =
  /^(end_|purpur|chorus|dragon|elytra|shulker|end_stone|end_rod|end_portal|end_gateway|ender_)/;

const NETHER_ITEM =
  /^(blaze|nether|wither|ghast|magma|quartz|strider|hoglin|piglin|ancient_debris|basalt|soul_|crimson|warped|shroom|respawn_anchor|lodestone|gilded|blackstone)/;

export function inferDimension(id: string): DimensionId {
  if (END_ID.test(id)) return "end";
  if (NETHER_ID.test(id) || NETHER_ITEM.test(id)) return "nether";
  return "overworld";
}

export function getDimension(id: DimensionId): DimensionInfo {
  return DIMENSIONS.find((d) => d.id === id) ?? DIMENSIONS[0];
}

export function groupByDimensionAndSubCategory<
  T extends { id: string; category: string; name: string },
>(entries: T[], subOrder: readonly string[]): Map<DimensionId, Map<string, T[]>> {
  const root = new Map<DimensionId, Map<string, T[]>>();
  for (const dim of DIMENSIONS) {
    root.set(dim.id, new Map());
  }

  for (const e of entries) {
    const dim = inferDimension(e.id);
    const sub = e.category || "기타";
    const dimMap = root.get(dim)!;
    if (!dimMap.has(sub)) dimMap.set(sub, []);
    dimMap.get(sub)!.push(e);
  }

  for (const [, dimMap] of root) {
    for (const [, list] of dimMap) {
      list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
  }

  return root;
}

export function orderedSubCategories(
  dimMap: Map<string, unknown[]>,
  order: readonly string[]
): { sub: string; entries: unknown[] }[] {
  const result: { sub: string; entries: unknown[] }[] = [];
  for (const sub of order) {
    const entries = dimMap.get(sub);
    if (entries?.length) result.push({ sub, entries });
  }
  for (const [sub, entries] of dimMap) {
    if (!order.includes(sub as (typeof order)[number]) && entries.length) {
      result.push({ sub, entries });
    }
  }
  return result;
}
