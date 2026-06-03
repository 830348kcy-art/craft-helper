/**
 * 로컬 minecraft 텍스처 폴더(block/, item/) 기반 PNG 파일 탐색
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { ASSETS_SOURCE, ASSETS_BLOCK, ASSETS_ITEM } from "./textures-config-root.mjs";

let fileSet = null;

function scanDir(dir, prefix) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".png")) fileSet.add(`${prefix}/${f}`);
  }
}

export function loadAssetIndex(sourceDir = ASSETS_SOURCE) {
  if (fileSet) return fileSet;
  fileSet = new Set();

  scanDir(ASSETS_BLOCK, "block");
  scanDir(ASSETS_ITEM, "item");

  const listPath = resolve(sourceDir, "_list.json");
  if (existsSync(listPath)) {
    const data = JSON.parse(readFileSync(listPath, "utf-8"));
    for (const f of data.files ?? []) {
      if (f.endsWith(".png")) fileSet.add(f.includes("/") ? f : `block/${f}`);
    }
  }

  if (fileSet.size === 0 && existsSync(sourceDir)) {
    for (const f of readdirSync(sourceDir)) {
      if (f.endsWith(".png")) fileSet.add(`block/${f}`);
    }
  }
  return fileSet;
}

const SIDE_SUFFIXES = [
  "",
  "_side",
  "_top",
  "_bottom",
  "_front",
  "_planks",
  "_log",
  "_block",
];

function withPrefix(name, prefix) {
  if (name.includes("/")) return name;
  return `${prefix}/${name}`;
}

/**
 * 블록/아이템 ID와 CDN 파일명 후보로 로컬 assets에서 실제 PNG 찾기
 * 반환값: "block/foo.png" 또는 "item/bar.png"
 */
export function findAssetPng(id, preferredFile, prefix = "block") {
  const files = loadAssetIndex();
  if (!files.size) return withPrefix(preferredFile, prefix);

  const candidates = [];
  const add = (name) => {
    const full = withPrefix(name, prefix);
    if (name && !candidates.includes(full)) candidates.push(full);
    if (name && !name.includes("/") && !candidates.includes(name)) {
      candidates.push(name);
    }
  };

  add(preferredFile);
  add(`${id}.png`);

  for (const suf of SIDE_SUFFIXES) {
    add(`${id}${suf}.png`);
  }

  if (preferredFile) {
    const baseName = preferredFile.replace(/^block\/|^item\//, "").replace(/\.png$/, "");
    for (const suf of SIDE_SUFFIXES) {
      if (baseName.endsWith(suf) && suf) {
        const root = baseName.slice(0, -suf.length);
        add(`${root}.png`);
        add(`${root}_side.png`);
        add(`${root}_top.png`);
      }
    }
  }

  const parts = id.split("_");
  if (parts.length > 1) {
    add(`${parts[0]}_planks.png`);
  }

  for (const c of candidates) {
    if (files.has(c)) return c;
    const bare = c.replace(/^block\/|^item\//, "");
    if (files.has(`block/${bare}`)) return `block/${bare}`;
    if (files.has(`item/${bare}`)) return `item/${bare}`;
  }

  for (const f of files) {
    const bare = f.replace(/^block\/|^item\//, "");
    if (bare.startsWith(`${id}_`) && bare.endsWith(".png")) return f;
  }

  return withPrefix(preferredFile, prefix);
}
