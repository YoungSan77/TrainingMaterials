"use strict";
const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const VERSION = "1.2026.0";
const ARTIFACT = "plantuml-mit-light";
const URL = `https://repo1.maven.org/maven2/net/sourceforge/plantuml/${ARTIFACT}/${VERSION}/${ARTIFACT}-${VERSION}.jar`;
const CACHE_DIR = path.resolve(__dirname, "../.cache/plantuml");
const JAR_PATH = path.join(CACHE_DIR, `${ARTIFACT}-${VERSION}.jar`);
const KINDS = new Set(["class", "usecase", "sequence", "communication", "collaboration", "state", "package"]);
const SCALE = 4;
const FONT_SIZE = 13;
const DASH = "-";

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { width: 0, height: 0 };
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// PlantUML's own PNG writer embeds the diagram source back into the file as an iTXt "plantuml"
// chunk (plus a "copyleft" tEXt notice) so it can round-trip through plantuml.com -- fully legal
// PNG, but pure metadata nobody downstream reads once it's placed on a slide, and this project
// already had to special-case a PNG decoder quirk for this exact output (see the ensureJar java
// invocation's `--add-opens=java.desktop/com.sun.imageio.plugins.png` flag). Stripping every
// chunk but the ones actually needed to decode the image (IHDR/PLTE/tRNS/IDAT/IEND) removes that
// whole class of decoder-compatibility risk instead of chasing it chunk by chunk.
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

function download(url, destination, redirects = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        res.resume();
        resolve(download(res.headers.location, destination, redirects - 1));
        return;
      }
      if (res.statusCode !== 200) { res.resume(); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      const temporary = destination + ".part";
      const output = fs.createWriteStream(temporary);
      res.pipe(output);
      output.on("finish", () => output.close(() => { fs.renameSync(temporary, destination); resolve(destination); }));
      output.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(60000, () => req.destroy(new Error("download timeout")));
  });
}

async function ensureJar() {
  if (fs.existsSync(JAR_PATH)) return JAR_PATH;
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  try { return await download(URL, JAR_PATH); }
  catch (error) { throw new Error(`PlantUML jar 다운로드 실패: ${error.message}`); }
}

function innerSource(source) {
  // The optional title group must not cross a newline: `\s+` (the original form) also matches
  // "\n", so "@startuml\nactor \"고객\" as Customer\n..." was parsed as if "actor \"고객\" as
  // Customer" were a same-line diagram title after "@startuml" and stripped whole -- silently
  // deleting the first participant declaration (it then got auto-created from its bare message
  // alias instead, which is why its display label and lifeline position both looked wrong).
  return String(source).replace(/^\s*@startuml(?:[ \t]+[^\n]+)?\s*\n?/i, "").replace(/\n?\s*@enduml\s*$/i, "").trim();
}

// A quoted participant/actor label using the same "제목 - 설명" split convention as mermaid node
// labels (mermaidAdapter.js's styleLabel): break onto its own line at the first "-", and the
// explanation after it renders smaller, via PlantUML's own Creole <size:N> tag (no external
// stylesheet hook).
function styleLabel(raw) {
  const idx = raw.indexOf(DASH);
  if (idx < 0) return raw;
  const tailSize = Math.round(FONT_SIZE * 0.8);
  return raw.slice(0, idx + 1) + "\\n<size:" + tailSize + ">" + raw.slice(idx + 1) + "</size>";
}

function styleSource(source) {
  return source.replace(/"([^"]*)"/g, (whole, inner) => '"' + styleLabel(inner) + '"');
}

function assembled(source, kind) {
  return [
    "@startuml",
    // smetana is a force-directed graph layout, a Graphviz-free substitute for class/usecase/etc
    // diagrams -- sequence diagrams have their own native left-to-right lifeline renderer and
    // don't need (or benefit from) a graph layout pass.
    ...(kind === "sequence" ? [] : ["!pragma layout smetana"]),
    `scale ${SCALE}`,
    "skinparam backgroundColor white", "skinparam defaultFontName 맑은 고딕", `skinparam defaultFontSize ${FONT_SIZE}`,
    // Bold by default (box/entity text), but not the flow itself -- sequence messages and
    // general arrow labels are explicitly kept plain rather than picking up the default.
    "skinparam defaultFontStyle bold", "skinparam SequenceMessageFontStyle plain", "skinparam ArrowFontStyle plain",
    "skinparam ArrowColor #1B3A6B", "skinparam SequenceLifeLineBorderColor #1B3A6B",
    "skinparam SequenceParticipantBorderColor #1B3A6B", "skinparam SequenceParticipantBackgroundColor #EBF1F8",
    styleSource(innerSource(source)), "@enduml",
  ].join("\n");
}

async function renderPlantUml({ kind, source }) {
  kind = kind || "sequence";
  if (!KINDS.has(kind)) throw new Error(`PlantUML kind가 지원 범위 밖이다: ${kind}`);
  if (!source || !String(source).trim()) throw new Error("PlantUML source가 비어 있다");
  const jar = await ensureJar();
  const content = assembled(source, kind);
  const hash = crypto.createHash("sha1").update(`${VERSION}\nscale${SCALE}\n${kind}\n${content}`).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".png");
  const pumlPath = path.join(CACHE_DIR, hash + ".puml");
  // A cache hit is only trusted if the file is actually a non-empty PNG -- a run interrupted
  // mid-write (killed process, disk full) can leave a zero-byte or truncated file at pngPath,
  // and without this check every future call would see "exists" and permanently reuse the
  // broken cache entry instead of ever regenerating it.
  if (fs.existsSync(pngPath) && (!fs.statSync(pngPath).size || !pngSize(fs.readFileSync(pngPath)).width)) {
    fs.unlinkSync(pngPath);
  }
  if (!fs.existsSync(pngPath)) {
    fs.writeFileSync(pumlPath, content, "utf8");
    try {
      execFileSync("java", [
        "--add-opens=java.desktop/com.sun.imageio.plugins.png=ALL-UNNAMED",
        "-DPLANTUML_LIMIT_SIZE=8192", "-Djava.awt.headless=true", "-jar", jar,
        "-failfast2", "-tpng", "-charset", "UTF-8", pumlPath, "-o", CACHE_DIR,
      ], { stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error(`PlantUML 렌더 실패(kind=${kind}): ${detail}`);
    } finally {
      if (fs.existsSync(pumlPath)) fs.unlinkSync(pumlPath);
    }
  }
  if (!fs.existsSync(pngPath)) throw new Error(`PlantUML이 PNG를 만들지 않았다(kind=${kind})`);
  const data = stripPngMetadata(fs.readFileSync(pngPath));
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error(`PlantUML 출력이 유효한 PNG가 아니다(kind=${kind})`);
  return { path: pngPath, data, width: size.width, height: size.height };
}

module.exports = { renderPlantUml, pngSize, stripPngMetadata, CACHE_DIR, JAR_PATH, KINDS, styleLabel, styleSource, innerSource, assembled };
