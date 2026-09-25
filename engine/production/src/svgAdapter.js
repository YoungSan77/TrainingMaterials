"use strict";
// guides/production-guide.md and guides/session-authoring-guide.md both require inline `svg` code
// blocks to render as an actual visual, the same as Mermaid/PlantUML/Chart -- but no adapter for
// this existed, so `svg` fences fell through to the generic "code" branch in parse.js and were
// displayed as literal SVG markup text on the slide.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const CACHE_DIR = path.resolve(__dirname, "../.cache/svg");
const RSVG_CONVERT = "/opt/homebrew/bin/rsvg-convert";
// Raster scale for crispness, matching mermaidAdapter.js's "-s 2". Text size in the source SVG is
// authored in viewBox units; naturalSize()'s SVG estimate formula in builder.js multiplies the
// smallest authored font-size by this same SCALE to convert to the raster's own pixel space.
const SCALE = 2;
const DEFAULT_FONT_SIZE = 14;

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { width: 0, height: 0 };
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// rsvg-convert stamps a bKGD (default background color) chunk -- advisory only for a standalone
// PNG viewer filling in for transparency; PowerPoint composites the picture directly against the
// slide, never consulting bKGD, so it's pure surplus. See plantumlAdapter.js's stripPngMetadata
// for why every renderer here keeps only the chunks actually needed to decode the image.
function stripPngMetadata(buf) {
  const KEEP = new Set(["IHDR", "PLTE", "tRNS", "IDAT", "IEND"]);
  const out = [buf.subarray(0, 8)];
  let pos = 8;
  while (pos + 8 <= buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString("latin1", pos + 4, pos + 8);
    const end = pos + 12 + length;
    if (end > buf.length) break;
    if (KEEP.has(type)) out.push(buf.subarray(pos, end));
    pos = end;
    if (type === "IEND") break;
  }
  return Buffer.concat(out);
}

// Smallest `font-size` declared anywhere in the SVG (inline style="..." or a <style> block), in
// its own viewBox-unit px -- the legibility floor naturalSize() must size the whole image around,
// not just some average or the title size.
function minFontSize(source) {
  const sizes = [];
  const re = /font-size\s*:\s*([\d.]+)px/gi;
  let m;
  while ((m = re.exec(source))) sizes.push(parseFloat(m[1]));
  return sizes.length ? Math.min(...sizes) : DEFAULT_FONT_SIZE;
}

// guides/production-guide.md "접근성 텍스트": the authored aria-label/<title>/<desc> is the alt
// text Production must preserve on the PPT picture object, not something to invent or drop.
function altText(source) {
  const aria = /aria-label\s*=\s*"([^"]*)"/.exec(source);
  if (aria && aria[1].trim()) return aria[1].trim();
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(source);
  if (title && title[1].trim()) return title[1].trim();
  return null;
}

async function renderSvg(source) {
  if (!source || !String(source).trim()) throw new Error("SVG source가 비어 있다");
  if (!fs.existsSync(RSVG_CONVERT)) throw new Error("SVG 렌더용 rsvg-convert가 없다: " + RSVG_CONVERT);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const hash = crypto.createHash("sha1").update("v1\n" + source).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".png");
  if (!fs.existsSync(pngPath)) {
    const svgPath = path.join(CACHE_DIR, hash + ".svg");
    try {
      fs.writeFileSync(svgPath, source, "utf8");
      execFileSync(RSVG_CONVERT, ["-z", String(SCALE), "-o", pngPath, svgPath], { timeout: 30000 });
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error("SVG 렌더 실패(rsvg-convert): " + detail);
    } finally {
      if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
    }
  }
  if (!fs.existsSync(pngPath)) throw new Error("SVG 렌더가 PNG를 만들지 않았다");
  const data = stripPngMetadata(fs.readFileSync(pngPath));
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error("SVG 렌더 출력이 유효한 PNG가 아니다");
  return {
    path: pngPath, data, width: size.width, height: size.height,
    fontSize: minFontSize(source) * SCALE, altText: altText(source),
  };
}

module.exports = { renderSvg, pngSize, stripPngMetadata, minFontSize, altText, CACHE_DIR, SCALE };
