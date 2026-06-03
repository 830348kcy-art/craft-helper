import Link from "next/link";
import { categories, docs } from "@/lib/data";
import { SmartIcon } from "./SmartIcon";
import { getCategoryTexture } from "@/lib/textures";

export function Sidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-wiki-border dark:border-zinc-700 bg-wiki-bg dark:bg-zinc-950">
      <div className="sticky top-[6.5rem] max-h-[calc(100vh-6.5rem)] overflow-y-auto py-5 px-3 text-[13px]">

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
                className={`block px-2 py-1 rounded-sm hover:underline ${
                  activeSlug === d.slug
                    ? "bg-wiki-panel dark:bg-zinc-800 font-bold text-wiki-text dark:text-zinc-100"
                    : "text-link dark:text-link-dark"
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
                className="flex items-center gap-2 px-2 py-1 rounded-sm text-link dark:text-link-dark hover:underline"
              >
                <SmartIcon image={getCategoryTexture(c.slug)} emoji={c.emoji} size="xs" alt={c.name} />
                <span>{c.name}</span>
              </Link>
            </li>
          ))}
        </SidebarSection>

        <SidebarSection title="도구">
          <li className="px-2 py-1 text-wiki-muted dark:text-zinc-500">최근 변경</li>
          <li className="px-2 py-1 text-wiki-muted dark:text-zinc-500">임의 문서</li>
          <li className="px-2 py-1 text-wiki-muted dark:text-zinc-500">특수 문서</li>
        </SidebarSection>

      </div>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-wiki-muted dark:text-zinc-500 px-2 pb-1 mb-1 border-b border-wiki-borderSoft dark:border-zinc-800">
        {title}
      </p>
      <ul className="space-y-0">{children}</ul>
    </div>
  );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="block px-2 py-1 rounded-sm text-link dark:text-link-dark hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}
