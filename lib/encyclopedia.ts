import mobsJson from "../data/mobs.json";
import biomesJson from "../data/biomes.json";
import type { DimensionId } from "./catalog-taxonomy";
import { getBlockTexture, getItemTexture } from "./textures";
import { mobSpriteUrl, biomeSpriteUrl } from "./wiki-images";

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
  group?: string;
  temperature?: number;
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

/** 몹 대표 이미지 (위키 스프라이트 우선) */
export function getMobImage(mob: MobEntry): string {
  return mobSpriteUrl(mob.id);
}

export function getBiomeImage(biome: BiomeEntry): string {
  return biomeSpriteUrl(biome.id);
}

export function getBiomesByGroup(dimension: DimensionId): Map<string, BiomeEntry[]> {
  const map = new Map<string, BiomeEntry[]>();
  for (const b of getBiomesByDimension(dimension)) {
    const g = b.group ?? "기타";
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(b);
  }
  return map;
}
