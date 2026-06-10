import Link from "next/link";
import { CatalogLink } from "@/app/components/CatalogLink";
import { SmartIcon } from "@/app/components/SmartIcon";
import {
  DIMENSIONS,
  BLOCK_SUB_CATEGORY_ORDER,
  ITEM_SUB_CATEGORY_ORDER,
  groupByDimensionAndSubCategory,
  orderedSubCategories,
  getDimension,
  inferDimension,
  type DimensionId,
} from "@/lib/catalog-taxonomy";

export type CatalogEntry = {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  href: string;
  category: string;
  type: string;
};

function BlockSubGroups({
  dimMap,
  dimLabel,
  dimEmoji,
  dimColor,
}: {
  dimMap: Map<string, CatalogEntry[]>;
  dimLabel?: string;
  dimEmoji?: string;
  dimColor?: string;
}) {
  const subs = orderedSubCategories(dimMap, BLOCK_SUB_CATEGORY_ORDER);
  return (
    <>
      {dimLabel && (
        <h2
          className={`wiki-dim-badge font-sans text-[1.35rem] font-bold mt-2 mb-5 ${dimColor ?? ""}`}
        >
          {dimEmoji && <span>{dimEmoji}</span>}
          {dimLabel}
        </h2>
      )}
      {subs.map(({ sub, entries: subEntries }) => (
        <SubCategorySection
          key={sub}
          title={sub}
          count={(subEntries as CatalogEntry[]).length}
          entries={subEntries as CatalogEntry[]}
        />
      ))}
    </>
  );
}

/** 블록: 차원 → 세부 카테고리 (전체 또는 단일 차원 페이지) */
export function DimensionBlockGrid({
  entries,
  dimensionId,
}: {
  entries: CatalogEntry[];
  /** 지정 시 해당 차원만 세부 카테고리로 표시 */
  dimensionId?: DimensionId;
}) {
  const grouped = groupByDimensionAndSubCategory(entries, BLOCK_SUB_CATEGORY_ORDER);

  if (dimensionId) {
    const dimMap = grouped.get(dimensionId);
    if (!dimMap || ![...dimMap.values()].some((l) => l.length)) return null;
    const dim = getDimension(dimensionId);
    return (
      <div className="space-y-6">
        <BlockSubGroups
          dimMap={dimMap as Map<string, CatalogEntry[]>}
          dimLabel={dim.name}
          dimEmoji={dim.emoji}
          dimColor={dim.color}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {DIMENSIONS.map((dim) => {
        const dimMap = grouped.get(dim.id)!;
        const total = [...dimMap.values()].reduce((n, list) => n + list.length, 0);
        if (total === 0) return null;

        return (
          <section key={dim.id} className="scroll-mt-24">
            <BlockSubGroups
              dimMap={dimMap as Map<string, CatalogEntry[]>}
              dimLabel={dim.name}
              dimEmoji={dim.emoji}
              dimColor={dim.color}
            />
          </section>
        );
      })}
    </div>
  );
}

/** 아이템: 세부 카테고리만 (대부분 오버월드) */
export function ItemSubCategoryGrid({ entries }: { entries: CatalogEntry[] }) {
  const bySub = new Map<string, CatalogEntry[]>();
  for (const e of entries) {
    const sub = e.category || "기타";
    if (!bySub.has(sub)) bySub.set(sub, []);
    bySub.get(sub)!.push(e);
  }
  for (const list of bySub.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  const subs = orderedSubCategories(bySub, ITEM_SUB_CATEGORY_ORDER);

  return (
    <div className="space-y-8">
      {subs.map(({ sub, entries: subEntries }) => (
        <SubCategorySection
          key={sub}
          title={sub}
          count={(subEntries as CatalogEntry[]).length}
          entries={subEntries as CatalogEntry[]}
        />
      ))}
    </div>
  );
}

function SubCategorySection({
  title,
  count,
  entries,
}: {
  title: string;
  count: number;
  entries: CatalogEntry[];
}) {
  return (
    <section className="mt-5">
      <h3 className="font-sans text-[1.05rem] font-bold mb-3 text-wiki-text dark:text-zinc-100 flex items-center gap-2">
        {title}
        <span className="wiki-badge !text-[10px]">{count}</span>
      </h3>
      <EntryGrid entries={entries} />
    </section>
  );
}

function EntryGrid({ entries }: { entries: CatalogEntry[] }) {
  return (
    <ul className="catalog-entry-grid list-none pl-0">
      {entries.map((e) => (
        <li key={`${e.type}-${e.id}`} className="list-none">
          <CatalogLink href={e.href} className="catalog-entry-card wiki-card-hover no-underline">
            <span className="catalog-entry-icon">
              <SmartIcon textureId={e.id} image={e.image} emoji={e.emoji} size="md" alt={e.name} framed />
            </span>
            <span className="catalog-entry-text">
              <span className="catalog-entry-name">{e.name}</span>
              <span className="catalog-entry-cat">{e.category}</span>
            </span>
          </CatalogLink>
        </li>
      ))}
    </ul>
  );
}

/** 차원 단일 페이지(네더/엔드)용 */
export function DimensionOnlyGrid({
  entries,
  dimension,
}: {
  entries: CatalogEntry[];
  dimension: DimensionId;
}) {
  const dim = getDimension(dimension);
  const filtered = entries.filter((e) => inferDimension(e.id) === dimension);
  const bySub = new Map<string, CatalogEntry[]>();
  for (const e of filtered) {
    const sub = e.category || "기타";
    if (!bySub.has(sub)) bySub.set(sub, []);
    bySub.get(sub)!.push(e);
  }
  for (const list of bySub.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  const subs = orderedSubCategories(bySub, BLOCK_SUB_CATEGORY_ORDER);

  if (filtered.length === 0) {
    return (
      <p className="text-wiki-muted dark:text-zinc-500 text-[14px]">
        이 차원에 해당하는 제작 가능 항목이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <p className={`text-[14px] mb-4 px-3 py-2 rounded-sm ${dim.color}`}>
        {dim.emoji} <strong>{dim.name}</strong> 차원 블록·아이템 ({filtered.length}개)
      </p>
      {subs.map(({ sub, entries: subEntries }) => (
        <SubCategorySection
          key={sub}
          title={sub}
          count={(subEntries as CatalogEntry[]).length}
          entries={subEntries as CatalogEntry[]}
        />
      ))}
    </div>
  );
}
