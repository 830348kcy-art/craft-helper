/**
 * 로컬 minecraft 텍스처 → public/images/blocks|items 동기화
 * CI=true 이면 건너뜀 (배포는 CDN 사용)
 */
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  ASSETS_SOURCE,
  ASSETS_BLOCK,
  ASSETS_ITEM,
  root,
  sourceExists,
  USE_CDN,
} from "./textures-config-root.mjs";
import { getSourcePngForBlock, getSourcePngForItem } from "./resolve-texture.mjs";
import { loadAssetIndex } from "./asset-index.mjs";

if (USE_CDN) {
  console.log("[sync-textures] CI 모드 — 텍스처 동기화 생략 (CDN 사용)");
  process.exit(0);
}

if (!sourceExists()) {
  console.warn(
    `[sync-textures] 소스 없음: ${ASSETS_SOURCE}\n` +
      "  → CDN 폴백으로 빌드합니다. MINECRAFT_ASSETS 환경변수로 경로 지정 가능."
  );
  process.exit(0);
}

loadAssetIndex(ASSETS_SOURCE);

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));
const blockIds = new Set(blocks.map((b) => b.id));

const blockDest = resolve(root, "public/images/blocks");
const itemDest = resolve(root, "public/images/items");
mkdirSync(blockDest, { recursive: true });
mkdirSync(itemDest, { recursive: true });

function resolveSrcPath(relativePath) {
  if (!relativePath) return null;
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.startsWith("block/")) {
    const p = resolve(ASSETS_BLOCK, normalized.replace(/^block\//, ""));
    return existsSync(p) ? p : null;
  }
  if (normalized.startsWith("item/")) {
    const p = resolve(ASSETS_ITEM, normalized.replace(/^item\//, ""));
    return existsSync(p) ? p : null;
  }
  const flat = resolve(ASSETS_SOURCE, normalized);
  return existsSync(flat) ? flat : null;
}

let blockCopied = 0;
let blockSkipped = 0;
let itemCopied = 0;
let itemSkipped = 0;

const syncBlockIds = new Set([
  ...blocks.map((b) => b.id),
  ...items.filter((it) => blockIds.has(it.id)).map((it) => it.id),
]);

for (const id of syncBlockIds) {
  const srcRel = getSourcePngForBlock(id);
  const srcPath = resolveSrcPath(srcRel);
  if (!srcPath) {
    blockSkipped++;
    continue;
  }
  copyFileSync(srcPath, resolve(blockDest, `${id}.png`));
  blockCopied++;
}

for (const it of items) {
  if (blockIds.has(it.id)) continue;
  const srcRel = getSourcePngForItem(it.id);
  const srcPath = resolveSrcPath(srcRel);
  if (!srcPath) {
    itemSkipped++;
    continue;
  }
  copyFileSync(srcPath, resolve(itemDest, `${it.id}.png`));
  itemCopied++;
}

console.log(
  `[sync-textures] blocks: ${blockCopied}개 복사, ${blockSkipped}개 없음\n` +
    `[sync-textures] items:  ${itemCopied}개 복사, ${itemSkipped}개 없음`
);
