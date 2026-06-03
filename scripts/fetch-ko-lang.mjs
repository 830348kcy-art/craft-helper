/**
 * 공식 ko_kr.json 다운로드 → scripts/ko-lang-official.json
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const URL =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.21.4/assets/minecraft/lang/ko_kr.json";

const raw = await fetch(URL).then((r) => {
  if (!r.ok) throw new Error(`ko_kr fetch failed: ${r.status}`);
  return r.json();
});

const blocks = {};
const items = {};

for (const [key, value] of Object.entries(raw)) {
  if (key.startsWith("block.minecraft.")) {
    blocks[key.slice("block.minecraft.".length)] = value;
  } else if (key.startsWith("item.minecraft.")) {
    items[key.slice("item.minecraft.".length)] = value;
  }
}

const out = { blocks, items, fetchedAt: new Date().toISOString() };
writeFileSync(
  resolve(__dirname, "ko-lang-official.json"),
  JSON.stringify(out, null, 2),
  "utf-8"
);
console.log(
  `fetch-ko-lang: blocks ${Object.keys(blocks).length}, items ${Object.keys(items).length}`
);
