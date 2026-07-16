module.exports = {
  book: {
    title: '현대적 품질 관리(Modern QM)',
    subtitle: '프로세스 내재화와 품질 파이프라인'
  },
  curriculum: [
    { day: 'Day 1 — 품질의 본질과 표준', items: ['품질 패러다임 전환과 Shift-Left', '품질을 만드는 3주체와 R&R', '글로벌 품질 표준 1 — ISO 9001', '프로세스 성숙도 — CMMI & SPICE', '감사(Audit)와 상시 준수(Continuous Compliance)', '예방의 최전선 — 동료 검토(Peer Review)', '요구사항과 품질 계획 — 가장 비싼 결함 막기', '워크숍 1 — 조직 품질 성숙도 자가 진단'] },
    { day: 'Day 2 — 지속적 검증과 엔지니어링', items: ['현대적 테스트 전략 — 피라미드와 자동화', '지속적 품질 파이프라인 — DevOps와 CI/CD', '개발자 경험(DX)과 아키텍처 (Team Topologies)', '방어적 품질 지표 설계 — DORA 매트릭스', '시스템 미비와 보상 체계의 재설계', '품질의 미래 — AI 시대의 QA', 'QM Operating Model (통합 운영 모델)', '워크숍 2 — 품질 파이프라인 액션 플랜'] }
  ],
  meta: {
    quotes: '../QM_커리큘럼.md',
    visualTriggers: {
      loop: ['악순환', '선순환', '되먹임', '상시 준수', '재유입'],
      pipeline: ['게이트', '되돌림', '파이프라인'],
      share: ['구성비', '비중'],
      magnitude: ['자릿수', '배로', '몇 배'],
      pyramid: ['피라미드', '계층 구조'],
      quadrant: ['두 축', '사분면']
    }
  }
};