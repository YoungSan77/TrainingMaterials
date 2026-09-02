// 정상 — item.text 하나 안에 break:true가 여러 번(3개 이상) 있어도 richLineCount/renderBullets가
// 각 break를 독립된 segment로 정확히 처리해야 한다(2026-09 S01 Evidence slide 역반영 — 한 번의
// break만 검증하는 것으로는 일반화를 보장하지 못한다). 일반 계약이므로 S01 리터럴 문자열은 쓰지 않는다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 96, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: 'break가 여러 번 있는 item', visual: { type: 'bullets', data: [
      { head: '항목 1', text: [
        { text: '첫 줄', break: true },
        { text: '둘째 줄', break: true },
        { text: '셋째 줄', break: true },
        { text: '넷째 줄' }
      ] },
      { text: '두 번째 bullet' }
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
