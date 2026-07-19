// 결함: 세션 유형에 없는 kind를 쓴다(설명형에 워크숍형 어휘).
// 유형이 요건을 정한다 — 현상·원인·원칙·적용·타협은 형식이 아니라 '개념을 가르치는 한 가지 교수법'이고,
// 그것이 계약에 박혀 있어 워크숍 세션까지 그 방식이 됐다. 유형은 그 전제를 밖으로 꺼낸 장치다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', type: '설명형', toc: [['01', '유형 위반']], slides: [
    { kind: '진행', title: '유형 위반', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
