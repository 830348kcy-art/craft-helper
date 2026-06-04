/**
 * 빌드 스크립트 공용 텍스처 설정
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import {
  CDN,
  USE_CDN,
  BASE_PATH,
  ASSETS_SOURCE,
  sourceExists,
  root,
} from "./textures-config-root.mjs";
import {
  cdnBlockPath,
  cdnItemPath,
  getSourcePngForBlock,
  baseBlockId,
  textureMap,
} from "./resolve-texture.mjs";

export {
  CDN,
  USE_CDN,
  BASE_PATH,
  ASSETS_SOURCE,
  sourceExists,
  root,
  textureMap,
  cdnBlockPath,
  cdnItemPath,
  getSourcePngForBlock,
  baseBlockId,
};

function loadBlockIds() {
  try {
    const blocks = JSON.parse(
      readFileSync(resolve(root, "data/blocks.json"), "utf-8")
    );
    return new Set(blocks.map((b) => b.id));
  } catch {
    return new Set();
  }
}

const blockIdSet = loadBlockIds();

let textureUrlMap = {};
try {
  textureUrlMap = JSON.parse(
    readFileSync(resolve(root, "scripts/texture-url-map.json"), "utf-8")
  );
} catch {
  /* build-texture-map 실행 전 */
}

function localBlockExists(id) {
  return existsSync(resolve(root, "public/images/blocks", `${id}.png`));
}

function localItemExists(id) {
  return existsSync(resolve(root, "public/images/items", `${id}.png`));
}

export function getBlockImageUrl(id) {
  if (textureUrlMap[id]) return textureUrlMap[id];
  const cdnUrl = `${CDN}/${cdnBlockPath(id)}`;
  if (USE_CDN) return cdnUrl;
  if (localBlockExists(id)) return `${BASE_PATH}/images/blocks/${id}.png`;
  return cdnUrl;
}

export function getItemImageUrl(id) {
  if (textureUrlMap[id]) return textureUrlMap[id];
  if (blockIdSet.has(id)) return getBlockImageUrl(id);
  const cdnUrl = `${CDN}/${cdnItemPath(id)}`;
  if (USE_CDN) return cdnUrl;
  if (localItemExists(id)) return `${BASE_PATH}/images/items/${id}.png`;
  return cdnUrl;
}
