/**
 * textures-config 공용 상수 (순환 import 방지)
 */
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const root = resolve(__dirname, "..");

export const CDN =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures";

export const USE_CDN = process.env.CI === "true";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const ASSETS_SOURCE =
  process.env.MINECRAFT_ASSETS ??
  "D:/InventivetalentDev minecraft-assets 1.21.4 assets-minecraft_textures";

export const ASSETS_BLOCK = resolve(ASSETS_SOURCE, "block");
export const ASSETS_ITEM = resolve(ASSETS_SOURCE, "item");

export function sourceExists() {
  return existsSync(ASSETS_BLOCK) || existsSync(ASSETS_ITEM) || existsSync(ASSETS_SOURCE);
}
