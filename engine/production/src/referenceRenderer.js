"use strict";
// Port of ReferenceRenderer.java: binds a 7-section manuscript onto the pre-approved 16-slide
// template using templates/layout-profile.xml as the fixed page/section/kind contract.
// Never silently falls back to a different page plan — every mismatch throws.
const path = require("path");
const fs = require("fs");
const {
  A, P, need, parseXml, xmlOut, children, kids, child, all, first, shape, paragraph, text, body, setText, spacing,
} = require("./xml");
const { rich } = require("./richText");
const { canonical } = require("./richText");
const { readZip, writeZip } = require("./zip");

function slideParts(data) {
  const pres = parseXml(data.get("ppt/presentation.xml"));
  const rels = parseXml(data.get("ppt/_rels/presentation.xml.rels"));
  const targets = new Map();
  for (const e of children(rels.documentElement)) {
    const target = e.getAttribute("Target");
    const norm = target.startsWith("/") ? target.slice(1) : path.posix.normalize(path.posix.join("ppt", target));
    targets.set(e.getAttribute("Id"), norm);
  }
  const out = [];
  const R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  for (const e of all(pres, P, "sldId")) out.push(targets.get(e.getAttributeNS(R, "id")));
  return out;
}

function of(s, kind) {
  return s.blocks.filter((b) => b.kind === kind);
}

function intro(s) {
  const t = of(s, "text");
  need(t.length > 0, "첫 문단이 필요하다: " + s.title);
  return t[0].text;
}

function units(source) {
  const re = /^\/\/\s*\d+-\d+\./gm;
  const starts = [];
  let m;
  while ((m = re.exec(source))) starts.push(m.index);
  need(starts.length > 0, "코드에 // 3-1. ... 형태의 구현 단위 표식이 필요하다. 다른 원고 구조는 --layout auto로 생성할 수 있다.");
  starts[0] = 0;
  const out = [];
  for (let i = 0; i < starts.length; i++) out.push(source.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : source.length));
  need(out.join("") === source, "Code units lost content");
  return out;
}

function indexes(value) {
  return value.split(",").map((s) => parseInt(s, 10));
}

function bind(page, id, value, kind, names) {
  const sh = shape(page.doc, id);
  const before = text(sh);
  const same = canonical(before) === canonical(value);
  if (!same) {
    need(
      value.split("\n").length <= before.split("\n").length + 2 && canonical(value).length <= canonical(before).length * 1.1 + 20,
      "승인된 영역보다 내용이 길다. --layout auto 또는 배치 프로필 수정이 필요하다."
    );
    const { plain } = require("./text");
    setText(sh, plain(value));
    if (kind === "code" || kind === "tree") {
      for (const p of kids(body(sh), A, "p")) rich(p, paragraph(p), 10, false, true, names);
    } else {
      for (const p of kids(body(sh), A, "p")) rich(p, paragraph(p), 18, false, false, new Set());
    }
  }
  need(canonical(text(sh)) === canonical(value), "Source/layout content mismatch");
  if (kind === "code" || kind === "tree") for (const p of kids(body(sh), A, "p")) spacing(p, 1, 1, null);
  page.items.push({ id, kind, text: text(sh), rows: [] });
}

async function render(sections, templatePath, outputPath, title, source) {
  const data = await readZip(templatePath);
  const parts = slideParts(data);
  const profilePath = path.join(path.dirname(templatePath), "layout-profile.xml");
  const config = parseXml(fs.readFileSync(profilePath));
  need(sections.length === parseInt(config.documentElement.getAttribute("sections"), 10), "이 승인 프로필은 7개 주제다. 다른 구성은 --layout auto를 명시해라.");
  need(parts.length === 16, "승인된 16장 템플릿이 필요하다.");

  const pages = [];
  const sourceChecks = [];
  const names = new Set();
  for (const part of parts) {
    const root = parseXml(data.get(part));
    for (const run_ of all(root, A, "r")) {
      const rp = child(run_, A, "rPr");
      if (rp && rp.getAttribute("b") === "1") {
        const m = (run_.textContent || "").match(/[A-Za-z_]\w*/g) || [];
        for (const g of m) names.add(g);
      }
    }
  }

  const unitMap = new Map();
  const consumedUnits = new Map();
  const consumedBlocks = new Map();
  const trees = new Set();
  const renderedCode = new Map();
  const renderedTree = new Map();

  for (const contract of children(config.documentElement)) {
    if (contract.tagName !== "contract") continue;
    const i = parseInt(contract.getAttribute("section"), 10) - 1;
    const s = sections[i];
    need(s.title === contract.getAttribute("title"), "주제 구성이 승인 프로필과 다르다. --layout auto 또는 프로필 갱신이 필요하다.");
    if (i > 0) {
      const expected = [];
      const found = [];
      for (const label of children(contract)) expected.push(label.getAttribute("kind") + ":" + label.textContent);
      let intro_ = false;
      for (const b of s.blocks) {
        if (["code", "tree", "table"].includes(b.kind)) continue;
        if (!intro_ && b.kind === "text" && i < 6) { intro_ = true; continue; }
        found.push(b.kind + ":" + b.text);
      }
      need(JSON.stringify(expected) === JSON.stringify(found), "배치에 연결되지 않은 본문/소제목 변경: " + s.title + ". --layout auto 또는 프로필 갱신이 필요하다.");
    }
  }

  for (const plan of children(config.documentElement)) {
    if (plan.tagName !== "page") continue;
    const slide = parseInt(plan.getAttribute("slide"), 10);
    const section = parseInt(plan.getAttribute("section"), 10);
    const kind = plan.getAttribute("kind");
    const root = parseXml(data.get(parts[slide - 1]));
    const page = { doc: root, origin: parts[slide - 1], heading: text(shape(root, 2)), items: [] };
    pages.push(page);
    const s = section > 0 ? sections[section - 1] : null;

    if (kind === "toc") {
      const sh = shape(root, 10);
      let pars = kids(body(sh), A, "p");
      for (const p of pars.slice()) if (paragraph(p).trim() === "") p.parentNode.removeChild(p);
      pars = kids(body(sh), A, "p");
      need(pars.length === sections.length, "TOC count mismatch");
      for (let i = 0; i < pars.length; i++) {
        const desired = sections[i].title.replace(/^\d+\.\s*/, "");
        if (!(canonical(desired) === canonical(paragraph(pars[i]))) && !(i === 6 && desired === "아키텍처 스타일 종합 비교표")) {
          rich(pars[i], desired, 18, true, false, new Set());
        }
        const pr = child(pars[i], A, "pPr");
        const num = pr ? child(pr, A, "buAutoNum") : null;
        if (num) num.setAttribute("startAt", String(i + 1));
      }
      setText(shape(root, 2), title + " 목차");
      page.heading = title + " 목차";
      page.items.push({ id: 10, kind: "body", text: text(sh), rows: [] });
    } else if (kind === "prose") {
      const joined = s.blocks.filter((b) => ["text", "bullet"].includes(b.kind)).map((b) => b.text).join("\n");
      const sh = shape(root, 8);
      if (canonical(joined) !== canonical(text(sh))) {
        const structured = [];
        for (const b of s.blocks) {
          if (b.kind === "bullet" && b.text.includes(":")) {
            const at = b.text.indexOf(":");
            structured.push({ kind: "heading", text: b.text.slice(0, at + 1), rows: [], depth: 0 });
            structured.push({ kind: "bullet", text: b.text.slice(at + 1).trim(), rows: [], depth: 1 });
          } else structured.push(b);
        }
        const { paragraphs } = require("./paragraphs");
        paragraphs(page, 8, structured, false);
      } else {
        page.items.push({ id: 8, kind: "body", text: text(sh), rows: [] });
      }
      need(canonical(joined) === canonical(text(sh)), "MVC body source mismatch");
    } else if (kind === "code-blocks") {
      const blocks = of(s, "code");
      const values = [];
      const used = consumedBlocks.get(section) || new Set();
      consumedBlocks.set(section, used);
      for (const index of indexes(plan.getAttribute("blocks"))) {
        need(index < blocks.length && !used.has(index), "Code block layout binding mismatch");
        used.add(index);
        values.push(blocks[index].text);
      }
      bind(page, 30, values.join("\n"), "code", names);
      const arr = renderedCode.get(section) || [];
      renderedCode.set(section, arr);
      arr.push(text(shape(root, 30)));
    } else if (kind === "tree") {
      const blocks = of(s, "tree");
      need(blocks.length === 1 && !trees.has(section), "One directory block per style is required");
      trees.add(section);
      bind(page, 30, blocks[0].text, "tree", names);
      const arr = renderedTree.get(section) || [];
      renderedTree.set(section, arr);
      arr.push(text(shape(root, 30)));
    } else if (kind === "code-units") {
      const blocks = of(s, "code");
      need(blocks.length === 1, "One implementation code block per style is required");
      if (!unitMap.has(section)) unitMap.set(section, units(blocks[0].text));
      const values = unitMap.get(section);
      const selected = [];
      const used = consumedUnits.get(section) || new Set();
      consumedUnits.set(section, used);
      for (const index of indexes(plan.getAttribute("units"))) {
        need(index < values.length && !used.has(index), "Code unit layout binding mismatch");
        used.add(index);
        selected.push(values[index]);
      }
      bind(page, 31, selected.join(""), "code", names);
      const arr = renderedCode.get(section) || [];
      renderedCode.set(section, arr);
      arr.push(text(shape(root, 31)));
    } else if (kind === "table") {
      const tables = of(s, "table");
      need(tables.length === 1, "One comparison table is required");
      const rows = tables[0].rows;
      const table = first(shape(root, 11), A, "tbl");
      const nativeRows = kids(table, A, "tr");
      need(nativeRows.length === rows.length, "표 행 수가 승인 프로필과 다르다. --layout auto 또는 프로필 갱신이 필요하다.");
      for (let ri = 0; ri < rows.length; ri++) {
        const cellsEls = kids(nativeRows[ri], A, "tc");
        need(cellsEls.length === rows[ri].length, "Table columns mismatch");
        for (let ci = 0; ci < cellsEls.length; ci++) {
          setText(cellsEls[ci], rows[ri][ci]);
          for (const rp of all(cellsEls[ci], A, "rPr")) rp.setAttribute("sz", "1000");
        }
        for (const ext of kids(nativeRows[ri], A, "extLst")) nativeRows[ri].appendChild(ext);
      }
      page.items.push({ id: 11, kind: "table", text: "", rows });
    } else {
      throw new Error("Unknown layout kind: " + kind);
    }

    if (plan.getAttribute("governing") === "true") bind(page, 8, intro(s), "body", names);
    setText(shape(root, 5), title);
    setText(shape(root, 6), "");
    setText(shape(root, 7), source);
    for (const sh of all(root, P, "sp")) if (/^- \d+ -$/.test(text(sh))) setText(sh, "- " + slide + " -");
    data.set(parts[slide - 1], xmlOut(root));
  }

  for (let i = 0; i < sections.length; i++) {
    const section = i + 1;
    const s = sections[i];
    if (consumedBlocks.has(section)) need(consumedBlocks.get(section).size === of(s, "code").length, "코드 블록이 승인 배치에 남았다. 프로필 갱신 필요");
    if (unitMap.has(section)) need(consumedUnits.get(section).size === unitMap.get(section).length, "코드 구현 단위가 승인 배치에 남았다. 프로필 갱신 필요");
    for (const type of ["code", "tree"]) {
      const original = of(s, type).map((b) => b.text).join("\n");
      const actual = (type === "code" ? renderedCode : renderedTree).get(section) || [];
      need(canonical(original) === canonical(actual.join("\n")), "코드/디렉터리 누락: " + s.title);
      sourceChecks.push({ source: canonical(original), parts: [canonical(actual.join("\n"))] });
    }
  }

  await writeZip(outputPath, data);
  return { pages, codes: sourceChecks, title, source };
}

module.exports = { render, slideParts, of, intro, units, indexes, bind, canonical };
