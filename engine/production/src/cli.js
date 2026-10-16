#!/usr/bin/env node
"use strict";
// Session Production: takes a single Markdown path. The session name comes from the manuscript's
// own "Session 명:" header (see parse.js), the deck skeleton is template/ (template.js), and the
// output is <input basename>.pptx beside the input unless --output is given.
//
// --check <md...>: run every check (references, structure, code, layout) on one or more
// manuscripts without touching their decks -- the deck and its .qa.json go to a temporary folder
// and are removed. Used after renumbering a session, to re-check every session that refers to it
// (production-guide.md "자동 검사 — 참조와 경고").
const fs = require("fs");
const os = require("os");
const path = require("path");
const { generateFile } = require("./generate");
const { TEMPLATE_DIR } = require("./template");

async function check(inputs) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tm-check-"));
  let failed = 0;
  try {
    for (const input of inputs) {
      console.log("== " + input);
      const output = path.join(dir, path.basename(input).replace(/\.[^.]+$/, "") + ".pptx");
      try {
        await generateFile(path.resolve(input), output, TEMPLATE_DIR);
      } catch (ex) {
        failed++;
        console.error("생성 중단: " + ex.message);
      }
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  return failed;
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--check") {
    const inputs = args.slice(1);
    if (!inputs.length) { console.error("사용법: node src/cli.js --check <session.md...>"); process.exit(1); }
    process.exit((await check(inputs)) ? 1 : 0);
  }
  const opts = {};
  const inputs = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) opts[a] = args[++i];
    else inputs.push(a);
  }
  if (!inputs.length) { console.error("사용법: node src/cli.js <session.md...> | --check <session.md...>"); process.exit(1); }
  // 원고를 여러 개 주면 모두 만든다. 예전에는 마지막 하나만 만들고 나머지는 조용히 건너뛰어,
  // 일괄 재렌더링이 돌지 않았는데도 돈 것처럼 보였다.
  if (inputs.length > 1 && opts["--output"]) {
    console.error("--output은 원고 하나에만 쓴다.");
    process.exit(1);
  }
  let failed = 0;
  for (const input of inputs) {
    const name = path.basename(input).replace(/\.[^.]+$/, "") + ".pptx";
    const output = opts["--output"] ? path.resolve(opts["--output"]) : path.resolve(path.dirname(input), name);
    try {
      await generateFile(path.resolve(input), output, TEMPLATE_DIR);
    } catch (ex) {
      failed++;
      console.error("생성 중단(" + input + "): " + ex.message);
    }
  }
  if (failed) process.exit(1);
}

main();
