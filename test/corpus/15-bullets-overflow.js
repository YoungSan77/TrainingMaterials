// 결함: bullets가 상한(6줄)을 넘는다 → 슬라이드가 아니라 문서가 된다.
// 하한(2)도 같은 규칙이 막는다 — 항목 하나짜리 목록은 목록이 아니고, 그 자리는 lead나 statement가 맡는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 2, title: '코퍼스', toc: [['01', '불릿 과다']], slides: [
    { kind: '현상', title: '불릿 과다', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'bullets', data: [
        { text: '한 줄' }, { text: '두 줄' }, { text: '세 줄' },
        { text: '네 줄' }, { text: '다섯 줄' }, { text: '여섯 줄' }, { text: '일곱 줄' } ] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' }
  ] }
};
