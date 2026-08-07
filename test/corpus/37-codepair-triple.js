// 정상 — codepair 3벌, marks+blanks(코더 빈칸) 동시 사용. 3열 가로 배치가 렌더 성공해야 한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 91, title: '코퍼스', toc: [['01', '학습 목표'], ['02', '현상'], ['03', '원칙'], ['04', '적용'], ['05', '요약']], slides: [
    { kind: '학습 목표', title: '학습 목표', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: 'b' }, notes: 'n' },
    { kind: '현상', title: 'codepair 3벌', sub: 's', question: '어디로 갔나?', lead: { label: 'l', text: 't' },
      visual: { type: 'codepair', data: {
        versions: [
          { label: '스파게티', code: 'Object cancel(String id) {\n  var row = jdbc.query(id);\n  return ok();\n}' },
          { label: 'TS', code: 'void execute(OrderId id) {\n  if (bad) throw new X();\n  o.setStatus(CANCELLED);\n}',
            marks: [{ line: 2, tag: 'R5' }], blanks: [3] },
          { label: '리치', code: 'void execute(OrderId id) {\n  o.cancel();\n  repo.save(o);\n}',
            marks: [{ line: 2, tag: 'R5·R6' }] },
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
