/**
 * 로컬 minecraft_assets → public/images/blocks/ 동기화
 * CI=true 이면 건너뜀 (배포는 CDN 사용)
 */
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ASSETS_SOURCE, root, sourceExists, USE_CDN } from "./textures-config-root.mjs";
import { getSourcePngForBlock } from "./resolve-texture.mjs";
import { loadAssetIndex } from "./asset-index.mjs";

function resolveSrcName(id) {
  return getSourcePngForBlock(id);
}

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

// 블록 + 아이템 카탈로그에 있는 블록 ID 모두 동기화
const syncIds = new Set([
  ...blocks.map((b) => b.id),
  ...items.filter((it) => blockIds.has(it.id)).map((it) => it.id),
]);
const destDir = resolve(root, "public/images/blocks");
mkdirSync(destDir, { recursive: true });

let copied = 0;
let skipped = 0;

for (const id of syncIds) {
  const srcName = resolveSrcName(id);
  if (!srcName) {
    skipped++;
    continue;
  }
  const srcPath = resolve(ASSETS_SOURCE, srcName);
  const destPath = resolve(destDir, `${id}.png`);

  if (!existsSync(srcPath)) {
    skipped++;
    continue;
  }
  copyFileSync(srcPath, destPath);
  copied++;
}

console.log(
  `[sync-textures] 완료: ${copied}개 복사, ${skipped}개 소스 없음 → ${destDir}`
);
