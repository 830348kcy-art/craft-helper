import Link from "next/link";
import { CatalogLink } from "./CatalogLink";
import { SmartIcon } from "./SmartIcon";
import type { SearchResultItem } from "@/lib/search";

const TYPE_LABEL: Record<string, string> = { block: "블록", item: "아이템", recipe: "레시피" };
const TYPE_COLOR: Record<string, string> = {
  block:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  item:   "bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300",
  recipe: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

export function RelatedItems({
  title,
  emoji,
  image,
  items,
  emptyText,
}: {
  title: string;
  emoji: string;
  image?: string;
  items: SearchResultItem[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    if (!emptyText) return null;
    return (
      <section className="mt-8">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <SmartIcon image={image} emoji={emoji} size="sm" alt={title} /> {title}
        </h2>
        <p className="text-sm text-zinc-500">{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <SmartIcon image={image} emoji={emoji} size="sm" alt={title} /> {title}
        </h2>
        <span className="text-xs text-zinc-500">{items.length}개</span>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((it) => (
          <li key={`${it.type}-${it.id}`}>
            <CatalogLink
              href={it.href}
              className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
            >
              <SmartIcon textureId={it.id} image={it.image} emoji={it.emoji} size="md" framed />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate">{it.name}</p>
                  <span className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${TYPE_COLOR[it.type]}`}>
                    {TYPE_LABEL[it.type]}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">{it.category}</p>
              </div>
            </CatalogLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
