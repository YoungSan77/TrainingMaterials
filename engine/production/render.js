'use strict';
// render.js — Page[] -> pptxgenjs Presentation. 순수 그리기(그리는 규칙은 geometry.js가
// 이미 잰 h를 그대로 쓴다 — 여기서 다시 재지 않는다. "재는 것과 그리는 것을 나눈다" 원칙).
const pptxgen = require('pptxgenjs');
const G = require('./geometry.js');

const C = { navy: '1B3A6B', dark: '2D3748', muted: '6B7280', line: 'CBD5E1', codeBg: 'F5F5F5' };
const FF = '맑은 고딕';
const FF_MONO = 'Consolas';

function stripMd(t) {
  // bold(**x**) 마커만 제거해 plain text로 그린다(P0 범위 — bold 텍스트 런 분할은 P2 확장).
  return String(t).replace(/\*\*(.+?)\*\*/g, '$1');
}

function addHeader(slide, pageInfo) {
  const title = pageInfo.continued ? `${pageInfo.topicTitle} (계속)` : pageInfo.topicTitle;
  const fs = G.titleFS(title || '');
  slide.addText(title || '', {
    x: G.MARGIN, y: G.TITLE_Y, w: G.CW, h: G.TITLE_H,
    fontSize: fs, fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'middle', margin: 0,
  });
  slide.addShape('line', { x: G.MARGIN, y: G.DIVIDER_Y, w: G.CW, h: 0, line: { color: C.navy, width: 1.5 } });
}

function addFooter(slide, pageNo, totalPages) {
  slide.addShape('line', { x: G.MARGIN, y: G.FOOTER_DIVIDER_Y, w: G.CW, h: 0, line: { color: C.line, width: 0.5 } });
  slide.addText(`${pageNo} / ${totalPages}`, {
    x: G.SLIDE_W - G.MARGIN - 1.2, y: G.FOOTER_TEXT_Y, w: 1.2, h: 0.2,
    fontSize: G.FS_FOOTER, fontFace: FF, color: C.muted, align: 'right', margin: 0,
  });
}

function drawBlock(slide, b, y) {
  const x = G.MARGIN, w = G.CW;
  switch (b.type) {
    case 'subheading':
      slide.addText(stripMd(b.text), { x, y, w, h: b.h, fontSize: G.FS_SUB, fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'top', margin: [2, 2, 2, 2] });
      break;
    case 'para':
      slide.addText(stripMd(b.text), { x, y, w, h: b.h, fontSize: G.FS_BODY, fontFace: FF, color: C.dark, align: 'left', valign: 'top', margin: [2, 2, 2, 2] });
      break;
    case 'bullets':
      slide.addText(stripMd(b.item.text), { x, y, w, h: b.h, fontSize: G.FS_BODY, fontFace: FF, color: C.dark, align: 'left', valign: 'top', margin: [2, 2, 2, 2], bullet: { indent: G.BULLET_INDENT_PT }, indentLevel: b.item.indent || 0 });
      break;
    case 'numbered':
      slide.addText(stripMd(b.item.text), { x, y, w, h: b.h, fontSize: G.FS_BODY, fontFace: FF, color: C.dark, align: 'left', valign: 'top', margin: [2, 2, 2, 2], bullet: { type: 'number', indent: G.BULLET_INDENT_PT }, indentLevel: b.item.indent || 0 });
      break;
    case 'code': {
      const codeText = b.lines.join('\n');
      slide.addText(codeText, {
        x, y, w, h: b.h, fontSize: G.FS_CODE, fontFace: FF_MONO, color: C.dark,
        align: 'left', valign: 'top', fill: { color: C.codeBg }, margin: [4, 6, 4, 6],
        lineSpacing: G.FS_CODE * 1.15,
      });
      break;
    }
    case 'table': {
      const rows = [];
      rows.push(b.header.map(h => ({ text: h, options: { bold: true, color: 'FFFFFF', fill: { color: C.navy }, fontSize: G.FS_TABLE, fontFace: FF, valign: 'middle' } })));
      b.rows.forEach(r => rows.push(r.map(c => ({ text: String(c ?? ''), options: { fontSize: G.FS_TABLE, fontFace: FF, color: C.dark, valign: 'top' } }))));
      const rowH = [b.headerH, ...b.rowHs];
      slide.addTable(rows, { x, y, w, colW: b.widths, rowH, border: { type: 'solid', color: C.line, pt: 0.75}, autoPage: false });
      break;
    }
    case 'diagram':
    case 'chart':
    case 'image': {
      const cx = x + (w - b.w) / 2;
      const opts = { x: cx, y, w: b.w, h: b.h };
      if (b.path) slide.addImage({ path: b.path, ...opts });
      else if (b.src) slide.addImage({ path: b.src, ...opts });
      break;
    }
    default:
      throw new Error(`render: 알 수 없는 block type ${b.type}`);
  }
}

function renderPptx(pages, meta = {}) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_4x3';
  if (meta.title) pres.title = meta.title;
  if (meta.author) pres.author = meta.author;
  // 재현성(determinism): pptxgenjs가 자동으로 넣는 revision/company 등 가변 필드를 고정한다.
  pres.company = meta.source || '';
  pres.revision = '1';

  pages.forEach((pg, idx) => {
    const slide = pres.addSlide();
    addHeader(slide, pg);
    let y = G.CONTENT_TOP;
    for (const b of pg.blocks) {
      drawBlock(slide, b, y);
      y += b.h;
    }
    addFooter(slide, idx + 1, pages.length);
  });
  return pres;
}

module.exports = { renderPptx, stripMd };
