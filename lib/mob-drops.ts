export type MobDrop = {
  id: string;
  min: number;
  max: number;
  /** 드롭 확률이 100% 미만 */
  rare?: boolean;
  /** 플레이어 처치 시에만 */
  playerKill?: boolean;
};

/** 드롭 개수 표시 (예: 0~2개, 1개) */
export function formatMobDropRange(drop: MobDrop): string {
  const { min, max } = drop;
  if (min === max) return `${min}개`;
  return `${min}~${max}개`;
}

/** 드롭 라벨 (희귀·플레이어 처치 표기 포함) */
export function formatMobDropLabel(drop: MobDrop, itemName: string): string {
  const range = formatMobDropRange(drop);
  const tags: string[] = [];
  if (drop.rare) tags.push("희귀");
  if (drop.playerKill) tags.push("플레이어 처치");
  const suffix = tags.length ? ` · ${tags.join(" · ")}` : "";
  return `${itemName} ${range}${suffix}`;
}

/** 레거시 string[] 또는 MobDrop[] 정규화 */
export function normalizeMobDrops(
  drops: (string | MobDrop)[]
): MobDrop[] {
  return drops.map((d) =>
    typeof d === "string" ? { id: d, min: 1, max: 1 } : d
  );
}
