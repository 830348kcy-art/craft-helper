import mobsJson from "../data/mobs.json";
import biomesJson from "../data/biomes.json";
import type { DimensionId } from "./catalog-taxonomy";
import { getBlockTexture, getItemTexture } from "./textures";

export type MobEntry = {
  id: string;
  name: string;
  dimension: DimensionId;
  emoji: string;
  category: string;
  health: number;
  drops: string[];
  spawn: string;
  traits: string;
  description: string;
};

export type BiomeEntry = {
  id: string;
  name: string;
  dimension: DimensionId;
  emoji: string;
  blocks: string[];
  mobs: string[];
  traits: string;
  description: string;
};

const MOBS = mobsJson as MobEntry[];
const BIOMES = biomesJson as BiomeEntry[];

export function getAllMobs(): MobEntry[] {
  return MOBS;
}

export function getAllBiomes(): BiomeEntry[] {
  return BIOMES;
}

export function getMobById(id: string): MobEntry | undefined {
  return MOBS.find((m) => m.id === id);
}

export function getBiomeById(id: string): BiomeEntry | undefined {
  return BIOMES.find((b) => b.id === id);
}

export function getMobsByDimension(dimension: DimensionId): MobEntry[] {
  return MOBS.filter((m) => m.dimension === dimension);
}

export function getBiomesByDimension(dimension: DimensionId): BiomeEntry[] {
  return BIOMES.filter((b) => b.dimension === dimension);
}

/** 몹 대표 텍스처 (드롭 아이템 또는 이모지) */
export function getMobImage(mob: MobEntry): string | undefined {
  const drop = mob.drops[0];
  if (!drop) return undefined;
  return getItemTexture(drop) ?? getBlockTexture(drop);
}

export function getBiomeImage(biome: BiomeEntry): string | undefined {
  const block = biome.blocks[0];
  if (!block) return undefined;
  return getBlockTexture(block);
}
