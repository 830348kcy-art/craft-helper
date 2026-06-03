/**
 * 빌드 전에 실행 — 검색 인덱스를 public/search-index.json으로 저장.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import {
  getBlockImageUrl,
  getItemImageUrl,
  root,
} from "./textures-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readJSON(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf-8"));
}

const blocks = readJSON("data/blocks.json");
const items = readJSON("data/items.json");
const recipes = readJSON("data/recipes.json");

const index = [
  ...blocks.map((b) => ({
    id: b.id,
    type: "block",
    name: b.name,
    description: b.description,
    emoji: b.emoji || "🟫",
    image: getBlockImageUrl(b.id),
    category: b.category,
    tags: b.tags || [],
    href: `/search/${b.id}`,
  })),
  ...items.map((it) => ({
    id: it.id,
    type: "item",
    name: it.name,
    description: it.description,
    emoji: it.emoji || "📦",
    image: getItemImageUrl(it.id),
    category: it.category,
    tags: it.tags || [],
    href: `/search/${it.id}`,
  })),
  ...recipes.map((r) => ({
    id: r.id,
    type: "recipe",
    name: r.name,
    description: r.description,
    emoji: r.emoji || "📜",
    image: getItemImageUrl(r.id),
    category: r.category,
    tags: r.tags || [],
    href: `/search/${r.id}?type=recipe`,
  })),
];

const outPath = resolve(root, "public", "search-index.json");
writeFileSync(outPath, JSON.stringify(index), "utf-8");
console.log(`search-index.json: ${index.length} entries -> ${outPath}`);
