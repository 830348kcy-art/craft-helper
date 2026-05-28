"use client";
import { useEffect, useState } from "react";

type Item = { id: string; heading: string };

export function TableOfContents({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">목차</p>
        <ul className="space-y-1.5 text-sm border-l border-zinc-200 dark:border-zinc-800">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`block pl-3 -ml-px border-l transition-colors ${
                  activeId === it.id
                    ? "border-brand-500 text-brand-700 dark:text-brand-300 font-medium"
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {it.heading}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
