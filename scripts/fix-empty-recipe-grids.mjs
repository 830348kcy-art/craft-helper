/**
 * 원목→판자 등 격자가 비어 있는 레시피에 재료 1칸 배치
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";

const recipes = JSON.parse(readFileSync(resolve(root, "data/recipes.json"), "utf-8"));

function gridEmpty(grid) {
  return !grid?.flat().some((c) => c && String(c).trim());
}

let fixed = 0;
for (const r of recipes) {
  if (!gridEmpty(r.grid)) continue;
  const ing = r.ingredients?.[0];
  if (!ing) continue;
  const name = ing.replace(/\s*×\s*\d+$/, "").trim();
  r.grid = [
    ["", "", ""],
    ["", name, ""],
    ["", "", ""],
  ];
  fixed++;
}

writeFileSync(resolve(root, "data/recipes.json"), JSON.stringify(recipes, null, 2) + "\n", "utf-8");
console.log(`[fix-empty-recipe-grids] ${fixed}개 레시피 격자 보정`);
