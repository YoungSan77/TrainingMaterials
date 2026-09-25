"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const CACHE_DIR = path.join(os.tmpdir(), "trainingmaterials-mermaid-cache");
const MMDC = path.resolve(__dirname, "../node_modules/.bin/mmdc");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// A "-" inside a quoted node/subgraph label is the same "제목 - 설명" split convention as body
// text's "—" (richText.js's rich()): break onto its own line, explanation smaller. Applying this
// per label -- rather than to every diagram uniformly -- is also why bold lives here (see
// styleLabel) instead of as a global stylesheet: a node/subgraph label is always this box's own
// text, never a flow/edge label, so scoping to quoted "..." labels naturally keeps arrows and
// edge text un-bold without hardcoding which diagram or slide that applies to.
const DASH = "-";

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { width: 0, height: 0 };
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// Bold is applied inline (<b>), not via an external stylesheet: mermaid measures each node's box
// from the label's own HTML at layout time, and a stylesheet applied after that measurement
// (mmdc's -C) left boxes sized for the unbolded text while the now-bold text overflowed them
// (confirmed on the "Rumbaugh OMT"/"Booch Method"/"Jacobson OOSE" boxes -- last letter clipped).
// Baking <b> into the source itself makes mermaid measure the true bold width up front.
function styleLabel(raw, box) {
  const idx = raw.indexOf(DASH);
  const label = idx < 0 ? "<b>" + raw + "</b>"
    : "<b>" + raw.slice(0, idx + 1) + "<br/><span style='font-size:0.8em'>" + raw.slice(idx + 1) + "</span></b>";
  if (!box) return label;
  // Uniform node size (production-guide.md "Visual layout 및 가독성"): mermaid sizes each node
  // from its label's HTML, so a min-width/min-height flex box around the label makes every node
  // as big as the widest/tallest one while keeping the text centered and at the same font size.
  return "<span style='display:inline-flex;flex-direction:column;align-items:center;justify-content:center;"
    + `min-width:${Math.ceil(box.w)}px;min-height:${Math.ceil(box.h)}px'>` + label + "</span>";
}

// `box` (optional) applies to node labels only -- a subgraph title is a container caption, not a
// box of the same kind as the nodes, so it keeps its own size.
function styleSource(source, box) {
  return String(source).split("\n").map((line) => {
    const lineBox = /^\s*subgraph\b/.test(line) ? null : box;
    return line.replace(/"([^"]*)"/g, (whole, inner) => '"' + styleLabel(inner, lineBox) + '"');
  }).join("\n");
}

// Largest node label box (width, height) in a rendered flowchart SVG: each node group's own
// label <foreignObject>. Subgraph/edge labels live outside `g.node`, so they are not counted.
function maxNodeLabelBox(svg) {
  let w = 0, h = 0;
  for (const m of String(svg).matchAll(/<g class="node\b[^"]*"[^>]*>[\s\S]*?<foreignObject width="([\d.]+)" height="([\d.]+)"/g)) {
    w = Math.max(w, Number(m[1]));
    h = Math.max(h, Number(m[2]));
  }
  return w && h ? { w, h } : null;
}

function runMmdc(sourcePath, outPath, puppeteerPath, extra) {
  execFileSync(MMDC, ["-i", sourcePath, "-o", outPath, "-t", "neutral", "-p", puppeteerPath, ...extra], {
    encoding: "utf8", cwd: path.resolve(__dirname, ".."), timeout: 30000,
  });
}

async function renderMermaid({ source }) {
  if (!source || !String(source).trim()) throw new Error("Mermaid source가 비어 있다");
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const hash = crypto.createHash("sha1").update("v12-uniform-node\n" + source).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".png");
  if (!fs.existsSync(pngPath)) {
    // Per-process temp names: concurrent renders of the same diagram (parallel test files, two
    // decks) share `hash`, and a shared temp file could be deleted or rewritten under the other.
    const tmp = path.join(CACHE_DIR, `${hash}.${process.pid}.${crypto.randomBytes(4).toString("hex")}`);
    const sourcePath = tmp + ".mmd";
    const svgPath = tmp + ".measure.svg";
    const tmpPng = tmp + ".png";
    const puppeteerPath = tmp + ".puppeteer.json";
    try {
      if (!fs.existsSync(MMDC)) throw new Error("Mermaid CLI가 설치되지 않았다: " + MMDC);
      if (!fs.existsSync(CHROME)) throw new Error("Mermaid 렌더용 Chrome이 없다: " + CHROME);
      fs.writeFileSync(puppeteerPath, JSON.stringify({ executablePath: CHROME, args: ["--no-sandbox"] }), "utf8");
      // Pass 1 measures every node's label box; pass 2 renders with all nodes at the largest one.
      fs.writeFileSync(sourcePath, styleSource(source), "utf8");
      runMmdc(sourcePath, svgPath, puppeteerPath, []);
      const box = maxNodeLabelBox(fs.readFileSync(svgPath, "utf8"));
      // "neutral" theme avoids the default theme's colored node-fill boxes behind labels, so slide
      // text next to the diagram doesn't read as inconsistent "some labels have a background".
      fs.writeFileSync(sourcePath, styleSource(source, box), "utf8");
      runMmdc(sourcePath, tmpPng, puppeteerPath, ["-b", "white", "-s", "2"]);
      fs.renameSync(tmpPng, pngPath);
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error("Mermaid 렌더 실패: " + detail);
    } finally {
      if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
      if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
      if (fs.existsSync(tmpPng)) fs.unlinkSync(tmpPng);
      if (fs.existsSync(puppeteerPath)) fs.unlinkSync(puppeteerPath);
    }
  }
  const data = fs.readFileSync(pngPath);
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error("Mermaid 렌더 출력이 유효한 PNG가 아니다");
  return { path: pngPath, data, width: size.width, height: size.height };
}

module.exports = { renderMermaid, pngSize, CACHE_DIR, styleLabel, styleSource, maxNodeLabelBox };
