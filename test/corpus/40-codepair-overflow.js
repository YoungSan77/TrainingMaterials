// 결함: 줄 수가 많아 세로 스택으로도 밴드를 넘는다(진짜 오버플로) → verify "codepair가 밴드를 넘는다"(오류)
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 94, title: '코퍼스', toc: [['01', '스택도 넘침']], slides: [
    { kind: '현상', title: '스택도 넘침', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'codepair', data: { versions: [
        { label: 'A', code: Array.from({ length: 22 }, (_, i) => `line ${i + 1} short`).join('\n') },
        { label: 'B', code: Array.from({ length: 22 }, (_, i) => `line ${i + 1} short`).join('\n') },
      ] } },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
