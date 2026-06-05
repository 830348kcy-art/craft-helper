"use client";

import { useSearchParams } from "next/navigation";
import { WikiBackBar } from "./WikiBackBar";
import { mobListBackPath, mobListBackLabel } from "@/lib/mob-taxonomy";

export function MobDetailBack({
  dimension,
  dimName,
}: {
  dimension: string;
  dimName: string;
}) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const href = from ? mobListBackPath(from) : `/dimension/${dimension}?section=mobs`;
  const label = from ? mobListBackLabel(from) : `${dimName} · 몹 목록`;

  return <WikiBackBar href={href} label={label} variant="hero" />;
}
