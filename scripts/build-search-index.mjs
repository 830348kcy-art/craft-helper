/**
 * 빌드 전에 실행 — 검색 인덱스를 public/search-index.json으로 저장.
 * 클라이언트 사이드 검색에서 이 파일을 fetch해서 사용.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function readJSON(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf-8"));
}

const blocks  = readJSON("data/blocks.json");
const items   = readJSON("data/items.json");
const recipes = readJSON("data/recipes.json");

const CDN = "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20/assets/minecraft/textures";

// 아이템 텍스처 경로 보조 함수
function guessTexture(id) {
  // item/ 먼저, 없으면 block/
  return `${CDN}/item/${id}.png`;
}

const index = [
  ...blocks.map((b) => ({
    id: b.id,
    type: "block",
    name: b.name,
    description: b.description,
    emoji: b.emoji || "🟫",
    image: b.textureUrl || `${CDN}/block/${b.id}.png`,
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
    image: it.textureUrl || guessTexture(it.id),
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
    image: r.textureUrl || guessTexture(r.id),
    category: r.category,
    tags: r.tags || [],
    href: `/search/${r.id}?type=recipe`,
  })),
];

const outPath = resolve(root, "public", "search-index.json");
writeFileSync(outPath, JSON.stringify(index), "utf-8");
console.log(`✅ search-index.json 생성: ${index.length}개 항목 → ${outPath}`);
