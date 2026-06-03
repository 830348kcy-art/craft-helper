/**
 * 로컬 minecraft_assets → public/images/blocks/ 동기화
 * CI=true 이면 건너뜀 (배포는 CDN 사용)
 */
import { readFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import {
  ASSETS_SOURCE,
  root,
  getSourcePngForBlock,
  sourceExists,
  USE_CDN,
} from "./textures-config.mjs";

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

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const destDir = resolve(root, "public/images/blocks");
mkdirSync(destDir, { recursive: true });

let copied = 0;
let skipped = 0;

for (const block of blocks) {
  const srcName = getSourcePngForBlock(block.id);
  const srcPath = resolve(ASSETS_SOURCE, srcName);
  const destPath = resolve(destDir, `${block.id}.png`);

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
