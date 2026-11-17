"use strict";
// Port of LecturePpt.Builder: computes its own pagination from content size. Every page is a
// cloneNode of one of the template's prototype slides (template.js ORIGIN: TOC, prose, tree,
// code, table), whose shapes it fills and repositions.
const {
  A, P, R, REL, CT, need, xmlOut, children, kids, child, all, first, el, copy, shape, paragraph, text, body, setText, spacing,
} = require("./xml");
const { writeZip } = require("./zip");
const { plain, wide, estimate, widthOf, splitCode, codePoints } = require("./text");
const { rich, run, runParen, richDeclarations } = require("./richText");
const { paragraphs, BULLET_LEVELS, bulletCitation, citationParts, summaryParts, numberWidthEmu, displayQuote } = require("./paragraphs");
const { normalizeTypography } = require("./typography");
const { OMISSION, COLUMN_BODY_INDENT, prepareColumnBlocks, columnTextHeight, columnIndent } = require("./columnLayout");
const { TEMPLATE_DIR, ORIGIN, readTemplate, slideParts } = require("./template");
const { renderMermaid } = require("./mermaidAdapter");
const { renderPlantUml } = require("./plantumlAdapter");
const { renderChart } = require("./chartAdapter");
const { renderSvg, outsideViewBox } = require("./svgAdapter");
// 쪼개 둔 네 묶음: 이름(실습·세션명), 글·코드의 크기, 문서형 슬라이드의 style, 도식의 크기와 자리.
const { isPractice, isAnswer, appendixSessionName, tocSessionName, sessionNamePt, SESSION_PT } = require("./slideNames");
const { proseLines, codeHeightPt, splitColumns, planCode, CODE_COL_GAP } = require("./codeFit");
const {
  PRACTICE_STYLE, ANSWER_STYLE, REFERENCE_STYLE, REFERENCE_MARKER, isReferenceMarker, shiftStyle,
  PRACTICE_BOX, ANSWER_COLUMNS, STYLE_SPACE, styleSize, styledCost, restyle, geometry,
} = require("./styleFit");
const {
  EMU, FULL_TEXT, STACKED_TEXT, STACKED_PANEL, DEEP_STACKED_TEXT, DEEP_STACKED_PANEL,
  PAGE_NUM_Y, VISUAL_ONLY, TREE_TEXT, UML_PANEL,
  contain, center, naturalSize, fitTarget, pictureTextPt, visualPanel, visualPolicy, isUml,
  TARGET_PT, MIN_PT, UML_MAX_PT,
} = require("./visualFit");

const ARCH_TERMS = new Set(["domain", "application", "presentation", "adapter", "infrastructure", "port", "in", "out", "service", "dto", "controller", "gateway", "repository", "mapper"]);

// TOC per guides/production-guide.md ("목차 생성 및 검증"): Production uses `## 목차`'s own
// items verbatim (validated 1:1 against body headings), never derives a TOC from body headings.
// 배치는 **본문 폭 전체를 쓰는 한 열**이다(2026-11-15). 좌우 두 단은 항목 **개수**(한 단 17개)로만
// 나눠 제목의 줄바꿈 높이를 보지 않았고, 긴 제목 16개가 모두 왼쪽 단으로 들어가 아래가 잘리고
// 오른쪽은 비었다(S03: 한 단 672pt vs 예산 435.5pt). 한 열로 두면 같은 16개가 줄바꿈 없이
// 403.2pt로 한 장에 들어간다.
const TOC_FONT_SIZE = 16;
// production-guide.md "Session 명": the TOC slide title uses only the session name before its
// " — " subtitle ("03. 정적 모델 — 도메인 개념과 관계" -> "03. 정적 모델"); every other slide's
// top-right session name keeps the full name.
// 본문 개체와 같은 띠(29.6pt에서 폭 663.3pt, 높이 435.5pt). 원형 목차 슬라이드의 shape 10은 좁은
// 왼쪽 단 좌표를 들고 있으므로 tocColumn()이 이 값으로 덮어쓴다.
const TOC_COLUMN_XFRM = { x: 375920, y: 949064, cx: 8423910, cy: 5530862 };
// 항목 한 줄의 높이: 16pt x 1.2 + 문단 앞뒤 3pt씩(tocParagraph).
const TOC_LINE_PT = TOC_FONT_SIZE * 1.2;
const TOC_SPACING_PT = 6;
const EMU_PT = 12700;
// 표지(production-guide.md 「표지」): 과정명 한 줄을 본문 영역 가운데에 둔다. 세션명은 바로 다음
// 목차 슬라이드의 제목이 보인다.
const COVER_TEXT = { x: 0.4, y: 2.9, w: 9.2, h: 1.4 };
const COVER_PT = 40;
// A visual's tool marker, with an optional title after it: "**도식 — PlantUML — 제목**".
const VISUAL_MARKER = /^\*\*(?:도식\s*[—:-]\s*(?:Mermaid|PlantUML|SVG)|Chart\s*[—:-]\s*matplotlib)(?:\s*—\s*(.+?))?\*\*$/i;
// A table's title line right before it: "**표 — 제목**".
const TABLE_CAPTION = /^\*\*표\s*—\s*(.+?)\*\*$/;
// 인용문 그룹의 표식. 표식 줄 자체는 본문에 그리지 않고 다음 블록의 meta에 옮긴다(render()).
const QUOTE_MARKER = /^\*\*(?:인용문|Anchor Message|앵커 메시지)\*\*$/i;

// User-requested header: 20pt bold title and the original upper-right Shape 5 session name.
// Write-time fitting reserves horizontal or vertical space for both; Shape 6 stays empty.
const TITLE_BOX = { x: 29.6 / 72, y: -3.0 / 72, w: 662.9 / 72, h: 56.7 / 72 };
// 일반 슬라이드의 제목은 **20pt Bold 고정**이다. 넓어진 상자(글 폭 648.5pt)에서 두 과정의 제목
// 350개가 모두 한 줄에 들어가므로 자동 축소를 두지 않는다 -- 장마다 제목 크기가 달라지면 같은
// topic의 이어지는 장끼리도 제목이 들쭉날쭉해진다(2026-11-16).
const TITLE_PT = 20;
const SESSION_NAME_ID = 5;
const SESSION_NAME_BOX = { x: 5076056 / EMU, y: 367445 / EMU, w: 3699901 / EMU, h: 264734 / EMU };

// 그룹 대표명 — 줄 전체가 하나의 굵은 구간인 text 블록. 굵다는 사실만으로는 정하지 않는다:
// 바로 뒤에 그 그룹에 속한 내용이 와야 대표명이고, 뒤가 없거나 `###`가 열리면 보조 문단이다
// (session-authoring-guide.md 「의미 표식과 블록 경계」).
const GROUP_HEAD = /^\*\*[^*]+\*\*$/;
// 독립 안내 문장 — 뒤따르는 목록을 예고하는 한 문장("… 다음을 수행할 수 있다.", ":"로 끝나는 줄).
// 한 문장일 때만(문장 중간에 종결 부호가 없다) 보며, 뒤에 같은 단의 목록이 올 때만 안내 문장이다
// (structure.js의 LIST_INTRO가 경고로 보는 자리와 같은 모양).
const LIST_LEAD = /^[^.!?]*(?:다음|아래)[^.!?]*[.:：]$|^[^.!?]*[:：]$/;
// 인용된 요청 — 원고의 `>` 블록. 받은 말이므로 글머리표를 붙이지 않는다(들여쓰기는 유지).
const BLOCKQUOTE_LINE = /^>\s*/;
// 실습 과제 한 장을 좌우로 가르는 자리: 프롬프트 표식 앞이다. 표식 이름은
// session-authoring-guide.md 「사례·가정·실습」이 정한 것이며 과정·세션의 문구가 아니다.
const PRACTICE_SPLIT = /^\*\*프롬프트(?:\s*—[^*]*)?\*\*$/;

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
// above the table, not as part of the lead text box. It is 14pt bold on one line plus that gap --
// costing it as 18pt prose (what blockCost does) overstates the lead by ~8pt and pushed tables
// that did fit onto a slide of their own.
const CAPTION_H = 14 * 1.25 + 6;
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

// 한 상자의 모든 run을 같은 크기로 둔다. setText()는 원형 문단에 rPr이 없으면 run도 rPr 없이
// 만들어 placeholder의 크기를 물려받는다 -- 그 경우에도 크기를 줄일 수 있어야 하므로 rPr을 만든다.
function setRunSize(sh, pt) {
  const doc = sh.ownerDocument;
  for (const r of all(sh, A, "r")) {
    let rpr = child(r, A, "rPr");
    if (!rpr) { rpr = el(doc, A, "rPr"); r.insertBefore(rpr, r.firstChild); }
    rpr.setAttribute("sz", String(Math.round(pt * 100)));
  }
}

// Inverse of visualPolicy()'s legibility estimate: the display width at which the image's
// Orphan control for flush(): a remainder costing at most ORPHAN_SHARE of a page stays on the
// current page as long as the page total stays within ORPHAN_TOLERANCE of its budget.
const ORPHAN_SHARE = 0.2;
const ORPHAN_TOLERANCE = 1.2;

// One blank body line between stacked blocks -- text, table, diagram, caption. The rhythm is the
// same above and below every block, so a table never hugs the paragraph that follows it and a
// diagram never drifts a third of the slide away from the line that introduces it.
const BLOCK_GAP_PT = 18;
const BLOCK_GAP = BLOCK_GAP_PT / 72;
const TABLE_TEXT_GAP_PT = 8;
// A diagram title is set as the diagram's heading: a little air above it so it does not crowd the
// last line of body text, a tight line box, and a smaller gap below so it reads as belonging to the
// diagram rather than floating between the text and the picture.
const CAPTION_LEAD = 0.08;
const CAPTION_LINE = 0.22;
const CAPTION_GAP = 0.04;

// Where the body text actually ends (in), from the same cost model pagination uses (blockCost /
// textHeightPt). That model pads every block to keep pagination safe; most of the padding is never
// drawn, so the anchor for whatever follows takes part of it back -- otherwise a diagram floats two
// or three lines below the last line it belongs to.
// blockCost encodes line counts: a block costs 22 per 18pt line (13 per 10pt line) plus 12 of
// pagination slack. Reading the lines back out and pricing them at what they actually occupy --
// 21.6pt a line, 6pt of spacing a block -- lands much closer than scaling the padded cost.
const LINE_PT = 21.6;
const BLOCK_SPACING_PT = 6;
function textRunPt(cost, blocks) {
  const n = blocks || 1;
  const lines = Math.max(1, (cost - 12 * n) / 22);
  return lines * LINE_PT + BLOCK_SPACING_PT * n;
}
function textEndIn(top, cost, blocks) {
  return top + Math.max(0.3, textRunPt(cost, blocks) / 72);
}

// The panel a topic's visual(s) are placed in: the free band [top, top+availableH] between the
// text's estimated end and the footer, starting at `top` -- one line below the last line of text.
// Mermaid/SVG/chart keep the layout's design panel height; an all-UML panel takes the whole free
// band at the widest body width, so a large UML diagram keeps its 10pt as far as the band allows.
// Lines a body paragraph takes: like estimate(), but a "(...)" span is rendered 4pt smaller
// (production-guide.md, 괄호 -4pt) and is measured at that size.
function addPicture(doc, shapeId, relId, bounds, name, descr, crop) {
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
  if(crop)fill.appendChild(el(doc,A,'srcRect',...Object.entries(crop).flatMap(([k,v])=>[k,String(Math.round(v*100000))])));
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
// 고객의 말·요청처럼 **문장 전체가 따옴표 안에 있는 한 줄**은 글머리표 없이 본문 크기로 그린다.
// topic의 둘째 text 줄부터는 bullet으로 바뀌는데, 받은 말에 글머리표가 붙으면 저자의 주장처럼
// 읽힌다(session-authoring-guide.md 「고객의 말」, 2026-10-31).
const SPOKEN_LINE = /^"[^"]+"$/;
const TABLE_MAX_WIDTH = 654;
// Template's own graphicFrame band (table prototype, shape id 11): x=33.48pt,
// cx=651.97pt -- close enough to TABLE_MAX_WIDTH that centering a narrower table inside this
// band still reads as "the same table area, just not stretched full-width."
// 표 칸의 위아래 여백(EMU). 원형 슬라이드는 위 6750·아래 0이어서 가운데 맞춤이어도 글이 아래로
// 치우쳐 보였다. 같은 값을 위아래에 주어 가운데가 실제 가운데가 되게 한다(2026-10-28).
const CELL_MAR_V = 6750;
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

  async init(session, course) {
    need(session && session.trim() !== "", "세션명이 필요하다 (Markdown 상단 'Session 명:' 헤더).");
    this.session = session;
    this.s03Profile = course?.productionProfile === 'ai-native-s03' && session.trim() === '03. 요구사항';
    // The S03 production contract integrates explanatory text and tables.
    this.paragraphSpace = this.s03Profile ? 3 : 6;
    this.data = readTemplate(this.templatePath);
    this.origins = slideParts(this.data);
    need(this.origins.length === Object.keys(ORIGIN).length, "템플릿의 원형 슬라이드는 TOC/prose/tree/code/table 5장이어야 한다: " + this.templatePath);
    const { parseXml } = require("./xml");
    this.roots = this.origins.map((n) => parseXml(this.data.get(n)));
    return this;
  }

  page(index, heading) {
    // The slide carries the session it was composed for, so a bundle of several sessions labels
    // each slide with its own session name (production-guide.md 「묶음 덱」).
    const p = { doc: this.roots[index].cloneNode(true), origin: this.origins[index], heading, items: [], session: this.session, s03Profile:this.s03Profile, paragraphSpace:this.paragraphSpace };
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
    const text = b.text.trim();
    const markedQuote = (b.meta && (b.meta.quote || b.meta.anchor)) || (b.kind === "bullet" && bulletCitation(text));
    // Both citation forms -- a quoted Korean translation and an unquoted Korean summary -- put the
    // English original and the label in the 10pt zone. Only the quoted form used to be recognised
    // here, so a summary citation was costed as if the whole line were 18pt prose, which opened a
    // hole above the table or diagram that followed it.
    const parts = markedQuote ? citationParts(text) || summaryParts(text) : null;
    if (parts && parts[2] !== undefined) {
      // One paragraph in two sizes: the 10pt original runs on from the 18pt Korean instead of
      // starting its own line, so the flow is measured once and rounded once -- rounding each run
      // up separately added as much as two phantom lines to every citation.
      const korean = plain(this.s03Profile?displayQuote(parts[1]):parts[4] ? parts[1] : `"${parts[1]}"`);
      // 영문 원문은 바깥따옴표 없이 그려진다(paragraphs.js) -- 폭도 그 모양으로 센다.
      const rest = plain(`, ${this.s03Profile?displayQuote(parts[2]):parts[2]}, ${parts[3]}`);
      const w = 620 - 12;
      const total = Math.max(1, Math.ceil((widthOf(korean, 18) + widthOf(rest, 10)) / w));
      const at18 = Math.min(total, Math.max(1, Math.ceil(widthOf(korean, 18) / w)));
      return at18 * 22 + (total - at18) * 13 + 12;
    }
    const size = b.kind === "bullet" ? [16,14,12][Math.min(b.depth || 0,2)] : 18;
    return proseLines(plain(text), 620, size) * (22 * size / 18) + 12;
  }

  // The practice slide (production-guide.md "실습 슬라이드"): the reference style in one column,
  // then 16 and 14pt in one column, then 14pt in two. Returns the page (appended to this.pages) or
  // null when even two columns overflow.
  practicePage(blocks, heading) {
    const resultAt=blocks.findIndex(b=>/^\*\*결과물\*\*$/.test(b.text.trim()));
    const promptAt=blocks.findIndex(b=>PRACTICE_SPLIT.test(b.text.trim()));
    if(resultAt>0 && promptAt>=0) {
      const purpose=blocks[0].kind==="text"?blocks[0]:null;
      const body=prepareColumnBlocks(blocks.slice(purpose?1:0,resultAt));
      const prompts=body.map((b,i)=>({b,i})).filter(x=>/^[①-⑤]\s/.test(x.b.text));
      if(prompts.length>1)body.splice(prompts[1].i,0,{kind:"bullet",text:OMISSION,rows:[],depth:0,meta:{noGlyph:true,noHang:true}});
      for(const b of body)if(/^(?:\d+\.|[①-⑤])\s/.test(b.text))b.meta={...(b.meta||{}),autoNumber:true};
      const top=FULL_TEXT.y+(purpose?(14*1.2+6+8)/72:0);
      const half=(FULL_TEXT.w-0.3)/2;
      const boxes=[{x:FULL_TEXT.x,y:top,w:half,h:this.contentBottomY()-top},{x:FULL_TEXT.x+half+0.3,y:top,w:half,h:this.contentBottomY()-top}];
      const p=this.fixedColumnPage([body,prepareColumnBlocks(blocks.slice(resultAt))],heading,boxes,purpose?{block:purpose,box:{...FULL_TEXT,h:(14*1.2+6)/72}}:null);
      p.practiceSize=14;p.practiceColumns=2;return p;
    }
    const fitBox = (box) => ({ ...box, h: Math.min(box.h, this.contentBottomY() - box.y) });
    const full = fitBox(FULL_TEXT), practice = fitBox(PRACTICE_BOX);
    const half = (full.w - 0.3) / 2;
    const two = [{ ...full, w: half }, { ...full, x: full.x + half + 0.3, w: half }];
    // 실습은 한 슬라이드이고 그 아래가 쪽 번호다 — 넘칠 곳이 없으므로 **여유를 쓰지 않는다**.
    // 여유(fit 1.04)를 두면 왼쪽 단이 상자를 조금씩 넘겨 글이 쪽 번호를 덮는다. 들어가지 않으면
    // 다음 시도(두 단, 더 작은 글자)로 내려가는 것이 맞다.
    const tight = (style) => ({ ...style, fit: Math.min(style.fit, 1), leftFit: Math.min(style.leftFit != null ? style.leftFit : style.fit, 1) });
    // 실습 과제는 **좌우 두 단 한 장**이다 — 왼쪽은 투입물·진행 방법, 오른쪽은 프롬프트부터
    // 점검 항목·결과물이다(session-authoring-guide.md 「사례·가정·실습」의 실습 구성). 들어가는
    // 가장 큰 글자의 두 단을 먼저 쓰고, 두 단으로도 안 들어갈 때만 한 단으로 내려간다.
    const split = { splitBefore: PRACTICE_SPLIT, splitRequired: true };
    const tries = [
      [{ ...shiftStyle(16), ...split }, two], [{ ...shiftStyle(14), ...split }, two], [{ ...shiftStyle(12), ...split }, two],
      [PRACTICE_STYLE, [practice]],
      [shiftStyle(14), two], [shiftStyle(12), two],
      [shiftStyle(16), [full]], [shiftStyle(14), [full]], [shiftStyle(12), [full]],
    ].map(([style, boxes]) => [tight(style), boxes]);
    for (const [style, boxes] of tries) {
      const page = this.styledPage(blocks, heading, style, boxes);
      if (!page) continue;
      page.practiceSize = style.text;
      if (boxes.length === 2) page.practiceColumns = 2;
      return page;
    }
    return null;
  }

  // A 10pt document with one diagram: keep source order, diagram above its trailing prose.
  // Try full-width prose and two columns, selecting the larger readable diagram without omissions.
  // A short 10pt document can mix prose, a literal example and a table. Measure the whole
  // sequence before pagination, using one 8pt gap and printed heights rather than the
  // normal 18pt prose gap, fit slack or the code planner's spare trailing line.
  compactMixedDocumentPage(blocks, heading, style) {
    if (!blocks.some(b => b.kind === "code") || !blocks.some(b => b.kind === "table")) return null;
    if (blocks.some(b => !["text", "bullet", "heading", "code", "table"].includes(b.kind))) return null;
    if (blocks.some(b => b.kind === "text" && (TABLE_CAPTION.test(b.text.trim()) || /^\*\*인용문\*\*$/.test(b.text.trim())))) return null;
    const gap = 8 / 72;
    const box = { ...FULL_TEXT, h: this.contentBottomY() - FULL_TEXT.y };
    const groups = [];
    let prose = [];
    const flush = () => {
      if (prose.length) groups.push({ kind: "text", blocks: prose, h: styledCost(prose, style, box) / 72 });
      prose = [];
    };
    for (const b of blocks) {
      if (["text", "bullet", "heading"].includes(b.kind)) { prose.push(b); continue; }
      flush();
      if (b.kind === "code") {
        const h = (codeHeightPt(b.text.split("\n"), box.w * 72, 10, 13) - 13) / 72;
        groups.push({ kind: "code", block: b, h });
      } else {
        const widths = columnWidths(b.rows, b.rows[0].length);
        const h = b.rows.reduce((sum, row) => sum + this.rowHeight(row, widths), 0) / 72;
        groups.push({ kind: "table", block: b, widths, h });
      }
    }
    flush();
    const h = groups.reduce((sum, g) => sum + g.h, 0) + gap * (groups.length - 1);
    if (h > box.h + 1e-9) return null;
    const page = this.page(ORIGIN.code, heading);
    let y = box.y;
    for (const g of groups) {
      let id;
      if (g.kind === "text") {
        id = this.cloneShape(page, 8);
        setShapeBounds(shape(page.doc, id), { ...box, y, h: g.h });
        paragraphs(page, id, g.blocks, false);
        restyle(shape(page.doc, id), style);
      } else if (g.kind === "code") {
        const before = page.items.length;
        this.fillCode(page, [g.block.text], box.x, y, box.w, 10, 13, y + g.h, []);
        id = page.items[before].id;
      } else {
        id = this.cloneShape(page, 11);
        this.fillTable(page, shape(page.doc, id), g.block.rows, g.widths, y * 72);
      }
      if (g.kind !== "table") {
        const pr = child(body(shape(page.doc, id)), A, "bodyPr");
        pr.setAttribute("tIns", "0");
        pr.setAttribute("bIns", "0");
      }
      y += g.h + gap;
    }
    page.tableBottom = y - gap;
    return page;
  }

  documentDiagramPage(blocks, heading, png, style) {
    const at = blocks.findIndex(b => ["mermaid", "plantuml", "svg", "chart"].includes(b.kind));
    if (at < 0 || blocks.some(b => !["text", "bullet", "heading", "mermaid", "plantuml", "svg", "chart"].includes(b.kind))) return null;
    const before = blocks.slice(0, at), after = blocks.slice(at + 1);
    const box = { ...FULL_TEXT, h: this.contentBottomY() - FULL_TEXT.y };
    const height = (bs, area) => bs.length ? styledCost(bs, style, area) / 72 / style.fit : 0;
    const beforeH = height(before, box);
    const gap = BLOCK_GAP;
    // captionPicture() moves a titled diagram down by the title's height after this layout is
    // chosen, so the title's band has to be reserved here -- otherwise the diagram slides onto the
    // text below it (production-guide.md "표·도식 제목").
    const capH = png.caption ? CAPTION_LEAD + CAPTION_LINE + CAPTION_GAP : 0;
    const options = [{ parts: [after], areas: [box] }];
    if (after.length > 1) {
      const w = (box.w - 0.3) / 2;
      const areas = [{ ...box, w }, { ...box, x: box.x + w + 0.3, w }];
      let best = null;
      for (let i = 1; i < after.length; i++) {
        if (after[i - 1].kind === "heading") continue;
        const parts = [after.slice(0, i), after.slice(i)];
        const h = Math.max(...parts.map((part, k) => height(part, areas[k])));
        if (!best || h < best.h) best = { parts, areas, h };
      }
      if (best) options.push(best);
    }
    let chosen = null;
    for (const option of options) {
      const afterH = Math.max(...option.parts.map((part, k) => height(part, option.areas[k])));
      const y = box.y + beforeH + (before.length ? gap : 0);
      const panel = { x: box.x, y, w: box.w, h: this.contentBottomY() - y - afterH - (after.length ? gap : 0) - capH };
      if (panel.h <= 0) continue;
      const bounds = fitTarget(panel, png, "top");
      const pt = pictureTextPt(png, bounds);
      if (pt < MIN_PT - 0.05) continue;
      if (!chosen || pt > chosen.pt + 0.05) chosen = { ...option, bounds, pt, beforeH, afterH };
    }
    if (!chosen) return null;
    const page = this.page(ORIGIN.prose, heading);
    paragraphs(page, 8, [], false);
    const write = (bs, area) => {
      if (!bs.length) return;
      const id = this.cloneShape(page, 8);
      setShapeBounds(shape(page.doc, id), area);
      paragraphs(page, id, bs, false);
      restyle(shape(page.doc, id), style);
    };
    write(before, { ...box, h: beforeH });
    const y = chosen.bounds.y + capH + chosen.bounds.h + (after.length ? gap : 0);
    chosen.parts.forEach((part, k) => write(part, { ...chosen.areas[k], y, h: chosen.afterH }));
    page.pictures = [{ ...png, bounds: chosen.bounds }];
    page.visualLayout = "document-stacked";
    page.textCost = styledCost(before, style, box) + Math.max(...chosen.parts.map((part, k) => styledCost(part, style, chosen.areas[k])));
    return page;
  }

  // A text answer "(안)": the reference style in two columns split before a level-0 item where
  // possible. Returns null when it does not fit (structure.js then reports it).
  answerPage(blocks, heading, requestedStyle = ANSWER_STYLE) {
    const boxes = ANSWER_COLUMNS.map((box) => ({ ...box, h: Math.min(box.h, this.contentBottomY() - box.y) }));
    // Keep the contracted 14/12/11pt answer sizes. When a footnote owns the bottom strip, reclaim
    // the needed height from paragraph spacing (1pt instead of 3pt), not from the font size or by
    // letting the footnote cover the last lines.
    const style = this.hasFootnote ? { ...requestedStyle, space: 1 } : requestedStyle;
    const page = this.styledPage(blocks, heading, style, boxes);
    if (page) page.answerColumns = 2;
    return page;
  }

  // The same document columns, including native tables. Keep the source's explicit segments
  // and heading/content relationships; S03 appendix cells alone use the 8pt exception.
  async columnVisualDocumentPages(blocks,heading,style,balanced) {
    const pages=[];let pending=[];
    const flush=()=>{if(pending.length){pages.push(...this.columnDocumentPages(pending,heading,style,balanced));pending=[];}};
    for(const b of blocks) {
      if(['mermaid','plantuml','svg','chart'].includes(b.kind)) {
        const lead=[];while(pending.at(-1)?.kind==='heading')lead.unshift(pending.pop());
        flush();
        const rendered=await (b.kind==='mermaid'?renderMermaid({source:b.text}):b.kind==='plantuml'?renderPlantUml({kind:b.meta?.uml,source:b.text}):b.kind==='svg'?renderSvg(b.text):renderChart(b.text));
        const pic={...rendered,source:b.text,kind:b.kind,uml:Boolean(b.meta?.uml)};
        const leadPt=columnTextHeight(lead,FULL_TEXT.w*72,3,{document:style.text===10});
        const panel={...VISUAL_ONLY,y:VISUAL_ONLY.y+(leadPt?leadPt+8:0)/72,h:VISUAL_ONLY.h-(leadPt?leadPt+8:0)/72};
        const bounds=fitTarget(panel,pic);
        const tiles=pictureTextPt(pic,bounds)>=MIN_PT-0.05?[{bounds}]:require('./diagramTiles').diagramTiles(pic,panel);
        for(let ti=0;ti<tiles.length;ti++){const tile=tiles[ti],page=this.page(ORIGIN.prose,heading);paragraphs(page,8,ti===0?lead:[],false);if(ti===0&&lead.length){setShapeBounds(shape(page.doc,8),{...FULL_TEXT,h:leadPt/72});restyle(shape(page.doc,8),style);}page.pictures=[{...pic,...tile}];page.visualLayout=tile.crop?'visual-tiles':'visual-only';pages.push(page);}
      } else if(b.kind==='table' && b.rows[0].length>4) {
        flush();const start=this.pages.length;this.table(b,heading);
        const added=this.pages.slice(start);
        if(style.text===10)for(const page of added){
          page.documentTablePt=style.tablePt??10;
          for(const sp of all(page.doc,P,'sp'))for(const rp of all(sp,A,'rPr'))if(rp.getAttribute('sz')==='800')rp.setAttribute('sz','1000');
          for(const gf of all(page.doc,P,'graphicFrame')){
            const fitted=this.documentTableFont(gf,style.tablePt??10);
            if(fitted)page.tableBottom=Number(child(child(gf,P,'xfrm'),A,'off').getAttribute('y'))/EMU+fitted.heightPt/72;
          }
        }
        pages.push(...added);
      } else pending.push(b);
    }
    flush();return pages;
  }

  columnDocumentPages(blocks, heading, style, balanced = false) {
    const boxes = [{ x: 0.4, y: 1.05, w: 4.45, h: this.contentBottomY() - 1.05 },
      { x: 5.15, y: 1.05, w: 4.45, h: this.contentBottomY() - 1.05 }];
    if(balanced)for(const box of boxes)box.space=2;
    else if(style.text===10)for(const box of boxes){box.document=true;box.answer=style.responseRole==='answer';box.space=2;box.tablePt=style.tablePt??10;}
    const segments = [[]];
    const prepared=prepareColumnBlocks(blocks,{omitExcerpt:balanced});
    if(!balanced && style.responseRole!=='answer') {
      const intro=prepared.find(b=>b.kind!=='heading');
      if(intro?.kind==='bullet' && intro.meta?.noGlyph)intro.meta={...intro.meta,columnIntro:true};
    }
    for (const b of prepared) {
      if (b.kind === "pagebreak") segments.push([]);
      else segments[segments.length - 1].push(b);
    }
    const groups=segments.filter(s=>s.length), plans=[];
    // Explicit answer segments describe left/right pairs. The renderer preserves all selected
    // words and omissions, while the two requested answer pages replace four single columns.
    if(balanced && groups.length===4) plans.push([groups[0],groups[1]],[groups[2],groups[3]]);
    else if(balanced && groups.length===2) {
      // A pagebreak separates answer pages, not columns. Split each page at a
      // group heading, preserving the editable table with its preceding case.
      for(const bs of groups) {
        const candidates=[];
        for(let at=1;at<bs.length;at++)if(bs[at].kind==='heading') {
          const left=bs.slice(0,at),right=bs.slice(at);
          const lh=this.columnHeightPt(left,boxes[0]),rh=this.columnHeightPt(right,boxes[1]);
          if(lh<=boxes[0].h*72 && rh<=boxes[1].h*72)candidates.push({left,right,score:Math.max(lh,rh)});
        }
        candidates.sort((a,b)=>a.score-b.score);
        need(candidates.length,`실습 답 페이지를 제목 경계에서 두 열로 배치할 수 없다: ${heading}`);
        plans.push([candidates[0].left,candidates[0].right]);
      }
    }
    else if(balanced && groups.length===1 && groups[0].some(b=>b.kind==='table')) {
      const bs=groups[0],tableAt=bs.findIndex(b=>b.kind==='table');let at=tableAt;
      while(at>0 && bs[at-1].kind==='heading')at--;
      const candidate=at>0?[bs.slice(0,at),bs.slice(at)]:[bs,[]];
      if(candidate.every((col,i)=>this.columnHeightPt(col,boxes[i])<=boxes[i].h*72))plans.push(candidate);
    }
    if(!plans.length) {
      let columns=[[],[]],col=0,used=0;
      const finish=()=>{if(columns.some(c=>c.length))plans.push(columns);columns=[[],[]];col=0;used=0;};
      for(const segment of groups) {
        for(let i=0;i<segment.length;i++) {
          const unit=[segment[i]];
          while(unit[unit.length-1].kind==="heading" && i+1<segment.length)unit.push(segment[++i]);
          if(this.s03Profile && ((style.responseRole==='demo' && unit.some(b=>/^US-01\./.test(b.text||'')))
            || (style.responseRole==='answer' && /^9\. 미정 사항$/.test(unit[0].text||'')))){
            // Preserve this recorded story's title, description and acceptance conditions.
            // Move the complete group to the next column before splitting any of its parts.
            let end=i+1;while(end<segment.length && segment[end].kind!=='heading')end++;
            const whole=[...unit,...segment.slice(i+1,end)];
            if(this.columnHeightPt(whole,boxes[col])<=boxes[col].h*72){unit.splice(0,unit.length,...whole);i=end-1;}
          }
          const h=this.columnHeightPt(unit,boxes[col]);
          need(h<=boxes[col].h*72,`문서 묶음이 한 열에 들어가지 않는다: ${heading} (${h.toFixed(1)}pt / ${(boxes[col].h*72).toFixed(1)}pt)`);
          if(used+h>boxes[col].h*72) {if(col===1)finish();else {col=1;used=0;}}
          columns[col].push(...unit);used+=h;
        }
      }
      finish();
    }
    return plans.map(cols=>this.fixedColumnPage(cols,heading,boxes));
  }

  columnWidthsFor(block,box) {
    const widths=columnWidths(block.rows,block.rows[0].length), sum=widths.reduce((a,b)=>a+b,0);
    const scaled=widths.map(w=>w*Math.min(1,box.w*72/sum));
    // A half-width table must still fit a complete identifier such as
    // PENDING_PAYMENT. Take its minimum width from the token, not the cell's
    // proportional share, and reclaim the difference from wider prose columns.
    const minimum=scaled.map((w,i)=>Math.max(24,...block.rows.flatMap(row=>String(row[i]).match(/[A-Za-z][A-Za-z0-9_]+/g)||[]).map(t=>widthOf(t,10)*1.12+14.4)));
    if(minimum.reduce((a,b)=>a+b,0)>box.w*72)return scaled;
    const result=scaled.map((w,i)=>Math.max(w,minimum[i]));
    let extra=result.reduce((a,b)=>a+b,0)-Math.min(sum,box.w*72);
    while(extra>1e-6){const i=result.reduce((best,w,j)=>w-minimum[j]>result[best]-minimum[best]?j:best,0);const take=Math.min(extra,result[i]-minimum[i]);if(take<=0)break;result[i]-=take;extra-=take;}
    return result;
  }

  columnHeightPt(blocks,box) {
    return blocks.reduce((h,b)=>h+(b.kind==="table" ? this.columnTableHeightPt(b,box)+8 : columnTextHeight([b],box.w*72,box.space??3,box)),0);
  }

  columnTableHeightPt(block,box) {
    const widths=this.columnWidthsFor(block,box);
    // These recorded glossaries precede the two requested page connections.
    // Generic 10pt/0.8cm estimates stranded the story/definition below the 8pt tables.
    const glossaryHeader=box.answer?['용어','표기','정의']:['용어','정의'];
    if(this.s03Profile && box.document && box.tablePt===8
      && JSON.stringify(block.rows[0])===JSON.stringify(glossaryHeader)){
      this.columnTableHeights??=new WeakMap();
      const key=widths.join(','),cached=this.columnTableHeights.get(block);
      if(cached?.key===key)return cached.height;
      const doc=this.roots[ORIGIN.table].cloneNode(true),page={doc,items:[]},gf=shape(doc,11);
      this.fillTable(page,gf,block.rows,widths,0);
      const height=this.documentTableFont(gf,8).heightPt;
      this.columnTableHeights.set(block,{key,height});return height;
    }
    return block.rows.reduce((s,r)=>s+this.rowHeight(r,widths),0);
  }

  fixedColumnPage(columns,heading,boxes,purpose=null) {
    const heights=columns.map((bs,i)=>this.columnHeightPt(bs,boxes[i]));
    for(let i=0;i<columns.length;i++)need(heights[i]<=boxes[i].h*72,`좌우 고정 배치 초과: ${heading}, ${i===0?'왼쪽':'오른쪽'} ${heights[i].toFixed(1)}pt / ${(boxes[i].h*72).toFixed(1)}pt`);
    const page=this.page(ORIGIN.prose,heading);paragraphs(page,8,[],false);page.items.pop();page.freeBody=true;page.answerColumns=2;
    if(boxes[0].document)page.documentTablePt=boxes[0].tablePt??10;
    if(purpose) {
      const id=8;page.freeBody=false;
      setShapeBounds(shape(page.doc,id),purpose.box);paragraphs(page,id,[purpose.block],false);
      for(const rp of all(shape(page.doc,id),A,'rPr'))rp.setAttribute('sz','1400');
      spacing(child(body(shape(page.doc,id)),A,'p'),3,3,null);
    }
    const textBox=(bs,box,y)=>{
      const id=page.freeBody?8:this.cloneShape(page,8);page.freeBody=false;
      const sh=shape(page.doc,id),h=columnTextHeight(bs,box.w*72,box.space??3,box);
      setShapeBounds(sh,{...box,y:y/72,h:h/72});paragraphs(page,id,bs,false);
      const bp=child(body(sh),A,"bodyPr");for(const k of ['tIns','bIns'])bp.setAttribute(k,'0');for(const k of ['lIns','rIns'])bp.setAttribute(k,'91440');
      const ps=kids(body(sh),A,"p");
      ps.forEach((p,i)=>{
        const b=bs[i],head=b.kind==="heading",pr=spacing(p,box.space??3,box.space??3,null);
        pr.setAttribute('algn','l');pr.setAttribute('marL',String(columnIndent(b,box)));
        pr.setAttribute('indent',head||(b.meta&&b.meta.noGlyph)?'0':'-176213');
        for(const old of children(pr).filter(e=>/^bu/.test(e.localName)))pr.removeChild(old);
        const bare=head||(b.meta&&b.meta.noGlyph);
        if(bare)pr.appendChild(el(page.doc,A,'buNone'));
        else {pr.appendChild(el(page.doc,A,'buFont','typeface','Wingdings'));pr.appendChild(el(page.doc,A,'buChar','char',''));}
        for(const rp of all(p,A,'rPr')){rp.setAttribute('sz',box.document?'1000':head?'1400':'1200');if(head)rp.setAttribute('b','1');}
        if(b.meta&&b.meta.autoNumber) {
          const prefix=/^(?:(\d+)\.|([①-⑤]))\s/.exec(b.text);let remove=prefix[0].length;
          for(const t of all(p,A,'t')){const n=Math.min(remove,t.textContent.length);t.textContent=t.textContent.slice(n);remove-=n;if(!remove)break;}
          for(const old of children(pr).filter(e=>/^bu/.test(e.localName)))pr.removeChild(old);
          const n=prefix[1]||String(prefix[2].codePointAt(0)-0x2460+1);
          pr.setAttribute('indent',String(-numberWidthEmu(prefix[0],12)));
          pr.appendChild(el(page.doc,A,'buAutoNum','type',prefix[1]?'arabicPeriod':'circleNumDbPlain','startAt',n));
        }
      });
    };
    columns.forEach((bs,ci)=>{
      const box=boxes[ci];let y=box.y*72,pending=[];
      const flush=()=>{if(pending.length){textBox(pending,box,y);y+=columnTextHeight(pending,box.w*72,box.space??3,box);pending=[];}};
      for(const b of bs) {
        if(b.kind!=="table"){pending.push(b);continue;}
        flush();const id=this.cloneShape(page,11,ORIGIN.table),gf=shape(page.doc,id),widths=this.columnWidthsFor(b,box);
        this.fillTable(page,gf,b.rows,widths,y);
        const fitted=box.document?this.documentTableFont(gf,box.tablePt??10):null;
        child(child(gf,P,'xfrm'),A,'off').setAttribute('x',String(Math.round(box.x*EMU)));
        y+=(fitted?fitted.heightPt:b.rows.reduce((h,r)=>h+this.rowHeight(r,widths),0))+8;
      }
      flush();
    });
    page.textCost=Math.max(...heights)/Math.max(...boxes.map(b=>b.h*72))*450;
    page.columnHeights=heights;return page;
  }

  documentTableFont(gf,pt) {
    if(pt===8)for(const tcPr of all(gf,A,'tcPr')){
      for(const k of ['marL','marR','marT','marB'])tcPr.setAttribute(k,'54000');
    }
    for(const tag of ['rPr','defRPr','endParaRPr'])for(const rp of all(gf,A,tag)){
      rp.setAttribute('sz',String(pt*100));
      for(const name of ['latin','ea','cs']){
        let face=child(rp,A,name);
        if(!face){face=el(gf.ownerDocument,A,name);rp.appendChild(face);}
        face.setAttribute('typeface','맑은 고딕');
      }
    }
    if(pt===8)return require('./tableRowMetrics').fitTableRows(gf);
  }

  // Preserve all document blocks at the requested size, continuing left then right on each page.
  documentPages(blocks, heading, style) {
    const build = (bs) => (this.answerPage(bs, heading, style) ? this.pages.pop() : null);
    const out = [];
    const slices = [];
    let rest = blocks.slice();
    while (rest.length) {
      let found = 0, bestPage = null, low = 1, high = rest.length;
      while (low <= high) {
        const n = Math.floor((low + high) / 2);
        const page = build(rest.slice(0, n));
        if (page) {
          bestPage = page;
          found = n;
          low = n + 1;
        } else high = n - 1;
      }
      if (found < rest.length && found && rest[found - 1].kind === "heading") {
        found--;
        bestPage = found ? build(rest.slice(0, found)) : null;
      }
      need(found && bestPage, "문서의 한 항목이 한 장에 들어가지 않는다: " + heading);
      out.push(bestPage);
      slices.push(rest.slice(0, found));
      rest = rest.slice(found);
    }
    // A second slide that carries only a short remainder is not worth a slide of its own when the
    // whole text still fits inside the two column boxes at fit 1.0: one full slide reads better
    // than 96% + 21% (production-guide.md "문서 형식": 앞 장을 끝까지 채운다, 2026-10-25).
    if (out.length === 2) {
      const tail = out[1].fillParts && out[1].fillParts[out[1].fillParts.length - 1];
      if (tail != null && tail < 0.3) {
        const tight = this.answerPage(blocks, heading, { ...style, fit: 1, leftFit: 1 });
        if (tight) return [this.pages.pop()];
      }
    }
    return out;
  }

  // The reference list of the appendix: entries in two 7pt columns per slide, a heading never left
  // as the last line of a slide. Each slide is filled -- the left column down to its own bottom,
  // then the right, then the next slide (production-guide.md 「별첨 — 참고 자료」). The list is not
  // spread evenly: an even spread left both columns of every slide short.
  // Returns the pages (not left in this.pages).
  referencePages(blocks, heading) {
    // The largest n (at most `limit`) whose entries fit one slide; 0 when even one does not.
    const fitCount = (rest, limit) => {
      for (let n = Math.min(limit, rest.length); n > 0; n--) {
        if (n < rest.length && rest[n - 1].kind === "heading" && n > 1) continue;
        if (this.styledPage(rest.slice(0, n), heading, REFERENCE_STYLE, ANSWER_COLUMNS)) {
          this.pages.pop();
          return n;
        }
      }
      return 0;
    };
    need(fitCount(blocks, blocks.length), "참고 자료 항목이 한 슬라이드에 들어가지 않는다: " + heading);
    const out = [];
    let rest = blocks.slice();
    while (rest.length) {
      const n = fitCount(rest, rest.length);
      need(n, "참고 자료 항목이 한 슬라이드에 들어가지 않는다: " + heading);
      this.styledPage(rest.slice(0, n), heading, REFERENCE_STYLE, ANSWER_COLUMNS);
      const page = this.pages.pop();
      // 참고 자료는 7pt 한 줄짜리 항목이라 추정이 넉넉하다 — 단을 끝까지 채우는 것이 이 목록의
      // 규칙이므로 넘침 경고에서 뺀다(production-guide.md 「별첨 — 참고 자료」).
      page.referenceList = true;
      out.push(page);
      rest = rest.slice(n);
    }
    return out;
  }

  // Sets `blocks` in `style` into one box, or into two boxes split at the most balanced block
  // boundary (a level-0 block first); null when a box overflows.
  styledPage(blocks, heading, style, boxes) {
    if (!blocks.length) return null;
    const fits = (bs, box) => styledCost(bs, style, box) <= box.h * 72 * style.fit;
    // 왼쪽 단은 제 여유(style.leftFit)로 잰다 — 여유를 너무 줄이면 들어갈 항목이 오른쪽으로 넘어가
    // 왼쪽 아래가 비고, 너무 늘리면 글이 쪽 번호를 덮는다(production-guide.md 「문서 형식」).
    const leftFit = style.leftFit != null ? style.leftFit : style.fit;
    const fitsLeft = (bs, box) => styledCost(bs, style, box) <= box.h * 72 * leftFit;
    // In two columns, the leading unbulleted paragraphs (a governing message) span both columns
    // above them.
    let lead = [], leadBox = null;
    if (boxes.length === 2) {
      // 그룹 대표명은 lead가 아니다 — 아래 소속 내용과 떨어져 두 단 위에 혼자 놓이면 묶음이 보이지
      // 않는다. 대표명 앞까지의 안내 문장만 두 단에 걸친 lead로 올린다(2026-11-16).
      while (lead.length < blocks.length && blocks[lead.length].kind === "text"
        && !GROUP_HEAD.test(String(blocks[lead.length].text).trim())) lead.push(blocks[lead.length]);
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
    } else if (style.leftFirst && fitsLeft(blocks, boxes[0])) {
      parts = [blocks];
    } else if (style.splitBefore && (() => {
      // 의미로 정한 자리에서 나눈다(실습의 좌우 배치). 양쪽이 들어갈 때만 쓰고, 아니면 아래의
      // 균형 분할로 내려간다.
      const at = blocks.findIndex((b) => style.splitBefore.test(String(b.text).trim()));
      if (at <= 0 || !fitsLeft(blocks.slice(0, at), boxes[0]) || !fits(blocks.slice(at), boxes[1])) return false;
      parts = [blocks.slice(0, at), blocks.slice(at)];
      return true;
    })()) {
      // parts는 위 검사에서 정해졌다.
    } else if (style.splitRequired) {
      // 그 자리에서 나눠지지 않으면 이 크기로는 그리지 않는다 — 더 작은 글자로 다시 시도한다
      // (practicePage). 균형 분할로 바꿔 그리면 의미가 섞인 두 단이 나온다.
      return null;
    } else {
      const top = (b) => b.kind !== "bullet" || !b.depth;
      const split = (allowed, left) => {
        let best = null;
        for (let i = 1; i < blocks.length; i++) {
          if ((style.leftFirst && blocks[i - 1].kind === "heading") || !allowed(blocks[i]) || !left(blocks.slice(0, i), boxes[0]) || !fits(blocks.slice(i), boxes[1])) continue;
          const h = Math.max(styledCost(blocks.slice(0, i), style, boxes[0]), styledCost(blocks.slice(i), style, boxes[1]));
          if (!best || (style.leftFirst ? i > best.i : h < best.h)) best = { i, h };
        }
        return best;
      };
      // 나누는 자리는 level 0 항목 앞을 우선하고, 그런 자리가 없을 때만 아무 블록 앞에서 나눈다.
      const best = split(top, fitsLeft) || split(() => true, fitsLeft);
      // Nothing to split -- a last page of one block, or a run that only fits as a whole -- still
      // belongs on the slide: it stays in the left column.
      if (!best) {
        if (!fits(blocks, boxes[0])) return null;
        parts = [blocks];
      } else parts = [blocks.slice(0, best.i), blocks.slice(best.i)];
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
    // Fill per column: what the fit test compares against (boxes[k].h*72*fit). The fill report
    // reads this -- a page is only finished when its last column is full.
    page.fillParts = parts.map((part, k) => styledCost(part, style, boxes[k])
      / (boxes[k].h * 72 * (k === 0 ? leftFit : style.fit)));
    // 여유(style.fit)를 빼고 **상자 자체**에 견준 비율. 1을 넘으면 글이 상자 밖으로 나가 쪽 번호를
    // 덮는다 — 맞춤 시도가 여유 안에서 통과시킨 것이므로 렌더 결과로만 드러난다(generate.js가 경고).
    page.fillRaw = parts.map((part, k) => styledCost(part, style, boxes[k]) / (boxes[k].h * 72));
    page.textParts = parts;
    return page;
  }

  flush(pending, heading, width = 620, capacity = 450) {
    if (pending.length === 0) return;
    if (this.sectionBlocks) this.sectionBlocks.push(...pending);
    const items = pending.map((b) => ({ b, c: this.blockCost(b) }));
    const chunks = [];
    let chunk = [];
    let cost = 0;
    let pageCapacity = capacity;
    // A `###` heading opens the content that follows it, so it never stays as the last line of a
    // slide (production-guide.md "한 장의 메시지"). When the break lands right after a heading, the
    // heading moves to the next slide together with that content.
    const close = () => {
      const carried = chunk.length > 1 && chunk[chunk.length - 1].b.kind === "heading" ? [chunk.pop()] : [];
      const carriedCost = carried.reduce((s, it) => s + it.c, 0);
      chunks.push({ items: chunk, cost: cost - carriedCost, capacity: pageCapacity });
      chunk = carried;
      cost = carriedCost;
      pageCapacity = 450;
    };
    for (let i = 0; i < items.length; i++) {
      const { b, c } = items[i];
      need(c <= Math.max(capacity, 450), "본문 한 문단이 너무 길다. 원고에서 나눠라.");
      // production-guide.md: a short trailing remainder (a line or two) must not become its own
      // continuation slide. If everything left fits within ORPHAN_TOLERANCE of this page's budget,
      // keep it here (the visual panel is placed below the actual text end -- see textEndY).
      const remaining = items.slice(i).reduce((s, it) => s + it.c, 0);
      const keep = remaining <= pageCapacity * ORPHAN_SHARE && cost + remaining <= pageCapacity * ORPHAN_TOLERANCE;
      if (!keep && cost + c > pageCapacity && chunk.length) close();
      chunk.push({ b, c });
      cost += c;
    }
    if (chunk.length) chunks.push({ items: chunk, cost, capacity: pageCapacity });
    // The last slide of a continuation is balanced by rebalanceTail() once the topic's pages are
    // final -- not here, because a visual page may be inserted between these chunks afterwards.
    for (const ch of chunks) {
      const p = this.page(ORIGIN.prose, heading);
      paragraphs(p, 8, ch.items.map((it) => it.b), false);
      if (this.sectionStyle) restyle(shape(p.doc, 8), this.sectionStyle);
      p.textCost = ch.cost;
      p.textBlocks = ch.items.length;
      p.capacity = ch.capacity;
      p.textItems = ch.items.map((it) => it.b);
      p.fillParts = [ch.cost / ch.capacity];
    }
    pending.length = 0;
  }

  // The last slide of a document topic takes whatever the previous one could not: the previous
  // slide is only ever *filled*, never emptied to even out the pair (2026-10-25). The one
  // exception is a last slide that overflows its capacity while the slide before it still has
  // room -- then the two share the remainder instead of leaving a slide a few percent over.
  rebalanceTail(firstIdx, end, heading) {
    if (end - firstIdx < 2) return;
    const last = this.pages[end - 1];
    const prev = this.pages[end - 2];
    const prose = (p) => p && p.textItems && p.textItems.length && !(p.pictures || []).length
      && !p.items.some((it) => ["table", "code", "tree", "source"].includes(it.kind));
    if (!prose(last) || !prose(prev)) return;
    let a = prev.textItems.slice();
    let b = last.textItems.slice();
    const cost = (bs) => bs.reduce((s, x) => s + this.blockCost(x), 0);
    let ca = prev.textCost || cost(a);
    let cb = last.textCost || cost(b);
    if (cb <= 450 || ca >= 450) return;
    while (b.length > 1 && cb > 450 && b[0].kind !== "heading") {
      const mc = this.blockCost(b[0]);
      if (ca + mc > 450) break;
      const moved = b[0];
      b = b.slice(1);
      a = a.concat([moved]);
      ca += mc;
      cb -= mc;
    }
    if (b.length === last.textItems.length) return;
    // paragraphs() appends the page's body item; drop the one from the previous split first, or
    // inspect() compares the shape against a stale copy ("text/code mismatch").
    const rewrite = (page, blocks) => {
      page.items = page.items.filter((it) => it.kind !== "body");
      paragraphs(page, 8, blocks, false);
      if (this.sectionStyle) restyle(shape(page.doc, 8), this.sectionStyle);
      page.textItems = blocks;
    };
    rewrite(prev, a);
    prev.textCost = ca;
    prev.textBlocks = a.length;
    rewrite(last, b);
    last.textCost = cb;
    last.textBlocks = b.length;
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
    return Math.min(this.textHeightPt(lead), cap);
  }

  printedTextHeightPt(blocks) {
    const p = {doc:this.roots[ORIGIN.prose].cloneNode(true),items:[],paragraphSpace:this.paragraphSpace};
    paragraphs(p,8,blocks,false);
    if(this.sectionStyle) restyle(shape(p.doc,8),this.sectionStyle);
    let height=0;
    for(const par of all(shape(p.doc,8),A,"p")) {
      const pr=child(par,A,"pPr");
      const left=Number(pr && pr.getAttribute("marL") || 0)/12700;
      let width=0,size=0,lines=0;
      const available=FULL_TEXT.w*72-14.4-left;
      for(const r of kids(par,A,"r")) {
        const rp=child(r,A,"rPr"), f=Number(rp && rp.getAttribute("sz") || 1800)/100;
        for(const ch of Array.from(r.textContent || "")) {
          // Use the same measured Korean glyph width as styleFit's PowerPoint calibration.
          const w=widthOf(ch,f)*(wide(ch.codePointAt(0))?0.9:1);
          if(width && width+w>available) {lines+=size*1.2;width=0;size=0;}
          width+=w;size=Math.max(size,f);
        }
      }
      const gap=side=>Number(child(child(pr,A,side),A,'spcPts')?.getAttribute('val')||0)/100;
      height+=lines+size*1.2+gap('spcBef')+gap('spcAft');
    }
    return height;
  }

  // How far down the next block starts (pt) after a run of text: the box is sized generously so
  // nothing clips, but the padding inside that estimate is not drawn, so what follows does not wait
  // for it (see textEndIn). Box heights keep using textHeightPt; only advances use this.
  textAdvancePt(blocks) {
    if (!blocks.length) return 0;
    if (this.sectionStyle && this.sectionStyle.uniform) return this.textHeightPt(blocks);
    return Math.max(BLOCK_GAP_PT, this.printedTextHeightPt(blocks));
  }

  // Height (pt) a run of text blocks needs in a full-width text box on a table page.
  textHeightPt(blocks) {
    if (this.sectionStyle && this.sectionStyle.uniform) return styledCost(blocks, this.sectionStyle, FULL_TEXT) / this.sectionStyle.fit;
    return blocks.length ? this.printedTextHeightPt(blocks) : 0;
  }

  // Adjacent paragraphs share their spacing in PowerPoint. Use the line-based advance plus
  // the outer spacing for a trailing stack; pagination slack is not another printed line.
  stackedTextHeightPt(blocks) {
    if (this.sectionStyle && this.sectionStyle.uniform) return this.textHeightPt(blocks);
    return this.textHeightPt(blocks);
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
  // 장에서 `top`보다 위에 있는 내용이 끝나는 자리(인치). 도식을 위로 올릴 때의 한계다.
  contentAbove(page, top) {
    const fixed = new Set(["2", "5", "6", "7"]);
    let bottom = 1.05;
    for (const e of children(first(page.doc, P, "spTree"))) {
      const nv = first(e, P, "cNvPr");
      if (!nv || fixed.has(nv.getAttribute("id"))) continue;
      if (all(e, P, "ph").some((ph) => ph.getAttribute("type") === "sldNum")) continue;
      const off = first(e, A, "off"), ext = first(e, A, "ext");
      if (!off || !ext) continue;
      const y0 = parseInt(off.getAttribute("y"), 10) / EMU;
      const isTable = e.localName === "graphicFrame";
      const y1 = isTable && page.tableBottom != null ? page.tableBottom : y0 + parseInt(ext.getAttribute("cy"), 10) / EMU;
      // 템플릿에서 물려받아 좌표가 없는 상자는 건너뛴다 — 하나라도 NaN이면 자리 계산이 전부 깨진다.
      if (!Number.isFinite(y1) || y1 > top + 0.01) continue;
      if (!String(text(e) || "").trim() && !isTable) continue;
      bottom = Math.max(bottom, y1);
    }
    return bottom;
  }

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
    // The title's own box, plus a line between it and the diagram -- the title must read as the
    // diagram's heading, not as a label stuck on its top edge.
    const H = CAPTION_LEAD + CAPTION_LINE + CAPTION_GAP;
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
      return this.drawCaption(page, picture.caption, { x: 0.4, y: y + CAPTION_LEAD, w: 2 * (x - 0.4) + w, h: CAPTION_LINE });
    }
    // A diagram in the right half beside the text: the title stays over the diagram's own column
    // (centered on it, inside the right half), never across the text on the left.
    if (page.visualLayout === "side") {
      const scale = Math.max(0.5, Math.min(1, (h - H) / h));
      picture.bounds = { x: x + (w - w * scale) / 2, y: y + H, w: w * scale, h: h * scale };
      const cx = x + w / 2, half = Math.min(cx - 5.85, 9.6 - cx);
      return this.drawCaption(page, picture.caption, { x: cx - half, y: y + CAPTION_LEAD, w: 2 * half, h: CAPTION_LINE });
    }
    // The table/code below also gets a little air from the diagram's bottom edge.
    if (below && this.shiftBelow(page, y, H + 0.12)) {
      picture.bounds = { x, y: y + H, w, h };
      return this.drawCaption(page, picture.caption, { x: 0.4, y: y + CAPTION_LEAD, w: 9.2, h: CAPTION_LINE });
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
    // 제목이 붙으면 도식은 제목 높이만큼 아래로 내려간다. 그만큼 아래가 모자라면 그림을 줄이기
    // 전에 **위로 올린다** — 글이 끝난 자리와 도식 사이의 여백을 둔 채 아래만 쪽 번호에 닿는
    // 장이 있었다(2026-11-04). 올릴 수 있는 한계는 바로 위 글 상자의 아래 끝이다.
    if (!below) {
      const bottom = this.contentBottomY();
      const ceiling = this.contentAbove(page, y) + BLOCK_GAP;
      const lift = Math.min(Math.max(0, y + H + h - bottom), Math.max(0, y - ceiling));
      y -= lift;
    }
    const room = below ? h - H : Math.min(h, this.contentBottomY() - y - H);
    const scale = Math.max(0.5, Math.min(1, room / h));
    x += (w - w * scale) / 2;
    w *= scale; h *= scale;
    const id = this.cloneShape(page, 13);
    const sh = shape(page.doc, id);
    setShapeBounds(sh, { x: 0.4, y: y + CAPTION_LEAD, w: 9.2, h: CAPTION_LINE });
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
  cloneShape(page, id, origin) {
    let src;
    try { src = shape(origin == null ? page.doc : this.roots[origin], id); } catch (e) { src = null; }
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
      // 표 장처럼 원형에 코드 상자(31)가 없는 장에서는 빈 상자를 쓰지 않고 코드 원형에서 빌려 온다.
      let own = false;
      try { shape(page.doc, 31); own = true; } catch (e) { own = false; }
      const id = ci === 0 && own && !page.items.some((it) => it.id === 31) ? 31 : this.cloneShape(page, 31);
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
          const latin = el(page.doc, A, "latin", "typeface", "맑은 고딕");
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
    // 표 아래에 쌓는 코드는 10pt 한 단으로 읽히는 것만 둔다. 글자를 줄이거나 두 단으로 접어
    // 끼워 넣으면 표와 코드가 둘 다 작아진다 — 그럴 때는 코드가 제 장으로 간다.
    if (page.items.some((it) => it.kind === "table") && (plan.size !== 10 || plan.cols.length > 1)) return false;
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
        if (this.sectionStyle && this.sectionStyle.uniform) restyle(shape(page.doc, leadId), this.sectionStyle);
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
        // Try the whole code plus the text that follows it first, then the code alone (the text
        // then takes the next slide). Splitting the code and repeating the diagram is worse than
        // moving the trailing text: production-guide.md "Visual layout 및 가독성".
        const attempt = (reserveTrail) => {
          for (const step of png ? STEPS : [1]) {
            const at = png ? place(step) : null;
            const codeTop = at && stacked ? top + at.bounds.h + GAP : top;
            const width = at && !stacked ? W - at.box.w - GAP : W;
            const avail = (BOTTOM - codeTop) * 72 - (reserveTrail && opts.trailPt ? opts.trailPt + 8 : 0);
            const plan = planCode(remaining, width * 72, avail);
            if (plan) return { plan, at };
          }
          return null;
        };
        const chosen = attempt(true) || attempt(false);
        if (chosen) { ({ cols, size, lineH } = chosen.plan); placed = chosen.at; }
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

  gherkin(block,heading,lead) {
    const p=this.page(ORIGIN.prose,heading),top=FULL_TEXT.y;
    const leadH=lead.length?this.textHeightPt(lead):0;
    paragraphs(p,8,lead,false);
    if(lead.length)setShapeBounds(shape(p.doc,8),{...FULL_TEXT,h:leadH/72});
    const id=this.cloneShape(p,8),sh=shape(p.doc,id),y=top+(leadH?leadH+8:0)/72;
    const lines=block.text.split('\n'),available=FULL_TEXT.w*72-14.4-BULLET_LEVELS[1].marL/12700;
    const h=lines.reduce((sum,line)=>sum+Math.max(1,Math.ceil(widthOf(line,12)/available))*12*1.2+6,0);
    need(y+h/72<=this.contentBottomY(),`Gherkin이 한 장에 들어가지 않는다: ${heading}`);
    setShapeBounds(sh,{...FULL_TEXT,y,h:h/72});setText(sh,block.text);
    const bp=child(body(sh),A,'bodyPr');for(const k of ['lIns','rIns'])bp.setAttribute(k,'91440');for(const k of ['tIns','bIns'])bp.setAttribute(k,'0');
    for(const par of kids(body(sh),A,'p')) {
      const value=paragraph(par),pr=spacing(par,3,3,null);
      pr.setAttribute('marL',String(BULLET_LEVELS[1].marL));pr.setAttribute('indent','0');pr.setAttribute('algn','l');
      for(const old of children(pr).filter(e=>/^bu/.test(e.localName)))pr.removeChild(old);
      pr.appendChild(el(p.doc,A,'buNone'));rich(par,value,12,false,true,new Set());
    }
    p.items.push({id,kind:block.meta?.language==='gherkin'?'gherkin':'input',text:block.text,rows:[]});this.codes.push({source:block.text,parts:[block.text]});
    p.tableBottom=y+h/72;return p;
  }

  // Free band (pt) left below whatever is already stacked on a table page.
  roomBelowPt(page) {
    // The short-tail allowance uses at most 8pt of the 10.8pt footer safety band. It never
    // crosses the page-number box and avoids a one-line continuation caused by rounding.
    return (PAGE_NUM_Y - 0.15) * 72 + 8 - (page.tableBottom * 72 + TABLE_TEXT_GAP_PT);
  }

  // 앞 장의 표 아래에 들어가는 앞부분만 쌓고 그만큼을 `blocks`에서 덜어낸다. 통째로 넘기면 표
  // 아래가 200pt 가까이 비는 장이 생긴다(production-guide.md 「표 뒤의 글은 들어가는 만큼 그 장을
  // 채운다」). 하위 bullet은 제 상위 bullet과, 소제목은 뒤 내용과 같은 장에 둔다.
  // 옮긴 블록 수를 돌려주며 `blocks`를 그만큼 앞에서 자른다.
  stackPrefixBelow(page, blocks) {
    if (!page || page.tableBottom == null || !blocks.length) return 0;
    const room = this.roomBelowPt(page);
    if (this.stackedTextHeightPt(blocks) <= room) {
      const n = blocks.length;
      this.appendTextBelow(page, blocks.splice(0, n));
      return n;
    }
    let cut = 0;
    for (let n = 1; n < blocks.length; n++) {
      // Unbulleted examples and quotations continue the list/group immediately above.
      // Keep the complete chain together, including its introductory sentence.
      if (blocks[n].meta && blocks[n].meta.noGlyph) continue;
      if (blocks[n - 1].kind === "heading" || (blocks[n-1].meta && blocks[n-1].meta.groupHead)) continue;
      if (blocks[n].depth > blocks[n - 1].depth) continue;
      if (this.stackedTextHeightPt(blocks.slice(0, n)) > room) break;
      cut = n;
    }
    if (cut > 0) this.appendTextBelow(page, blocks.splice(0, cut));
    return cut;
  }

  // Stack text below the content already on a table page (a second lead-style text box).
  appendTextBelow(page, blocks) {
    const h = this.stackedTextHeightPt(blocks);
    const id = this.cloneShape(page, 13);
    setShapeBounds(shape(page.doc, id), { x: 0.4, y: page.tableBottom + TABLE_TEXT_GAP_PT / 72, w: 9.2, h: h / 72 });
    paragraphs(page, id, blocks, false);
    if (this.sectionStyle && this.sectionStyle.uniform) restyle(shape(page.doc, id), this.sectionStyle);
    page.tableBottom += TABLE_TEXT_GAP_PT / 72 + this.textAdvancePt(blocks) / 72;
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
        // 칸의 글은 **세로 가운데**에 둔다. 원형 슬라이드의 값에 기대지 않고 여기서 정하며, 위아래
        // 여백을 같게 맞춘다 — 위 여백만 있으면 가운데 맞춤이어도 글이 아래로 내려가 보인다
        // (production-guide.md 「표의 행 높이와 열 너비」).
        // 원형에 tcPr이 없는 칸이 하나라도 있으면 그 칸만 맞춤 없이 빠지므로 없으면 만들어 붙인다.
        let tcPr = child(cell, A, "tcPr");
        if (!tcPr) {
          tcPr = el(page.doc, A, "tcPr");
          cell.appendChild(tcPr);
        }
        tcPr.setAttribute("anchor", "ctr");
        if(this.s03Profile)for(const k of ['marL','marR','marT','marB'])tcPr.setAttribute(k,'54000');
        else {tcPr.setAttribute("marT", String(CELL_MAR_V));tcPr.setAttribute("marB", String(CELL_MAR_V));}
        row.appendChild(cell);
      }
      tbl.appendChild(row);
    }
    const idAttr = first(gf, P, "cNvPr").getAttribute("id");
    page.items.push({ id: parseInt(idAttr, 10), kind: "table", text: "", rows: group });
    const contentHeightPt = group.reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
    // 틀의 높이도 실제 표 높이로 맞춘다. 원형의 305pt를 그대로 두면 cy를 믿는 뷰어가 남는 높이를
    // 행에 나눠 주어 표가 늘어나고 글이 제 행의 가운데에서 벗어난다(2026-10-31).
    child(gfXf, A, "ext").setAttribute("cy", String(Math.round(contentHeightPt * EMU / 72)));
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
    const m = splitCaption(mid);
    const used = (lead.length ? this.textHeightPt(lead) + BLOCK_GAP_PT : 0)
      + (m.lead.length ? this.textHeightPt(m.lead) + BLOCK_GAP_PT : 0)
      + (m.caption ? CAPTION_H : 0) + tableH + BLOCK_GAP_PT;
    const room = band - used;
    const natural = naturalSize(png, TARGET_PT);
    // The legend shares the slide only while it still reads at MIN_PT (production-guide.md).
    const needH = Math.min(natural.h * 72 * MIN_PT / TARGET_PT, natural.h * 72 * (TABLE_BAND_CX / 72) / natural.w);
    return room >= Math.max(0.9 * 72, needH) ? room : 0;
  }

  // Append a whole (single-group) table, with its lead text, below the content already on a
  // table page. Returns false (nothing changed) when it doesn't fit.
  appendTableBelow(page, block, leadIn, widthsOverride, continueHeading = null) {
    const { lead, caption } = splitCaption(leadIn);
    const widths = widthsOverride || columnWidths(block.rows, block.rows[0].length);
    const groups = this.tableGroups(block.rows, widths);
    if (groups.length !== 1 && !continueHeading) return false;
    const tableH = groups[0].reduce((sum, row) => sum + this.rowHeight(row, widths), 0);
    const leadH = lead.length ? this.textHeightPt(lead) + BLOCK_GAP_PT : 0;
    const capH = caption ? CAPTION_H : 0;
    let rows = groups[0], remaining = [];
    if (leadH + capH + tableH > this.roomBelowPt(page) || groups.length !== 1) {
      if (!continueHeading) return false;
      // Mixed documents flow in source order. Fill the current page with as many whole rows
      // as fit, then repeat the header on the next page instead of moving the entire table.
      const available = this.roomBelowPt(page) - leadH - capH;
      let used = this.rowHeight(block.rows[0], widths), count = 1;
      while (count < block.rows.length && used + this.rowHeight(block.rows[count], widths) <= available) {
        used += this.rowHeight(block.rows[count], widths);
        count++;
      }
      if (count === 1) return false; // Never strand a header without its first data row.
      rows = block.rows.slice(0, count);
      remaining = block.rows.slice(count);
    }
    if (lead.length) this.appendTextBelow(page, lead);
    let yPt = page.tableBottom * 72 + BLOCK_GAP_PT;
    if (caption) yPt = this.tableCaption(page, caption, yPt);
    const id = this.cloneShape(page, 11);
    this.fillTable(page, shape(page.doc, id), rows, widths, yPt);
    if (remaining.length) {
      const lead = caption ? [{ kind: "text", text: "", rows: [], depth: 0, meta: { caption } }] : [];
      this.table({ ...block, rows: [block.rows[0], ...remaining] }, continueHeading, lead, 160, { widths });
    }
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
    need(cols >= 2, "표는 2열 이상이어야 한다.");
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
          if (this.sectionStyle && this.sectionStyle.uniform) restyle(shape(page.doc, 13), this.sectionStyle);
          yPt += this.textAdvancePt(lead) + TABLE_TEXT_GAP_PT;
        }
        if (opts.visual) {
          // A legend-style visual between the lead text and the table (same slide).
          const box = { x: TABLE_BAND_X / 72, y: yPt / 72, w: TABLE_BAND_CX / 72, h: opts.visualBudgetPt / 72 };
          const bounds = fitTarget(box, opts.visual);
          bounds.y = yPt / 72;
          page.pictures = [{ ...opts.visual, bounds }];
          page.visualLayout = "table-leading";
          yPt += bounds.h * 72 + BLOCK_GAP_PT;
          if (opts.mid && opts.mid.length) {
            const midH = this.textHeightPt(opts.mid);
            const id = this.cloneShape(page, 13);
            setShapeBounds(shape(page.doc, id), { x: 0.4, y: yPt / 72, w: 9.2, h: midH / 72 });
            paragraphs(page, id, opts.mid, false);
            yPt += this.textAdvancePt(opts.mid) + BLOCK_GAP_PT;
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
      // 표 아래의 빈 띠에 코드가 쌓일 수 있게 코드 단을 본문 폭으로 열어 둔다. 이것이 없으면
      // 표 다음의 코드는 늘 새 장을 열어, 표만 있는 장과 코드만 있는 장이 둘 다 헐거워졌다.
      page.codeArea = { x: 0.4, w: 9.2 };
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

  // Fills the TOC column, reusing the template's own placeholder (id 10) at the given box. 한 열
  // 배치이므로 호출은 id 10 하나뿐이고, 다른 id를 주면 그 상자를 shape 10에서 복제한다.
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

  // 목차 한 장에 담기는 항목은 **실제 줄바꿈 높이**로 정한다 -- 제목이 두 줄이 되는 항목은 두 줄
  // 높이를 쓰므로, 개수로 세면 아래가 잘린다. 넘치는 항목은 같은 한 열 모양의 이어지는 목차 장으로
  // 내려가며, 장 번호는 긴 topic과 같은 "(N/M)"이다.
  tocChunks(items) {
    const width = TOC_COLUMN_XFRM.cx / EMU_PT - BULLET_LEVELS[0].marL / EMU_PT;
    const height = (item) => estimate(item.text, width, TOC_FONT_SIZE) * TOC_LINE_PT + TOC_SPACING_PT;
    const budget = TOC_COLUMN_XFRM.cy / EMU_PT;
    const chunks = [[]];
    let used = 0;
    for (const item of items) {
      const h = height(item);
      if (used + h > budget && chunks[chunks.length - 1].length) { chunks.push([]); used = 0; }
      chunks[chunks.length - 1].push(item);
      used += h;
    }
    return chunks;
  }

  renderToc(toc, session) {
    const chunks = this.tocChunks(toc);
    for (let ci = 0; ci < chunks.length; ci++) {
      const suffix = chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : "";
      const p = this.page(ORIGIN.toc, tocSessionName(session) + " 목차" + suffix);
      // Per direct instruction: the TOC slide does not carry the top-right session name (it is
      // not a "일반 슬라이드" in the production-guide.md sense -- session name is topic-slide-only).
      p.isToc = true;
      this.tocColumn(p, 10, TOC_COLUMN_XFRM, chunks[ci]);
    }
  }

  // 표지 — 과정명만 가운데에 둔 첫 장(production-guide.md 「표지와 과정 목차」). 제목도 우측 상단
  // 세션명도 두지 않는다. 과정의 첫 세션 덱에만 있다.
  renderCover(name) {
    const p = this.page(ORIGIN.prose, "");
    p.isCover = true;
    const id = this.cloneShape(p, 13);
    const sh = shape(p.doc, id);
    setShapeBounds(sh, COVER_TEXT);
    const tb = body(sh);
    for (const old of kids(tb, A, "p")) tb.removeChild(old);
    const par = el(p.doc, A, "p");
    tb.appendChild(par);
    child(par, A, "pPr") || par.insertBefore(el(p.doc, A, "pPr"), par.firstChild);
    child(par, A, "pPr").setAttribute("algn", "ctr");
    runParen(par, name, COVER_PT, true);
    return p;
  }

  // 과정 목표 — 과정 목차 다음, 세션 목차 바로 앞 장이다. 덱은 넓은 것에서 좁은 것으로 같은
  // 리듬을 두 번 탄다 — 과정의 목차와 목표, 그다음 세션의 목차와 목표(production-guide.md
  // 「표지·과정 목차·과정 목표」). 내용은 `course-design.md`의 「과정 목표 슬라이드」이며
  // renderer가 줄이거나 바꾸지 않는다. 과정의 첫 세션 덱에만 있다.
  renderCourseGoal(course) {
    const blocks = [];
    if (course.goal.lead) blocks.push({ kind: "text", text: course.goal.lead, depth: 0 });
    for (const g of course.goal.goals) blocks.push({ kind: "bullet", text: g, depth: 0 });
    const from = this.pages.length;
    this.flush(blocks, course.name + " 목표");
    for (const p of this.pages.slice(from)) p.isCourseGoal = true;
    return this.pages[from];
  }

  // 과정 목차 — 과정의 세션 전체를 세션 목차와 같은 모양으로 보이는 둘째 장. 표지와 함께 과정의
  // 첫 세션 덱에만 있고, 항목은 `course-design.md`의 세션 목록이다.
  renderCourseToc(course) {
    const chunks = this.tocChunks(course.sessions.map((s) => ({ text: s.name })));
    const first = this.pages.length;
    for (let ci = 0; ci < chunks.length; ci++) {
      const suffix = chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : "";
      const p = this.page(ORIGIN.toc, course.name + " 목차" + suffix);
      p.isToc = true;
      this.tocColumn(p, 10, TOC_COLUMN_XFRM, chunks[ci]);
    }
    return this.pages[first];
  }

  async render(sections, outputPath, toc, course) {
    await this.compose(sections, toc, course);
    return this.write(outputPath);
  }

  // Composes one session's slides into this.pages. A bundle calls it once per session and writes
  // once at the end (production-guide.md 「묶음 덱」).
  async compose(sections, toc, course) {
    // Each session composes with its own identifier set, exactly as its own deck does.
    this.names = new Set();
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
      // 과정의 첫 세션 덱만 표지와 과정 목차로 시작한다 — 뒤 세션은 자기 목차가 첫 장이다.
      // 과정 밖의 덱(옆에 course-design.md가 없다)에는 둘 다 없다.
      if (course && /^01\./.test(String(this.session))) {
        this.renderCover(course.name);
        if (course.sessions.length) this.renderCourseToc(course);
        if (course.goal) this.renderCourseGoal(course);
      }
      this.renderToc(toc, this.session);
    }

    // A document marker inside one explicit page segment does not restyle the author's
    // explanation or review table in neighbouring segments of the same numbered topic.
    const scopedGroups = new Map();
    sections = sections.flatMap(s => {
      const segments=[[]];
      for(const b of s.blocks) { if(b.kind==="pagebreak") segments.push([]); else segments[segments.length-1].push(b); }
      const document = bs => bs.some(b=>b.kind==="text" && /^\*\*문서 형식(?: — 10pt)?\*\*$/.test(b.text.trim()));
      if(!segments.slice(1).some(document) || segments.every(document)) return [s];
      const key={};scopedGroups.set(key,[]);
      return segments.map((blocks,i)=>({...s,blocks,notes:i===0?s.notes:[],scopeKey:key,scopedDocument:document(blocks)}));
    });

    for (let section of sections) {
      // A table-of-contents group with no body of its own ("## 05. 연관" followed directly by its
      // sub-topics) makes no slide: its sub-topics carry it as their second title line.
      const next = sections[sections.indexOf(section) + 1];
      if (!section.group && section.blocks.length === 0 && next && next.group === section.title) continue;
      const firstIdx = this.pages.length;
      this.sectionFirst = firstIdx;
      if ((section.scopedDocument || (section.appendix && section.verbatimResponse))
        && (section.scopedDocument || this.s03Profile || !section.blocks.some(b=>['mermaid','plantuml','svg','chart'].includes(b.kind)))
        && section.blocks.every(b=>["text","heading","bullet","table","pagebreak","mermaid","plantuml","svg","chart"].includes(b.kind))) {
        const ten=section.scopedDocument||section.blocks.some(b=>b.kind==='text'&&b.text.trim()==='**문서 형식 — 10pt**');
        const style={...ANSWER_STYLE,text:ten?10:12,heading:ten?10:14,levels:ten?[10,10,10]:[12,11,10],uniform:true,fit:1,leftFit:1,space:3,expl:L=>L,paren:L=>L,hang:true,responseRole:section.appendix?'answer':'demo',tablePt:this.s03Profile&&(section.appendix||/^11\. LLM 초안 검토$/.test(section.title))?8:10};
        const mixed=section.blocks.some(b=>['mermaid','plantuml','svg','chart'].includes(b.kind)||(b.kind==='table'&&b.rows[0].length>4));
        const pages=mixed?await this.columnVisualDocumentPages(section.blocks,section.title,style,!ten):this.columnDocumentPages(section.blocks,section.title,style,!ten);
        pages.forEach((p,i)=>{p.appendix=Boolean(section.appendix);if(section.scopeKey)scopedGroups.get(section.scopeKey).push(p);if(pages.length>1)p.heading+=` (${i+1}/${pages.length})`+(section.group?'\n'+section.group:'');else if(section.group)p.heading+='\n'+section.group;});
        if(pages.length && section.notes.length)pages[0].notes=section.notes;
        continue;
      }
      // "**주석**" and the paragraph after it: an 8pt footnote at the bottom of every slide of the
      // topic, kept out of the body flow (session-authoring-guide.md "주석", production-guide.md
      // "주석").
      const noteAt = section.blocks.findIndex((b) => b.kind === "text" && /^\*\*주석\*\*$/.test(b.text.trim()));
      let footnote = null;
      // "**문서 형식**": a document shown as one (e.g. a use-case specification) -- the topic is set
      // like a text answer, two columns at 14/12/11pt on one slide (production-guide.md "문서 형식").
      const docAt = section.blocks.findIndex((b) => b.kind === "text" && /^\*\*문서 형식(?: — 10pt)?\*\*$/.test(b.text.trim()));
      const docLayout = docAt >= 0;
      const documentStyle = docLayout && section.blocks[docAt].text.includes("10pt")
        ? { ...ANSWER_STYLE, fit: 0.9, leftFit: 0.9, uniform: true, text: 10, levels: [10, 10, 10], expl: () => 10, paren: () => 10, space: 3, documentIndent: true, leftFirst: true } : ANSWER_STYLE;
      if (docLayout) section = { ...section, blocks: section.blocks.filter((b, i) => i !== docAt && b.kind !== "pagebreak") };
      if(docLayout && documentStyle.uniform) {
        const intro=section.blocks.find(b=>b.kind!=='heading');
        if(intro?.kind==='text')documentStyle.introText=plain(intro.text);
      }
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
      this.sectionStyle = docLayout && documentStyle.uniform ? documentStyle : visuals.length
        ? (docLayout ? documentStyle : (isAnswer(section.title) || section.verbatimResponse) ? ANSWER_STYLE : null)
        : null;
      const renderedVisuals = await Promise.all(visuals.map(async (b) => {
        // A render failure names the topic and the diagram (production-guide.md "자동 검사").
        const where = `"${section.title}"의 ${visualCaption(b) ? `"${visualCaption(b)}"` : b.kind + " 도식"}`;
        const png = await (b.kind === "mermaid" ? renderMermaid({ source: b.text })
          : b.kind === "plantuml" ? renderPlantUml({ kind: b.meta && b.meta.uml, source: b.text })
          : b.kind === "svg" ? renderSvg(b.text)
          : renderChart(b.text)).catch((e) => { throw new Error(where + ": " + e.message); });
        // viewBox 밖의 내용은 그려지지 않는다. 배치가 아니라 원본이 잘린 것이라 슬라이드를 봐야
        // 드러나므로 여기서 경고한다(production-guide.md 「Visual layout 및 가독성」).
        const over = b.kind === "svg" ? outsideViewBox(b.text) : null;
        if (over) {
          const parts = [];
          if (over.bottom > 0.5) parts.push(`아래로 ${Math.ceil(over.bottom)}`);
          if (over.right > 0.5) parts.push(`오른쪽으로 ${Math.ceil(over.right)}`);
          this.layoutWarnings.push(`${where}: 내용이 viewBox를 ${parts.join("·")} 넘어 잘린다. viewBox를 늘리거나 내용을 줄인다.`);
        }
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
      // A single diagram below the text leaves the text whatever the diagram does not need at 8pt
      // (its natural height, narrowed to the band width, plus its title; production-guide.md lets a
      // diagram shrink from 10pt before the slide is split): the governing message and a quotation
      // above it then stay on one slide instead of the quotation being pushed onto a continuation
      // slide behind the diagram. Never less than the layout bucket.
      const visualCapacity = (() => {
        if (renderedVisuals.length !== 1) return layout.capacity;
        const png = renderedVisuals[0];
        const nat = naturalSize(png, 8);
        const bandW = FULL_TEXT.w - 0.2;
        const h = nat.h * Math.min(1, bandW / nat.w) + (png.caption ? 0.28 : 0) + 0.15;
        const textH = this.contentBottomY() - FULL_TEXT.y - h;
        return Math.max(layout.capacity, Math.floor(fullCapacity * Math.max(0, textH) / FULL_TEXT.h));
      })();
      const capacityFor = (s) => (sideSegs.has(s) ? SIDE_CAPACITY : visualSegs.has(s) ? visualCapacity : fullCapacity);
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
      // The capacity a batch of pending text started with. A diagram's reserve applies to the text
      // written before it; the text after it gets the full body area back (see the visual branch).
      let pendingCapacity = capacity;
      const flushPending = () => {
        if (open && pending.length) this.stackPrefixBelow(open, pending);
        const before = this.pages.length;
        this.flush(pending, section.title, layout.width, pendingCapacity);
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
        const margin = BLOCK_GAP;
        const y = page.tableBottom + margin;
        const bounds = fitTarget({ x: TABLE_BAND_X / 72, y, w: TABLE_BAND_CX / 72, h: PAGE_NUM_Y - margin - y }, png, "top");
        page.pictures = (page.pictures || []).concat([{ ...png, bounds }]);
        page.visualLayout = "table-trailing";
        page.tableBottom = bounds.y + bounds.h;
      };
      const claimVisualPage = (vi) => {
        const before = this.pages.length;
        this.flush(pending, section.title, layout.width, pendingCapacity);
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
      // 원고에서 이 블록 다음에 오는 **내용** 블록. 본문에 그려지지 않는 표식 줄(인용문 표식,
      // 도식 표식)은 건너뛴다 -- 아래 루프가 같은 줄들을 건너뛰기 때문이다.
      const nextContentBlock = (i) => {
        for (let k = i + 1; k < section.blocks.length; k++) {
          const nb = section.blocks[k];
          const t = String(nb.text || "").trim();
          if (nb.kind === "text" && (QUOTE_MARKER.test(t) || (visuals.length && VISUAL_MARKER.test(t)))) continue;
          return nb;
        }
        return null;
      };
      // 그룹 대표명: 줄 전체가 굵고, 뒤에 그 그룹에 속한 내용이 있다. `###`가 열리거나 topic이
      // 끝나면 소속이 없으므로 대표명이 아니다.
      const isGroupHead = (block, i) => {
        if (block.kind !== "text" || !GROUP_HEAD.test(block.text.trim())) return false;
        const next = nextContentBlock(i);
        return Boolean(next) && next.kind !== "heading" && next.kind !== "pagebreak";
      };
      // 독립 안내 문장: 목록을 예고하는 한 문장 바로 뒤에 같은 단의 목록이 온다.
      const isListLead = (block, i) => {
        if (block.kind !== "text" || (block.depth || 0) !== 0) return false;
        if (!LIST_LEAD.test(String(block.text).replace(/\*\*/g, "").trim())) return false;
        const next = nextContentBlock(i);
        return Boolean(next) && next.kind === "bullet" && (next.depth || 0) === 0;
      };
      for (let blockIndex = 0; blockIndex < section.blocks.length; blockIndex++) {
        const b = section.blocks[blockIndex];
        if (visuals.length && b.kind === "text" && VISUAL_MARKER.test(b.text.trim())) continue;
        if (b.kind === "text" && QUOTE_MARKER.test(b.text.trim())) {
          quoteKind = /인용문/.test(b.text) ? "quote" : "anchor";
          continue;
        }
        // Visual source is never body content -- it is attached as a picture after the topic's
        // prose pages are composed (or, for a multi-visual topic, right here -- each visual
        // claims the page its own preceding caption text just flushed onto).
        if (["mermaid", "plantuml", "chart", "svg"].includes(b.kind)) {
          // Only text may stand between a diagram and the code it maps
          // (production-guide.md "소스 코드"). A `###` heading opens a new sub-topic, so a diagram
          // above it belongs to the previous sub-topic, not to the code below -- pairing across the
          // heading repeated that diagram on every slide of an unrelated code block.
          let j = blockIndex + 1;
          while (j < section.blocks.length && ["text", "bullet"].includes(section.blocks[j].kind)) j++;
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
          // Every diagram of the topic is now on its slide: the text that follows gets the whole
          // body area back instead of reserving room for a diagram that is already placed -- the
          // reserve left the next text slide at a third of its height (2026-10-25).
          if (visualIndex >= visuals.length) capacity = fullCapacity;
          continue;
        }
        if (["text", "heading", "bullet"].includes(b.kind)) {
          let block = quoteKind ? { ...b, meta: { ...(b.meta || {}), [quoteKind]: true } } : b;
          if(/^05\. 사용자 스토리/.test(section.title) && /^>\s/.test(block.text))
            block={...block,meta:{...(block.meta||{}),alignBody:true,storyPattern:true}};
          const caption = block.kind === "text" && TABLE_CAPTION.exec(block.text.trim());
          if (caption) {
            // "**표 — 제목**": an 11pt bold title right above the table (it joins the table's lead).
            block = { ...block, meta: { ...(block.meta || {}), caption: caption[1].trim() } };
          } else if (block.kind === "heading") {
            // A "###" sub-heading: bold, no glyph, indented; what follows keeps its own level
            // (session-authoring-guide.md "한 장의 메시지").
            contentSeen = true;
            headingDepthBoost = 0;
          } else if (block.kind === "text") {
            // 거버닝 메시지는 topic을 **여는** 문단(또는 topic을 여는 인용)뿐이다. `###` 소제목이
            // 먼저 오면 그 아래 문단은 소제목이 여는 그룹에 속하므로 보조 bullet이다(2026-11-15).
            const isQuote = block.meta && (block.meta.quote || block.meta.anchor);
            if (!governingMessageSeen && !contentSeen) {
              governingMessageSeen = true;
              leadBlock = block;
            } else if (isGroupHead(block, blockIndex) || isListLead(block, blockIndex)) {
              // 그룹 대표명과 독립 안내 문장은 승격하지 않는다 -- text 경로가 들여쓰기 0·글머리표
              // 없음·18pt·원고의 **bold**를 그대로 그린다(paragraphs.js).
              if(isGroupHead(block,blockIndex)) {
                block={...block,kind:"bullet",depth:0,meta:{...(block.meta||{}),groupHead:true,noGlyph:true,noHang:true}};
                headingDepthBoost=0;
              }
            } else if (isQuote || BLOCKQUOTE_LINE.test(block.text.trim())) {
              // 인용문과 인용된 요청: 한 단계 들여쓰고 글머리표와 내어쓰기를 없앤다 -- 줄바꿈된
              // 둘째 줄도 첫 줄과 같은 자리에서 시작한다(production-guide.md 「인용문」).
              block = { ...block, kind: "bullet", depth: Math.min(2, block.depth + headingDepthBoost), meta: { ...(block.meta || {}), noGlyph: true, noHang: true } };
            } else if (!SPOKEN_LINE.test(block.text.trim())) {
              block = { ...block, kind: "bullet", depth: block.depth + headingDepthBoost };
            }
            contentSeen = true;
          } else if (block.kind === "bullet") {
            contentSeen = true;
            block = { ...block, depth: block.depth + headingDepthBoost };
          }
          if (!pending.length) pendingCapacity = capacity;
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
            if (multiVisual) claimVisualPage(d.vi); else this.flush(pending, section.title, layout.width, pendingCapacity);
            pending = mid;
          }
          const below = () => this.appendTableBelow(open, b, pending, widths, docLayout && documentStyle.uniform ? section.title : null);
          if (open && below()) {
            pending = [];
            open = this.pages[this.pages.length - 1];
            governingSeen = true;
            continue;
          }
          // 표가 앞 장에 들어가지 않으면 그 앞의 글이 통째로 이 표의 lead가 되어, 앞 장은 표 아래를
          // 비운 채 끝난다. 표 제목만 표와 함께 보내고 나머지 가운데 들어가는 앞부분은 앞 장의 표
          // 아래에 쌓는다. 그러고 나면 줄어든 lead와 함께 표까지 앞 장에 들어가기도 한다
          // (production-guide.md 「표 페이지 쌓기」, 2026-11-05).
          if (open && pending.length) {
            const head = splitCaption(pending);
            const captionBlock = head.caption ? pending[pending.length - 1] : null;
            if (head.lead.length && this.stackPrefixBelow(open, head.lead)) {
              pending = head.lead.concat(captionBlock ? [captionBlock] : []);
              if (below()) {
                pending = [];
                open = this.pages[this.pages.length - 1];
                governingSeen = true;
                continue;
              }
            }
          }
          // The lead budget isn't a fixed constant -- it's whatever the page's vertical band has
          // left over once THIS table's own rows are accounted for (rows are usually well under
          // the 365pt group-split ceiling, so small tables leave real room above them). Capping at
          // a flat 160pt regardless of table size left short tables (3-6 rows) stranding their
          // preceding paragraph on its own near-empty page even though the band plainly had space.
          const tableWidths = columnWidths(b.rows, b.rows[0].length);
          const tableContentH = b.rows.reduce((sum, row) => sum + this.rowHeight(row, tableWidths), 0);
          const trailing=[];
          for(let j=blockIndex+1;j<section.blocks.length;j++) {
            const t=section.blocks[j];
            if(!['text','bullet'].includes(t.kind) || GROUP_HEAD.test(String(t.text).trim()))break;
            trailing.push(t);
          }
          const tailPt=trailing.length?this.stackedTextHeightPt(trailing)+TABLE_TEXT_GAP_PT:0;
          const reserve=tailPt<=100?tailPt:0;
          const leadCap = Math.max(0, (PAGE_NUM_Y - 1.05) * 72 - 8 - Math.min(tableContentH, 365)-reserve);
          const split = splitCaption(pending);
          const leadPt = this.tableLeadHeight(split.lead, leadCap) + (split.caption ? CAPTION_H : 0);
          let lead = pending.length && leadPt < leadCap ? pending.slice() : [];
          if (!lead.length) {
            // The lead is too tall to share the table's slide, so it goes to its own prose page --
            // but the table's own title ("**표 — 제목**") must travel WITH the table, not stay
            // behind at the bottom of that page (production-guide.md "표·도식 제목").
            const prose = split.lead.slice();
            // A trailing subheading introduces this table, even when the preceding prose
            // needs its own page. Keep it with the table rather than orphaning it above.
            const last = prose[prose.length - 1];
            let keep=-1;
            for(let j=prose.length-1;j>=0;j--) if(prose[j].kind==="heading" || (prose[j].meta && prose[j].meta.groupHead)) {keep=j;break;}
            if(keep>=0 && this.textHeightPt(prose.slice(keep))<leadCap) lead.push(...prose.splice(keep));
            else if (last && (last.kind === "heading" || (last.meta && last.meta.groupHead)
              || (last.kind === "text" && GROUP_HEAD.test(last.text.trim())))) lead.push(prose.pop());
            this.flush(prose, section.title, layout.width, capacity);
            if (split.caption) lead.push(pending[pending.length - 1]);
          }
          this.table(b, section.title, lead, leadCap, { widths });
          open = this.pages[this.pages.length - 1];
          pending = [];
          governingSeen = true;
          continue;
        }
        need(b.kind === "code" || b.kind === "tree", "Unknown block");
        if (b.kind === "code") {
          if(b.meta?.language==='gherkin' || (this.s03Profile && b.meta?.language==='recordedInput')) {
            open=this.gherkin(b,section.title,pending.slice());pending=[];governingSeen=true;continue;
          }
          const pair = deferredCode;
          deferredCode = null;
          let k = blockIndex + 1;
          const trail = [];
          // A heading opens a new sub-topic, so the trail stops there -- it is not the code's
          // explanation (production-guide.md "소스 코드").
          // A table's own title ("**표 — 제목**") belongs to the table that follows, not to the
          // code above it: taking it as the code's trailing explanation printed the marker as body
          // text and left the table untitled (production-guide.md "표·도식 제목").
          while (k < section.blocks.length && ["text", "bullet"].includes(section.blocks[k].kind)) {
            const next = section.blocks[k];
            if (next.kind === "text" && TABLE_CAPTION.test(next.text.trim())) break;
            trail.push(section.blocks[k++]);
          }
          const trailPt = this.stackedTextHeightPt(trail);
          // The text before the code joins the code's slide when it is short (three lines), or when
          // the whole code still fits below it at 10pt -- e.g. a governing message and a quotation
          // above a short excerpt -- instead of leaving that text alone on a near-empty slide.
          const leadPt = pending.length ? this.textHeightPt(pending) : 0;
          const roomPt = (PAGE_NUM_Y - 0.15 - 1.05) * 72 - leadPt - 8 - (trailPt ? trailPt + 8 : 0);
          const fitsBelowLead = () => { const plan = planCode(b.text, 9.2 * 72, roomPt); return !!plan && plan.size === 10; };
          let lead = pending.length && (leadPt <= 3 * 40 || (!pair && fitsBelowLead())) ? pending.slice() : [];
          // A `###` heading never ends the text slide (production-guide.md "한 장의 메시지"): when it
          // is the last line before the code, it moves to the code slide as its lead instead of
          // sitting alone above the page number while its code starts on the next slide.
          if (!lead.length && pending.length && pending[pending.length - 1].kind === "heading") {
            const carried = pending.pop();
            flushPending();
            lead = [carried];
            if (this.sectionBlocks) this.sectionBlocks.push(carried);
          }
          if (!lead.length) flushPending();          if (!pair && !pending.length && open && open.codeArea && this.appendCodeBelow(open, b, trailPt)) {
            governingSeen = true;
            continue;
          }
          open = this.sourceCode(b, section.title, lead, { ...(pair ? { visual: pair.png } : {}), trailPt });
          if (pair) { if (multiVisual) visualTargets[pair.vi] = "placed"; else visualInline = true; }
          pending = [];
          governingSeen = true;
          // A short explanation right after the code stacks below it when the free band holds it
          // (production-guide.md "소스 코드"). Without this it waited for every later block of the
          // topic to fit as well, so a single trailing paragraph always started a new slide.
          if (trail.length && this.stackedTextHeightPt(trail) <= this.roomBelowPt(open)) {
            this.appendTextBelow(open, trail);
            if (this.sectionBlocks) this.sectionBlocks.push(...trail);
            blockIndex += trail.length;
          }
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
          const textEndY = textEndIn(layout.text.y, target.textCost || 0, target.textBlocks);
          const margin = BLOCK_GAP;
          const availableH = Math.max(0.6, this.contentBottomY() - margin - textEndY);
          const panel = visualPanel(layout, textEndY + margin, availableH, [png]);
          target.pictures = [{ ...png, bounds: fitTarget({ x: panel.x, y: panel.y, w: panel.w, h: panel.h }, png, "top") }];
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
          // Text past the layout bucket (allowed by visualCapacity above) is measured on the full
          // text area's scale, and its box grows to hold it.
          const over = cost > layout.capacity;
          const textEndY = textEndIn(over ? FULL_TEXT.y : layout.text.y, cost, target.textBlocks);
          if (over) setShapeBounds(shape(target.doc, 8), { ...layout.text, h: textEndY - layout.text.y });
          const margin = BLOCK_GAP;
          const availableH = Math.max(0.6, this.contentBottomY() - margin - textEndY);
          const panel = visualPanel(layout, textEndY + margin, availableH, renderedVisuals);
          const gap = BLOCK_GAP;
          const slotH = (panel.h - gap * (renderedVisuals.length - 1)) / renderedVisuals.length;
          target.pictures = renderedVisuals.map((png, index) => ({
            ...png,
            bounds: fitTarget({ x: panel.x, y: panel.y + index * (slotH + gap), w: panel.w, h: slotH }, png, "top"),
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
      // "**도식 — … — 제목**" captions the visual; it is never body text, so the one-slide document
      // layouts below see the same blocks as the normal flow does (the loop above skips it).
      const documentBlocks = section.blocks.filter((b) => !(b.kind === "text" && VISUAL_MARKER.test(b.text.trim())));
      if (docLayout && documentStyle.uniform && renderedVisuals.length === 0) {
        const compact = this.compactMixedDocumentPage(documentBlocks, section.title, documentStyle);
        if (compact) {
          this.pages.pop();
          this.pages.splice(firstIdx, end - firstIdx, compact);
          end = firstIdx + 1;
        }
      }
      if (docLayout && documentStyle.uniform && renderedVisuals.length === 1) {
        const compact = this.documentDiagramPage(documentBlocks, section.title, renderedVisuals[0], documentStyle);
        if (compact) {
          this.pages.pop();
          this.pages.splice(firstIdx, end - firstIdx, compact);
          end = firstIdx + 1;
        }
      }
      const practicePages = this.pages.slice(firstIdx, end);
      if (isPractice(section.title) || isAnswer(section.title) || docLayout) {
        const pages = practicePages;
        const textOnly = pages.every((p) => !(p.pictures || []).length && p.tableBottom == null && !p.items.some((it) => it.kind === "source" || it.kind === "table"));
        const one = textOnly && (isPractice(section.title) ? this.practicePage(this.sectionBlocks, section.title) : this.answerPage(this.sectionBlocks, section.title, documentStyle));
        if (one) {
          this.pages.splice(firstIdx, end - firstIdx);
          this.pages.splice(firstIdx, 0, this.pages.pop());
          end = firstIdx + 1;
        } else if (textOnly && docLayout && documentStyle.uniform) {
          const built = this.documentPages(this.sectionBlocks, section.title, documentStyle);
          this.pages.splice(firstIdx, end - firstIdx, ...built);
          end = firstIdx + built.length;
        }
        if (docLayout) this.rebalanceTail(firstIdx, end, section.title);
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
          if (pictureTextPt(pic, pic.bounds) >= MIN_PT - 0.05) continue;
          const bounds = fitTarget(VISUAL_ONLY, pic);
          if (pictureTextPt(pic, bounds) < MIN_PT - 0.05) {
            const tiles=require('./diagramTiles').diagramTiles(pic,VISUAL_ONLY);
            const keepLead=shared();
            p.pictures=p.pictures.filter(x=>x!==pic);
            if(!keepLead){p.pictures=[{...pic,...tiles[0]}];p.visualLayout='visual-tiles';}
            let at=k+1;
            for(let ti=keepLead?0:1;ti<tiles.length;ti++) {
              const q=this.page(ORIGIN.prose,section.title);paragraphs(q,8,[],false);this.pages.pop();
              q.appendix=Boolean(section.appendix);q.pictures=[{...pic,...tiles[ti]}];q.visualLayout='visual-tiles';
              this.pages.splice(at++,0,q);sectionEnd++;
            }
            continue;
          }
          if(!shared()) {pic.bounds=bounds;continue;}
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
      // A diagram that did not fit below the text it follows takes the free band of the next page
      // rather than a page of its own -- the page before a code block would otherwise stay half
      // empty (production-guide.md "Visual layout 및 가독성"). Only a page with nothing but the
      // picture can give it up, and the picture must still read at MIN_PT there.
      for (let k = firstIdx; k < sectionEnd - 1; k++) {
        const p = this.pages[k];
        if (!p.pictures || p.pictures.length !== 1) continue;
        if (p.items.some((it) => ["table", "source", "code", "tree"].includes(it.kind))) continue;
        if (p.items.some((it) => String(it.text || "").trim() !== "")) continue;
        const next = this.pages[k + 1];
        if (!next || (next.pictures || []).length) continue;
        if (next.items.some((it) => ["table", "source", "code", "tree"].includes(it.kind))) continue;
        const png = p.pictures[0];
        const endY = textEndIn(layout.text.y, next.textCost || 0, next.textBlocks);
        const top = endY + BLOCK_GAP;
        const availableH = this.contentBottomY() - BLOCK_GAP - top;
        if (availableH < 0.6) continue;
        const panel = visualPanel(layout, top, availableH, [png]);
        const bounds = fitTarget({ x: panel.x, y: panel.y, w: panel.w, h: panel.h }, png, "top");
        if (pictureTextPt(png, bounds) < MIN_PT - 0.05) continue;
        if ((next.textCost || 0) > (layout.capacity || 0)) setShapeBounds(shape(next.doc, 8), { ...layout.text, h: endY - layout.text.y });
        next.pictures = [{ ...png, bounds }];
        next.visualLayout = "stacked";
        this.pages.splice(k, 1);
        sectionEnd--;
        k--;
      }
      if(this.s03Profile && section.title==='11. LLM 초안 검토' && section.blocks.some(b=>b.kind==='table')){
        for(const p of this.pages.slice(firstIdx,sectionEnd)){
          p.documentTablePt=8;
          for(const gf of all(p.doc,P,'graphicFrame')){
            const fitted=this.documentTableFont(gf,8);
            p.tableBottom=Number(child(child(gf,P,'xfrm'),A,'off').getAttribute('y'))/EMU+fitted.heightPt/72;
          }
          for(const sp of all(p.doc,P,'sp')){
            const id=child(child(sp,P,'nvSpPr'),P,'cNvPr')?.getAttribute('id');
            if(['2','5','6','7','8'].includes(id))continue;
            for(const rp of all(sp,A,'rPr'))rp.setAttribute('sz','1000');
          }
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
        if(section.scopeKey)scopedGroups.get(section.scopeKey).push(p);
      }
      if (footnote) for (const page of this.pages.slice(firstIdx)) this.footnote(page, footnote);
      this.hasFootnote = false;
    }
    for(const pages of scopedGroups.values()) pages.forEach((p,i)=>{
      const lines=p.heading.split("\n");lines[0]=lines[0].replace(/ \(\d+\/\d+\)$/,'')+` (${i+1}/${pages.length})`;p.heading=lines.join("\n");
    });
    if(this.s03Profile)this.tableWidthReview=require('./tableColumnMetrics').optimizeSessionTables(this.pages.filter(p=>p.session===this.session));
  }

  // Writes every composed page as one .pptx. `title` is the document title — a bundle passes the
  // course name; each slide's top-right label comes from the page's own session.
  async write(outputPath, title) {
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
        // 제목 상자는 제목 구분선과 같은 띠다(TITLE_BOX). 세션명이 구분선 아래로 내려갔으므로
        // 오른쪽 끝까지 넓혀도 겹치지 않는다.
        setShapeBounds(shape(p.doc, 2), TITLE_BOX);
        const titleBody = body(shape(p.doc, 2));
        for (const par of kids(titleBody, A, "p")) titleBody.removeChild(par);
        const lines = p.heading.split("\n");
        const titlePt = TITLE_PT;
        for (let li = 0; li < lines.length; li++) {
          const par = el(p.doc, A, "p");
          titleBody.appendChild(par);
          // An answer's "(안)" is set at 18pt beside the 24pt title (production-guide.md "실습 슬라이드").
          const draft = li === 0 && /^(.*) (\(안\))((?: \(\d+\/\d+\))?)$/.exec(lines[li]);
          if (draft) {
            runParen(par, draft[1] + " ", titlePt, true);
            run(par, draft[2], 18, true);
            if (draft[3]) runParen(par, draft[3], titlePt, true);
          } else runParen(par, lines[li], li === 0 ? titlePt : 11, true);
          if(li===0)for(const rp of all(par,A,'rPr')){rp.setAttribute('sz','2000');rp.setAttribute('b','1');}
        }
      }
      // 세션명은 기존 Shape 5(idx=11)로 복귀한다. Shape 6과 하단 Shape 7은 비워 둔다.
      // 요약 뒤 별첨 장은 "별첨: <세션명>"이다.
      const pageSession = p.session || this.session;
      const label = p.appendix ? appendixSessionName(pageSession) : pageSession;
      const plain = p.isToc || p.isCover || p.isCourseGoal;
      setText(shape(p.doc, 6), "");
      const nameShape = shape(p.doc, SESSION_NAME_ID);
      const pt = sessionNamePt(label);
      const nameW = Math.min(SESSION_NAME_BOX.w, Math.max(1, (widthOf(label, pt) + 8) / 72));
      const nameBox = { ...SESSION_NAME_BOX, x: SESSION_NAME_BOX.x + SESSION_NAME_BOX.w - nameW, w: nameW };
      setShapeBounds(nameShape, nameBox);
      setText(nameShape, plain ? "" : label);
      if (!plain) {
        setRunSize(nameShape, pt);
        let titleBox = { ...TITLE_BOX, y: 0, h: 53.7 / 72, w: nameBox.x - TITLE_BOX.x - 0.12 };
        if(widthOf(p.heading.split("\n")[0],TITLE_PT)>titleBox.w*72-14.4) {
          // Long names and titles get separate rows inside the existing header band. Neither
          // title size nor content is reduced, and Shape 5 remains above the divider at right.
          setRunSize(nameShape,9);
          setShapeBounds(nameShape,{...SESSION_NAME_BOX,y:0,h:14/72});
          titleBox={...TITLE_BOX,y:14/72,h:39.7/72};
        }
        setShapeBounds(shape(p.doc, 2), titleBox);
        const titlePr = child(body(shape(p.doc, 2)), A, "bodyPr");
        titlePr.setAttribute("tIns", "0");
        titlePr.setAttribute("bIns", "0");
        titlePr.setAttribute("anchor", "ctr");
      }
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
        addPicture(p.doc, nextShapeId++, relId, picture.bounds, picture.kind + " Diagram " + kindNumber, picture.altText, picture.crop);
        sr.documentElement.appendChild(el(sr, REL, "Relationship", "Id", relId, "Type", R + "/image", "Target", "../media/" + mediaName));
        result.set("ppt/media/" + mediaName, picture.data);
      }
      normalizeTypography(p.doc);
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
    updateDocProps(result, this.pages, title || this.session);
    // Resolve template inheritance as well as generated runs: all text paragraphs and all script
    // fonts obey the same contract, including tables, master styles and speaker notes.
    for(const [name,data] of result) if(/^ppt\/.*\.xml$/.test(name)) {
      const doc=parseXml(data);normalizeTypography(doc);result.set(name,xmlOut(doc));
    }
    await writeZip(outputPath, result);
    // inspect.js checks shape 5/7 text against manifest.title/.source verbatim -- source is kept
    // as "" (not omitted) so that check still holds for the now-always-blank footer.
    return { pages: this.pages, codes: this.codes, unsupportedVisuals: this.unsupportedVisuals, layoutWarnings: this.layoutWarnings, images: imageNumber, imageCounts, title: title || this.session, source: "" };
  }
}

async function render(sections, templatePath, outputPath, session, toc, course) {
  const b = new Builder(templatePath);
  await b.init(session, course);
  return b.render(sections, outputPath, toc, course);
}

// 묶음 덱: 여러 세션을 받은 순서대로 한 .pptx에 담는다. 각 세션은 자기 덱과 같게 구성되고(목차,
// 첫 세션의 표지와 과정 목차), 슬라이드의 우측 상단 세션명도 그 세션의 것이다.
// items: [{ session, toc, sections, course }], title: 문서 제목(과정명).
async function bundle(items, templatePath, outputPath, title) {
  need(items.length > 0, "묶을 원고가 없다.");
  const b = new Builder(templatePath);
  // init()은 세션명과 템플릿 원형만 다시 잡고 이미 구성한 pages는 그대로 둔다.
  for (const it of items) {
    await b.init(it.session, it.course);
    await b.compose(it.sections, it.toc, it.course);
  }
  return b.write(outputPath, title);
}

module.exports = { styledCost, PRACTICE_STYLE, ANSWER_STYLE, REFERENCE_STYLE, PRACTICE_BOX, ANSWER_COLUMNS, Builder, render, bundle, isPractice, isAnswer, geometry, naturalSize, pictureTextPt, fitTarget, visualPanel, columnWidths, tocSessionName, appendixSessionName, sessionNamePt, TARGET_PT, MIN_PT, UML_MAX_PT, PAGE_NUM_Y };
