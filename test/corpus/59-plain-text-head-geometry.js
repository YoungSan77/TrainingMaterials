// 정상 — item.head + 평문 문자열 item.text(배열이 아닌 경우)도 head가 자기 줄로, 본문이 다음
// 줄부터 렌더된다. layout.js의 측정과 render/visuals.js의 렌더가 이 조합에서 실제로 같은 줄 수를
// 가정하는지 고정한다(rich-run 배열이 아닌 평문 head+text 조합은 별도 경로라 따로 검증이 필요했다
// — 이전에는 이 경로가 'head — text' 한 줄로 측정되는데 렌더는 두 줄로 나와 측정과 렌더가 갈렸다).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 95, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: 'head + 평문 문자열', visual: { type: 'bullets', data: [
      { head: '항목 1', text: '평문 문자열 본문이며 폭에 따라 자연스럽게 줄바꿈되는 충분히 긴 문장을 사용해 실제 줄 수 측정이 렌더와 일치하는지 확인한다.' },
      { head: '항목 2', text: '두 번째 평문 본문.' }
    ] }, notes: 'n' },
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
