/**
 * 서바이벌 1.21.4 — 제작 레시피로 만들 수 있는 항목만 카탈로그에 포함
 * (명령어/크리에이티브 전용 블록·아이템 제외)
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { root } from "./textures-config-root.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 명령어·크리에이티브·기술 블록 (레시피에 있어도 제외) */
export const EXCLUDE_EXACT = new Set([
  "air",
  "cave_air",
  "void_air",
  "bedrock",
  "barrier",
  "command_block",
  "chain_command_block",
  "repeating_command_block",
  "structure_block",
  "structure_void",
  "jigsaw",
  "piston_head",
  "moving_piston",
  "end_portal",
  "end_gateway",
  "end_portal_frame",
  "fire",
  "water",
  "lava",
  "bubble_column",
  "spawner",
  "debug_stick",
  "knowledge_book",
  "reinforced_deepslate",
  "farmland",
  "dirt_path",
  "attached_melon_stem",
  "attached_pumpkin_stem",
  "carrots",
  "potatoes",
  "beetroots",
  "melon_stem",
  "pumpkin_stem",
  "nether_portal",
  "frosted_ice",
  "tripwire",
  "tripwire_hook",
  "redstone_wire",
  "wall_torch",
  "soul_wall_torch",
  "redstone_wall_torch",
  "skeleton_wall_skull",
  "wither_skeleton_wall_skull",
  "zombie_wall_head",
  "creeper_wall_head",
  "piglin_wall_head",
  "player_wall_head",
  "dragon_wall_head",
]);

export const EXCLUDE_PATTERNS = [
  /_spawn_egg$/,
  /^infested_/,
  /_wall_head$/,
  /_wall_skull$/,
  /^player_head$/,
];

let craftableIdsCache = null;

export function isExcludedId(id) {
  if (EXCLUDE_EXACT.has(id)) return true;
  return EXCLUDE_PATTERNS.some((re) => re.test(id));
}

/** recipes.json 결과물 ID 집합 */
export function getCraftableIds() {
  if (craftableIdsCache) return craftableIdsCache;
  const recipes = JSON.parse(
    readFileSync(resolve(root, "data/recipes.json"), "utf-8")
  );
  craftableIdsCache = new Set(recipes.map((r) => r.id).filter(Boolean));
  return craftableIdsCache;
}

/** 제작 불가지만 카탈로그에 포함할 기본 작물·식물 (참고용) */
export const SUPPLEMENTAL_ITEM_IDS = new Set([
  "carrot",
  "potato",
  "beetroot",
  "beetroot_seeds",
  "sweet_berries",
  "glow_berries",
  "cocoa_beans",
  "nether_wart",
  "apple",
  "chorus_fruit",
  "sugar_cane",
  "bamboo",
  "kelp",
  "pitcher_pod",
  "torchflower_seeds",
  "melon_slice",
]);

export const SUPPLEMENTAL_BLOCK_IDS = new Set([
  "pumpkin",
  "cactus",
  "sugar_cane",
  "bamboo",
  "bee_nest",
  "beehive",
  "composter",
  "moss_block",
  "moss_carpet",
]);

export function isCatalogAllowed(id) {
  if (isExcludedId(id)) return false;
  if (SUPPLEMENTAL_ITEM_IDS.has(id) || SUPPLEMENTAL_BLOCK_IDS.has(id)) return true;
  return getCraftableIds().has(id);
}

export function filterCatalogEntries(entries) {
  return entries.filter((e) => isCatalogAllowed(e.id));
}
