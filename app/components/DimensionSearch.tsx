"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  filterSearchIndex,
  loadSearchIndex,
  type SearchIndexItem,
} from "@/lib/search-client";
import type { DimensionId } from "@/lib/catalog-taxonomy";
import { SmartIcon } from "./SmartIcon";

const TYPE_LABEL: Record<string, string> = {
  block: "블록",
  item: "아이템",
  mob: "몹",
  biome: "바이옴",
};
const TYPE_COLOR: Record<string, string> = {
  block: "bg-amber-100 text-amber-700",
  item: "bg-blue-100 text-blue-700",
  mob: "bg-emerald-100 text-emerald-700",
  biome: "bg-green-100 text-green-800",
};

function shortSummary(name: string, desc: string): string {
  if (desc.startsWith(name + ".")) return desc.slice(name.length + 1).trim();
  if (desc.startsWith(name)) return desc.slice(name.length).replace(/^[.\s]+/, "").trim();
  return desc;
}

export function DimensionSearch({
  dimension,
  placeholder,
}: {
  dimension: DimensionId;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSearchIndex()
      .then((all) => setIndex(all.filter((e) => e.dimension === dimension)))
      .catch(() => setIndex([]));
  }, [dimension]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setOpen(false);
        return;
      }
      setResults(filterSearchIndex(index, q));
      setOpen(true);
    },
    [index]
  );

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  return (
    <div ref={boxRef} className="relative mb-6">
      <div className="flex items-center h-11 rounded-wiki border border-wiki-borderSoft dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 shadow-sm">
        <span className="text-sm shrink-0">🔎</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder ?? `${dimension} 차원 내 검색…`}
          className="flex-1 px-2 text-sm bg-transparent outline-none"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setOpen(false); }} className="text-xs text-zinc-400">
            ✕
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl divide-y divide-zinc-100 dark:divide-zinc-800">
          {results.slice(0, 8).map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <button
                type="button"
                onClick={() => {
                  router.push(r.href);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full grid grid-cols-[auto_1fr] gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left"
              >
                <SmartIcon image={r.image} textureId={r.id} emoji={r.emoji} size="md" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-wiki-text dark:text-zinc-100">{r.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TYPE_COLOR[r.type] ?? ""}`}>
                      {TYPE_LABEL[r.type] ?? r.type}
                    </span>
                    {r.category && (
                      <span className="text-[10px] text-zinc-500">{r.category}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                    {shortSummary(r.name, r.description)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
