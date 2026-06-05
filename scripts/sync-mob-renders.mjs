/**
 * 위키 몹 3D 렌더 → public/images/mobs/ + data/mob-renders.json
 * 1) 수동 지정  2) 위키 문서 대표 이미지  3) 검색 후보 (최후)
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/images/mobs");
mkdirSync(outDir, { recursive: true });

const mobs = JSON.parse(readFileSync(resolve(root, "data/mobs.json"), "utf-8"));

const WIKI_TITLE = {
  cave_spider: "Cave Spider",
  ender_dragon: "Ender Dragon",
  glow_squid: "Glow Squid",
  iron_golem: "Iron Golem",
  magma_cube: "Magma Cube",
  piglin_brute: "Piglin Brute",
  polar_bear: "Polar Bear",
  snow_golem: "Snow Golem",
  tropical_fish: "Tropical Fish",
  wandering_trader: "Wandering Trader",
  wither_skeleton: "Wither Skeleton",
  zombie_villager: "Zombie Villager",
  zombified_piglin: "Zombified Piglin",
};

/** pageimages·검색이 전개도/잘못된 파일을 고를 때 */
const RENDER_FILE = {
  slime: "Slime JE2 BE1.png",
  pillager: "Pillager JE2.png",
  vindicator: "Vindicator JE3 BE3.png",
  silverfish: "Silverfish JE1 BE1.png",
  magma_cube: "Magma Cube JE2 BE1.png",
  ghast: "Ghast JE2 BE1.png",
  blaze: "Blaze JE2 BE1.png",
  phantom: "Phantom JE2 BE1.png",
  drowned: "Drowned JE2 BE1.png",
  ravager: "Ravager JE2 BE1.png",
  hoglin: "Hoglin JE2 BE1.png",
  zoglin: "Zoglin JE2 BE1.png",
  shulker: "Shulker JE2 BE1.png",
  bogged: "Bogged JE1 BE1.png",
  glow_squid: "Glow Squid JE2 BE1.png",
  dolphin: "Dolphin JE1 BE1.png",
  bat: "Bat JE4 BE3.png",
  evoker: "Evoker JE2 BE2.png",
  witch: "Witch JE3.png",
  creeper: "Creeper JE3 BE1.png",
  spider: "Spider JE5 BE4.png",
  cave_spider: "Cave Spider JE3 BE3.png",
  skeleton: "Skeleton JE6 BE4.png",
  iron_golem: "Iron Golem JE2 BE2.png",
  snow_golem: "Snow Golem JE2 BE2.png",
  wandering_trader: "Wandering Trader JE1 BE1.png",
  ender_dragon: "Ender Dragon JE1 BE1.png",
  wither: "Wither JE2 BE1.png",
  pig: "Temperate Pig JE4 BE2.png",
  horse: "Brown Horse JE1 BE1.png",
  donkey: "Donkey JE1 BE1.png",
  cat: "Tabby Cat JE1 BE1.png",
  ocelot: "Ocelot JE2 BE2.png",
  fox: "Fox JE2 BE2.png",
  axolotl: "Lucy Axolotl JE2.png",
  turtle: "Turtle JE3 BE1.png",
  villager: "Plains Villager JE1 BE1.png",
  zombie_villager: "Plains Zombie Villager JE1 BE1.png",
  camel: "Camel JE1 BE2.png",
  dolphin: "Dolphin JE1 BE2.png",
  allay: "Allay JE1 BE1.png",
  sniffer: "Sniffer JE1 BE1.png",
  warden: "Warden JE1 BE1.png",
  breeze: "Breeze JE1 BE1.png",
  bee: "Bee JE1.gif",
  strider: "Strider Jockey JE5.png",
  piglin: "Piglin JE2 BE1.png",
};

function wikiTitle(id) {
  if (WIKI_TITLE[id]) return WIKI_TITLE[id];
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function wikiFileUrl(fileTitle) {
  const api =
    "https://minecraft.wiki/api.php?action=query&titles=" +
    encodeURIComponent(`File:${fileTitle}`) +
    "&prop=imageinfo&iiprop=url&format=json";
  const res = await fetch(api, { headers: { "User-Agent": "craft-helper/1.0" } });
  const json = await res.json();
  const page = Object.values(json.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.url ?? null;
}

async function fetchPageImage(title) {
  const api =
    "https://minecraft.wiki/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=pageimages&piprop=original&format=json";
  const res = await fetch(api, { headers: { "User-Agent": "craft-helper/1.0" } });
  const json = await res.json();
  const page = Object.values(json.query?.pages ?? {})[0];
  if (page?.missing || !page?.original?.source) return null;
  let url = page.original.source;
  if (/\.gif(\?|$)/i.test(url)) {
    const png = url.replace(/\.gif(\?)/i, ".png$1");
    try {
      const h = await fetch(png, {
        method: "HEAD",
        headers: { "User-Agent": "craft-helper/1.0" },
      });
      if (h.ok) url = png;
    } catch {
      /* keep gif */
    }
  }
  return url;
}

function isLikelyUnfolded(buffer) {
  try {
    const png = PNG.sync.read(buffer);
    const { width, height } = png;
    const ratio = width / height;
    // 전개도 UV: 매우 넓거나 (슬라임 십자형) 극단적 비율
    if (ratio > 2.4 || ratio < 0.35) return true;
    if (width > 420 && height < 180) return true;
    return false;
  } catch {
    return true;
  }
}

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": "craft-helper/1.0" } });
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function resolveRender(mobId, entityTitle) {
  const tries = [];
  if (RENDER_FILE[mobId]) tries.push(await wikiFileUrl(RENDER_FILE[mobId]));
  tries.push(await fetchPageImage(entityTitle));

  for (const url of tries.filter(Boolean)) {
    const buf = await download(url);
    if (!buf) continue;
    const isGif = /\.gif(\?|$)/i.test(url);
    if (!isGif && isLikelyUnfolded(buf)) continue;
    const ext = isGif ? "gif" : "png";
    return { url, buf, ext };
  }
  return null;
}

const renders = {};
let ok = 0;

for (const mob of mobs) {
  const title = wikiTitle(mob.id);
  const picked = await resolveRender(mob.id, title);
  if (!picked) {
    console.warn(`[sync-mob-renders] 실패: ${mob.id} (${title})`);
    continue;
  }
  writeFileSync(resolve(outDir, `${mob.id}.${picked.ext}`), picked.buf);
  renders[mob.id] = `/images/mobs/${mob.id}.${picked.ext}`;
  ok++;
  console.log(`[sync-mob-renders] ${mob.id}`);
}

writeFileSync(
  resolve(root, "data/mob-renders.json"),
  JSON.stringify(renders, null, 2),
  "utf-8"
);
console.log(`[sync-mob-renders] 완료: ${ok}/${mobs.length}`);
