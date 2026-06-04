/**
 * ID별 최우선 텍스처 경로 (CDN 상대 경로)
 */
export const ID_OVERRIDES = {
  bamboo_log: "block/bamboo_block.png",
  bamboo_wood: "block/bamboo_block.png",
  bamboo_chest_boat: "item/bamboo_chest_raft.png",
  crimson_boat: "block/crimson_planks.png",
  warped_boat: "block/warped_planks.png",
  crimson_chest_boat: "block/crimson_planks.png",
  warped_chest_boat: "block/warped_planks.png",
  crimson_log: "block/crimson_stem.png",
  warped_log: "block/warped_stem.png",
  crimson_leaves: "block/nether_wart_block.png",
  warped_leaves: "block/warped_wart_block.png",
  crimson_sapling: "block/nether_sprouts.png",
  warped_sapling: "block/warped_fungus.png",
  wall_torch: "block/torch.png",
  soul_wall_torch: "block/soul_torch.png",
  redstone_wall_torch: "block/redstone_torch.png",
  redstone_wire: "block/redstone_dust_dot.png",
  candle_cake: "block/cake_side.png",
  recovery_compass: "item/recovery_compass_00.png",
  crossbow: "item/bow.png",
  shield: "item/iron_chestplate.png",
  enchanted_golden_apple: "item/golden_apple.png",
  crimson_wood: "block/crimson_stem.png",
  warped_wood: "block/warped_stem.png",
  stripped_crimson_log: "block/stripped_crimson_stem.png",
  stripped_warped_log: "block/stripped_warped_stem.png",
  stripped_crimson_wood: "block/stripped_crimson_stem.png",
  stripped_warped_wood: "block/stripped_warped_stem.png",
  mangrove_sapling: "block/mangrove_propagule.png",
  petrified_oak_slab: "wiki:oak_slab",
};

const WOOD_SPECIES = [
  "oak", "spruce", "birch", "jungle", "acacia", "dark_oak",
  "mangrove", "cherry", "pale_oak", "bamboo", "crimson", "warped",
];

/** wood/log/stripped 변형 자동 매핑 */
export function getPatternOverride(id) {
  if (ID_OVERRIDES[id]) return ID_OVERRIDES[id];

  for (const s of WOOD_SPECIES) {
    if (id === `${s}_wood`) return `block/stripped_${s}_log.png`;
    if (id === `stripped_${s}_wood`) return `block/stripped_${s}_log.png`;
    if (id === `${s}_log`) {
      if (s === "bamboo") return "block/bamboo_block.png";
      if (s === "crimson" || s === "warped") return `block/${s}_stem.png`;
      return `block/${s}_log.png`;
    }
    if (id === `stripped_${s}_log`) return `block/stripped_${s}_log.png`;
  }

  if (id.endsWith("_shelf")) return "block/chiseled_bookshelf_side.png";

  if (id.includes("candle_cake")) return "block/cake_side.png";

  if (id.includes("coral") && id.includes("fan")) {
    return "block/tube_coral_block.png";
  }

  if (id.startsWith("stone_") && /boots|chestplate|helmet|leggings|horse_armor/.test(id)) {
    return "item/iron_chestplate.png";
  }
  if (id.startsWith("wooden_") && /boots|chestplate|helmet|leggings|horse_armor/.test(id)) {
    return "item/leather_chestplate.png";
  }

  return null;
}
