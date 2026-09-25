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
function styleLabel(raw) {
  const idx = raw.indexOf(DASH);
  if (idx < 0) return "<b>" + raw + "</b>";
  return "<b>" + raw.slice(0, idx + 1) + "<br/><span style='font-size:0.8em'>" + raw.slice(idx + 1) + "</span></b>";
}

function styleSource(source) {
  return source.replace(/"([^"]*)"/g, (whole, inner) => '"' + styleLabel(inner) + '"');
}

async function renderMermaid({ source }) {
  if (!source || !String(source).trim()) throw new Error("Mermaid source가 비어 있다");
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const styled = styleSource(source);
  const hash = crypto.createHash("sha1").update("v11-inline-bold\n" + source).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".png");
  if (!fs.existsSync(pngPath)) {
    const sourcePath = path.join(CACHE_DIR, hash + ".mmd");
    const puppeteerPath = path.join(CACHE_DIR, "puppeteer.json");
    try {
      if (!fs.existsSync(MMDC)) throw new Error("Mermaid CLI가 설치되지 않았다: " + MMDC);
      if (!fs.existsSync(CHROME)) throw new Error("Mermaid 렌더용 Chrome이 없다: " + CHROME);
      fs.writeFileSync(sourcePath, styled, "utf8");
      fs.writeFileSync(puppeteerPath, JSON.stringify({ executablePath: CHROME, args: ["--no-sandbox"] }), "utf8");
      // "neutral" theme avoids the default theme's colored node-fill boxes behind labels, so slide
      // text next to the diagram doesn't read as inconsistent "some labels have a background".
      execFileSync(MMDC, [
        "-i", sourcePath, "-o", pngPath, "-b", "white", "-s", "2", "-t", "neutral", "-p", puppeteerPath,
      ], {
        encoding: "utf8", cwd: path.resolve(__dirname, ".."), timeout: 30000,
      });
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error("Mermaid 렌더 실패: " + detail);
    } finally {
      if (fs.existsSync(sourcePath)) fs.unlinkSync(sourcePath);
    }
  }
  const data = fs.readFileSync(pngPath);
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error("Mermaid 렌더 출력이 유효한 PNG가 아니다");
  return { path: pngPath, data, width: size.width, height: size.height };
}

module.exports = { renderMermaid, pngSize, CACHE_DIR, styleLabel, styleSource };
