/**
 * 로컬 minecraft_assets/_list.json 기반 PNG 파일 탐색
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";
import { ASSETS_SOURCE } from "./textures-config-root.mjs";

let fileSet = null;

export function loadAssetIndex(sourceDir = ASSETS_SOURCE) {
  if (fileSet) return fileSet;
  fileSet = new Set();

  const listPath = resolve(sourceDir, "_list.json");
  if (existsSync(listPath)) {
    const data = JSON.parse(readFileSync(listPath, "utf-8"));
    for (const f of data.files ?? []) {
      if (f.endsWith(".png")) fileSet.add(f);
    }
    return fileSet;
  }

  if (existsSync(sourceDir)) {
    for (const f of readdirSync(sourceDir)) {
      if (f.endsWith(".png")) fileSet.add(f);
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

/**
 * 블록 ID와 CDN 파일명 후보로 로컬 assets에서 실제 PNG 찾기
 */
export function findAssetPng(id, preferredFile) {
  const files = loadAssetIndex();
  if (!files.size) return preferredFile;

  const candidates = [];
  const add = (name) => {
    if (name && !candidates.includes(name)) candidates.push(name);
  };

  add(preferredFile);
  add(`${id}.png`);

  for (const suf of SIDE_SUFFIXES) {
    add(`${id}${suf}.png`);
  }

  if (preferredFile) {
    const base = preferredFile.replace(/\.png$/, "");
    for (const suf of SIDE_SUFFIXES) {
      if (base.endsWith(suf) && suf) {
        const root = base.slice(0, -suf.length);
        add(`${root}.png`);
        add(`${root}_side.png`);
        add(`${root}_top.png`);
      }
    }
  }

  // oak_button → oak_planks.png 등
  const parts = id.split("_");
  if (parts.length > 1) {
    add(`${parts[0]}_planks.png`);
  }

  for (const c of candidates) {
    if (files.has(c)) return c;
  }

  // 접두사 일치 (sniffer_egg → sniffer_egg_not_cracked_top.png)
  for (const f of files) {
    if (f.startsWith(`${id}_`) && f.endsWith(".png")) return f;
  }

  return preferredFile;
}
