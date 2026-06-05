"use client";

import { useSearchParams } from "next/navigation";
import { WikiBackBar } from "./WikiBackBar";
import { mobListBackPath, mobListBackLabel } from "@/lib/mob-taxonomy";

export function MobBackBar() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  return <WikiBackBar href={mobListBackPath(from)} label={mobListBackLabel(from)} />;
}
