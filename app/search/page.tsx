"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SmartIcon } from "@/app/components/SmartIcon";
import { Breadcrumb } from "@/app/components/Breadcrumb";

import { filterSearchIndex, loadSearchIndex, type SearchIndexItem } from "@/lib/search-client";

const TYPE_LABEL: Record<string, string> = { block: "블록", item: "아이템", recipe: "레시피" };
const TYPE_COLOR: Record<string, string> = {
  block:  "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  item:   "bg-blue-100  text-blue-800  dark:bg-blue-900/40  dark:text-blue-200",
  recipe: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand-200 dark:bg-brand-700/50 text-inherit rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadSearchIndex().then(setIndex).catch(() => setIndex([]));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const handleInput = useCallback((val: string) => {
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      const params = new URLSearchParams();
      if (val) params.set("q", val);
      router.replace(`/search${val ? `?${params}` : ""}`, { scroll: false });
    }, 200);
  }, [router]);

  const results = query.trim() ? filterSearchIndex(index, query) : [];

  const groups = [
    { key: "block",  label: "블록",   data: results.filter((r) => r.type === "block")  },
    { key: "item",   label: "아이템", data: results.filter((r) => r.type === "item")   },
    { key: "recipe", label: "레시피", data: results.filter((r) => r.type === "recipe") },
  ].filter((g) => g.data.length > 0);

  return (
    <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 bg-wiki-bg dark:bg-zinc-950 min-h-[80vh]">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "검색 결과" }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {query ? (
            <>&ldquo;<span className="text-brand-600 dark:text-brand-400">{query}</span>&rdquo; 검색 결과</>
          ) : "검색"}
        </h1>
        {query && <p className="text-sm text-zinc-500">합계 <strong>{results.length}</strong>건</p>}

        <div className="mt-4 flex gap-2 max-w-xl">
          <div className="flex-1 flex items-center h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 focus-within:ring-2 focus-within:ring-brand-500">
            <span className="text-zinc-400">🔎</span>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="블록·아이템·레시피 검색..."
              className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-zinc-400"
              autoFocus
            />
          </div>
        </div>
      </div>

      {groups.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {groups.map((g) => (
            <a key={g.key} href={`#${g.key}`} className={`px-3 py-1 rounded-full text-sm font-medium ${TYPE_COLOR[g.key]}`}>
              {g.label} {g.data.length}건
            </a>
          ))}
        </div>
      )}

      {query && results.length === 0 && index.length > 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-lg mb-1">&ldquo;{query}&rdquo;에 대한 결과가 없습니다</p>
          <p className="text-sm text-zinc-500">다른 키워드로 검색해보세요.</p>
          <Link href="/" className="mt-4 inline-block text-link dark:text-link-dark hover:underline text-sm">
            메인으로 →
          </Link>
        </div>
      )}

      {index.length === 0 && (
        <div className="text-center py-12 text-zinc-400">검색 인덱스 로딩 중…</div>
      )}

      {groups.map((g) => (
        <section key={g.key} id={g.key} className="mb-10 scroll-mt-20">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[g.key]}`}>
              {TYPE_LABEL[g.key]}
            </span>
            <span className="text-zinc-500 font-normal text-sm">{g.data.length}건</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {g.data.map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <Link href={r.href} className="group flex items-start gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <SmartIcon image={r.image} textureId={r.id} emoji={r.emoji} size="lg" framed className="mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-link dark:text-link-dark truncate">{r.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{r.category}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {highlight(r.description, query)}
                    </p>
                    {r.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.tags.slice(0, 4).map((t) => (
                          <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            t.toLowerCase().includes(query.toLowerCase())
                              ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          }`}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-400">로딩 중…</div>}>
      <SearchContent />
    </Suspense>
  );
}
