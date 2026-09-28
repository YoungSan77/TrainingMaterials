"use strict";
// Port of LecturePpt.inspect()/Report: re-reads the written PPTX and checks it against the
// Manifest that produced it — the same "render, then re-read and verify" self-check the Java
// original performs before ever declaring PASS.
const { A, P, all, shape, text, body, kids, child, children } = require("./xml");
const { readZip } = require("./zip");
const { slideParts } = require("./referenceRenderer");

// `warnings` is only passed by the general Session Production path; the lecture-java baseline
// layouts keep the original report shape byte for byte.
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
    // The TOC slide intentionally carries no top-right session name (see builder.js `p.isToc`).
    if (text(shape(doc, 5)) !== (p.isToc ? "" : m.title)) errors.push(prefix + "title mismatch");
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
        for (const rp of all(sh, A, "rPr")) if (rp.getAttribute("sz") !== "1000") errors.push(prefix + "table font !=10pt");
      } else {
        if (text(sh) !== item.text) errors.push(prefix + "text/code mismatch");
        if (item.kind === "source") {
          for (const rp of all(sh, A, "rPr")) if (!["800", "900", "1000"].includes(rp.getAttribute("sz"))) errors.push(prefix + "source font outside 8~10pt");
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

module.exports = { inspect, reportJson };
