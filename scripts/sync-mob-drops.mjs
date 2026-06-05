/**
 * minecraft-data entityLoot + 수동 보정 → data/mobs.json drops 필드
 * drops: [{ id, min, max, rare? }]
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mcData from "minecraft-data";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobsPath = resolve(root, "data/mobs.json");
const mobs = JSON.parse(readFileSync(mobsPath, "utf-8"));
const mc = mcData("1.21.4");

/** stackSizeRange 보정 (minecraft-data 단순화 오류) */
const RANGE_OVERRIDES = {
  chicken: { feather: [0, 2], chicken: [1, 1] },
  cow: { leather: [0, 2], beef: [1, 3] },
  pig: { porkchop: [1, 3] },
  sheep: { mutton: [1, 2], white_wool: [1, 1], wool: [1, 1] },
  skeleton: { bone: [0, 2], arrow: [0, 2] },
  stray: { bone: [0, 2], arrow: [0, 2] },
  zombie: { rotten_flesh: [0, 2] },
  husk: { rotten_flesh: [0, 2] },
  drowned: { rotten_flesh: [0, 2], copper_ingot: [0, 2] },
  spider: { string: [0, 2] },
  cave_spider: { string: [0, 2] },
  creeper: { gunpowder: [0, 2] },
  enderman: { ender_pearl: [0, 1] },
  blaze: { blaze_rod: [0, 1] },
  ghast: { ghast_tear: [0, 1] },
  witch: { glowstone_dust: [0, 2], redstone: [0, 2], gunpowder: [0, 2], glass_bottle: [0, 2] },
  slime: { slime_ball: [0, 2] },
  magma_cube: { magma_cream: [0, 2] },
  phantom: { phantom_membrane: [0, 1] },
  wither_skeleton: { bone: [0, 2], coal: [0, 1] },
  hoglin: { porkchop: [0, 1], leather: [0, 1] },
  zoglin: { rotten_flesh: [0, 1] },
  piglin: { gold_nugget: [0, 1] },
  zombified_piglin: { rotten_flesh: [0, 1], gold_nugget: [0, 1] },
  shulker: { shulker_shell: [0, 1] },
  evoker: { totem_of_undying: [0, 1] },
  vindicator: { emerald: [0, 1] },
  pillager: { crossbow: [0, 1] },
  ravager: { saddle: [0, 1] },
  warden: { sculk_catalyst: [0, 1] },
  goat: { goat_horn: [0, 2] },
  rabbit: { rabbit: [0, 1], rabbit_hide: [0, 1], rabbit_foot: [0, 1] },
};

/** 처치 드롭이 아닌 항목 제외 */
const EXCLUDE_ITEMS = {
  chicken: ["egg"],
  squid: [],
  glow_squid: [],
};

/** loot 데이터 없는 몹 수동 정의 */
const MANUAL_DROPS = {
  bogged: [
    { id: "bone", min: 0, max: 2 },
    { id: "arrow", min: 0, max: 2 },
    { id: "tipped_arrow", min: 0, max: 1, rare: true },
  ],
  breeze: [
    { id: "breeze_rod", min: 0, max: 1 },
  ],
  iron_golem: [{ id: "iron_ingot", min: 3, max: 5 }],
  snow_golem: [{ id: "snowball", min: 0, max: 15 }],
  villager: [],
  wandering_trader: [],
  allay: [],
  sniffer: [],
  bat: [],
  dolphin: [],
  polar_bear: [],
  panda: [],
  turtle: [{ id: "seagrass", min: 0, max: 2 }],
};

function lootToDrops(mobId) {
  if (MANUAL_DROPS[mobId]) return MANUAL_DROPS[mobId];

  const loot = mc.entityLoot[mobId];
  if (!loot?.drops?.length) return [];

  const exclude = new Set(EXCLUDE_ITEMS[mobId] ?? []);
  const overrides = RANGE_OVERRIDES[mobId] ?? {};
  const out = [];

  for (const d of loot.drops) {
    if (!d.item || exclude.has(d.item)) continue;
    const ov = overrides[d.item];
    const [min, max] = ov ?? d.stackSizeRange ?? [1, 1];
    const entry = {
      id: d.item,
      min,
      max,
    };
    if (d.dropChance != null && d.dropChance < 1) entry.rare = true;
    if (d.playerKill) entry.playerKill = true;
    out.push(entry);
  }

  return out;
}

for (const mob of mobs) {
  mob.drops = lootToDrops(mob.id);
}

writeFileSync(mobsPath, JSON.stringify(mobs, null, 2) + "\n", "utf-8");
console.log(`[sync-mob-drops] ${mobs.length}몹 드롭 범위 갱신`);
