// 정상 — 줄 수가 많아 가로 열로는 안 들어가 세로 스택으로 전환되지만, 스택에선 밴드에 맞는다.
//   세로 스택 경로 자체가 렌더 성공해야 한다(크래시 없음 + 밴드 통과).
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 92, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: 'codepair 세로 스택', sub: 's', question: '어디로 갔나?', lead: { label: 'l', text: 't' },
      visual: { type: 'codepair', data: {
        versions: [
          { label: 'A', code: Array.from({ length: 14 }, (_, i) => `line ${i + 1} of version A do something`).join('\n') },
          { label: 'B', code: Array.from({ length: 14 }, (_, i) => `line ${i + 1} of version B do something`).join('\n') },
        ] } },
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
