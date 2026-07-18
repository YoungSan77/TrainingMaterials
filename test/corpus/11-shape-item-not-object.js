// 결함: 항목 계열 data의 원소가 객체가 아니다(문자열 나열).
// 보정으로 뜻을 복원할 수 없다 → 오류. 측정 앞단에서 걸러야 하며, 재려 들면 검증기가 죽는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '항목 형태']], slides: [
    { kind: '원인', title: '항목 형태', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: ['그냥 문자열', '또 문자열', '세 번째'] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
