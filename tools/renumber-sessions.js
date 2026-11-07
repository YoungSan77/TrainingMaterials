#!/usr/bin/env node
// 세션 번호를 옮긴다 — 파일 이름(원고·덱·검사 기록·예시 코드 폴더)과 원고 안의 참조를 함께.
//
// 사용: node tools/renumber-sessions.js <과정> [--apply]
//   붙이지 않으면 바꿀 것만 세어 보여 준다(dry run).
//
// 왜 도구인가 — 참조는 원고 열두 개에 100곳이 넘고, 손으로 고치면 한두 곳이 남는다. 남은 참조는
// Production의 참조 검사가 오류로 잡지만, 번호가 겹쳐 밀리면(09→10인데 10이 이미 있다) 조용히
// 다른 세션을 가리키게 된다. 그래서 한 번에, 한 벌로 옮긴다.
//
// 어떻게 겹침을 피하나 — 번호로 찾아 번호로 바꾸면 9→10과 10→11이 연달아 돌며 9가 11이 된다.
// 그래서 참조는 **세션명으로 찾아** 번호를 적는다(`세션 NN. 검사 파이프라인` → `세션 10. …`).
// 세션명은 하나의 새 번호에만 대응하므로 몇 번 돌려도 결과가 같다. 파일 이름만 내림차순으로 옮긴다.
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

// PLAN은 **지금 할 한 걸음**을 적는 자리다. `moves`와 `practices`는 번호를 번호로 바꾸므로
// **두 번 돌면 또 밀린다** — 적용한 뒤에는 반드시 비운다(기록은 git 이력에 남는다). `sessions`와
// `renames`는 이름으로 찾아 쓰므로 몇 번 돌려도 결과가 같다.
//
// 2026-11-07 (1) 11세션 원고를 12세션 체계로 밀었다 — moves: 11→12, 10→11, 9→10,
//   practices: 11→12, 10→11, 9→10. 적용·커밋 후 비웠다.
// 2026-11-07 (2) 원고의 세션명을 과정 설계의 이름으로 맞춘다 — 아래 renames.
const PLAN = {
  // 파일 이름 옮기기. 뒤에서부터 옮겨야 아직 있는 번호를 덮지 않는다.
  moves: [],
  // 참조는 세션명으로 찾는다. 이름 → 새 번호.
  sessions: {
    "검사 파이프라인": 10,
    "비용과 평가": 11,
    "종합 실행": 12,
  },
  // 실습 번호는 세션을 따라간다. 이름이 없으므로 내림차순으로 한 번에 바꾼다. 한 번만 돈다.
  practices: {},
  // 세션명 바꾸기. 2026-11-07: 원고의 이름을 과정 설계의 이름으로 맞춘다(설계가 권위다).
  // `NN. <옛 이름>` 꼴만 바꾸므로, 번호 없이 본문에 나오는 같은 말("정적 모델을 먼저 그린다")은
  // 건드리지 않는다. 헤더와 참조가 같은 꼴이어서 한 번에 바뀐다.
  renames: {
    "요구와 수용 기준": "요구사항",
    "정적 모델": "도메인 모델 — 정적 관점",
    "동적 모델": "도메인 모델 — 동적 관점",
  },
};

const pad = (n) => String(n).padStart(2, "0");

function gitMove(from, to) {
  if (!fs.existsSync(path.join(ROOT, from))) return null;
  execFileSync("git", ["mv", from, to], { cwd: ROOT });
  return `${from} → ${to}`;
}

// 원고 하나의 참조를 고친다. 바꾼 자리 수를 돌려준다.
function rewrite(text) {
  let hits = 0;

  // `세션 NN. 이름`과 원고 머리의 `Session 명: NN. 이름`. 이름이 새 번호를 정한다.
  for (const [name, num] of Object.entries(PLAN.sessions)) {
    const re = new RegExp(`(세션 |Session 명: )\\d{2}\\. ${name}`, "g");
    text = text.replace(re, (m, head) => {
      if (m !== `${head}${pad(num)}. ${name}`) hits++;
      return `${head}${pad(num)}. ${name}`;
    });
  }

  // 세션명 바꾸기. 번호가 앞에 붙은 자리만 바꾼다.
  for (const [from, to] of Object.entries(PLAN.renames)) {
    const re = new RegExp(`(\\d{2})\\. ${from}(?![가-힣])`, "g");
    text = text.replace(re, (m, num) => {
      hits++;
      return `${num}. ${to}`;
    });
  }

  // 목차와 본문의 실습 번호. 큰 번호부터 한 번에 바꿔 겹쳐 밀리지 않게 한다.
  text = text.replace(/실습 (\d+)/g, (m, n) => {
    const to = PLAN.practices[Number(n)];
    if (!to) return m;
    hits++;
    return `실습 ${to}`;
  });

  // 예시 코드 폴더.
  text = text.replace(/code\/s(\d{2})/g, (m, n) => {
    const to = PLAN.practices[Number(n)];
    if (!to) return m;
    hits++;
    return `code/s${pad(to)}`;
  });

  return { text, hits };
}

function main() {
  const [course, ...rest] = process.argv.slice(2);
  if (!course) {
    console.error("사용: node tools/renumber-sessions.js <과정> [--apply]");
    process.exit(2);
  }
  const apply = rest.includes("--apply");
  const dir = path.join("courses", course, "sessions");
  if (!fs.existsSync(path.join(ROOT, dir))) {
    console.error("과정이 없다: " + course);
    process.exit(1);
  }

  const moved = [];
  if (apply) {
    for (const { from, to } of PLAN.moves) {
      for (const ext of [".md", ".pptx", ".qa.json"]) {
        const done = gitMove(`${dir}/s${pad(from)}${ext}`, `${dir}/s${pad(to)}${ext}`);
        if (done) moved.push(done);
      }
      // 제작 검증 기록도 원고와 같은 basename을 쓴다(`production-guide.md`의 「최종 Production
      // 검증과 증거」). 옮기지 않으면 기록이 다른 세션 옆에 남는다. 기록 안의 제목과 번호는
      // 사람이 고치고, 옮긴 사실을 그 기록에 적는다 — 검토 시각과 경로는 그때의 것이다.
      const check = gitMove(
        `courses/${course}/checks/s${pad(from)}-production-check.md`,
        `courses/${course}/checks/s${pad(to)}-production-check.md`
      );
      if (check) moved.push(check + " (제목·번호는 사람이 고친다)");
      const code = gitMove(`${dir}/code/s${pad(from)}`, `${dir}/code/s${pad(to)}`);
      if (code) moved.push(code);
    }
  } else {
    for (const { from, to } of PLAN.moves)
      moved.push(`s${pad(from)} → s${pad(to)} (원고·덱·qa·예시 코드·제작 검증 기록)`);
  }

  const files = fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => /^s\d\d\.md$/.test(f))
    .map((f) => path.join(dir, f));

  let total = 0;
  for (const file of files) {
    const full = path.join(ROOT, file);
    const before = fs.readFileSync(full, "utf-8");
    const { text, hits } = rewrite(before);
    if (!hits) continue;
    total += hits;
    console.log(`${file} — 참조 ${hits}곳`);
    if (apply && text !== before) fs.writeFileSync(full, text);
  }

  console.log("\n파일 이동");
  for (const m of moved) console.log("  " + m);
  console.log(`\n참조 ${total}곳 · 원고 ${files.length}개` + (apply ? " — 고쳤다" : " — 세어 본 것이다(--apply로 적용)"));
}

main();
