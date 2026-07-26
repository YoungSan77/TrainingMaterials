// 결함: foot(하단 결론)이 박스 여유를 넘는다.
// foot 박스는 y=5.90, h=1.0(render/pages.js 리터럴) — layout.js 기하 검증을 받지 않는
// 유일한 밴드였다. 14pt·폭 9.30in 기준 한 줄에 한글 약 45자, ftr 구분선까지 여유를
// 포함해도 1.20in(약 5줄)이 상한이다. 이 파일의 foot.body는 300자(7줄, 필요 1.63in)로
// 그 상한을 확실히 넘긴다.
// 원래는 gap:true(미검출 상태 그 자체를 기록하는) 케이스였다 — verify.js에 foot(+next)
// 길이 경고를 추가하면서 해소돼 정상 탐지 케이스로 승격했다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 89, title: '코퍼스', toc: [['01', 'foot 오버플로']], slides: [
    { kind: '현상', title: 'foot 오버플로', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: '가'.repeat(300) },
      notes: 'n' }
  ] }
};
