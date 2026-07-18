// 결함: 항목 계열 body를 문자열로 준다(항목 계열 body = string[] 규약 위반).
// 회귀 방어: 예전에는 verify가 이 입력에서 `.reduce is not a function` TypeError로 죽었다.
// 지금은 엔진이 보정하므로 오류가 아니라 '보정 경고'로 뜬다 — 크래시로 되돌아가면 이 케이스가 잡는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', 'body 문자열']], slides: [
    { kind: '현상', title: 'body 문자열', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'versus', data: [
        { title: '가', body: '문자열로 준 본문이다.', negative: true },
        { title: '나', body: '이쪽도 문자열이다.' } ] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
