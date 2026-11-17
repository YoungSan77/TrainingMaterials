"use strict";
// Port of LecturePpt.inspect()/Report: re-reads the written PPTX and checks it against the
// Manifest that produced it — the same "render, then re-read and verify" self-check the Java
// original performs before ever declaring PASS.
const { A, P, all, shape, text, body, kids, child, children, paragraph } = require("./xml");
const { readZip } = require("./zip");
const { slideParts } = require("./template");

function numberedText(sh) {
  return all(sh, A, "p").map(p => {
    const auto = all(p, A, "buAutoNum")[0];
    if (!auto) return paragraph(p);
    const n = Number(auto.getAttribute("startAt") || 1);
    const kind = auto.getAttribute("type");
    const prefix = kind === "circleNumDbPlain" ? String.fromCodePoint(0x2460 + n - 1) + " " : kind === "arabicPeriod" ? n + ". " : "";
    return prefix + paragraph(p);
  }).join("\n");
}

function reportJson(errors, slides, blocks, warnings) {
  const q = (s) => JSON.stringify(s);
  return (
    "{\n  \"status\": " + q(errors.length === 0 ? "PASS" : "FAIL") + ",\n  \"slides\": " + slides +
    ",\n  \"checked_blocks\": " + blocks + ",\n  \"visual_status\": \"NOT_VERIFIED\",\n  \"errors\": [" +
    errors.map(q).join(",") + "]" + (warnings ? ",\n  \"warnings\": [" + warnings.map(q).join(",") + "]" : "") + "\n}\n"
  );
}

async function inspect(outputPath, m) {
  const data = await readZip(outputPath);
  const parts = slideParts(data);
  const errors = [];
  let blocks = 0;
  if (parts.length !== m.pages.length) errors.push("Slide count mismatch");
  const { parseXml } = require("./xml");
  for (let i = 0; i < Math.min(parts.length, m.pages.length); i++) {
    const doc = parseXml(data.get(parts[i]));
    const p = m.pages[i];
    const prefix = "Slide " + (i + 1) + ": ";
    const ids = new Set();
    for (const nv of all(doc, P, "cNvPr")) {
      const v = nv.getAttribute("id");
      if (ids.has(v)) errors.push(prefix + "duplicate ID");
      ids.add(v);
    }
    if (text(shape(doc, 2)) !== p.heading) errors.push(prefix + "heading mismatch");
    // The cover and TOC slides intentionally carry no top-right session name (builder.js
    // `p.isCover`, `p.isToc`): neither is a "일반 슬라이드" in production-guide.md's sense.
    // An appendix slide reads "별첨: <세션명>" (builder.js appendixSessionName).
    // 묶음 덱은 세션마다 우측 상단 세션명이 다르다 — 그 장이 구성된 세션(p.session)과 견준다.
    const label = p.session || m.title;
    // 사용자 배치 지시: 구분선 위 우측 Shape 5가 세션명이고 Shape 6은 비운다.
    if (text(shape(doc, 5)) !== (p.isToc || p.isCover || p.isCourseGoal ? "" : p.appendix ? "별첨: " + label : label)) errors.push(prefix + "title mismatch");
    if (text(shape(doc, 6)) !== "") errors.push(prefix + "session name in the unused box");
    if (text(shape(doc, 7)) !== m.source) errors.push(prefix + "source mismatch");
    for (const item of p.items) {
      const sh = shape(doc, item.id);
      blocks++;
      if (item.kind === "table") {
        const rows = [];
        for (const row of all(sh, A, "tr")) {
          rows.push(kids(row, A, "tc").map((c) => text(c)));
          let ext = false;
          for (const c of children(row)) {
            if (c.localName === "extLst") ext = true;
            else if (ext) errors.push(prefix + "invalid table row sequence");
          }
        }
        if (JSON.stringify(rows) !== JSON.stringify(item.rows)) errors.push(prefix + "table content mismatch");
        const tablePt=p.s03Profile && p.documentTablePt===8 && (p.appendix||/^11\. LLM 초안 검토(?: |$)/.test(p.heading))?8:10;
        for (const rp of all(sh, A, "rPr")) if (rp.getAttribute("sz") !== String(tablePt*100)) errors.push(prefix + `table font !=${tablePt}pt`);
        if(p.s03Profile){
          // courses/ai-native/production-standard.md: every cell, including ordinary tables.
          for(const c of all(sh,A,'tc'))for(const side of ['marL','marR','marT','marB'])
            if(child(c,A,'tcPr')?.getAttribute(side)!=='54000')errors.push(prefix+`table ${side} !=54000EMU`);
          const frame=child(child(sh,P,'xfrm'),A,'ext');
          const width=all(sh,A,'gridCol').reduce((n,c)=>n+Number(c.getAttribute('w')),0);
          if(Math.abs(width-Number(frame?.getAttribute('cx')))>7)errors.push(prefix+'table width != column sum');
        }
      } else {
        if ((all(sh, A, "buAutoNum").length ? numberedText(sh) : text(sh)) !== item.text) errors.push(prefix + "text/code mismatch");
        if (item.kind === "source") {
          for (const rp of all(sh, A, "rPr")) if (!["800", "900", "1000"].includes(rp.getAttribute("sz"))) errors.push(prefix + "source font outside 8~10pt");
        }
        if (["input","gherkin"].includes(item.kind)) {
          for(const rp of all(sh,A,"rPr"))if(rp.getAttribute("sz")!=="1200")errors.push(prefix+"editable input font must be 12pt");
          for(const p of all(sh,A,"p")) {
            const pr=child(p,A,"pPr");
            for(const side of ["spcBef","spcAft"])if(child(child(pr,A,side),A,"spcPts")?.getAttribute("val")!=="300")errors.push(prefix+"editable input paragraph spacing must be 3pt");
          }
        }
        if (["code", "tree"].includes(item.kind)) {
          for (const par of kids(body(sh), A, "p")) {
            const pr = child(par, A, "pPr");
            const tags = children(pr).map((e) => e.localName);
            for (const k of ["spcBef", "spcAft"]) {
              const e = child(pr, A, k);
              const val = e ? child(e, A, "spcPts") : null;
              if (!val || val.getAttribute("val") !== "600") errors.push(prefix + k + " !=6pt");
            }
            if (tags.indexOf("spcBef") > tags.indexOf("spcAft")) errors.push(prefix + "invalid paragraph sequence");
          }
          for (const rp of all(sh, A, "rPr")) if (rp.getAttribute("sz") !== "1000") errors.push(prefix + "code font !=10pt");
        }
      }
    }
  }
  for (const c of m.codes) if (c.parts.join("\n") !== c.source) errors.push("Code lost during pagination");
  return { errors, slides: parts.length, blocks, json: () => reportJson(errors, parts.length, blocks) };
}

module.exports = { inspect, reportJson, numberedText };
