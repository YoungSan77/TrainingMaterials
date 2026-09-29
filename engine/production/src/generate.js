"use strict";
// Port of LecturePpt.generateFile(): parse -> render -> inspect/validate -> write .qa.json ->
// atomic temp-file-then-rename (never overwrites a good output with a bad one).
const fs = require("fs");
const path = require("path");
const { need } = require("./xml");
const { parse } = require("./parse");
const builder = require("./builder");
const { inspect, reportJson } = require("./inspect");
const { checkReferences } = require("./references");
const { checkStructure, wrappingCells, numberedDiagramLabels, unboldedText, missingNotes } = require("./structure");
const { checkCodeSources, checkEnumConsistency } = require("./codeSource");

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

async function generateFile(inputPath, outputPath, templatePath) {
  need(fs.existsSync(inputPath) && fs.statSync(inputPath).isFile(), "입력 파일이 없다: " + inputPath);
  need(path.resolve(inputPath) !== path.resolve(outputPath), "입력과 출력 경로는 달라야 한다.");
  const { session, toc, sections } = parse(fs.readFileSync(inputPath, "utf-8"));
  const parent = path.dirname(path.resolve(outputPath));
  fs.mkdirSync(parent, { recursive: true });
  const tmp = path.join(parent, "lecture-candidate-" + process.pid + "-" + Date.now() + ".pptx");
  try {
    need(session, "Markdown 상단에 'Session 명: <값>' 헤더가 필요하다.");
    const m = await builder.render(sections, templatePath, tmp, session, toc);
    const inspected = await inspect(tmp, m);
    const source = fs.readFileSync(inputPath, "utf-8");
    const refs = checkReferences(inputPath, source);
    refs.errors.push(...checkStructure(inputPath, session, sections, m.pages));
    const code = checkCodeSources(inputPath, source);
    refs.errors.push(...code.errors);
    refs.warnings.push(...code.warnings);
    refs.warnings.push(...wrappingCells(sections));
    refs.warnings.push(...numberedDiagramLabels(sections));
    refs.warnings.push(...unboldedText(sections));
    if (!/-add\.md$/i.test(inputPath)) refs.warnings.push(...missingNotes(sections));
    refs.warnings.push(...checkEnumConsistency(inputPath));
    // Diagram text below MIN_PT (production-guide.md "Visual layout 및 가독성"): the diagram had to
    // shrink past 7pt to fit, so the source should split or simplify it.
    m.pages.forEach((p, i) => (p.pictures || []).forEach((pic) => {
      const pt = builder.pictureTextPt(pic, pic.bounds);
      if (pt < builder.MIN_PT - 0.05) refs.warnings.push(`슬라이드 ${i + 1}: 도식 글자가 ${pt.toFixed(1)}pt로 ${builder.MIN_PT}pt보다 작다.`);
    }));
    const warnings = refs.warnings.concat(sparseContinuations(m));
    const errors = inspected.errors.concat(refs.errors);
    const report = { errors, slides: inspected.slides, blocks: inspected.blocks, json: () => reportJson(errors, inspected.slides, inspected.blocks, warnings) };
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
