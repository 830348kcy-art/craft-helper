/**
 * recipes.json 확장 — minecraft-data crafting 레시피 변환
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import mcData from "minecraft-data";
import { root } from "./textures-config.mjs";
import { idToKoName, idToKoIngredient, pickEmoji, inferItemCategory } from "./ko-utils.mjs";

const data = mcData("1.21.4");

const existing = JSON.parse(
  readFileSync(resolve(root, "data/recipes.json"), "utf-8")
);
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));
const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));

const recipeMap = new Map(existing.map((r) => [r.id, r]));
const nameById = new Map([
  ...items.map((i) => [i.id, i.name]),
  ...blocks.map((b) => [b.id, b.name]),
]);

function resolveItemId(ref) {
  if (ref == null) return null;
  if (typeof ref === "string") {
    return ref.includes(":") ? ref.split(":")[1] : ref;
  }
  if (typeof ref === "number") {
    return data.items[ref]?.name ?? null;
  }
  if (typeof ref === "object" && ref.id != null) {
    return resolveItemId(ref.id);
  }
  return null;
}

function koResultName(id) {
  return nameById.get(id) ?? idToKoName(id);
}

function cellToKo(ref) {
  const id = resolveItemId(ref);
  if (!id) return "";
  return koResultName(id);
}

function shapedToGrid(recipe) {
  const grid = [["", "", ""], ["", "", ""], ["", "", ""]];
  const pattern = recipe.inShape;
  if (!Array.isArray(pattern)) return grid;

  for (let r = 0; r < pattern.length && r < 3; r++) {
    const row = pattern[r];
    if (!Array.isArray(row)) continue;
    for (let c = 0; c < row.length && c < 3; c++) {
      grid[r][c] = cellToKo(row[c]);
    }
  }
  return grid;
}

function countIngredients(recipe) {
  const counts = new Map();

  function add(ref, n = 1) {
    const id = resolveItemId(ref);
    if (!id) return;
    counts.set(id, (counts.get(id) ?? 0) + n);
  }

  if (recipe.inShape) {
    for (const row of recipe.inShape) {
      for (const cell of row) add(cell);
    }
  } else if (recipe.ingredients) {
    for (const ing of recipe.ingredients) {
      if (Array.isArray(ing)) {
        add(ing[0]);
      } else {
        add(ing);
      }
    }
  }

  return [...counts.entries()].map(([id, count]) =>
    idToKoIngredient(id, count)
  );
}

function inferRecipeCategory(resultId) {
  const cat = inferItemCategory(resultId);
  if (cat === "음식") return "음식";
  if (cat === "무기") return "무기";
  if (cat === "방어구") return "방어구";
  if (cat === "도구") return "도구";
  if (/piston|repeater|comparator|observer|dispenser|dropper|hopper|rail|redstone|daylight|target|lectern|tripwire/.test(resultId))
    return "레드스톤";
  if (/furnace|chest|hopper|barrel|composter|smithing|stonecutter|cartography|fletching|loom|brewing|enchanting|blast|smoker|crafting|anvil|grindstone|jukebox|bell|conduit|beacon|lodestone|lightning|chain|ladder|scaffolding|torch|lantern|campfire|door|trapdoor|fence|sign|bed|banner|boat|minecart|bucket|glass|brick|wool|concrete|terracotta|stained|shulker|copper|stairs|slab|wall|button|pressure/.test(resultId))
    return "기능";
  if (/planks|log|wood|slab|stairs|wall|fence|door|trapdoor|sign|shelf/.test(resultId))
    return "건축";
  return "재료";
}

function makeRecipe(raw) {
  const recipe = Array.isArray(raw) ? raw[0] : raw;
  if (!recipe?.result) return null;

  const resultId = resolveItemId(recipe.result.id ?? recipe.result);
  const resultCount = recipe.result.count ?? 1;
  if (!resultId || resultCount < 1) return null;

  if (recipeMap.has(resultId)) return null;

  const resultName = koResultName(resultId);
  const grid = shapedToGrid(recipe);
  const ingredients = countIngredients(recipe);
  if (ingredients.length === 0) return null;

  const rows = recipe.inShape?.length ?? 0;
  const cols = recipe.inShape?.[0]?.length ?? 0;
  const is2x2 = rows <= 2 && cols <= 2;

  return {
    id: resultId,
    name: resultName,
    emoji: pickEmoji("item", resultId),
    category: inferRecipeCategory(resultId),
    resultItem: resultName,
    resultCount,
    type: is2x2 ? "인벤토리 제작창" : "제작창",
    description: `${resultName} 제작법. ${ingredients.join(", ")}.`,
    tags: [inferItemCategory(resultId)],
    grid,
    ingredients,
  };
}

const generated = [];
const seen = new Set(recipeMap.keys());

for (const raw of Object.values(data.recipes ?? {})) {
  const made = makeRecipe(raw);
  if (!made || seen.has(made.id)) continue;
  seen.add(made.id);
  generated.push(made);
}

const merged = [...existing];
for (const r of generated) {
  if (!recipeMap.has(r.id)) merged.push(r);
}

merged.sort((a, b) => a.id.localeCompare(b.id));

writeFileSync(resolve(root, "data/recipes.json"), JSON.stringify(merged, null, 2), "utf-8");

console.log(
  `generate-recipes: ${existing.length} -> ${merged.length} (+${merged.length - existing.length} new)`
);
