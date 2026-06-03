/**
 * 빌드 스크립트 공용 텍스처 설정
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

export const CDN =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";

export const USE_CDN = process.env.CI === "true";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const textureMap = JSON.parse(
  readFileSync(resolve(__dirname, "texture-map.json"), "utf-8")
);

/** CDN block path (block/foo.png) */
export function cdnBlockPath(id) {
  const mapped = textureMap[id];
  if (mapped) return `block/${mapped}`;
  return `block/${id}.png`;
}

/** CDN item path */
export function cdnItemPath(id) {
  const ITEM_OVERRIDES = {
    sword_diamond: "item/diamond_sword.png",
    sword_netherite: "item/netherite_sword.png",
    sword_iron: "item/iron_sword.png",
    pickaxe_iron: "item/iron_pickaxe.png",
    pickaxe_diamond: "item/diamond_pickaxe.png",
    nether_quartz: "item/quartz.png",
    eye_of_ender: "item/ender_eye.png",
    totem: "item/totem_of_undying.png",
    boat: "item/oak_boat.png",
    compass: "item/compass_00.png",
    clock: "item/clock_00.png",
    map: "item/map.png",
  };
  return ITEM_OVERRIDES[id] ?? `item/${id}.png`;
}

export function getBlockImageUrl(id) {
  if (USE_CDN) return `${CDN}/${cdnBlockPath(id)}`;
  return `${BASE_PATH}/images/blocks/${id}.png`;
}

export function getItemImageUrl(id) {
  return `${CDN}/${cdnItemPath(id)}`;
}

export function getSourcePngForBlock(id) {
  if (textureMap[id]) return textureMap[id];
  return `${id}.png`;
}

export { textureMap, root };

export const ASSETS_SOURCE =
  process.env.MINECRAFT_ASSETS ??
  "C:/minecraft_textures/minecraft_assets";

export function sourceExists() {
  return existsSync(ASSETS_SOURCE);
}
