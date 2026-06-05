const WIKI = "https://minecraft.wiki/images";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function toPascal(id: string): string {
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("_");
}

/** 바이옴 스프라이트 (위키) */
export function biomeSpriteUrl(biomeId: string): string {
  return `${WIKI}/BiomeSprite_${biomeId.replace(/_/g, "-")}.png?format=original`;
}

/** 로컬에 저장된 갑옷 장식 풀샷 (sync-trim-renders.mjs) */
export function trimSampleLocalUrl(trimId: string): string {
  return `${BASE}/images/trims/${trimId}.png`;
}

/** 갑옷 본체 실루엣 (bolt 풀샷 — trim-only 에셋 합성용) */
export function trimBaseArmorUrl(): string {
  return `${BASE}/images/trims/bolt.png`;
}

/** 위키 갑옷 장식 풀샷 — 파일명은 trim별로 다름 */
const TRIM_SAMPLE_WIKI: Record<string, string> = {
  bolt: "Armor_Trim_Bolt_(sample_model).png",
  coast: "Armor_Trim_Coast_(sample_model).png",
  dune: "Armor_Trim_Dune_(sample_model)_JE2_BE2.png",
  eye: "Armor_Trim_Eye_(sample_model).png",
  flow: "Armor_Trim_Flow_(sample_model).png",
  host: "Armor_Trim_Host_(sample_model).png",
  raiser: "Armor_Trim_Raiser_(sample_model).png",
  rib: "Armor_Trim_Rib_(sample_model).png",
  sentry: "Armor_Trim_Dune_(sample_model)_JE1_BE1.png",
  shaper: "Armor_Trim_Shaper_(sample_model).png",
  silence: "Armor_Trim_Silence_(sample_model).png",
  snout: "Armor_Trim_Snout_(sample_model).png",
  spire: "Armor_Trim_Spire_(sample_model).png",
  tide: "Armor_Trim_Tide_(sample_model).png",
  vex: "Armor_Trim_Vex_(sample_model).png",
  ward: "Armor_Trim_Ward_(sample_model).png",
  wayfinder: "Armor_Trim_Wayfinder_(sample_model).png",
  wild: "Armor_Trim_Wild_(sample_model).png",
};

export function trimSampleWikiUrl(trimId: string): string {
  const file = TRIM_SAMPLE_WIKI[trimId];
  if (!file) return trimSampleLocalUrl(trimId);
  return `${WIKI}/${file}?format=original`;
}

/** 형판·갑옷 장식 미리보기 후보 (로컬 풀샷 우선) */
export function trimSampleCandidates(trimId: string): string[] {
  return [trimSampleLocalUrl(trimId), trimSampleWikiUrl(trimId)];
}

/** 대장장이 형판 Invicon */
export function trimTemplateUrl(trimId: string): string {
  return `${WIKI}/Invicon_${toPascal(trimId)}_Armor_Trim.png?format=original`;
}

/** 장식 재료 Invicon (위키 — CDN 차단 환경에서도 안정적) */
const MATERIAL_INVICON: Record<string, string> = {
  amethyst_shard: "Invicon_Amethyst_Shard.png",
  copper_ingot: "Invicon_Copper_Ingot.png",
  diamond: "Invicon_Diamond.png",
  emerald: "Invicon_Emerald.png",
  gold_ingot: "Invicon_Gold_Ingot.png",
  iron_ingot: "Invicon_Iron_Ingot.png",
  lapis_lazuli: "Invicon_Lapis_Lazuli.png",
  quartz: "Invicon_Nether_Quartz.png",
  netherite_ingot: "Invicon_Netherite_Ingot.png",
  redstone: "Invicon_Redstone.png",
  resin_brick: "Invicon_Resin_Brick.png",
};

export function trimMaterialInviconUrl(itemId: string): string | undefined {
  const file = MATERIAL_INVICON[itemId];
  if (!file) return undefined;
  return `${WIKI}/${file}?format=original`;
}

/** 형판·재료 아이콘 후보 (위키 Invicon 우선) */
export function trimMaterialIconCandidates(itemId: string, cdnUrl?: string): string[] {
  const out: string[] = [];
  const inv = trimMaterialInviconUrl(itemId);
  if (inv) out.push(inv);
  if (cdnUrl) out.push(cdnUrl);
  return out;
}
