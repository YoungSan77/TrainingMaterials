module.exports = {
  book: {
    title: '현대적 SW 품질관리',
    subtitle: '진단에서 실행까지, 시스템을 바꾸는 순서'
  },
  // 시간 예산. cli.js course가 이 값으로 세션 분량 합계를 검사한다.
  course: { hours: 16, days: 2, breakMin: 10, bufferPct: 10 },
  // 구조화된 커리큘럼(요일·세션 목록). 세션 수만큼 items를 채운다.
  curriculum: [
    { day: '1일차 — 무엇을 만들고 무엇으로 확인하는가?',
      items: [
        '품질 문제의 원인',
        '품질관리의 정의와 이해당사자',
        '요구사항과 품질 계획',
        '동료검토와 감리/감사',
        '테스팅 전략'
      ] },
    { day: '2일차 — 무엇을 자동화하고 무엇을 바꾸는가?',
      items: [
        '자동화와 CI·CD 도입',
        '조직 구조와 작업자',
        '표준화·내재화와 보상',
        '지속적 개선 — PDCA와 도요타 카타',
        'AI 시대의 품질관리',
        '운영 모델과 실행 계획'
      ] },
  ],
  meta: {
    quotes: 'swqm_커리큘럼.md',   // 같은 폴더의 인용 자산(engine/quotes.js 형식). 없으면 빈 파일이어도 된다.
    // 본문 키워드 → 시각 타입 자동 감지(선택). 채우면 생성이 타입을 덜 틀린다.
    visualTriggers: {
      loop: [], pipeline: [], share: [], magnitude: [], pyramid: [], quadrant: []
    }
  }
};
