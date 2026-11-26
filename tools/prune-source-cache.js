#!/usr/bin/env node
// 원전 추출 캐시(references/sources/)에서 장부가 쓰지 않는 파일을 가린다.
//
// 사용: node tools/prune-source-cache.js [--apply | --list-live]
//   붙이지 않으면 고아 파일과 그 용량만 보여 준다(dry run).
//   --apply      고아 파일을 지운다.
//   --list-live  살아 있어야 할 파일명만 출력한다(캐시 폴더를 열지 않는다).
//
// 캐시는 `tools/verify-quote.js`가 원전을 한 번만 추출해 두는 곳이고 git 제외다. `--check` 조회는
// 장부에 기록하지 않지만 캐시는 남기므로, 조사용으로 한 번 본 원전이 그대로 쌓인다. 그것이 고아다.
//
// 살아 있는 파일명은 `references/verified.json`의 출처로부터 `verify-quote.js`의 `cached()` 규칙
// 그대로 되계산한다 — URL은 `url-<sha1 12자>.txt`, 이름 캐시는 `<이름>.txt`, PDF는 확장자를 떼고
// `[^\w.-]`를 `_`로 바꾼 `.txt`다. `.txt` 원전은 캐시를 만들지 않고 원본을 직접 읽으므로 세지 않는다.
// 사람이 지면에서 확인한 기록(`--attest`)도 캐시가 없다.
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const CACHE = path.join(ROOT, "references", "sources");
const LEDGER = path.join(ROOT, "references", "verified.json");

// 살아 있어야 할 캐시 파일 → { 기록 수, 다시 만들 길 }. 다시 만들 길이 없는 캐시가 사라지면
// 그 기록은 대조할 수 없게 되므로(「5. 인용과 출처」) 지우기보다 먼저 그것을 알린다.
function liveNames() {
  const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf-8"));
  const live = new Map();
  const add = (name, origin) => {
    const e = live.get(name) || { n: 0, origin };
    e.n++;
    live.set(name, e);
  };
  for (const key of Object.keys(ledger)) {
    const s = ledger[key].source;
    if (/^확인 경위/.test(s)) continue;
    if (/^https?:\/\//.test(s)) {
      add("url-" + crypto.createHash("sha1").update(s).digest("hex").slice(0, 12) + ".txt", s);
      continue;
    }
    if (!/[\/.]/.test(s)) { add(s + ".txt", null); continue; }
    const rel = s.replace(/^.*TrainingMaterials\//, "");
    if (/\.pdf$/i.test(rel)) {
      add(path.basename(rel).replace(/\.pdf$/i, "").replace(/[^\w.-]+/g, "_") + ".txt",
        fs.existsSync(path.join(ROOT, rel)) ? rel : null);
    }
  }
  return live;
}

function main() {
  const mode = process.argv[2];
  const live = liveNames();

  if (mode === "--list-live") {
    [...live.keys()].sort().forEach((n) => console.log(n));
    console.log("# " + live.size + "개");
    return;
  }

  if (!fs.existsSync(CACHE)) {
    console.log("캐시 폴더가 없다: references/sources/");
    return;
  }

  const orphans = [];
  const present = new Set();
  let liveBytes = 0;
  for (const name of fs.readdirSync(CACHE)) {
    const full = path.join(CACHE, name);
    const st = fs.statSync(full);
    if (!st.isFile()) continue;
    if (live.has(name)) { liveBytes += st.size; present.add(name); continue; }
    orphans.push([name, st.size]);
  }

  const mib = (b) => (b / 1024 / 1024).toFixed(2) + " MiB";
  orphans.sort((a, b) => b[1] - a[1]);

  console.log("장부가 쓰는 파일 " + live.size + "개 중 " + present.size + "개가 있다 — " + mib(liveBytes));

  // 없어진 캐시: 다시 만들 길이 없으면 그 기록은 대조할 수 없다.
  const gone = [...live].filter(([n]) => !present.has(n));
  if (gone.length) {
    const stuck = gone.filter(([, e]) => !e.origin);
    console.log("\n없어진 캐시 " + gone.length + "개" + (stuck.length ? " — 그중 " + stuck.length + "개는 다시 만들 길이 없다" : ""));
    gone.sort((a, b) => b[1].n - a[1].n).forEach(([n, e]) => console.log(
      "   " + String(e.n).padStart(3) + "건  " + n + "  → " +
      (e.origin ? "다시 만들 수 있다: " + e.origin : "**원전이 없어 대조 불가**")));
    if (stuck.length) {
      console.log("   대조할 수 없는 기록은 장부에 두지 않는다 — 정본에서 다시 확인하거나 기록을 지운다");
      console.log("   (guides/session-authoring-guide.md 「5. 인용과 출처」)");
    }
  }

  console.log("\n고아 " + orphans.length + "개 " + mib(orphans.reduce((s, [, b]) => s + b, 0)));
  orphans.forEach(([n, b]) => console.log("   " + mib(b).padStart(10) + "  " + n));

  if (mode === "--apply") {
    orphans.forEach(([n]) => fs.unlinkSync(path.join(CACHE, n)));
    console.log("\n지웠다 " + orphans.length + "개");
  } else if (orphans.length) {
    console.log("\n지우려면 --apply를 붙인다. 지워도 원전에서 다시 추출된다.");
  }
}

main();
