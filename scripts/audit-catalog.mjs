/**
 * 카탈로그 한글화·텍스처 적용 상태 감사
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";
import { getBlockImageUrl, getItemImageUrl } from "./textures-config.mjs";
import { idToKoName } from "./ko-utils.mjs";

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));

function hasKorean(text) {
  return /[가-힣]/.test(text ?? "");
}

function looksEnglish(name) {
  return !hasKorean(name) && /^[A-Za-z0-9 ()\-_.]+$/.test(name ?? "");
}

function isLocalPath(url) {
  return url.startsWith("/") && !url.startsWith("http");
}

function localExists(url) {
  if (!isLocalPath(url)) return true;
  const rel = url.replace(/^\//, "");
  return existsSync(resolve(root, "public", rel));
}

async function cdnOk(url) {
  if (!url.startsWith("http")) return localExists(url);
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

const englishBlocks = blocks.filter((b) => looksEnglish(b.name));
const englishItems = items.filter((i) => looksEnglish(i.name));

console.log("=== 한글화 ===");
console.log(`블록: ${blocks.length - englishBlocks.length}/${blocks.length} 한글 (${englishBlocks.length} 영문)`);
console.log(`아이템: ${items.length - englishItems.length}/${items.length} 한글 (${englishItems.length} 영문)`);

if (englishBlocks.length > 0) {
  console.log("\n영문 블록 샘플 (최대 15):");
  englishBlocks.slice(0, 15).forEach((b) => console.log(`  ${b.id} → ${b.name} (기대: ${idToKoName(b.id)})`));
}

if (englishItems.length > 0) {
  console.log("\n영문 아이템 샘플 (최대 15):");
  englishItems.slice(0, 15).forEach((i) => console.log(`  ${i.id} → ${i.name} (기대: ${idToKoName(i.id)})`));
}

console.log("\n=== 텍스처 URL (샘플 CDN 검증) ===");
const sampleIds = [
  "andesite_slab",
  "activator_rail",
  "oak_boat",
  "creeper_spawn_egg",
  "brain_coral_block",
  "grass_block",
  "diamond_sword",
];
for (const id of sampleIds) {
  const url = getBlockImageUrl(id);
  const ok = await cdnOk(url);
  console.log(`  ${id}: ${ok ? "OK" : "FAIL"} → ${url}`);
}

const blockUrls = blocks.map((b) => getBlockImageUrl(b.id));
const localMissing = blockUrls.filter((u) => isLocalPath(u) && !localExists(u)).length;
const cdnUrls = blockUrls.filter((u) => u.startsWith("http")).length;
console.log(`\n블록 이미지 URL: 로컬 ${blockUrls.length - cdnUrls - localMissing}, CDN 폴백 ${cdnUrls}, 로컬 404 ${localMissing}`);

const itemSample = items.slice(0, 30);
let itemOk = 0;
for (const it of itemSample) {
  if (await cdnOk(getItemImageUrl(it.id))) itemOk++;
}
console.log(`아이템 CDN 샘플 (30개): ${itemOk}/30 OK`);
