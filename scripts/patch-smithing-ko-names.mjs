/**
 * 대장장이 형판 한글명(XX 형판) 및 레시피 내 영문 재료명 → 한국어 일괄 수정
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { root } from "./textures-config.mjs";
import { idToKoName, pickEmoji } from "./ko-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readJSON(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf-8"));
}

function writeJSON(rel, data) {
  writeFileSync(resolve(root, rel), JSON.stringify(data, null, 2), "utf-8");
}

function titleCaseId(id) {
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** smithing-trims.json + 네더라이트 강화 형판 */
function buildTemplateKoMap() {
  const trims = readJSON("data/smithing-trims.json").trims ?? [];
  const map = new Map();
  for (const t of trims) {
    map.set(t.templateId, `${t.name} 형판`);
  }
  map.set("netherite_upgrade_smithing_template", "네더라이트 강화 형판");
  return map;
}

function buildEngToKo(blocks, items, templateKo, officialKo) {
  const engToKo = new Map();

  function add(id, koName) {
    if (!koName || !id) return;
    engToKo.set(titleCaseId(id), koName);
    const itemNew = officialKo.items?.[`${id}.new`];
    const blockNew = officialKo.blocks?.[`${id}.new`];
    if (itemNew) engToKo.set(itemNew, koName);
    if (blockNew) engToKo.set(blockNew, koName);
  }

  for (const b of blocks) add(b.id, b.name);
  for (const i of items) add(i.id, i.name);
  for (const [id, ko] of templateKo) add(id, ko);

  for (const [id, ko] of Object.entries(officialKo.blocks ?? {})) {
    if (id.endsWith(".new")) continue;
    engToKo.set(titleCaseId(id), ko);
  }
  for (const [id, ko] of Object.entries(officialKo.items ?? {})) {
    if (id.endsWith(".new")) continue;
    engToKo.set(titleCaseId(id), ko);
  }

  // 레시피에만 등장하는 표기
  engToKo.set("Terracotta", "테라코타");
  engToKo.set("Sandstone", "사암");

  return engToKo;
}

function replaceEnglish(text, engToKo) {
  if (!text || !/[A-Za-z]/.test(text)) return text;
  let out = text;
  const pairs = [...engToKo.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [eng, ko] of pairs) {
    if (eng && out.includes(eng)) out = out.split(eng).join(ko);
  }
  return out;
}

function patchItems(items, templateKo, trims) {
  const trimByTemplate = new Map(trims.map((t) => [t.templateId, t]));
  let n = 0;
  for (const item of items) {
    const ko = templateKo.get(item.id);
    if (!ko) continue;
    const trim = trimByTemplate.get(item.id);
    item.name = ko;
    item.description = trim
      ? `${ko}. ${trim.description}`
      : `${ko}. 대장장이 테이블에서 네더라이트 강화에 사용하는 형판입니다.`;
    n++;
  }
  return n;
}

function patchRecipes(recipes, nameById, engToKo) {
  let n = 0;
  for (const recipe of recipes) {
    const koName = nameById.get(recipe.id) ?? idToKoName(recipe.id);
    const hadEnglish =
      /[A-Za-z]/.test(recipe.name) ||
      /[A-Za-z]/.test(recipe.resultItem ?? "") ||
      recipe.grid?.some((row) => row.some((c) => /[A-Za-z]/.test(c))) ||
      recipe.ingredients?.some((i) => /[A-Za-z]/.test(i));

    if (recipe.name !== koName) {
      engToKo.set(recipe.name, koName);
    }

    recipe.name = koName;
    recipe.resultItem = koName;
    if (/[A-Za-z]/.test(recipe.emoji ?? "") || recipe.emoji === "⚔️") {
      recipe.emoji = pickEmoji(
        blocks.some((b) => b.id === recipe.id) ? "block" : "item",
        recipe.id
      );
    }
    recipe.grid = recipe.grid.map((row) =>
      row.map((cell) => replaceEnglish(cell, engToKo))
    );
    recipe.ingredients = recipe.ingredients.map((ing) =>
      replaceEnglish(ing, engToKo)
    );
    recipe.description = `${koName} 제작법. ${recipe.ingredients.join(", ")}.`;

    if (hadEnglish) n++;
  }
  return n;
}

const templateKo = buildTemplateKoMap();
const trims = readJSON("data/smithing-trims.json").trims ?? [];
const blocks = readJSON("data/blocks.json");
const items = readJSON("data/items.json");
const recipes = readJSON("data/recipes.json");
const officialKo = JSON.parse(
  readFileSync(resolve(__dirname, "ko-lang-official.json"), "utf-8")
);

const nameById = new Map([
  ...blocks.map((b) => [b.id, b.name]),
  ...items.map((i) => [i.id, i.name]),
]);
for (const [id, ko] of templateKo) nameById.set(id, ko);

const engToKo = buildEngToKo(blocks, items, templateKo, officialKo);

const itemsPatched = patchItems(items, templateKo, trims);
const recipesPatched = patchRecipes(recipes, nameById, engToKo);

writeJSON("data/items.json", items);
writeJSON("data/recipes.json", recipes);

console.log(
  `patch-smithing-ko-names: ${itemsPatched} items, ${recipesPatched} recipes updated`
);
