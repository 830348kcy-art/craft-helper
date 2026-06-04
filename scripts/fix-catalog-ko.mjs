/**
 * 공식 한국어 이름 적용, 설명 정리, 팬텀 ID 제거, 카테고리 리포트 생성
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mcData from "minecraft-data";
import { root } from "./textures-config-root.mjs";
import {
  idToKoName,
  inferBlockCategory,
  inferItemCategory,
  pickEmoji,
  blockDescription,
  itemDescription,
} from "./ko-utils.mjs";
import { filterCatalogEntries } from "./catalog-filter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const officialKo = JSON.parse(
  readFileSync(resolve(__dirname, "ko-lang-official.json"), "utf-8")
);

const PHANTOM_COPPER_IDS = new Set([
  "exposed_bars", "exposed_bulb", "exposed_chain", "exposed_door", "exposed_grate",
  "exposed_lantern", "exposed_trapdoor",
  "weathered_bars", "weathered_bulb", "weathered_chain", "weathered_door",
  "weathered_grate", "weathered_lantern", "weathered_trapdoor",
  "oxidized_bars", "oxidized_bulb", "oxidized_chain", "oxidized_door",
  "oxidized_grate", "oxidized_lantern", "oxidized_trapdoor",
]);

const ID_ALIASES = {
  sword_diamond: "diamond_sword",
  sword_iron: "iron_sword",
  sword_netherite: "netherite_sword",
  pickaxe_diamond: "diamond_pickaxe",
  pickaxe_iron: "iron_pickaxe",
  axe_diamond: "diamond_axe",
  shovel_diamond: "diamond_shovel",
  hoe_diamond: "diamond_hoe",
  dragon_egg_item: "dragon_egg",
  eye_of_ender: "ender_eye",
  totem: "totem_of_undying",
  nether_quartz: "quartz",
};

function resolveKoName(id) {
  const lookup = ID_ALIASES[id] ?? id;
  if (officialKo.blocks?.[lookup]) return officialKo.blocks[lookup];
  if (officialKo.items?.[lookup]) return officialKo.items[lookup];
  if (id.endsWith("_spawn_egg")) {
    const mob = id.slice(0, -10);
    const mobKey = `${mob}_spawn_egg`;
    if (officialKo.items?.[mobKey]) return officialKo.items[mobKey];
  }
  return idToKoName(id);
}

function loadVanillaIds() {
  const data = mcData("1.21.4");
  const blocks = new Set(Object.keys(data.blocksByName ?? {}).filter((k) => !k.includes(":")));
  const items = new Set(Object.keys(data.itemsByName ?? {}).filter((k) => !k.includes(":")));
  return { blocks, items };
}

function fixEntry(entry, type, originalIds) {
  const id = entry.id;
  const name = resolveKoName(id);
  const category =
    type === "block"
      ? entry.category ?? inferBlockCategory(id)
      : inferItemCategory(id);

  const fixed = {
    ...entry,
    name,
    description:
      type === "block"
        ? blockDescription(id, name)
        : itemDescription(id, name),
    category,
    tags: [category],
    emoji: pickEmoji(type, id),
  };

  if (/^waxed_/.test(id)) {
    fixed.category = type === "block" ? inferBlockCategory(id) : "재료";
    fixed.emoji = pickEmoji(type, id);
  }

  return fixed;
}

const vanilla = loadVanillaIds();
let blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
let items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));

const removedPhantoms = blocks.filter((b) => PHANTOM_COPPER_IDS.has(b.id)).map((b) => b.id);
blocks = blocks.filter((b) => !PHANTOM_COPPER_IDS.has(b.id));

blocks = blocks.map((b) => fixEntry(b, "block", vanilla.blocks));
items = items.map((i) => fixEntry(i, "item", vanilla.items));

const beforeBlocks = blocks.length;
const beforeItems = items.length;
blocks = filterCatalogEntries(blocks);
items = filterCatalogEntries(items);

writeFileSync(resolve(root, "data/blocks.json"), JSON.stringify(blocks, null, 2) + "\n", "utf-8");
writeFileSync(resolve(root, "data/items.json"), JSON.stringify(items, null, 2) + "\n", "utf-8");

// 카테고리 리포트
const report = { blocks: {}, items: {} };
for (const type of ["blocks", "items"]) {
  const data = type === "blocks" ? blocks : items;
  const orig = type === "blocks" ? vanilla.blocks : vanilla.items;
  for (const entry of data) {
    const cat = entry.category ?? "기타";
    const src = orig.has(entry.id) ? "바닐라(기존)" : "추가";
    if (!report[type][cat]) report[type][cat] = { "바닐라(기존)": [], 추가: [] };
    report[type][cat][src].push(`${entry.name} (${entry.id})`);
  }
}

let reportText = `# Craft Helper 카탈로그 분류 리포트\n생성: ${new Date().toISOString()}\n\n`;
reportText += `팬텀 구리 블록 ID ${removedPhantoms.length}개 제거됨\n`;
reportText += `제작 가능 필터: 블록 ${beforeBlocks} → ${blocks.length}, 아이템 ${beforeItems} → ${items.length}\n\n`;

for (const type of ["blocks", "items"]) {
  const label = type === "blocks" ? "블록" : "아이템";
  reportText += `## ${label}\n\n`;
  const cats = Object.keys(report[type]).sort();
  for (const cat of cats) {
    const vanillaList = report[type][cat]["바닐라(기존)"];
    const addedList = report[type][cat]["추가"];
    reportText += `### ${cat} (바닐라 ${vanillaList.length} / 추가 ${addedList.length})\n\n`;
    if (vanillaList.length) {
      reportText += `**바닐라(기존)**\n`;
      for (const line of vanillaList.sort()) reportText += `- ${line}\n`;
      reportText += `\n`;
    }
    if (addedList.length) {
      reportText += `**추가**\n`;
      for (const line of addedList.sort()) reportText += `- ${line}\n`;
      reportText += `\n`;
    }
  }
}

writeFileSync(resolve(__dirname, "catalog-category-report-ko.txt"), reportText, "utf-8");

console.log(`[fix-catalog-ko] blocks ${beforeBlocks} -> ${blocks.length}, items ${beforeItems} -> ${items.length}`);
console.log(`[fix-catalog-ko] removed phantoms: ${removedPhantoms.length}`);
console.log(`→ catalog-category-report-ko.txt`);
