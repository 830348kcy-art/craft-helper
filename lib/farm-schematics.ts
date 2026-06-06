/** 자동 농장 3D 복셀 — 튜토리얼 영상 프레임 분석 기준 (X/Z 가로, Y 위) */
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
  cameraDistance?: number;
};

function v(x: number, y: number, z: number, block: string): FarmVoxel {
  return { x, y, z, block };
}

function row(
  y: number,
  z: number,
  cells: (string | null)[],
  x0 = 0
): FarmVoxel[] {
  return cells.flatMap((block, i) =>
    block ? [v(x0 + i, y, z, block)] : []
  );
}

function fillBox(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  block: string
): FarmVoxel[] {
  const out: FarmVoxel[] = [];
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++) out.push(v(x, y, z, block));
  return out;
}

/** 사탕수수·대나무 — 영상: 상자→호퍼→흙→작물, 옆 물(수수만), 피스톤+옵저버, 유리 3면 */
function observerGlassModule(plant: string, withWater: boolean): FarmVoxel[] {
  const blocks: FarmVoxel[] = [
    v(0, 0, 0, "상자"),
    v(0, 1, 0, "호퍼"),
    v(0, 2, 0, "흙"),
    v(0, 3, 0, plant),
    v(0, 4, 0, plant),
    v(1, 3, 0, "피스톤"),
    v(1, 4, 0, "옵저버"),
    v(2, 3, 0, "흙"),
    v(2, 4, 0, "레드스톤 가루"),
    // 유리 — 작물 주변 3면 (피스톤 쪽 제외)
    ...fillBox(-1, -1, 2, 4, 0, 0, "유리"),
    ...fillBox(0, 0, 2, 4, 1, 1, "유리"),
    ...fillBox(0, 0, 2, 4, -1, -1, "유리"),
  ];
  if (withWater) blocks.push(v(1, 2, 0, "물"));
  return blocks;
}

export const FARM_SCHEMATICS: Record<string, FarmSchematic> = {
  sugar: {
    id: "sugar",
    caption: "사탕수수 — 상자·호퍼·흙·유리 수직 모듈 (영상)",
    cameraDistance: 11,
    blocks: observerGlassModule("사탕수수", true),
  },
  bamboo: {
    id: "bamboo",
    caption: "대나무 — 사탕수수와 동일 구조 (물 없음)",
    cameraDistance: 11,
    blocks: observerGlassModule("대나무", false),
  },
  cactus: {
    id: "cactus",
    caption: "선인장 — 4칸·울타리·물 웅덩이·호퍼 (영상)",
    cameraDistance: 13,
    blocks: [
      // 3×3 물 웅덩이 (y=0)
      ...fillBox(-1, 1, 0, 0, -1, 1, "물"),
      // 모래+선인장 4모서리
      v(-1, 1, -1, "모래"),
      v(-1, 2, -1, "선인장"),
      v(1, 1, -1, "모래"),
      v(1, 2, -1, "선인장"),
      v(-1, 1, 1, "모래"),
      v(-1, 2, 1, "선인장"),
      v(1, 1, 1, "모래"),
      v(1, 2, 1, "선인장"),
      // 울타리 2개 (성장 시 파괴)
      v(0, 2, -1, "참나무 울타리"),
      v(0, 2, 1, "참나무 울타리"),
      // 앞쪽 수거
      v(0, 0, 2, "호퍼"),
      v(0, -1, 2, "상자"),
      // 잔디 테두리 (y=1)
      ...row(1, -2, ["잔디 블록", "잔디 블록", "잔디 블록"], -1),
      ...row(1, 2, ["잔디 블록", "잔디 블록", "잔디 블록"], -1),
      ...row(1, -1, ["잔디 블록", null, "잔디 블록"], -2),
      ...row(1, 1, ["잔디 블록", null, "잔디 블록"], -2),
    ],
  },
  wheat: {
    id: "wheat",
    caption: "밀 반자동 — 디스펜서·경작지·호퍼·옵저버 (영상)",
    cameraDistance: 15,
    blocks: [
      // 바닥 y=0 (1칸 파인 구조)
      ...row(0, 0, ["디스펜서", "디스펜서", "디스펜서", "디스펜서", "디스펜서"], -2),
      ...row(0, 1, ["경작지", "경작지", "경작지", "경작지", "경작지"], -2),
      ...row(0, 2, ["경작지", "경작지", "물", "경작지", "경작지"], -2),
      ...row(0, 3, ["경작지", "경작지", "경작지", "경작지", "경작지"], -2),
      ...row(0, 4, ["경작지", "경작지", "경작지", "경작지", "경작지"], -2),
      ...row(0, 5, ["호퍼", "호퍼", "호퍼", "호퍼", "호퍼"], -2),
      v(0, 0, 6, "상자"),
      v(0, 1, 6, "판자"),
      // 디스펜서 뒤 레드스톤
      ...row(1, -1, ["레드스톤 가루", "레드스톤 가루", "레드스톤 가루", "레드스톤 가루", "레드스톤 가루"], -2),
      v(3, 0, 2, "옵저버"),
      v(3, 1, 2, "버튼"),
      // 테두리 잔디 (y=1)
      ...row(1, 0, ["잔디 블록", "잔디 블록", "잔디 블록", "잔디 블록", "잔디 블록"], -2),
      ...row(1, 5, ["잔디 블록", "잔디 블록", "잔디 블록", "잔디 블록", "잔디 블록"], -2),
      v(-3, 1, 3, "잔디 블록"),
      v(3, 1, 3, "잔디 블록"),
    ],
  },
  melon: {
    id: "melon",
    caption: "수박·호박 — 줄기·열매·옵저버·피스톤 (표준 자동)",
    cameraDistance: 12,
    blocks: [
      v(0, 0, 0, "경작지"),
      v(0, 1, 0, "수박 줄기"),
      v(1, 0, 0, "수박 블록"),
      v(2, 0, 0, "옵저버"),
      v(3, 0, 0, "피스톤"),
      v(0, 0, -1, "물"),
      v(1, -1, 0, "호퍼"),
      v(1, -2, 0, "상자"),
      v(-1, 0, 0, "둥근돌"),
      v(0, 0, 1, "둥근돌"),
    ],
  },
  chicken: {
    id: "chicken",
    caption: "닭 — 회색 벽·유리 전면·용암 도살 (영상)",
    cameraDistance: 12,
    blocks: [
      // 회색 벽 (뒤·좌·우)
      ...fillBox(-1, 1, 0, 4, -1, -1, "회색 콘크리트"),
      ...fillBox(-1, -1, 0, 4, 0, 0, "회색 콘크리트"),
      ...fillBox(-1, 1, 0, 4, 0, 0, "회색 콘크리트"),
      // 유리 전면 1×4 (z=1)
      ...fillBox(0, 0, 1, 4, 1, 1, "유리"),
      // 내부 (아래→위)
      v(0, 0, 0, "상자"),
      v(0, 1, 0, "호퍼"),
      v(0, 2, 0, "돌 반 블록"),
      v(0, 3, 0, "닭"),
      v(0, 4, 0, "용암"),
    ],
  },
  smelter: {
    id: "smelter",
    caption: "자동 제련소 — 원료↑ · 연료← · 결과↓",
    cameraDistance: 12,
    blocks: [
      v(0, 0, 0, "상자"),
      v(0, 1, 0, "호퍼"),
      v(0, 2, 0, "화로"),
      v(0, 3, 0, "호퍼"),
      v(0, 4, 0, "상자"),
      v(-1, 2, 0, "호퍼"),
      v(-2, 2, 0, "상자"),
    ],
  },
  fishing: {
    id: "fishing",
    caption: "AFK 낚시 — 1×1 물·옆 호퍼·아래 상자",
    cameraDistance: 9,
    blocks: [
      ...fillBox(-1, 1, 0, 0, -1, 1, "둥근돌"),
      v(0, 0, 0, "물"),
      v(1, 0, 0, "호퍼"),
      v(1, -1, 0, "상자"),
    ],
  },
};

export function getFarmSchematic(id: string): FarmSchematic | undefined {
  return FARM_SCHEMATICS[id];
}
