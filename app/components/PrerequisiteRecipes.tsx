import Link from "next/link";
import recipes from "@/data/recipes.json";
import { getTextureByName } from "@/lib/textures";
import { SmartIcon } from "./SmartIcon";

type Recipe = (typeof recipes)[number];

/** "다이아몬드 ×3" → { name: "다이아몬드", count: 3 } */
function parseIngredient(ing: string): { name: string; count: number } {
  const m = ing.match(/^(.+?)\s*×\s*(\d+)$/);
  if (m) return { name: m[1].trim(), count: parseInt(m[2], 10) };
  return { name: ing.trim(), count: 1 };
}

/** 재료 이름으로 만들 수 있는 레시피를 찾는다. 동의어도 처리. */
function findRecipeForIngredient(rawName: string): Recipe | undefined {
  const aliases: Record<string, string[]> = {
    "막대기":     ["막대기"],
    "둥근돌":     ["둥근돌"],
    "철 주괴":    ["철 주괴"],
    "다이아몬드": ["다이아몬드"],
    "금 주괴":    ["금 주괴"],
    "상자":       ["상자"],
    "책":         ["책"],
    "제작대":     ["제작대", "작업대"],
    "작업대":     ["제작대", "작업대"],
    "화로":       ["화로"],
    "활":         ["활"],
    "화살":       ["화살"],
    "TNT":        ["TNT"],
    "마법부여대": ["마법부여대"],
    "책장":       ["책장"],
    "호퍼":       ["호퍼"],
    "엔더 눈":    ["엔더 눈"],
    "부싯돌과 부시": ["부싯돌과 부시"],
  };
  const candidates = aliases[rawName] ?? [rawName];
  return (recipes as Recipe[]).find((r) =>
    candidates.some((n) => r.resultItem === n)
  );
}

type Node = {
  recipe: Recipe;
  depth: number;
  forIngredient?: string; // 이 레시피가 어떤 재료를 만들기 위한 것인지
  children: Node[];
};

function buildTree(recipe: Recipe, depth: number, visited: Set<string>): Node {
  const node: Node = { recipe, depth, children: [] };
  if (depth >= 3) return node; // 최대 깊이 3
  for (const ing of recipe.ingredients) {
    const { name } = parseIngredient(ing);
    const sub = findRecipeForIngredient(name);
    if (!sub) continue;
    if (visited.has(sub.id)) continue;
    visited.add(sub.id);
    node.children.push({ ...buildTree(sub, depth + 1, visited), forIngredient: name });
  }
  return node;
}

function RecipeCard({ node }: { node: Node }) {
  const r = node.recipe;
  const indent = node.depth; // 0이 루트, 자식부터 1 이상

  return (
    <div
      className={`relative ${indent > 0 ? "ml-6 mt-3 pl-5 border-l-2 border-dashed border-violet-300 dark:border-violet-700" : "mt-3"}`}
    >
      {node.forIngredient && (
        <div className="absolute -left-1.5 top-3 w-3 h-3 rounded-full bg-violet-400 dark:bg-violet-500 ring-2 ring-white dark:ring-zinc-950" />
      )}

      <Link
        href={`/search/${r.id}?type=recipe`}
        className="block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-400 hover:shadow-sm transition overflow-hidden"
      >
        <div className="flex items-stretch gap-4 p-4">
          {/* 미니 격자 — 실제 텍스처 + 글자 폴백 */}
          <div className="shrink-0">
            <div className="inline-grid grid-cols-3 gap-0.5 p-1.5 bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-md shadow-inner">
              {(r.grid as string[][]).flat().map((cell, i) => {
                const tex = cell ? getTextureByName(cell) : undefined;
                return (
                  <div
                    key={i}
                    title={cell || ""}
                    className="w-8 h-8 rounded flex items-center justify-center
                      bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900
                      border border-zinc-400/40 dark:border-zinc-600/40"
                  >
                    {cell ? (
                      <SmartIcon image={tex} emoji="🟫" size="sm" alt={cell} />
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-zinc-400/40" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {node.forIngredient && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium">
                  {node.forIngredient} 만들기
                </span>
              )}
              <span className="text-2xl">{r.emoji}</span>
              <p className="font-semibold text-sm">
                {r.name}
                <span className="text-zinc-400 text-xs ml-1.5">×{r.resultCount}</span>
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2">
              {r.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {r.ingredients.map((ing, i) => {
                const parsed = ing.match(/^(.+?)\s*×\s*(\d+)$/);
                const name = parsed ? parsed[1].trim() : ing;
                const count = parsed ? parsed[2] : "";
                const tex = getTextureByName(name);
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <SmartIcon image={tex} emoji="🟫" size="xs" alt={name} />
                    <span>{name}</span>
                    {count && <span className="text-zinc-400">×{count}</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>

      {node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <RecipeCard key={`${child.recipe.id}-${child.depth}`} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PrerequisiteRecipes({ recipe }: { recipe: Recipe }) {
  const visited = new Set<string>([recipe.id]);
  const root = buildTree(recipe, 0, visited);

  if (root.children.length === 0) return null;

  const totalCount = countNodes(root) - 1; // 루트 제외

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold">🧩 선행 레시피</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium">
          {totalCount}개
        </span>
      </div>
      <p className="text-sm text-zinc-500 mb-4">
        이 레시피의 재료 중 직접 제작이 필요한 항목들을 트리로 표시합니다.
      </p>

      <div>
        {root.children.map((child) => (
          <RecipeCard key={`${child.recipe.id}-${child.depth}`} node={child} />
        ))}
      </div>
    </section>
  );
}

function countNodes(n: Node): number {
  return 1 + n.children.reduce((sum, c) => sum + countNodes(c), 0);
}
