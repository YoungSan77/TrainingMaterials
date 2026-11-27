#!/usr/bin/env node
"use strict";
// 렌더된 결과에서만 보이는 결함을 기계가 잡는다 — 사람의 눈은 교육 내용에 쓰게 하려는 것이다.
//
// 사용: node tools/check-rendered.js <sNN.pptx…>
//   PDF는 `out/review/<sNN>/<sNN>.pdf`에서 찾는다(`tools/review-pdf.sh`가 만든다).
//   PDF가 없으면 PDF가 필요한 항목은 **미검증**이다 — PASS로 올리지 않는다.
//
// 잡는 것(2026-11-27, S01 시각 검토에서 사람이 잡았던 것들):
//   1. 고아 줄      — 문단의 마지막 줄에 한두 글자만 떨어진 것(마침표 하나가 다음 줄로 넘어간 경우)
//   2. 본문 이탈    — 글자가 좌우 여백이나 페이지 번호선 아래로 나간 것(잘림·넘침의 신호)
//   3. 세션명 자리  — 우측 상단 세션명이 장마다 다른 자리에 있는 것
//   4. 도식의 여백  — 도식 아래가 크게 비어 도식을 키울 수 있는 것
//
// 1·2는 PowerPoint가 다시 줄바꿈한 **실제 렌더 결과**라야 알 수 있어 PDF를 본다. 3·4는 좌표라서
// PPTX에서 바로 잰다(AGENTS.md 「이미지 대신 파일로 확인」).
//
// 판정 함수는 입출력과 떼어 두었다 — 고정 입력으로 검사 자체를 시험한다(check-rendered.test.js).
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const EMU_IN = 914400;
const PT_IN = 72;
// 슬라이드는 720 x 540pt(10 x 7.5in)다. 본문 띠의 좌우는 템플릿의 본문 상자(0.4in)에서 왔고,
// 아래는 페이지 번호 자리(PAGE_NUM_Y = 6449625 EMU)다. 번호와 저작권 줄은 그 아래에 있다.
const BODY_LEFT = 0.3 * PT_IN;
const BODY_RIGHT = 9.7 * PT_IN;
const BODY_BOTTOM_IN = 6449625 / EMU_IN;
const BODY_BOTTOM = BODY_BOTTOM_IN * PT_IN;
// 도식 아래가 이보다 많이 비면 더 키울 자리가 있다는 뜻이다. 다만 이미 본문 폭을 다 쓴 도식은
// 가로가 한도라 더 커질 수 없으므로 세지 않는다 — 고칠 수 없는 경고는 소음이다.
const SLACK_IN = 1.0;
const FULL_BAND_IN = 9.0;
const ORPHAN_CHARS = 2;
const PAGE_LABEL = /^-\s*\d+\s*-$/;

// 페이지 번호와 저작권 줄은 본문이 아니다.
const isChrome = (text) => PAGE_LABEL.test(text) || text.startsWith("©");

// pages: [[ {text,xMin,yMin,xMax,yMax}, … ], … ] — 장마다 **그려진 줄의 목록**이다.
// 문단 묶음으로 보지 않는다. pdftotext는 줄바꿈으로 떨어진 한두 글자를 **제 블록**으로 떼어 놓기
// 때문에, 묶음의 마지막 줄만 보면 정작 찾으려던 고아를 놓친다(2026-11-27 실측).
function checkLines(pages) {
  const findings = [];
  pages.forEach((lines, index) => {
    const slide = index + 1;
    const sorted = [...lines].sort((a, b) => a.yMin - b.yMin);
    sorted.forEach((line, i) => {
      if (!line.text || isChrome(line.text)) return;
      if (line.xMin < BODY_LEFT - 0.5 || line.xMax > BODY_RIGHT + 0.5) {
        findings.push({ level: "오류", slide, message: `글이 좌우 본문 띠를 벗어났다: "${line.text.slice(0, 30)}"` });
      } else if (line.yMax > BODY_BOTTOM + 0.5) {
        findings.push({ level: "오류", slide, message: `글이 페이지 번호 자리까지 내려왔다: "${line.text.slice(0, 30)}"` });
      }
      // 고아 줄 — 한두 글자짜리 줄이 **바로 위의 긴 줄과 같은 왼쪽 끝에서** 시작하면 줄바꿈으로
      // 떨어진 꼬리다. 제 줄로 시작하는 짧은 말(표 칸, 제목)과 가르는 기준이 그 둘이다.
      const letters = line.text.replace(/\s/g, "");
      if (letters.length === 0 || letters.length > ORPHAN_CHARS) return;
      const height = line.yMax - line.yMin;
      const width = line.xMax - line.xMin;
      const above = sorted[i - 1];
      if (!above || isChrome(above.text)) return;
      const gap = line.yMin - above.yMax;
      const sameLeft = Math.abs(line.xMin - above.xMin) <= 3;
      const muchLonger = above.xMax - above.xMin >= width * 3;
      // 꼬리는 **오른쪽 끝에 닿아 끊긴 줄** 뒤에만 생긴다. 표의 열은 같은 왼쪽 끝에서 시작하고
      // 행 간격도 좁아 위 조건만으로는 짧은 칸("위험")이 꼬리로 잡힌다 — 실제로 그랬다.
      const wrapped = above.xMax >= BODY_RIGHT - 45;
      if (gap <= height * 0.8 && sameLeft && muchLonger && wrapped) {
        findings.push({ level: "경고", slide, message: `줄바꿈으로 "${letters}"만 다음 줄에 떨어졌다. 앞 문장을 줄여 한 줄로 당긴다.` });
      }
    });
  });
  return findings;
}

// slides: [{ slide, sessionName: "x,y"|null, pictures: [{ bottomIn }] }, …]
function checkShapes(slides) {
  const findings = [];
  const places = new Map();
  for (const s of slides) {
    if (s.sessionName) {
      if (!places.has(s.sessionName)) places.set(s.sessionName, []);
      places.get(s.sessionName).push(s.slide);
    }
    for (const pic of s.pictures || []) {
      const slack = BODY_BOTTOM_IN - pic.bottomIn;
      if (slack > SLACK_IN && pic.widthIn < FULL_BAND_IN - 0.2) {
        findings.push({ level: "경고", slide: s.slide, message: `도식 아래가 ${slack.toFixed(2)}in 비었다. 도식을 키우거나 본문을 늘린다.` });
      }
    }
  }
  if (places.size > 1) {
    const where = [...places.entries()].map(([place, list]) => `${list.join("·")}장(${place})`).join(" / ");
    findings.push({ level: "오류", slide: 0, message: `세션명이 장마다 다른 자리에 있다 — ${where}` });
  }
  return findings;
}

// ── 입출력 ────────────────────────────────────────────────────────────────────
// pdftotext -bbox-layout의 출력은 <page>/<block>/<line>/<word>로 단순해서 정규식으로 읽는다.
function pdfPages(pdf) {
  const xml = execFileSync("pdftotext", ["-bbox-layout", pdf, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return xml.split("<page ").slice(1).map((pageXml) => {
    const lines = [];
    for (const lineXml of pageXml.split("<line ").slice(1)) {
      const box = /xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)"/.exec(lineXml);
      if (!box) continue;
      const words = [...lineXml.matchAll(/<word[^>]*>([^<]*)<\/word>/g)].map((m) => m[1]);
      lines.push({
        text: words.join(" ").trim(),
        xMin: Number(box[1]), yMin: Number(box[2]), xMax: Number(box[3]), yMax: Number(box[4]),
      });
    }
    return lines;
  });
}

async function readSlides(pptx) {
  const { readZip } = require("../engine/production/src/zip");
  const { parseXml, A, P, all } = require("../engine/production/src/xml");
  const entries = await readZip(pptx);
  const names = [...entries.keys()].filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  return names.map((name, index) => {
    const doc = parseXml(entries.get(name).toString("utf8"));
    let sessionName = null;
    for (const sp of all(doc.documentElement, P, "sp")) {
      const id = all(sp, P, "cNvPr")[0];
      if (!id || id.getAttribute("id") !== "5") continue;
      // 표지·목차 장은 세션명을 쓰지 않는다 — 빈 상자는 자리 비교에서 뺀다.
      if (!all(sp, A, "t").map((t) => t.textContent).join("").trim()) continue;
      const off = all(sp, A, "off")[0];
      if (off) sessionName = off.getAttribute("x") + "," + off.getAttribute("y");
    }
    const pictures = [];
    for (const pic of all(doc.documentElement, P, "pic")) {
      const off = all(pic, A, "off")[0], ext = all(pic, A, "ext")[0];
      if (off && ext) {
        pictures.push({
          bottomIn: (Number(off.getAttribute("y")) + Number(ext.getAttribute("cy"))) / EMU_IN,
          widthIn: Number(ext.getAttribute("cx")) / EMU_IN,
        });
      }
    }
    return { slide: index + 1, sessionName, pictures };
  });
}

async function main() {
  const inputs = process.argv.slice(2);
  if (!inputs.length) {
    console.error("사용: node tools/check-rendered.js <sNN.pptx…>");
    process.exit(2);
  }
  let failed = false;
  for (const input of inputs) {
    const pptx = input.replace(/\.md$/i, ".pptx");
    if (!fs.existsSync(pptx)) {
      console.log(`${pptx}\n  없음 — 먼저 렌더링한다.`);
      failed = true;
      continue;
    }
    const name = path.basename(pptx, ".pptx");
    const pdf = path.join(path.resolve(__dirname, ".."), "out", "review", name, `${name}.pdf`);
    const hasPdf = fs.existsSync(pdf);
    const findings = (await checkShapes(await readSlides(pptx)))
      .concat(hasPdf ? checkLines(pdfPages(pdf)) : []);

    console.log(pptx);
    for (const f of findings.sort((a, b) => a.slide - b.slide)) {
      console.log(`  ${f.level}  ${f.slide ? f.slide + "장" : "전체"}: ${f.message}`);
    }
    const errors = findings.filter((f) => f.level === "오류").length;
    console.log(`  오류 ${errors}개 · 경고 ${findings.length - errors}개`);
    if (!hasPdf) {
      console.log(`  미검증: 고아 줄과 본문 이탈 — ${path.relative(process.cwd(), pdf)}가 없다.`);
      console.log(`  먼저 실행한다: tools/review-pdf.sh ${pptx}`);
    }
    if (errors) failed = true;
  }
  process.exit(failed ? 1 : 0);
}

module.exports = { checkLines, checkShapes, BODY_BOTTOM, BODY_RIGHT, BODY_LEFT, SLACK_IN };

if (require.main === module) main().catch((e) => { console.error(e); process.exit(2); });
