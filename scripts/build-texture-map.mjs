/**
 * 모든 카탈로그 ID에 대해 CDN HEAD 검사 → 최적 텍스처 URL 맵 생성
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";
import { getTextureCandidateUrls, CDN } from "./texture-candidates.mjs";

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));
const blockIds = new Set(blocks.map((b) => b.id));

const allIds = new Set([
  ...blocks.map((b) => b.id),
  ...items.map((i) => i.id),
]);

const urlCache = new Map();

async function urlExists(url) {
  if (urlCache.has(url)) return urlCache.get(url);
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    const ok = res.ok;
    urlCache.set(url, ok);
    return ok;
  } catch {
    urlCache.set(url, false);
    return false;
  }
}

async function resolveBestUrl(id) {
  for (const url of getTextureCandidateUrls(id)) {
    if (await urlExists(url)) return url;
  }
  const manual = MANUAL_FALLBACKS[id];
  if (manual) {
    const url = manual.startsWith("http") ? manual : `${CDN}/${manual}`;
    if (await urlExists(url)) return url;
  }
  return null;
}

/** CDN에 flat PNG가 없는 ID — 검증된 대체 텍스처 */
const MANUAL_FALLBACKS = {
  air: "block/stone.png",
  cave_air: "block/stone.png",
  void_air: "block/stone.png",
  crossbow: "item/bow.png",
  shield: "item/iron_chestplate.png",
  enchanted_golden_apple: "item/golden_apple.png",
  creeper_head: "item/spawn_egg.png",
  creeper_wall_head: "item/spawn_egg.png",
  dragon_head: "item/dragon_breath.png",
  dragon_wall_head: "item/dragon_breath.png",
  piglin_head: "item/gold_ingot.png",
  piglin_wall_head: "item/gold_ingot.png",
  player_head: "item/golden_helmet.png",
  player_wall_head: "item/golden_helmet.png",
  zombie_head: "item/rotten_flesh.png",
  zombie_wall_head: "item/rotten_flesh.png",
  skeleton_skull: "item/bone.png",
  skeleton_wall_skull: "item/bone.png",
  wither_skeleton_skull: "item/coal.png",
  wither_skeleton_wall_skull: "item/coal.png",
  decorated_pot: "block/flower_pot.png",
  dried_ghast: "block/soul_sand.png",
  dried_kelp_block: "block/kelp.png",
  end_gateway: "block/end_stone.png",
  end_portal: "block/end_stone.png",
  firefly_bush: "block/oak_leaves.png",
  frosted_ice: "block/ice.png",
  leaf_litter: "block/oak_leaves.png",
  moss_carpet: "block/moss_block.png",
  moving_piston: "block/piston_top.png",
  piston_head: "block/piston_top.png",
  petrified_oak_slab: "block/oak_planks.png",
  potted_bamboo: "block/bamboo_stalk.png",
  potted_cactus: "block/cactus_side.png",
  purpur_slab: "block/purpur_block.png",
  purpur_stairs: "block/purpur_block.png",
  short_dry_grass: "block/short_grass.png",
  tall_dry_grass: "block/short_grass.png",
  smooth_sandstone: "block/sandstone.png",
  smooth_sandstone_slab: "block/sandstone.png",
  smooth_sandstone_stairs: "block/sandstone.png",
  smooth_red_sandstone: "block/red_sandstone.png",
  smooth_red_sandstone_slab: "block/red_sandstone.png",
  smooth_red_sandstone_stairs: "block/red_sandstone.png",
  snow_block: "block/snow.png",
  stripped_bamboo_log: "block/bamboo_block.png",
  stripped_bamboo_wood: "block/bamboo_block.png",
  torchflower_crop: "block/wheat_stage7.png",
  wildflowers: "block/poppy.png",
};

async function mapWithConcurrency(ids, fn, limit = 20) {
  const arr = [...ids];
  const results = new Map();
  let i = 0;

  async function worker() {
    while (i < arr.length) {
      const idx = i++;
      const id = arr[idx];
      results.set(id, await fn(id));
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

console.log(`[build-texture-map] ${allIds.size}개 ID 검사 중…`);
const resolved = await mapWithConcurrency(allIds, resolveBestUrl);

const map = {};
const failed = [];
for (const [id, url] of resolved) {
  if (url) map[id] = url;
  else failed.push(id);
}

const outPath = resolve(root, "scripts/texture-url-map.json");
writeFileSync(outPath, JSON.stringify(map, null, 0), "utf-8");

console.log(
  `[build-texture-map] 성공 ${Object.keys(map).length}/${allIds.size}, ` +
    `실패 ${failed.length} → ${outPath}`
);
if (failed.length > 0 && failed.length <= 30) {
  console.log("실패 ID:", failed.join(", "));
} else if (failed.length > 30) {
  console.log("실패 샘플:", failed.slice(0, 30).join(", "), `… 외 ${failed.length - 30}개`);
}
