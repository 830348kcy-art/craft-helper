"use client";

import { useState } from "react";
import { SmartIcon } from "./SmartIcon";
import { TrimColorPreview } from "./TrimColorPreview";
import type { ArmorTrim, TrimMaterial } from "@/lib/smithing";
import { trimSampleCandidates, trimTemplateUrl } from "@/lib/wiki-images";
import { getItemTexture } from "@/lib/textures";

function TrimThumb({ trimId, alt }: { trimId: string; alt: string }) {
  const [idx, setIdx] = useState(0);
  const src = trimSampleCandidates(trimId)[idx];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className="object-contain max-h-[72px] w-auto mx-auto"
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
  const [selectedTrim, setSelectedTrim] = useState(trims[0]?.id ?? "");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]?.id ?? "");

  const trim = trims.find((t) => t.id === selectedTrim);
  const material = materials.find((m) => m.id === selectedMaterial);

  return (
    <div className="space-y-6">
      {/* ── 미리보기 패널 ── */}
      {trim && material && (
        <section className="rounded-wiki-lg border border-wiki-borderSoft/70 dark:border-zinc-700/70 bg-gradient-to-br from-wiki-panel/50 to-white dark:from-zinc-900/60 dark:to-zinc-900/30 overflow-hidden">
          <div className="px-5 py-3 border-b border-wiki-borderSoft/50 dark:border-zinc-700/50 flex flex-wrap items-center gap-2">
            <span className="wiki-badge">미리보기</span>
            <span className="text-[15px] font-bold">
              {trim.name} + {material.name}
            </span>
            <span
              className="inline-flex items-center gap-1.5 ml-auto text-[12px] text-wiki-muted"
            >
              <span
                className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: material.color }}
                aria-hidden
              />
              {material.color}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-0">
            <div className="flex items-center justify-center min-h-[280px] sm:min-h-[340px] p-6 sm:p-8 bg-[#2a2a2e]/90 dark:bg-[#1a1a1e]">
              <TrimColorPreview
                trimId={trim.id}
                materialColor={material.color}
                alt={`${trim.name} 갑옷 장식 · ${material.name} 색상`}
                maxHeight={300}
              />
            </div>

            <div className="p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-wiki-borderSoft/50 dark:border-zinc-700/50 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <SmartIcon
                  image={trimTemplateUrl(trim.id)}
                  textureId={`${trim.id}_armor_trim_smithing_template`}
                  emoji="📜"
                  size="md"
                  alt={trim.name}
                />
                <div>
                  <p className="font-bold text-[15px]">{trim.name}</p>
                  <p className="text-[11px] text-wiki-muted">형판 무늬</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SmartIcon
                  image={getItemTexture(material.itemId)}
                  textureId={material.itemId}
                  emoji="💎"
                  size="md"
                  alt={material.name}
                />
                <div>
                  <p className="font-bold text-[15px]">{material.name}</p>
                  <p className="text-[11px] text-wiki-muted">장식 색상</p>
                </div>
              </div>
              <hr className="border-wiki-borderSoft/40 dark:border-zinc-700/40" />
              <p className="text-[12px] text-wiki-muted leading-relaxed">
                획득: {trim.source}
              </p>
              <p className="text-[13px] leading-relaxed flex-1">{trim.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── 선택 영역 ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 형판 */}
        <section>
          <h2 className="text-[15px] font-bold mb-1 flex items-center gap-2">
            <span>① 형판 선택</span>
            <span className="text-[12px] font-normal text-wiki-muted">{trims.length}종</span>
          </h2>
          <p className="text-[12px] text-wiki-muted mb-3">무늬 형태를 결정합니다.</p>
          <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 list-none pl-0 max-h-[420px] overflow-y-auto pr-1">
            {trims.map((t) => (
              <li key={t.id} className="list-none">
                <button
                  type="button"
                  onClick={() => setSelectedTrim(t.id)}
                  className={`wiki-portal-card w-full text-left transition-shadow ${
                    selectedTrim === t.id
                      ? "ring-2 ring-brand-500 border-brand-400 shadow-md"
                      : ""
                  }`}
                >
                  <div className="wiki-portal-card-icon !min-h-[80px] !p-1.5 bg-[#3a3a3e]/80">
                    <TrimThumb trimId={t.id} alt={t.name} />
                  </div>
                  <div className="wiki-portal-card-label py-2">
                    <span className="font-semibold text-[11px] leading-tight">{t.name}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 재료 */}
        <section>
          <h2 className="text-[15px] font-bold mb-1 flex items-center gap-2">
            <span>② 장식 재료 선택</span>
            <span className="text-[12px] font-normal text-wiki-muted">{materials.length}종</span>
          </h2>
          <p className="text-[12px] text-wiki-muted mb-3">장식에 입혀질 색상을 결정합니다.</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none pl-0">
            {materials.map((mat) => (
              <li key={mat.id} className="list-none">
                <button
                  type="button"
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`wiki-card w-full flex items-center gap-3 p-3 text-left transition-all ${
                    selectedMaterial === mat.id
                      ? "ring-2 ring-brand-500 border-brand-400 shadow-md"
                      : "hover:shadow-wiki"
                  }`}
                >
                  <span
                    className="w-10 h-10 rounded-lg border border-black/10 shrink-0 shadow-inner"
                    style={{ backgroundColor: mat.color }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
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
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
