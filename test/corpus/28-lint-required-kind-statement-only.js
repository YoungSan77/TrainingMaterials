// 결함: 필수 분류('현상')가 있긴 하지만 statement(단문)뿐이라 논증 슬라이드가 없다.
// statement는 분류 요건을 채우지 못한다 — engine 경로에서 lint.js가 내는 문구·exit 코드를 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 99, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '단문뿐인 현상'], ['03', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: '단문뿐인 현상', visual: { type: 'statement', text: '문장' }, notes: 'n' },
    { kind: '요약', head: '요약', title: '요약', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'takeaways', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
