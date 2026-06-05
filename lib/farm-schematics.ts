/** 자동 농장 3D 복셀 배치 — 좌표: X/Z 가로, Y 위 */
export type FarmVoxel = {
  x: number;
  y: number;
  z: number;
  block: string;
};

export type FarmSchematic = {
  id: string;
  caption: string;
  blocks: FarmVoxel[];
  /** OrbitControls 초기 카메라 거리 */
  cameraDistance?: number;
};

function row(
  y: number,
  z: number,
  cells: (string | null)[],
  x0 = 0
): FarmVoxel[] {
  return cells.flatMap((block, i) =>
    block ? [{ x: x0 + i, y, z, block }] : []
  );
}

export const FARM_SCHEMATICS: Record<string, FarmSchematic> = {
  sugar: {
    id: "sugar",
    caption: "사탕수수 자동 농장 — 옆에서 본 3D 구조",
    cameraDistance: 14,
    blocks: [
      ...row(4, 0, [null, null, "옵저버", "피스톤", null], -2),
      ...row(3, 0, [null, "사탕수수", null, null, null], -2),
      ...row(2, 0, [null, "사탕수수", null, null, null], -2),
      ...row(1, 0, ["둥근돌", "흙", "물", "둥근돌", null], -2),
      ...row(0, 0, ["호퍼", "호퍼", null, null, "상자"], -2),
      ...row(1, -1, ["둥근돌", null, null, "둥근돌", null], -2),
      ...row(1, 1, ["둥근돌", null, null, "둥근돌", null], -2),
    ],
  },
  bamboo: {
    id: "bamboo",
    caption: "대나무 자동 농장 — 3블록 높이에서 감지",
    cameraDistance: 14,
    blocks: [
      ...row(5, 0, [null, "대나무", null, null, null], -2),
      ...row(4, 0, [null, "대나무", null, null, null], -2),
      ...row(3, 0, [null, "대나무", "옵저버", "피스톤", null], -2),
      ...row(2, 0, [null, "대나무", null, null, null], -2),
      ...row(1, 0, ["둥근돌", "흙", "물", null, null], -2),
      ...row(0, 0, ["호퍼", "호퍼", null, null, "상자"], -2),
    ],
  },
  cactus: {
    id: "cactus",
    caption: "선인장 자동 농장 — 옆 블록에 닿으면 파괴",
    cameraDistance: 12,
    blocks: [
      ...row(4, 0, [null, "유리", null], -1),
      ...row(3, 0, ["선인장", null, null], -1),
      ...row(2, 0, ["선인장", null, null], -1),
      ...row(1, 0, ["모래", null, null], -1),
      ...row(0, 0, ["호퍼", null, "상자"], -1),
      ...row(1, 1, [null, "유리", null], -1),
    ],
  },
  wheat: {
    id: "wheat",
    caption: "밀·당근·감자 반자동 농장 — 축소 5×5 평면도",
    cameraDistance: 18,
    blocks: [
      ...row(2, 0, ["디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서"], -2),
      ...row(1, 0, ["경작지", "경작지", "경작지", "경작지", "경작지"], -2),
      ...row(1, 1, ["경작지", "경작지", "물", "경작지", "경작지"], -2),
      ...row(1, 2, ["경작지", "경작지", "경작지", "경작지", "경작지"], -2),
      ...row(0, 0, ["호퍼", "호퍼", "호퍼", "호퍼", "호퍼"], -2),
      ...row(0, 1, ["호퍼", "호퍼", "호퍼", "호퍼", "호퍼"], -2),
      ...row(0, 2, ["호퍼", "호퍼", "호퍼", "호퍼", "호퍼"], -2),
      ...row(0, 3, [null, null, "상자", null, null], -2),
      ...row(1, -1, ["유리", "유리", "유리", "유리", "유리"], -2),
      ...row(1, 3, ["유리", "유리", "유리", "유리", "유리"], -2),
    ],
  },
  melon: {
    id: "melon",
    caption: "수박 자동 농장 — 줄기 → 열매 → 피스톤",
    cameraDistance: 14,
    blocks: [
      ...row(1, 0, ["흙", "수박 줄기", "수박 블록", "옵저버", "피스톤"], -2),
      ...row(0, 0, ["둥근돌", null, "물", "호퍼", "호퍼"], -2),
      { x: 2, y: 0, z: 1, block: "상자" },
      ...row(1, -1, [null, "경작지", null, null, null], -2),
    ],
  },
  chicken: {
    id: "chicken",
    caption: "닭 자동 농장 — 알 발사 → 부화 → 용암 도살",
    cameraDistance: 16,
    blocks: [
      ...row(5, 0, [null, "디스펜서", null, null], -1),
      ...row(4, 0, [null, "유리", null, null], -1),
      ...row(3, 0, ["유리", "닭", "유리", null], -1),
      ...row(2, 0, ["유리", "트랩도어", "유리", null], -1),
      ...row(1, 0, ["유리", "닭", "유리", null], -1),
      ...row(0, 0, [null, "용암", null, null], -1),
      ...row(-1, 0, ["호퍼", "호퍼", "호퍼", "상자"], -1),
      ...row(3, -1, ["둥근돌", "둥근돌", "둥근돌", null], -1),
      ...row(3, 1, ["둥근돌", "둥근돌", "둥근돌", null], -1),
    ],
  },
  smelter: {
    id: "smelter",
    caption: "자동 제련소 — 원료↓ · 연료→ · 결과물↓",
    cameraDistance: 14,
    blocks: [
      ...row(4, 0, [null, "상자", null, null, null], -2),
      ...row(3, 0, [null, "호퍼", null, null, null], -2),
      ...row(2, 0, ["상자", "호퍼", "화로", null, null], -2),
      ...row(1, 0, [null, "호퍼", null, null, null], -2),
      ...row(0, 0, [null, "상자", null, null, null], -2),
      ...row(2, -1, ["둥근돌", "둥근돌", "둥근돌", null, null], -2),
    ],
  },
  fishing: {
    id: "fishing",
    caption: "AFK 낚시기 — 물 웅덩이 + 호퍼 수집",
    cameraDistance: 12,
    blocks: [
      ...row(1, 0, [null, "둥근돌", null], -1),
      ...row(0, 0, ["둥근돌", "물", "둥근돌"], -1),
      ...row(-1, 0, [null, "호퍼", null], -1),
      ...row(-2, 0, [null, "상자", null], -1),
      ...row(0, -1, ["둥근돌", "둥근돌", "둥근돌"], -1),
      ...row(0, 1, ["둥근돌", "둥근돌", "둥근돌"], -1),
    ],
  },
};

export function getFarmSchematic(id: string): FarmSchematic | undefined {
  return FARM_SCHEMATICS[id];
}
