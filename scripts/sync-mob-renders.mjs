/**
 * 위키 몹 페이지 대표 이미지(3D 렌더) → data/mob-renders.json
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobs = JSON.parse(readFileSync(resolve(root, "data/mobs.json"), "utf-8"));

/** 위키 문서 제목 (기본: snake_case → Title Case) */
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

function wikiTitle(id) {
  if (WIKI_TITLE[id]) return WIKI_TITLE[id];
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function urlExists(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "craft-helper/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchWikiRender(title) {
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
    if (await urlExists(png)) url = png;
  }
  return url;
}

const renders = {};
let ok = 0;

for (const mob of mobs) {
  const title = wikiTitle(mob.id);
  const url = await fetchWikiRender(title);
  if (url) {
    renders[mob.id] = url;
    ok++;
    console.log(`[sync-mob-renders] ${mob.id} ← ${title}`);
  } else {
    console.warn(`[sync-mob-renders] 없음: ${mob.id} (${title})`);
  }
}

writeFileSync(
  resolve(root, "data/mob-renders.json"),
  JSON.stringify(renders, null, 2),
  "utf-8"
);
console.log(`[sync-mob-renders] 완료: ${ok}/${mobs.length}`);
