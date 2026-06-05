import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllTagKeys,
  getTag,
  getTagMemberNames,
  getTagLabelKo,
} from "@/lib/mc-tags";
import { WikiArticle } from "@/app/components/PageShell";
import { DetailBackBar } from "@/app/components/DetailBackBar";
import { SmartIcon } from "@/app/components/SmartIcon";
import { resolveByKoName, getTextureByName } from "@/lib/textures";
import recipes from "@/data/recipes.json";

export function generateStaticParams() {
  return getAllTagKeys().map((id) => ({ id }));
}

function recipesUsingTag(tagKey: string): { id: string; name: string }[] {
  const needle = `#${tagKey}`;
  return recipes
    .filter(
      (r) =>
        r.grid?.some((row) => row.some((c) => c.includes(needle))) ||
        r.ingredients?.some((i) => i.includes(needle))
    )
    .map((r) => ({ id: r.id, name: r.name }));
}

export default function TagPage({ params }: { params: { id: string } }) {
  const tag = getTag(params.id);
  if (!tag) return notFound();
  const members = getTagMemberNames(params.id);
  const usedIn = recipesUsingTag(params.id);

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1 w-full">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WikiArticle>
          <div className="wiki-hero-banner !border-0">
            <DetailBackBar href="/search" label="검색" variant="hero" />
            <nav className="relative z-10 text-[12px] text-white/70 mb-3">
              <Link href="/">대문</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">태그</span>
            </nav>
            <h1 className="wiki-hero-title">{getTagLabelKo(params.id)}</h1>
            <p className="wiki-hero-sub">{tag.description}</p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-lg font-bold mb-3">포함 항목 ({members.length})</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 list-none pl-0">
              {members.map((name) => {
                const entry = resolveByKoName(name);
                const href = entry
                  ? `/search/${entry.id}?type=${entry.type}`
                  : undefined;
                const inner = (
                  <>
                    <SmartIcon
                      textureId={entry?.id}
                      image={getTextureByName(name)}
                      emoji="🏷️"
                      size="sm"
                      alt={name}
                    />
                    <span className="text-[12px] truncate">{name}</span>
                  </>
                );
                return (
                  <li key={name}>
                    {href ? (
                      <Link href={href} className="wiki-card-hover flex items-center gap-2 p-2 no-underline">
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 p-2 opacity-70">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            {usedIn.length > 0 && (
              <>
                <h2 className="text-lg font-bold mt-8 mb-3">사용되는 제작법</h2>
                <ul className="space-y-2 list-none pl-0">
                  {usedIn.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/search/${r.id}?type=recipe`}
                        className="text-link dark:text-link-dark hover:underline font-medium"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </WikiArticle>
      </div>
    </div>
  );
}
