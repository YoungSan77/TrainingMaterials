"use strict";
// 세는 말을 숫자로 통일한다 — guides/session-authoring-guide.md 「수를 적는 법」.
//
//   node tools/normalize-numbers.js courses/ai-native/sessions/s0*.md          바꿀 것만 보인다
//   node tools/normalize-numbers.js --apply courses/ai-native/sessions/s0*.md  파일을 고친다
//
// 바꾸는 것 — 2 이상의 수 + 세는 말: "세 가지" → "3가지", "여섯 단계" → "6단계".
// 두는 것 —
//   * "한 …"(한 번·한 줄·한 장·한 가지): '하나'를 뜻하는 관형어다. "1번"은 번호로 읽힌다.
//   * "… 번"(두 번·세 번): 횟수의 번은 숫자로 쓰면 번호와 헷갈린다.
//   * 코드 블록과 영문 인용 안의 글.
// 홀로 쓴 수(미정 셋, 검사 다섯)는 세는 말이 없어 자동으로 바꾸지 않고 목록으로만 알린다.
const fs = require("fs");

const NUM = { "두": 2, "세": 3, "네": 4, "다섯": 5, "여섯": 6, "일곱": 7, "여덟": 8, "아홉": 9, "열": 10, "열한": 11, "열두": 12 };
// 숫자를 바로 붙여도 읽히는 세는 말만 둔다. "세 방식"→"3방식", "두 상태"→"2상태"처럼 어색해지는
// 말(방식·상태·조건·전이·자리)은 넣지 않는다 — 그런 자리는 문장째로 고쳐야 한다.
const UNITS = ["가지", "개", "곳", "단계", "세션", "장", "줄", "명", "행", "열", "원칙"];
// 세는 말 뒤에는 조사가 붙는다("3가지를", "5곳에서"). 조사만 허용하고 다른 한글이 이어지면
// 같은 글자로 시작하는 다른 낱말이므로("세 개발 방식"의 개) 건드리지 않는다.
const JOSA = "은|는|이|가|을|를|의|에|와|과|도|만|로|으로|나|며|씩|뿐|까지|부터|라도|라|여도|여서";
const COUNT = new RegExp(
  "(?<![가-힣])(" + Object.keys(NUM).join("|") + ")\\s*(" + UNITS.join("|") + ")"
  + "(?:(?![가-힣])|(?=(?:" + JOSA + ")(?![가-힣])))", "g");
// 세는 말 없이 홀로 쓴 수 — 사람이 판단한다.
const BARE = /(?<![가-힣])(둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열한|열두)(?![가-힣])/g;

// 코드 블록과 영문 인용은 건드리지 않는다.
function editableLines(text) {
  const lines = text.split("\n");
  const out = [];
  let fence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) { fence = !fence; out.push(false); continue; }
    out.push(!fence);
  }
  return out;
}
function withoutQuotes(line) {
  // "영문 인용" 안의 글은 원문이므로 제외한다. 따옴표 쌍만 가린다.
  return line.replace(/"[^"]*"/g, (m) => " ".repeat(m.length));
}

function convert(text) {
  const editable = editableLines(text);
  const lines = text.split("\n");
  const changes = [];
  const bare = [];
  const out = lines.map((line, i) => {
    if (!editable[i]) return line;
    const masked = withoutQuotes(line);
    let result = line;
    const hits = [];
    let m;
    COUNT.lastIndex = 0;
    while ((m = COUNT.exec(masked))) hits.push({ at: m.index, text: m[0], num: NUM[m[1]], unit: m[2] });
    for (const h of hits.reverse()) {
      const to = String(h.num) + h.unit;
      result = result.slice(0, h.at) + to + result.slice(h.at + h.text.length);
      changes.push({ line: i + 1, from: h.text, to });
    }
    BARE.lastIndex = 0;
    while ((m = BARE.exec(masked))) bare.push({ line: i + 1, word: m[0], context: line.trim().slice(0, 60) });
    return result;
  });
  return { text: out.join("\n"), changes, bare };
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) {
    console.error("사용법: node tools/normalize-numbers.js [--apply] <원고.md …>");
    process.exit(2);
  }
  let total = 0, bareTotal = 0;
  for (const f of files) {
    const src = fs.readFileSync(f, "utf-8");
    const { text, changes, bare } = convert(src);
    if (changes.length) {
      console.log("== " + f + " — " + changes.length + "곳");
      const seen = new Map();
      for (const c of changes) seen.set(c.from + "→" + c.to, (seen.get(c.from + "→" + c.to) || 0) + 1);
      for (const [k, n] of [...seen].sort((a, b) => b[1] - a[1])) console.log("   " + k + (n > 1 ? "  ×" + n : ""));
    }
    if (bare.length) {
      console.log("-- " + f + " — 세는 말이 없어 사람이 볼 것 " + bare.length + "곳");
      for (const b of bare) console.log("   " + b.line + "행: " + b.context);
    }
    total += changes.length;
    bareTotal += bare.length;
    if (apply && changes.length) fs.writeFileSync(f, text, "utf-8");
  }
  console.log((apply ? "고침 " : "바꿀 곳 ") + total + "곳, 사람이 볼 것 " + bareTotal + "곳");
}

main();
