"use strict";
// Port of LecturePpt.Builder (--layout auto): computes its own pagination from content size
// instead of following templates/layout-profile.xml's fixed 16-slide contract. It still reuses
// specific slides of templates/approved.pptx as shape/geometry templates (TOC=slide1, prose=slide2,
// tree=slide5, code=slide6, table=slide16) via cloneNode — it does not invent new shape layouts.
// This module is additive only: it does not modify referenceRenderer.js / compactRenderer.js,
// so the existing compact/reference regression baseline is unaffected.
const {
  A, P, R, REL, CT, need, xmlOut, children, kids, child, all, first, el, copy, shape, paragraph, text, body, setText, spacing,
} = require("./xml");
const { readZip, writeZip } = require("./zip");
const { plain, wide, estimate, splitCode } = require("./text");
const { rich, runParen } = require("./richText");
const { paragraphs } = require("./paragraphs");
const { slideParts } = require("./referenceRenderer");
const { renderMermaid } = require("./mermaidAdapter");
const { renderPlantUml } = require("./plantumlAdapter");
const { renderChart } = require("./chartAdapter");
const { renderSvg } = require("./svgAdapter");

const ARCH_TERMS = new Set(["domain", "application", "presentation", "adapter", "infrastructure", "port", "in", "out", "service", "dto", "controller", "gateway", "repository", "mapper"]);

// TOC per guides/production-guide.md ("목차 생성 및 검증"): Production uses `## 목차`'s own
// items verbatim (validated 1:1 against body headings), never derives a TOC from body headings.
// Layout is two fixed columns on one slide -- left = items 1-15 (the template's own placeholder,
// shape id 10), right = item 16 on (not present in the raw template; the original approved.pptx
// carried a "*** 16번 부터는 여기에서 계속함" authoring note in exactly this spot, confirming this
// split was the intended design). Geometry (EMU) copied from that reference slide's shapes.
const TOC_FONT_SIZE = 16;
const TOC_LEFT_MAX = 15;
const TOC_LEFT_XFRM = { x: -8822, y: 949064, cx: 4580822, cy: 5530862 };
const TOC_RIGHT_XFRM = { x: 4426820, y: 949064, cx: 4195811, cy: 5530862 };
const TOC_RIGHT_ID = 4;
const EMU = 914400;
const FULL_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 5.75 };
const STACKED_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 3.05 };
const STACKED_PANEL = { x: 1.4, y: 4.25, w: 7.2, h: 1.8 };
// Panel height reduced from 3.55 -> 3.0 (text area grows 1.8 -> 2.75 to match): a simple 2-4 node
// diagram was being blown up to fill the full 3.55in panel just because it landed in this bucket
// (low aspect ratio), which both wasted space and starved the text above it. 3.0in is the floor
// that still keeps a real plantuml sequence diagram's smallest label >=8pt at this panel width
// (verified against references/production -- see visualPolicy()); mermaid diagrams clear 8pt with
// more margin at this size since their SCALE (mermaidAdapter.js) is lower than PlantUML's.
const DEEP_STACKED_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 2.75 };
const DEEP_STACKED_PANEL = { x: 0.5, y: 3.35, w: 9.0, h: 3.0 };
// templates/approved.pptx's sldNum placeholder Y (slideLayout1.xml, 6449625 EMU) -- the floor a
// diagram panel must clear so it never crowds the footer.
const PAGE_NUM_Y = 6449625 / EMU;
const TREE_TEXT = { x: 2.65, y: 1.05, w: 4.7, h: 5.75 };

const EP = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties";
const VT = "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes";
const DC = "http://purl.org/dc/elements/1.1/";

// docProps/app.xml and docProps/core.xml are cloned verbatim from the template (approved.pptx)
// into every generated deck -- nobody ever rewrites them, so a deck built from a 13-slide
// template still reports "<Slides>13</Slides>" and the template's own 13 old slide titles (and
// core.xml's <dc:title> keeps the template's original session name) no matter how many slides or
// topics the actual generated deck has. That mismatch between declared and real content is a
// known trigger for PowerPoint's "needs repair" prompt, and is simply wrong even when it isn't.
function updateDocProps(result, pages, session) {
  const { parseXml } = require("./xml");
  const corePath = "docProps/core.xml";
  if (result.has(corePath)) {
    const core = parseXml(result.get(corePath));
    const title = first(core, DC, "title");
    if (title) title.textContent = session;
    result.set(corePath, xmlOut(core));
  }
  const appPath = "docProps/app.xml";
  if (result.has(appPath)) {
    const app = parseXml(result.get(appPath));
    const slidesEl = first(app, EP, "Slides");
    if (slidesEl) slidesEl.textContent = String(pages.length);
    const notesEl = first(app, EP, "Notes");
    if (notesEl) notesEl.textContent = String(pages.filter((p) => p.notes && p.notes.length).length);

    const titles = pages.map((p) => p.heading.replace(/\n/g, " "));
    // HeadingPairs is a flat (label, count) variant list -- the LAST pair is always the slide-
    // title category (fonts/theme come first and are untouched); TitlesOfParts' final `size`
    // many <vt:lpstr> entries are that category's actual values, in the same order. The two
    // top-level <vt:vector> elements in app.xml are HeadingPairs' then TitlesOfParts', in that
    // document order.
    const [headingVector, titlesVector] = all(app, VT, "vector");
    if (headingVector && titlesVector) {
      const variants = all(headingVector, VT, "variant");
      const lastCount = variants.length >= 2 ? first(variants[variants.length - 1], VT, "i4") : null;
      if (lastCount) {
        const oldSlideCount = parseInt(lastCount.textContent, 10) || 0;
        lastCount.textContent = String(titles.length);
        const lpstrs = all(titlesVector, VT, "lpstr");
        const keep = lpstrs.length - oldSlideCount;
        for (let i = lpstrs.length - 1; i >= Math.max(0, keep); i--) titlesVector.removeChild(lpstrs[i]);
        for (const t of titles) {
          const lpstr = titlesVector.ownerDocument.createElementNS(VT, "vt:lpstr");
          lpstr.textContent = t;
          titlesVector.appendChild(lpstr);
        }
        titlesVector.setAttribute("size", String(Math.max(0, keep) + titles.length));
      }
    }
    result.set(appPath, xmlOut(app));
  }
}

function setShapeBounds(sh, bounds) {
  const doc = sh.ownerDocument;
  const spPr = child(sh, P, "spPr");
  let xf = child(spPr, A, "xfrm");
  if (!xf) { xf = el(doc, A, "xfrm"); spPr.insertBefore(xf, spPr.firstChild); }
  for (const e of children(xf)) xf.removeChild(e);
  xf.appendChild(el(doc, A, "off", "x", String(Math.round(bounds.x * EMU)), "y", String(Math.round(bounds.y * EMU))));
  xf.appendChild(el(doc, A, "ext", "cx", String(Math.round(bounds.w * EMU)), "cy", String(Math.round(bounds.h * EMU))));
}

function contain(bounds, width, height) {
  const scale = Math.min(bounds.w / width, bounds.h / height);
  const w = width * scale, h = height * scale;
  return { x: bounds.x + (bounds.w - w) / 2, y: bounds.y + (bounds.h - h) / 2, w, h };
}

function center(bounds, w, h) {
  return { x: bounds.x + (bounds.w - w) / 2, y: bounds.y + (bounds.h - h) / 2, w, h };
}

// Inverse of visualPolicy()'s legibility estimate: the display width at which the image's
// diagram text renders at exactly `pt`.
const TARGET_PT = 11;
function naturalSize(image, pt) {
  const w = image.kind === "mermaid" ? (pt * image.width) / (24 * 96)
    : image.kind === "plantuml" ? (pt * image.width) / (39 * 96)
    // svg: K is this specific SVG's own smallest authored font-size (svgAdapter.js), not a fixed
    // constant -- unlike mermaid/plantuml's internally-consistent renderers, an authored SVG's
    // text size varies per diagram, so the legibility floor has to be read from its own source.
    : image.kind === "svg" ? (pt * image.width) / (image.fontSize * 96)
    : (pt * 6) / 10;
  return { w, h: (w * image.height) / image.width };
}

// Images are sized to read at exactly TARGET_PT, never larger even when the panel has room to
// spare (a small diagram stretched to fill its panel was reading oversized). Only when that
// natural size overflows `bounds` does it shrink, in 10% steps (90%, 80%, ...) rather than
// pushing the topic onto a second slide -- body text/pagination is never touched for this.
function fitTarget(bounds, image) {
  const natural = naturalSize(image, TARGET_PT);
  const maxScale = Math.min(1, bounds.w / natural.w, bounds.h / natural.h);
  let scale = 1;
  while (scale - 0.1 >= maxScale - 1e-9 && scale > 0.1) scale -= 0.1;
  return center(bounds, natural.w * scale, natural.h * scale);
}

function visualPolicy(rendered) {
  if (!rendered.length) return { name: "none", text: FULL_TEXT, panel: null, width: 620, capacity: 450 };
  const averageAspect = rendered.reduce((sum, image) => sum + image.width / image.height, 0) / rendered.length;
  const commonTooSmall = rendered.some((image) => {
    const bounds = contain(STACKED_PANEL, image.width, image.height);
    const estimatedPt = image.kind === "mermaid" ? 24 * bounds.w * 96 / image.width
      : image.kind === "plantuml" ? 39 * bounds.w * 96 / image.width
      : image.kind === "svg" ? image.fontSize * bounds.w * 96 / image.width
      : 10 * bounds.w / 6;
    return estimatedPt < 10;
  });
  if (rendered.some((image) => image.kind === "chart") || averageAspect < 1.5 || commonTooSmall) {
    return { name: "stacked", text: DEEP_STACKED_TEXT, panel: DEEP_STACKED_PANEL, width: 620, capacity: 180 };
  }
  return { name: "stacked", text: STACKED_TEXT, panel: STACKED_PANEL, width: 620, capacity: 330 };
}

function addPicture(doc, shapeId, relId, bounds, name, descr) {
  const pic = el(doc, P, "pic");
  const nv = el(doc, P, "nvPicPr");
  const cNvPr = el(doc, P, "cNvPr", "id", String(shapeId), "name", name);
  if (descr) cNvPr.setAttribute("descr", descr);
  nv.appendChild(cNvPr);
  const cNvPicPr = el(doc, P, "cNvPicPr");
  cNvPicPr.appendChild(el(doc, A, "picLocks", "noChangeAspect", "1"));
  nv.appendChild(cNvPicPr);
  nv.appendChild(el(doc, P, "nvPr"));
  pic.appendChild(nv);
  const fill = el(doc, P, "blipFill");
  const blip = el(doc, A, "blip");
  blip.setAttributeNS(R, "r:embed", relId);
  fill.appendChild(blip);
  const stretch = el(doc, A, "stretch");
  stretch.appendChild(el(doc, A, "fillRect"));
  fill.appendChild(stretch);
  pic.appendChild(fill);
  const spPr = el(doc, P, "spPr");
  const xf = el(doc, A, "xfrm");
  xf.appendChild(el(doc, A, "off", "x", String(Math.round(bounds.x * EMU)), "y", String(Math.round(bounds.y * EMU))));
  xf.appendChild(el(doc, A, "ext", "cx", String(Math.round(bounds.w * EMU)), "cy", String(Math.round(bounds.h * EMU))));
  spPr.appendChild(xf);
  const geom = el(doc, A, "prstGeom", "prst", "rect");
  geom.appendChild(el(doc, A, "avLst"));
  spPr.appendChild(geom);
  pic.appendChild(spPr);
  first(doc, P, "spTree").appendChild(pic);
}

function addNotesPlaceholder(doc, tree, id, name, type, idx, notes) {
  const sp = el(doc, P, "sp");
  const nv = el(doc, P, "nvSpPr");
  nv.appendChild(el(doc, P, "cNvPr", "id", String(id), "name", name));
  nv.appendChild(el(doc, P, "cNvSpPr"));
  const nvPr = el(doc, P, "nvPr");
  nvPr.appendChild(el(doc, P, "ph", "type", type, "idx", String(idx)));
  nv.appendChild(nvPr);
  sp.appendChild(nv);
  sp.appendChild(el(doc, P, "spPr"));
  const tx = el(doc, P, "txBody");
  tx.appendChild(el(doc, A, "bodyPr"));
  tx.appendChild(el(doc, A, "lstStyle"));
  if (notes) {
    for (const block of notes) {
      const p = el(doc, A, "p");
      const pPr = el(doc, A, "pPr", "lvl", String(block.depth || 0));
      if (block.kind !== "bullet") pPr.appendChild(el(doc, A, "buNone"));
      p.appendChild(pPr);
      const r = el(doc, A, "r");
      r.appendChild(el(doc, A, "rPr", "lang", "ko-KR", "sz", "1200"));
      const t = el(doc, A, "t");
      t.textContent = plain(block.text);
      r.appendChild(t);
      p.appendChild(r);
      tx.appendChild(p);
    }
  } else {
    tx.appendChild(el(doc, A, "p"));
  }
  sp.appendChild(tx);
  tree.appendChild(sp);
}

function buildNotesSlide(notes, parseXml) {
  const doc = parseXml(`<p:notes xmlns:a="${A}" xmlns:r="${R}" xmlns:p="${P}"><p:cSld><p:spTree/></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`);
  const tree = first(doc, P, "spTree");
  const nv = el(doc, P, "nvGrpSpPr");
  nv.appendChild(el(doc, P, "cNvPr", "id", "1", "name", ""));
  nv.appendChild(el(doc, P, "cNvGrpSpPr"));
  nv.appendChild(el(doc, P, "nvPr"));
  tree.appendChild(nv);
  const grp = el(doc, P, "grpSpPr");
  const xf = el(doc, A, "xfrm");
  for (const name of ["off", "ext", "chOff", "chExt"]) xf.appendChild(el(doc, A, name, name.endsWith("ff") ? "x" : "cx", "0", name.endsWith("ff") ? "y" : "cy", "0"));
  grp.appendChild(xf);
  tree.appendChild(grp);
  addNotesPlaceholder(doc, tree, 2, "슬라이드 이미지 개체 틀", "sldImg", 2, null);
  addNotesPlaceholder(doc, tree, 3, "슬라이드 노트 개체 틀", "body", 3, notes);
  return doc;
}

// Table column widths, sized to what each column's own content actually needs instead of a
// fixed split (was: first column pinned to 100pt, the rest split the remainder equally
// regardless of length -- a "구분/내용" table's narrow label column was stretched as wide as its
// long-text column, and the table as a whole always filled the full 654pt band even when every
// cell was short). Each column's natural width is its widest cell (in the same wide-char-vs-
// narrow-char units estimate() uses elsewhere) converted to points, plus cell padding; the table
// only shrinks below the max footprint, never stretches past it -- short content narrows the
// table, and only content that's genuinely too wide gets scaled back down to fit.
const TABLE_MAX_WIDTH = 654;
// Template's own graphicFrame band (approved.pptx table page, shape id 11): x=33.48pt,
// cx=651.97pt -- close enough to TABLE_MAX_WIDTH that centering a narrower table inside this
// band still reads as "the same table area, just not stretched full-width."
const TABLE_BAND_X = 33.48;
const TABLE_BAND_CX = 651.97;
const TABLE_MIN_COL_WIDTH = 70;
const TABLE_PT_PER_UNIT = 11;
const TABLE_CELL_PADDING = 24;
function columnWidths(rows, cols) {
  const weights = new Array(cols).fill(0);
  for (const row of rows) {
    for (let i = 0; i < cols; i++) {
      let w = 0;
      for (const ch of Array.from(String(row[i]))) w += wide(ch.codePointAt(0)) ? 1 : 0.6;
      weights[i] = Math.max(weights[i], w);
    }
  }
  const widths = weights.map((w) => Math.max(TABLE_MIN_COL_WIDTH, w * TABLE_PT_PER_UNIT + TABLE_CELL_PADDING));
  const total = widths.reduce((a, b) => a + b, 0);
  if (total <= TABLE_MAX_WIDTH) return widths;
  // Too wide even at natural size: scale every column down proportionally, but never below the
  // legibility floor -- if that alone can't fit, the longest column absorbs the remaining excess.
  const scale = TABLE_MAX_WIDTH / total;
  const scaled = widths.map((w) => Math.max(TABLE_MIN_COL_WIDTH, w * scale));
  const overflow = scaled.reduce((a, b) => a + b, 0) - TABLE_MAX_WIDTH;
  if (overflow > 0) {
    let maxIdx = 0;
    for (let j = 1; j < cols; j++) if (scaled[j] > scaled[maxIdx]) maxIdx = j;
    scaled[maxIdx] -= overflow;
  }
  return scaled;
}

// Port of LecturePpt.geometry(): reads a template shape's <a:ext> in points, default 630x390.
function geometry(sh) {
  const sp = child(sh, P, "spPr");
  const xf = sp ? child(sp, A, "xfrm") : null;
  const ext = xf ? child(xf, A, "ext") : null;
  if (!ext) return [630, 390];
  return [parseInt(ext.getAttribute("cx"), 10) / 12700, parseInt(ext.getAttribute("cy"), 10) / 12700];
}

class Builder {
  constructor(templatePath) {
    this.templatePath = templatePath;
    this.pages = [];
    this.codes = [];
    this.unsupportedVisuals = [];
    this.names = new Set();
  }

  async init(session) {
    need(session && session.trim() !== "", "세션명이 필요하다 (Markdown 상단 'Session 명:' 헤더).");
    this.session = session;
    this.data = await readZip(this.templatePath);
    this.origins = slideParts(this.data);
    // No fixed slide count: the template just needs to carry the shape/geometry prototypes this
    // renderer actually reuses (TOC=index 0, prose=index 1, tree/code=index 4/5, table=last
    // index). "16 raw profile pages" was specific to the old lecture-ppt-java page-plan and is
    // not a Production requirement (see guides/production-guide.md).
    need(this.origins.length >= 6, "템플릿에 TOC/prose/tree/code/table 슬롯이 충분하지 않다: " + this.templatePath);
    const { parseXml } = require("./xml");
    this.roots = this.origins.map((n) => parseXml(this.data.get(n)));
    return this;
  }

  page(index, heading) {
    const p = { doc: this.roots[index].cloneNode(true), origin: this.origins[index], heading, items: [] };
    this.pages.push(p);
    return p;
  }

  // Port of Builder.flush(): accumulates pending text/heading/bullet blocks into prose pages,
  // splitting whenever the running cost estimate would exceed the placeholder's capacity (360).
  //
  // A "**인용문**"-marked block (see render()) renders with the Korean part at 18pt but
  // everything after it (English original/author/year/www) at 10pt (paragraphs.js). Costing the
  // whole block as if it were uniformly 18pt overestimates its real footprint -- that overestimate
  // was tipping citation-heavy topics into an extra near-empty continuation slide (confirmed by
  // inspecting actual output: e.g. topic "08" spilled a single trailing bullet onto its own page).
  blockCost(b) {
    const markedQuote = b.meta && (b.meta.quote || b.meta.anchor);
    const quoteMatch = markedQuote && /^"[^"]*"/.exec(b.text.trim());
    if (quoteMatch) {
      const korean = quoteMatch[0];
      const rest = b.text.trim().slice(korean.length);
      return estimate(plain(korean), 620, 18) * 22 + estimate(plain(rest), 620, 10) * 13 + 12;
    }
    return estimate(plain(b.text), 620, 18) * 22 + 12;
  }

  flush(pending, heading, width = 620, capacity = 450) {
    if (pending.length === 0) return;
    let chunk = [];
    let cost = 0;
    let pageCapacity = capacity;
    for (const b of pending) {
      const c = this.blockCost(b);
      need(c <= Math.max(capacity, 450), "본문 한 문단이 너무 길다. 원고에서 나눠라.");
      if (cost + c > pageCapacity && chunk.length) {
        const p = this.page(1, heading);
        paragraphs(p, 8, chunk, false);
        p.textCost = cost;
        chunk = [];
        cost = 0;
        pageCapacity = 450;
      }
      chunk.push(b);
      cost += c;
    }
    if (chunk.length) {
      const p = this.page(1, heading);
      paragraphs(p, 8, chunk, false);
      p.textCost = cost;
    }
    pending.length = 0;
  }

  rowHeight(row, widths) {
    let h = 1;
    for (let i = 0; i < row.length; i++) {
      let n = 0;
      for (const line of row[i].split("")) n += estimate(line, widths[i], 10);
      h = Math.max(h, n);
    }
    return h * 13 + 12;
  }

  // The table template's own "lead" textbox (shape id 13) sits BELOW the table in the raw
  // template, not above it, and is far too short (≈63pt) for even a short intro sentence -- so
  // any real intro text always flushed to its own separate page before the table. Instead,
  // reposition the lead textbox above the table and push the table down to make room for it,
  // sized to what the lead text actually needs (capped so the table still has room to breathe).
  tableLeadHeight(lead, cap = 160) {
    if (!lead.length) return 0;
    const cost = lead.reduce((sum, b) => sum + this.blockCost(b), 0);
    return Math.min(cost / 1.087 + 10, cap);
  }

  table(block, heading, lead = [], leadCap = 160) {
    const rows = block.rows;
    const cols = rows[0].length;
    need(cols >= 2 && cols <= 6, "표는 2~6열을 지원한다.");
    const widths = columnWidths(rows, cols);

    const groups = [];
    let chunk = [rows[0]];
    let total = this.rowHeight(rows[0], widths);
    for (const row of rows.slice(1)) {
      const h = this.rowHeight(row, widths);
      need(h + this.rowHeight(rows[0], widths) <= 365, "표 한 행이 너무 높다.");
      if (total + h > 365) {
        groups.push(chunk);
        chunk = [rows[0]];
        total = this.rowHeight(rows[0], widths);
      }
      chunk.push(row);
      total += h;
    }
    groups.push(chunk);

    const leadHeightPt = this.tableLeadHeight(lead, leadCap);
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const page = this.page(this.origins.length - 1, heading);
      const gf = shape(page.doc, 11);
      // Center a narrower-than-max table within the template's original table band, rather than
      // always stretching it to fill the full width regardless of how little the content needs.
      const tableWidth = widths.reduce((a, b) => a + b, 0);
      const gfXf = child(gf, P, "xfrm");
      child(gfXf, A, "off").setAttribute("x", String(Math.round((TABLE_BAND_X + (TABLE_BAND_CX - tableWidth) / 2) * EMU / 72)));
      child(gfXf, A, "ext").setAttribute("cx", String(Math.round(tableWidth * EMU / 72)));
      if (gi === 0 && lead.length) {
        const leadSh = shape(page.doc, 13);
        setShapeBounds(leadSh, { x: 0.4, y: 1.05, w: 9.2, h: leadHeightPt / 72 });
        paragraphs(page, 13, lead, false);
        const xf = child(gf, P, "xfrm");
        const off = child(xf, A, "off");
        off.setAttribute("y", String(Math.round((1.05 * 72 + leadHeightPt + 8) * EMU / 72)));
      }
      const tbl = first(gf, A, "tbl");
      const prototypes = kids(tbl, A, "tr");
      for (const row of prototypes) tbl.removeChild(row);
      const grid = child(tbl, A, "tblGrid");
      for (const e of children(grid)) grid.removeChild(e);
      for (const w of widths) grid.appendChild(el(page.doc, A, "gridCol", "w", String(Math.round(w * 12700))));
      for (let ri = 0; ri < group.length; ri++) {
        const row = el(page.doc, A, "tr", "h", String(this.rowHeight(group[ri], widths) * 12700));
        const cells = kids(prototypes[Math.min(ri, prototypes.length - 1)], A, "tc");
        for (let ci = 0; ci < cols; ci++) {
          const cell = copy(page.doc, cells[Math.min(ci, cells.length - 1)]);
          setText(cell, group[ri][ci]);
          for (const rp of all(cell, A, "rPr")) rp.setAttribute("sz", "1000");
          row.appendChild(cell);
        }
        tbl.appendChild(row);
      }
      page.items.push({ id: 11, kind: "table", text: "", rows: group });
      // Where this group's actual rendered content ends, in inches -- the graphicFrame's own
      // ext.cy is a stale template value PowerPoint autofits away, not the real row-height sum, so
      // a caller that wants to know how much band is left below the table (to place a small
      // single-topic visual there instead of stranding it on its own near-blank page) needs this,
      // not ext.cy.
      const contentHeightPt = group.reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
      const topY = Number(child(gfXf, A, "off").getAttribute("y")) / EMU;
      page.tableBottom = topY + contentHeightPt / 72;
    }
  }

  // One TOC paragraph per topic. Markdown headings already carry their own ordinal ("01. 세션
  // 목표"), so this never adds buAutoNum -- doing so on top of an already-numbered heading would
  // double-number it ("1. 01. 세션 목표"). rich() already applies the golden base -4pt rule to
  // any parenthetical run, so plain 16pt bold=false is all that's needed here.
  tocParagraph(doc, title) {
    const p = el(doc, A, "p");
    const pr = spacing(p, 3, 3, null);
    pr.setAttribute("lvl", "1");
    pr.setAttribute("marL", "355600");
    pr.setAttribute("indent", "0");
    pr.appendChild(el(doc, A, "buNone"));
    rich(p, title, TOC_FONT_SIZE, false, false, new Set());
    return p;
  }

  // guides/production-guide.md "목차 생성 및 검증": `## 목차`와 본문 `## NN. 제목`의 번호·제목·
  // 순서를 1:1로 비교하고, 불일치하면 해당 항목과 불일치 내용을 보고한다 -- 본문 heading에서
  // 목차를 새로 만들거나 목차를 임의로 고치지 않는다.
  validateToc(toc, sections) {
    need(toc && toc.length > 0, "`## 목차`가 없다. Session Source 최상단에 수동 목차가 필요하다 (guides/session-authoring-guide.md).");
    need(toc.every((b) => b.kind === "bullet"), "`## 목차` 항목은 `01.`, `02.` 형식의 번호 목록이어야 한다(bullet(-) 금지).");
    need(toc.length === sections.length,
      "목차 항목 수(" + toc.length + ")와 본문 topic 수(" + sections.length + ")가 다르다. `## 목차`와 `## NN. 제목`을 1:1로 맞춰라.");
    for (let i = 0; i < toc.length; i++) {
      const tocLine = toc[i].text.trim();
      const bodyLine = sections[i].title.trim();
      need(tocLine === bodyLine,
        "목차 " + (i + 1) + "번째 항목 \"" + tocLine + "\"이 본문 heading \"" + bodyLine + "\"과 다르다. 번호·제목·순서를 맞춰라.");
    }
  }

  // Fills one TOC column. targetId === 10 reuses the template's own left placeholder; the right
  // column (id 4, only needed past 15 items) is cloned from it since the raw template has no
  // second TOC shape.
  tocColumn(page, targetId, xfrm, items) {
    const doc = page.doc;
    let sh;
    try {
      sh = shape(doc, targetId);
    } catch (missing) {
      const src = shape(doc, 10).cloneNode(true);
      first(src, P, "cNvPr").setAttribute("id", String(targetId));
      first(src, P, "cNvPr").setAttribute("name", "TOC 열 " + targetId);
      const ph = first(src, P, "ph");
      if (ph) ph.parentNode.removeChild(ph);
      first(doc, P, "spTree").appendChild(src);
      sh = src;
    }
    const spPr = child(sh, P, "spPr");
    let xf = child(spPr, A, "xfrm");
    if (!xf) { xf = el(doc, A, "xfrm"); spPr.insertBefore(xf, spPr.firstChild); }
    for (const e of children(xf)) xf.removeChild(e);
    xf.appendChild(el(doc, A, "off", "x", String(xfrm.x), "y", String(xfrm.y)));
    xf.appendChild(el(doc, A, "ext", "cx", String(xfrm.cx), "cy", String(xfrm.cy)));
    const b = body(sh);
    for (const old of kids(b, A, "p")) b.removeChild(old);
    for (const item of items) b.appendChild(this.tocParagraph(doc, item.text));
    // CT_TextBody requires at least one <a:p> -- a continuation TOC page whose items all fit in
    // the left column leaves this (right) column with zero items, and looping zero times over
    // `items` would leave <p:txBody> with only bodyPr/lstStyle and no paragraph at all. PowerPoint
    // treats that as unreadable content and silently drops the shape on open ("repair" dialog,
    // no specific error) rather than rejecting the file outright -- a blank paragraph satisfies
    // the schema and renders as nothing, same as the column being empty is supposed to look.
    if (items.length === 0) b.appendChild(el(doc, A, "p"));
  }

  // A two-column TOC page holds TOC_LEFT_MAX (left) + TOC_LEFT_MAX (right) = 30 items before
  // either column overflows its fixed placeholder height -- both columns share the same tuned
  // per-column capacity, so the right column isn't stretched past it just to round the page total
  // up to a bigger number. Past that, items move to a continuation TOC page, numbered "(N/M)" the
  // same way an overlong topic already continues.
  renderToc(toc, session) {
    const perPage = TOC_LEFT_MAX * 2;
    const chunks = [];
    for (let i = 0; i < toc.length; i += perPage) chunks.push(toc.slice(i, i + perPage));
    for (let ci = 0; ci < chunks.length; ci++) {
      const suffix = chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : "";
      const p = this.page(0, session + " 목차" + suffix);
      // Per direct instruction: the TOC slide does not carry the top-right session name (it is
      // not a "일반 슬라이드" in the production-guide.md sense -- session name is topic-slide-only).
      p.isToc = true;
      const left = chunks[ci].slice(0, TOC_LEFT_MAX);
      const right = chunks[ci].slice(TOC_LEFT_MAX);
      this.tocColumn(p, 10, TOC_LEFT_XFRM, left);
      // Always called, even with an empty `right`: the template's own id=4 shape ships with
      // literal placeholder text ("*** 16번 부터는 여기에서 계속함") baked in, and skipping this
      // call whenever the right column has nothing left it showing through uncleared -- a
      // pre-existing bug this session's TOC pagination exposed (a continuation TOC page can
      // legitimately have zero right-column items). tocColumn() clears existing paragraphs before
      // adding new ones, so an empty `right` correctly leaves the shape blank.
      this.tocColumn(p, TOC_RIGHT_ID, TOC_RIGHT_XFRM, right);
    }
  }

  async render(sections, outputPath, toc) {
    for (const nm of ["ProductMapper", "ProductRepository", "ProductPort", "OrderRepository", "PlaceOrderUseCase", "Product", "ProductEntity", "placeOrder", "decreaseStock", "load", "save", "findById", "updateStock"]) this.names.add(nm);
    for (const s of sections) {
      for (const b of s.blocks) {
        if (b.kind !== "code") continue;
        let m;
        const classRe = /\b(?:class|interface)\s+(\w+)/g;
        while ((m = classRe.exec(b.text))) this.names.add(m[1]);
        const callRe = /\b\w+\.([A-Za-z_]\w*)\s*\(/g;
        while ((m = callRe.exec(b.text))) {
          const nm = m[1];
          if (!/^(get|set|is).*|^println$|^print$|^debug$|^info$|^warn$|^error$|^toString$/.test(nm)) this.names.add(nm);
        }
      }
    }

    this.validateToc(toc, sections);
    this.renderToc(toc, this.session);

    for (const section of sections) {
      const firstIdx = this.pages.length;
      const visuals = section.blocks.filter((b) => ["mermaid", "plantuml", "chart", "svg"].includes(b.kind));
      const renderedVisuals = await Promise.all(visuals.map(async (b) => {
        const png = b.kind === "mermaid" ? await renderMermaid({ source: b.text })
          : b.kind === "plantuml" ? await renderPlantUml({ kind: b.meta && b.meta.uml, source: b.text })
          : b.kind === "svg" ? await renderSvg(b.text)
          : await renderChart(b.text);
        return { ...png, source: b.text, kind: b.kind };
      }));
      const layout = visualPolicy(renderedVisuals);
      let pending = [];
      let governingSeen = false;
      let quoteKind = null;
      // Exactly one plain-text paragraph per topic is the "governing message" -- the topic's own
      // opening thesis sentence -- and stays flush-left. Every other "text" block (quotes,
      // secondary/trailing sentences, blockquoted examples, ...) reads as supporting material and
      // gets the same lvl-based indentation as an authored "- " bullet, glyph included; headings
      // and already-authored bullets/numbered items are untouched. This mirrors the one formatting
      // rule the whole deck is meant to follow, applied automatically instead of per-line "+ ".
      let governingMessageSeen = false;
      // A "###" sub-heading is content too (not exempt like the topic's own governing message) --
      // it becomes a bulleted lvl=1 line same as everything else, and whatever bullets/promoted
      // text follow it nest one level deeper until the next heading, so the heading reads as their
      // parent rather than a flush label floating above them.
      let headingDepthBoost = 0;
      // A topic with 2+ visuals used to dump all of them onto the single first prose page found
      // in the topic's whole page range, regardless of which page's text actually described each
      // one (e.g. topic 24's two PlantUML examples both landed on page 1, next to neither
      // caption). With exactly one visual (every other topic in courses/ooad), that single page
      // IS the only candidate, so this branch is inert there -- multiVisual only changes behavior
      // for the (currently sole) multi-visual case.
      const multiVisual = visuals.length > 1;
      const visualTargets = [];
      let visualIndex = 0;
      for (let blockIndex = 0; blockIndex < section.blocks.length; blockIndex++) {
        const b = section.blocks[blockIndex];
        if (visuals.length && b.kind === "text" && /^\*\*(?:도식\s*[—:-]\s*(?:Mermaid|PlantUML|SVG)|Chart\s*[—:-]\s*matplotlib)\*\*$/i.test(b.text.trim())) continue;
        if (b.kind === "text" && /^\*\*(?:인용문|Anchor Message|앵커 메시지)\*\*$/i.test(b.text.trim())) {
          quoteKind = /인용문/.test(b.text) ? "quote" : "anchor";
          continue;
        }
        // Visual source is never body content -- it is attached as a picture after the topic's
        // prose pages are composed (or, for a multi-visual topic, right here -- each visual
        // claims the page its own preceding caption text just flushed onto).
        if (["mermaid", "plantuml", "chart", "svg"].includes(b.kind)) {
          if (multiVisual) {
            const before = this.pages.length;
            this.flush(pending, section.title, layout.width, layout.capacity);
            let target;
            if (this.pages.length > before) {
              target = this.pages[this.pages.length - 1];
            } else {
              // `.pictures` isn't assigned until the loop below (after every visual has picked
              // its target), so a page already claimed by an earlier visual in *this* loop can't
              // be detected that way yet -- checking visualTargets directly is what actually
              // catches it. Without this, two visuals back to back with no separating text (no
              // flush in between) both silently resolved to the same reused page, and the second
              // one's `target.pictures = [...]` assignment clobbered the first's instead of the
              // two ever sharing a panel.
              const last = this.pages[this.pages.length - 1];
              if (last && last.items.some((it) => it.id === 8) && !visualTargets.includes(last)) {
                target = last;
              } else {
                target = this.page(1, section.title);
                paragraphs(target, 8, [], false);
              }
            }
            visualTargets[visualIndex] = target;
          }
          visualIndex++;
          continue;
        }
        if (["text", "heading", "bullet"].includes(b.kind)) {
          let block = quoteKind ? { ...b, meta: { ...(b.meta || {}), [quoteKind]: true } } : b;
          if (block.kind === "heading") {
            block = { ...block, kind: "bullet" };
            headingDepthBoost = 1;
          } else if (block.kind === "text") {
            // A citation is support material, never the topic's own thesis -- it must never claim
            // the one flush "governing message" slot (a topic that opens with an epigraph before
            // its real opening sentence would otherwise leave that sentence promoted instead).
            const isQuote = block.meta && (block.meta.quote || block.meta.anchor);
            if (!isQuote && !governingMessageSeen) {
              governingMessageSeen = true;
            } else {
              block = { ...block, kind: "bullet", depth: block.depth + headingDepthBoost };
            }
          } else if (block.kind === "bullet") {
            block = { ...block, depth: block.depth + headingDepthBoost };
          }
          pending.push(block);
          quoteKind = null;
          continue;
        }
        if (b.kind === "pagebreak") {
          this.flush(pending, section.title, layout.width, layout.capacity);
          governingSeen = true;
          continue;
        }
        if (b.kind === "table") {
          // The lead budget isn't a fixed constant -- it's whatever the page's vertical band has
          // left over once THIS table's own rows are accounted for (rows are usually well under
          // the 365pt group-split ceiling, so small tables leave real room above them). Capping at
          // a flat 160pt regardless of table size left short tables (3-6 rows) stranding their
          // preceding paragraph on its own near-empty page even though the band plainly had space.
          const tableWidths = columnWidths(b.rows, b.rows[0].length);
          const tableContentH = b.rows.reduce((sum, row) => sum + this.rowHeight(row, tableWidths), 0);
          const leadCap = Math.max(0, (PAGE_NUM_Y - 1.05) * 72 - 8 - Math.min(tableContentH, 365));
          const lead = pending.length && this.tableLeadHeight(pending, leadCap) < leadCap ? pending.slice() : [];
          if (!lead.length) this.flush(pending, section.title, layout.width, layout.capacity);
          this.table(b, section.title, lead, leadCap);
          pending = [];
          governingSeen = true;
          continue;
        }
        need(b.kind === "code" || b.kind === "tree", "Unknown block");
        const paired = b.kind === "tree" && pending.length === 1 && pending[0].kind === "text" && !governingSeen;
        if (!paired) this.flush(pending, section.title, layout.width, layout.capacity);
        const index = b.kind === "tree" ? 4 : 5;
        const id = b.kind === "tree" ? 30 : 31;
        const size = b.kind === "tree" && !paired
          ? [TREE_TEXT.w * 72, TREE_TEXT.h * 72]
          : geometry(shape(this.roots[index], id));
        const pieces = splitCode(b.text, size[0], size[1]);
        for (let j = 0; j < pieces.length; j++) {
          const p = this.page(index, section.title);
          if (index === 4) {
            if (paired && j === 0) {
              paragraphs(p, 8, pending, false);
            } else {
              const gov = shape(p.doc, 8);
              gov.parentNode.removeChild(gov);
            }
          }
          const sh = shape(p.doc, id);
          if (b.kind === "tree" && !paired) setShapeBounds(sh, TREE_TEXT);
          setText(sh, pieces[j]);
          for (const par of kids(body(sh), A, "p")) {
            const line = paragraph(par);
            const pr = spacing(par, 6, 6, 11);
            pr.setAttribute("marL", "0");
            pr.setAttribute("indent", "0");
            pr.setAttribute("algn", "l");
            rich(par, line, 10, false, true, b.kind === "code" ? this.names : ARCH_TERMS);
          }
          p.items.push({ id, kind: b.kind, text: pieces[j], rows: [] });
        }
        this.codes.push({ source: b.text, parts: pieces });
        pending = [];
        governingSeen = true;
      }
      this.flush(pending, section.title, layout.width, layout.capacity);
      // Single-visual attachment (below) needs some page in range carrying shape id=8 to attach
      // the picture to. Normally the topic's own prose does that; but now that a table's lead can
      // absorb pending text that used to be the topic's only prose page (see the table branch
      // above), that page may no longer exist. Rather than always manufacturing a blank carrier
      // page for the visual, try the table page's own leftover band first -- a short table (a few
      // rows) rarely fills the full table band down to the footer, and a small single diagram
      // (e.g. one actor icon) fits in what's left without costing the topic an extra near-empty
      // slide. Falls back to the blank page when there isn't enough room (page.tableBottom unset,
      // or too close to the footer already).
      let tableVisualPlaced = false;
      if (!multiVisual && visuals.length && !this.pages.slice(firstIdx).some((p) => p.items.some((it) => it.id === 8))) {
        const lastPage = this.pages[this.pages.length - 1];
        const margin = 0.15;
        const availableH = lastPage && lastPage.tableBottom != null ? PAGE_NUM_Y - margin - (lastPage.tableBottom + margin) : 0;
        if (lastPage && availableH >= 0.9) {
          const png = renderedVisuals[0];
          const box = { x: TABLE_BAND_X / 72, y: lastPage.tableBottom + margin, w: TABLE_BAND_CX / 72, h: availableH };
          lastPage.pictures = [{ ...png, bounds: fitTarget(box, png) }];
          lastPage.visualLayout = "table-trailing";
          tableVisualPlaced = true;
        } else {
          const p = this.page(1, section.title);
          paragraphs(p, 8, [], false);
        }
      }
      const end = this.pages.length;
      if (multiVisual) {
        // Each visual already claimed its own target page inline (see the loop above); attach it
        // there alone, with the full panel height to itself rather than sharing a slot.
        for (let vi = 0; vi < renderedVisuals.length; vi++) {
          const target = visualTargets[vi];
          need(target, "Visual composition unsupported for topic without a prose slide: " + section.title);
          const png = renderedVisuals[vi];
          setShapeBounds(shape(target.doc, 8), layout.text);
          const textEndY = layout.text.y + layout.text.h * Math.min(1, (target.textCost || 0) / layout.capacity);
          const margin = 0.15;
          const availableH = Math.max(0.6, PAGE_NUM_Y - margin - (textEndY + margin));
          const panelH = Math.min(layout.panel.h, availableH);
          const panelY = textEndY + margin + (availableH - panelH) / 2;
          const panel = { ...layout.panel, y: panelY, h: panelH };
          target.pictures = [{ ...png, bounds: fitTarget({ x: panel.x, y: panel.y, w: panel.w, h: panel.h }, png) }];
          target.visualLayout = layout.name;
        }
      } else {
        if (visuals.length && !tableVisualPlaced) {
          const target = this.pages.slice(firstIdx, end).find((p) => p.items.some((item) => item.id === 8));
          need(target, "Visual composition unsupported for topic without a prose slide: " + section.title);
          setShapeBounds(shape(target.doc, 8), layout.text);
          // Panel Y is dynamic, not the layout bucket's fixed design value: textCost/capacity (see
          // flush()) estimates how far down the actual text ran, and the panel is centered in
          // whatever's left between that point and the footer -- instead of always sitting glued to
          // the text box's full design height, which left the panel crowding short text blocks.
          const textEndY = layout.text.y + layout.text.h * Math.min(1, (target.textCost || 0) / layout.capacity);
          const margin = 0.15;
          const availableH = Math.max(0.6, PAGE_NUM_Y - margin - (textEndY + margin));
          const panelH = Math.min(layout.panel.h, availableH);
          const panelY = textEndY + margin + (availableH - panelH) / 2;
          const panel = { ...layout.panel, y: panelY, h: panelH };
          const gap = 0.12;
          const slotH = (panel.h - gap * (renderedVisuals.length - 1)) / renderedVisuals.length;
          target.pictures = renderedVisuals.map((png, index) => ({
            ...png,
            bounds: fitTarget({ x: panel.x, y: panel.y + index * (slotH + gap), w: panel.w, h: slotH }, png),
          }));
          target.visualLayout = layout.name;
        }
      }
      if (section.notes && section.notes.length && end > firstIdx) this.pages[firstIdx].notes = section.notes;
      for (let k = firstIdx; k < end; k++) {
        const p = this.pages[k];
        const m = /^(.+?) (\(.*\))$/.exec(p.heading);
        let main = p.heading, english = "";
        if (m) { main = m[1]; english = m[2]; }
        if (end - firstIdx > 1) main += " (" + (k - firstIdx + 1) + "/" + (end - firstIdx) + ")";
        p.heading = main + (english === "" ? "" : "\n" + english);
      }
    }

    const { parseXml, relPath } = require("./xml");
    const result = new Map(this.data);
    for (const k of Array.from(result.keys())) if (/^ppt\/slides\/(slide\d+\.xml|_rels\/slide\d+\.xml\.rels)$/.test(k)) result.delete(k);
    const pres = parseXml(this.data.get("ppt/presentation.xml"));
    const rels = parseXml(this.data.get("ppt/_rels/presentation.xml.rels"));
    const ct = parseXml(this.data.get("[Content_Types].xml"));
    if (!children(ct.documentElement).some((e) => e.localName === "Default" && e.getAttribute("Extension") === "png")) {
      ct.documentElement.appendChild(el(ct, CT, "Default", "Extension", "png", "ContentType", "image/png"));
    }
    const sids = first(pres, P, "sldIdLst");
    for (const e of children(sids)) sids.removeChild(e);
    for (const e of children(rels.documentElement).slice()) if (e.getAttribute("Type").endsWith("/slide")) e.parentNode.removeChild(e);
    for (const e of children(ct.documentElement).slice()) if (/^\/ppt\/slides\/slide\d+\.xml$/.test(e.getAttribute("PartName"))) e.parentNode.removeChild(e);

    let imageNumber = 0;
    const imageCounts = { mermaid: 0, plantuml: 0, chart: 0, svg: 0 };
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      const number = i + 1;
      // Titles are always bold. Parens follow the same rule as body/TOC text (-4pt on any
      // parenthetical span); built with runParen() directly rather than setText(), since the
      // secondary (English gloss) line needs its own base size before the paren rule applies.
      if (text(shape(p.doc, 2)) !== p.heading) {
        const titleBody = body(shape(p.doc, 2));
        for (const par of kids(titleBody, A, "p")) titleBody.removeChild(par);
        const lines = p.heading.split("\n");
        for (let li = 0; li < lines.length; li++) {
          const par = el(p.doc, A, "p");
          titleBody.appendChild(par);
          runParen(par, lines[li], li === 0 ? 24 : 11, true);
        }
      }
      // Shape 5 (top-right, idx=11) is the session name -- production-guide.md ("Session 명")
      // requires the same value on every slide, never the slide's own topic title. Shapes 6/7
      // stay blank (no source/copyright string); the approved.pptx template bakes a default into
      // shape 7 ("Gemini, 2026/09"), so it must be explicitly cleared here rather than left as-is.
      setText(shape(p.doc, 5), p.isToc ? "" : this.session);
      setText(shape(p.doc, 6), "");
      setText(shape(p.doc, 7), "");
      for (const sh of all(p.doc, P, "sp")) if (/^- \d+ -$/.test(text(sh))) setText(sh, "- " + number + " -");
      const name = "ppt/slides/slide" + number + ".xml";
      const sr = parseXml(this.data.get(relPath(p.origin)));
      for (const rel of children(sr.documentElement).slice()) if (rel.getAttribute("Type").endsWith("/notesSlide")) rel.parentNode.removeChild(rel);
      let nextShapeId = Math.max(...all(p.doc, P, "cNvPr").map((e) => parseInt(e.getAttribute("id"), 10) || 0)) + 1;
      for (let pi = 0; pi < (p.pictures || []).length; pi++) {
        const picture = p.pictures[pi];
        imageNumber++;
        imageCounts[picture.kind]++;
        const kindNumber = imageCounts[picture.kind];
        const relId = picture.kind + "Image" + kindNumber;
        const mediaName = picture.kind + "-" + kindNumber + ".png";
        addPicture(p.doc, nextShapeId++, relId, picture.bounds, picture.kind + " Diagram " + kindNumber, picture.altText);
        sr.documentElement.appendChild(el(sr, REL, "Relationship", "Id", relId, "Type", R + "/image", "Target", "../media/" + mediaName));
        result.set("ppt/media/" + mediaName, picture.data);
      }
      result.set(name, xmlOut(p.doc));
      if (p.notes && p.notes.length) {
        const notesName = "notesSlide" + number + ".xml";
        const notesRid = "speakerNotes" + number;
        sr.documentElement.appendChild(el(sr, REL, "Relationship", "Id", notesRid, "Type", R + "/notesSlide", "Target", "../notesSlides/" + notesName));
        result.set("ppt/notesSlides/" + notesName, xmlOut(buildNotesSlide(p.notes, parseXml)));
        const nr = parseXml(`<Relationships xmlns="${REL}"/>`);
        nr.documentElement.appendChild(el(nr, REL, "Relationship", "Id", "rId1", "Type", R + "/slide", "Target", "../slides/slide" + number + ".xml"));
        nr.documentElement.appendChild(el(nr, REL, "Relationship", "Id", "rId2", "Type", R + "/notesMaster", "Target", "../notesMasters/notesMaster1.xml"));
        result.set("ppt/notesSlides/_rels/" + notesName + ".rels", xmlOut(nr));
        ct.documentElement.appendChild(el(ct, CT, "Override", "PartName", "/ppt/notesSlides/" + notesName, "ContentType", "application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"));
      }
      result.set("ppt/slides/_rels/slide" + number + ".xml.rels", xmlOut(sr));
      const rid = "javaLecture" + number;
      rels.documentElement.appendChild(el(rels, REL, "Relationship", "Id", rid, "Type", R + "/slide", "Target", "slides/slide" + number + ".xml"));
      const sid = el(pres, P, "sldId", "id", String(256 + i));
      sid.setAttributeNS(R, "r:id", rid);
      sids.appendChild(sid);
      ct.documentElement.appendChild(el(ct, CT, "Override", "PartName", "/" + name, "ContentType", "application/vnd.openxmlformats-officedocument.presentationml.slide+xml"));
    }
    result.set("ppt/presentation.xml", xmlOut(pres));
    result.set("ppt/_rels/presentation.xml.rels", xmlOut(rels));
    result.set("[Content_Types].xml", xmlOut(ct));
    updateDocProps(result, this.pages, this.session);
    await writeZip(outputPath, result);
    // inspect.js checks shape 5/7 text against manifest.title/.source verbatim -- source is kept
    // as "" (not omitted) so that check still holds for the now-always-blank footer.
    return { pages: this.pages, codes: this.codes, unsupportedVisuals: this.unsupportedVisuals, images: imageNumber, imageCounts, title: this.session, source: "" };
  }
}

async function render(sections, templatePath, outputPath, session, toc) {
  const b = new Builder(templatePath);
  await b.init(session);
  return b.render(sections, outputPath, toc);
}

module.exports = { Builder, render, geometry, naturalSize, fitTarget, TARGET_PT, PAGE_NUM_Y };
