'use strict';
// mermaidAdapter.js — Mermaid source -> PNG(경로, wIn, hIn). "일반 구조/흐름/관계" 전용.
//   UML은 여기로 보내지 않는다 — UML은 계속 engine/plantuml/render.js(PlantUML)다.
//
//   경로: mermaid source -> mermaid_worker.mjs(격리된 ESM subprocess, jsdom) -> SVG
//         -> ImageMagick `convert`(이미 설치돼 있음, 새 dependency 아님)로 PNG 래스터화.
//   PlantUML과 동일한 캐시 원칙(해시 키, 존재하면 재실행 없음)을 따른다.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const CACHE_DIR = path.join(__dirname, '..', '.cache', 'mermaid', 'diagrams');
const DENSITY = 150;   // px/inch — PlantUML render.js와 같은 밀도 상수, 셀프 일관성을 위해 맞춘다
const WORKER = path.join(__dirname, 'mermaid_worker.mjs');

function ensureCacheDir() { fs.mkdirSync(CACHE_DIR, { recursive: true }); }

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { w: 0, h: 0 };
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function hashOf(source) {
  return crypto.createHash('sha1').update(`v1\n${source}`).digest('hex').slice(0, 16);
}

function renderMermaid({ source }) {
  if (!source || !String(source).trim()) throw new Error('mermaid source가 비어 있다');
  ensureCacheDir();
  const hash = hashOf(source);
  const pngPath = path.join(CACHE_DIR, `${hash}.png`);
  const svgPath = path.join(CACHE_DIR, `${hash}.svg`);

  if (fs.existsSync(pngPath)) {
    const { w, h } = pngSize(fs.readFileSync(pngPath));
    return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
  }

  let svg;
  try {
    svg = execFileSync('node', [WORKER], {
      input: source, encoding: 'utf8', cwd: path.join(__dirname, '..', '..'), timeout: 30000,
    });
  } catch (e) {
    const out = (e.stderr || e.stdout || '').toString().trim().slice(0, 2000);
    throw new Error(`Mermaid 렌더 실패 — ${e.signal ? `신호 ${e.signal}` : `종료 코드 ${e.code}`}${out ? `: ${out}` : ' (출력 없음)'}`);
  }
  fs.writeFileSync(svgPath, svg, 'utf8');

  try {
    execFileSync('convert', ['-density', String(DENSITY), '-background', 'white', svgPath, pngPath], {
      stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000,
    });
  } catch (e) {
    const out = (e.stderr || e.stdout || '').toString().trim().slice(0, 2000);
    throw new Error(`Mermaid SVG -> PNG 래스터화 실패(ImageMagick convert) — ${out || String(e.message || e)}`);
  }

  if (!fs.existsSync(pngPath)) throw new Error('Mermaid 렌더가 PNG를 만들지 않았다');
  const { w, h } = pngSize(fs.readFileSync(pngPath));
  if (!w || !h) throw new Error('Mermaid 렌더 출력이 유효한 PNG가 아니다');
  return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
}

module.exports = { renderMermaid, CACHE_DIR };
