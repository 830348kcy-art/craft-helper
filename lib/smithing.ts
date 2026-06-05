import smithingJson from "../data/smithing-trims.json";

export type TrimMaterial = {
  id: string;
  name: string;
  itemId: string;
  color: string;
  previewArmor: string;
};

export type ArmorTrim = {
  id: string;
  name: string;
  templateId: string;
  source: string;
  description: string;
};

const data = smithingJson as { materials: TrimMaterial[]; trims: ArmorTrim[] };

export function getTrimMaterials(): TrimMaterial[] {
  return data.materials;
}

export function getArmorTrims(): ArmorTrim[] {
  return data.trims;
}

export function getTrimById(id: string): ArmorTrim | undefined {
  return data.trims.find((t) => t.id === id);
}

const templateNameById = new Map<string, string>(
  data.trims.map((t) => [t.templateId, `${t.name} 형판`])
);
templateNameById.set("netherite_upgrade_smithing_template", "네더라이트 강화 형판");

/** 대장장이 형판 아이템 ID → 한글 표시명 (예: 나사 형판) */
export function getSmithingTemplateName(templateId: string): string | undefined {
  return templateNameById.get(templateId);
}
