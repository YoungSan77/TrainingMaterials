'use strict';
// paginate.js — topic.blocks[] -> Page[] (Slide당 실제로 그릴 positioned block 목록).
//
// 원칙(lecture-ppt-java 동작 기준선을 그대로 따른다):
//   - 안전한 배치를 못 찾으면 내용을 줄이거나 폰트를 줄이지 않고 즉시 실패한다(명확한 에러).
//   - code는 `// N-M.` 주석 경계에서만 분할한다. 그 경계 안의 한 조각을 더 쪼개지 않는다.
//   - table은 행 경계에서 분할하고, 분할된 페이지마다 header를 반복한다.
//   - bullets/numbered는 item 경계에서 분할한다(의미를 안 깨는 유일한 분할 지점).
//   - paragraph는 원자 단위로 취급한다(문장을 잘라 배치하지 않는다 — 안 들어가면 실패).
const G = require('./geometry.js');

const CODE_BOUNDARY_RE = /^\s*\/\/\s*\d+-\d+\./;

function splitCodeAtBoundaries(lines) {
  const chunks = [];
  let cur = [];
  for (const l of lines) {
    if (CODE_BOUNDARY_RE.test(l) && cur.length) { chunks.push(cur); cur = []; }
    cur.push(l);
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

class Paginator {
  constructor({ renderDiagram, renderMermaid, renderChart } = {}) {
    this.renderDiagram = renderDiagram;     // PlantUML — UML 전용
    this.renderMermaid = renderMermaid;     // 일반 구조/흐름/관계(비-UML)
    this.renderChart = renderChart;         // 정량 chart(matplotlib)
    this.pages = [];
    this.cur = null;
    this.curH = 0;
    this.pageIdx = 0;
    this.topicTitle = null;
  }

  startTopic(title) {
    this.topicTitle = title;
    this.pageIdx = 0;
    this._newPage();
  }

  _newPage() {
    this.cur = { topicTitle: this.topicTitle, continued: this.pageIdx > 0, blocks: [] };
    this.pages.push(this.cur);
    this.curH = 0;
    this.pageIdx++;
  }

  _remaining() { return G.CONTENT_H - this.curH; }

  _place(block, h) {
    if (h > this._remaining() + 1e-6) {
      if (this.cur.blocks.length > 0) this._newPage();
      if (h > G.CONTENT_H + 1e-6) {
        throw new Error(
          `배치 실패 — topic "${this.topicTitle}"의 블록(type=${block.type})이 빈 슬라이드 content 영역` +
          `(${G.CONTENT_H.toFixed(2)}in)보다 크다(필요 ${h.toFixed(2)}in). 폰트를 줄이지 않는다 — 원고에서 이 블록을 나눠야 한다.`
        );
      }
    }
    this.cur.blocks.push({ ...block, h });
    this.curH += h;
  }

  addSubheading(text) {
    const h = G.paraHeight(text, G.FS_SUB) + 0.10;
    this._place({ type: 'subheading', text }, h);
  }

  addPara(lines) {
    const text = lines.join('\n');
    const h = G.paraHeight(text, G.FS_BODY) + 0.06;
    if (h > G.CONTENT_H + 1e-6) {
      throw new Error(`배치 실패 — topic "${this.topicTitle}"의 paragraph 하나가 빈 슬라이드보다 크다(문장을 나누지 않는다). 원문 미리보기: "${text.slice(0, 60)}..."`);
    }
    this._place({ type: 'para', text }, h);
  }

  addListItems(items, listType) {
    for (const it of items) {
      const h = G.paraHeight(it.text, G.FS_BODY, { bullet: true }) + 0.04;
      if (h > G.CONTENT_H + 1e-6) {
        throw new Error(`배치 실패 — topic "${this.topicTitle}"의 list item 하나가 빈 슬라이드보다 크다: "${it.text.slice(0, 60)}..."`);
      }
      this._place({ type: listType, item: it }, h);
    }
  }

  addCode(lang, lines) {
    // 폭 오버플로 우선 검사(줄바꿈으로 코드를 훼손하지 않으므로, 폭이 넘치면 분할이 아니라 즉시 실패).
    for (const l of lines) {
      if (G.codeLineOverflows(l)) {
        throw new Error(
          `배치 실패 — topic "${this.topicTitle}"의 code 한 줄이 슬라이드 폭을 넘는다(줄바꿈으로 들여쓰기를 깨지 않는다): "${l.slice(0, 80)}"`
        );
      }
    }
    const chunks = splitCodeAtBoundaries(lines);
    for (const chunk of chunks) {
      const h = G.codeBlockHeight(chunk);
      if (h > G.CONTENT_H + 1e-6) {
        throw new Error(
          `배치 실패 — topic "${this.topicTitle}"의 code 조각(경계 "// N-M." 기준)이 빈 슬라이드보다 크다` +
          `(줄 수 ${chunk.length}). 원고의 구현 단위를 더 작게 나눠야 한다.`
        );
      }
      this._place({ type: 'code', lang, lines: chunk }, h);
    }
  }

  addTable(header, rows) {
    const widths = G.computeColWidths(header, rows);
    const headerH = G.rowHeight(header, widths) ;
    const rowHs = rows.map(r => G.rowHeight(r, widths));
    if (headerH + Math.min(...rowHs.length ? rowHs : [0]) > G.CONTENT_H + 1e-6 && rows.length) {
      throw new Error(`배치 실패 — topic "${this.topicTitle}"의 table header + 최소 1행이 빈 슬라이드보다 크다.`);
    }
    let i = 0;
    while (i < rows.length || i === 0) {
      // 이 페이지(현재 남은 공간, header 포함)에 들어갈 수 있는 행을 최대한 채운다.
      let avail = this._remaining();
      let take = [];
      let need = headerH;
      if (need > avail + 1e-6) { this._newPage(); avail = this._remaining(); }
      let j = i;
      while (j < rows.length) {
        const rh = rowHs[j];
        if (headerH + take.reduce((a, b) => a + b, 0) + rh > avail + 1e-6) break;
        take.push(rh);
        j++;
      }
      if (j === i && rows.length) {
        // header만 들어가고 행이 하나도 안 들어감 — 새 페이지가 필요.
        if (this.cur.blocks.length > 0) { this._newPage(); continue; }
        throw new Error(`배치 실패 — topic "${this.topicTitle}"의 table row 하나가 header와 함께 빈 슬라이드에 안 들어간다.`);
      }
      const tableRows = rows.slice(i, j);
      const h = headerH + take.reduce((a, b) => a + b, 0);
      this._place({ type: 'table', header, rows: tableRows, widths, headerH, rowHs: take }, h);
      i = j;
      if (rows.length === 0) break;
      if (i >= rows.length) break;
    }
  }

  addImageLike(kind, natW, natH, extra) {
    // 이미지/다이어그램은 폭 기준으로 먼저 맞추고, 남은 세로 공간에도 맞게 추가로 축소한다
    // (텍스트 폰트를 줄이는 것과는 다른 종류의 동작 — 원본보다 "확대"는 하지 않는다).
    const maxW = G.CW;
    let w = Math.min(natW, maxW);
    let h = natH * (w / natW);
    const remaining = this._remaining();
    const capH = Math.max(remaining, G.CONTENT_H);
    if (h > capH) {
      if (remaining < G.CONTENT_H * 0.25 && this.cur.blocks.length > 0) {
        this._newPage();
        return this.addImageLike(kind, natW, natH, extra);
      }
      const scale = G.CONTENT_H / h;
      w *= scale; h = G.CONTENT_H;
    }
    if (h > this._remaining() + 1e-6 && this.cur.blocks.length > 0) { this._newPage(); }
    this._place({ type: kind, w, h, ...extra }, h);
  }

  addDiagram(block) {
    const { engine, kind, source } = block;
    if (engine === 'plantuml') {
      if (!this.renderDiagram) throw new Error('renderDiagram(PlantUML)이 주입되지 않았다 — UML diagram block을 처리할 수 없다');
      const { path, wIn, hIn } = this.renderDiagram({ kind, source });
      this.addImageLike('diagram', wIn, hIn, { path });
      return;
    }
    if (engine === 'mermaid') {
      if (!this.renderMermaid) throw new Error('renderMermaid가 주입되지 않았다 — mermaid diagram block을 처리할 수 없다');
      const { path, wIn, hIn } = this.renderMermaid({ source });
      this.addImageLike('diagram', wIn, hIn, { path });
      return;
    }
    throw new Error(`알 수 없는 diagram engine: "${engine}" — 지원: plantuml(UML), mermaid(구조/흐름/관계)`);
  }

  addChart(spec) {
    if (!this.renderChart) throw new Error('renderChart가 주입되지 않았다 — chart block을 처리할 수 없다');
    const { path, wIn, hIn } = this.renderChart(spec);
    this.addImageLike('chart', wIn, hIn, { path });
  }

  addImage(src, alt) {
    this.addImageLike('image', G.CW, G.CW * 0.6, { src, alt });
  }
}

function paginate(topics, deps = {}) {
  const p = new Paginator(deps);
  for (const topic of topics) {
    p.startTopic(topic.title);
    for (const b of topic.blocks) {
      switch (b.type) {
        case 'subheading': p.addSubheading(b.text); break;
        case 'para': p.addPara(b.lines); break;
        case 'bullets': p.addListItems(b.items, 'bullets'); break;
        case 'numbered': p.addListItems(b.items, 'numbered'); break;
        case 'code': p.addCode(b.lang, b.lines); break;
        case 'table': p.addTable(b.header, b.rows); break;
        case 'diagram': p.addDiagram(b); break;
        case 'chart': p.addChart(b.spec); break;
        case 'image': p.addImage(b.src, b.alt); break;
        case 'quote': p.addPara(b.lines); break;
        default: throw new Error(`알 수 없는 block type: ${b.type}`);
      }
    }
  }
  return p.pages;
}

module.exports = { paginate, Paginator, splitCodeAtBoundaries, CODE_BOUNDARY_RE };
