"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTagMemberNames, getTagLabelKo } from "@/lib/mc-tags";
import { getTextureByName, resolveByKoName } from "@/lib/textures";
import { SmartIcon } from "./SmartIcon";

const CYCLE_MS = 1400;

export function TagCyclingCell({
  tagKey,
  className = "",
}: {
  tagKey: string;
  className?: string;
}) {
  const members = getTagMemberNames(tagKey);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (members.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % members.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [members.length]);

  const current = members[idx] ?? getTagLabelKo(tagKey);
  const entry = resolveByKoName(current);
  const texture = getTextureByName(current);
  const href = entry ? `/search/${entry.id}?type=${entry.type}` : `/tag/${tagKey}`;

  return (
    <Link
      href={href}
      className={`group relative flex flex-col items-center justify-center w-full h-full ${className}`}
      title={`${getTagLabelKo(tagKey)} — 사용 가능한 재료가 순환 표시됩니다`}
    >
      <SmartIcon textureId={entry?.id} image={texture} emoji="🏷️" size="md" alt={current} />
      <span className="absolute -bottom-0.5 left-0 right-0 text-center text-[8px] font-medium text-violet-700 dark:text-violet-300 truncate px-0.5">
        {getTagLabelKo(tagKey).replace(/\s*\(#\w+\)/, "")}
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1
          whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] text-white bg-violet-900/90
          opacity-0 group-hover:opacity-100 transition-opacity z-20 max-w-[10rem] truncate"
      >
        {current}
      </span>
    </Link>
  );
}
