/**
 * 변경 사항이 있으면 build:ci → commit → push(main) → GitHub Pages 배포
 * 사용: npm run deploy:auto
 * 환경변수: DEPLOY_SKIP=1 이면 스킵, DEPLOY_COMMIT_MSG 로 커밋 메시지 지정
 */
import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REMOTE = process.env.DEPLOY_REMOTE || "origin";
const BRANCH = process.env.DEPLOY_BRANCH || "main";

function run(cmd, opts = {}) {
  const stdio = opts.silent ? "pipe" : "inherit";
  return execSync(cmd, {
    cwd: root,
    encoding: "utf-8",
    stdio,
    env: { ...process.env, CI: "true", ...opts.env },
  });
}

function runQuiet(cmd) {
  try {
    return run(cmd, { silent: true }).trim();
  } catch {
    return "";
  }
}

function main() {
  if (process.env.DEPLOY_SKIP === "1") {
    console.log("[auto-deploy] DEPLOY_SKIP=1, 스킵");
    return;
  }

  try {
    runQuiet("git rev-parse --git-dir");
  } catch {
    console.error("[auto-deploy] Git 저장소가 아닙니다.");
    process.exit(1);
  }

  const branch = runQuiet("git rev-parse --abbrev-ref HEAD");
  if (branch !== BRANCH) {
    console.log(`[auto-deploy] 브랜치가 ${BRANCH}이 아님 (${branch}), 스킵`);
    return;
  }

  const status = runQuiet("git status --porcelain");
  if (!status) {
    console.log("[auto-deploy] 변경 없음, 스킵");
    return;
  }

  console.log("[auto-deploy] 변경 파일:\n" + status);

  console.log("\n[auto-deploy] 빌드 검증 (build:ci)...");
  run("npm run build:ci");

  const msg =
    process.env.DEPLOY_COMMIT_MSG?.trim() ||
    `chore: auto-deploy ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

  console.log("\n[auto-deploy] 커밋...");
  run("git add -A");
  try {
    run(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { silent: true });
  } catch {
    console.log("[auto-deploy] 커밋할 변경이 없습니다.");
    return;
  }

  console.log(`\n[auto-deploy] push ${REMOTE} ${BRANCH} ...`);
  run(`git push ${REMOTE} ${BRANCH}`);

  console.log("\n[auto-deploy] 완료!");
  console.log("  Actions: https://github.com/830348kcy-art/craft-helper/actions");
  console.log("  사이트:  https://830348kcy-art.github.io/craft-helper/");
}

main();
