/**
 * 빌드 전에 실행 — 검색 인덱스를 public/search-index.json으로 저장.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import {
  getBlockImageUrl,
  getItemImageUrl,
  root,
} from "./textures-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function readJSON(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf-8"));
}

function inferDimension(id) {
  if (/^(end_|purpur|chorus|dragon|elytra|shulker|end_stone|end_rod|end_portal)/.test(id))
    return "end";
  if (
    /^(nether|netherrack|soul_|crimson|warped|magma|basalt|blackstone|gilded|ancient|blaze|ghast|hoglin|piglin|quartz|strider|respawn_anchor|lodestone|shroom)/.test(
      id
    )
  )
    return "nether";
  return "overworld";
}

const ENTITY_CDN = {
  blaze: "blaze.png",
  snow_golem: "snow_golem.png",
  endermite: "endermite.png",
  phantom: "phantom.png",
  wither_skeleton: "skeleton/wither_skeleton.png",
  zombified_piglin: "piglin/piglin.png",
  cave_spider: "spider/cave_spider.png",
  ender_dragon: "enderdragon/dragon.png",
  glow_squid: "squid/glow_squid.png",
  iron_golem: "iron_golem/iron_golem.png",
};

function mobEntityUrl(id) {
  const base =
    "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/textures/entity";
  const custom = ENTITY_CDN[id];
  if (custom) return `${base}/${custom}`;
  return `${base}/${id}/${id}.png`;
}

function shortDesc(name, desc) {
  if (desc.startsWith(name + ".")) return desc.slice(name.length + 1).trim();
  if (desc.startsWith(name)) return desc.slice(name.length).replace(/^[.\s]+/, "").trim();
  return desc;
}

const blocks = readJSON("data/blocks.json");
const items = readJSON("data/items.json");
const recipes = readJSON("data/recipes.json");
const mobs = readJSON("data/mobs.json");
const mobRenders = readJSON("data/mob-renders.json");
const biomes = readJSON("data/biomes.json");

const index = [
  ...blocks.map((b) => ({
    id: b.id,
    type: "block",
    name: b.name,
    description: shortDesc(b.name, b.description),
    emoji: b.emoji || "🟫",
    image: getBlockImageUrl(b.id),
    category: b.category,
    tags: b.tags || [],
    href: `/search/${b.id}?type=block`,
    dimension: inferDimension(b.id),
  })),
  ...items.map((it) => ({
    id: it.id,
    type: "item",
    name: it.name,
    description: shortDesc(it.name, it.description),
    emoji: it.emoji || "📦",
    image: getItemImageUrl(it.id),
    category: it.category,
    tags: it.tags || [],
    href: `/search/${it.id}?type=item`,
    dimension: inferDimension(it.id),
  })),
  ...recipes.map((r) => ({
    id: r.id,
    type: "recipe",
    name: r.name,
    description: shortDesc(r.name, r.description),
    emoji: r.emoji || "📜",
    image: getItemImageUrl(r.id),
    category: r.category,
    tags: r.tags || [],
    href: `/search/${r.id}?type=recipe`,
    dimension: inferDimension(r.id),
  })),
  ...mobs.map((m) => ({
    id: m.id,
    type: "mob",
    name: m.name,
    description: m.description,
    emoji: m.emoji || "🐾",
    image: mobRenders[m.id] ?? mobEntityUrl(m.id),
    category: m.category,
    tags: ["몹", m.category],
    href: `/mob/${m.id}`,
    dimension: m.dimension,
  })),
  ...biomes.map((b) => ({
    id: b.id,
    type: "biome",
    name: b.name,
    description: b.description,
    emoji: b.emoji || "🌿",
    image: b.blocks?.[0] ? getBlockImageUrl(b.blocks[0]) : undefined,
    category: b.group ? `바이옴 · ${b.group}` : "바이옴",
    tags: ["바이옴", b.group].filter(Boolean),
    href: `/biome/${b.id}`,
    dimension: b.dimension,
  })),
];

const outPath = resolve(root, "public", "search-index.json");
writeFileSync(outPath, JSON.stringify(index), "utf-8");
console.log(`search-index.json: ${index.length} entries -> ${outPath}`);
