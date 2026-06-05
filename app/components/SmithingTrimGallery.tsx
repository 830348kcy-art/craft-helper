"use client";

import { useState } from "react";
import { SmartIcon } from "./SmartIcon";
import type { ArmorTrim, TrimMaterial } from "@/lib/smithing";
import {
  trimTemplateUrl,
  trimRenderUrl,
  materialTrimPreviewUrl,
} from "@/lib/wiki-images";
import { getItemTexture } from "@/lib/textures";

export function SmithingTrimGallery({
  trims,
  materials,
}: {
  trims: ArmorTrim[];
  materials: TrimMaterial[];
}) {
  const [selected, setSelected] = useState(trims[0]?.id ?? "");

  const trim = trims.find((t) => t.id === selected);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">갑옷 장식 형판 ({trims.length}종)</h2>
      <p className="text-[13px] text-wiki-muted mb-4">
        형판은 무늬(형태)를, 광물·수정은 색상을 결정합니다. 형판을 선택하면 재료별 색상 미리보기를 볼 수 있습니다.
      </p>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 list-none pl-0 mb-8">
        {trims.map((t) => (
          <li key={t.id} className="list-none">
            <button
              type="button"
              onClick={() => setSelected(t.id)}
              className={`wiki-portal-card w-full text-left ${
                selected === t.id ? "ring-2 ring-brand-500 border-brand-400" : ""
              }`}
            >
              <div className="wiki-portal-card-icon !min-h-[64px]">
                <SmartIcon
                  image={trimTemplateUrl(t.id)}
                  emoji="📜"
                  size="md"
                  alt={t.name}
                />
              </div>
              <div className="wiki-portal-card-label">
                <span className="font-semibold text-[12px]">{t.name}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {trim && (
        <div className="p-5 rounded-wiki-lg border border-wiki-borderSoft/60 bg-wiki-panel/20 mb-8">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <SmartIcon
              image={trimRenderUrl(trim.id)}
              emoji="🛡️"
              size="xl"
              alt={`${trim.name} 무늬`}
            />
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-xl font-bold">{trim.name} 갑옷 장식</h3>
              <p className="text-[13px] text-wiki-muted mt-1">획득: {trim.source}</p>
              <p className="text-[14px] mt-2 leading-relaxed">{trim.description}</p>
            </div>
          </div>

          <h4 className="font-semibold text-[14px] mb-3">재료별 색상 미리보기</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none pl-0">
            {materials.map((mat) => (
              <li key={mat.id} className="list-none">
                <div className="wiki-card p-3 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: mat.color }}
                      aria-hidden
                    />
                    <SmartIcon
                      image={getItemTexture(mat.itemId)}
                      emoji="💎"
                      size="sm"
                      alt={mat.name}
                    />
                    <span className="text-[13px] font-semibold">{mat.name}</span>
                  </div>
                  <div className="flex justify-center p-2 bg-wiki-panel/40 rounded-wiki">
                    <SmartIcon
                      image={materialTrimPreviewUrl(mat.id, mat.previewArmor)}
                      emoji="🛡️"
                      size="lg"
                      alt={`${trim.name} + ${mat.name}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-lg font-bold mb-3">장식 재료 색상표</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 list-none pl-0">
        {materials.map((mat) => (
          <li key={mat.id} className="list-none">
            <div className="wiki-card flex items-center gap-2 p-3">
              <span
                className="w-6 h-6 rounded border border-black/10 shrink-0"
                style={{ backgroundColor: mat.color }}
              />
              <div>
                <p className="text-[13px] font-semibold">{mat.name}</p>
                <p className="text-[10px] text-wiki-muted font-mono">{mat.color}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
