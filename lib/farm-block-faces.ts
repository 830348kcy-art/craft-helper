/**
 * 3D 농장 뷰어 — 블록별 6면 텍스처 (+X,-X,+Y,-Y,+Z,-Z)
 */
import { CDN, KOREAN_TO_TEXTURE } from "./textures";

export type BlockFacing = "east" | "west" | "north" | "south" | "up" | "down";

/** FarmViewer3D에서 CanvasTexture로 치환 */
export const CHEST_FRONT_MARKER = "__FARM_CHEST_FRONT__";

const P = {
  oak: "block/oak_planks.png",
  stone: "block/stone.png",
  cobble: "block/cobblestone.png",
  dirt: "block/dirt.png",
  grass: "block/grass_block_side.png",
  farmland: "block/farmland.png",
  glass: "block/glass.png",
  water: "block/water_still.png",
  rail: "block/rail.png",
  redstone: "block/redstone_dust_dot.png",
  pistonTop: "block/piston_top.png",
  pistonSide: "block/piston_side.png",
  pistonBottom: "block/piston_bottom.png",
  observerFront: "block/observer_front.png",
  observerBack: "block/observer_back.png",
  observerSide: "block/observer_side.png",
  observerTop: "block/observer_top.png",
  dispenserFront: "block/dispenser_front.png",
  furnaceFront: "block/furnace_front.png",
  furnaceSide: "block/furnace_side.png",
  furnaceTop: "block/furnace_top.png",
  hopperOutside: "block/hopper_outside.png",
  hopperTop: "block/hopper_top.png",
  sand: "block/sand.png",
  cactus: "block/cactus_side.png",
  melon: "block/melon_side.png",
  pumpkin: "block/pumpkin_side.png",
  stem: "block/attached_melon_stem.png",
  sugar: "block/sugar_cane.png",
  bamboo: "block/bamboo_stalk.png",
  wheat: "block/wheat_stage7.png",
  concrete: "block/gray_concrete.png",
  slab: "block/smooth_stone.png",
  lava: "block/lava_still.png",
  trapdoor: "block/oak_trapdoor.png",
  fence: "block/oak_planks.png",
  button: "block/oak_planks.png",
};

type FacePaths = [string, string, string, string, string, string];

function url(path: string): string {
  if (path.startsWith("http") || path.startsWith("__FARM_")) return path;
  return `${CDN}/${path}`;
}

function all(path: string): FacePaths {
  return [path, path, path, path, path, path];
}

function resolveKo(name: string): string | undefined {
  const p = KOREAN_TO_TEXTURE[name];
  if (!p || p === "") return undefined;
  return p;
}

/** head가 향하는 면에 frontTex, 반대편에 backTex */
function facedBlock(
  head: BlockFacing,
  frontTex: string,
  backTex: string,
  sideTex: string,
  topTex: string,
  bottomTex: string
): FacePaths {
  const f: FacePaths = [sideTex, sideTex, topTex, bottomTex, sideTex, sideTex];
  switch (head) {
    case "east":
      f[0] = frontTex;
      f[1] = backTex;
      break;
    case "west":
      f[1] = frontTex;
      f[0] = backTex;
      break;
    case "south":
      f[4] = frontTex;
      f[5] = backTex;
      break;
    case "north":
      f[5] = frontTex;
      f[4] = backTex;
      break;
    case "up":
      f[2] = frontTex;
      f[3] = backTex;
      break;
    case "down":
      f[3] = frontTex;
      f[2] = backTex;
      break;
  }
  return f;
}

function chestFaces(facing: BlockFacing = "south"): FacePaths {
  const side = P.oak;
  const f: FacePaths = [side, side, side, side, side, side];
  switch (facing) {
    case "south":
      f[4] = CHEST_FRONT_MARKER;
      break;
    case "north":
      f[5] = CHEST_FRONT_MARKER;
      break;
    case "east":
      f[0] = CHEST_FRONT_MARKER;
      break;
    case "west":
      f[1] = CHEST_FRONT_MARKER;
      break;
    default:
      f[4] = CHEST_FRONT_MARKER;
  }
  return f;
}

function pistonFaces(facing: BlockFacing = "west"): FacePaths {
  const vertical = facing === "up" || facing === "down";
  return facedBlock(
    facing,
    P.pistonTop,
    P.pistonSide,
    P.pistonSide,
    vertical ? P.pistonTop : P.pistonSide,
    vertical ? P.pistonBottom : P.pistonSide
  );
}

function observerFaces(facing: BlockFacing = "west"): FacePaths {
  return facedBlock(
    facing,
    P.observerFront,
    P.observerBack,
    P.observerSide,
    P.observerTop,
    P.observerTop
  );
}

function dispenserFaces(facing: BlockFacing = "south"): FacePaths {
  return facedBlock(
    facing,
    P.dispenserFront,
    P.stone,
    P.stone,
    P.stone,
    P.stone
  );
}

function furnaceFaces(facing: BlockFacing = "south"): FacePaths {
  return facedBlock(
    facing,
    P.furnaceFront,
    P.furnaceSide,
    P.furnaceSide,
    P.furnaceTop,
    P.furnaceTop
  );
}

function hopperFaces(): FacePaths {
  return [
    P.hopperOutside,
    P.hopperOutside,
    P.hopperTop,
    P.hopperOutside,
    P.hopperOutside,
    P.hopperOutside,
  ];
}

const SIMPLE: Record<string, string> = {
  흙: P.dirt,
  "잔디 블록": P.grass,
  경작지: P.farmland,
  유리: P.glass,
  물: P.water,
  레일: P.rail,
  "레드스톤 가루": P.redstone,
  "레드스톤 중계기": "block/repeater.png",
  둥근돌: P.cobble,
  모래: P.sand,
  선인장: P.cactus,
  "수박 블록": P.melon,
  "호박 블록": P.pumpkin,
  "수박 줄기": P.stem,
  사탕수수: P.sugar,
  대나무: P.bamboo,
  밀: P.wheat,
  "회색 콘크리트": P.concrete,
  "돌 반 블록": P.slab,
  용암: P.lava,
  트랩도어: P.trapdoor,
  "참나무 울타리": P.fence,
  버튼: P.button,
  판자: P.oak,
  닭: "item/egg.png",
};

function defaultFacing(blockName: string): BlockFacing | undefined {
  switch (blockName) {
    case "상자":
      return "south";
    case "피스톤":
    case "옵저버":
      return "west";
    case "디스펜서":
      return "south";
    case "화로":
      return "south";
    default:
      return undefined;
  }
}

export function getBlockFaceUrls(
  blockName: string,
  facing?: BlockFacing
): string[] {
  const f = facing ?? defaultFacing(blockName);

  let paths: FacePaths;
  switch (blockName) {
    case "상자":
      paths = chestFaces(f ?? "south");
      break;
    case "피스톤":
      paths = pistonFaces(f ?? "west");
      break;
    case "옵저버":
      paths = observerFaces(f ?? "west");
      break;
    case "디스펜서":
      paths = dispenserFaces(f ?? "south");
      break;
    case "화로":
      paths = furnaceFaces(f ?? "south");
      break;
    case "호퍼":
      paths = hopperFaces();
      break;
    default: {
      const ko = resolveKo(blockName);
      const simple = SIMPLE[blockName] ?? ko ?? P.stone;
      paths = all(simple);
      break;
    }
  }

  return paths.map(url);
}

export function isTransparentBlock(blockName: string): boolean {
  return blockName === "물" || blockName === "유리";
}

export function farmBlockFallbackColor(blockName: string): number {
  const colors: Record<string, number> = {
    상자: 0x9a7b4f,
    유리: 0xc8e8ff,
    물: 0x3f76e4,
    호퍼: 0x5a5a5a,
  };
  return colors[blockName] ?? 0x888888;
}
