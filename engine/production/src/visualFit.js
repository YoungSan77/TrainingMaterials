"use strict";
// 도식의 크기와 자리 — 본문·도식 영역의 상자, 도식이 읽히는 글자 크기(10pt 목표, 7pt 바닥),
// 그리고 도식이 놓일 패널을 정한다(production-guide.md 「Visual layout 및 가독성」).
const EMU = 914400;

// 본문·패널 상자(인치). 도식이 없으면 본문이 슬라이드를 다 쓰고, 도식이 있으면 위가 본문·아래가
// 패널이다. 세로로 긴 도식(낮은 가로세로비)이나 작아지는 도식은 더 깊은 패널(DEEP_*)을 쓴다.
const FULL_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 5.75 };
const STACKED_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 3.05 };
const STACKED_PANEL = { x: 1.4, y: 4.25, w: 7.2, h: 1.8 };
// Panel height reduced from 3.55 -> 3.0 (text area grows 1.8 -> 2.75 to match): a simple 2-4 node
// diagram was being blown up to fill the full 3.55in panel just because it landed in this bucket
// (low aspect ratio), which both wasted space and starved the text above it. 3.0in is the floor
// that still keeps a real plantuml sequence diagram's smallest label >=8pt at this panel width
// (verified against the lecture-java-baseline fixture -- see visualPolicy()); mermaid diagrams
// clear 8pt with more margin at this size since their SCALE (mermaidAdapter.js) is lower.
const DEEP_STACKED_TEXT = { x: 0.4, y: 1.05, w: 9.2, h: 2.75 };
const DEEP_STACKED_PANEL = { x: 0.5, y: 3.35, w: 9.0, h: 3.0 };
// The template's sldNum placeholder Y (slideLayout1.xml, 6449625 EMU) -- the floor a
// diagram panel must clear so it never crowds the footer.
const PAGE_NUM_Y = 6449625 / EMU;
const VISUAL_ONLY = { x: 0.5, y: 1.05, w: 9.0, h: PAGE_NUM_Y - 0.15 - 1.05 };
const TREE_TEXT = { x: 2.65, y: 1.05, w: 4.7, h: 5.75 };
const UML_PANEL = { x: 0.5, w: 9.0 };

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

function fitTarget(bounds, image, align) {
  // Every diagram's text reads at TARGET_PT (10pt); a diagram is never enlarged. When it does not
  // fit it steps down to 9, 8, 7pt -- the largest step that fits, never past the panel -- and
  // below MIN_PT it is fitted exactly and reported (generate.js) for the source to be fixed.
  const natural = naturalSize(image, TARGET_PT);
  const maxScale = Math.min(1, bounds.w / natural.w, bounds.h / natural.h);
  let scale = 1;
  while (scale > maxScale + 1e-9 && scale - 0.1 >= MIN_PT / TARGET_PT - 1e-9) scale = Math.round((scale - 0.1) * 10) / 10;
  if (scale > maxScale + 1e-9) scale = maxScale;
  const fitted = center(bounds, natural.w * scale, natural.h * scale);
  // A diagram under body text sits one line below it ("align: top"); centering it in the leftover
  // band pushed it toward the footer and left a hole between the last line and the diagram.
  return align === "top" ? { ...fitted, y: bounds.y } : fitted;
}

// The text size (pt) a diagram reads at inside `bounds`.
function pictureTextPt(image, bounds) {
  return TARGET_PT * bounds.w / naturalSize(image, TARGET_PT).w;
}

// UML diagrams take the full slide width and all the height left under the text; other diagrams
// keep the policy's panel height.
function visualPanel(layout, top, availableH, images) {
  const uml = images.length > 0 && images.every(isUml);
  const panelH = uml ? availableH : Math.min(layout.panel.h, availableH);
  return uml ? { ...layout.panel, ...UML_PANEL, y: top, h: panelH } : { ...layout.panel, y: top, h: panelH };
}

// Which text/panel boxes a slide uses, from what its diagrams look like.
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

module.exports = {
  EMU, FULL_TEXT, STACKED_TEXT, STACKED_PANEL, DEEP_STACKED_TEXT, DEEP_STACKED_PANEL,
  PAGE_NUM_Y, VISUAL_ONLY, TREE_TEXT, UML_PANEL,
  contain, center, naturalSize, fitTarget, pictureTextPt, visualPanel, visualPolicy, isUml,
  TARGET_PT, MIN_PT, UML_MAX_PT,
};
