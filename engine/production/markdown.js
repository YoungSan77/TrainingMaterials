'use strict';
// markdown.js — production engine용 Markdown parser.
// 목표는 lecture-ppt-java의 문법 부분집합 + PlantUML diagram directive 확장이다.
// (README: "가장 상위의 #, ##, ### 제목 수준을 주제 경계로 사용한다" — 문서에 실제
//  등장하는 최상위 heading level을 topic 경계로 삼는다. 그보다 깊은 level은 subheading.)
//
// LLM이 의미를 요약/보강하지 않는다는 lecture-ppt-java 원칙을 그대로 따른다: 이 parser는
// 원문 문자열을 blocks로 나눌 뿐, 텍스트를 고치거나 줄이지 않는다.

const LANG_TAG_RE = /^[A-Za-z][A-Za-z0-9+#._-]{0,19}$/;

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

function splitTableRow(line) {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  // 셀 안의 \| escaped pipe는 보존한다.
  const cells = [];
  let cur = '';
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '\\' && t[i + 1] === '|') { cur += '|'; i++; continue; }
    if (t[i] === '|') { cells.push(cur.trim()); cur = ''; continue; }
    cur += t[i];
  }
  cells.push(cur.trim());
  return cells;
}

// 원본 줄 배열 -> raw block 목록(paragraph 병합, heading, fence, list, table 식별까지).
// lang-tag-before-fence, diagram directive 처리는 여기서 하지 않고 topicize()에서 후처리한다
// (전체 문서의 최소 heading level을 먼저 알아야 topic 경계를 정할 수 있어서다).
function parseBlocks(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  const paraBuf = [];
  const flushPara = () => {
    if (paraBuf.length) {
      blocks.push({ type: 'para', lines: paraBuf.slice() });
      paraBuf.length = 0;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // blank line
    if (/^\s*$/.test(line)) { flushPara(); i++; continue; }

    // heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      blocks.push({ type: 'heading', level: h[1].length, text: h[2].trim() });
      i++; continue;
    }

    // fenced code (``` optionally followed by info string)
    const fence = /^```\s*(\S*)\s*$/.exec(line);
    if (fence) {
      flushPara();
      const info = fence[1] || '';
      const body = [];
      i++;
      let closed = false;
      while (i < lines.length) {
        if (/^```\s*$/.test(lines[i])) { closed = true; i++; break; }
        body.push(lines[i]);
        i++;
      }
      if (!closed) {
        throw new Error(`Markdown fence가 닫히지 않았다 — info="${info}", 시작 근처 내용: "${body[0] || ''}"`);
      }
      // trailing blank lines that belong to the fence body(원문 그대로 보존, 마지막 빈 줄 1개는 fence 관례상 제거)
      while (body.length && body[body.length - 1] === '') body.pop();
      blocks.push({ type: 'fence', info: info.trim(), lines: body });
      continue;
    }

    // table (header line + separator line)
    if (/^\s*\|/.test(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushPara();
      const header = splitTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // bullet list item
    const bullet = /^(\s*)[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const m = /^(\s*)[-*]\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        const indent = m[1].length;
        // 다음 줄들이 들여쓰기로 이어지면 같은 item에 계속(줄바꿈은 공백으로 합친다).
        let text = m[2];
        i++;
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(\s*)[-*]\s+/.test(lines[i])
               && !/^(\s*)\d+\.\s+/.test(lines[i]) && !/^```/.test(lines[i]) && !/^#{1,6}\s+/.test(lines[i])
               && !/^\s*\|/.test(lines[i])) {
          text += ' ' + lines[i].trim();
          i++;
        }
        items.push({ indent: Math.floor(indent / 2), text });
      }
      blocks.push({ type: 'bullets', items });
      continue;
    }

    // numbered list item
    const numbered = /^(\s*)\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const m = /^(\s*)\d+\.\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        const indent = m[1].length;
        let text = m[2];
        i++;
        while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(\s*)[-*]\s+/.test(lines[i])
               && !/^(\s*)\d+\.\s+/.test(lines[i]) && !/^```/.test(lines[i]) && !/^#{1,6}\s+/.test(lines[i])
               && !/^\s*\|/.test(lines[i])) {
          text += ' ' + lines[i].trim();
          i++;
        }
        items.push({ indent: Math.floor(indent / 2), text });
      }
      blocks.push({ type: 'numbered', items });
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      flushPara();
      const qlines = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        qlines.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', lines: qlines });
      continue;
    }

    // plain paragraph line
    paraBuf.push(line);
    i++;
  }
  flushPara();
  return blocks;
}

// paragraph 안에서 이미지 directive(![alt](src))만 단독으로 있는 경우 image block으로 승격한다.
function promoteImages(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.type === 'para' && b.lines.length === 1) {
      const m = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(b.lines[0].trim());
      if (m) { out.push({ type: 'image', alt: m[1], src: m[2] }); continue; }
    }
    out.push(b);
  }
  return out;
}

// fence 앞의 "언어 이름 한 줄짜리 문단"을 code block의 lang으로 흡수한다.
// (lecture-ppt-java의 input.md 자체가 이 문법을 쓴다: "SQL" 문단 -> 빈 줄 -> ``` fence)
// PlantUML diagram directive: info string이 "plantuml" 또는 "plantuml:<kind>"인 fence.
function resolveFencesAndDiagrams(blocks) {
  const out = [];
  for (let idx = 0; idx < blocks.length; idx++) {
    const b = blocks[idx];
    if (b.type === 'fence') {
      const infoMatch = /^plantuml(?::(\w+))?$/i.exec(b.info || '');
      if (infoMatch) {
        let kind = infoMatch[1];
        let bodyLines = b.lines.slice();
        if (!kind) {
          const km = /^\s*kind\s*:\s*(\w+)\s*$/i.exec(bodyLines[0] || '');
          if (km) { kind = km[1]; bodyLines = bodyLines.slice(1); }
        }
        if (!kind) throw new Error('PlantUML fence에 kind가 없다 — ```plantuml:<kind> 또는 첫 줄에 "kind: <kind>"를 지정한다');
        const source = bodyLines.filter(l => !/^\s*@(start|end)uml/i.test(l)).join('\n');
        out.push({ type: 'diagram', engine: 'plantuml', kind: kind.toLowerCase(), source });
        continue;
      }
      // Mermaid — "일반 구조/흐름/관계"(비-UML). UML은 여기로 오지 않는다(계속 PlantUML).
      if (/^mermaid$/i.test(b.info || '')) {
        out.push({ type: 'diagram', engine: 'mermaid', source: b.lines.join('\n') });
        continue;
      }
      // matplotlib chart — "정량 Chart". spec(JSON)은 authoring에서 이미 확정되어 들어온다.
      // Production은 type/data/label을 판단하지 않고 그대로 전달한다(집계·변환·자동선택 없음).
      if (/^(matplotlib|chart)$/i.test(b.info || '')) {
        let spec;
        try { spec = JSON.parse(b.lines.join('\n')); }
        catch (e) { throw new Error(`matplotlib chart fence의 내용이 유효한 JSON이 아니다: ${e.message}`); }
        out.push({ type: 'chart', spec });
        continue;
      }
      // 일반 code fence. info string에 언어가 있으면 그걸 쓰고, 없으면 직전의
      // "짧은 한 줄 문단"을 언어 태그로 흡수한다(최대 1개의 blank line을 사이에 두고 인접).
      let lang = b.info || '';
      if (!lang && out.length) {
        const prev = out[out.length - 1];
        if (prev.type === 'para' && prev.lines.length === 1 && LANG_TAG_RE.test(prev.lines[0].trim())) {
          lang = prev.lines[0].trim();
          out.pop();
        }
      }
      out.push({ type: 'code', lang, lines: b.lines });
      continue;
    }
    out.push(b);
  }
  return out;
}

// 문서 전체를 topic 단위로 나눈다. topic 경계 level = 문서에 실제 등장하는 최소 heading level.
// 그보다 깊은 heading은 topic 안의 subheading block으로 남긴다.
function topicize(blocks) {
  const headingLevels = blocks.filter(b => b.type === 'heading').map(b => b.level);
  if (!headingLevels.length) {
    return [{ title: null, level: 0, blocks: blocks.filter(b => b.type !== 'heading') }];
  }
  const topicLevel = Math.min(...headingLevels);
  const topics = [];
  let cur = null;
  for (const b of blocks) {
    if (b.type === 'heading' && b.level === topicLevel) {
      cur = { title: b.text, level: b.level, blocks: [] };
      topics.push(cur);
      continue;
    }
    if (b.type === 'heading') {
      // subheading — topic 안의 sub block으로 남긴다.
      const target = cur || (cur = { title: null, level: topicLevel, blocks: [] }, topics.push(cur), cur);
      target.blocks.push({ type: 'subheading', level: b.level, text: b.text });
      continue;
    }
    const target = cur || (cur = { title: null, level: topicLevel, blocks: [] }, topics.push(cur), cur);
    target.blocks.push(b);
  }
  return topics;
}

// 진입점: markdown 문자열 -> { topics: Topic[] }
function parseMarkdown(src) {
  let blocks = parseBlocks(src);
  blocks = promoteImages(blocks);
  blocks = resolveFencesAndDiagrams(blocks);
  const topics = topicize(blocks);
  return { topics };
}

module.exports = { parseMarkdown, parseBlocks, promoteImages, resolveFencesAndDiagrams, topicize };
