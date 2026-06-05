/**
 * recipes.json 재료·격자 한국어명을 minecraft-data + 공식명으로 재생성
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mcData from "minecraft-data";
import { idToKoIngredient, idToKoName } from "./ko-utils.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = mcData("1.21.4");
const recipes = JSON.parse(readFileSync(resolve(root, "data/recipes.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));
const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));

const nameById = new Map([
  ...items.map((i) => [i.id, i.name]),
  ...blocks.map((b) => [b.id, b.name]),
]);

function resolveItemId(ref) {
  if (ref == null) return null;
  if (typeof ref === "string") return ref.includes(":") ? ref.split(":")[1] : ref;
  if (typeof ref === "number") return data.items[ref]?.name ?? null;
  if (typeof ref === "object" && ref.id != null) return resolveItemId(ref.id);
  return null;
}

function koName(id) {
  return nameById.get(id) ?? idToKoName(id);
}

function shapedToGrid(recipe) {
  const grid = [["", "", ""], ["", "", ""], ["", "", ""]];
  const pattern = recipe.inShape;
  if (!Array.isArray(pattern)) {
    const single =
      recipe.ingredients?.length === 1
        ? resolveItemId(
            Array.isArray(recipe.ingredients[0]) ? recipe.ingredients[0][0] : recipe.ingredients[0]
          )
        : null;
    if (single) grid[1][1] = koName(single);
    return grid;
  }
  for (let r = 0; r < pattern.length && r < 3; r++) {
    const row = pattern[r];
    if (!Array.isArray(row)) continue;
    for (let c = 0; c < row.length && c < 3; c++) {
      grid[r][c] = cellToKo(row[c]);
    }
  }
  return grid;
}

function cellToKo(ref) {
  if (ref == null) return "";
  if (typeof ref === "string" && ref.startsWith("#")) return ref;
  const id = resolveItemId(ref);
  return id ? koName(id) : "";
}

function countIngredients(recipe) {
  const counts = new Map();
  function add(ref, n = 1) {
    const id = resolveItemId(ref);
    if (!id) return;
    counts.set(id, (counts.get(id) ?? 0) + n);
  }
  if (recipe.inShape) {
    for (const row of recipe.inShape) for (const cell of row) add(cell);
  } else if (recipe.ingredients) {
    for (const ing of recipe.ingredients) {
      if (Array.isArray(ing)) add(ing[0]);
      else add(ing);
    }
  }
  return [...counts.entries()].map(([id, count]) => idToKoIngredient(id, count));
}

const mcByResult = new Map();
for (const raw of Object.values(data.recipes ?? {})) {
  const recipe = Array.isArray(raw) ? raw[0] : raw;
  if (!recipe?.result) continue;
  const resultId = resolveItemId(recipe.result.id ?? recipe.result);
  if (resultId) mcByResult.set(resultId, recipe);
}

let patched = 0;
for (const r of recipes) {
  const mcRecipe = mcByResult.get(r.id);
  if (!mcRecipe) continue;
  const grid = shapedToGrid(mcRecipe);
  const ingredients = countIngredients(mcRecipe);
  const resultName = koName(r.id);
  r.name = resultName;
  r.resultItem = resultName;
  r.grid = grid;
  r.ingredients = ingredients;
  r.description = `${resultName} 제작법. ${ingredients.join(", ")}.`;
  patched++;
}

writeFileSync(resolve(root, "data/recipes.json"), JSON.stringify(recipes, null, 2) + "\n", "utf-8");
console.log(`[patch-recipe-ko-names] ${patched}/${recipes.length} 레시피 갱신`);
