'use strict';
// validate.js — 생성된 PPTX를 "다시 읽어" 독립적으로 검증한다(엔진 내부 부기를 믿지 않는다).
//   1) 구조: slide 개수, XML well-formed
//   2) geometry: 모든 shape가 슬라이드 경계 안, content shape끼리 겹치지 않음
//   3) content: 각 block의 원문이 해당 slide 텍스트에(코드는 내부 공백 보존, 그 외는
//      공백 정규화 허용하여) 그대로 나타나는지
const JSZip = require('jszip');
const G = require('./geometry.js');

const EMU_PER_IN = 914400;

function extractShapes(xml) {
  const shapes = [];
  const spRe = /<p:sp>([\s\S]*?)<\/p:sp>/g;
  let m;
  while ((m = spRe.exec(xml))) {
    const body = m[1];
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/>/.exec(body);
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(body);
    const isLine = /<a:prstGeom prst="line"/.test(body);
    const texts = [...body.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(t => decodeXml(t[1]));
    if (!off || !ext) continue;
    shapes.push({
      x: Number(off[1]) / EMU_PER_IN, y: Number(off[2]) / EMU_PER_IN,
      w: Number(ext[1]) / EMU_PER_IN, h: Number(ext[2]) / EMU_PER_IN,
      isLine, text: texts.join('\n'),
    });
  }
  // table (p:graphicFrame) 도 경계만 확인(내부 셀 겹침은 표 렌더 자체가 다루므로 여기선 bbox만)
  const gfRe = /<p:graphicFrame>([\s\S]*?)<\/p:graphicFrame>/g;
  while ((m = gfRe.exec(xml))) {
    const body = m[1];
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/>/.exec(body);
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(body);
    if (!off || !ext) continue;
    const texts = [...body.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map(t => decodeXml(t[1]));
    shapes.push({
      x: Number(off[1]) / EMU_PER_IN, y: Number(off[2]) / EMU_PER_IN,
      w: Number(ext[1]) / EMU_PER_IN, h: Number(ext[2]) / EMU_PER_IN,
      isLine: false, isTable: true, text: texts.join('\n'),
    });
  }
  // image (p:pic)
  const picRe = /<p:pic>([\s\S]*?)<\/p:pic>/g;
  while ((m = picRe.exec(xml))) {
    const body = m[1];
    const off = /<a:off x="(-?\d+)" y="(-?\d+)"\/>/.exec(body);
    const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(body);
    if (!off || !ext) continue;
    shapes.push({
      x: Number(off[1]) / EMU_PER_IN, y: Number(off[2]) / EMU_PER_IN,
      w: Number(ext[1]) / EMU_PER_IN, h: Number(ext[2]) / EMU_PER_IN,
      isLine: false, isImage: true, text: '',
    });
  }
  return shapes;
}

function decodeXml(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

function rectsOverlap(a, b, eps = 0.01) {
  return a.x < b.x + b.w - eps && a.x + a.w > b.x + eps && a.y < b.y + b.h - eps && a.y + a.h > b.y + eps;
}

function normWS(s) { return String(s).replace(/\s+/g, ' ').trim(); }

async function validatePptx(buffer, pages, opts = {}) {
  const problems = [];
  const zip = await JSZip.loadAsync(buffer);
  const slideNames = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = Number(/slide(\d+)\.xml/.exec(a)[1]);
      const nb = Number(/slide(\d+)\.xml/.exec(b)[1]);
      return na - nb;
    });

  if (slideNames.length !== pages.length) {
    problems.push(`slide 개수 불일치 — 생성된 ${slideNames.length}장, pagination이 계획한 ${pages.length}장`);
  }

  for (let i = 0; i < slideNames.length; i++) {
    const xml = await zip.files[slideNames[i]].async('string');
    const shapes = extractShapes(xml);
    const slideText = shapes.map(s => s.text).join('\n');

    // geometry: 슬라이드 경계
    for (const s of shapes) {
      if (s.x < -0.02 || s.y < -0.02 || s.x + s.w > G.SLIDE_W + 0.02 || s.y + s.h > G.SLIDE_H + 0.02) {
        problems.push(`slide ${i + 1}: shape가 슬라이드 경계를 벗어난다 (x=${s.x.toFixed(2)} y=${s.y.toFixed(2)} w=${s.w.toFixed(2)} h=${s.h.toFixed(2)})`);
      }
    }
    // geometry: content shape 겹침(line 제외, 텍스트 있는 shape/table/image만)
    const content = shapes.filter(s => !s.isLine && (s.text || s.isTable || s.isImage));
    for (let a = 0; a < content.length; a++) {
      for (let b = a + 1; b < content.length; b++) {
        if (rectsOverlap(content[a], content[b])) {
          problems.push(`slide ${i + 1}: content shape 겹침 — [${content[a].text.slice(0, 20)}] vs [${content[b].text.slice(0, 20)}]`);
        }
      }
    }

    // content preservation: 이 페이지의 block 원문이 slide 텍스트에 들어있는지
    const pg = pages[i];
    if (pg) {
      for (const b of pg.blocks) {
        if (b.type === 'code') {
          const expected = b.lines.join('\n');
          if (!slideText.includes(expected) && !normWS(slideText).includes(normWS(expected))) {
            problems.push(`slide ${i + 1}: code block 원문이 렌더 결과에서 발견되지 않음(내용 손실 의심) — "${expected.slice(0, 40)}..."`);
          }
        } else if (b.type === 'para') {
          const expected = normWS(b.text.replace(/\*\*/g, ''));
          if (expected && !normWS(slideText).includes(expected)) {
            problems.push(`slide ${i + 1}: paragraph 원문 불일치 — "${expected.slice(0, 40)}..."`);
          }
        } else if (b.type === 'bullets' || b.type === 'numbered') {
          const expected = normWS(b.item.text.replace(/\*\*/g, ''));
          if (expected && !normWS(slideText).includes(expected)) {
            problems.push(`slide ${i + 1}: list item 원문 불일치 — "${expected.slice(0, 40)}..."`);
          }
        } else if (b.type === 'table') {
          const allCells = [b.header, ...b.rows].flat();
          for (const cell of allCells) {
            const expected = normWS(String(cell ?? ''));
            if (expected && !normWS(slideText).includes(expected)) {
              problems.push(`slide ${i + 1}: table cell 원문 불일치 — "${expected.slice(0, 40)}..."`);
            }
          }
        }
      }
    }
  }
  return { pass: problems.length === 0, problems };
}

module.exports = { validatePptx, extractShapes, rectsOverlap };
