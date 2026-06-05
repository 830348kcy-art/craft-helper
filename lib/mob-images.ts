import mobRendersJson from "../data/mob-renders.json";

type MobLike = { id: string };

const mobRenders = mobRendersJson as Record<string, string>;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** 로컬 3D 렌더 (sync-mob-renders.mjs) */
export function getMobRenderUrl(mobId: string): string | undefined {
  const rel = mobRenders[mobId];
  if (!rel) return undefined;
  return rel.startsWith("http") ? rel : `${BASE}${rel}`;
}

/** 몹 아이콘 — 로컬 3D 렌더만 사용 (전개도·스폰 알 폴백 없음) */
export function getMobImageCandidates(mob: MobLike): string[] {
  const url = getMobRenderUrl(mob.id);
  return url ? [url] : [];
}

export function getMobImage(mob: MobLike): string | undefined {
  return getMobRenderUrl(mob.id);
}
