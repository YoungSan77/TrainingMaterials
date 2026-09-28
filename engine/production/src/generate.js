"use strict";
// Port of LecturePpt.generateFile(): parse -> render (reference|compact) -> inspect/validate ->
// write .qa.json -> atomic temp-file-then-rename (never overwrites a good output with a bad one).
const fs = require("fs");
const path = require("path");
const os = require("os");
const { need } = require("./xml");
const { parse } = require("./parse");
const referenceRenderer = require("./referenceRenderer");
const compactRenderer = require("./compactRenderer");
const builder = require("./builder");
const { inspect } = require("./inspect");
const { readZip } = require("./zip");
const { parseXml } = require("./xml");
const { checkReferences } = require("./references");

// A continuation slide that carries only a line or two of text (no table, visual or code) is a
// layout smell the author should look at (production-guide.md, "continuation"). Warning only.
function sparseContinuations(m) {
  const warnings = [];
  m.pages.forEach((p, i) => {
    const heading = String(p.heading || "").split("\n")[0];
    if (p.isToc || !/\(\d+\/\d+\)$/.test(heading)) return;
    if ((p.pictures || []).length) return;
    if (p.items.some((it) => ["table", "code", "tree", "source"].includes(it.kind))) return;
    if ((p.textCost || 0) >= 0.25 * 450) return;
    warnings.push("슬라이드 " + (i + 1) + ": \"" + heading + "\" continuation에 본문이 한두 줄뿐이다.");
  });
  return warnings;
}

async function reloadForCompactValidate(outputPath, expected) {
  const data = await readZip(outputPath);
  const parts = referenceRenderer.slideParts(data);
  need(parts.length === expected.pages.length, "Compact slide count");
  const pages = [];
  for (let n = 0; n < parts.length; n++) {
    const old = expected.pages[n];
    const page = { doc: parseXml(data.get(parts[n])), origin: old.origin, heading: old.heading, items: old.items.slice() };
    pages.push(page);
  }
  return { pages, codes: expected.codes, title: expected.title, source: expected.source };
}

async function generateFile(inputPath, outputPath, templatePath, title, source, layoutMode) {
  // General Session Production (no --layout) always resolves to "auto": it derives the session
  // name from the manuscript's own header and paginates arbitrary topic counts. "compact"/
  // "reference" stay reserved for the lecture-ppt-java behavioral regression baseline, which is
  // pinned to a fixed 7-section approved profile and is invoked explicitly with --title/--source.
  layoutMode = layoutMode || "auto";
  need(fs.existsSync(inputPath) && fs.statSync(inputPath).isFile(), "입력 파일이 없다: " + inputPath);
  need(path.resolve(inputPath) !== path.resolve(outputPath), "입력과 출력 경로는 달라야 한다.");
  const { session, toc, sections } = parse(fs.readFileSync(inputPath, "utf-8"));
  const parent = path.dirname(path.resolve(outputPath));
  fs.mkdirSync(parent, { recursive: true });
  const tmp = path.join(parent, "lecture-candidate-" + process.pid + "-" + Date.now() + ".pptx");
  try {
    let m;
    if (layoutMode === "compact") m = await compactRenderer.render(sections, templatePath, tmp, title, source);
    else if (layoutMode === "reference") m = await referenceRenderer.render(sections, templatePath, tmp, title, source);
    else if (layoutMode === "auto") {
      need(session, "Markdown 상단에 'Session 명: <값>' 헤더가 필요하다.");
      m = await builder.render(sections, templatePath, tmp, session, toc);
    } else throw new Error("--layout: reference, auto \uB610\uB294 compact");

    let report = await inspect(tmp, m);
    let warnings = [];
    if (layoutMode === "auto") {
      const refs = checkReferences(inputPath, fs.readFileSync(inputPath, "utf-8"));
      warnings = refs.warnings.concat(sparseContinuations(m));
      if (refs.errors.length) {
        const { reportJson } = require("./inspect");
        const errors = report.errors.concat(refs.errors);
        report = { errors, slides: report.slides, blocks: report.blocks, json: () => reportJson(errors, report.slides, report.blocks, warnings) };
      } else {
        const { reportJson } = require("./inspect");
        const r = report;
        report = { errors: r.errors, slides: r.slides, blocks: r.blocks, json: () => reportJson(r.errors, r.slides, r.blocks, warnings) };
      }
    }
    if (layoutMode === "compact") {
      const reloaded = await reloadForCompactValidate(tmp, m);
      const extra = compactRenderer.validate(reloaded);
      const errors = report.errors.concat(extra);
      const { reportJson } = require("./inspect");
      report = { errors, slides: report.slides, blocks: report.blocks, json: () => reportJson(errors, report.slides, report.blocks) };
    }
    const filename = path.basename(outputPath);
    const qaPath = path.join(path.dirname(outputPath), filename.replace(/\.pptx$/i, "") + ".qa.json");
    fs.writeFileSync(qaPath, report.json(), "utf-8");
    need(report.errors.length === 0, report.errors.join("\n"));
    fs.renameSync(tmp, outputPath);
    console.log("생성: " + outputPath + " (" + report.slides + "장), 자동 검사 PASS. PowerPoint 시각 검토 필요.");
    for (const w of warnings) console.log("경고: " + w);
    return { manifest: m, report };
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

module.exports = { generateFile, sparseContinuations };
