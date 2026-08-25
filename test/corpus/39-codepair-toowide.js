// 결함: 코드 한 줄이 전폭·최소 폰트(9pt)에서도 안 들어간다 → verify "codepair 코드 한 줄이 ... 안 들어간다"(경고)
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 93, title: '코퍼스', toc: [['01', '너무 긴 줄']], slides: [
    { kind: '현상', title: '너무 긴 줄', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'codepair', data: { versions: [
        { label: 'A', code: 'x'.repeat(220) },
        { label: 'B', code: 'y'.repeat(10) },
      ] } },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
