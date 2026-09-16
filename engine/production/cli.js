#!/usr/bin/env node
'use strict';
// cli.js — production engine 진입점.
//   node engine/production/cli.js <input.md> --output <out.pptx> [--title T] [--source S]
//
// 동작 원칙: 실패한 생성은 기존 산출물을 절대 덮지 않는다(atomic replace). overflow가 나면
// 폰트를 줄이거나 내용을 자르지 않고 중단한다(paginate.js가 이미 이 규칙으로 실패한다).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { parseMarkdown } = require('./markdown.js');
const { paginate } = require('./paginate.js');
const { renderPptx } = require('./render.js');
const { validatePptx } = require('./validate.js');
const { normalizeForDeterminism } = require('./normalize.js');
const plantumlRender = require('../plantuml/render.js');
const { renderMermaid } = require('./mermaidAdapter.js');
const { renderChart } = require('./chartAdapter.js');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { args[a.slice(2)] = argv[i + 1]; i++; }
    else args._.push(a);
  }
  return args;
}

async function generate(inputPath, { title, source } = {}) {
  const src = fs.readFileSync(inputPath, 'utf8');
  const { topics } = parseMarkdown(src);
  const pages = paginate(topics, {
    renderDiagram: plantumlRender.renderDiagram,   // PlantUML — UML
    renderMermaid,                                  // Mermaid — 구조/흐름/관계
    renderChart,                                     // matplotlib — 정량 chart
  });
  const pres = renderPptx(pages, { title, source });
  const rawBuf = await pres.write({ outputType: 'nodebuffer' });
  const buf = await normalizeForDeterminism(rawBuf);
  return { buf, pages };
}

async function atomicWrite(outputPath, buf) {
  const dir = path.dirname(outputPath);
  const tmp = path.join(dir, `.${path.basename(outputPath)}.tmp-${process.pid}-${crypto.randomBytes(4).toString('hex')}`);
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, outputPath);   // POSIX rename은 같은 파일시스템 내 원자적 교체
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args._[0];
  if (!inputPath) { console.error('사용법: node engine/production/cli.js <input.md> --output <out.pptx>'); process.exit(2); }
  const outputPath = args.output || 'output.pptx';
  const title = args.title;
  const source = args.source;

  let result;
  try {
    result = await generate(inputPath, { title, source });
  } catch (e) {
    console.error(`[중단] 생성 실패 — 기존 산출물(${outputPath})은 그대로 보존된다.\n${e.message}`);
    process.exit(1);
  }

  const check = await validatePptx(result.buf, result.pages);
  if (!check.pass) {
    console.error(`[중단] 검증 실패 — 기존 산출물(${outputPath})은 그대로 보존된다.`);
    check.problems.forEach(p => console.error('  - ' + p));
    process.exit(1);
  }

  await atomicWrite(outputPath, result.buf);
  console.log(`[완료] ${outputPath} (${result.pages.length}장, ${result.buf.length} bytes)`);
}

if (require.main === module) {
  main().catch(e => { console.error('[예외]', e); process.exit(1); });
}

module.exports = { generate, atomicWrite, parseArgs };
