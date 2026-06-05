import { getItemTexture } from "./textures";

type MobLike = { id: string; drops: string[] };

const CDN =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";
const WIKI = "https://minecraft.wiki/images";

/** CDN entity 경로가 표준과 다른 몹 */
const ENTITY_CDN: Record<string, string> = {
  blaze: "blaze.png",
  snow_golem: "snow_golem.png",
  endermite: "endermite.png",
  phantom: "phantom.png",
  wither_skeleton: "skeleton/wither_skeleton.png",
  zombified_piglin: "piglin/piglin.png",
  cave_spider: "spider/cave_spider.png",
  ender_dragon: "enderdragon/dragon.png",
  glow_squid: "squid/glow_squid.png",
  iron_golem: "iron_golem/iron_golem.png",
};

function entityCdnUrl(mobId: string): string {
  const custom = ENTITY_CDN[mobId];
  if (custom) return `${CDN}/entity/${custom}`;
  return `${CDN}/entity/${mobId}/${mobId}.png`;
}

function entitySpriteWikiUrl(mobId: string): string {
  const slug = mobId.replace(/_/g, "-");
  return `${WIKI}/EntitySprite_${slug}.png?format=original`;
}

/** 몹 아이콘 후보 URL (CDN → 위키 → 생성알 → 드롭) */
export function getMobImageCandidates(mob: MobLike): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (url?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    out.push(url);
  };

  add(entityCdnUrl(mob.id));
  add(entitySpriteWikiUrl(mob.id));
  add(getItemTexture(`${mob.id}_spawn_egg`));
  const drop = mob.drops[0];
  if (drop) add(getItemTexture(drop));

  return out;
}

export function getMobImage(mob: MobLike): string {
  return getMobImageCandidates(mob)[0] ?? entitySpriteWikiUrl(mob.id);
}
