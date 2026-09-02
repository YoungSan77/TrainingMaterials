// 정상 — sub/question/lead/foot는 선택 필드다(engine/skeleton.js 2026-09 완화). 각 필드를 하나씩
// 생략한 경우와 넷 모두 생략한 경우 모두 정상 빌드돼야 한다(placeholder 없이). 특정 kind/slide
// 번호에 매인 검사가 아니라 일반 계약이라는 것을 고정한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 98, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    // 1) sub만 생략
    { kind: '학습 목표', title: 'sub 생략', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    // 2) question만 생략
    { kind: '현상', title: 'question 생략', sub: 's', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    // 3) lead만 생략
    { kind: '원칙', title: 'lead 생략', sub: 's', question: '왜?',
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    // 4) foot만 생략
    { kind: '적용', title: 'foot 생략', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      notes: 'n' },
    // 5) sub/question/lead/foot 전부 생략
    { kind: '요약', head: '요약', title: '전부 생략', visual: { type: 'takeaways', data: [
      { title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }
    ] }, notes: 'n' }
  ] }
};
