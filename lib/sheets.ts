/**
 * Google Sheets 데이터 로더
 *
 * 사용 전 준비:
 * 1. .env.local 파일에 GOOGLE_SPREADSHEET_ID=... 추가
 * 2. 시트를 서비스 계정 이메일과 [뷰어] 권한으로 공유
 * 3. 시트 3개 만들기: Blocks, Items, Recipes (정확한 이름)
 *
 * 시트 열 구조 (1행은 헤더, 2행부터 데이터):
 *
 * Blocks 시트:  id | name | emoji | category | description | tags | tool | hardness
 *   - tags 는 쉼표 구분 (예: "자연,흙,표면")
 *   - hardness 는 숫자
 *
 * Items 시트:   id | name | emoji | category | description | tags | stackSize
 *   - stackSize 는 숫자 (기본 64)
 *
 * Recipes 시트: id | name | emoji | category | resultItem | resultCount | type | description | tags | grid | ingredients
 *   - grid 는 9칸을 슬래시(/)로 구분한 문자열
 *     예: "다이아,다이아,다이아/,막대,/,막대,"   ← 빈 칸은 비워둠
 *   - ingredients 는 쉼표 구분 (예: "다이아몬드 ×3, 막대기 ×2")
 *
 * 데이터는 60초간 캐싱되어 시트 수정 후 약 1분 뒤 반영됩니다.
 */

import { google } from "googleapis";
import path from "path";
import fs from "fs";
import blocksLocal from "@/data/blocks.json";
import itemsLocal  from "@/data/items.json";
import recipesLocal from "@/data/recipes.json";
import { getBlockTexture, getItemTexture } from "./textures";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const KEY_FILE = process.env.GOOGLE_KEY_FILE
  ? path.resolve(process.env.GOOGLE_KEY_FILE)
  : path.join(process.cwd(), "google-key.json");

export type Block = (typeof blocksLocal)[number];
export type Item = (typeof itemsLocal)[number];
export type Recipe = (typeof recipesLocal)[number];

type SheetsData = { blocks: Block[]; items: Item[]; recipes: Recipe[] };

let cache: { data: SheetsData; expires: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60초

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

function parseGrid(raw: string | undefined): string[][] {
  if (!raw) return [["","",""],["","",""],["","",""]];
  const rows = raw.split("/").map((r) => r.split(",").map((c) => c.trim()));
  // 3행 × 3열로 정규화
  while (rows.length < 3) rows.push(["","",""]);
  return rows.slice(0, 3).map((r) => {
    const padded = [...r];
    while (padded.length < 3) padded.push("");
    return padded.slice(0, 3);
  });
}

function rowsToBlocks(rows: string[][]): Block[] {
  return rows.map((r) => ({
    id: r[0],
    name: r[1],
    emoji: r[2] || "🟫",
    image: r[0] ? getBlockTexture(r[0]) : "",
    category: r[3] || "기타",
    description: r[4] || "",
    tags: parseTags(r[5]),
    tool: r[6] || "",
    hardness: parseFloat(r[7] || "0"),
  })).filter((b) => b.id && b.name);
}

function rowsToItems(rows: string[][]): Item[] {
  return rows.map((r) => ({
    id: r[0],
    name: r[1],
    emoji: r[2] || "📦",
    image: r[0] ? getItemTexture(r[0]) : "",
    category: r[3] || "기타",
    description: r[4] || "",
    tags: parseTags(r[5]),
    stackSize: parseInt(r[6] || "64", 10),
  })).filter((it) => it.id && it.name);
}

function rowsToRecipes(rows: string[][]): Recipe[] {
  return rows.map((r) => ({
    id: r[0],
    name: r[1],
    emoji: r[2] || "🔨",
    category: r[3] || "기타",
    resultItem: r[4] || r[1],
    resultCount: parseInt(r[5] || "1", 10),
    type: r[6] || "제작창",
    description: r[7] || "",
    tags: parseTags(r[8]),
    grid: parseGrid(r[9]),
    ingredients: parseTags(r[10]),
  })).filter((rec) => rec.id && rec.name);
}

/**
 * 시트에서 모든 데이터를 가져온다.
 * 시트가 비어있거나 에러 발생 시 로컬 JSON으로 폴백.
 */
export async function loadAllData(): Promise<SheetsData> {
  // 캐시 확인
  if (cache && cache.expires > Date.now()) {
    return cache.data;
  }

  // 환경변수 또는 키 파일 없으면 로컬 JSON 사용
  if (!SPREADSHEET_ID || !fs.existsSync(KEY_FILE)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sheets] 환경변수/키파일 없음 → 로컬 JSON 사용");
    }
    return withTextureUrls({
      blocks: blocksLocal as Block[],
      items: itemsLocal as Item[],
      recipes: recipesLocal as Recipe[],
    });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const [blocksRes, itemsRes, recipesRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: "Blocks!A2:H" }),
      sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: "Items!A2:G" }),
      sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: "Recipes!A2:K" }),
    ]);

    const data: SheetsData = {
      blocks:  rowsToBlocks ((blocksRes .data.values ?? []) as string[][]),
      items:   rowsToItems  ((itemsRes  .data.values ?? []) as string[][]),
      recipes: rowsToRecipes((recipesRes.data.values ?? []) as string[][]),
    };

    // 시트가 비어있으면 로컬 JSON으로 폴백
    const total = data.blocks.length + data.items.length + data.recipes.length;
    if (total === 0) {
      console.warn("[sheets] 시트가 모두 비어있음 → 로컬 JSON 사용");
      return withTextureUrls({
        blocks: blocksLocal as Block[],
        items: itemsLocal as Item[],
        recipes: recipesLocal as Recipe[],
      });
    }

    cache = { data, expires: Date.now() + CACHE_TTL };
    return data;
  } catch (err) {
    console.error("[sheets] 시트 로딩 실패:", err instanceof Error ? err.message : err);
    return withTextureUrls({
      blocks: blocksLocal as Block[],
      items: itemsLocal as Item[],
      recipes: recipesLocal as Recipe[],
    });
  }
}

/** 로컬 JSON의 image 경로를 실제 마인크래프트 텍스처 CDN URL로 치환 */
function withTextureUrls(data: SheetsData): SheetsData {
  return {
    blocks: data.blocks.map((b) => ({ ...b, image: getBlockTexture(b.id) })),
    items: data.items.map((it) => ({ ...it, image: getItemTexture(it.id) })),
    recipes: data.recipes,
  };
}

/** 캐시 강제 무효화 (디버깅용) */
export function invalidateCache() {
  cache = null;
}
