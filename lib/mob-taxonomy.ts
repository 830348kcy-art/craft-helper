/** mobs.json category 값 */
export type MobCategoryId = "수동적" | "중립" | "적대적" | "보스";

export const MOB_GROUP_ORDER: MobCategoryId[] = ["수동적", "중립", "적대적", "보스"];

/** UI 표시명 */
export const MOB_CATEGORY_LABEL: Record<MobCategoryId, string> = {
  수동적: "친화적",
  중립: "중립적",
  적대적: "적대적",
  보스: "보스",
};

export const MOB_CATEGORY_DESC: Record<MobCategoryId, string> = {
  수동적: "플레이어를 공격하지 않는 몹",
  중립: "선공하거나 특정 행동·조건에서 공격하는 몹",
  적대적: "플레이어를 인식하면 조건 없이 공격하는 몹",
  보스: "보스 생명력 바가 있는 특수 보스",
};

export function getMobCategoryLabel(category: string): string {
  return MOB_CATEGORY_LABEL[category as MobCategoryId] ?? category;
}

export function getMobCategoryDesc(category: string): string | undefined {
  return MOB_CATEGORY_DESC[category as MobCategoryId];
}
