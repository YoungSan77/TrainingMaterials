"use strict";
const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");
const { textWidths, maxEntityRectWidth, uniformClassSource, uniformLabelSource } = require("./uniformSize");
const { shrinkUsecaseActors, fitUsecaseEllipses, fixAssociationClasses, fitViewBox } = require("./umlSvgFix");
const { execFileSync } = require("child_process");

const VERSION = "1.2026.0";
const ARTIFACT = "plantuml-mit-light";
const URL = `https://repo1.maven.org/maven2/net/sourceforge/plantuml/${ARTIFACT}/${VERSION}/${ARTIFACT}-${VERSION}.jar`;
const CACHE_DIR = path.resolve(__dirname, "../.cache/plantuml");
const JAR_PATH = path.join(CACHE_DIR, `${ARTIFACT}-${VERSION}.jar`);
const KINDS = new Set(["class", "usecase", "sequence", "communication", "collaboration", "state", "package", "activity"]);
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
    // A sequence diagram shows each participant once, at the top; PlantUML's default footbox
    // (every participant repeated under the lifelines) is not part of the standard reading.
    ...(kind === "sequence" ? ["hide footbox"] : []),
    // A communication diagram's participants are roles in an interaction, not classes: the empty
    // attribute/method compartments PlantUML's object notation draws would read as class boxes.
    ...(kind === "communication" || kind === "collaboration" ? ["hide empty members"] : []),
    // A class box shows its name only; the C·E·I·A spot is not UML, so enumerations and
    // interfaces are told apart by their «enumeration»·«interface» stereotypes instead.
    ...(kind === "class" || kind === "package" ? ["hide circle"] : []),
    // A package diagram shows what belongs to which package: class names only, never attributes
    // or operations (session-authoring-guide.md "9. UML").
    ...(kind === "package" ? ["hide members"] : []),
    `scale ${SCALE}`,
    "skinparam backgroundColor white", "skinparam defaultFontName 맑은 고딕", `skinparam defaultFontSize ${FONT_SIZE}`,
    // Bold by default (box/entity text), but not the flow itself -- sequence messages and
    // general arrow labels are explicitly kept plain rather than picking up the default.
    "skinparam defaultFontStyle bold", "skinparam SequenceMessageFontStyle plain", "skinparam ArrowFontStyle plain",
    "skinparam ArrowColor #1B3A6B", "skinparam SequenceLifeLineBorderColor #1B3A6B",
    "skinparam SequenceParticipantBorderColor #1B3A6B", "skinparam SequenceParticipantBackgroundColor white",
    // UML notation carries no fill colour (production-guide.md "Visual layout 및 가독성"): every
    // shape is drawn as an outline on white.
    ...["Usecase", "Actor", "Class", "ClassHeader", "Object", "State", "Activity", "ActivityDiamond", "Note",
      "Rectangle", "Package", "Partition", "Participant", "SequenceGroup", "SequenceGroupHeader", "SequenceBox",
      "Entity", "Component", "Interface"].map((e) => `skinparam ${e}BackgroundColor white`),
    styleSource(innerSource(source)), "@enduml",
  ].join("\n");
}

// Runs PlantUML on `content` into CACHE_DIR as `format` ("png" | "svg"), cached by content hash.
function runPlantUml(jar, kind, content, format) {
  const hash = crypto.createHash("sha1").update(`${VERSION}\nscale${SCALE}\n${kind}\n${content}`).digest("hex").slice(0, 16);
  const outPath = path.join(CACHE_DIR, hash + "." + format);
  // Per-process temp name (PlantUML names its output after the .puml): concurrent renders of the
  // same diagram share `hash`, so each writes its own file and renames the result into place.
  const tmpBase = `${hash}.${process.pid}.${crypto.randomBytes(4).toString("hex")}`;
  const pumlPath = path.join(CACHE_DIR, tmpBase + ".puml");
  const tmpOut = path.join(CACHE_DIR, tmpBase + "." + format);
  // A cache hit is only trusted if the file is actually non-empty (and, for PNG, a valid PNG) --
  // a run interrupted mid-write (killed process, disk full) can leave a zero-byte or truncated
  // file at outPath, and without this check every future call would see "exists" and permanently
  // reuse the broken cache entry instead of ever regenerating it.
  if (fs.existsSync(outPath) && (!fs.statSync(outPath).size
    || (format === "png" && !pngSize(fs.readFileSync(outPath)).width))) {
    fs.unlinkSync(outPath);
  }
  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(pumlPath, content, "utf8");
    try {
      execFileSync("java", [
        "--add-opens=java.desktop/com.sun.imageio.plugins.png=ALL-UNNAMED",
        "-DPLANTUML_LIMIT_SIZE=8192", "-Djava.awt.headless=true", "-jar", jar,
        "-failfast2", "-t" + format, "-charset", "UTF-8", pumlPath, "-o", CACHE_DIR,
      ], { stdio: ["ignore", "pipe", "pipe"], timeout: 60000 });
      if (fs.existsSync(tmpOut)) fs.renameSync(tmpOut, outPath);
    } catch (error) {
      const detail = String(error.stderr || error.stdout || error.message || error).trim().slice(0, 2000);
      throw new Error(`PlantUML 렌더 실패(kind=${kind}): ${detail}`);
    } finally {
      if (fs.existsSync(pumlPath)) fs.unlinkSync(pumlPath);
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    }
  }
  if (!fs.existsSync(outPath)) throw new Error(`PlantUML이 ${format.toUpperCase()}를 만들지 않았다(kind=${kind})`);
  return outPath;
}

// Uniform box size (production-guide.md "Visual layout 및 가독성"): measure the diagram once as
// SVG, then rewrite the source so every class/state/usecase/participant box takes the widest
// (and, for classes, tallest) box's size. See uniformSize.js.
function uniformSource(jar, source, kind) {
  const inner = innerSource(source);
  if (!["class", "package", "communication", "collaboration", "state", "usecase", "sequence"].includes(kind)) return inner;
  const svg = fs.readFileSync(runPlantUml(jar, kind, assembled(inner, kind), "svg"), "utf8");
  if (["class", "package", "communication", "collaboration"].includes(kind)) return uniformClassSource(inner, maxEntityRectWidth(svg), SCALE, FONT_SIZE);
  return uniformLabelSource(inner, kind, textWidths(svg), FONT_SIZE * SCALE);
}

// PlantUML draws the sequence-diagram stick-figure actor at a fixed size (ActorStickMan's
// hard-coded head/body lengths, no skinparam/style), which reads oversized next to participant
// boxes. The figure (head <ellipse> + body <path> inside the actor's `participant-head` group) is
// scaled by ACTOR_SCALE about its feet so it stays attached to its name label, and the drawing's
// now-empty top band is cropped off.
const ACTOR_SCALE = 0.5;
function shrinkSequenceActors(svg, factor = ACTOR_SCALE) {
  let top = Infinity;
  let changed = false;
  let out = String(svg).replace(/(<g class="participant participant-head"[^>]*>)([\s\S]*?)(<\/g>)/g, (whole, open, body, close) => {
    const figure = /(<ellipse\b[^>]*\/>\s*<path\b[^>]*\/>)/.exec(body);
    if (!figure) {
      const rect = /<rect\b[^>]*\bwidth="([\d.]+)"[^>]*\bx="([\d.]+)"[^>]*\by="([\d.]+)"/.exec(body);
      if (!rect) return whole;
      top = Math.min(top, Number(rect[3]));
      // Center the participant name in its box: the no-break-space padding added for uniform
      // box width (uniformSize.js) is measured by PlantUML's font but not reproduced exactly by
      // rsvg, which left names shifted toward the box's left edge.
      const cx = Number(rect[2]) + Number(rect[1]) / 2;
      return open + body.replace(/<text\b([^>]*)>([^<]*)<\/text>/g, (w, attrs, text) => {
        const trimmed = text.replace(/^(?:&#160;|\u00a0)+|(?:&#160;|\u00a0)+$/g, "");
        const a = attrs.replace(/\s(?:textLength|lengthAdjust)="[^"]*"/g, "").replace(/\bx="[\d.]+"/, `x="${cx}" text-anchor="middle"`);
        return `<text${a}>${trimmed}</text>`;
      }) + close;
    }
    const ellipse = /<ellipse\b[^>]*\bcx="([\d.]+)"[^>]*\bcy="([\d.]+)"[^>]*\bry="([\d.]+)"/.exec(figure[1]);
    const ys = [...figure[1].matchAll(/[ML]\s*[\d.]+,([\d.]+)/g)].map((m) => Number(m[1]));
    if (!ellipse || !ys.length) return whole;
    const cx = Number(ellipse[1]);
    const feet = Math.max(...ys);
    const headTop = Number(ellipse[2]) - Number(ellipse[3]);
    top = Math.min(top, feet - (feet - headTop) * factor);
    changed = true;
    const g = `<g transform="translate(${cx},${feet}) scale(${factor}) translate(${-cx},${-feet})">${figure[1]}</g>`;
    return open + body.replace(figure[1], g) + close;
  });
  // A participant created mid-interaction is drawn inside its creation message's group, not a
  // participant-head group: center any padded box label that directly follows its box.
  out = out.replace(/(<rect\b[^>]*\bwidth="([\d.]+)"[^>]*\bx="([\d.]+)"[^>]*\/>\s*)<text\b([^>]*)>((?:&#160;)+[^<]*?(?:&#160;)+)<\/text>/g,
    (w, rectPart, width, x, attrs, text) => {
      const cx = Number(x) + Number(width) / 2;
      const a = attrs.replace(/\s(?:textLength|lengthAdjust)="[^"]*"/g, "").replace(/\bx="[\d.]+"/, `x="${cx}" text-anchor="middle"`);
      return `${rectPart}<text${a}>${text.replace(/^(?:&#160;)+|(?:&#160;)+$/g, "")}</text>`;
    });
  if (!changed || !Number.isFinite(top)) return out;
  const vb = /viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/.exec(out);
  if (!vb) return out;
  const cut = Math.max(0, top - 20 - Number(vb[2]));
  if (cut <= 0) return out;
  const h = Number(vb[4]) - cut;
  out = out.replace(vb[0], `viewBox="${vb[1]} ${Number(vb[2]) + cut} ${vb[3]} ${h}"`)
    .replace(/(<svg\b[^>]*?\sheight=")[\d.]+px"/, `$1${h}px"`)
    .replace(/(<svg\b[^>]*?style="[^"]*?height:)[\d.]+px/, `$1${h}px`);
  return out;
}

// SVG corrections a diagram needs (umlSvgFix.js); any at all routes it through SVG -> rsvg.
function svgFixes(kind, inner) {
  const hasActor = /^\s*actor\b/m.test(inner);
  const fixes = [];
  if (kind === "sequence" && hasActor) fixes.push((svg) => shrinkSequenceActors(svg));
  if (kind === "usecase") fixes.push(fitUsecaseEllipses);
  if (kind === "usecase" && hasActor) fixes.push((svg) => shrinkUsecaseActors(svg, ACTOR_SCALE));
  if (kind === "class" && /^\s*\([^)]*,[^)]*\)\s*\.\./m.test(inner)) fixes.push(fixAssociationClasses);
  if (["communication", "collaboration"].includes(kind)) fixes.push(fitViewBox);
  return fixes;
}

const RSVG_CONVERT = "/opt/homebrew/bin/rsvg-convert";
function rasterizeSvg(svg, kind) {
  const hash = crypto.createHash("sha1").update(`svgfix-v7\n${svg}`).digest("hex").slice(0, 16);
  const pngPath = path.join(CACHE_DIR, hash + ".actors.png");
  if (fs.existsSync(pngPath) && pngSize(fs.readFileSync(pngPath)).width) return pngPath;
  if (!fs.existsSync(RSVG_CONVERT)) throw new Error("PlantUML 액터 축소용 rsvg-convert가 없다: " + RSVG_CONVERT);
  const tmp = path.join(CACHE_DIR, `${hash}.${process.pid}.${crypto.randomBytes(4).toString("hex")}`);
  try {
    fs.writeFileSync(tmp + ".svg", svg, "utf8");
    execFileSync(RSVG_CONVERT, ["-b", "white", "-o", tmp + ".png", tmp + ".svg"], { stdio: ["ignore", "pipe", "pipe"], timeout: 30000 });
    fs.renameSync(tmp + ".png", pngPath);
  } catch (error) {
    const detail = String(error.stderr || error.message || error).trim().slice(0, 2000);
    throw new Error(`PlantUML 액터 축소 렌더 실패(kind=${kind}): ${detail}`);
  } finally {
    for (const f of [tmp + ".svg", tmp + ".png"]) if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  return pngPath;
}

async function renderPlantUml({ kind, source }) {
  kind = kind || "sequence";
  if (!KINDS.has(kind)) throw new Error(`PlantUML kind가 지원 범위 밖이다: ${kind}`);
  if (!source || !String(source).trim()) throw new Error("PlantUML source가 비어 있다");
  const jar = await ensureJar();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const content = assembled(uniformSource(jar, source, kind), kind);
  const fixes = svgFixes(kind, innerSource(source));
  const pngPath = fixes.length
    ? rasterizeSvg(fixes.reduce((svg, fix) => fix(svg), fs.readFileSync(runPlantUml(jar, kind, content, "svg"), "utf8")), kind)
    : runPlantUml(jar, kind, content, "png");
  const data = stripPngMetadata(fs.readFileSync(pngPath));
  const size = pngSize(data);
  if (!size.width || !size.height) throw new Error(`PlantUML 출력이 유효한 PNG가 아니다(kind=${kind})`);
  return { path: pngPath, data, width: size.width, height: size.height };
}

module.exports = { renderPlantUml, uniformSource, shrinkSequenceActors, svgFixes, ACTOR_SCALE, pngSize, stripPngMetadata, CACHE_DIR, JAR_PATH, KINDS, styleLabel, styleSource, innerSource, assembled };
