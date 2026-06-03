/**
 * 블록/아이템 ID → CDN 텍스처 경로 해석
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { findAssetPng, loadAssetIndex } from "./asset-index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const textureMap = JSON.parse(
  readFileSync(resolve(__dirname, "texture-map.json"), "utf-8")
);

const ITEM_TEXTURE_PATTERNS = [
  /_boat$/,
  /_chest_boat$/,
  /_spawn_egg$/,
  /_bucket$/,
  /_minecart$/,
  /_horse_armor$/,
  /_door$/,
  /_sign$/,
  /_hanging_sign$/,
  /_banner$/,
  /_bed$/,
  /_candle$/,
  /_dye$/,
  /_disc$/,
  /_music_disc/,
  /_pottery_sherd$/,
  /_smithing_template$/,
  /_armor_trim$/,
  /_bundle$/,
  /_shelf$/,
];

const STRIP_SUFFIXES = [
  "_wall_hanging_sign",
  "_hanging_sign",
  "_wall_sign",
  "_pressure_plate",
  "_fence_gate",
  "_trapdoor",
  "_fence",
  "_button",
  "_stairs",
  "_slab",
  "_wall",
  "_wood",
  "_log",
  "_planks",
  "_leaves",
  "_sapling",
  "_door",
  "_sign",
  "_bed",
  "_banner",
  "_candle",
  "_shulker_box",
  "_concrete_powder",
  "_concrete",
  "_terracotta",
  "_glazed_terracotta",
  "_stained_glass_pane",
  "_stained_glass",
  "_wool",
  "_carpet",
];

const WOODS = new Set([
  "oak",
  "spruce",
  "birch",
  "jungle",
  "acacia",
  "dark_oak",
  "mangrove",
  "cherry",
  "bamboo",
  "crimson",
  "warped",
  "pale_oak",
]);

function blockFileName(id) {
  if (WOODS.has(id)) return `${id}_planks.png`;
  return `${id}.png`;
}

const ITEM_OVERRIDES = {
  sword_diamond: "item/diamond_sword.png",
  sword_netherite: "item/netherite_sword.png",
  sword_iron: "item/iron_sword.png",
  pickaxe_iron: "item/iron_pickaxe.png",
  pickaxe_diamond: "item/diamond_pickaxe.png",
  axe_diamond: "item/diamond_axe.png",
  hoe_diamond: "item/diamond_hoe.png",
  shovel_diamond: "item/diamond_shovel.png",
  nether_quartz: "item/quartz.png",
  eye_of_ender: "item/ender_eye.png",
  totem: "item/totem_of_undying.png",
  boat: "item/oak_boat.png",
  compass: "item/compass_00.png",
  clock: "item/clock_00.png",
  map: "item/map.png",
  grass_block: "block/grass_block_side.png",
  nether_brick: "block/nether_bricks.png",
  magma_block: "block/magma.png",
  hay_bale: "block/hay_block_side.png",
  soul_campfire: "block/soul_campfire_log_lit.png",
  trial_spawner: "block/trial_spawner_side_inactive.png",
  vault: "block/vault_front_off.png",
  crafter: "block/crafter_north.png",
  decorated_pot: "block/decorated_pot_side.png",
  suspicious_sand: "block/suspicious_sand_0.png",
  suspicious_gravel: "block/suspicious_gravel_0.png",
  sniffer_egg: "block/sniffer_egg_not_cracked_top.png",
  dried_ghast: "block/dried_ghast_hydration_0_top.png",
  froglight_ochre: "block/ochre_froglight_side.png",
  froglight_verdant: "block/verdant_froglight_side.png",
  froglight_pearlescent: "block/pearlescent_froglight_side.png",
  bed_red: "block/red_wool.png",
  wool_white: "block/white_wool.png",
  sapling_oak: "block/oak_sapling.png",
  activator_rail: "block/activator_rail.png",
  detector_rail: "block/detector_rail.png",
  powered_rail: "block/powered_rail.png",
  rail: "block/rail.png",
  ladder: "block/ladder.png",
  torch: "block/torch.png",
  soul_torch: "block/soul_torch.png",
  redstone_torch: "block/redstone_torch.png",
  lantern: "block/lantern.png",
  soul_lantern: "block/soul_lantern.png",
  copper_lantern: "block/copper_lantern.png",
  sea_lantern: "block/sea_lantern.png",
  iron_bars: "block/iron_bars.png",
  chain: "block/iron_chain.png",
  copper_bars: "block/copper_bars.png",
  copper_chain: "block/copper_chain.png",
  iron_door: "block/iron_door_bottom.png",
  iron_trapdoor: "block/iron_trapdoor.png",
  copper_door: "block/copper_door_bottom.png",
  copper_trapdoor: "block/copper_trapdoor.png",
  oak_door: "block/oak_door_bottom.png",
  oak_trapdoor: "block/oak_trapdoor.png",
  pointed_dripstone: "block/pointed_dripstone_down_tip.png",
  mangrove_roots: "block/mangrove_roots_side.png",
  dirt_path: "block/dirt_path_top.png",
  azalea_leaves: "block/azalea_leaves.png",
  flowering_azalea_leaves: "block/flowering_azalea_leaves.png",
  bamboo_mosaic: "block/bamboo_mosaic.png",
  chiseled_bookshelf: "block/chiseled_bookshelf_side.png",
  quartz_pillar: "block/quartz_pillar.png",
  purpur_pillar: "block/purpur_pillar.png",
  bone_block: "block/bone_block_side.png",
  honey_block: "block/honey_block_side.png",
  ancient_debris: "block/ancient_debris_side.png",
  sandstone: "block/sandstone_top.png",
  red_sandstone: "block/red_sandstone_top.png",
  quartz_block: "block/quartz_block_side.png",
  raw_iron_block: "block/raw_iron_block.png",
  raw_gold_block: "block/raw_gold_block.png",
  raw_copper_block: "block/raw_copper_block.png",
  reinforced_deepslate: "block/reinforced_deepslate_side.png",
  creaking_heart: "block/creaking_heart.png",
  resin_block: "block/resin_block.png",
  resin_bricks: "block/resin_bricks.png",
  pale_moss_block: "block/pale_moss_block.png",
  open_eyeblossom: "block/open_eyeblossom.png",
  closed_eyeblossom: "block/closed_eyeblossom.png",
  torchflower: "block/torchflower.png",
  heavy_core: "block/heavy_core.png",
  calibrated_sculk_sensor: "block/calibrated_sculk_sensor_top.png",
  sculk_vein: "block/sculk_vein.png",
  sculk_sensor: "block/sculk_sensor_top.png",
  sculk_shrieker: "block/sculk_shrieker_top.png",
  sculk_catalyst: "block/sculk_catalyst_top.png",
  copper_bulb: "block/copper_bulb.png",
  copper_grate: "block/copper_grate.png",
  melon: "block/melon_side.png",
  pumpkin: "block/pumpkin_side.png",
  carved_pumpkin: "block/carved_pumpkin.png",
  cactus: "block/cactus_side.png",
  campfire: "block/campfire_log.png",
  tnt: "block/tnt_side.png",
  chest: "block/oak_planks.png",
  barrel: "block/barrel_top.png",
  furnace: "block/furnace_front.png",
  blast_furnace: "block/blast_furnace_front.png",
  smoker: "block/smoker_front.png",
  crafting_table: "block/crafting_table_front.png",
  enchanting_table: "block/enchanting_table_top.png",
  brewing_stand: "block/brewing_stand.png",
  cauldron: "block/cauldron_side.png",
  hopper: "block/hopper_outside.png",
  dispenser: "block/dispenser_front.png",
  dropper: "block/dropper_front.png",
  observer: "block/observer_front.png",
  piston: "block/piston_top.png",
  sticky_piston: "block/piston_top_sticky.png",
  repeater: "block/repeater.png",
  comparator: "block/comparator.png",
  redstone_lamp: "block/redstone_lamp.png",
  anvil: "block/anvil.png",
  grindstone: "block/grindstone_side.png",
  smithing_table: "block/smithing_table_top.png",
  lectern: "block/lectern_front.png",
  jukebox: "block/jukebox_top.png",
  note_block: "block/note_block.png",
  bookshelf: "block/bookshelf.png",
  composter: "block/composter_side.png",
  beacon: "block/beacon.png",
  conduit: "block/conduit.png",
  respawn_anchor: "block/respawn_anchor_top.png",
  end_rod: "block/end_rod.png",
  dragon_egg: "block/dragon_egg.png",
  spawner: "block/spawner.png",
  glass_pane: "block/glass.png",
  basalt: "block/basalt_side.png",
  polished_basalt: "block/polished_basalt_side.png",
  bamboo_block: "block/bamboo_block.png",
  stripped_bamboo_block: "block/stripped_bamboo_block.png",
};

export function usesItemTexture(id) {
  if (ITEM_OVERRIDES[id]?.startsWith("item/")) return true;
  return ITEM_TEXTURE_PATTERNS.some((re) => re.test(id));
}

export function baseBlockId(id) {
  for (const suffix of STRIP_SUFFIXES) {
    if (id.endsWith(suffix)) return id.slice(0, -suffix.length);
  }
  return id;
}

export function cdnItemPath(id) {
  if (id.endsWith("_spawn_egg")) return "item/spawn_egg.png";
  if (ITEM_OVERRIDES[id]?.startsWith("item/")) return ITEM_OVERRIDES[id];
  return `item/${id}.png`;
}

export function cdnBlockPath(id) {
  if (ITEM_OVERRIDES[id]) return ITEM_OVERRIDES[id];
  if (textureMap[id]) return `block/${textureMap[id]}`;
  if (usesItemTexture(id)) return cdnItemPath(id);

  const base = baseBlockId(id);
  if (base !== id) {
    if (ITEM_OVERRIDES[base]) return ITEM_OVERRIDES[base];
    if (textureMap[base]) return `block/${textureMap[base]}`;
    return `block/${blockFileName(base)}`;
  }
  return `block/${blockFileName(id)}`;
}

export function getSourcePngForBlock(id) {
  if (textureMap[id]) return findAssetPng(id, textureMap[id]);
  const cdn = cdnBlockPath(id);
  if (cdn.startsWith("block/")) {
    const file = cdn.replace(/^block\//, "");
    return findAssetPng(id, file);
  }
  return null;
}

export { textureMap, ITEM_OVERRIDES, loadAssetIndex };
