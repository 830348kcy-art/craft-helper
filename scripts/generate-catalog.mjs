/**
 * blocks.json / items.json 확장 — minecraft-data + 기존 항목 merge
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import mcData from "minecraft-data";
import { root } from "./textures-config.mjs";
import {
  idToKoName,
  inferBlockCategory,
  inferItemCategory,
  pickEmoji,
  blockDescription,
  itemDescription,
  inferTool,
  inferHardness,
  koNames,
} from "./ko-utils.mjs";

const data = mcData("1.21.4");

const existingBlocks = JSON.parse(
  readFileSync(resolve(root, "data/blocks.json"), "utf-8")
);
const existingItems = JSON.parse(
  readFileSync(resolve(root, "data/items.json"), "utf-8")
);

const blockMap = new Map(existingBlocks.map((b) => [b.id, b]));
const itemMap = new Map(existingItems.map((i) => [i.id, i]));

/** minecraft-data 블록 이름 목록에서 카탈로그 대상 추출 */
function collectBlockIds() {
  const ids = new Set(blockMap.keys());

  // blocksByName keys are block names like "grass_block"
  for (const name of Object.keys(data.blocksByName ?? {})) {
    if (name.includes(":")) continue; // skip mod ids
    ids.add(name);
  }

  // texture-map + assets 기반 추가 ID (1.21)
  const extras = [
    "pale_oak_log", "pale_oak_planks", "pale_oak_leaves", "pale_oak_door",
    "pale_oak_trapdoor", "pale_oak_sapling", "pale_oak_shelf",
    "creaking_heart", "resin_block", "resin_bricks", "resin_clump",
    "open_eyeblossom", "closed_eyeblossom", "torchflower",
    "heavy_core", "calibrated_sculk_sensor", "sculk_vein",
    "copper_bulb", "copper_grate", "copper_door", "copper_trapdoor",
    "copper_lantern", "copper_bars", "copper_chain", "copper_torch",
    "exposed_copper", "weathered_copper", "oxidized_copper",
    "cut_copper", "chiseled_copper", "waxed_copper_block",
    "trial_spawner", "vault", "crafter", "decorated_pot",
    "suspicious_sand", "suspicious_gravel", "sniffer_egg",
    "frogspawn", "dried_ghast", "leaf_litter", "wildflowers",
    "firefly_bush", "short_dry_grass", "tall_dry_grass",
    "pale_moss_block", "pale_moss_carpet", "pale_hanging_moss",
    "pink_petals", "mangrove_propagule", "muddy_mangrove_roots",
    "froglight_ochre", "froglight_verdant", "froglight_pearlescent",
    "chiseled_bookshelf", "bamboo_mosaic", "bamboo_shelf",
    "oak_shelf", "spruce_shelf", "birch_shelf", "jungle_shelf",
    "acacia_shelf", "dark_oak_shelf", "mangrove_shelf", "cherry_shelf",
    "crimson_shelf", "warped_shelf", "pale_oak_shelf",
  ];
  extras.forEach((id) => ids.add(id));

  // colored blocks from patterns
  const colors = ["white","orange","magenta","light_blue","yellow","lime","pink","gray","light_gray","cyan","purple","blue","brown","green","red","black"];
  const materials = ["wool","carpet","concrete","concrete_powder","terracotta","glazed_terracotta","stained_glass","stained_glass_pane","candle","shulker_box","bed","banner"];
  for (const c of colors) {
    for (const m of materials) {
      ids.add(`${c}_${m}`);
    }
  }

  // wood variants
  const woods = ["oak","spruce","birch","jungle","acacia","dark_oak","mangrove","cherry","bamboo","crimson","warped","pale_oak"];
  const parts = ["planks","log","wood","door","trapdoor","fence","fence_gate","stairs","slab","button","pressure_plate","sign","hanging_sign","boat","chest_boat","sapling","leaves","shelf"];
  for (const w of woods) {
    for (const p of parts) {
      ids.add(`${w}_${p}`);
      if (p === "log" || p === "wood") ids.add(`stripped_${w}_${p}`);
    }
  }

  // copper variants
  const copperStages = ["copper","exposed_copper","weathered_copper","oxidized_copper"];
  const copperParts = ["block","bulb","grate","door","trapdoor","lantern","bars","chain","cut","chiseled","trapdoor"];
  for (const s of copperStages) {
    ids.add(s === "copper" ? "copper_block" : s);
    for (const p of ["bulb","grate","door","trapdoor","lantern","bars","chain"]) {
      ids.add(`${s}_${p}`.replace("copper_", s === "copper" ? "copper_" : ""));
    }
  }

  return [...ids].sort();
}

function collectItemIds() {
  const ids = new Set(itemMap.keys());

  for (const name of Object.keys(data.itemsByName ?? {})) {
    if (name.includes(":")) continue;
    ids.add(name);
  }

  // tools, weapons, armor tiers
  const tiers = ["wooden","stone","iron","golden","diamond","netherite"];
  const tools = ["pickaxe","axe","shovel","hoe","sword"];
  for (const t of tiers) {
    for (const tool of tools) {
      ids.add(`${t}_${tool}`);
    }
  }

  const armor = ["helmet","chestplate","leggings","boots","horse_armor"];
  for (const t of tiers) {
    for (const a of armor) {
      ids.add(`${t}_${a}`);
    }
  }

  // boats per wood
  const woods = ["oak","spruce","birch","jungle","acacia","dark_oak","mangrove","cherry","bamboo","pale_oak"];
  for (const w of woods) ids.add(`${w}_boat`);

  // dyes
  const colors = ["white","orange","magenta","light_blue","yellow","lime","pink","gray","light_gray","cyan","purple","blue","brown","green","red","black"];
  for (const c of colors) ids.add(`${c}_dye`);

  // spawn eggs (common)
  const mobs = ["creeper","zombie","skeleton","spider","enderman","pig","cow","sheep","chicken","villager","iron_golem","wolf","cat","bee","axolotl","allay","warden","piglin","blaze","ghast","slime","magma_cube","drowned","husk","stray","phantom","evoker","vindicator","pillager","ravager","witch","guardian","elder_guardian","shulker","endermite","silverfish","bat","squid","glow_squid","dolphin","turtle","fox","panda","polar_bear","llama","trader_llama","mooshroom","horse","donkey","mule","rabbit","parrot","ocelot","goat","frog","tadpole","camel","sniffer","bogged","breeze","creaking"];
  for (const m of mobs) ids.add(`${m}_spawn_egg`);

  return [...ids].sort();
}

function hasKorean(text) {
  return /[가-힣]/.test(text ?? "");
}

function makeBlock(id) {
  const existing = blockMap.get(id);
  const name = koNames[id] ?? idToKoName(id);
  if (existing && hasKorean(existing.name)) return existing;

  const base = existing ?? {};
  return {
    id,
    name,
    emoji: base.emoji ?? pickEmoji("block", id),
    image: `/images/blocks/${id}.png`,
    category: base.category ?? inferBlockCategory(id),
    description: base.description ?? blockDescription(id, name),
    tags: base.tags ?? [inferBlockCategory(id)],
    tool: base.tool ?? inferTool(id),
    hardness: base.hardness ?? inferHardness(id),
  };
}

function makeItem(id) {
  const existing = itemMap.get(id);
  const name = koNames[id] ?? idToKoName(id);
  if (existing && hasKorean(existing.name)) return existing;

  const base = existing ?? {};
  return {
    id,
    name,
    emoji: base.emoji ?? pickEmoji("item", id),
    image: base.image ?? `/images/items/${id}.png`,
    category: base.category ?? inferItemCategory(id),
    description: base.description ?? itemDescription(id, name),
    tags: base.tags ?? [inferItemCategory(id)],
    stackSize:
      base.stackSize ??
      (/spawn_egg|music_disc|written_book|enchanted_book|potion|totem|shield|elytra|bucket/.test(id)
        ? 1
        : 64),
  };
}

const blockIds = collectBlockIds();
const itemIds = collectItemIds();

const blocks = blockIds.map(makeBlock);
const items = itemIds.map(makeItem);

writeFileSync(resolve(root, "data/blocks.json"), JSON.stringify(blocks, null, 2), "utf-8");
writeFileSync(resolve(root, "data/items.json"), JSON.stringify(items, null, 2), "utf-8");

console.log(
  `generate-catalog: blocks ${existingBlocks.length} -> ${blocks.length}, items ${existingItems.length} -> ${items.length}`
);
