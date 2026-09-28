#!/usr/bin/env node
"use strict";
// Session Production: takes a single Markdown path. The session name comes from the manuscript's
// own "Session 명:" header (see parse.js), the deck skeleton is template/ (template.js), and the
// output is <input basename>.pptx beside the input unless --output is given.
const path = require("path");
const { generateFile } = require("./generate");
const { TEMPLATE_DIR } = require("./template");

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
  const name = path.basename(input).replace(/\.[^.]+$/, "") + ".pptx";
  const output = opts["--output"] ? path.resolve(opts["--output"]) : path.resolve(path.dirname(input), name);
  try {
    await generateFile(path.resolve(input), output, TEMPLATE_DIR);
  } catch (ex) {
    console.error("생성 중단: " + ex.message);
    process.exit(1);
  }
}

main();
