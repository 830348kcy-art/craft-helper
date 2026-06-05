/**
 * 위키 갑옷 장식 풀샷 → public/images/trims/
 */
import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/images/trims");
mkdirSync(outDir, { recursive: true });

/** trim id → 위키 파일 제목 */
const TRIMS = {
  bolt: "File:Armor Trim Bolt (sample model).png",
  coast: "File:Armor Trim Coast (sample model).png",
  dune: "File:Armor Trim Dune (sample model) JE2 BE2.png",
  eye: "File:Armor Trim Eye (sample model).png",
  flow: "File:Armor Trim Flow (sample model).png",
  host: "File:Armor Trim Host (sample model).png",
  raiser: "File:Armor Trim Raiser (sample model).png",
  rib: "File:Armor Trim Rib (sample model).png",
  sentry: "File:Armor Trim Dune (sample model) JE1 BE1.png",
  shaper: "File:Armor Trim Shaper (sample model).png",
  silence: "File:Armor Trim Silence (sample model).png",
  snout: "File:Armor Trim Snout (sample model).png",
  spire: "File:Armor Trim Spire (sample model).png",
  tide: "File:Armor Trim Tide (sample model).png",
  vex: "File:Armor Trim Vex (sample model).png",
  ward: "File:Armor Trim Ward (sample model).png",
  wayfinder: "File:Armor Trim Wayfinder (sample model).png",
  wild: "File:Armor Trim Wild (sample model).png",
};

async function fetchWikiUrl(title) {
  const api =
    "https://minecraft.wiki/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=imageinfo&iiprop=url&format=json";
  const res = await fetch(api, { headers: { "User-Agent": "craft-helper/1.0" } });
  const json = await res.json();
  const page = Object.values(json.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.url;
}

let ok = 0;
for (const [id, title] of Object.entries(TRIMS)) {
  const url = await fetchWikiUrl(title);
  if (!url) {
    console.warn(`[sync-trim-renders] URL 없음: ${id}`);
    continue;
  }
  const img = await fetch(url, { headers: { "User-Agent": "craft-helper/1.0" } });
  if (!img.ok) {
    console.warn(`[sync-trim-renders] 다운로드 실패 ${id}: ${img.status}`);
    continue;
  }
  writeFileSync(resolve(outDir, `${id}.png`), Buffer.from(await img.arrayBuffer()));
  ok++;
  console.log(`[sync-trim-renders] ${id}.png`);
}

console.log(`[sync-trim-renders] 완료: ${ok}/${Object.keys(TRIMS).length}`);
