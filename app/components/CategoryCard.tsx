import Link from "next/link";
import type { Category } from "@/lib/data";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900
        hover:border-brand-400 hover:shadow-xl hover:-translate-y-1
        transition-all duration-200 overflow-hidden"
    >
      {/* 호버 시 강조 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-100/0 to-brand-50/0 group-hover:from-brand-100/40 group-hover:to-brand-50/20 dark:group-hover:from-brand-900/20 dark:group-hover:to-zinc-900 transition-all duration-300" />

      <div className="relative p-5">
        <div className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color} mb-3`}>
          <span>{category.emoji}</span>
          <span>{category.name}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{category.emoji}</span>
          <h3 className="text-lg font-bold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
            {category.name}
          </h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {category.description}
        </p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400">
          문서 보기
          <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
