"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  filterSearchIndex,
  loadSearchIndex,
  type SearchIndexItem,
} from "@/lib/search-client";
import { SmartIcon } from "./SmartIcon";

const TYPE_COLOR: Record<string, string> = {
  block:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  item:   "bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300",
  recipe: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};
const TYPE_LABEL: Record<string, string> = { block: "블록", item: "아이템", recipe: "레시피" };

export function SearchBox({ placeholder = "블록, 아이템, 레시피 검색…", className = "" }: { placeholder?: string; className?: string }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSearchIndex().then(setIndex).catch(() => setIndex([]));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const data = filterSearchIndex(index, q);
    setResults(data);
    setOpen(true);
    setLoading(false);
  }, [index]);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const resultHref = (r: SearchIndexItem) =>
    r.href.includes("type=") ? r.href : `${r.href}?type=${r.type}`;

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit}>
        <div className={`flex items-center h-9 rounded-sm border bg-white px-3 transition-all ${
          focused ? "border-white ring-2 ring-white/40" : "border-white/30"
        }`}>
          <span className="text-zinc-500 text-sm shrink-0">
            {loading ? <span className="animate-spin inline-block">⏳</span> : "🔎"}
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (results.length) setOpen(true); }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="bg-transparent flex-1 px-2 text-sm text-wiki-text outline-none placeholder:text-zinc-400"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }} className="text-zinc-400 hover:text-zinc-600 text-xs ml-1">✕</button>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
          <ul className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {results.slice(0, 8).map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <button
                  type="button"
                  onClick={() => { router.push(resultHref(r)); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left transition"
                >
                  <SmartIcon image={r.image} textureId={r.id} emoji={r.emoji} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{r.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${TYPE_COLOR[r.type]}`}>
                        {TYPE_LABEL[r.type]}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{r.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {results.length > 8 && (
            <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <button
                type="button"
                onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setOpen(false); }}
                className="text-sm text-link dark:text-link-dark hover:underline"
              >
                &ldquo;{query}&rdquo; 전체 결과 {results.length}건 보기 →
              </button>
            </div>
          )}
        </div>
      )}

      {open && query && results.length === 0 && !loading && index.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl px-4 py-4 text-sm text-zinc-500 text-center">
          &ldquo;{query}&rdquo; 검색 결과 없음
        </div>
      )}
    </div>
  );
}
