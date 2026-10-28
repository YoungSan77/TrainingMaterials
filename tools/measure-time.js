"use strict";
// 세션 원고의 분량을 재서 강의 시간을 추정한다 — AGENTS.md 「수치가 답이면 먼저 잰다」.
//
// 재는 것은 renderer가 이미 쓰는 값이다. 한 장의 본문 용량은 450(builder.js의 CAPACITY)이고
// page.textCost가 그 장에 실린 글의 양이므로, 장수가 아니라 textCost가 말하는 시간을 센다.
// 도식·표·코드는 글과 다른 속도로 말하므로 종류별로 따로 센다.
//
//   node tools/measure-time.js courses/ai-native/sessions/s01.md …        표로 출력
//   node tools/measure-time.js --json courses/…/s01.md …                   topic 단위 원자료
//
// 분 단위 추정의 계수는 --rate로 바꾼다(기본값은 아래 RATE). 계수는 가정이고 측정값이 아니다 —
// 파일럿에서 실측한 뒤 이 파일의 기본값을 고친다.
const fs = require("fs");
const path = require("path");
const os = require("os");
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "engine", "production", "src");
const { parse } = require(path.join(SRC, "parse"));
const builder = require(path.join(SRC, "builder"));
const { TEMPLATE_DIR } = require(path.join(SRC, "template"));
const { courseInfo } = require(path.join(SRC, "course"));
const { isPractice } = require(path.join(SRC, "slideNames"));

// 분량을 분으로 바꾸는 계수. **측정값이 아니라 가정이다** — 파일럿에서 실측한 뒤 고친다.
// cpm은 슬라이드에 적힌 글자를 말로 풀어내는 속도다(글자/분). 강사는 적힌 것보다 많이 말하므로
// 낭독 속도(약 300자/분)보다 훨씬 느리다.
const RATE = {
  cpm: 110,        // 본문 글자/분
  practice: 2.0,   // 실습 과제 장을 읽어 주는 분(①~⑤ 문구는 수강생이 쓴다 — 강사가 읽지 않는다)
  picture: 1.2,    // 도식 하나를 짚어 보이는 데 드는 분
  table: 0.4,      // 표 하나의 읽는 법을 말하는 데 드는 분(행은 글자로 따로 센다)
  codeLine: 0.08,  // 코드·출력 한 줄당 분
  toc: 0.5,        // 목차 한 장
  cover: 0.3,      // 표지
};
const CAPACITY = 450;

// 블록에서 눈에 보이는 글자 수를 센다. 도식 원본(mermaid·svg·plantuml·chart)은 글이 아니라
// 그림이므로 세지 않고, 코드·출력은 줄 수로 따로 센다.
const VISUAL = new Set(["mermaid", "plantuml", "svg", "chart"]);
const CODE = new Set(["code", "tree"]);
function visibleChars(s) {
  return String(s || "").replace(/\*\*|`|^#+\s*/g, "").trim().length;
}
function sectionVolume(section) {
  const v = { chars: 0, visuals: 0, tables: 0, rows: 0, codeLines: 0, quotes: 0 };
  for (const b of section.blocks || []) {
    if (VISUAL.has(b.kind)) { v.visuals += 1; continue; }
    if (CODE.has(b.kind)) { v.codeLines += String(b.text || "").split("\n").length; continue; }
    if (b.kind === "table") {
      v.tables += 1;
      v.rows += (b.rows || []).length;
      for (const r of b.rows || []) for (const c of r) v.chars += visibleChars(c);
      continue;
    }
    if (b.kind === "pagebreak") continue;
    if (/^\*\*인용문\*\*$/.test(String(b.text || "").trim())) { v.quotes += 1; continue; }
    v.chars += visibleChars(b.text);
  }
  return v;
}

function stripCount(heading) {
  return String(heading || "").split("\n")[0].replace(/\s*\(\d+\/\d+\)\s*$/, "").trim();
}

function minutes(v, rate) {
  return (
    v.chars / rate.cpm +
    v.visuals * rate.picture +
    v.tables * rate.table +
    v.codeLines * rate.codeLine
  );
}

function classify(title, appendix) {
  if (appendix) return "별첨";
  if (isPractice(title)) return "실습";
  if (/세션 목표$/.test(title)) return "목표";
  if (/^\d\d\. 요약$|^요약$/.test(title)) return "요약";
  return "본문";
}

async function measureFile(input, tmpDir, rate) {
  const { session, toc, sections } = parse(fs.readFileSync(input, "utf-8"));
  const out = path.join(tmpDir, path.basename(input).replace(/\.md$/, ".pptx"));
  const m = await builder.render(sections, TEMPLATE_DIR, out, session, toc, courseInfo(input));
  const topics = sections.map((s) => {
    const v = sectionVolume(s);
    return {
      title: s.title,
      kind: classify(s.title, s.appendix),
      group: s.group || "",
      slides: 0,
      ...v,
      minutes: isPractice(s.title) ? rate.practice : minutes(v, rate),
    };
  });
  const front = { slides: 0, minutes: 0 };
  let ti = -1;
  let last = null;
  for (const p of m.pages) {
    if (p.isCover || p.isToc) {
      front.slides += 1;
      front.minutes += p.isCover ? rate.cover : rate.toc;
      continue;
    }
    const h = stripCount(p.heading);
    if (h !== last) {
      let j = ti + 1;
      while (j < topics.length && topics[j].title !== h) j++;
      if (j < topics.length) ti = j;
      last = h;
    }
    if (ti >= 0) topics[ti].slides += 1;
  }
  return { file: path.basename(input), session, front, topics: topics.filter((t) => t.slides > 0) };
}

function sum(topics, pick, kinds) {
  return topics.filter((t) => !kinds || kinds.includes(t.kind)).reduce((n, t) => n + pick(t), 0);
}

function round1(n) { return Math.round(n * 10) / 10; }

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) {
    console.error("사용법: node tools/measure-time.js [--json] <원고.md …>");
    process.exit(2);
  }
  const cpmArg = args.find((a) => a.startsWith("--cpm="));
  if (cpmArg) RATE.cpm = Number(cpmArg.split("=")[1]);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tm-measure-"));
  const results = [];
  for (const f of files) results.push(await measureFile(path.resolve(f), tmpDir, RATE));
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }
  const TALK = ["본문", "목표", "요약"];
  const fitArg = args.find((a) => a.startsWith("--fit="));
  if (fitArg) {
    // 전체 강의가 주어진 분에 들어가려면 몇 자/분으로 말해야 하는가.
    const target = Number(fitArg.split("=")[1]);
    let chars = 0, fixed = 0;
    for (const r of results) {
      chars += sum(r.topics, (t) => t.chars, TALK);
      fixed += r.front.minutes
        + sum(r.topics, (t) => t.visuals * RATE.picture + t.tables * RATE.table + t.codeLines * RATE.codeLine, TALK)
        + sum(r.topics, (t) => t.minutes, ["실습"]);
    }
    console.log("글자 " + chars + "자, 글 밖의 고정 " + round1(fixed) + "분");
    console.log("목표 " + target + "분에 넣으려면 " + Math.round(chars / (target - fixed)) + "자/분으로 말해야 한다.");
    return;
  }
  if (args.includes("--topics")) {
    console.log("파일\t종류\t장\t글자\t도식\t코드줄\t분\ttopic");
    for (const r of results) {
      for (const t of r.topics) {
        console.log([r.file, t.kind, t.slides, t.chars, t.visuals, t.codeLines, round1(t.minutes), t.title].join("\t"));
      }
    }
    return;
  }
  console.log("파일\t장\t강의장\t별첨장\t글자\t도식\t표\t표행\t코드줄\t강의분\t실습설명분\t별첨분");
  let totalTalk = 0, totalPractice = 0;
  for (const r of results) {
    const talk = sum(r.topics, (t) => t.minutes, TALK) + r.front.minutes;
    const practice = sum(r.topics, (t) => t.minutes, ["실습"]);
    const appendix = sum(r.topics, (t) => t.minutes, ["별첨"]);
    const bodySlides = sum(r.topics, (t) => t.slides, [...TALK, "실습"]) + r.front.slides;
    const appendixSlides = sum(r.topics, (t) => t.slides, ["별첨"]);
    totalTalk += talk;
    totalPractice += practice;
    console.log([
      r.file, bodySlides + appendixSlides, bodySlides, appendixSlides,
      sum(r.topics, (t) => t.chars, TALK),
      sum(r.topics, (t) => t.visuals, TALK),
      sum(r.topics, (t) => t.tables, TALK),
      sum(r.topics, (t) => t.rows, TALK),
      sum(r.topics, (t) => t.codeLines, TALK),
      round1(talk), round1(practice), round1(appendix),
    ].join("\t"));
  }
  console.log("합계\t강의 " + round1(totalTalk) + "분 + 실습 설명 " + round1(totalPractice) + "분 (cpm " + RATE.cpm + ")");
}

main().catch((e) => { console.error(e); process.exit(1); });
