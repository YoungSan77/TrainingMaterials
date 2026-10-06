"use strict";
// Port of LecturePpt.Builder: computes its own pagination from content size. Every page is a
// cloneNode of one of the template's prototype slides (template.js ORIGIN: TOC, prose, tree,
// code, table), whose shapes it fills and repositions.
const {
  A, P, R, REL, CT, need, xmlOut, children, kids, child, all, first, el, copy, shape, paragraph, text, body, setText, spacing,
} = require("./xml");
const { writeZip } = require("./zip");
const { plain, wide, estimate, splitCode, codePoints } = require("./text");
const { rich, run, runParen, richDeclarations } = require("./richText");
const { paragraphs, BULLET_LEVELS, bulletCitation, citationParts, numberWidthEmu } = require("./paragraphs");
const { TEMPLATE_DIR, ORIGIN, readTemplate, slideParts } = require("./template");
const { renderMermaid } = require("./mermaidAdapter");
const { renderPlantUml } = require("./plantumlAdapter");
const { renderChart } = require("./chartAdapter");
const { renderSvg } = require("./svgAdapter");

const ARCH_TERMS = new Set(["domain", "application", "presentation", "adapter", "infrastructure", "port", "in", "out", "service", "dto", "controller", "gateway", "repository", "mapper"]);

// TOC per guides/production-guide.md ("목차 생성 및 검증"): Production uses `## 목차`'s own
// items verbatim (validated 1:1 against body headings), never derives a TOC from body headings.
// Layout is two fixed columns on one slide -- left = items 1-17 (the template's own placeholder,
// shape id 10), right = item 18 on (a shape the renderer adds at TOC_RIGHT_XFRM), 16pt.
const TOC_FONT_SIZE = 16;
// production-guide.md "Session 명": the TOC slide title uses only the session name before its
// " — " subtitle ("03. 정적 모델 — 도메인 개념과 관계" -> "03. 정적 모델"); every other slide's
// top-right session name keeps the full name.
// A practice assignment topic ("NN. 실습 — …"), one slide; an older review example ("… 검토 예시") may run longer.
function isPractice(title) {
  return /^\d\d\. 실습 — /.test(title) && !/검토 예시/.test(title);
}
// Its answer, a topic titled "NN. <산출물> (안)" (session-authoring-guide.md "사례·가정·실습").
function isAnswer(title) {
  return /\(안\)$/.test(String(title).trim());
}
// production-guide.md "Session 명": slides of the appendix after the summary (practice answers)
// carry "별첨: " before the session name.
function appendixSessionName(session) {
  return "별첨: " + session;
}
function tocSessionName(session) {
  return String(session).split(/\s+—\s+/)[0].trim();
}
// production-guide.md "Session 명": the top-right session name stays on one line. The placeholder
// is 3699901 EMU (~291pt) wide at 14pt bold; a longer name shrinks (0.5pt steps, not below 9pt)
// instead of wrapping into the slide title.
const SESSION_BOX_PT = 3699901 / 12700;
const SESSION_PT = 14;
const SESSION_MIN_PT = 9;
function sessionNamePt(session) {
  let em = 0;
  for (const cp of codePoints(String(session))) em += wide(cp) ? 1 : 0.6;
  if (em * SESSION_PT <= SESSION_BOX_PT) return SESSION_PT;
  return Math.max(SESSION_MIN_PT, Math.floor((SESSION_BOX_PT / em) * 2) / 2);
}
// Items per column at 16pt: the column height (435pt) over one line (16pt x 1.2 + 3pt + 3pt spacing).
const TOC_LEFT_MAX = 17;
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
// (verified against the lecture-java-baseline fixture -- see visualPolicy()); mermaid diagrams clear 8pt with
// more margin at this size since their SCALE (mermaidAdapter.js) is lower than PlantUML's.
const DEEP_STACKED_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 2.75 };
const DEEP_STACKED_PANEL = { x: 0.5, y: 3.35, w: 9.0, h: 3.0 };
// The template's sldNum placeholder Y (slideLayout1.xml, 6449625 EMU) -- the floor a
// diagram panel must clear so it never crowds the footer.
const PAGE_NUM_Y = 6449625 / EMU;
// A visual's tool marker, with an optional title after it: "**도식 — PlantUML — 제목**".
const VISUAL_MARKER = /^\*\*(?:도식\s*[—:-]\s*(?:Mermaid|PlantUML|SVG)|Chart\s*[—:-]\s*matplotlib)(?:\s*—\s*(.+?))?\*\*$/i;
// A table's title line right before it: "**표 — 제목**".
const TABLE_CAPTION = /^\*\*표\s*—\s*(.+?)\*\*$/;
const TREE_TEXT = { x: 2.65, y: 1.05, w: 4.7, h: 5.75 };

const EP = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties";
const VT = "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes";
const DC = "http://purl.org/dc/elements/1.1/";

// docProps/app.xml and docProps/core.xml come from the template; they must describe the generated
// deck (slide count, slide titles, session name), not the template. A mismatch between declared
// and real content is a known trigger for PowerPoint's "needs repair" prompt.
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

// A table's lead text may end with its "**표 — 제목**" title: that title is drawn on its own, 6pt
// above the table, not as part of the lead text box.
function splitCaption(lead) {
  const last = lead[lead.length - 1];
  if (last && last.meta && last.meta.caption) return { lead: lead.slice(0, -1), caption: last.meta.caption };
  return { lead, caption: null };
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
const TARGET_PT = 10;
// Smallest diagram text allowed when a diagram must shrink to fit (production-guide.md).
const MIN_PT = 7;
// Orphan control for flush(): a remainder costing at most ORPHAN_SHARE of a page stays on the
// current page as long as the page total stays within ORPHAN_TOLERANCE of its budget.
const ORPHAN_SHARE = 0.2;
const ORPHAN_TOLERANCE = 1.2;
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

// Images are sized so their text reads at TARGET_PT, never larger even when the panel has room to
// spare (production-guide.md "Visual layout 및 가독성": one text size across all diagrams).
// UML_MAX_PT is kept equal to TARGET_PT: UML diagrams no longer grow into free space.
const UML_MAX_PT = TARGET_PT;
const isUml = (image) => image.kind === "plantuml" || Boolean(image.uml);
function fitTarget(bounds, image) {
  // Every diagram's text reads at TARGET_PT (10pt); a diagram is never enlarged. When it does not
  // fit it steps down to 9, 8, 7pt -- the largest step that fits, never past the panel -- and
  // below MIN_PT it is fitted exactly and reported (generate.js) for the source to be fixed.
  const natural = naturalSize(image, TARGET_PT);
  const maxScale = Math.min(1, bounds.w / natural.w, bounds.h / natural.h);
  let scale = 1;
  while (scale > maxScale + 1e-9 && scale - 0.1 >= MIN_PT / TARGET_PT - 1e-9) scale = Math.round((scale - 0.1) * 10) / 10;
  if (scale > maxScale + 1e-9) scale = maxScale;
  return center(bounds, natural.w * scale, natural.h * scale);
}

// The text size (pt) a diagram reads at inside `bounds`, and the whole body area a diagram gets
// when it has a slide to itself.
function pictureTextPt(image, bounds) {
  return TARGET_PT * bounds.w / naturalSize(image, TARGET_PT).w;
}
const VISUAL_ONLY = { x: 0.5, y: 1.05, w: 9.0, h: PAGE_NUM_Y - 0.15 - 1.05 };

// The panel a topic's visual(s) are placed in: centered in the free band [top, top+availableH]
// between the text's estimated end and the footer. Mermaid/SVG/chart keep the layout's design
// panel height; an all-UML panel takes the whole free band at the widest body width, so a large
// UML diagram keeps its 10pt as far as the band allows.
const UML_PANEL = { x: 0.5, w: 9.0 };
function visualPanel(layout, top, availableH, images) {
  const uml = images.length > 0 && images.every(isUml);
  const panelH = uml ? availableH : Math.min(layout.panel.h, availableH);
  const y = top + (availableH - panelH) / 2;
  return uml ? { ...layout.panel, ...UML_PANEL, y, h: panelH } : { ...layout.panel, y, h: panelH };
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

// Lines a body paragraph takes: like estimate(), but a "(...)" span is rendered 4pt smaller
// (production-guide.md, 괄호 -4pt) and is measured at that size.
function proseLines(text, width, size) {
  let sum = 0, depth = 0;
  for (const cp of codePoints(text)) {
    if (cp === 0x28) depth++;
    const s = depth > 0 ? size - 4 : size;
    sum += wide(cp) ? s : s * 0.56;
    if (cp === 0x29 && depth > 0) depth--;
  }
  return Math.max(1, Math.ceil(sum / (width - 12)));
}

// Source code sizing (production-guide.md "소스 코드").
const CODE_COL_GAP = 0.2;
function codeHeightPt(lines, widthPt, size, lineH) {
  return (lines.reduce((s, l) => s + estimate(plain(l), widthPt, size), 0) + 1) * lineH;
}
// The two halves of a code block for side-by-side columns: split at a blank line nearest the
// middle (between members), else after the least-indented closing "}", so that a column never
// starts inside a method body.
function splitColumns(lines) {
  let best = Math.ceil(lines.length / 2), bestScore = Infinity;
  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    const indent = prev.length - prev.trimStart().length;
    let score;
    if (prev.trim() === "") score = Math.abs(i - lines.length / 2);
    else if (prev.trim() === "}") score = Math.abs(i - lines.length / 2) + 1000 * (indent + 1);
    else continue;
    if (score < bestScore) { best = i; bestScore = score; }
  }
  return [lines.slice(0, best), lines.slice(best)];
}
const wraps = (lines, widthPt, size) => lines.some((l) => estimate(plain(l), widthPt, size) > 1);
// The layout that fits the whole code in `availPt`, trying 10pt one column, 10pt two columns,
// then 9pt and 8pt (tighter line spacing) in one and two columns -- first among layouts where no
// line wraps, then among any. null when none fits.
function planCode(text, widthPt, availPt) {
  const lines = text.split("\n");
  const options = [];
  for (const [size, lineH] of [[10, 13], [9, 10.8], [8, 9.6]]) {
    options.push({ size, lineH, cols: [lines] , w: widthPt });
    const halves = splitColumns(lines);
    if (halves[1].length) options.push({ size, lineH, cols: halves, w: (widthPt - CODE_COL_GAP * 72) / 2 });
  }
  const fits = (o) => Math.max(...o.cols.map((c) => codeHeightPt(c, o.w, o.size, o.lineH))) <= availPt;
  const pick = options.find((o) => fits(o) && !o.cols.some((c) => wraps(c, o.w, o.size))) || options.find(fits);
  return pick ? { size: pick.size, lineH: pick.lineH, cols: pick.cols.map((c) => c.join("\n")) } : null;
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
// Template's own graphicFrame band (table prototype, shape id 11): x=33.48pt,
// cx=651.97pt -- close enough to TABLE_MAX_WIDTH that centering a narrower table inside this
// band still reads as "the same table area, just not stretched full-width."
const TABLE_BAND_X = 33.48;
const TABLE_BAND_CX = 651.97;
const TABLE_ROW_PT = 0.8 / 2.54 * 72; // 0.8cm
const TABLE_LINE_PT = 12;
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
  // Too wide even at natural size: of three ways to take width back -- every column in proportion,
  // a common cap on the widest columns, or the widest column alone -- keep the one that leaves the
  // fewest wrapping rows, so rows stay at the uniform 0.8cm as far as the content allows
  // (production-guide.md "표").
  const fit = (ws) => ws.map((w) => Math.max(TABLE_MIN_COL_WIDTH, w));
  const proportional = fit(widths.map((w) => w * TABLE_MAX_WIDTH / total));
  let lo = TABLE_MIN_COL_WIDTH, hi = Math.max(...widths);
  for (let k = 0; k < 40; k++) {
    const cap = (lo + hi) / 2;
    if (widths.reduce((s, w) => s + Math.min(w, cap), 0) > TABLE_MAX_WIDTH) hi = cap; else lo = cap;
  }
  const capped = widths.map((w) => Math.min(w, lo));
  const widest = widths.indexOf(Math.max(...widths));
  const absorbed = widths.map((w, i) => (i === widest ? w - (total - TABLE_MAX_WIDTH) : w));
  const wrapped = (ws) => rows.filter((row) => row.some((cell, i) =>
    String(cell).split("\v").reduce((n, line) => n + estimate(line, ws[i], 10), 0) > 1)).length;
  const candidates = [capped, proportional];
  if (absorbed[widest] >= TABLE_MIN_COL_WIDTH * 1.5) candidates.unshift(absorbed);
  const fitting = candidates.map((ws) => {
    const over = ws.reduce((a, b) => a + b, 0) - TABLE_MAX_WIDTH;
    if (over <= 0) return ws;
    const k = ws.indexOf(Math.max(...ws));
    return ws.map((w, i) => (i === k ? w - over : w));
  });
  return fitting.reduce((best, ws) => (wrapped(ws) < wrapped(best) ? ws : best));
}

// production-guide.md "실습 슬라이드": the practice slide and a text answer "(안)" take the sizes
// of the reference deck. A style gives the size of a plain paragraph (`text`) and of each list
// level, the size of a line's explanation after "—" and of a "(...)" span for a level size, and
// how lines are indented: `hang` sets each level 0.25in in with a 0.2in hanging glyph (answer);
// `aligned` puts an unbulleted "+ " line under its parent's text (practice).
const PRACTICE_STYLE = { fit: 1.04, text: 16, levels: [18, 16, 14], expl: () => 10.5, paren: () => 10, aligned: true };
const ANSWER_STYLE = { fit: 1.1, text: 14, levels: [14, 12, 11], expl: (L) => L - 2, paren: (L) => Math.max(8, L - 4), hang: true };
// "**참고 자료 목록**" (production-guide.md "별첨 — 참고 자료"): numbered entries at 8pt in two columns.
// `numberHang` starts a numbered entry at the left edge and its wrapped lines after "N. "; `space` is
// the space before and after each paragraph (pt, default STYLE_SPACE).
const REFERENCE_STYLE = { fit: 1.1, text: 8, levels: [8, 8, 8], expl: (L) => L, paren: (L) => L, hang: true, numberHang: true, space: 1 };
const REFERENCE_MARKER = /^\*\*참고 자료 목록\*\*$/;
const isReferenceMarker = (b) => b.kind === "text" && REFERENCE_MARKER.test(b.text.trim());
const shiftStyle = (size) => ({ fit: 1.04, text: size, levels: [size, size - 2, size - 4], expl: (L) => L - 2, paren: (L) => Math.max(8, L - 4), aligned: true });
const PRACTICE_BOX = { x: 0.4, y: 1.05, w: 9.43, h: 6.04 };
const ANSWER_COLUMNS = [{ x: 0.255, y: 1.05, w: 4.745, h: 6.04 }, { x: 5.0, y: 1.05, w: 4.855, h: 6.04 }];
// Glyph widths and line height in em for 맑은 고딕, calibrated against PowerPoint's own output of
// the practice and answer slides. A style's `fit` is the share of a box's height its text may be
// estimated at and still fit; the smaller answer sizes wrap less than estimated.
const KOREAN_EM = 0.9, SPACE_EM = 0.25, LINE_EM = 1.25;
const STYLE_SPACE = 3;
const AUTHORED = [18, 16, 14];

function styleSize(style, b) {
  return b.kind === "bullet" ? style.levels[Math.min(b.depth || 0, 2)] : style.text;
}

// Height (pt) of `blocks` set in `style` inside `box`: the key before the first " — " at the
// line's size, the explanation after it at the explanation size, "(...)" at the paren size.
function styledCost(blocks, style, box) {
  return blocks.reduce((sum, b) => {
    const L = styleSize(style, b), E = style.expl(L), P = style.paren(L);
    const depth = b.kind === "bullet" ? Math.min(b.depth || 0, 2) : -1;
    const level = depth < 0 ? null : BULLET_LEVELS[depth + 1];
    const numbered = /^(?:\d+\.|\(\d+\))\s/.test(b.text);
    const prefix = /^(?:\d+\.|\(\d+\))\s/.exec(plain(b.text));
    const indent = style.numberHang && prefix ? numberWidthEmu(prefix[0], L) / EMU : depth < 0 ? 0 : style.hang ? (depth + 1) * 0.25
      : style.aligned && b.meta && b.meta.noGlyph && !numbered ? BULLET_LEVELS[depth].marL / EMU
      : numbered ? (level.marL + level.indent) / EMU + 0.25 : level.marL / EMU;
    const text = plain(b.text), cut = text.indexOf(" — ");
    let w = 0, paren = 0;
    Array.from(text).forEach((ch, i) => {
      const cp = ch.codePointAt(0);
      if (cp === 0x28) paren++;
      const size = paren > 0 ? P : cut >= 0 && i > cut ? E : L;
      w += size * (cp >= 0x1100 ? KOREAN_EM : cp === 0x20 ? SPACE_EM : 0.56);
      if (cp === 0x29 && paren > 0) paren--;
    });
    const lines = Math.max(1, Math.ceil(w / ((box.w - indent) * 72 - 12)));
    return sum + lines * L * LINE_EM + 2 * (style.space != null ? style.space : STYLE_SPACE);
  }, 0);
}

// Applies `style` to the paragraphs paragraphs() wrote into `sh` at the authored sizes (18/16/14
// by level, the explanation 2pt and a "(...)" span 4pt under).
function restyle(sh, style) {
  for (const p of all(sh, A, "p")) {
    const sp = style.space != null ? style.space : STYLE_SPACE;
    spacing(p, sp, sp, null);
    const pr = child(p, A, "pPr");
    const lvl = pr && pr.getAttribute("lvl") ? parseInt(pr.getAttribute("lvl"), 10) : 0;
    const depth = lvl ? Math.min(lvl - 2, 2) : -1;
    const from = depth < 0 ? 18 : AUTHORED[depth];
    const L = depth < 0 ? style.text : style.levels[depth], E = style.expl(L), P = style.paren(L);
    for (const rp of all(p, A, "rPr")) {
      const sz = parseInt(rp.getAttribute("sz") || "1800", 10) / 100;
      const to = sz >= from ? L : sz >= from - 2 ? E : sz >= from - 4 ? P : Math.max(8, Math.min(P, E - 2));
      rp.setAttribute("sz", String(Math.round(to * 100)));
    }
    const number = style.numberHang && /^(?:\d+\.|\(\d+\))\s/.exec(p.textContent);
    if (number && pr) {
      const w = numberWidthEmu(number[0], L);
      pr.setAttribute("marL", String(w));
      pr.setAttribute("indent", String(-w));
      continue;
    }
    if (!lvl) continue;
    const bare = Boolean(child(pr, A, "buNone"));
    const level = BULLET_LEVELS[Math.min(lvl, BULLET_LEVELS.length) - 1];
    if (style.hang) {
      pr.setAttribute("marL", String(Math.round((lvl - 1) * 0.25 * EMU)));
      pr.setAttribute("indent", String(bare ? 0 : Math.round(-0.2 * EMU)));
    } else if (style.aligned && bare && parseInt(pr.getAttribute("indent"), 10) === level.indent) {
      pr.setAttribute("marL", String(BULLET_LEVELS[lvl - 2].marL));
      pr.setAttribute("indent", "0");
    }
  }
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
  constructor(templatePath = TEMPLATE_DIR) {
    this.templatePath = templatePath;
    this.pages = [];
    this.codes = [];
    this.unsupportedVisuals = [];
    this.layoutWarnings = [];
    this.names = new Set();
    this.hasFootnote = false;
  }

  // A topic footnote owns the strip directly above the page number. Content composition must
  // reserve that strip; drawing the footnote last is not enough because it would cover a chart or
  // the bottom lines of a one-slide answer.
  contentBottomY() {
    return PAGE_NUM_Y - (this.hasFootnote ? 0.47 : 0.15);
  }

  async init(session) {
    need(session && session.trim() !== "", "세션명이 필요하다 (Markdown 상단 'Session 명:' 헤더).");
    this.session = session;
    this.data = readTemplate(this.templatePath);
    this.origins = slideParts(this.data);
    need(this.origins.length === Object.keys(ORIGIN).length, "템플릿의 원형 슬라이드는 TOC/prose/tree/code/table 5장이어야 한다: " + this.templatePath);
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
    if (this.sectionStyle) return styledCost([b], this.sectionStyle, FULL_TEXT) * 450 / (FULL_TEXT.h * 72 * this.sectionStyle.fit);
    const markedQuote = (b.meta && (b.meta.quote || b.meta.anchor)) || (b.kind === "bullet" && bulletCitation(b.text));
    const quoteMatch = markedQuote && /^"[^"]*"/.exec(b.text.trim());
    if (quoteMatch) {
      const korean = quoteMatch[0];
      const rest = b.text.trim().slice(korean.length);
      return estimate(plain(korean), 620, 18) * 22 + estimate(plain(rest), 620, 10) * 13 + 12;
    }
    return proseLines(plain(b.text), 620, 18) * 22 + 12;
  }

  // The practice slide (production-guide.md "실습 슬라이드"): the reference style in one column,
  // then 16 and 14pt in one column, then 14pt in two. Returns the page (appended to this.pages) or
  // null when even two columns overflow.
  practicePage(blocks, heading) {
    const fitBox = (box) => ({ ...box, h: Math.min(box.h, this.contentBottomY() - box.y) });
    const full = fitBox(FULL_TEXT), practice = fitBox(PRACTICE_BOX);
    const half = (full.w - 0.3) / 2;
    const two = [{ ...full, w: half }, { ...full, x: full.x + half + 0.3, w: half }];
    const tries = [[PRACTICE_STYLE, [practice]], [shiftStyle(16), [full]], [shiftStyle(14), [full]], [shiftStyle(14), two]];
    for (const [style, boxes] of tries) {
      const page = this.styledPage(blocks, heading, style, boxes);
      if (!page) continue;
      page.practiceSize = style.text;
      if (boxes.length === 2) page.practiceColumns = 2;
      return page;
    }
    return null;
  }

  // A text answer "(안)": the reference style in two columns split before a level-0 item where
  // possible. Returns null when it does not fit (structure.js then reports it).
  answerPage(blocks, heading) {
    const boxes = ANSWER_COLUMNS.map((box) => ({ ...box, h: Math.min(box.h, this.contentBottomY() - box.y) }));
    // Keep the contracted 14/12/11pt answer sizes. When a footnote owns the bottom strip, reclaim
    // the needed height from paragraph spacing (1pt instead of 3pt), not from the font size or by
    // letting the footnote cover the last lines.
    const style = this.hasFootnote ? { ...ANSWER_STYLE, space: 1 } : ANSWER_STYLE;
    const page = this.styledPage(blocks, heading, style, boxes);
    if (page) page.answerColumns = 2;
    return page;
  }

  // The reference list of the appendix: as many entries as fit in two 8pt columns per slide, a
  // heading never left as the last line of a slide. Returns the pages (not left in this.pages).
  referencePages(blocks, heading) {
    const out = [];
    let rest = blocks.slice();
    while (rest.length) {
      let page = null;
      let n = rest.length;
      for (; n > 0; n--) {
        if (n < rest.length && rest[n - 1].kind === "heading" && n > 1) continue;
        page = this.styledPage(rest.slice(0, n), heading, REFERENCE_STYLE, ANSWER_COLUMNS);
        if (page) break;
      }
      need(page, "참고 자료 항목이 한 슬라이드에 들어가지 않는다: " + heading);
      out.push(this.pages.pop());
      rest = rest.slice(n);
    }
    return out;
  }

  // Sets `blocks` in `style` into one box, or into two boxes split at the most balanced block
  // boundary (a level-0 block first); null when a box overflows.
  styledPage(blocks, heading, style, boxes) {
    if (!blocks.length) return null;
    const fits = (bs, box) => styledCost(bs, style, box) <= box.h * 72 * style.fit;
    // In two columns, the leading unbulleted paragraphs (a governing message) span both columns
    // above them.
    let lead = [], leadBox = null;
    if (boxes.length === 2) {
      while (lead.length < blocks.length && blocks[lead.length].kind === "text") lead.push(blocks[lead.length]);
      if (lead.length === blocks.length) lead = [];
      if (lead.length) {
        const [l, r] = boxes;
        leadBox = { x: l.x, y: l.y, w: r.x + r.w - l.x, h: l.h };
        leadBox.h = styledCost(lead, style, leadBox) / 72 / style.fit + 0.2;
        boxes = boxes.map((box) => ({ ...box, y: box.y + leadBox.h, h: box.h - leadBox.h }));
        blocks = blocks.slice(lead.length);
      }
    }
    let parts;
    if (boxes.length === 1) {
      if (!fits(blocks, boxes[0])) return null;
      parts = [blocks];
    } else {
      const top = (b) => b.kind !== "bullet" || !b.depth;
      const split = (allowed) => {
        let best = null;
        for (let i = 1; i < blocks.length; i++) {
          if (!allowed(blocks[i]) || !fits(blocks.slice(0, i), boxes[0]) || !fits(blocks.slice(i), boxes[1])) continue;
          const h = Math.max(styledCost(blocks.slice(0, i), style, boxes[0]), styledCost(blocks.slice(i), style, boxes[1]));
          if (!best || h < best.h) best = { i, h };
        }
        return best;
      };
      const best = split(top) || split(() => true);
      if (!best) return null;
      parts = [blocks.slice(0, best.i), blocks.slice(best.i)];
    }
    const page = this.page(ORIGIN.prose, heading);
    if (lead.length) {
      const id = this.cloneShape(page, 8);
      setShapeBounds(shape(page.doc, id), leadBox);
      paragraphs(page, id, lead, false);
      restyle(shape(page.doc, id), style);
    }
    parts.forEach((part, k) => {
      const id = k === 0 ? 8 : this.cloneShape(page, 8);
      setShapeBounds(shape(page.doc, id), boxes[k]);
      paragraphs(page, id, part, false);
      restyle(shape(page.doc, id), style);
    });
    page.textCost = styledCost(parts[0], style, boxes[0]);
    page.columns = parts.length;
    return page;
  }

  flush(pending, heading, width = 620, capacity = 450) {
    if (pending.length === 0) return;
    if (this.sectionBlocks) this.sectionBlocks.push(...pending);
    let chunk = [];
    let cost = 0;
    let pageCapacity = capacity;
    const costs = pending.map((b) => this.blockCost(b));
    for (let i = 0; i < pending.length; i++) {
      const b = pending[i];
      const c = costs[i];
      need(c <= Math.max(capacity, 450), "본문 한 문단이 너무 길다. 원고에서 나눠라.");
      // production-guide.md: a short trailing remainder (a line or two) must not become its own
      // continuation slide. If everything left fits within ORPHAN_TOLERANCE of this page's budget,
      // keep it here (the visual panel is placed below the actual text end -- see textEndY).
      const remaining = costs.slice(i).reduce((s, x) => s + x, 0);
      const keep = remaining <= pageCapacity * ORPHAN_SHARE && cost + remaining <= pageCapacity * ORPHAN_TOLERANCE;
      if (!keep && cost + c > pageCapacity && chunk.length) {
        const p = this.page(ORIGIN.prose, heading);
        paragraphs(p, 8, chunk, false);
        if (this.sectionStyle) restyle(shape(p.doc, 8), this.sectionStyle);
        p.textCost = cost;
        chunk = [];
        cost = 0;
        pageCapacity = 450;
      }
      chunk.push(b);
      cost += c;
    }
    if (chunk.length) {
      const p = this.page(ORIGIN.prose, heading);
      paragraphs(p, 8, chunk, false);
      if (this.sectionStyle) restyle(shape(p.doc, 8), this.sectionStyle);
      p.textCost = cost;
    }
    pending.length = 0;
  }

  // Every table row is TABLE_ROW_PT (0.8cm) high (production-guide.md "표"); a cell that still
  // wraps adds TABLE_LINE_PT per extra line, and the source should be adjusted so it does not.
  rowHeight(row, widths) {
    return TABLE_ROW_PT + (this.rowLines(row, widths) - 1) * TABLE_LINE_PT;
  }

  rowLines(row, widths) {
    let h = 1;
    for (let i = 0; i < row.length; i++) {
      let n = 0;
      for (const line of row[i].split("\v")) n += estimate(line, widths[i], 10);
      h = Math.max(h, n);
    }
    return h;
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

  // Height (pt) a run of text blocks needs in a full-width text box on a table page.
  textHeightPt(blocks) {
    return blocks.length ? blocks.reduce((sum, b) => sum + this.blockCost(b), 0) / 1.087 + 10 : 0;
  }

  tableGroups(rows, widths) {
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
    return groups;
  }

  // Move whatever sits below `top` (a table or code under the diagram) down by `dy`, if it still
  // clears the footer. Returns whether it moved.
  shiftBelow(page, top, dy) {
    const fixed = new Set(["2", "5", "6", "7"]);
    const moving = [];
    let bottom = 0;
    for (const e of children(first(page.doc, P, "spTree"))) {
      const nv = first(e, P, "cNvPr");
      if (!nv || fixed.has(nv.getAttribute("id"))) continue;
      if (all(e, P, "ph").some((ph) => ph.getAttribute("type") === "sldNum")) continue;
      const off = first(e, A, "off"), ext = first(e, A, "ext");
      if (!off || !ext) continue;
      const y0 = parseInt(off.getAttribute("y"), 10) / EMU;
      if (y0 <= top + 0.01) continue;
      // A table's frame height is a stale template value; use where its content really ends.
      const isTable = e.localName === "graphicFrame";
      const y1 = isTable && page.tableBottom != null ? page.tableBottom : y0 + parseInt(ext.getAttribute("cy"), 10) / EMU;
      if (!String(text(e) || "").trim() && !isTable) continue;
      moving.push(off);
      bottom = Math.max(bottom, y1);
    }
    if (!moving.length || bottom + dy > PAGE_NUM_Y - 0.05) return false;
    for (const off of moving) off.setAttribute("y", String(Math.round(parseInt(off.getAttribute("y"), 10) + dy * EMU)));
    if (page.tableBottom != null) page.tableBottom += dy;
    return true;
  }

  drawCaption(page, value, bounds, algn = "ctr") {
    const id = this.cloneShape(page, 13);
    const sh = shape(page.doc, id);
    setShapeBounds(sh, bounds);
    const tb = body(sh);
    for (const old of kids(tb, A, "p")) tb.removeChild(old);
    const p = el(page.doc, A, "p");
    tb.appendChild(p);
    const pr = spacing(p, 0, 0, null);
    pr.setAttribute("algn", algn);
    run(p, value, 14, true);
  }

  // A 14pt bold title right above a diagram (production-guide.md "표·도식 제목").
  captionPicture(page, picture) {
    const H = 0.3;
    const b = picture.bounds;
    // Stay inside the space the layout gave the diagram (a table or text may sit right below it):
    // the picture gives up the title's height, shrinking about its center.
    let { x, y, w, h } = b;
    // A table or code right below the diagram: stay inside the diagram's own box. Otherwise move
    // the picture down by the title's height, shrinking only if it would reach the footer.
    const below = page.visualLayout === "table-leading" || page.items.some((it) => ["source", "code"].includes(it.kind));
    // A diagram beside code: the title stays over the diagram's own column, never over the code.
    if (page.visualLayout === "code-side") {
      const room = h - H;
      const scale = Math.max(0.5, Math.min(1, room / h));
      picture.bounds = { x: x + (w - w * scale) / 2, y: y + H, w: w * scale, h: h * scale };
      return this.drawCaption(page, picture.caption, { x: 0.4, y, w: 2 * (x - 0.4) + w, h: H });
    }
    // A diagram in the right half beside the text: the title stays over the diagram's own column
    // (centered on it, inside the right half), never across the text on the left.
    if (page.visualLayout === "side") {
      const scale = Math.max(0.5, Math.min(1, (h - H) / h));
      picture.bounds = { x: x + (w - w * scale) / 2, y: y + H, w: w * scale, h: h * scale };
      const cx = x + w / 2, half = Math.min(cx - 5.85, 9.6 - cx);
      return this.drawCaption(page, picture.caption, { x: cx - half, y, w: 2 * half, h: H });
    }
    // The table/code below also gets a little air from the diagram's bottom edge.
    if (below && this.shiftBelow(page, y, H + 0.12)) {
      picture.bounds = { x, y: y + H, w, h };
      return this.drawCaption(page, picture.caption, { x: 0.4, y, w: 9.2, h: H });
    }
    // A narrow diagram with something below keeps its size: the title sits beside it, at its top left.
    if (below && x - 0.4 >= 1.8) {
      const id = this.cloneShape(page, 13);
      const sh = shape(page.doc, id);
      setShapeBounds(sh, { x: 0.4, y, w: x - 0.55, h: 0.6 });
      const tb = body(sh);
      for (const old of kids(tb, A, "p")) tb.removeChild(old);
      const p = el(page.doc, A, "p");
      tb.appendChild(p);
      const pr = spacing(p, 0, 0, null);
      pr.setAttribute("algn", "r");
      run(p, picture.caption, 14, true);
      return;
    }
    const room = below ? h - H : Math.min(h, PAGE_NUM_Y - 0.08 - y - H);
    const scale = Math.max(0.5, Math.min(1, room / h));
    x += (w - w * scale) / 2;
    w *= scale; h *= scale;
    const id = this.cloneShape(page, 13);
    const sh = shape(page.doc, id);
    setShapeBounds(sh, { x: 0.4, y, w: 9.2, h: H });
    const tb = body(sh);
    for (const old of kids(tb, A, "p")) tb.removeChild(old);
    const p = el(page.doc, A, "p");
    tb.appendChild(p);
    child(p, A, "pPr") || p.insertBefore(el(page.doc, A, "pPr"), p.firstChild);
    child(p, A, "pPr").setAttribute("algn", "ctr");
    run(p, picture.caption, 14, true);
    picture.bounds = { x, y: y + H, w, h };
  }

  // An 8pt footnote line just above the page number (production-guide.md "주석").
  footnote(page, value) {
    const id = this.cloneShape(page, 13);
    const sh = shape(page.doc, id);
    setShapeBounds(sh, { x: 0.4, y: PAGE_NUM_Y - 0.42, w: 9.2, h: 0.38 });
    const b = body(sh);
    // Bottom-anchored so a one-line footnote sits right above the page number like a two-line one.
    child(b, A, "bodyPr").setAttribute("anchor", "b");
    for (const old of kids(b, A, "p")) b.removeChild(old);
    const p = el(page.doc, A, "p");
    b.appendChild(p);
    run(p, plain(value), 8, false);
    page.items.push({ id, kind: "footnote", text: plain(value), rows: [] });
  }

  // A copy of a template shape on the same slide, under a fresh unique id.
  cloneShape(page, id) {
    let src;
    try { src = shape(page.doc, id); } catch (e) { src = null; }
    // A page from another template slot (e.g. a code page) lacks the table page's text box (13)
    // or table frame (11): borrow the shape from the template slide that has it.
    if (!src) {
      const root = this.roots.find((r) => { try { shape(r, id); return true; } catch (e) { return false; } });
      need(root, "Template shape missing: " + id);
      src = shape(root, id);
    }
    const c = page.doc.importNode(src, true);
    const next = Math.max(...all(page.doc, P, "cNvPr").map((e) => parseInt(e.getAttribute("id"), 10) || 0)) + 1;
    first(c, P, "cNvPr").setAttribute("id", String(next));
    first(page.doc, P, "spTree").appendChild(c);
    return next;
  }

  // Course source code (a ```java block etc.): full-width, monospace Latin font, no paragraph
  // spacing, and a short lead text above the code on the first slide. The lecture-java baseline
  // layouts keep their own code slide rules. Returns the last page, with tableBottom set to where
  // the code ends so that following text/tables can stack below it.
  //
  // `opts.visual` is the diagram the code expresses (it sits right before the code in the
  // manuscript). It is shown on every slide of that code: a wide diagram above the code, a narrow
  // one to its left -- code is never shown without the model it maps.
  // Fills one or two code columns at (x, y) within width w; returns the bottom (in) of the code.
  fillCode(page, cols, x, y, w, size, lineH, bottom, parts) {
    const colW = cols.length === 2 ? (w - CODE_COL_GAP) / 2 : w;
    let codeBottom = y;
    cols.forEach((piece, ci) => {
      const id = ci === 0 && !page.items.some((it) => it.id === 31) ? 31 : this.cloneShape(page, 31);
      const sh = shape(page.doc, id);
      const used = codeHeightPt(piece.split("\n"), colW * 72, size, lineH) / 72;
      setShapeBounds(sh, { x: x + ci * (colW + CODE_COL_GAP), y, w: colW, h: Math.min(used, bottom - y) });
      // Same left inset as the body text box, so code starts where the text starts.
      const bodyPr = all(sh, A, "bodyPr")[0];
      if (bodyPr) { bodyPr.setAttribute("lIns", "91440"); bodyPr.setAttribute("rIns", "91440"); }
      setText(sh, piece);
      for (const par of kids(body(sh), A, "p")) {
        const line = paragraph(par);
        const pr = spacing(par, 0, 0, size === 10 ? null : lineH);
        pr.setAttribute("marL", "0");
        pr.setAttribute("indent", "0");
        pr.setAttribute("algn", "l");
        richDeclarations(par, line, size);
        for (const rp of all(par, A, "rPr")) {
          for (const old of kids(rp, A, "latin")) rp.removeChild(old);
          const latin = el(page.doc, A, "latin", "typeface", "Consolas");
          const ea = child(rp, A, "ea");
          if (ea) rp.insertBefore(latin, ea); else rp.appendChild(latin);
        }
      }
      page.items.push({ id, kind: "source", text: piece, rows: [] });
      codeBottom = Math.max(codeBottom, y + used);
      parts.push(piece);
    });
    return codeBottom;
  }

  // A code block that directly follows another one (no text between) is stacked below it on the
  // same slide when it fits there whole, in the same code column; otherwise it starts its own slide.
  appendCodeBelow(page, block, trailPt) {
    if (!page || !page.codeArea) return false;
    const BOTTOM = PAGE_NUM_Y - 0.15, GAP = 0.12;
    const y = page.tableBottom + GAP;
    const avail = (BOTTOM - y) * 72 - (trailPt ? trailPt + 8 : 0);
    const plan = planCode(block.text, page.codeArea.w * 72, avail);
    if (!plan) return false;
    const parts = [];
    page.tableBottom = this.fillCode(page, plan.cols, page.codeArea.x, y, page.codeArea.w, plan.size, plan.lineH, BOTTOM, parts);
    this.codes.push({ source: block.text, parts });
    return true;
  }

  sourceCode(block, heading, lead, opts = {}) {
    const X = 0.4, W = 9.2, TOP = 1.05, BOTTOM = PAGE_NUM_Y - 0.15, LINE = 13, GAP = 0.12;
    const png = opts.visual;
    const stacked = png && png.width / png.height >= 1.3;
    let remaining = block.text;
    const parts = [];
    let page = null;
    for (let first = true; remaining !== null; first = false) {
      page = this.page(ORIGIN.code, heading);
      let y = TOP;
      if (first && lead.length) {
        const h = this.textHeightPt(lead);
        const leadId = this.cloneShape(page, 8);
        setShapeBounds(shape(page.doc, leadId), { x: X, y: TOP, w: W, h: h / 72 });
        paragraphs(page, leadId, lead, false);
        y += (h + 8) / 72;
      }
      const top = y;
      let codeX = X, codeW = W, pictureBottom = y;
      // The diagram beside/above code is drawn at a text size of TARGET_PT x step (10, 9, 8, 7pt;
      // production-guide.md "Visual layout 및 가독성"). Above the code it may use the full width;
      // beside the code its column is as wide as the diagram needs (at most 55% of the width).
      const nat = png ? naturalSize(png, TARGET_PT) : null;
      const STEPS = [1, 0.9, 0.8, 0.7];
      const place = (step) => {
        let s = step;
        const maxW = stacked ? W : W * 0.55, maxH = stacked ? (BOTTOM - top) * 0.7 : BOTTOM - top;
        s = Math.min(s, maxW / nat.w, maxH / nat.h);
        const w = nat.w * s, h = nat.h * s;
        const box = stacked ? { x: X, y: top, w: W, h } : { x: X, y: top, w: Math.max(w, W * 0.3), h: BOTTOM - top };
        return { box, bounds: { x: box.x + (box.w - w) / 2, y: top, w, h } };
      };
      // On the first slide, try to keep the whole code (plus the text that follows it) on one
      // slide: 10pt in one column, then two columns side by side, then 9pt and 8pt with tighter
      // line spacing (production-guide.md "소스 코드"), with the diagram at 10pt, then 9, 8, 7pt.
      // Only when none fits is the code split across slides (the diagram then stays at 10pt as
      // far as it fits).
      let cols = null, size = 10, lineH = LINE, placed = png ? place(1) : null;
      if (first) {
        for (const step of png ? STEPS : [1]) {
          const at = png ? place(step) : null;
          const codeTop = at && stacked ? top + at.bounds.h + GAP : top;
          const width = at && !stacked ? W - at.box.w - GAP : W;
          const avail = (BOTTOM - codeTop) * 72 - (opts.trailPt ? opts.trailPt + 8 : 0);
          const plan = planCode(remaining, width * 72, avail);
          if (plan) { ({ cols, size, lineH } = plan); placed = at; break; }
        }
      }
      if (png) {
        const { box, bounds } = placed;
        page.pictures = [{ ...png, bounds }];
        page.visualLayout = stacked ? "code-stacked" : "code-side";
        pictureBottom = top + bounds.h;
        if (stacked) y = pictureBottom + GAP;
        else { codeX = X + box.w + GAP; codeW = W - box.w - GAP; }
      }
      if (!cols) {
        const piece = splitCode(remaining, codeW * 72, (BOTTOM - y) * 72)[0];
        remaining = remaining.length > piece.length ? remaining.slice(piece.length + 1) : null;
        cols = [piece];
      } else {
        remaining = null;
      }
      const codeBottom = this.fillCode(page, cols, codeX, y, codeW, size, lineH, BOTTOM, parts);
      page.codeArea = { x: codeX, w: codeW };
      page.tableBottom = Math.max(codeBottom, pictureBottom);
    }
    this.codes.push({ source: block.text, parts });
    return page;
  }

  // Free band (pt) left below whatever is already stacked on a table page.
  roomBelowPt(page) {
    return (PAGE_NUM_Y - 0.15) * 72 - (page.tableBottom * 72 + 8);
  }

  // Stack text below the content already on a table page (a second lead-style text box).
  appendTextBelow(page, blocks) {
    const h = this.textHeightPt(blocks);
    const id = this.cloneShape(page, 13);
    setShapeBounds(shape(page.doc, id), { x: 0.4, y: page.tableBottom + 8 / 72, w: 9.2, h: h / 72 });
    paragraphs(page, id, blocks, false);
    page.tableBottom += (8 + h) / 72;
  }

  // Fill a table graphicFrame with one row group, top at yPt; returns the content height (pt).
  fillTable(page, gf, group, widths, yPt) {
    const cols = group[0].length;
    const tableWidth = widths.reduce((a, b) => a + b, 0);
    const gfXf = child(gf, P, "xfrm");
    child(gfXf, A, "off").setAttribute("x", String(Math.round((TABLE_BAND_X + (TABLE_BAND_CX - tableWidth) / 2) * EMU / 72)));
    child(gfXf, A, "ext").setAttribute("cx", String(Math.round(tableWidth * EMU / 72)));
    if (yPt != null) child(gfXf, A, "off").setAttribute("y", String(Math.round(yPt * EMU / 72)));
    const tbl = first(gf, A, "tbl");
    const prototypes = kids(tbl, A, "tr");
    for (const row of prototypes) tbl.removeChild(row);
    const grid = child(tbl, A, "tblGrid");
    for (const e of children(grid)) grid.removeChild(e);
    for (const w of widths) grid.appendChild(el(page.doc, A, "gridCol", "w", String(Math.round(w * 12700))));
    for (let ri = 0; ri < group.length; ri++) {
      const row = el(page.doc, A, "tr", "h", String(Math.round(this.rowHeight(group[ri], widths) * 12700)));
      const cells = kids(prototypes[Math.min(ri, prototypes.length - 1)], A, "tc");
      for (let ci = 0; ci < cols; ci++) {
        const cell = copy(page.doc, cells[Math.min(ci, cells.length - 1)]);
        setText(cell, group[ri][ci]);
        for (const rp of all(cell, A, "rPr")) rp.setAttribute("sz", "1000");
        row.appendChild(cell);
      }
      tbl.appendChild(row);
    }
    const idAttr = first(gf, P, "cNvPr").getAttribute("id");
    page.items.push({ id: parseInt(idAttr, 10), kind: "table", text: "", rows: group });
    const contentHeightPt = group.reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
    page.tableBottom = Number(child(gfXf, A, "off").getAttribute("y")) / EMU + contentHeightPt / 72;
    return contentHeightPt;
  }

  // Can [lead text][visual][mid text][table] share one fresh table page? Returns the visual's
  // height budget (pt) when it can, else 0. Only single-group tables qualify.
  leadVisualBudgetPt(block, lead, png, mid) {
    const widths = columnWidths(block.rows, block.rows[0].length);
    if (this.tableGroups(block.rows, widths).length !== 1) return 0;
    const tableH = block.rows.reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
    const band = (PAGE_NUM_Y - 0.15 - 1.05) * 72;
    const used = (lead.length ? this.textHeightPt(lead) + 8 : 0) + (mid.length ? this.textHeightPt(mid) + 8 : 0) + tableH + 8;
    const room = band - used;
    const natural = naturalSize(png, TARGET_PT);
    // The legend shares the slide only while it still reads at MIN_PT (production-guide.md).
    const needH = Math.min(natural.h * 72 * MIN_PT / TARGET_PT, natural.h * 72 * (TABLE_BAND_CX / 72) / natural.w);
    return room >= Math.max(0.9 * 72, needH) ? room : 0;
  }

  // Append a whole (single-group) table, with its lead text, below the content already on a
  // table page. Returns false (nothing changed) when it doesn't fit.
  appendTableBelow(page, block, leadIn, widthsOverride) {
    const { lead, caption } = splitCaption(leadIn);
    const widths = widthsOverride || columnWidths(block.rows, block.rows[0].length);
    const groups = this.tableGroups(block.rows, widths);
    if (groups.length !== 1) return false;
    const tableH = groups[0].reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
    const leadH = lead.length ? this.textHeightPt(lead) + 8 : 0;
    const capH = caption ? 14 * 1.25 + 6 : 0;
    if (leadH + capH + tableH > this.roomBelowPt(page)) return false;
    if (lead.length) this.appendTextBelow(page, lead);
    let yPt = page.tableBottom * 72 + 8;
    if (caption) yPt = this.tableCaption(page, caption, yPt);
    const id = this.cloneShape(page, 11);
    this.fillTable(page, shape(page.doc, id), groups[0], widths, yPt);
    return true;
  }

  table(block, heading, lead = [], leadCap = 160, opts = {}) {
    const split = splitCaption(lead);
    lead = split.lead;
    let caption = split.caption;
    // A diagram between the lead and the table: the title travels with the text after the diagram.
    if (opts.mid && opts.mid.length) {
      const m = splitCaption(opts.mid);
      opts = { ...opts, mid: m.lead };
      caption = caption || m.caption;
    }
    const rows = block.rows;
    const cols = rows[0].length;
    need(cols >= 2 && cols <= 6, "표는 2~6열을 지원한다.");
    const widths = opts.widths || columnWidths(rows, cols);
    const groups = this.tableGroups(rows, widths);
    const leadHeightPt = opts.visual ? this.textHeightPt(lead) : this.tableLeadHeight(lead, leadCap);
    for (let gi = 0; gi < groups.length; gi++) {
      const page = this.page(ORIGIN.table, heading);
      const gf = shape(page.doc, 11);
      let yPt = null;
      if (gi === 0 && (lead.length || opts.visual || caption)) {
        yPt = 1.05 * 72;
        if (lead.length) {
          setShapeBounds(shape(page.doc, 13), { x: 0.4, y: 1.05, w: 9.2, h: leadHeightPt / 72 });
          paragraphs(page, 13, lead, false);
          yPt += leadHeightPt + 8;
        }
        if (opts.visual) {
          // A legend-style visual between the lead text and the table (same slide).
          const box = { x: TABLE_BAND_X / 72, y: yPt / 72, w: TABLE_BAND_CX / 72, h: opts.visualBudgetPt / 72 };
          const bounds = fitTarget(box, opts.visual);
          bounds.y = yPt / 72;
          page.pictures = [{ ...opts.visual, bounds }];
          page.visualLayout = "table-leading";
          yPt += bounds.h * 72 + 8;
          if (opts.mid && opts.mid.length) {
            const midH = this.textHeightPt(opts.mid);
            const id = this.cloneShape(page, 13);
            setShapeBounds(shape(page.doc, id), { x: 0.4, y: yPt / 72, w: 9.2, h: midH / 72 });
            paragraphs(page, id, opts.mid, false);
            yPt += midH + 8;
          }
        }
      }
      // Center a narrower-than-max table within the template's original table band, rather than
      // always stretching it to fill the full width regardless of how little the content needs.
      // page.tableBottom (set by fillTable) is where this group's rendered content ends, in inches:
      // the graphicFrame's own ext.cy is a stale template value PowerPoint autofits away, so later
      // content stacked below the table (text, a second table, a small visual) needs this instead.
      if (gi === 0 && caption) yPt = this.tableCaption(page, caption, yPt);
      this.fillTable(page, gf, groups[gi], widths, yPt);
    }
  }

  // A table title right above the table, 6pt from it (production-guide.md "표·도식 제목").
  // Returns where the table starts (pt).
  tableCaption(page, caption, yPt) {
    const h = 14 * 1.25;
    const id = this.cloneShape(page, 13);
    const sh = shape(page.doc, id);
    setShapeBounds(sh, { x: 0.4, y: yPt / 72, w: 9.2, h: h / 72 });
    const tb = body(sh);
    const bp = child(tb, A, "bodyPr");
    for (const k of ["tIns", "bIns"]) bp.setAttribute(k, "0");
    for (const old of kids(tb, A, "p")) tb.removeChild(old);
    const p = el(page.doc, A, "p");
    tb.appendChild(p);
    const pr = spacing(p, 0, 0, null);
    pr.setAttribute("algn", "ctr");
    run(p, caption, 14, true);
    page.items.push({ id, kind: "caption", text: caption, rows: [] });
    return yPt + h + 6;
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
  validateToc(toc, allSections) {
    // The TOC lists the numbered topics (groups) only; their unnumbered sub-topics are not items.
    const sections = allSections.filter((s) => !s.group && !s.appendix);
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

  // A two-column TOC page holds TOC_LEFT_MAX (left) + TOC_LEFT_MAX (right) = 34 items before
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
      const p = this.page(ORIGIN.toc, tocSessionName(session) + " 목차" + suffix);
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

    // The appendix (a reference list only) has no table of contents.
    const appendix = !toc && sections.length > 0 && sections.every((sec) => sec.blocks.some(isReferenceMarker));
    if (!appendix) {
      this.validateToc(toc, sections);
      this.renderToc(toc, this.session);
    }

    for (let section of sections) {
      // A table-of-contents group with no body of its own ("## 05. 연관" followed directly by its
      // sub-topics) makes no slide: its sub-topics carry it as their second title line.
      const next = sections[sections.indexOf(section) + 1];
      if (!section.group && section.blocks.length === 0 && next && next.group === section.title) continue;
      const firstIdx = this.pages.length;
      this.sectionFirst = firstIdx;
      // "**주석**" and the paragraph after it: an 8pt footnote at the bottom of every slide of the
      // topic, kept out of the body flow (session-authoring-guide.md "주석", production-guide.md
      // "주석").
      const noteAt = section.blocks.findIndex((b) => b.kind === "text" && /^\*\*주석\*\*$/.test(b.text.trim()));
      let footnote = null;
      // "**문서 형식**": a document shown as one (e.g. a use-case specification) -- the topic is set
      // like a text answer, two columns at 14/12/11pt on one slide (production-guide.md "문서 형식").
      const docAt = section.blocks.findIndex((b) => b.kind === "text" && /^\*\*문서 형식\*\*$/.test(b.text.trim()));
      const docLayout = docAt >= 0;
      if (docLayout) section = { ...section, blocks: section.blocks.filter((b, i) => i !== docAt && b.kind !== "pagebreak") };
      const refLayout = section.blocks.some(isReferenceMarker);
      if (refLayout) section = { ...section, blocks: section.blocks.filter((b) => !isReferenceMarker(b) && b.kind !== "pagebreak") };
      if (noteAt >= 0) {
        const at = section.blocks.findIndex((b) => b.kind === "text" && /^\*\*주석\*\*$/.test(b.text.trim()));
        need(section.blocks[at + 1] && section.blocks[at + 1].kind === "text", "주석 표식 뒤에 문단이 없다: " + section.title);
        footnote = section.blocks[at + 1].text;
        section = { ...section, blocks: section.blocks.filter((_, i) => i !== at && i !== at + 1) };
      }
      this.hasFootnote = Boolean(footnote);
      this.sectionBlocks = [];
      const visuals = section.blocks.filter((b) => ["mermaid", "plantuml", "chart", "svg"].includes(b.kind));
      // "**도식 — PlantUML — 제목**": the optional title after the tool name captions that visual
      // (session-authoring-guide.md "의미 표식과 블록 경계", production-guide.md "표·도식 제목").
      const visualCaption = (vb) => {
        for (let j = section.blocks.indexOf(vb) - 1; j >= 0 && section.blocks[j].kind === "text"; j--) {
          const m = VISUAL_MARKER.exec(section.blocks[j].text.trim());
          if (m) return m[1] ? m[1].trim() : null;
        }
        return null;
      };
      // A diagram answer "(안)" keeps the usual text-above-diagram layout, its text in the answer
      // sizes (production-guide.md "실습 슬라이드").
      this.sectionStyle = isAnswer(section.title) && visuals.length ? ANSWER_STYLE : null;
      const renderedVisuals = await Promise.all(visuals.map(async (b) => {
        // A render failure names the topic and the diagram (production-guide.md "자동 검사").
        const where = `"${section.title}"의 ${visualCaption(b) ? `"${visualCaption(b)}"` : b.kind + " 도식"}`;
        const png = await (b.kind === "mermaid" ? renderMermaid({ source: b.text })
          : b.kind === "plantuml" ? renderPlantUml({ kind: b.meta && b.meta.uml, source: b.text })
          : b.kind === "svg" ? renderSvg(b.text)
          : renderChart(b.text)).catch((e) => { throw new Error(where + ": " + e.message); });
        return { ...png, source: b.text, kind: b.kind, uml: Boolean(b.meta && b.meta.uml), caption: visualCaption(b) };
      }));
      const layout = visualPolicy(renderedVisuals);
      // Explicit "**페이지 분할**" markers cut the topic into segments. Text budget is per segment:
      // a segment that holds a visual shares its page with it (the layout's reduced capacity);
      // every other segment is text-only and gets the full-page budget -- whether it comes before
      // or after the visual. A single visual is likewise attached inside its own segment, never
      // pulled back onto an earlier segment's page.
      const isVisualBlock = (blk) => ["mermaid", "plantuml", "chart", "svg"].includes(blk.kind);
      const segOf = [];
      let segCount = 0;
      for (const blk of section.blocks) { segOf.push(segCount); if (blk.kind === "pagebreak") segCount++; }
      // A visual shares a *prose* page (and so shrinks that segment's text budget) unless it is
      // stacked with a table instead: preceded by a table in its segment, or sitting right before
      // one (a legend and its usage table).
      const tableStacked = (i) => {
        for (let k = i - 1; k >= 0 && segOf[k] === segOf[i]; k--) if (section.blocks[k].kind === "table") return true;
        let k = i + 1;
        while (k < section.blocks.length && ["text", "heading", "bullet"].includes(section.blocks[k].kind)) k++;
        return k < section.blocks.length && ["table", "code"].includes(section.blocks[k].kind);
      };
      const visualSegs = new Set(section.blocks.map((blk, i) => (isVisualBlock(blk) && !tableStacked(i) ? segOf[i] : -1)).filter((s) => s >= 0));
      const fullCapacity = visualPolicy([]).capacity;
      // Side layout: only when the author asks for it ("**배치 — 좌우**", production-guide.md "Visual
      // layout 및 가독성"), the topic's one diagram goes to the right half and the text to the left.
      // Otherwise the diagram sits below the text.
      const SIDE_TEXT = { x: 0.4, y: 1.05, w: 5.3, h: 5.75 };
      const SIDE_PANEL = { x: 5.85, y: 1.05, w: 3.75, h: 5.75 };
      const SIDE_CAPACITY = Math.floor(fullCapacity * SIDE_TEXT.w / FULL_TEXT.w);
      const segTextCost = (s) => section.blocks.reduce((sum, blk, i) => (segOf[i] === s && ["text", "heading", "bullet"].includes(blk.kind)
        && !/^\*\*(?:도식|인용문|Chart|주석)/.test(blk.text.trim()) ? sum + this.blockCost(blk) : sum), 0);
      const sideSegs = new Set();
      if (visuals.length === 1) {
        const i = section.blocks.findIndex(isVisualBlock);
        const png = renderedVisuals[0];
        const s = segOf[i];
        const cost = segTextCost(s);
        // A diagram too wide for the right half would read below MIN_PT there and be moved to a
        // slide of its own, leaving the text alone in the left half: keep it below the text instead.
        if (section.side && png && !tableStacked(i)) {
          if (cost > SIDE_CAPACITY) this.layoutWarnings.push(`"${section.title}": 본문이 왼쪽 반에 들어가지 않아 \`**배치 — 좌우**\`를 쓰지 않았다. 본문을 줄이거나 표식을 지운다.`);
          else if (pictureTextPt(png, fitTarget(SIDE_PANEL, png)) < MIN_PT - 0.05) this.layoutWarnings.push(`"${section.title}": 도식이 넓어 오른쪽 반에서 ${MIN_PT}pt보다 작아지므로 \`**배치 — 좌우**\`를 쓰지 않았다. 표식을 지우거나 도식을 세로로 바꾼다.`);
          else sideSegs.add(s);
        }
      }
      const capacityFor = (s) => (sideSegs.has(s) ? SIDE_CAPACITY : visualSegs.has(s) ? layout.capacity : fullCapacity);
      let seg = 0;
      const segStart = [this.pages.length];
      let capacity = capacityFor(0);
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
      // The topic's lead message, repeated in italics at the top of its continuation slides.
      let leadBlock = null;
      let contentSeen = false;
      // A topic with 2+ visuals used to dump all of them onto the single first prose page found
      // in the topic's whole page range, regardless of which page's text actually described each
      // one (e.g. topic 24's two PlantUML examples both landed on page 1, next to neither
      // caption). With exactly one visual (every other topic in courses/ooad), that single page
      // IS the only candidate, so this branch is inert there -- multiVisual only changes behavior
      // for the (currently sole) multi-visual case.
      const multiVisual = visuals.length > 1;
      const visualTargets = [];
      let visualIndex = 0;
      // Stacking on a table page: `open` is the table page just composed in this segment. Text,
      // a second table or a visual that follows it in the same segment is stacked below the table
      // when it fits, instead of always starting a new slide. `deferred` is a visual that sits
      // right before a table (only text between) -- e.g. a notation legend and its usage table --
      // and is placed between the lead text and the table on the same slide when they fit.
      let open = null;
      let deferred = null;
      let deferredCode = null;
      // Consecutive tables in one segment with the same column count share column widths, so a
      // stacked pair (or a pair split across slides) reads as one aligned grid.
      let carryWidths = null;
      const sharedWidths = (i) => {
        const a = section.blocks[i];
        let j = i + 1;
        while (j < section.blocks.length && ["text", "heading", "bullet"].includes(section.blocks[j].kind)) j++;
        const b2 = section.blocks[j];
        if (!b2 || b2.kind !== "table" || b2.rows[0].length !== a.rows[0].length) return null;
        return columnWidths(a.rows.concat(b2.rows.slice(1)), a.rows[0].length);
      };
      let visualInline = false;
      const flushPending = () => {
        if (open && pending.length && this.textHeightPt(pending) <= this.roomBelowPt(open)) {
          this.appendTextBelow(open, pending);
          pending.length = 0;
          return;
        }
        const before = this.pages.length;
        this.flush(pending, section.title, layout.width, capacity);
        if (this.pages.length > before) open = null;
      };
      // A diagram goes below a table only when it still reads at MIN_PT or more there.
      const fitsBelow = (page, png) => {
        if (this.roomBelowPt(page) < 0.9 * 72) return false;
        const nat = naturalSize(png, TARGET_PT);
        const h = this.roomBelowPt(page) / 72 - 0.15;
        return Math.min((TABLE_BAND_CX / 72) / nat.w, h / nat.h) >= MIN_PT / TARGET_PT - 1e-9;
      };
      const placeBelowTable = (page, png) => {
        const margin = 0.15;
        const y = page.tableBottom + margin;
        const bounds = fitTarget({ x: TABLE_BAND_X / 72, y, w: TABLE_BAND_CX / 72, h: PAGE_NUM_Y - margin - y }, png);
        page.pictures = (page.pictures || []).concat([{ ...png, bounds }]);
        page.visualLayout = "table-trailing";
        page.tableBottom = bounds.y + bounds.h;
      };
      const claimVisualPage = (vi) => {
        const before = this.pages.length;
        this.flush(pending, section.title, layout.width, capacity);
        let target;
        if (this.pages.length > before) {
          target = this.pages[this.pages.length - 1];
        } else {
          const last = this.pages[this.pages.length - 1];
          if (last && last.items.some((it) => it.id === 8) && !visualTargets.includes(last)) {
            target = last;
          } else {
            target = this.page(ORIGIN.prose, section.title);
            paragraphs(target, 8, [], false);
          }
        }
        open = null;
        visualTargets[vi] = target;
      };
      for (let blockIndex = 0; blockIndex < section.blocks.length; blockIndex++) {
        const b = section.blocks[blockIndex];
        if (visuals.length && b.kind === "text" && VISUAL_MARKER.test(b.text.trim())) continue;
        if (b.kind === "text" && /^\*\*(?:인용문|Anchor Message|앵커 메시지)\*\*$/i.test(b.text.trim())) {
          quoteKind = /인용문/.test(b.text) ? "quote" : "anchor";
          continue;
        }
        // Visual source is never body content -- it is attached as a picture after the topic's
        // prose pages are composed (or, for a multi-visual topic, right here -- each visual
        // claims the page its own preceding caption text just flushed onto).
        if (["mermaid", "plantuml", "chart", "svg"].includes(b.kind)) {
          let j = blockIndex + 1;
          while (j < section.blocks.length && ["text", "heading", "bullet"].includes(section.blocks[j].kind)) j++;
          if (j < section.blocks.length && section.blocks[j].kind === "code") {
            deferredCode = { vi: visualIndex, png: renderedVisuals[visualIndex] };
            visualIndex++;
            continue;
          }
          if (!open && j < section.blocks.length && section.blocks[j].kind === "table") {
            deferred = { vi: visualIndex, png: renderedVisuals[visualIndex], split: pending.length };
            visualIndex++;
            continue;
          }
          if (!multiVisual && open) {
            // The topic's only visual follows a table in this segment: stack it below the table
            // (after any text in between), not on an earlier prose page.
            flushPending();
            if (open && fitsBelow(open, renderedVisuals[visualIndex])) {
              placeBelowTable(open, renderedVisuals[visualIndex]);
              visualInline = true;
            }
            visualIndex++;
            continue;
          }
          if (multiVisual) {
            // `.pictures` isn't assigned until after the loop (after every visual has picked its
            // target), so a page already claimed by an earlier visual in *this* loop is detected by
            // checking visualTargets directly (see claimVisualPage).
            if (open) {
              flushPending();
              if (open && fitsBelow(open, renderedVisuals[visualIndex])) {
                placeBelowTable(open, renderedVisuals[visualIndex]);
                visualTargets[visualIndex] = "placed";
                visualIndex++;
                continue;
              }
            }
            claimVisualPage(visualIndex);
          }
          visualIndex++;
          continue;
        }
        if (["text", "heading", "bullet"].includes(b.kind)) {
          let block = quoteKind ? { ...b, meta: { ...(b.meta || {}), [quoteKind]: true } } : b;
          const caption = block.kind === "text" && TABLE_CAPTION.exec(block.text.trim());
          if (caption) {
            // "**표 — 제목**": an 11pt bold title right above the table (it joins the table's lead).
            block = { ...block, meta: { ...(block.meta || {}), caption: caption[1].trim() } };
          } else if (block.kind === "heading") {
            // A "###" sub-heading: bold, no glyph, indented; what follows keeps its own level
            // (session-authoring-guide.md "한 장의 메시지").
            contentSeen = true;
          } else if (block.kind === "text") {
            // A citation is support material -- except when it opens the topic: then it IS the
            // topic's lead message (e.g. an author's positioning statement).
            const isQuote = block.meta && (block.meta.quote || block.meta.anchor);
            if (!governingMessageSeen && (!isQuote || !contentSeen)) {
              governingMessageSeen = true;
              leadBlock = block;
            } else {
              block = { ...block, kind: "bullet", depth: block.depth + headingDepthBoost };
            }
            contentSeen = true;
          } else if (block.kind === "bullet") {
            contentSeen = true;
            block = { ...block, depth: block.depth + headingDepthBoost };
          }
          pending.push(block);
          quoteKind = null;
          continue;
        }
        if (b.kind === "pagebreak") {
          flushPending();
          open = null;
          seg++;
          segStart[seg] = this.pages.length;
          capacity = capacityFor(seg);
          governingSeen = true;
          continue;
        }
        if (b.kind === "table") {
          const widths = carryWidths || sharedWidths(blockIndex);
          carryWidths = sharedWidths(blockIndex) || null;
          if (deferred) {
            const d = deferred;
            deferred = null;
            const before = pending.slice(0, d.split);
            const mid = pending.slice(d.split);
            const budget = this.leadVisualBudgetPt(b, before, d.png, mid);
            if (budget > 0) {
              this.table(b, section.title, before, 0, { visual: d.png, visualBudgetPt: budget, mid, widths });
              pending = [];
              if (multiVisual) visualTargets[d.vi] = "placed"; else visualInline = true;
              open = this.pages[this.pages.length - 1];
              governingSeen = true;
              continue;
            }
            // Doesn't fit on one slide: the visual goes with its preceding text, as before.
            pending = before;
            if (multiVisual) claimVisualPage(d.vi); else this.flush(pending, section.title, layout.width, capacity);
            pending = mid;
          }
          if (open && this.appendTableBelow(open, b, pending, widths)) {
            pending = [];
            governingSeen = true;
            continue;
          }
          // The lead budget isn't a fixed constant -- it's whatever the page's vertical band has
          // left over once THIS table's own rows are accounted for (rows are usually well under
          // the 365pt group-split ceiling, so small tables leave real room above them). Capping at
          // a flat 160pt regardless of table size left short tables (3-6 rows) stranding their
          // preceding paragraph on its own near-empty page even though the band plainly had space.
          const tableWidths = columnWidths(b.rows, b.rows[0].length);
          const tableContentH = b.rows.reduce((sum, row) => sum + this.rowHeight(row, tableWidths), 0);
          const leadCap = Math.max(0, (PAGE_NUM_Y - 1.05) * 72 - 8 - Math.min(tableContentH, 365));
          const lead = pending.length && this.tableLeadHeight(pending, leadCap) < leadCap ? pending.slice() : [];
          if (!lead.length) this.flush(pending, section.title, layout.width, capacity);
          this.table(b, section.title, lead, leadCap, { widths });
          open = this.pages[this.pages.length - 1];
          pending = [];
          governingSeen = true;
          continue;
        }
        need(b.kind === "code" || b.kind === "tree", "Unknown block");
        if (b.kind === "code") {
          const pair = deferredCode;
          deferredCode = null;
          const lead = pending.length && this.textHeightPt(pending) <= 3 * 40 ? pending.slice() : [];
          if (!lead.length) flushPending();
          let k = blockIndex + 1;
          const trail = [];
          while (k < section.blocks.length && ["text", "heading", "bullet"].includes(section.blocks[k].kind)) trail.push(section.blocks[k++]);
          const trailPt = this.textHeightPt(trail);
          if (!pair && !pending.length && open && open.codeArea && this.appendCodeBelow(open, b, trailPt)) {
            governingSeen = true;
            continue;
          }
          open = this.sourceCode(b, section.title, lead, { ...(pair ? { visual: pair.png } : {}), trailPt });
          if (pair) { if (multiVisual) visualTargets[pair.vi] = "placed"; else visualInline = true; }
          pending = [];
          governingSeen = true;
          continue;
        }
        const paired = b.kind === "tree" && pending.length === 1 && pending[0].kind === "text" && !governingSeen;
        if (!paired) flushPending();
        open = null;
        const index = b.kind === "tree" ? ORIGIN.tree : ORIGIN.code;
        const id = b.kind === "tree" ? 30 : 31;
        const size = b.kind === "tree" && !paired
          ? [TREE_TEXT.w * 72, TREE_TEXT.h * 72]
          : geometry(shape(this.roots[index], id));
        const pieces = splitCode(b.text, size[0], size[1]);
        for (let j = 0; j < pieces.length; j++) {
          const p = this.page(index, section.title);
          if (index === ORIGIN.tree) {
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
      flushPending();
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
      // The single visual lives in its own segment: [segStart[vSeg], segEnd).
      const vSeg = visuals.length ? segOf[section.blocks.findIndex(isVisualBlock)] : 0;
      const vSegStart = segStart[vSeg] != null ? segStart[vSeg] : firstIdx;
      const vSegEnd = () => (segStart[vSeg + 1] != null ? segStart[vSeg + 1] : this.pages.length);
      if (!multiVisual && visuals.length && !visualInline && !this.pages.slice(vSegStart, vSegEnd()).some((p) => p.items.some((it) => it.id === 8))) {
        const segPages = this.pages.slice(vSegStart, vSegEnd());
        const lastPage = segPages[segPages.length - 1];
        const margin = 0.15;
        const availableH = lastPage && lastPage.tableBottom != null ? PAGE_NUM_Y - margin - (lastPage.tableBottom + margin) : 0;
        // Below the table only when the diagram still reads at MIN_PT or more there.
        const trailBox = lastPage ? { x: TABLE_BAND_X / 72, y: lastPage.tableBottom + margin, w: TABLE_BAND_CX / 72, h: availableH } : null;
        const trailNat = naturalSize(renderedVisuals[0], TARGET_PT);
        const trailFits = trailBox && Math.min(trailBox.w / trailNat.w, trailBox.h / trailNat.h) >= MIN_PT / TARGET_PT - 1e-9;
        if (lastPage && availableH >= 0.9 && trailFits) {
          const png = renderedVisuals[0];
          const box = trailBox;
          lastPage.pictures = [{ ...png, bounds: fitTarget(box, png) }];
          lastPage.visualLayout = "table-trailing";
          tableVisualPlaced = true;
        } else {
          // A blank carrier page, placed at the end of the visual's own segment (not the topic's).
          const at = vSegEnd();
          const p = this.page(ORIGIN.prose, section.title);
          paragraphs(p, 8, [], false);
          this.pages.splice(this.pages.length - 1, 1);
          this.pages.splice(at, 0, p);
          for (let s = vSeg + 1; s < segStart.length; s++) if (segStart[s] != null) segStart[s]++;
        }
      }
      let end = this.pages.length;
      if (multiVisual) {
        // Each visual already claimed its own target page inline (see the loop above); attach it
        // there alone, with the full panel height to itself rather than sharing a slot.
        for (let vi = 0; vi < renderedVisuals.length; vi++) {
          const target = visualTargets[vi];
          if (target === "placed") continue;
          need(target, "Visual composition unsupported for topic without a prose slide: " + section.title);
          const png = renderedVisuals[vi];
          setShapeBounds(shape(target.doc, 8), layout.text);
          const textEndY = layout.text.y + layout.text.h * Math.min(ORPHAN_TOLERANCE, (target.textCost || 0) / layout.capacity);
          const margin = 0.15;
          const availableH = Math.max(0.6, this.contentBottomY() - margin - textEndY);
          const panel = visualPanel(layout, textEndY + margin, availableH, [png]);
          target.pictures = [{ ...png, bounds: fitTarget({ x: panel.x, y: panel.y, w: panel.w, h: panel.h }, png) }];
          target.visualLayout = layout.name;
        }
      } else {
        if (visuals.length && !tableVisualPlaced && !visualInline) {
          const target = this.pages.slice(vSegStart, end).find((p) => p.items.some((item) => item.id === 8));
          need(target, "Visual composition unsupported for topic without a prose slide: " + section.title);
          setShapeBounds(shape(target.doc, 8), layout.text);
          // Panel Y is dynamic, not the layout bucket's fixed design value: textCost/capacity (see
          // flush()) estimates how far down the actual text ran, and the panel is centered in
          // whatever's left between that point and the footer -- instead of always sitting glued to
          // the text box's full design height, which left the panel crowding short text blocks.
          if (sideSegs.has(vSeg)) {
            setShapeBounds(shape(target.doc, 8), SIDE_TEXT);
            const png = renderedVisuals[0];
            target.pictures = [{ ...png, bounds: fitTarget(SIDE_PANEL, png) }];
            target.visualLayout = "side";
          } else {
          const cost = target.textCost || 0;
          const textEndY = layout.text.y + layout.text.h * Math.min(ORPHAN_TOLERANCE, cost / layout.capacity);
          const margin = 0.15;
          const availableH = Math.max(0.6, this.contentBottomY() - margin - textEndY);
          const panel = visualPanel(layout, textEndY + margin, availableH, renderedVisuals);
          const gap = 0.12;
          const slotH = (panel.h - gap * (renderedVisuals.length - 1)) / renderedVisuals.length;
          target.pictures = renderedVisuals.map((png, index) => ({
            ...png,
            bounds: fitTarget({ x: panel.x, y: panel.y + index * (slotH + gap), w: panel.w, h: slotH }, png),
          }));
          target.visualLayout = layout.name;
          }
        }
      }
      // A practice topic ("NN. 실습 — …", not its "검토 예시") is one slide (session-authoring-guide.md
      // "사례·가정·실습"): when its text ran onto continuation slides, set it again on one slide at
      // 16 then 14pt, then in two columns at 14pt (production-guide.md "실습 슬라이드"). Its answer
      // is set on one slide at 14/12/11pt by level, in two columns if needed; if even that runs
      // over it keeps its 18pt continuation slides.
      const practicePages = this.pages.slice(firstIdx, end);
      if (isPractice(section.title) || isAnswer(section.title) || docLayout) {
        const pages = practicePages;
        const textOnly = pages.every((p) => !(p.pictures || []).length && p.tableBottom == null && !p.items.some((it) => it.kind === "source" || it.kind === "table"));
        const one = textOnly && (isPractice(section.title) ? this.practicePage(this.sectionBlocks, section.title) : this.answerPage(this.sectionBlocks, section.title));
        if (one) {
          this.pages.splice(firstIdx, end - firstIdx);
          this.pages.splice(firstIdx, 0, this.pages.pop());
          end = firstIdx + 1;
        }
      }
      if (refLayout) {
        const built = this.referencePages(this.sectionBlocks, section.title);
        this.pages.splice(firstIdx, end - firstIdx, ...built);
        end = firstIdx + built.length;
      }
      // A diagram that would read below MIN_PT while sharing its slide first gets a slide of its
      // own at the full body area (production-guide.md "Visual layout 및 가독성"). It stays put --
      // and is reported by generate.js -- only when even that slide cannot hold it at MIN_PT.
      let sectionEnd = end;
      for (let k = firstIdx; k < sectionEnd; k++) {
        const p = this.pages[k];
        if (!p.pictures || !p.pictures.length) continue;
        const shared = () => p.pictures.length > 1 || p.items.some((it) => it.kind === "table" || (it.text && it.text.trim() !== ""));
        for (const pic of p.pictures.slice()) {
          if (pictureTextPt(pic, pic.bounds) >= MIN_PT - 0.05 || !shared()) continue;
          const bounds = fitTarget(VISUAL_ONLY, pic);
          if (pictureTextPt(pic, bounds) < MIN_PT - 0.05) continue;
          p.pictures = p.pictures.filter((x) => x !== pic);
          const q = this.page(ORIGIN.prose, section.title);
          paragraphs(q, 8, [], false);
          this.pages.pop();
          this.pages.splice(k + 1, 0, q);
          q.pictures = [{ ...pic, bounds }];
          q.visualLayout = "visual-only";
          sectionEnd++;
        }
      }
      if (section.notes && section.notes.length && sectionEnd > firstIdx) this.pages[firstIdx].notes = section.notes;
      if (section.appendix) for (let k = firstIdx; k < sectionEnd; k++) this.pages[k].appendix = true;
      for (let k = firstIdx; k < sectionEnd; k++) {
        const p = this.pages[k];
        const m = /^(.+?) (\((?!안\)).*\))$/.exec(p.heading);
        let main = p.heading, english = "";
        if (m) { main = m[1]; english = m[2]; }
        if (sectionEnd - firstIdx > 1) main += " (" + (k - firstIdx + 1) + "/" + (sectionEnd - firstIdx) + ")";
        // The second title line: a sub-topic's group ("05. 연관"), else the diagram marker's name.
        const second = [english, section.group || section.diagram || ""].filter((s) => s !== "").join(" · ");
        p.heading = main + (second === "" ? "" : "\n" + second);
      }
      if (footnote) for (const page of this.pages.slice(firstIdx)) this.footnote(page, footnote);
      this.hasFootnote = false;
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
          // An answer's "(안)" is set at 18pt beside the 24pt title (production-guide.md "실습 슬라이드").
          const draft = li === 0 && /^(.*) (\(안\))((?: \(\d+\/\d+\))?)$/.exec(lines[li]);
          if (draft) {
            runParen(par, draft[1] + " ", 24, true);
            run(par, draft[2], 18, true);
            if (draft[3]) runParen(par, draft[3], 24, true);
          } else runParen(par, lines[li], li === 0 ? 24 : 11, true);
        }
      }
      // Shape 5 (top-right, idx=11) is the session name -- production-guide.md ("Session 명")
      // requires the same value on every slide, never the slide's own topic title. Shapes 6/7
      // stay blank (no source/copyright string).
      // An appendix slide (after the summary, "## 별첨. …") reads "별첨: <세션명>".
      const label = p.appendix ? appendixSessionName(this.session) : this.session;
      setText(shape(p.doc, 5), p.isToc ? "" : label);
      if (!p.isToc) {
        const pt = sessionNamePt(label);
        if (pt !== SESSION_PT) for (const rpr of all(shape(p.doc, 5), A, "rPr")) rpr.setAttribute("sz", String(Math.round(pt * 100)));
      }
      setText(shape(p.doc, 6), "");
      setText(shape(p.doc, 7), "");
      for (const sh of all(p.doc, P, "sp")) if (all(sh, P, "ph").some((ph) => ph.getAttribute("type") === "sldNum")) setText(sh, "- " + number + " -");
      const name = "ppt/slides/slide" + number + ".xml";
      const sr = parseXml(this.data.get(relPath(p.origin)));
      for (const rel of children(sr.documentElement).slice()) if (rel.getAttribute("Type").endsWith("/notesSlide")) rel.parentNode.removeChild(rel);
      // Diagram titles are shapes too: add them before numbering the pictures' shape ids.
      for (const picture of p.pictures || []) if (picture.caption) this.captionPicture(p, picture);
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
    return { pages: this.pages, codes: this.codes, unsupportedVisuals: this.unsupportedVisuals, layoutWarnings: this.layoutWarnings, images: imageNumber, imageCounts, title: this.session, source: "" };
  }
}

async function render(sections, templatePath, outputPath, session, toc) {
  const b = new Builder(templatePath);
  await b.init(session);
  return b.render(sections, outputPath, toc);
}

module.exports = { styledCost, PRACTICE_STYLE, ANSWER_STYLE, REFERENCE_STYLE, PRACTICE_BOX, ANSWER_COLUMNS, Builder, render, isPractice, isAnswer, geometry, naturalSize, pictureTextPt, fitTarget, visualPanel, columnWidths, tocSessionName, appendixSessionName, sessionNamePt, TARGET_PT, MIN_PT, UML_MAX_PT, PAGE_NUM_Y };
