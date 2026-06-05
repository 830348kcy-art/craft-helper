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

/**
 * 흑백 마스크 + 재료색 합성.
 * 위키 풀샷은 형판 미적용 상태에서 흑백처럼 보이며,
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

/** ImageData: 검정 제외 전체에 재료 색 적용 */
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
