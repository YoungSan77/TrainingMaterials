#!/usr/bin/env node
"use strict";
// General Session Production: normal usage takes a single Markdown path and nothing else.
// The session name comes from the manuscript's own "Session 명:" header (see parse.js), the
// template is the repository's one approved base deck, and the output path is derived from the
// input. --title/--source/--template/--output/--layout remain as internal/debug overrides for
// the lecture-ppt-java behavioral regression baseline (--layout compact|reference), which is not
// exercised by normal Session Production and is never required for it.
const path = require("path");
const fs = require("fs");
const { generateFile } = require("./generate");

const DEFAULT_TEMPLATE = path.resolve(__dirname, "../../../references/production/lecture-java-baseline/templates/approved.pptx");

async function main() {
  const args = process.argv.slice(2);
  const opts = {};
  let input = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      opts[a] = args[++i];
    } else {
      input = a;
    }
  }
  if (!input) { console.error("사용법: node src/cli.js <session.md>"); process.exit(1); }
  const template = opts["--template"] ? path.resolve(opts["--template"]) : DEFAULT_TEMPLATE;
  if (!fs.existsSync(template)) { console.error("템플릿이 없다: " + template); process.exit(1); }
  const name = path.basename(input).replace(/\.[^.]+$/, "") + ".pptx";
  const output = opts["--output"] ? path.resolve(opts["--output"]) : path.resolve(path.dirname(input), name);
  const layout = opts["--layout"] || "auto";
  const title = opts["--title"], source = opts["--source"];
  try {
    await generateFile(path.resolve(input), output, template, title, source, layout);
  } catch (ex) {
    console.error("생성 중단: " + ex.message);
    process.exit(1);
  }
}

main();
