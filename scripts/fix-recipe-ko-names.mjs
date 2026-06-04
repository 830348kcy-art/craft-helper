/**
 * 레시피 격자·설명의 구 한국어명 → 공식명 (제작대, 공급기 등)
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";

const REPLACEMENTS = [
  ["작업대", "제작대"],
  ["투척기", "공급기"],
];

const path = resolve(root, "data/recipes.json");
const recipes = JSON.parse(readFileSync(path, "utf-8"));

function replaceInString(s) {
  if (typeof s !== "string") return s;
  let out = s;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

let changed = 0;
for (const r of recipes) {
  if (r.grid) {
    for (let row = 0; row < r.grid.length; row++) {
      for (let col = 0; col < r.grid[row].length; col++) {
        const next = replaceInString(r.grid[row][col]);
        if (next !== r.grid[row][col]) {
          r.grid[row][col] = next;
          changed++;
        }
      }
    }
  }
  for (const key of ["name", "description", "resultItem"]) {
    if (r[key]) {
      const next = replaceInString(r[key]);
      if (next !== r[key]) {
        r[key] = next;
        changed++;
      }
    }
  }
  if (Array.isArray(r.ingredients)) {
    r.ingredients = r.ingredients.map((ing) => replaceInString(ing));
  }
}

writeFileSync(path, JSON.stringify(recipes, null, 2) + "\n", "utf-8");
console.log(`recipes.json: ${changed} cell/field replacements`);
