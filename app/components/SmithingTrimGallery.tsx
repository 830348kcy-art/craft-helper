"use client";

import { useState } from "react";
import { SmartIcon } from "./SmartIcon";
import type { ArmorTrim, TrimMaterial } from "@/lib/smithing";
import { trimSampleCandidates, trimTemplateUrl } from "@/lib/wiki-images";
import { getItemTexture } from "@/lib/textures";

function TrimFullImage({ trimId, alt, className = "" }: { trimId: string; alt: string; className?: string }) {
  const [idx, setIdx] = useState(0);
  const urls = trimSampleCandidates(trimId);
  const src = urls[idx];

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (idx + 1 < urls.length) setIdx((i) => i + 1);
      }}
      className={`object-contain max-h-full w-auto ${className}`}
      draggable={false}
    />
  );
}

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
        형판은 무늬(형태)를, 광물·수정은 색상을 결정합니다. 카드를 누르면 위키와 동일한 갑옷 풀샷을 볼 수 있습니다.
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
              <div className="wiki-portal-card-icon !min-h-[100px] !p-2">
                <TrimFullImage trimId={t.id} alt={t.name} className="max-h-[88px]" />
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
          <div className="flex flex-wrap items-start gap-6 mb-6">
            <div className="flex items-center justify-center min-h-[220px] min-w-[120px] p-3 rounded-wiki bg-wiki-panel/40 border border-wiki-borderSoft/40">
              <TrimFullImage trimId={trim.id} alt={`${trim.name} 갑옷`} className="max-h-[200px]" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <SmartIcon
                  image={trimTemplateUrl(trim.id)}
                  textureId={`${trim.id}_armor_trim_smithing_template`}
                  emoji="📜"
                  size="md"
                  alt="형판"
                />
                <h3 className="text-xl font-bold">{trim.name} 갑옷 장식</h3>
              </div>
              <p className="text-[13px] text-wiki-muted">획득: {trim.source}</p>
              <p className="text-[14px] mt-2 leading-relaxed">{trim.description}</p>
            </div>
          </div>

          <h4 className="font-semibold text-[14px] mb-3">장식 재료 (색상)</h4>
          <p className="text-[12px] text-wiki-muted mb-3">
            아래 색이 갑옷 장식에 입혀집니다. 무늬 형태는 위 갑옷 풀샷과 같고, 재료만 바꾸면 색이 달라집니다.
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none pl-0">
            {materials.map((mat) => (
              <li key={mat.id} className="list-none">
                <div className="wiki-card flex items-center gap-3 p-3 h-full">
                  <span
                    className="w-8 h-8 rounded border border-black/10 shrink-0"
                    style={{ backgroundColor: mat.color }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <SmartIcon
                        image={getItemTexture(mat.itemId)}
                        textureId={mat.itemId}
                        emoji="💎"
                        size="xs"
                        alt={mat.name}
                      />
                      <span className="text-[13px] font-semibold">{mat.name}</span>
                    </div>
                    <p className="text-[10px] text-wiki-muted font-mono mt-0.5">{mat.color}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
