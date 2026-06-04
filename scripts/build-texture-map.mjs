/**
 * 모든 카탈로그 ID에 대해 CDN/Wiki HEAD 검사 → texture-url-map + 품질 감사 리포트
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";
import {
  getTextureCandidateUrls,
  getWikiSpriteUrl,
  isShapeBlock,
  isColorMaterial,
  CDN,
} from "./texture-candidates.mjs";

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));
const nameById = new Map([
  ...blocks.map((b) => [b.id, b.name]),
  ...items.map((i) => [i.id, i.name]),
]);

const allIds = new Set([
  ...blocks.map((b) => b.id),
  ...items.map((i) => i.id),
]);

const urlCache = new Map();
const FETCH_HEADERS = { "User-Agent": "CraftHelper/1.0 (texture-map)" };

async function urlExists(url) {
  if (urlCache.has(url)) return urlCache.get(url);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "HEAD",
        headers: FETCH_HEADERS,
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        urlCache.set(url, true);
        return true;
      }
    } catch {
      /* retry */
    }
  }
  urlCache.set(url, false);
  return false;
}

const MANUAL_FALLBACKS = {
  air: "block/stone.png",
  cave_air: "block/stone.png",
  void_air: "block/stone.png",
  crossbow: "item/bow.png",
  shield: "item/iron_chestplate.png",
  enchanted_golden_apple: "item/golden_apple.png",
  creeper_head: "item/spawn_egg.png",
  creeper_wall_head: "item/spawn_egg.png",
  dragon_head: "item/dragon_breath.png",
  dragon_wall_head: "item/dragon_breath.png",
  piglin_head: "item/gold_ingot.png",
  piglin_wall_head: "item/gold_ingot.png",
  player_head: "item/golden_helmet.png",
  player_wall_head: "item/golden_helmet.png",
  zombie_head: "item/rotten_flesh.png",
  zombie_wall_head: "item/rotten_flesh.png",
  skeleton_skull: "item/bone.png",
  skeleton_wall_skull: "item/bone.png",
  wither_skeleton_skull: "item/coal.png",
  wither_skeleton_wall_skull: "item/coal.png",
  decorated_pot: "block/flower_pot.png",
  dried_ghast: "block/soul_sand.png",
  dried_kelp_block: "block/kelp.png",
  end_gateway: "block/end_stone.png",
  end_portal: "block/end_stone.png",
  firefly_bush: "block/oak_leaves.png",
  frosted_ice: "block/ice.png",
  leaf_litter: "block/oak_leaves.png",
  moss_carpet: "block/moss_block.png",
  moving_piston: "block/piston_top.png",
  piston_head: "block/piston_top.png",
  potted_bamboo: "block/bamboo_stalk.png",
  potted_cactus: "block/cactus_side.png",
  short_dry_grass: "block/short_grass.png",
  tall_dry_grass: "block/short_grass.png",
  snow_block: "block/snow.png",
  stripped_bamboo_log: "block/bamboo_block.png",
  stripped_bamboo_wood: "block/bamboo_block.png",
  torchflower_crop: "block/wheat_stage7.png",
  wildflowers: "block/poppy.png",
};

function classifyQuality(id, url) {
  if (!url) return "missing";

  const file = url.split("/").pop()?.split("?")[0] ?? "";

  if (MANUAL_FALLBACKS[id] && url.includes(MANUAL_FALLBACKS[id].replace("block/", "").replace("item/", ""))) {
    return "substitute";
  }

  if (url.includes("minecraft.wiki")) {
    return isShapeBlock(id) ? "ok_wiki_shape" : "wiki_fallback";
  }

  if (isShapeBlock(id)) {
    if (file.includes("_planks") || file.endsWith("planks.png")) return "wrong_shape";
    if (id.endsWith("_stairs") || id.endsWith("_slab")) return "ok";
  }

  if (isColorMaterial(id)) {
    const idUnderscore = id.replace(/-/g, "_");
    if (file.includes(id) || file.replace(/-/g, "_") === idUnderscore) return "ok";
    const color = id.match(/^(white|orange|magenta|light_blue|yellow|lime|pink|gray|light_gray|cyan|purple|blue|brown|green|red|black)/)?.[0];
    if (color && !file.includes(color.replace("_", "-")) && !file.includes(color)) {
      return "wrong_color";
    }
  }

  if (MANUAL_FALLBACKS[id]) return "substitute";
  return "ok";
}

async function resolveBestUrl(id) {
  for (const url of getTextureCandidateUrls(id)) {
    if (await urlExists(url)) return url;
  }
  const manual = MANUAL_FALLBACKS[id];
  if (manual) {
    const url = `${CDN}/${manual}`;
    if (await urlExists(url)) return url;
  }
  const wiki = getWikiSpriteUrl(id);
  if (await urlExists(wiki)) return wiki;
  return null;
}

async function mapWithConcurrency(ids, fn, limit = 12) {
  const arr = [...ids];
  const results = new Map();
  let i = 0;
  async function worker() {
    while (i < arr.length) {
      const idx = i++;
      results.set(arr[idx], await fn(arr[idx]));
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}

console.log(`[build-texture-map] ${allIds.size}개 ID 검사 중…`);
const resolved = await mapWithConcurrency(allIds, resolveBestUrl);

const map = {};
const audit = { ok: [], ok_wiki_shape: [], wiki_fallback: [], substitute: [], wrong_shape: [], wrong_color: [], missing: [] };

for (const [id, url] of resolved) {
  const quality = classifyQuality(id, url);
  const entry = { id, name: nameById.get(id) ?? id, url: url ?? null, quality };
  audit[quality]?.push(entry);
  if (url) map[id] = url;
}

writeFileSync(resolve(root, "scripts/texture-url-map.json"), JSON.stringify(map, null, 0), "utf-8");

const reportPath = resolve(root, "scripts/texture-audit-report.json");
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: Object.fromEntries(
        Object.entries(audit).map(([k, v]) => [k, v.length])
      ),
      imperfect: [
        ...audit.missing,
        ...audit.wrong_shape,
        ...audit.wrong_color,
        ...audit.substitute,
        ...audit.wiki_fallback,
      ],
      details: audit,
    },
    null,
    2
  ),
  "utf-8"
);

const koPath = resolve(root, "scripts/texture-audit-report-ko.txt");
const koLines = [
  "# Craft Helper 텍스처 감사 리포트",
  `생성: ${new Date().toISOString()}`,
  "",
  "## 요약",
  `- 정상(CDN): ${audit.ok.length}개`,
  `- 정상(Wiki 계단/반블록 등): ${audit.ok_wiki_shape.length}개`,
  `- Wiki 폴백(색상 등): ${audit.wiki_fallback.length}개`,
  `- 대체 이미지: ${audit.substitute.length}개`,
  `- URL 없음: ${audit.missing.length}개`,
  "",
];

const sections = [
  ["missing", "URL 없음 — 아이콘 표시 불가"],
  ["substitute", "대체 이미지 — 유사 블록으로 대체됨"],
  ["wiki_fallback", "Wiki 스프라이트 — CDN에 없어 Wiki 사용"],
  ["wrong_shape", "형태 오류"],
  ["wrong_color", "색상 오류"],
];

for (const [key, title] of sections) {
  const items = audit[key];
  if (!items?.length) continue;
  koLines.push(`## ${title} (${items.length}개)`);
  for (const it of items) {
    koLines.push(`- ${it.name} (${it.id})`);
  }
  koLines.push("");
}

writeFileSync(koPath, koLines.join("\n"), "utf-8");

console.log(
  `[build-texture-map] URL ${Object.keys(map).length}/${allIds.size}, ` +
    `미흡 ${audit.missing.length + audit.wrong_shape.length + audit.wrong_color.length + audit.substitute.length + audit.wiki_fallback.length}건`
);
console.log("품질:", JSON.stringify(Object.fromEntries(Object.entries(audit).map(([k, v]) => [k, v.length]))));
console.log(`→ scripts/texture-url-map.json, ${reportPath}`);
