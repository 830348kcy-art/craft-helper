import { KOREAN_TO_TEXTURE, CDN } from "./textures";

const FALLBACK = "block/stone.png";

/** 3D 농장 뷰어용 블록 텍스처 URL */
export function farmBlockTextureUrl(blockName: string): string {
  const path = KOREAN_TO_TEXTURE[blockName];
  if (path) return `${CDN}/${path}`;
  return `${CDN}/${FALLBACK}`;
}

/** 물·유리 등 반투명 블록 */
export function isTransparentFarmBlock(blockName: string): boolean {
  return blockName === "물" || blockName === "유리";
}
