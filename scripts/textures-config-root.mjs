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
  "C:/minecraft_textures/minecraft_assets";

export function sourceExists() {
  return existsSync(ASSETS_SOURCE);
}
