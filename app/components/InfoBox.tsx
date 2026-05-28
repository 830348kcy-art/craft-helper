import { SmartIcon } from "./SmartIcon";

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
    <aside className="float-none lg:float-right lg:ml-6 mb-6 w-full lg:w-72 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden shadow-sm">
      <div className="bg-brand-500 text-white px-4 py-2.5 font-semibold flex items-center gap-2">
        <SmartIcon image={image} emoji={emoji ?? "📘"} size="sm" alt={title} />
        <span className="truncate">{title}</span>
      </div>
      <dl className="text-sm">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 ${
              i % 2 === 0 ? "bg-white/60 dark:bg-zinc-900/30" : ""
            }`}
          >
            <dt className="text-zinc-500 dark:text-zinc-400">{r.label}</dt>
            <dd className="text-zinc-800 dark:text-zinc-200 font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
