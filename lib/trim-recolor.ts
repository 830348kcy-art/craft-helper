/** #RRGGBB → [r,g,b] */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function clamp(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

/** sRGB 휘도 (0–255) */
export function pixelLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** 완전 검정(배경·투명) — 형판 색을 입히지 않음 */
export function isMaskBlack(r: number, g: number, b: number, a: number): boolean {
  if (a < 12) return true;
  return pixelLuminance(r, g, b) <= 16;
}

/** 갑옷 본체 색 (네더라이트) */
export const BASE_ARMOR_HEX = "#625859";

/** trim-only 에셋 판별 (갈비뼈·고요 등) */
const TRIM_ONLY_AVG_DELTA = -8;

/**
 * 흑백 마스크 + 재료색 합성.
 * 검정이 아닌 모든 픽셀에 재료 색 × 밝기를 곱한다.
 */
export function colorizeMaskPixel(
  r: number,
  g: number,
  b: number,
  targetHex: string
): [number, number, number] {
  const [tr, tg, tb] = hexToRgb(targetHex);
  const lum = pixelLuminance(r, g, b) / 255;
  return [clamp(tr * lum), clamp(tg * lum), clamp(tb * lum)];
}

function colorizeLum(lum: number, targetHex: string): [number, number, number] {
  return colorizeMaskPixel(lum, lum, lum, targetHex);
}

function sampleBaseIndex(
  x: number,
  y: number,
  trimW: number,
  trimH: number,
  baseW: number,
  baseH: number
): number {
  const bx = Math.min(baseW - 1, Math.max(0, Math.round((x / trimW) * baseW)));
  const by = Math.min(baseH - 1, Math.max(0, Math.round((y / trimH) * baseH)));
  return (by * baseW + bx) * 4;
}

/** ImageData: 검정 제외 전체에 재료 색 적용 (풀샷 형판용) */
export function applyTrimMaterialColor(data: Uint8ClampedArray, targetHex: string): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isMaskBlack(r, g, b, a)) continue;
    const [nr, ng, nb] = colorizeMaskPixel(r, g, b, targetHex);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }
}

export type TrimRenderMode = "full" | "composite";

/**
 * trim 풀샷 + base 갑옷(bolt) 비교 → 렌더 모드 결정.
 * composite: 갑옷 본체 + 장식 2레이어 (trim-only 에셋)
 */
export function detectTrimRenderMode(
  trimData: Uint8ClampedArray,
  trimW: number,
  trimH: number,
  baseData: Uint8ClampedArray,
  baseW: number,
  baseH: number
): TrimRenderMode {
  let sum = 0;
  let n = 0;
  for (let y = 0; y < trimH; y++) {
    for (let x = 0; x < trimW; x++) {
      const ti = (y * trimW + x) * 4;
      if (isMaskBlack(trimData[ti], trimData[ti + 1], trimData[ti + 2], trimData[ti + 3]))
        continue;
      const bi = sampleBaseIndex(x, y, trimW, trimH, baseW, baseH);
      if (isMaskBlack(baseData[bi], baseData[bi + 1], baseData[bi + 2], baseData[bi + 3]))
        continue;
      sum +=
        pixelLuminance(trimData[ti], trimData[ti + 1], trimData[ti + 2]) -
        pixelLuminance(baseData[bi], baseData[bi + 1], baseData[bi + 2]);
      n++;
    }
  }
  if (n === 0) return "full";
  return sum / n < TRIM_ONLY_AVG_DELTA ? "composite" : "full";
}

/**
 * composite 모드: 네더라이트 갑옷 본체 + 재료색 장식.
 * trim-only 에셋(갈비뼈·고요)에서 갑옷 실루엣이 빠진 문제를 해결한다.
 */
export function applyTrimCompositePreview(
  out: Uint8ClampedArray,
  trimData: Uint8ClampedArray,
  trimW: number,
  trimH: number,
  baseData: Uint8ClampedArray,
  baseW: number,
  baseH: number,
  materialHex: string
): void {
  for (let y = 0; y < trimH; y++) {
    for (let x = 0; x < trimW; x++) {
      const oi = (y * trimW + x) * 4;
      const ti = oi;
      const bi = sampleBaseIndex(x, y, trimW, trimH, baseW, baseH);

      const tr = trimData[ti];
      const tg = trimData[ti + 1];
      const tb = trimData[ti + 2];
      const ta = trimData[ti + 3];
      const trimVis = !isMaskBlack(tr, tg, tb, ta);

      const br = baseData[bi];
      const bg = baseData[bi + 1];
      const bb = baseData[bi + 2];
      const ba = baseData[bi + 3];
      const baseVis = !isMaskBlack(br, bg, bb, ba);

      if (!trimVis && !baseVis) continue;

      let hex: string;
      let lum: number;

      if (trimVis) {
        hex = materialHex;
        lum = pixelLuminance(tr, tg, tb);
      } else {
        hex = BASE_ARMOR_HEX;
        lum = pixelLuminance(br, bg, bb);
      }

      const [nr, ng, nb] = colorizeLum(lum, hex);
      out[oi] = nr;
      out[oi + 1] = ng;
      out[oi + 2] = nb;
      out[oi + 3] = 255;
    }
  }
}
