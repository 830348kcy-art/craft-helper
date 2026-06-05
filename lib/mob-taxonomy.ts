/** mobs.json category 값 */
export type MobCategoryId = "친화적" | "중립" | "적대적" | "보스";

export const MOB_GROUP_ORDER: MobCategoryId[] = ["친화적", "중립", "적대적", "보스"];

export const MOB_CATEGORY_DESC: Record<MobCategoryId, string> = {
  친화적: "플레이어를 공격하지 않는 몹",
  중립: "선공하거나 특정 행동·조건에서 공격하는 몹",
  적대적: "플레이어를 인식하면 조건 없이 공격하는 몹",
  보스: "보스 생명력 바가 있는 특수 보스",
};

/** 레거시 데이터 호환 */
const LEGACY_LABEL: Record<string, MobCategoryId> = {
  수동적: "친화적",
};

export function normalizeMobCategory(category: string): MobCategoryId {
  return (LEGACY_LABEL[category] ?? category) as MobCategoryId;
}

export function getMobCategoryLabel(category: string): string {
  return normalizeMobCategory(category);
}

export function getMobCategoryDesc(category: string): string | undefined {
  return MOB_CATEGORY_DESC[normalizeMobCategory(category)];
}

/** 몹 상세 · 목록 링크용 돌아가기 경로 */
export function mobListBackPath(from?: string | null): string {
  if (from) {
    try {
      return decodeURIComponent(from);
    } catch {
      return from;
    }
  }
  return "/category/mobs";
}

export function mobListBackLabel(from?: string | null): string {
  const path = mobListBackPath(from);
  if (path.includes("/dimension/")) {
    const dim = path.match(/\/dimension\/(\w+)/)?.[1];
    const section = path.includes("section=mobs") ? " · 몹" : "";
    const dimName =
      dim === "nether" ? "네더" : dim === "end" ? "엔드" : dim === "overworld" ? "오버월드" : dim ?? "";
    return `${dimName}${section} 목록`;
  }
  if (path.includes("/category/mobs")) return "몹 분류";
  return "목록으로";
}
