// [gap 문서 — 결함 아님, 미검출 상태를 기록한다]
// foot(하단 결론) 박스는 y=5.90, h=1.0(고정 리터럴) — layout.js 기하 검증을 받는 유일한
// 예외 밴드다. 14pt·폭 9.30in 기준 한 줄에 한글 약 45자, 1.0in엔 4줄까지 들어간다
// (ftr 구분선까지 여유를 다 써도 5줄). 아래 foot.body는 300자(7줄, 필요 1.63in)로
// 그 두 배를 넘겨 확실히 흘러넘치는데, 지금 verify.js에는 foot 길이를 재는 코드가
// 없어 아무 진단도 뜨지 않는다. test/corpus.js의 gap:true 케이스가 이 부재를 고정한다 —
// "다음 연결" 요약 렌더(§2 PoC 2단계)에서 foot+next 길이 경고를 추가하면 이 케이스가
// 뒤집혀 실패로 뜬다. 그때 이 파일과 corpus.js의 해당 항목을 정상 탐지 케이스로 승격한다.
module.exports = {
  curriculum: [{ day: 'Day 1 — 유형', items: ['제목'] }],
  session: { no: 89, title: '코퍼스', toc: [['01', 'foot 오버플로']], slides: [
    { kind: '현상', title: 'foot 오버플로', sub: 's', question: '왜?', lead: { label: 'l', text: 't' },
      visual: { type: 'boxes', data: [{ title: '가', body: ['한 줄'] }, { title: '나', body: ['한 줄'] }] },
      foot: { kw: 'k', color: 'navy', body: '가'.repeat(300) },
      notes: 'n' }
  ] }
};
