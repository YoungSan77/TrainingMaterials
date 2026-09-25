"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const CACHE_DIR = path.resolve(__dirname, "../.cache/chart");
const WORKER = path.join(__dirname, "chart_worker.py");
const LOCAL_PYTHON = path.resolve(__dirname, "../.venv/bin/python3");

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { width: 0, height: 0 };
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// matplotlib's PNG writer stamps a tEXt "Software: matplotlib version X" chunk and a pHYs (DPI)
// chunk -- pure metadata; placement on the slide is driven entirely by the OOXML xfrm we set
// explicitly, never by pHYs. Keeping only the chunks needed to decode the image avoids relying on
// every downstream PNG decoder handling matplotlib's ancillary chunks the same way (see the
// matching stripPngMetadata in plantumlAdapter.js for the concrete decoder issue this pattern
// already caused once).
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

async function renderChart(source) {
  let spec;
  try { spec = typeof source === "string" ? JSON.parse(source) : source; }
  catch (error) { throw new Error("Chart specification JSON 오류: " + error.message); }
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) throw new Error("Chart specification이 JSON object가 아니다");
  if (!fs.existsSync(LOCAL_PYTHON)) throw new Error("Chart 렌더용 Python 환경이 없다: " + LOCAL_PYTHON);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const json = JSON.stringify(spec);
  const hash = crypto.createHash("sha1").update("v4-bold-title-contrast\n" + json).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".png");
  // A cache hit is only trusted if the file is actually a non-empty PNG -- see the matching
  // check in plantumlAdapter.js for why (an interrupted run can leave a truncated file that a
  // bare existsSync would otherwise treat as a permanently-valid cache entry).
  if (fs.existsSync(pngPath) && (!fs.statSync(pngPath).size || !pngSize(fs.readFileSync(pngPath)).width)) {
    fs.unlinkSync(pngPath);
  }
  if (!fs.existsSync(pngPath)) {
    try {
      const matplotlibConfig = path.join(CACHE_DIR, "matplotlib");
      fs.mkdirSync(matplotlibConfig, { recursive: true });
      execFileSync(LOCAL_PYTHON, [WORKER, pngPath], {
        input: json, encoding: "utf8", timeout: 30000,
        env: { ...process.env, MPLCONFIGDIR: matplotlibConfig },
      });
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error("Chart 렌더 실패(matplotlib): " + detail);
    }
  }
  if (!fs.existsSync(pngPath)) throw new Error("Chart 렌더가 PNG를 만들지 않았다");
  const data = stripPngMetadata(fs.readFileSync(pngPath));
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error("Chart 렌더 출력이 유효한 PNG가 아니다");
  return { path: pngPath, data, width: size.width, height: size.height };
}

module.exports = { renderChart, pngSize, stripPngMetadata, CACHE_DIR, LOCAL_PYTHON };
