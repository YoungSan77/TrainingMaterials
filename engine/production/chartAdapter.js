'use strict';
// chartAdapter.js — chart spec(JSON, authoring 확정) -> PNG(경로, wIn, hIn). "정량 Chart" 전용.
//   Production은 chart type/data를 판단·집계·변환하지 않는다 — 주어진 spec을 그대로
//   python3/matplotlib(chart_worker.py)에 넘긴다.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const CACHE_DIR = path.join(__dirname, '..', '.cache', 'chart', 'diagrams');
const DENSITY = 150;   // chart_worker.py의 matplotlib dpi=150과 맞춘다(인치 환산 단일 소스)
const WORKER = path.join(__dirname, 'chart_worker.py');

function ensureCacheDir() { fs.mkdirSync(CACHE_DIR, { recursive: true }); }

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return { w: 0, h: 0 };
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function hashOf(specJson) {
  return crypto.createHash('sha1').update(`v1\n${specJson}`).digest('hex').slice(0, 16);
}

function renderChart(spec) {
  if (!spec || typeof spec !== 'object') throw new Error('chart spec이 없다(JSON object 필요)');
  const specJson = JSON.stringify(spec);
  ensureCacheDir();
  const hash = hashOf(specJson);
  const pngPath = path.join(CACHE_DIR, `${hash}.png`);

  if (fs.existsSync(pngPath)) {
    const { w, h } = pngSize(fs.readFileSync(pngPath));
    return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
  }

  try {
    execFileSync('python3', [WORKER, pngPath], {
      input: specJson, stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000,
    });
  } catch (e) {
    const out = (e.stderr || e.stdout || '').toString().trim().slice(0, 2000);
    throw new Error(`Chart 렌더 실패(matplotlib) — ${e.signal ? `신호 ${e.signal}` : `종료 코드 ${e.code}`}${out ? `: ${out}` : ' (출력 없음)'}`);
  }

  if (!fs.existsSync(pngPath)) throw new Error('Chart 렌더가 PNG를 만들지 않았다');
  const { w, h } = pngSize(fs.readFileSync(pngPath));
  if (!w || !h) throw new Error('Chart 렌더 출력이 유효한 PNG가 아니다');
  return { path: pngPath, wIn: w / DENSITY, hIn: h / DENSITY };
}

module.exports = { renderChart, CACHE_DIR };
