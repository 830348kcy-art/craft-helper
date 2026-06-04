/**
 * 블록/아이템 ID → CDN 텍스처 경로 후보 (우선순위 순)
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const textureMap = JSON.parse(
  readFileSync(resolve(__dirname, "texture-map.json"), "utf-8")
);

export const CDN =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";

const WOODS = new Set([
  "oak", "spruce", "birch", "jungle", "acacia", "dark_oak",
  "mangrove", "cherry", "bamboo", "crimson", "warped", "pale_oak",
]);

const ITEM_TEXTURE_PATTERNS = [
  /_boat$/, /_chest_boat$/, /_spawn_egg$/, /_bucket$/, /_minecart$/,
  /_horse_armor$/, /_door$/, /_sign$/, /_hanging_sign$/, /_banner$/,
  /_bed$/, /_candle$/, /_dye$/, /_disc$/, /_music_disc/, /_pottery_sherd$/,
  /_smithing_template$/, /_armor_trim$/, /_bundle$/, /_shelf$/,
  /_button$/, /_pressure_plate$/, /_fence_gate$/, /_fence$/, /_stairs$/,
  /_slab$/, /_trapdoor$/, /_sapling$/, /_wood$/, /_planks$/, /_leaves$/,
  /_log$/, /_wall$/, /_anvil$/,
];

const STRIP_SUFFIXES = [
  "_wall_hanging_sign", "_hanging_sign", "_wall_sign", "_pressure_plate",
  "_fence_gate", "_trapdoor", "_fence", "_button", "_stairs", "_slab", "_wall",
  "_wood", "_log", "_planks", "_leaves", "_sapling", "_door", "_sign", "_bed",
  "_banner", "_candle", "_shulker_box", "_concrete_powder", "_concrete",
  "_terracotta", "_glazed_terracotta", "_stained_glass_pane", "_stained_glass",
  "_wool", "_carpet", "_anvil",
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
  coal_ore: "block/coal_ore.png",
  iron_ore: "block/iron_ore.png",
  gold_ore: "block/gold_ore.png",
  diamond_ore: "block/diamond_ore.png",
  emerald_ore: "block/emerald_ore.png",
  lapis_ore: "block/lapis_ore.png",
  redstone_ore: "block/redstone_ore.png",
  copper_ore: "block/copper_ore.png",
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

function blockFileName(id) {
  if (WOODS.has(id)) return `${id}_planks.png`;
  return `${id}.png`;
}

function baseBlockId(id) {
  for (const suffix of STRIP_SUFFIXES) {
    if (id.endsWith(suffix)) return id.slice(0, -suffix.length);
  }
  return id;
}

function usesItemTexture(id) {
  if (ITEM_OVERRIDES[id]?.startsWith("item/")) return true;
  return ITEM_TEXTURE_PATTERNS.some((re) => re.test(id));
}

function add(set, path) {
  if (path && !set.has(path)) set.add(path);
}

/** CDN 상대 경로 후보 목록 (우선순위 순) */
export function getTextureCandidatePaths(id) {
  const paths = new Set();

  if (BLOCK_OVERRIDES[id]) add(paths, BLOCK_OVERRIDES[id]);
  if (ITEM_OVERRIDES[id]) add(paths, ITEM_OVERRIDES[id]);

  if (id.endsWith("_spawn_egg")) {
    add(paths, "item/spawn_egg.png");
  }

  if (textureMap[id]) add(paths, `block/${textureMap[id]}`);

  // item/ 인벤토리 아이콘
  if (usesItemTexture(id)) add(paths, `item/${id}.png`);

  // block/ 직접 경로 + 면 변형
  add(paths, `block/${id}.png`);
  for (const suf of ["_side", "_top", "_front", "_bottom", "_planks"]) {
    add(paths, `block/${id}${suf}.png`);
  }

  // anvil 변형
  if (id.endsWith("_anvil") && id !== "anvil") {
    add(paths, `block/${id}_top.png`);
    add(paths, "block/anvil.png");
  }

  const base = baseBlockId(id);
  if (base !== id) {
    if (BLOCK_OVERRIDES[base]) add(paths, BLOCK_OVERRIDES[base]);
    if (textureMap[base]) add(paths, `block/${textureMap[base]}`);
    add(paths, `block/${blockFileName(base)}`);
    add(paths, `block/${base}_planks.png`);
    add(paths, `block/${base}_log.png`);
    add(paths, `block/${base}_sapling.png`);
  }

  add(paths, `block/${blockFileName(id)}`);
  add(paths, `item/${id}.png`);

  // 색상 접두사 블록 (침대·양탄자·현수막 등)
  const colorMatch = id.match(
    /^(white|orange|magenta|light_blue|yellow|lime|pink|gray|light_gray|cyan|purple|blue|brown|green|red|black)_(.+)$/
  );
  if (colorMatch) {
    const [, color, rest] = colorMatch;
    add(paths, `block/${color}_wool.png`);
    add(paths, `block/${color}_concrete.png`);
    add(paths, `block/${color}_terracotta.png`);
    if (rest.includes("banner")) add(paths, `item/${color}_banner.png`);
    if (rest.includes("bed")) add(paths, `block/${color}_wool.png`);
    if (rest === "carpet") add(paths, `block/${color}_wool.png`);
  }

  // 벽돌·심층암 변형
  if (id.startsWith("brick_")) {
    add(paths, "block/bricks.png");
    add(paths, "block/stone_bricks.png");
  }
  if (id.startsWith("deepslate_brick") || id.startsWith("deepslate_tile")) {
    add(paths, "block/deepslate_bricks.png");
    add(paths, "block/deepslate_tiles.png");
    add(paths, "block/deepslate.png");
  }
  if (id.startsWith("mud_brick")) add(paths, "block/mud_bricks.png");

  // 작물
  if (id === "carrots") add(paths, "block/carrots_stage3.png");
  if (id === "beetroots") add(paths, "block/beetroots_stage3.png");
  if (id === "potatoes") add(paths, "block/potatoes_stage3.png");
  if (id === "wheat") add(paths, "block/wheat_stage7.png");

  // 선반·케이크·공기
  if (id.endsWith("_shelf")) add(paths, "block/chiseled_bookshelf_side.png", "block/bookshelf.png");
  if (id.includes("candle_cake")) add(paths, "block/cake_side.png", "block/candle.png");
  if (id === "air" || id === "cave_air" || id === "void_air") {
    add(paths, "block/barrier.png");
  }
  if (id.includes("coral") && id.includes("fan")) {
    add(paths, "block/tube_coral_block.png", "block/brain_coral_block.png");
  }
  if (id === "bubble_column") add(paths, "block/water_overlay.png");
  if (id === "bamboo_chest_boat") add(paths, "item/bamboo_chest_raft.png", "item/bamboo_raft.png");

  // 벽·반블록·계단 → 기본 블록
  for (const suffix of ["_slab", "_stairs", "_wall"]) {
    if (id.endsWith(suffix)) {
      const base = id.slice(0, -suffix.length);
      add(paths, `block/${base}.png`);
      add(paths, `block/${base}s.png`);
    }
  }
  if (id.includes("end_stone_brick")) add(paths, "block/end_stone_bricks.png", "block/end_stone.png");
  if (id.includes("mossy_stone_brick")) add(paths, "block/mossy_stone_bricks.png");
  if (id.includes("stone_brick")) add(paths, "block/stone_bricks.png");
  if (id.includes("prismarine_brick")) add(paths, "block/prismarine_bricks.png", "block/prismarine.png");
  if (id.includes("polished_blackstone_brick")) add(paths, "block/polished_blackstone_bricks.png");
  if (id.includes("tuff_brick")) add(paths, "block/tuff_bricks.png", "block/tuff.png");
  if (id.includes("resin_brick")) add(paths, "block/resin_bricks.png");
  if (id.includes("quartz")) add(paths, "block/quartz_block_side.png", "block/quartz_block.png");
  if (id.includes("sandstone") && !id.startsWith("smooth")) {
    add(paths, "block/sandstone.png", "block/sandstone_top.png");
  }
  if (id.startsWith("smooth_")) {
    const rest = id.replace(/^smooth_/, "").replace(/_(slab|stairs)$/, "");
    add(paths, `block/smooth_${rest}.png`, `block/${rest}.png`);
  }

  // 구리·왁스 변형
  if (/copper|waxed|exposed_|oxidized_|weathered_/.test(id)) {
    add(paths, "block/copper_block.png", "block/copper_ore.png", "block/copper_bulb.png");
    const bare = id
      .replace(/^waxed_/, "")
      .replace(/^(exposed|oxidized|weathered)_/, "")
      .replace(/_slab|_stairs|_wall|_door|_trapdoor|_grate|_bars|_chain|_lantern|_bulb/g, "");
    add(paths, `block/${bare}.png`);
    add(paths, `block/copper_${bare.split("_").pop()}.png`);
  }

  // infested → 일반 돌
  if (id.startsWith("infested_")) {
    const base = id.replace(/^infested_/, "");
    add(paths, `block/${base}.png`, "block/stone.png", "block/deepslate.png");
  }

  // 화분
  if (id.startsWith("potted_")) {
    const plant = id.replace(/^potted_/, "");
    add(paths, `block/${plant}.png`, `block/${plant}_sapling.png`, "block/flower_pot.png");
  }

  // 머리·해골
  if (/_head$|_skull$|_wall_head$|_wall_skull$/.test(id)) {
    add(paths, "block/skeleton_skull.png", "block/player_head.png");
    const mob = id.replace(/_wall_(head|skull)/, "").replace(/_head|_skull/, "");
    add(paths, `block/${mob}_head.png`);
  }

  // 유체·불
  if (id === "water") add(paths, "block/water_still.png");
  if (id === "lava") add(paths, "block/lava_still.png");
  if (id === "fire") add(paths, "block/fire_0.png");
  if (id === "soul_fire") add(paths, "block/soul_fire_0.png");
  if (id.endsWith("_cauldron")) add(paths, "block/cauldron_side.png", "block/water_cauldron.png");

  // 네더·엔드 특수
  if (id === "crimson_boat") add(paths, "item/crimson_boat.png");
  if (id === "warped_boat") add(paths, "item/warped_boat.png");
  if (id === "crimson_chest_boat") add(paths, "item/crimson_chest_boat.png");
  if (id === "warped_chest_boat") add(paths, "item/warped_chest_boat.png");
  if (id.includes("hyphae")) add(paths, "block/crimson_stem.png", "block/warped_stem.png", "block/nether_wart_block.png");
  if (id.includes("crimson")) add(paths, "block/crimson_planks.png", "block/crimson_stem.png");
  if (id.includes("warped")) add(paths, "block/warped_planks.png", "block/warped_stem.png");
  if (id === "ender_chest") add(paths, "block/obsidian.png", "block/chest.png");
  if (id === "trapped_chest") add(paths, "block/oak_planks.png");
  if (id === "decorated_pot") add(paths, "block/decorated_pot_side.png");
  if (id === "dried_ghast") add(paths, "block/dried_ghast_hydration_0_top.png");
  if (id === "cocoa") add(paths, "block/cocoa_stage2.png", "item/cocoa_beans.png");
  if (id === "sweet_berry_bush") add(paths, "block/sweet_berry_bush_stage3.png");
  if (id === "redstone_wire") add(paths, "block/redstone_dust_dot.png", "item/redstone.png");
  if (id.includes("torch") && id.includes("wall")) add(paths, "block/torch.png", "block/redstone_torch.png", "block/soul_torch.png");
  if (id.includes("weighted_pressure")) add(paths, "block/iron_block.png", "block/gold_block.png");

  // 아이템 ID 불일치
  const ITEM_FALLBACKS = {
    crossbow: "item/crossbow.png",
    shield: "item/shield.png",
    recovery_compass: "item/recovery_compass_00.png",
    enchanted_golden_apple: "item/enchanted_golden_apple.png",
    debug_stick: "item/stick.png",
    dragon_egg_item: "block/dragon_egg.png",
    tipped_arrow: "item/arrow.png",
    netherite_horse_armor: "item/diamond_horse_armor.png",
    spawn_egg_creeper: "item/spawn_egg.png",
    stone_boots: "item/iron_boots.png",
    stone_chestplate: "item/iron_chestplate.png",
    stone_helmet: "item/iron_helmet.png",
    stone_leggings: "item/iron_leggings.png",
    stone_horse_armor: "item/iron_horse_armor.png",
    wooden_boots: "item/leather_boots.png",
    wooden_chestplate: "item/leather_chestplate.png",
    wooden_helmet: "item/leather_helmet.png",
    wooden_leggings: "item/leather_leggings.png",
    wooden_horse_armor: "item/leather_horse_armor.png",
  };
  if (ITEM_FALLBACKS[id]) add(paths, ITEM_FALLBACKS[id]);

  return [...paths];
}

export function getTextureCandidateUrls(id) {
  return getTextureCandidatePaths(id).map((p) => `${CDN}/${p}`);
}
