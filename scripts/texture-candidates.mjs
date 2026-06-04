/**
 * 블록/아이템 ID → CDN / Wiki 스프라이트 URL 후보 (우선순위 순)
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { ID_OVERRIDES, getPatternOverride } from "./texture-id-overrides.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const textureMap = JSON.parse(
  readFileSync(resolve(__dirname, "texture-map.json"), "utf-8")
);

export const CDN =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";

export const WIKI_SPRITE_BASE = "https://minecraft.wiki/images/BlockSprite";

const COLORS =
  "white|orange|magenta|light_blue|yellow|lime|pink|gray|light_gray|cyan|purple|blue|brown|green|red|black";

const WOODS = new Set([
  "oak", "spruce", "birch", "jungle", "acacia", "dark_oak",
  "mangrove", "cherry", "bamboo", "crimson", "warped", "pale_oak",
]);

/** 형태가 중요한 블록 — Wiki 인벤 스프라이트 우선 */
const SHAPE_PATTERNS = [
  /_stairs$/, /_slab$/, /_wall$/, /_fence_gate$/, /_fence$/,
  /_button$/, /_pressure_plate$/, /_trapdoor$/,
];

/** baseBlockId에서만 쓸 접미사 (색상 재료는 제외) */
const SHAPE_STRIP_SUFFIXES = [
  "_wall_hanging_sign", "_hanging_sign", "_wall_sign",
  "_pressure_plate", "_fence_gate", "_trapdoor", "_fence", "_button",
  "_stairs", "_slab", "_wall",
  "_wood", "_log", "_leaves", "_sapling", "_door", "_sign", "_bed",
  "_banner", "_candle", "_shulker_box", "_anvil",
];

const ITEM_TEXTURE_PATTERNS = [
  /_boat$/, /_chest_boat$/, /_spawn_egg$/, /_bucket$/, /_minecart$/,
  /_horse_armor$/, /_door$/, /_sign$/, /_hanging_sign$/, /_banner$/,
  /_bed$/, /_candle$/, /_dye$/, /_disc$/, /_music_disc/, /_pottery_sherd$/,
  /_smithing_template$/, /_armor_trim$/, /_bundle$/, /_shelf$/,
];

const BLOCK_OVERRIDES = {
  grass_block: "block/grass_block_side.png",
  podzol: "block/podzol_side.png",
  mycelium: "block/mycelium_side.png",
  oak_log: "block/oak_log.png",
  birch_log: "block/birch_log.png",
  spruce_log: "block/spruce_log.png",
  jungle_log: "block/jungle_log.png",
  acacia_log: "block/acacia_log.png",
  dark_oak_log: "block/dark_oak_log.png",
  mangrove_log: "block/mangrove_log.png",
  cherry_log: "block/cherry_log.png",
  bamboo_block: "block/bamboo_block.png",
  furnace: "block/furnace_front.png",
  blast_furnace: "block/blast_furnace_front.png",
  smoker: "block/smoker_front.png",
  crafting_table: "block/crafting_table_front.png",
  enchanting_table: "block/enchanting_table_top.png",
  chest: "block/oak_planks.png",
  barrel: "block/barrel_top.png",
  anvil: "block/anvil.png",
  chipped_anvil: "block/chipped_anvil_top.png",
  damaged_anvil: "block/damaged_anvil_top.png",
  stone: "block/stone.png",
  cobblestone: "block/cobblestone.png",
  oak_planks: "block/oak_planks.png",
  cherry_planks: "block/cherry_planks.png",
  cherry_trapdoor: "block/cherry_trapdoor.png",
  cherry_sapling: "block/cherry_sapling.png",
  cherry_leaves: "block/cherry_leaves.png",
  cherry_door: "item/cherry_door.png",
  obsidian: "block/obsidian.png",
  netherrack: "block/netherrack.png",
  end_stone: "block/end_stone.png",
  glowstone: "block/glowstone.png",
  glass: "block/glass.png",
  dirt: "block/dirt.png",
  torch: "block/torch.png",
  spawner: "block/spawner.png",
};

const ITEM_OVERRIDES = {
  sword_diamond: "item/diamond_sword.png",
  sword_netherite: "item/netherite_sword.png",
  sword_iron: "item/iron_sword.png",
  pickaxe_iron: "item/iron_pickaxe.png",
  pickaxe_diamond: "item/diamond_pickaxe.png",
  axe_diamond: "item/diamond_axe.png",
  shovel_diamond: "item/diamond_shovel.png",
  hoe_diamond: "item/diamond_hoe.png",
  nether_quartz: "item/quartz.png",
  eye_of_ender: "item/ender_eye.png",
  totem: "item/totem_of_undying.png",
  boat: "item/oak_boat.png",
  compass: "item/compass_00.png",
  clock: "item/clock_00.png",
  map: "item/map.png",
  bamboo_boat: "item/bamboo_raft.png",
};

export function idToWikiSlug(id) {
  return id.replace(/_/g, "-");
}

export function getWikiSpriteUrl(id) {
  return `${WIKI_SPRITE_BASE}_${idToWikiSlug(id)}.png?format=original`;
}

export function isShapeBlock(id) {
  return SHAPE_PATTERNS.some((re) => re.test(id));
}

export function isColorMaterial(id) {
  return (
    new RegExp(`^(${COLORS})_(wool|terracotta|concrete|concrete_powder|carpet|stained_glass|stained_glass_pane|glazed_terracotta|bed|banner)$`).test(id) ||
    new RegExp(`^(${COLORS})_(wall_banner|wall_.*)$`).test(id)
  );
}

function blockFileName(id) {
  if (WOODS.has(id)) return `${id}_planks.png`;
  return `${id}.png`;
}

function shapeBaseId(id) {
  for (const suffix of SHAPE_STRIP_SUFFIXES) {
    if (id.endsWith(suffix)) return id.slice(0, -suffix.length);
  }
  return id;
}

function usesItemTexture(id) {
  if (ITEM_OVERRIDES[id]?.startsWith("item/")) return true;
  return ITEM_TEXTURE_PATTERNS.some((re) => re.test(id));
}

function unwaxCopperId(id) {
  return id.replace(/^waxed_/, "");
}

/** 구리 계열: 밀랍은 동일 단계 비밀랍 텍스처 사용 */
function addCopperTexturePaths(id, add) {
  if (!/copper|waxed_|exposed_|oxidized_|weathered_/.test(id)) return;

  const base = unwaxCopperId(id);

  if (base.endsWith("_copper_door") || base === "copper_door") {
    add(`item/${base}.png`);
    add(`block/${base}_bottom.png`);
    if (base !== "copper_door") add("item/copper_door.png");
    return;
  }

  if (base.endsWith("_copper_trapdoor") || base === "copper_trapdoor") {
    add(`block/${base}.png`);
    return;
  }

  add(`block/${base}.png`);
}

function add(set, value) {
  if (value && !set.has(value)) set.add(value);
}

/** CDN 상대 경로 또는 Wiki 전체 URL 후보 (우선순위 순) */
export function getTextureCandidatePaths(id) {
  const paths = new Set();

  if (ID_OVERRIDES[id]) add(paths, ID_OVERRIDES[id]);
  const pattern = getPatternOverride(id);
  if (pattern) add(paths, pattern);

  addCopperTexturePaths(id, (p) => add(paths, p));

  if (id.startsWith("waxed_") && isShapeBlock(id)) {
    add(paths, `wiki:${unwaxCopperId(id)}`);
  }

  if (BLOCK_OVERRIDES[id]) add(paths, BLOCK_OVERRIDES[id]);
  if (ITEM_OVERRIDES[id]) add(paths, ITEM_OVERRIDES[id]);

  if (id.endsWith("_spawn_egg")) add(paths, "item/spawn_egg.png");

  // 형태 블록: Wiki 인벤 스프라이트 (계단·반블록 옆면)
  if (isShapeBlock(id)) add(paths, `wiki:${id}`);

  // 색상/재료 블록: 정확한 block/{id}.png 최우선
  add(paths, `block/${id}.png`);
  if (isColorMaterial(id)) {
    add(paths, `wiki:${id}`);
    for (const suf of ["_top", "_side"]) {
      add(paths, `block/${id}${suf}.png`);
    }
  }

  if (textureMap[id]) add(paths, `block/${textureMap[id]}`);

  if (usesItemTexture(id)) add(paths, `item/${id}.png`);

  for (const suf of ["_side", "_top", "_front", "_bottom"]) {
    add(paths, `block/${id}${suf}.png`);
  }

  if (id.endsWith("_anvil") && id !== "anvil") {
    add(paths, `block/${id}_top.png`);
    add(paths, "block/anvil.png");
  }

  // 형태 블록: CDN item 시도 후 Wiki는 이미 앞에 있음
  if (isShapeBlock(id)) add(paths, `item/${id}.png`);

  const base = shapeBaseId(id);
  if (base !== id && isShapeBlock(id)) {
    add(paths, `wiki:${base}`);
    if (BLOCK_OVERRIDES[base]) add(paths, BLOCK_OVERRIDES[base]);
    if (textureMap[base]) add(paths, `block/${textureMap[base]}`);
    add(paths, `block/${blockFileName(base)}`);
    add(paths, `block/${base}_planks.png`);
  }

  add(paths, `item/${id}.png`);

  // 색상 접두사 (침대·양탄자 등)
  const colorMatch = id.match(new RegExp(`^(${COLORS})_(.+)$`));
  if (colorMatch) {
    const [, color, rest] = colorMatch;
    add(paths, `block/${id}.png`);
    add(paths, `block/${color}_${rest}.png`);
    if (rest.includes("terracotta")) add(paths, `block/${color}_terracotta.png`);
    if (rest.includes("wool") || rest === "carpet") add(paths, `block/${color}_wool.png`);
    if (rest.includes("concrete")) add(paths, `block/${color}_concrete.png`);
    if (rest.includes("banner")) add(paths, `item/${color}_banner.png`);
    add(paths, `wiki:${id}`);
  }

  // 벽돌·계단 계열 보조
  if (id.includes("stone_brick")) add(paths, "block/stone_bricks.png");
  if (id.includes("end_stone_brick")) add(paths, "block/end_stone_bricks.png");
  if (id.includes("mossy_stone_brick")) add(paths, "block/mossy_stone_bricks.png");
  if (id.includes("deepslate_brick")) add(paths, "block/deepslate_bricks.png");
  if (id.includes("prismarine_brick")) add(paths, "block/prismarine_bricks.png");
  if (id.includes("mud_brick")) add(paths, "block/mud_bricks.png");
  if (id.includes("tuff_brick")) add(paths, "block/tuff_bricks.png");
  if (id.includes("resin_brick")) add(paths, "block/resin_bricks.png");
  if (id.includes("quartz")) add(paths, "block/quartz_block_side.png");
  if (id.startsWith("smooth_")) {
    const rest = id.replace(/^smooth_/, "").replace(/_(slab|stairs)$/, "");
    add(paths, `block/smooth_${rest}.png`);
  }

  if (id.startsWith("infested_")) {
    add(paths, `block/${id.replace(/^infested_/, "")}.png`, "block/stone.png");
  }

  if (id.startsWith("potted_")) {
    const plant = id.replace(/^potted_/, "");
    add(paths, `block/${plant}.png`, `block/${plant}_sapling.png`, "block/flower_pot.png", `wiki:${id}`);
  }

  if (/_head$|_skull$|_wall_head$|_wall_skull$/.test(id)) {
    add(paths, "item/bone.png", "item/spawn_egg.png");
  }

  if (id === "water") add(paths, "block/water_still.png");
  if (id === "lava") add(paths, "block/lava_still.png");
  if (id === "fire") add(paths, "block/fire_0.png");
  if (id === "soul_fire") add(paths, "block/soul_fire_0.png");

  const ITEM_FALLBACKS = {
    crossbow: "item/bow.png",
    shield: "item/iron_chestplate.png",
    enchanted_golden_apple: "item/golden_apple.png",
    debug_stick: "item/stick.png",
    dragon_egg_item: "block/dragon_egg.png",
    tipped_arrow: "item/arrow.png",
    netherite_horse_armor: "item/diamond_horse_armor.png",
    spawn_egg_creeper: "item/spawn_egg.png",
  };
  if (ITEM_FALLBACKS[id]) add(paths, ITEM_FALLBACKS[id]);

  return [...paths];
}

export function resolveCandidateUrl(entry) {
  if (entry.startsWith("wiki:")) {
    return getWikiSpriteUrl(entry.slice(5));
  }
  return `${CDN}/${entry}`;
}

export function getTextureCandidateUrls(id) {
  return getTextureCandidatePaths(id).map(resolveCandidateUrl);
}
