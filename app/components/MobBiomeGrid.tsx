import Link from "next/link";
import { SmartIcon } from "./SmartIcon";
import type { MobEntry, BiomeEntry } from "@/lib/encyclopedia";
import { getMobImageCandidates, getBiomeImageCandidates } from "@/lib/encyclopedia";
import {
  MOB_GROUP_ORDER,
  getMobCategoryLabel,
  getMobCategoryDesc,
  type MobCategoryId,
} from "@/lib/mob-taxonomy";

export function MobGrid({ mobs }: { mobs: MobEntry[] }) {
  const groups = new Map<string, MobEntry[]>();
  for (const m of mobs) {
    if (!groups.has(m.category)) groups.set(m.category, []);
    groups.get(m.category)!.push(m);
  }
  const sortedGroups = [...groups.entries()].sort(
    (a, b) =>
      MOB_GROUP_ORDER.indexOf(a[0] as MobCategoryId) -
      MOB_GROUP_ORDER.indexOf(b[0] as MobCategoryId)
  );

  return (
    <div className="space-y-8">
      {sortedGroups.map(([category, list]) => (
        <section key={category}>
          <h3 className="text-[15px] font-bold mb-1 flex items-center gap-2 flex-wrap">
            <span className="wiki-badge">{getMobCategoryLabel(category)}</span>
            <span className="text-wiki-muted font-normal text-[12px]">{list.length}개</span>
          </h3>
          {getMobCategoryDesc(category) && (
            <p className="text-[12px] text-wiki-muted mb-3">{getMobCategoryDesc(category)}</p>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none pl-0">
            {list.map((m) => (
              <li key={m.id} className="list-none">
                <Link
                  href={`/mob/${m.id}`}
                  className="wiki-card-hover flex items-start gap-3 p-4 no-underline h-full"
                >
                  <SmartIcon
                    images={getMobImageCandidates(m)}
                    emoji={m.emoji}
                    size="lg"
                    alt={m.name}
                    framed
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[14px] text-wiki-text dark:text-zinc-100">
                      {m.name}
                    </p>
                    <p className="text-[11px] text-wiki-muted mt-0.5">HP {m.health}</p>
                    <p className="text-[12px] text-wiki-muted dark:text-zinc-400 mt-1 line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function BiomeGrid({ biomes }: { biomes: BiomeEntry[] }) {
  const groups = new Map<string, BiomeEntry[]>();
  for (const b of biomes) {
    const g = b.group ?? "기타";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(b);
  }
  const sortedGroups = [...groups.entries()];

  return (
    <div className="space-y-8">
      {sortedGroups.map(([group, list]) => (
        <section key={group}>
          <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2">
            <span className="wiki-badge">{group}</span>
            <span className="text-wiki-muted font-normal text-[12px]">{list.length}개</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none pl-0">
            {list.map((b) => (
              <li key={b.id} className="list-none">
                <Link
                  href={`/biome/${b.id}`}
                  className="wiki-card-hover flex items-start gap-3 p-4 no-underline h-full"
                >
                  <SmartIcon images={getBiomeImageCandidates(b)} emoji={b.emoji} size="lg" alt={b.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[14px] text-wiki-text dark:text-zinc-100">{b.name}</p>
                    {b.temperature !== undefined && (
                      <p className="text-[11px] text-wiki-muted mt-0.5">온도 {b.temperature}</p>
                    )}
                    <p className="text-[12px] text-wiki-muted dark:text-zinc-400 mt-1 line-clamp-2">{b.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
