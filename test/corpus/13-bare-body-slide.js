// 결함: 본문 슬라이드에 visual이 없다 → 슬라이드 가운데(y 2.3~5.7)가 통째로 빈 채 렌더된다.
// 회귀 방어: 실제로 03에서 세 장이 이 상태로 만들어졌고 verify는 0/0을 냈다.
//   경고로 두면 쌓여서 읽히지 않는다 → skeleton.js의 골격 필수 필드로 올려 오류로 잡는다.
//   한 문장만 던질 자리는 statement가 담당한다(그것이 이 예외의 용도다).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '빈 본문']], slides: [
    { kind: '현상', title: '빈 본문', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
