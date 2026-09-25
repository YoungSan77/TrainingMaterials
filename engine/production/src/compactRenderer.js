"use strict";
// Port of CompactRenderer.java: takes ReferenceRenderer's 16-slide result and repacks adjacent
// code-only pages into fewer, denser slides using real glyph-width measurement. Order-preserving,
// content-preserving (never drops/shrinks text) — a failed placement search throws, it never
// silently truncates.
const path = require("path");
const fontkit = require("fontkit");
const {
  A, P, R, REL, CT, need, parseXml, xmlOut, children, kids, child, all, first, el, copy, shape, paragraph, text, body, setText, spacing,
} = require("./xml");
const { readZip, writeZip } = require("./zip");
const { wide } = require("./text");
const referenceRendererMod = require("./referenceRenderer");
const { canonical } = require("./richText");

const LEFT = 32, RIGHT = 688, TOP = 76, BOTTOM = 510, GAP = 16, LEADING = 11.5;

// The reference build reported "Measured font in this build environment: SansSerif
// (Malgun Gothic unavailable)" — i.e. it fell back to the JVM's default logical sans-serif,
// which OpenJDK's Linux fontconfig maps to DejaVu Sans. This sandbox has no Malgun Gothic either
// (same situation), so DejaVu Sans/Bold is the closest available stand-in for that fallback.
// Loaded lazily (not at module scope) so that requiring this module -- which generate.js always
// does, regardless of --layout -- does not crash on a machine without this exact Linux path (e.g.
// a macOS dev machine running the general --layout auto Session Production path, which never
// calls into this file's glyph measurement at all).
const FONT_PATHS_REGULAR = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"];
const FONT_PATHS_BOLD = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"];
const FONT_NAME = "SansSerif";

let _fontRegular = null, _fontBold = null;
function openFirst(paths) {
  const fs = require("fs");
  for (const p of paths) if (fs.existsSync(p)) return fontkit.openSync(p);
  throw new Error("DejaVu Sans font not found (looked in: " + paths.join(", ") + "). --layout compact/reference code measurement requires it.");
}
function fontRegular() { return _fontRegular || (_fontRegular = openFirst(FONT_PATHS_REGULAR)); }
function fontBold() { return _fontBold || (_fontBold = openFirst(FONT_PATHS_BOLD)); }

const WIDTHS = new Map();
function width(cp, bold) {
  const key = cp * 2 + (bold ? 1 : 0);
  if (WIDTHS.has(key)) return WIDTHS.get(key);
  const w = glyphWidth(cp, bold);
  WIDTHS.set(key, w);
  return w;
}
function glyphWidth(cp, bold) {
  if (wide(cp)) return 10.2;
  const font = bold ? fontBold() : fontRegular();
  let glyph;
  try { glyph = font.glyphForCodePoint(cp); } catch (e) { glyph = null; }
  if (!glyph || glyph.id === 0) return 10.2;
  return (glyph.advanceWidth / font.unitsPerEm) * 10 * 1.04;
}

function pts(e, attr, def) {
  return e == null || !e.hasAttribute(attr) ? def : parseFloat(e.getAttribute(attr)) / 12700;
}

function rect(shapeEl) {
  let xf = first(shapeEl, A, "xfrm");
  if (!xf) xf = first(shapeEl, P, "xfrm");
  if (!xf) return [LEFT, TOP, RIGHT - LEFT, BOTTOM - TOP];
  const off = child(xf, A, "off");
  const ext = child(xf, A, "ext");
  return [pts(off, "x", LEFT), pts(off, "y", TOP), pts(ext, "cx", RIGHT - LEFT), pts(ext, "cy", BOTTOM - TOP)];
}

function codePointsOf(str) {
  return Array.from(str).map((c) => c.codePointAt(0));
}

function measure(shapeEl, w) {
  let y = 0;
  let wraps = 0;
  const ink = [];
  for (const p of kids(body(shapeEl), A, "p")) {
    y += 1;
    let x = 0;
    let has = false;
    for (const e of children(p)) {
      if (e.localName === "br") {
        ink.push({ x: 0, y, w: x, h: LEADING });
        y += LEADING;
        x = 0;
        has = false;
        continue;
      }
      if (!["r", "fld"].includes(e.localName)) continue;
      const rp = child(e, A, "rPr");
      const bold = rp != null && rp.getAttribute("b") === "1";
      for (const cp of codePointsOf(e.textContent || "")) {
        const gw = width(cp, bold);
        if (x + gw > w - 4 && has) {
          ink.push({ x: 0, y, w: x, h: LEADING });
          y += LEADING;
          x = 0;
          wraps++;
          has = false;
        }
        x += gw;
        has = true;
      }
    }
    ink.push({ x: 0, y, w: x, h: LEADING });
    y += LEADING + 1;
  }
  return { height: y, wraps, ink };
}

function fits(p) {
  return p.x >= LEFT - 0.01 && p.x + p.w <= RIGHT + 0.01 && p.y >= TOP - 0.01 && p.y + p.measured.height <= BOTTOM + 0.01;
}

function collide(a, b) {
  for (const l of a.measured.ink) {
    for (const r of b.measured.ink) {
      if (l.w === 0 || r.w === 0) continue;
      const lx = a.x + l.x, ly = a.y + l.y, rx = b.x + r.x, ry = b.y + r.y;
      if (lx < rx + r.w + GAP && rx < lx + l.w + GAP && ly < ry + r.h + 3 && ry < ly + l.h + 3) return true;
    }
  }
  return false;
}

function evaluate(a, b, w1, x2, y2, name) {
  const p = { x: LEFT, y: TOP, w: w1, measured: measure(a, w1) };
  const q = { x: x2, y: y2, w: RIGHT - x2, measured: measure(b, RIGHT - x2) };
  if (!fits(p) || !fits(q) || collide(p, q)) return null;
  const score = (p.measured.wraps + q.measured.wraps) * 18 + Math.max(p.y + p.measured.height, q.y + q.measured.height) * 0.035 + (y2 - TOP) * 0.012;
  return { first: p, second: q, name, score };
}

function choose(a, b) {
  let best = null;
  for (const ratio of [0.32, 0.36, 0.38, 0.4, 0.42, 0.44, 0.48, 0.5, 0.52, 0.56, 0.6]) {
    const w = (RIGHT - LEFT - GAP) * ratio;
    const c = evaluate(a, b, w, LEFT + w + GAP, TOP, "columns");
    if (c && (!best || c.score < best.score)) best = c;
  }
  for (const w of [352, 380, 404, 430]) {
    for (const x of [306, 322, 338]) {
      for (let y = TOP + 27; y < BOTTOM; y += 13.5) {
        const c = evaluate(a, b, w, x, y, "staggered");
        if (c && (!best || c.score < best.score)) best = c;
      }
    }
  }
  return best;
}

function position(sh, pos) {
  const d = sh.ownerDocument;
  const props = child(sh, P, "spPr");
  let xf = child(props, A, "xfrm");
  if (!xf) {
    xf = el(d, A, "xfrm");
    props.insertBefore(xf, props.firstChild);
  }
  for (const e of children(xf)) xf.removeChild(e);
  xf.appendChild(el(d, A, "off", "x", String(Math.round(pos.x * 12700)), "y", String(Math.round(pos.y * 12700))));
  xf.appendChild(el(d, A, "ext", "cx", String(Math.round(pos.w * 12700)), "cy", String(Math.round((pos.measured.height + 2) * 12700))));
  const bp = child(body(sh), A, "bodyPr");
  for (const a of ["lIns", "tIns", "rIns", "bIns"]) bp.setAttribute(a, "0");
  bp.setAttribute("anchor", "t");
  bp.setAttribute("wrap", "square");
  for (const fit of children(bp).slice()) if (["normAutofit", "spAutoFit", "noAutofit"].includes(fit.localName)) bp.removeChild(fit);
  bp.appendChild(el(d, A, "noAutofit"));
  for (const p of kids(body(sh), A, "p")) {
    const pr = spacing(p, 1, 1, null);
    for (const old of kids(pr, A, "lnSpc")) pr.removeChild(old);
    const ln = el(d, A, "lnSpc");
    ln.appendChild(el(d, A, "spcPts", "val", "1150"));
    pr.insertBefore(ln, pr.firstChild);
  }
}

function codeOnly(p) {
  return p.items.length === 1 && p.items[0].kind === "code";
}

function key(heading) {
  return heading.replace(/ \(\d+\/\d+\)/g, "");
}

function codeStream(pages) {
  const result = [];
  for (const p of pages) for (const i of p.items) if (["code", "tree"].includes(i.kind)) result.push(text(shape(p.doc, i.id)));
  return result;
}

function emphasis(pages) {
  const result = [];
  for (const p of pages) {
    for (const i of p.items) {
      if (!["code", "tree"].includes(i.kind)) continue;
      for (const r of all(shape(p.doc, i.id), A, "r")) {
        const pr = child(r, A, "rPr");
        const color = pr ? first(pr, A, "srgbClr") : null;
        result.push((r.textContent || "") + "|" + (pr ? pr.getAttribute("b") + "|" + pr.getAttribute("sz") : "") + "|" + (color ? color.getAttribute("val") : ""));
      }
    }
  }
  return result;
}

function replaceFraction(shapeEl, replacement) {
  const nodes = all(shapeEl, A, "t");
  const full = nodes.map((n) => n.textContent || "").join("");
  const m = /\(\d+\/\d+\)/.exec(full);
  if (!m) return;
  const start = m.index, end = m.index + m[0].length;
  let offset = 0, inserted = false;
  for (const node of nodes) {
    const value = node.textContent || "";
    const next = offset + value.length;
    if (next > start && offset < end) {
      const a = Math.max(0, start - offset), b = Math.min(value.length, end - offset);
      node.textContent = value.slice(0, a) + (inserted ? "" : replacement) + value.slice(b);
      inserted = true;
    }
    offset = next;
  }
}

async function applyApprovedRuns(base, referencePath) {
  const fs = require("fs");
  if (!fs.existsSync(referencePath)) return;
  const bodies = new Map();
  const data = await readZip(referencePath);
  const parts = referenceRendererMod.slideParts(data);
  for (const part of parts) {
    const d = parseXml(data.get(part));
    for (const sh of children(first(d, P, "spTree"))) {
      if (!body(sh)) continue;
      const t = text(sh);
      if (t.length > 100) bodies.set(canonical(t), body(sh));
    }
  }
  for (const p of base.pages) {
    for (let n = 0; n < p.items.length; n++) {
      const item = p.items[n];
      if (!["code", "tree"].includes(item.kind)) continue;
      const sh = shape(p.doc, item.id);
      const b = bodies.get(canonical(text(sh)));
      if (!b) continue;
      sh.replaceChild(copy(p.doc, b), body(sh));
      for (const par of kids(body(sh), A, "p")) spacing(par, 1, 1, null);
      p.items[n] = { id: item.id, kind: item.kind, text: text(sh), rows: item.rows };
    }
  }
}

async function render(sections, templatePath, outputPath, title, source) {
  const os = require("os");
  const fs = require("fs");
  const stage = path.join(os.tmpdir(), "compact-base-" + process.pid + "-" + Date.now() + ".pptx");
  try {
    let base;
    try {
      base = await referenceRendererMod.render(sections, templatePath, stage, title, source);
    } catch (ex) {
      throw ex; // Builder/auto fallback intentionally out of scope for this baseline port.
    }
    await applyApprovedRuns(base, path.join(path.dirname(templatePath), "compact-reference.pptx"));
    return await pack(base, templatePath, outputPath);
  } finally {
    if (fs.existsSync(stage)) fs.unlinkSync(stage);
  }
}

async function pack(base, templatePath, outputPath) {
  const expectedEmphasis = emphasis(base.pages);
  const expected = codeStream(base.pages).join("\n");
  const pages = [];
  const decisions = [];
  for (let i = 0; i < base.pages.length; i++) {
    const page = base.pages[i];
    if (codeOnly(page)) {
      const firstSh = shape(page.doc, page.items[0].id);
      let merged = false;
      if (i + 1 < base.pages.length) {
        const next = base.pages[i + 1];
        if (codeOnly(next) && key(page.heading) === key(next.heading)) {
          const secondSh = shape(next.doc, next.items[0].id);
          const choice = choose(firstSh, secondSh);
          if (choice) {
            const imported = copy(page.doc, secondSh);
            let id = 50;
            const ids = new Set();
            for (const e of all(page.doc, P, "cNvPr")) ids.add(parseInt(e.getAttribute("id"), 10));
            while (ids.has(id)) id++;
            first(imported, P, "cNvPr").setAttribute("id", String(id));
            first(imported, P, "cNvPr").setAttribute("name", "Code continuation " + id);
            first(page.doc, P, "spTree").appendChild(imported);
            position(firstSh, choice.first);
            position(imported, choice.second);
            const item = next.items[0];
            page.items.push({ id, kind: item.kind, text: item.text, rows: item.rows });
            decisions.push(key(page.heading) + ": " + choice.name);
            i++;
            merged = true;
          }
        }
      }
      if (!merged) {
        const preferred = Math.max(400, rect(firstSh)[2]);
        let w = Math.min(RIGHT - LEFT, preferred);
        let m = measure(firstSh, w);
        if (m.height > BOTTOM - TOP) {
          w = RIGHT - LEFT;
          m = measure(firstSh, w);
        }
        if (m.height > BOTTOM - TOP) {
          const pars = kids(body(firstSh), A, "p");
          let best = null, left = null, right = null;
          for (let cut = 1; cut < pars.length; cut++) {
            if (!/^\/\/\s*\d+-\d+\..*/.test(paragraph(pars[cut]))) continue;
            const a = firstSh.cloneNode(true);
            const b = firstSh.cloneNode(true);
            const ap = kids(body(a), A, "p"), bp = kids(body(b), A, "p");
            for (let j = ap.length - 1; j >= cut; j--) ap[j].parentNode.removeChild(ap[j]);
            for (let j = cut - 1; j >= 0; j--) bp[j].parentNode.removeChild(bp[j]);
            const c = choose(a, b);
            if (c && (!best || c.score < best.score)) { best = c; left = a; right = b; }
          }
          need(best != null, "코드가 안전 영역을 초과한다: " + page.heading + ". 원고의 코드 단위를 나누어라.");
          let id = 50;
          for (;;) {
            try { shape(page.doc, id); id++; } catch (done) { break; }
          }
          first(right, P, "cNvPr").setAttribute("id", String(id));
          firstSh.parentNode.replaceChild(left, firstSh);
          first(page.doc, P, "spTree").appendChild(right);
          position(left, best.first);
          position(right, best.second);
          const originalId = page.items[0].id;
          page.items = [];
          page.items.push({ id: originalId, kind: "code", text: text(left), rows: [] });
          page.items.push({ id, kind: "code", text: text(right), rows: [] });
          decisions.push(key(page.heading) + ": split within page");
        } else {
          position(firstSh, { x: LEFT, y: TOP, w, measured: m });
          decisions.push(key(page.heading) + ": single");
        }
      }
    }
    if (page.items.some((it) => it.kind === "table")) {
      for (const it of page.items) {
        if (it.kind !== "table") continue;
        const sh = shape(page.doc, it.id);
        const xf = first(sh, P, "xfrm");
        if (xf) {
          const off = child(xf, A, "off");
          off.setAttribute("y", String(Math.round(119.3 * 12700)));
        }
      }
    }
    if (page.items.length === 2 && page.items.some((it) => it.kind === "body")) {
      for (const it of page.items) {
        if (it.kind !== "code") continue;
        const sh = shape(page.doc, it.id);
        const r = rect(sh);
        const w = 542.9;
        const measured = measure(sh, w);
        if (r[1] + measured.height <= BOTTOM) position(sh, { x: (720 - w) / 2, y: r[1], w, measured });
      }
    }
    pages.push(page);
  }
  need(expected === codeStream(pages).join("\n"), "Compact packing changed source code");
  need(JSON.stringify(expectedEmphasis) === JSON.stringify(emphasis(pages)), "Compact packing changed bold/color/font runs");

  for (let start = 1; start < pages.length; ) {
    let end = start + 1;
    const k = key(pages[start].heading);
    while (end < pages.length && key(pages[end].heading) === k) end++;
    for (let i = start; i < end; i++) {
      const p = pages[i];
      replaceFraction(shape(p.doc, 2), end - start === 1 ? "" : "(" + (i - start + 1) + "/" + (end - start) + ")");
      p.heading = text(shape(p.doc, 2));
    }
    start = end;
  }

  const result = { pages, codes: base.codes, title: base.title, source: base.source };
  await write(result, templatePath, outputPath);
  const errors = validate(result);
  need(errors.length === 0, errors.join("\n"));
  console.log("compact: " + base.pages.length + " → " + pages.length + "장, 측정 글꼴=" + FONT_NAME);
  return result;
}

function validate(m) {
  const errors = [];
  for (let n = 0; n < m.pages.length; n++) {
    const page = m.pages[n];
    const boxes = [];
    if (page.items.length > 0 && page.items.every((i) => i.kind === "code")) {
      for (const item of page.items) {
        const sh = shape(page.doc, item.id);
        const r = rect(sh);
        const p = { x: r[0], y: r[1], w: r[2], measured: measure(sh, r[2]) };
        boxes.push(p);
        if (!fits(p)) errors.push("Slide " + (n + 1) + ": code outside safe area");
      }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) if (collide(boxes[i], boxes[j])) errors.push("Slide " + (n + 1) + ": code text collision");
    }
  }
  return errors;
}

async function write(m, templatePath, outputPath) {
  const data = await readZip(templatePath);
  const result = new Map(data);
  for (const key_ of Array.from(result.keys())) if (/^ppt\/slides\/(slide\d+\.xml|_rels\/slide\d+\.xml\.rels)$/.test(key_)) result.delete(key_);
  const pres = parseXml(result.get("ppt/presentation.xml"));
  const rels = parseXml(result.get("ppt/_rels/presentation.xml.rels"));
  const ct = parseXml(result.get("[Content_Types].xml"));
  const ids = first(pres, P, "sldIdLst");
  for (const e of children(ids)) ids.removeChild(e);
  for (const e of children(rels.documentElement).slice()) if (e.getAttribute("Type").endsWith("/slide")) e.parentNode.removeChild(e);
  for (const e of children(ct.documentElement).slice()) if (/^\/ppt\/slides\/slide\d+\.xml$/.test(e.getAttribute("PartName"))) e.parentNode.removeChild(e);
  const { relPath } = require("./xml");
  for (let i = 0; i < m.pages.length; i++) {
    const p = m.pages[i];
    const n = i + 1;
    for (const sh of all(p.doc, P, "sp")) if (/^- \d+ -$/.test(text(sh))) setText(sh, "- " + n + " -");
    const name = "ppt/slides/slide" + n + ".xml";
    result.set(name, xmlOut(p.doc));
    const sr = parseXml(data.get(relPath(p.origin)));
    for (const e of children(sr.documentElement).slice()) if (e.getAttribute("Type").endsWith("/notesSlide")) e.parentNode.removeChild(e);
    result.set(relPath(name), xmlOut(sr));
    const rid = "compact" + n;
    rels.documentElement.appendChild(el(rels, REL, "Relationship", "Id", rid, "Type", R + "/slide", "Target", "slides/slide" + n + ".xml"));
    const sid = el(pres, P, "sldId", "id", String(256 + i));
    sid.setAttributeNS(R, "r:id", rid);
    ids.appendChild(sid);
    ct.documentElement.appendChild(el(ct, CT, "Override", "PartName", "/" + name, "ContentType", "application/vnd.openxmlformats-officedocument.presentationml.slide+xml"));
  }
  result.set("ppt/presentation.xml", xmlOut(pres));
  result.set("ppt/_rels/presentation.xml.rels", xmlOut(rels));
  result.set("[Content_Types].xml", xmlOut(ct));
  await writeZip(outputPath, result);
}

module.exports = { render, pack, validate, write, measure, choose, collide, fits, position, codeStream, emphasis, replaceFraction, applyApprovedRuns, key, codeOnly };
