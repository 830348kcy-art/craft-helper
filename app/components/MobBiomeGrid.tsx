import Link from "next/link";
import { SmartIcon } from "./SmartIcon";
import type { MobEntry, BiomeEntry } from "@/lib/encyclopedia";
import { getMobImage, getBiomeImage } from "@/lib/encyclopedia";

export function MobGrid({ mobs }: { mobs: MobEntry[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none pl-0">
      {mobs.map((m) => (
        <li key={m.id} className="list-none">
          <Link
            href={`/mob/${m.id}`}
            className="wiki-card-hover flex items-start gap-3 p-4 no-underline h-full"
          >
            <SmartIcon image={getMobImage(m)} emoji={m.emoji} size="lg" alt={m.name} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[14px] text-wiki-text dark:text-zinc-100">{m.name}</p>
              <p className="text-[11px] text-wiki-muted mt-0.5">{m.category} · HP {m.health}</p>
              <p className="text-[12px] text-wiki-muted dark:text-zinc-400 mt-1 line-clamp-2">{m.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function BiomeGrid({ biomes }: { biomes: BiomeEntry[] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none pl-0">
      {biomes.map((b) => (
        <li key={b.id} className="list-none">
          <Link
            href={`/biome/${b.id}`}
            className="wiki-card-hover flex items-start gap-3 p-4 no-underline h-full"
          >
            <SmartIcon image={getBiomeImage(b)} emoji={b.emoji} size="lg" alt={b.name} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[14px] text-wiki-text dark:text-zinc-100">{b.name}</p>
              <p className="text-[12px] text-wiki-muted dark:text-zinc-400 mt-1 line-clamp-2">{b.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
