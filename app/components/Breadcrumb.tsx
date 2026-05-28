import Link from "next/link";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-[12px] text-wiki-muted dark:text-zinc-400 mb-3">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {it.href && !last ? (
                <Link href={it.href} className="text-link dark:text-link-dark hover:underline">
                  {it.label}
                </Link>
              ) : (
                <span className={last ? "text-wiki-text dark:text-zinc-200 font-medium" : ""}>{it.label}</span>
              )}
              {!last && <span className="text-wiki-muted">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
