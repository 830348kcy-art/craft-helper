/** 자동 농장 3D 복셀 — 영상 프레임 기준 (X/Z 가로, Y 위) */
import type { BlockFacing } from "./farm-block-faces";

export type FarmVoxel = {
  x: number;
  y: number;
  z: number;
  block: string;
  facing?: BlockFacing;
};

export type FarmSchematic = {
  id: string;
  caption: string;
  blocks: FarmVoxel[];
  cameraDistance?: number;
};

function v(
  x: number,
  y: number,
  z: number,
  block: string,
  facing?: BlockFacing
): FarmVoxel {
  return facing ? { x, y, z, block, facing } : { x, y, z, block };
}

function row(
  y: number,
  z: number,
  cells: (string | null)[],
  x0 = 0,
  facing?: BlockFacing
): FarmVoxel[] {
  return cells.flatMap((block, i) =>
    block ? [v(x0 + i, y, z, block, facing)] : []
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

/** 사탕수수·대나무 — 영상: 상자→호퍼→흙→2단 작물, 유리 3면, 물(수수) */
function observerGlassModule(plant: string, withWater: boolean): FarmVoxel[] {
  const blocks: FarmVoxel[] = [
    v(0, 0, 0, "상자", "south"),
    v(0, 1, 0, "호퍼"),
    v(0, 2, 0, "흙"),
    v(0, 3, 0, plant),
    v(0, 4, 0, plant),
    v(1, 3, 0, "피스톤", "west"),
    v(1, 4, 0, "옵저버", "west"),
    v(2, 3, 0, "흙"),
    v(2, 4, 0, "레드스톤 가루"),
    ...fillBox(-1, -1, 2, 4, 0, 0, "유리"),
    ...fillBox(0, 0, 2, 4, 1, 1, "유리"),
    ...fillBox(0, 0, 2, 4, -1, -1, "유리"),
  ];
  if (withWater) blocks.push(v(1, 2, 0, "물"));
  return blocks;
}

/** 밀·당근·감자 — 위키 9×9 (북 디스펜서·중앙 물·남 호퍼·울타리) */
function wheatFarmBlocks(): FarmVoxel[] {
  const half = 4;
  const blocks: FarmVoxel[] = [];

  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      if (x === 0 && z === 0) {
        blocks.push(v(x, 0, z, "물"));
      } else {
        blocks.push(v(x, 0, z, "경작지"));
        blocks.push(v(x, 1, z, "밀"));
      }
    }
  }

  for (let x = -half; x <= half; x++) {
    blocks.push(v(x, 0, -half - 1, "디스펜서", "south"));
    blocks.push(v(x, -1, half + 1, "호퍼"));
  }
  blocks.push(v(0, -2, half + 1, "상자", "north"));
  blocks.push(v(0, 1, -half - 1, "버튼"));

  for (let x = -half - 1; x <= half + 1; x++) {
    blocks.push(v(x, 1, -half - 1, "참나무 울타리"));
    blocks.push(v(x, 1, half + 1, "참나무 울타리"));
  }
  for (let z = -half; z <= half; z++) {
    blocks.push(v(-half - 1, 1, z, "참나무 울타리"));
    blocks.push(v(half + 1, 1, z, "참나무 울타리"));
  }

  return blocks;
}

/** 수박·호박 — 위키 단면 (경작지+줄기 | 열매 흙 | 옵저버→피스톤, 아래 물·호퍼·상자) */
function melonFarmBlocks(): FarmVoxel[] {
  return [
    v(-1, 0, 0, "물"),
    v(0, -1, 0, "둥근돌"),
    v(0, 0, 0, "경작지"),
    v(0, 1, 0, "수박 줄기"),
    v(1, -1, 0, "흙"),
    v(1, 0, 0, "수박 블록"),
    v(2, 0, 0, "옵저버", "west"),
    v(3, 0, 0, "피스톤", "west"),
    v(1, -2, 0, "물"),
    v(1, -3, 0, "호퍼"),
    v(1, -4, 0, "상자", "south"),
  ];
}

export const FARM_SCHEMATICS: Record<string, FarmSchematic> = {
  sugar: {
    id: "sugar",
    caption: "사탕수수 — 상자·호퍼·유리 수직 모듈 (영상)",
    cameraDistance: 11,
    blocks: observerGlassModule("사탕수수", true),
  },
  bamboo: {
    id: "bamboo",
    caption: "대나무 — 사탕수수와 동일 (물 없음)",
    cameraDistance: 11,
    blocks: observerGlassModule("대나무", false),
  },
  cactus: {
    id: "cactus",
    caption: "선인장 — 4칸·울타리·물·호퍼 (영상)",
    cameraDistance: 13,
    blocks: [
      ...fillBox(-1, 1, 0, 0, -1, 1, "물"),
      v(-1, 1, -1, "모래"),
      v(-1, 2, -1, "선인장"),
      v(1, 1, -1, "모래"),
      v(1, 2, -1, "선인장"),
      v(-1, 1, 1, "모래"),
      v(-1, 2, 1, "선인장"),
      v(1, 1, 1, "모래"),
      v(1, 2, 1, "선인장"),
      v(0, 2, -1, "참나무 울타리"),
      v(0, 2, 1, "참나무 울타리"),
      v(0, 0, 2, "호퍼"),
      v(0, -1, 2, "상자", "south"),
      ...row(1, -2, ["잔디 블록", "잔디 블록", "잔디 블록"], -1),
      ...row(1, 2, ["잔디 블록", "잔디 블록", "잔디 블록"], -1),
    ],
  },
  wheat: {
    id: "wheat",
    caption: "밀·당근·감자 — 9×9 경작지·중앙 물·디스펜서·호퍼 (위키)",
    cameraDistance: 22,
    blocks: wheatFarmBlocks(),
  },
  melon: {
    id: "melon",
    caption: "수박·호박 — 줄기·열매·옵저버·피스톤·수집부 (위키 단면)",
    cameraDistance: 11,
    blocks: melonFarmBlocks(),
  },
  chicken: {
    id: "chicken",
    caption: "닭 — 회색 벽·유리·용암 도살 (영상)",
    cameraDistance: 12,
    blocks: [
      ...fillBox(-1, 1, 0, 4, -1, -1, "회색 콘크리트"),
      ...fillBox(-1, -1, 0, 4, 0, 0, "회색 콘크리트"),
      ...fillBox(-1, 1, 0, 4, 0, 0, "회색 콘크리트"),
      ...fillBox(0, 0, 1, 4, 1, 1, "유리"),
      v(0, 0, 0, "상자", "south"),
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
      v(0, 0, 0, "상자", "south"),
      v(0, 1, 0, "호퍼"),
      v(0, 2, 0, "화로", "south"),
      v(0, 3, 0, "호퍼"),
      v(0, 4, 0, "상자", "south"),
      v(-1, 2, 0, "호퍼"),
      v(-2, 2, 0, "상자", "east"),
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
      v(1, -1, 0, "상자", "east"),
    ],
  },
};

export function getFarmSchematic(id: string): FarmSchematic | undefined {
  return FARM_SCHEMATICS[id];
}
