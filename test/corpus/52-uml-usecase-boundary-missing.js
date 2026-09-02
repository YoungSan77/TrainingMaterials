// 결함 — uml usecase에 System Boundary가 없고 Actor-Use Case 관계가 방향 화살표(workflow처럼
// 보이는 -->)다. usecase 프로파일의 structural·forbiddenTokens가 잡아야 한다(2026-09, S02 Deck 실측).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 98, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: 'uml usecase Boundary 누락', sub: 's', question: '무엇이 잘못됐나?', lead: { label: 'l', text: 't' },
      visual: { type: 'uml', data: {
        kind: 'usecase',
        source: 'actor 고객\n(결제하기) as UC1\n고객 --> UC1' } },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '원칙', title: '원칙', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '적용', title: '적용', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '요약', head: '요약', title: '요약', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'takeaways', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
