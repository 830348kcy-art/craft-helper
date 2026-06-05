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
