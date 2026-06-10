/** 상세 페이지 · 목록 간 돌아가기 경로/라벨 */

export function listBackPath(from?: string | null, defaultHref = "/"): string {
  if (!from) return defaultHref;
  try {
    return decodeURIComponent(from);
  } catch {
    return from;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  blocks: "블록 분류",
  items: "아이템 분류",
  mobs: "몹 분류",
  biomes: "생물군계",
  redstone: "레드스톤",
  enchanting: "마법부여",
  nether: "네더",
  end: "엔드",
};

export function listBackLabel(from?: string | null, defaultLabel = "목록"): string {
  const path = listBackPath(from);
  if (path === "/search") return "검색";
  if (path === "/") return "대문";

  const catMatch = path.match(/\/category\/([^/?]+)/);
  if (catMatch) {
    return CATEGORY_LABELS[catMatch[1]] ?? "분류 목록";
  }

  if (path.includes("/dimension/")) {
    const dim = path.match(/\/dimension\/(\w+)/)?.[1];
    const section = path.includes("section=mobs")
      ? " · 몹"
      : path.includes("section=biomes")
        ? " · 생물군계"
        : path.includes("section=blocks")
          ? " · 블록"
          : path.includes("section=items")
            ? " · 아이템"
            : "";
    const dimName =
      dim === "nether" ? "네더" : dim === "end" ? "엔드" : dim === "overworld" ? "오버월드" : dim ?? "";
    return `${dimName}${section} 목록`;
  }

  if (path.startsWith("/wiki/")) return "가이드 목록";

  return defaultLabel;
}
