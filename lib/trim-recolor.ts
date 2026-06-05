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

/** 위키 풀샷에서 회색(장식) 픽셀인지 판별 */
export function isTrimGrayPixel(r: number, g: number, b: number, a: number): boolean {
  if (a < 24) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const lightness = (max + min) / (2 * 255);
  // 장식 무늬: 채도 낮고 중간 밝기의 회색·은색
  if (chroma > 42) return false;
  if (lightness < 0.18 || lightness > 0.82) return false;
  return chroma <= 38 && lightness >= 0.22 && lightness <= 0.72;
}

/** 원본 밝기를 유지하며 대상 색으로 치환 */
export function recolorGrayPixel(
  r: number,
  g: number,
  b: number,
  targetHex: string
): [number, number, number] {
  const [tr, tg, tb] = hexToRgb(targetHex);
  const srcLum = 0.299 * r + 0.587 * g + 0.114 * b;
  const tgtLum = 0.299 * tr + 0.587 * tg + 0.114 * tb || 1;
  const scale = srcLum / tgtLum;
  return [clamp(tr * scale), clamp(tg * scale), clamp(tb * scale)];
}

/** ImageData 내 회색 장식 영역만 재료 색으로 변경 */
export function applyTrimMaterialColor(data: Uint8ClampedArray, targetHex: string): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (!isTrimGrayPixel(r, g, b, a)) continue;
    const [nr, ng, nb] = recolorGrayPixel(r, g, b, targetHex);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }
}
