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

/** 선인장 — 영상: 5×5 구덩이·4모래+선인장·십자 울타리·바닥 물·호퍼 */
function cactusFarmBlocks(): FarmVoxel[] {
  const blocks: FarmVoxel[] = [];
  const sand = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ] as const;

  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (Math.abs(x) === 2 || Math.abs(z) === 2) {
        blocks.push(v(x, 0, z, "흙"));
      }
    }
  }

  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      const isSand = sand.some(([sx, sz]) => sx === x && sz === z);
      blocks.push(v(x, -1, z, isSand ? "모래" : "물"));
    }
  }

  for (const [sx, sz] of sand) {
    blocks.push(v(sx, 0, sz, "선인장"));
  }

  for (const [fx, fz] of [
    [0, 0],
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ] as const) {
    blocks.push(v(fx, 1, fz, "참나무 울타리"));
  }

  blocks.push(v(0, -2, 0, "호퍼"));
  blocks.push(v(0, -3, 0, "상자", "south"));
  return blocks;
}

/** 밀·당근·감자 — 영상: 7×8 경작지·북 디스펜서·남 호퍼·중앙 반블록 물원 */
function wheatFarmBlocks(): FarmVoxel[] {
  const blocks: FarmVoxel[] = [];
  const halfW = 3;
  const depth = 8;

  for (let x = -halfW - 1; x <= halfW + 1; x++) {
    for (let z = -1; z <= depth + 1; z++) {
      const edge =
        x === -halfW - 1 ||
        x === halfW + 1 ||
        z === -1 ||
        z === depth + 1;
      if (edge) blocks.push(v(x, 0, z, "잔디 블록"));
    }
  }

  for (let x = -halfW; x <= halfW; x++) {
    for (let z = 1; z <= depth; z++) {
      blocks.push(v(x, 0, z, "경작지"));
      blocks.push(v(x, 1, z, "밀"));
    }
  }

  blocks.push(v(0, 0, 4, "물"));
  blocks.push(v(0, 1, 4, "돌 반 블록"));

  for (let x = -halfW; x <= halfW; x++) {
    blocks.push(v(x, 1, 0, "디스펜서", "south"));
    blocks.push(v(x, -1, depth + 1, "호퍼"));
  }

  blocks.push(v(0, -2, depth + 1, "상자", "north"));
  blocks.push(v(halfW + 1, 1, depth, "버튼"));
  blocks.push(v(halfW + 1, 1, 4, "레드스톤 가루"));
  blocks.push(v(halfW + 1, 1, 5, "레드스톤 가루"));
  blocks.push(v(halfW + 1, 1, 6, "레드스톤 가루"));
  blocks.push(v(halfW, 1, 0, "옵저버", "south"));
  blocks.push(v(halfW + 1, 1, depth + 1, "판자"));
  blocks.push(v(halfW + 1, 1, depth, "판자"));

  return blocks;
}

/** 수박·호박 — 영상: P-O-P-O-P 줄·앞 경작지·물도랑·수집부 */
function melonFarmBlocks(): FarmVoxel[] {
  const blocks: FarmVoxel[] = [];
  const units = [-4, -2, 0, 2, 4];

  for (const x of units) {
    blocks.push(v(x, 0, 0, "피스톤", "south"));
  }
  for (const x of [-3, -1, 1, 3]) {
    blocks.push(v(x, 0, 0, "옵저버", "south"));
    blocks.push(v(x, 0, -1, "경작지"));
    blocks.push(v(x, 1, -1, "수박 줄기"));
  }
  for (const x of units) {
    blocks.push(v(x, 0, -1, "수박 블록"));
    blocks.push(v(x, 1, 1, "판자"));
  }
  for (let x = -4; x <= 4; x++) {
    blocks.push(v(x, 0, -2, "물"));
  }

  blocks.push(v(0, -3, -1, "호퍼"));
  blocks.push(v(0, -4, -1, "상자", "south"));
  return blocks;
}

/** AFK 낚시 — 위키: 1×1 물·옆 호퍼 2개·아래 상자 */
function fishingFarmBlocks(): FarmVoxel[] {
  return [
    ...fillBox(-1, 1, 0, 0, -1, 1, "둥근돌"),
    v(0, 0, 0, "물"),
    v(1, 0, 0, "호퍼"),
    v(1, -1, 0, "호퍼"),
    v(1, -2, 0, "상자", "east"),
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
    caption: "선인장 — 4모래·십자 울타리·물 바닥·호퍼 (영상)",
    cameraDistance: 10,
    blocks: cactusFarmBlocks(),
  },
  wheat: {
    id: "wheat",
    caption: "밀·당근·감자 — 7×8·디스펜서·호퍼·반블록 물원 (영상)",
    cameraDistance: 18,
    blocks: wheatFarmBlocks(),
  },
  melon: {
    id: "melon",
    caption: "수박·호박 — P-O-P 줄·경작지·물도랑 (영상)",
    cameraDistance: 14,
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
    caption: "AFK 낚시 — 1×1 물·호퍼 2개·상자 (위키)",
    cameraDistance: 9,
    blocks: fishingFarmBlocks(),
  },
};

export function getFarmSchematic(id: string): FarmSchematic | undefined {
  return FARM_SCHEMATICS[id];
}
