"use client";

import { SmartIcon } from "./SmartIcon";

type OreSection = {
  id: string;
  heading: string;
  html: string;
};

/** 광물별 분포 — 아이콘 + 설명 카드 레이아웃 */
const ORE_TEXTURES: Record<string, string> = {
  intro: "diamond_ore",
  coal: "coal_ore",
  iron: "iron_ore",
  copper: "copper_ore",
  gold: "gold_ore",
  redstone: "redstone_ore",
  lapis: "lapis_ore",
  diamond: "diamond",
  emerald: "emerald_ore",
  netherite: "ancient_debris",
};

export function OreDistributionContent({ sections }: { sections: OreSection[] }) {
  const [intro, ...ores] = sections;

  return (
    <div className="ore-distribution">
      {intro && (
        <div
          id={intro.id}
          className="ore-intro prose-wiki scroll-mt-24"
          dangerouslySetInnerHTML={{ __html: intro.html }}
        />
      )}

      <div className="ore-grid">
        {ores.map((section) => {
          const textureId = ORE_TEXTURES[section.id] ?? "diamond_ore";
          const title = section.heading.replace(/^\d+\.\s*/, "");
          return (
            <article key={section.id} id={section.id} className="ore-card scroll-mt-24">
              <div className="ore-card-icon">
                <SmartIcon
                  textureId={textureId}
                  emoji="💎"
                  size="lg"
                  alt={title}
                  framed
                />
              </div>
              <div className="ore-card-body prose-wiki">
                <h3 className="ore-card-title">{title}</h3>
                <div dangerouslySetInnerHTML={{ __html: section.html }} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
