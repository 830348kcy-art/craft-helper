"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DIMENSIONS } from "@/lib/catalog-taxonomy";
import { SmartIcon } from "./SmartIcon";
import { getCategoryTexture } from "@/lib/textures";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={`site-sidebar shrink-0 ${className}`}
      aria-label="사이트 메뉴"
    >
      <nav className="site-sidebar-inner">
        <SidebarSection title="둘러보기">
          <NavItem href="/" active={pathname === "/"}>
            대문
          </NavItem>
          <NavItem
            href="/wiki/getting-started"
            active={isActive(pathname, "/wiki/getting-started")}
          >
            처음 시작하기
          </NavItem>
          <NavItem href="/search" active={pathname.startsWith("/search")}>
            검색
          </NavItem>
        </SidebarSection>

        <SidebarSection title="분류">
          {DIMENSIONS.map((d) => (
            <li key={d.id}>
              <Link
                href={`/dimension/${d.id}`}
                className={`site-sidebar-cat ${
                  pathname.startsWith(`/dimension/${d.id}`) ? "site-sidebar-cat-active" : ""
                }`}
              >
                <SmartIcon
                  image={getCategoryTexture(d.id)}
                  emoji={d.emoji}
                  size="xs"
                  alt={d.name}
                />
                <span>{d.name}</span>
              </Link>
            </li>
          ))}
        </SidebarSection>
      </nav>
    </aside>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="site-sidebar-heading">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={active ? "site-sidebar-link-active" : "site-sidebar-link"}
      >
        {children}
      </Link>
    </li>
  );
}
