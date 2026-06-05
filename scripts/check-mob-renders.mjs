import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const renders = JSON.parse(readFileSync(resolve(root, "data/mob-renders.json"), "utf-8"));
const bad = [];

for (const [id, rel] of Object.entries(renders)) {
  const p = resolve(root, "public", rel.replace(/^\//, ""));
  if (!existsSync(p)) {
    bad.push(`${id}: missing ${p}`);
    continue;
  }
  if (rel.endsWith(".gif")) continue;
  try {
    const png = PNG.sync.read(readFileSync(p));
    const r = png.width / png.height;
    if (r > 2.4 || r < 0.35 || (png.width > 420 && png.height < 180)) {
      bad.push(`${id}: ${png.width}x${png.height} ratio=${r.toFixed(2)}`);
    }
  } catch {
    bad.push(`${id}: parse error`);
  }
}

console.log(bad.length ? bad.join("\n") : `all ok (${Object.keys(renders).length} mobs)`);
