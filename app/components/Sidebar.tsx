import Link from "next/link";
import { categories, docs } from "@/lib/data";
import { SmartIcon } from "./SmartIcon";
import { getCategoryTexture } from "@/lib/textures";

export function Sidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r border-wiki-borderSoft/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
      <div className="sticky top-[6.75rem] max-h-[calc(100vh-6.75rem)] overflow-y-auto py-6 px-4 text-[13px]">
        <SidebarSection title="둘러보기">
          <SidebarLink href="/">대문</SidebarLink>
          <SidebarLink href="/wiki/getting-started">처음 시작하기</SidebarLink>
          <SidebarLink href="/search">검색</SidebarLink>
        </SidebarSection>

        <SidebarSection title="문서">
          {Object.values(docs).map((d) => (
            <li key={d.slug}>
              <Link
                href={`/wiki/${d.slug}`}
                className={`block px-3 py-1.5 rounded-wiki transition-colors ${
                  activeSlug === d.slug
                    ? "bg-brand-100/80 dark:bg-brand-900/40 font-semibold text-brand-900 dark:text-brand-100 shadow-sm"
                    : "text-link dark:text-link-dark hover:bg-white/60 dark:hover:bg-zinc-800/60"
                }`}
              >
                {d.title}
              </Link>
            </li>
          ))}
        </SidebarSection>

        <SidebarSection title="분류">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-wiki text-link dark:text-link-dark hover:bg-white/70 dark:hover:bg-zinc-800/70 transition-colors"
              >
                <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="xs" alt={c.name} />
                <span className="font-medium">{c.name}</span>
              </Link>
            </li>
          ))}
        </SidebarSection>
      </div>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-700/80 dark:text-brand-400/80 px-3 pb-2 mb-1">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="block px-3 py-1.5 rounded-wiki font-medium text-link dark:text-link-dark hover:bg-white/70 dark:hover:bg-zinc-800/70 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
