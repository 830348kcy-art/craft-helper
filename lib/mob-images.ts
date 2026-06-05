import mobRendersJson from "../data/mob-renders.json";
import { getItemTexture } from "./textures";

type MobLike = { id: string; drops: string[] };

const mobRenders = mobRendersJson as Record<string, string>;

const WIKI = "https://minecraft.wiki/images";

/** 위키 3D 렌더 (sync-mob-renders.mjs) */
export function getMobRenderUrl(mobId: string): string | undefined {
  return mobRenders[mobId];
}

function spawnEggWikiUrl(mobId: string): string {
  const slug = mobId.replace(/_/g, "-");
  return `${WIKI}/ItemSprite_${slug}-spawn-egg.png?format=original`;
}

/** 몹 아이콘 후보 — 3D 렌더 우선, 전개도 텍스처는 사용하지 않음 */
export function getMobImageCandidates(mob: MobLike): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (url?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push(url);
  };

  add(getMobRenderUrl(mob.id));
  add(getItemTexture(`${mob.id}_spawn_egg`));
  add(spawnEggWikiUrl(mob.id));
  const drop = mob.drops[0];
  if (drop) add(getItemTexture(drop));

  return out;
}

export function getMobImage(mob: MobLike): string {
  return getMobImageCandidates(mob)[0] ?? spawnEggWikiUrl(mob.id);
}
