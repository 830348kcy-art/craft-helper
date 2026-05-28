import { SmartIcon } from "./SmartIcon";

/**
 * MediaWiki 스타일 인포박스 (ko.minecraft.wiki 풍).
 * 상단: 제목 헤더 (연한 그린)
 * 중단: 대표 이미지
 * 하단: 키-값 표
 */
export function InfoBox({
  title,
  emoji,
  image,
  rows,
}: {
  title: string;
  emoji?: string;
  image?: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <aside className="float-none lg:float-right lg:ml-6 mb-5 w-full lg:w-[290px]
                      border border-wiki-border bg-white dark:bg-zinc-900 dark:border-zinc-700
                      text-[13px] shadow-sm">
      {/* 제목 헤더 */}
      <div className="bg-wiki-panelHead dark:bg-zinc-800 border-b border-wiki-border dark:border-zinc-700
                      px-3 py-2 text-center font-bold text-wiki-text dark:text-zinc-100 text-[14px]">
        {title}
      </div>

      {/* 대표 이미지 */}
      {(image || emoji) && (
        <div className="flex items-center justify-center p-4 bg-white dark:bg-zinc-900 border-b border-wiki-borderSoft dark:border-zinc-800"
             style={{
               backgroundImage:
                 "linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%), linear-gradient(45deg, rgba(0,0,0,0.02) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.02) 75%)",
               backgroundSize: "16px 16px",
               backgroundPosition: "0 0, 8px 8px",
             }}>
          <SmartIcon image={image} emoji={emoji ?? "📘"} size="hero" alt={title} />
        </div>
      )}

      {/* 정보 표 */}
      <dl className="text-[13px] divide-y divide-wiki-borderSoft dark:divide-zinc-800">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[100px_1fr]">
            <dt className="bg-wiki-panel dark:bg-zinc-800/60 px-2.5 py-1.5 font-bold text-wiki-text dark:text-zinc-200 border-r border-wiki-borderSoft dark:border-zinc-700">
              {r.label}
            </dt>
            <dd className="px-2.5 py-1.5 text-wiki-text dark:text-zinc-300 break-words">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
