const base = (kind, claim, title, minutes) => ({ kind, claim, title, sub: 's', question: '왜?',
  lead: { label: 'l', text: 't' },
  visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
  foot: { kw: 'k', color: 'navy', body: 'b' }, notes: `배분 ${minutes}분` });
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  meta: { quotes: './quotes.corpus.md' },
  session: { no: 6, title: '코퍼스', toc: [
    ['01', '학습 목표'], ['02', '현상'], ['03', '현상 예시'], ['04', '원칙'], ['05', '적용'], ['06', '요약']
  ], slides: [
    base('학습 목표', null, '학습 목표', 2),
    base('현상', 'C1', '현상', 2), base('현상', 'C1', '현상 예시', 2),
    base('원칙', 'C2', '원칙', 2), base('적용', 'C3', '적용', 1),
    { ...base('요약', null, '요약', 1), head: '요약', visual: { type: 'takeaways', data: [
      { title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }
    ] } }
  ] }
};
