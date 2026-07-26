// 특성화 ⑤(a): 상한 초과 길이(20pt 3줄)의 선언문 원문을 선언 장에 넣어도 'statement 문장이
// N줄이다' 오류가 없어야 한다(길이 면제, 구현 후) — 실제 S01 PoC에 쓸 문장 그대로다.
// 나머지 골격은 30번(case①)과 같은 완결 덱이다 — 그래야 '오류 0'이 길이 면제 하나만의
// 신호가 된다. 구현 전 지금은 kind 자체가 인식되지 않아(길이 오류까지 겹쳐) '오류 0'에
// 못 미친다 — gap:true. 대조는 35번(같은 문장을 일반 statement에 넣은 경우)이다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 93, title: '코퍼스', toc: [
    ['01', '선언'], ['02', '학습 목표'], ['03', '현상'], ['04', '원칙'], ['05', '적용'], ['06', '요약']
  ], slides: [
    { kind: '선언', title: '선언', visual: { type: 'statement',
      text: '품질 문제는 시스템에서 주로 발생한다. 결함 예방이 우선이고, 발생하면 바로 찾아 고친다. 시스템은 조직 영역이지만, 개선은 각자의 자리에서 시작한다.' },
      notes: 'n' },
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: '현상', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
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
