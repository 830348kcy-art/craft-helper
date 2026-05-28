/**
 * 자동 농장 단면도를 실제 마인크래프트 텍스처로 렌더하는 HTML 생성기.
 * 출력은 lib/data.ts의 HTML 문자열에 그대로 삽입한다.
 */
import { KOREAN_TO_TEXTURE, CDN } from "./textures";

type CellSpec = string | { name: string; label?: string; flow?: "left" | "right" | "down" | "up" } | null;

const CELL_PX = 44;

function textureUrl(name: string): string | undefined {
  const path = KOREAN_TO_TEXTURE[name];
  if (path) return `${CDN}/${path}`;
  // ID 그대로 시도
  if (/^[a-z_0-9/]+\.png$/.test(name)) return `${CDN}/${name}`;
  return undefined;
}

function renderCell(cell: CellSpec): string {
  if (!cell) {
    return `<div style="width:${CELL_PX}px;height:${CELL_PX}px;"></div>`;
  }
  const spec = typeof cell === "string" ? { name: cell } : cell;
  if (!spec.name || spec.name === "·" || spec.name === " ") {
    return `<div style="width:${CELL_PX}px;height:${CELL_PX}px;"></div>`;
  }
  const url = textureUrl(spec.name);
  const label = spec.label ?? spec.name;
  const arrow = spec.flow
    ? `<span style="position:absolute;top:50%;${spec.flow === "left" ? "left:-10px" : spec.flow === "right" ? "right:-10px" : ""};transform:translateY(-50%);font-size:14px;color:#fbbf24;text-shadow:0 0 4px rgba(0,0,0,0.6);font-weight:bold;line-height:1;">${spec.flow === "left" ? "←" : spec.flow === "right" ? "→" : spec.flow === "down" ? "↓" : "↑"}</span>`
    : "";

  if (!url) {
    // 텍스처 없음 — 글자 셀
    return `<div style="position:relative;width:${CELL_PX}px;height:${CELL_PX}px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.08);border:1px dashed rgba(255,255,255,0.2);border-radius:4px;font-size:10px;color:#e4e4e7;padding:2px;text-align:center;line-height:1.1;">${label}${arrow}</div>`;
  }
  return `<div style="position:relative;width:${CELL_PX}px;height:${CELL_PX}px;background:linear-gradient(135deg,#52525b,#3f3f46);border:1px solid #71717a;border-radius:4px;overflow:hidden;" title="${label}"><img src="${url}" alt="${label}" loading="lazy" draggable="false" style="width:100%;height:100%;image-rendering:pixelated;object-fit:contain;display:block;"/>${arrow}</div>`;
}

/**
 * 2D 배열을 받아 단면도 HTML을 생성한다.
 * - 빈 칸은 null 또는 ""
 * - 셀은 한국어 이름(KOREAN_TO_TEXTURE 키) 또는 `{name, label, flow}` 객체
 */
export function farmDiagram(rows: CellSpec[][], caption?: string): string {
  const cols = rows.reduce((max, r) => Math.max(max, r.length), 0);
  const inner = rows
    .map(
      (row) => `<div style="display:flex;gap:2px;">${
        Array.from({ length: cols }, (_, i) => renderCell(row[i] ?? null)).join("")
      }</div>`
    )
    .join("");

  return `<figure style="margin:20px auto;display:flex;flex-direction:column;align-items:center;">
  <div style="display:inline-flex;flex-direction:column;gap:2px;padding:10px;background:linear-gradient(135deg,#27272a,#18181b);border:1px solid #3f3f46;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.2);">${inner}</div>
  ${caption ? `<figcaption style="margin-top:8px;font-size:12px;color:#71717a;text-align:center;font-weight:500;">📐 ${caption}</figcaption>` : ""}
</figure>`;
}
