import { readFileSync } from "fs";
import { resolve } from "path";
import { root } from "./textures-config-root.mjs";
import { getBlockImageUrl, getItemImageUrl } from "./textures-config.mjs";

const blocks = JSON.parse(readFileSync(resolve(root, "data/blocks.json"), "utf-8"));
const items = JSON.parse(readFileSync(resolve(root, "data/items.json"), "utf-8"));

async function ok(url) {
  if (url.startsWith("/")) return true;
  try {
    return (await fetch(url, { method: "HEAD" })).ok;
  } catch {
    return false;
  }
}

let blockOk = 0;
for (const b of blocks) {
  if (await ok(getBlockImageUrl(b.id))) blockOk++;
}

let itemOk = 0;
const itemFail = [];
for (const it of items) {
  const url = getItemImageUrl(it.id);
  if (await ok(url)) itemOk++;
  else if (itemFail.length < 15) itemFail.push({ id: it.id, url });
}

console.log(`블록 텍스처: ${blockOk}/${blocks.length}`);
console.log(`아이템 텍스처: ${itemOk}/${items.length}`);
if (itemFail.length) {
  console.log("아이템 실패 샘플:", itemFail);
}
