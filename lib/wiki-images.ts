const WIKI = "https://minecraft.wiki/images";

function toPascal(id: string): string {
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("_");
}

/** 몹 스프라이트 (위키 MobSprite) */
export function mobSpriteUrl(mobId: string): string {
  const sprite = mobId.replace(/_/g, "-");
  return `${WIKI}/MobSprite_${sprite}.png?format=original`;
}

/** 바이옴 스프라이트 */
export function biomeSpriteUrl(biomeId: string): string {
  return `${WIKI}/BiomeSprite_${biomeId.replace(/_/g, "-")}.png?format=original`;
}

/** 대장장이 형판 아이콘 */
export function trimTemplateUrl(trimId: string): string {
  return `${WIKI}/Invicon_${toPascal(trimId)}_Armor_Trim_Smithing_Template.png?format=original`;
}

/** 갑옷 장식 무늬 렌더 (형태) */
export function trimRenderUrl(trimId: string): string {
  return `${WIKI}/${toPascal(trimId)}_armor_trim.png?format=original`;
}

/** 재료+갑옷 조합 미리보기 (색상) — 위키 Invicon */
export function materialTrimPreviewUrl(
  materialId: string,
  armorPascal = "Iron_Chestplate"
): string {
  const mat = toPascal(materialId);
  return `${WIKI}/Invicon_${mat}_Trim_${armorPascal}.png?format=original`;
}
