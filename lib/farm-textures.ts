import { KOREAN_TO_TEXTURE, CDN } from "./textures";

const FALLBACK = "block/stone.png";

/** 3D 뷰어 전용 — CDN 검증된 경로 (item/chest.png 등 404 보정) */
const FARM_TEXTURE_OVERRIDES: Record<string, string> = {
  상자: "entity/chest/normal.png",
  유리: "block/glass.png",
  물: "block/water_still.png",
  "레드스톤 가루": "block/redstone_dust_dot.png",
  "참나무 울타리": "block/oak_planks.png",
  "수박 줄기": "block/attached_melon_stem.png",
  사탕수수: "block/sugar_cane.png",
};

/** 블록별 폴백 색 (텍스처 로드 실패 시) */
export const FARM_BLOCK_COLORS: Record<string, number> = {
  상자: 0x9a7b4f,
  유리: 0xc8e8ff,
  물: 0x3f76e4,
  호퍼: 0x5a5a5a,
  레일: 0x7a7a7a,
};

export function farmBlockTextureUrl(blockName: string): string {
  const override = FARM_TEXTURE_OVERRIDES[blockName];
  if (override) return `${CDN}/${override}`;
  const path = KOREAN_TO_TEXTURE[blockName];
  if (path) return `${CDN}/${path}`;
  return `${CDN}/${FALLBACK}`;
}

export function farmBlockFallbackColor(blockName: string): number {
  return FARM_BLOCK_COLORS[blockName] ?? 0x888888;
}

export function isTransparentFarmBlock(blockName: string): boolean {
  return blockName === "물" || blockName === "유리";
}
