// 02.js — S02. 문제 발견과 요구 이해 (CLEAN REGENERATION — Generation Quality Correction)
// Generation input: courses/ooad/course-design.md, courses/ooad/ooad-curriculum.md,
//   courses/ooad/sessions/s02-detailed-design.md, guides/커리큘럼_작성_지침.md
//   (Deck Generation Contract, incl. Citation Visibility / Visual Economy / Authoring
//   Metadata Boundary Rule 보완) — 계약: engine/skeleton.js·shape.js·session_types.js.
//   이전 02.js는 비교/reference로만 보고 내용을 복사·patch하지 않았다. 01.js는 스타일 참고만.
//   이번 회차에서 고친 4대 generation quality 결함:
//   (A) 내부 session identifier(S01~S04)를 learner-facing 필드에서 제거하고 관계/topic 언어로 치환
//   (B) Brooks·Larman 등 외부 authority의 출처(저작명)를 notes-only에서 learner-facing으로 노출
//   (C) 비교/grouping/boundary가 아닌 곳의 box류(versus/boxes) 사용을 bullets로 정리
//   (D) Use Case Diagram 3장 모두 System Boundary rectangle + 무방향 association(--)으로 재작성

const slides = [

  // 1. 학습 목표
  {
    kind: '학습 목표',
    title: '문제 발견과 요구 이해',
    sub: '고객 요구와 요구사항을 구분하고, Analysis를 사고 활동으로 적용해 요구를 구조화한다',
    question: '이 세션에서 무엇을 이해해야 하는가?',
    lead: { label: '학습 목표', text: '고객 요구를 검증된 요구사항으로 구체화하는 과정을 이해하고, Use Case·SSD·Operation Contract로 Analysis input을 완성한다.' },
    visual: { type: 'bullets', data: [
      { text: '고객이 말하는 요구와 분석·검증된 요구사항을 구분한다.' },
      { text: 'Essential Problem과 Solution Detail을 구분한다.' },
      { text: '좋은 요구사항의 자격과 기능·품질·제약을 구분한다.' },
      { text: '목적에 맞는 수집 기법을 선택하고 용어집을 관리한다.' },
      { text: 'Event-centered analysis로 Use Case·User Story·Domain Event를 연결한다.' },
      { text: 'Use Case→SSD→Operation Contract로 Domain State Change까지 분석한다.' }
    ] },
    foot: { kw: '관점', color: 'navy', body: '고객 요구는 Requirement Discovery의 입력이며, Analysis는 그 요구를 구현 결정과 분리해 이해하는 사고 활동이다.' },
    notes: '4분. 이전 세션의 Analysis ≠ Phase 원칙을 이 세션의 구체적 요구 분석 활동에 적용한다.'
  },

  // 2. 현상 — 고객 요구 ≠ 요구사항
  {
    kind: '현상',
    title: '고객 요구 ≠ 요구사항',
    sub: '고객이 말하는 것은 중요한 출발점이지만 그 자체가 Requirement는 아니다',
    question: '고객이 말한 것을 그대로 Requirement로 확정해도 되는가?',
    lead: { label: '구분', text: '고객의 요구는 Requirement의 정답이 아니라 Requirement Discovery의 입력이다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'need', label: '고객 요구' },
      { id: 'discovery', label: '발견' },
      { id: 'analysis', label: '분석' },
      { id: 'validation', label: '검증' },
      { id: 'requirement', label: '요구사항' }
    ], edges: [
      { from: 'need', to: 'discovery' },
      { from: 'discovery', to: 'analysis' },
      { from: 'analysis', to: 'validation' },
      { from: 'validation', to: 'requirement' }
    ] } },
    foot: { kw: '불확실성', color: 'failT', body: '정말 필요한가, 실제 문제를 해결하는가, 다른 요구와 모순되지 않는가와 같은 불확실성이 아직 남아 있다.' },
    notes: '3분. 정식 명칭은 Customer Need/Request → Discovery → Analysis → Validation → Requirement다(노드는 밀도상 국문 축약). 고객이 말하는 형태(문제·불편·기대·아이디어·기능·결과)는 구두로 짚는다.'
  },

  // 3. 현상 — Brooks: 고객도 처음부터 완전한 요구를 모른다 (citation: 저작명을 learner-facing lead에 노출)
  {
    kind: '현상',
    title: 'Brooks — 고객도 처음부터 완전한 요구를 모른다',
    sub: '복잡한 SW에서는 고객도 실제 solution을 경험하기 전까지 필요한 것을 완전히 알기 어렵다',
    question: '요구사항을 처음부터 완전한 형태의 답으로 받아 적을 수 있는가?',
    lead: { label: 'Brooks', text: '“The client does not know what he wants.” (No Silver Bullet) — 능력 부족이 아니라 복잡한 SW의 본질적 특성이다.' },
    visual: { type: 'bullets', data: [
      { text: '고객이 말하는 것 — 현재 표현할 수 있는 요구' },
      { text: '고객이 실제 필요로 하는 것 — 아직 완전히 알지 못하는 필요' },
      { text: '최선의 Solution — 경험한 뒤에야 드러나는 답' }
    ] },
    foot: { kw: '발견', color: 'navy', body: '요구사항은 받아 적는 대상이 아니라 발견하고 시험하고 학습하고 정제하는 대상이다.' },
    notes: '3분. Bezos·von Neumann·Lean의 관련 메시지는 이 세션 뒤쪽 공통 결론 슬라이드에서 함께 다룬다. [Sources] Brooks, No Silver Bullet.'
  },

  // 4. 원칙 — Essential Problem과 Solution Detail 분리
  {
    kind: '원칙',
    title: 'Essential Problem과 Solution Detail을 분리한다',
    sub: '고객 문장에는 문제·규칙·기대 결과·제안된 solution·기술 detail이 섞여 있을 수 있다',
    question: '이 문장에서 반드시 해결돼야 하는 본질적 문제는 무엇인가?',
    lead: { label: 'Essence / Accident', text: 'Requirement를 구체화한다는 것은 Solution을 일찍 고정하는 것이 아니라 Essential Problem을 더 정확하게 이해하는 것이다.' },
    visual: { type: 'boxes', data: [
      { title: 'Essential Need', body: ['고객은 원하는 상품을 주문할 수 있어야 한다.'] },
      { title: 'Solution Detail', body: ['주문하기 Button', 'orders table', 'INSERT'] }
    ] },
    foot: { kw: '이유', color: 'teal', body: 'Use Case·SSD·Operation Contract를 쓰는 이유도 외부에서 필요한 행위와 결과를 내부 구현 결정으로부터 분리하기 위해서다.' },
    notes: '3분. 원문: "고객이 주문하기 버튼을 눌러 orders 테이블에 새 row를 INSERT한다." 개발자도 assumption을 사실처럼 받아들일 수 있다 — von Neumann 관련 메시지는 공통 결론에서 다룬다.'
  },

  // 5. 원인 — Too Late vs Too Early (내부 identifier 제거: "이전 세션"으로 치환)
  {
    kind: '원인',
    title: '너무 늦은 발견과 너무 이른 확정 모두 재작업을 만든다',
    sub: '이전 세션에서 다룬 재작업 비용 문제를 요구 시점의 관점에서 다시 본다',
    question: '요구를 빨리 정하는 것과 늦게 정하는 것, 무엇이 문제인가?',
    lead: { label: '두 실패', text: '문제는 빨리 정하느냐 늦게 정하느냐가 아니라 충분한 정보 없이 확정하는 것이다.' },
    visual: { type: 'versus', data: [
      { title: 'Too Late', body: ['Late Discovery', 'Downstream Change', 'Rework', 'Higher Cost'], negative: true },
      { title: 'Too Early', body: ['정보 부족한 채 상세 확정', 'Requirement Change', 'Rework'], negative: true }
    ] },
    foot: { kw: '원칙', color: 'failT', body: '충분한 정보를 얻기 전에 확정하지 않고, 필요한 정보를 얻은 뒤에는 책임 있게 결정한다.' },
    notes: '3분. 이전 세션에서 다룬 Boehm의 재작업 비용 데이터를 짧게 회수한다(Recap Discipline). Lean의 Decide as Late as Possible은 공통 결론 슬라이드에서 다룬다.'
  },

  // 6. 원칙 — Requirement Change의 두 종류
  {
    kind: '원칙',
    title: 'Requirement Change의 두 종류',
    sub: '모든 요구 변경을 고객 변심으로 단순화하지 않는다',
    question: '요구가 바뀌는 이유는 항상 같은가?',
    lead: { label: '구분', text: '실제 환경 변화로 인한 change와 학습에 의한 change는 서로 다른 원인이다.' },
    visual: { type: 'versus', data: [
      { title: '실제 환경 변화', body: ['시장·법규·정책·경쟁 환경 변화', '새로운 Business Goal'], negative: false },
      { title: '학습에 의한 변화', body: ['실사용 후 새 필요 발견', 'Prototype에서 잘못된 가정 발견', '개발 중 새 제약 발견'], negative: false }
    ] },
    foot: { kw: '원칙', color: 'navy', body: 'Requirement Change = 고객 변심으로 단순화하면 안 된다.' },
    notes: '2분.'
  },

  // 7. 원칙 — Predictive vs Iterative/Agile: Analysis는 사라지지 않는다 (내부 identifier 제거)
  {
    kind: '원칙',
    title: 'Predictive vs Iterative/Agile — Analysis는 사라지지 않는다',
    sub: '분석·설계·구현을 분리하든 통합하든 Problem과 Solution을 구분하는 질문은 남는다',
    question: 'Analysis Phase가 명시적으로 없으면 Analysis도 없는 것인가?',
    lead: { label: '원칙', text: 'Process에서는 Analysis와 Design을 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.' },
    visual: { type: 'versus', data: [
      { title: 'Predictive', body: ['Elicit → Analyze → Specify → Validate → Baseline → Design/Build'], negative: false },
      { title: 'Iterative / Agile', body: ['Define ↔ Build ↔ Test'], negative: false }
    ] },
    foot: { kw: '차이', color: 'navy', body: '핵심 차이는 요구 변경을 허용하느냐가 아니라 현재 구현 결정을 내릴 만큼 문제 지식이 충분한가를 어떻게 확인하는가다.' },
    notes: '3분. 이전 세션에서 다룬 Define ↔ Build ↔ Test 흐름을 재호출한다(Recap Discipline).'
  },

  // 8. 원칙 — Requirement Baseline과 Problem Understanding (내부 identifier 제거)
  {
    kind: '원칙',
    title: 'Requirement Baseline과 Problem Understanding',
    sub: 'Requirement 문장을 승인했다고 문제 이해가 충분하다고 볼 수 없다',
    question: '복잡하거나 위험한 요구에서 무엇이 commitment의 근거가 되는가?',
    lead: { label: '구조', text: 'Static/Dynamic Understanding이 더해져 Problem Understanding이 되고, 이것이 baseline/commitment의 근거가 된다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'reqscenario', label: '요구/시나리오' },
      { id: 'staticdynamic', label: '정적·동적 이해' },
      { id: 'probunderstanding', label: '문제 이해' },
      { id: 'evidence', label: '충분한 근거' }
    ], edges: [
      { from: 'reqscenario', to: 'staticdynamic' },
      { from: 'staticdynamic', to: 'probunderstanding' },
      { from: 'probunderstanding', to: 'evidence' }
    ] } },
    foot: { kw: '경계', color: 'teal', body: '이 세션은 필요한 System Behavior와 Domain State Change까지 명확히 하고, 정적·동적 구조의 상세 모델링은 다음 세션들(정적 모델·동적 모델)로 이어간다.' },
    notes: '3분. 정식 명칭은 Requirement/Scenario → Static+Dynamic Understanding → Problem Understanding → Sufficient Evidence for Commitment/Baseline이다.'
  },

  // 9. 현상 — 공통 결론: 다섯 근거를 한 장에
  {
    kind: '현상',
    title: '공통 결론 — 다섯 근거를 한 장에 모은다',
    sub: 'Boehm·Standish·Bezos·von Neumann·Lean은 모두 같은 결론을 가리킨다',
    question: '이 다섯 근거가 함께 말하는 결론은 무엇인가?',
    lead: { label: '결론', text: '요구사항은 가능한 한 빨리 많이 확정하는 것이 목적이 아니다 — 필요한 시점에 필요한 수준으로 구체화한다.' },
    visual: { type: 'table', data: [
      ['근거', '핵심 메시지'],
      ['Boehm', '결함을 늦게 발견할수록 재작업 비용이 커진다'],
      ['Standish', '요구된 기능이 곧 필요한 기능은 아니다'],
      ['Bezos', '고객은 스스로 알기 전부터 더 나은 것을 원한다'],
      ['von Neumann', '무엇을 말하는지도 모르면서 정밀할 수는 없다'],
      ['Lean', 'Decide as Late as Possible — 너무 일찍 작성해 변경이 발생하기도 한다']
    ] },
    foot: { kw: '결론', color: 'navy', body: '요구사항은 필요한 것을 발견하고 불확실성을 관리하며, 필요한 시점에 필요한 수준으로 구체화하는 것이 목적이다.' },
    notes: '3분. Boehm·Standish 수치는 이전 세션에서 이미 확정했으므로 재호출만 한다(Recap Discipline: Boehm & Basili; Standish/Jim Johnson 2002). Bezos·von Neumann은 이 세션에서 처음 사용하는 원문이며 강사가 구두로 원문을 인용한다: Bezos “Even when they don’t yet know it, customers want something better.” / von Neumann “There’s no sense in being precise when you don’t even know what you’re talking about.” 별도 수치는 추가하지 않는다.'
  },

  // 10. 원칙 — ISO/IEC/IEEE 29148
  {
    kind: '원칙',
    title: 'ISO/IEC/IEEE 29148 — 개별 요구사항의 자격',
    sub: '좋은 요구사항은 많이 쓰거나 자세하게 쓰는 것이 아니다',
    question: '개별 요구사항이 갖춰야 할 자격은 무엇인가?',
    lead: { label: '자격', text: 'Necessary·Unambiguous·Complete·Feasible·Verifiable — 필요하고 명확하며 검증 가능하게 쓴다.' },
    visual: { type: 'bullets', data: [
      { text: 'Necessary — 실제로 필요한 요구인가' },
      { text: 'Unambiguous — 한 가지로만 해석되는가' },
      { text: 'Complete — 필요한 정보가 빠짐없이 있는가' },
      { text: 'Feasible — 현실적으로 구현 가능한가' },
      { text: 'Verifiable — 충족 여부를 검증할 수 있는가' }
    ] },
    foot: { kw: '핵심', color: 'navy', body: '좋은 요구사항은 필요하고 명확하며 검증 가능하게 쓰는 것이다.' },
    notes: '2분. 출처(ISO/IEC/IEEE 29148)는 title에 표시했다 — 표준 번호 자체가 식별자다.'
  },

  // 11. 원칙 — 요구사항의 유형
  {
    kind: '원칙',
    title: '요구사항의 유형',
    sub: 'Use Case는 모든 Requirement를 표현하는 도구가 아니다',
    question: 'Business Requirement에서 System Requirement까지 어떻게 구체화되는가?',
    lead: { label: '계층', text: 'Use Case는 주로 Actor Goal과 Functional Behavior를 분석하는 데 사용한다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'business', label: '업무 요구' },
      { id: 'stakeholder', label: '이해관계자 요구' },
      { id: 'system', label: '시스템 요구' },
      { id: 'functional', label: '기능' },
      { id: 'quality', label: '품질' },
      { id: 'constraint', label: '제약' }
    ], edges: [
      { from: 'business', to: 'stakeholder' },
      { from: 'stakeholder', to: 'system' },
      { from: 'system', to: 'functional' },
      { from: 'system', to: 'quality' },
      { from: 'system', to: 'constraint' }
    ] } },
    foot: { kw: '핵심', color: 'navy', body: '요구사항은 Business에서 System 수준으로 구체화되며, System 요구는 Functional·Quality·Constraint로 나뉜다.' },
    notes: '2분. 정식 명칭은 Business Requirement → Stakeholder/User Requirement → System/Software Requirement(Functional/Quality/Constraint)다.'
  },

  // 12. 원칙 — ISO/IEC 25010:2023
  {
    kind: '원칙',
    title: 'ISO/IEC 25010:2023 — Product Quality Model',
    sub: 'Quality Requirement의 범위를 놓치지 않기 위한 관점까지만 다룬다',
    question: '기능 요구사항만으로 충분한가?',
    lead: { label: '품질특성', text: 'Functional Suitability·Performance Efficiency·Reliability·Security·Maintainability 등 9개 품질 특성으로 범위를 넓게 확인한다.' },
    visual: { type: 'bullets', data: [
      { text: 'Functional Suitability' },
      { text: 'Performance Efficiency' },
      { text: 'Reliability' },
      { text: 'Security' },
      { text: 'Maintainability 등 9개 특성' }
    ] },
    foot: { kw: '경계', color: 'teal', body: '품질속성의 정량화·architectural driver·trade-off는 SW Architecture 과정으로 넘긴다.' },
    notes: '2분. 출처(ISO/IEC 25010:2023)는 title에 표시했다 — 표준 번호 자체가 식별자다.'
  },

  // 13. 원칙 — 요구사항 수집과 발견
  {
    kind: '원칙',
    title: '요구사항 수집과 발견',
    sub: '기법을 먼저 선택하지 말고 줄여야 할 불확실성을 먼저 찾는다',
    question: '무엇을 모르는지 확인하지 않고 기법부터 고를 수 있는가?',
    lead: { label: '원칙', text: '무엇을 모르는가, 누가 아는가, 무엇을 봐야 하는가를 먼저 확인한다.' },
    visual: { type: 'bullets', data: [
      { text: '무엇을 모르는가?' },
      { text: '누가 알고 있는가?' },
      { text: '누구에게 물어야 하는가?' },
      { text: '무엇을 직접 봐야 하는가?' },
      { text: '무엇을 만들어 보여줘야 하는가?' }
    ] },
    foot: { kw: '원칙', color: 'navy', body: '기법을 먼저 선택하지 말고 줄여야 할 불확실성을 먼저 찾는다.' },
    notes: '2분.'
  },

  // 14. 원칙 — 수집 방법의 선택 (table: 실제 비교 매핑이므로 table 유지 — Visual Economy상 정당)
  {
    kind: '원칙',
    title: '수집 방법의 선택',
    sub: 'Interview·Observation·Workshop·Prototype는 서로 다른 것을 잘 드러낸다',
    question: '각 방법으로 잘 알 수 있는 것과 주의할 점은 무엇인가?',
    lead: { label: '선택', text: '하나의 만능 기법은 없다 — 줄이려는 불확실성에 맞는 방법을 고른다.' },
    visual: { type: 'table', data: [
      ['방법', '잘 알 수 있는 것', '주의할 점'],
      ['Interview', '목표, 규칙, 예외, 판단 이유', '말한 내용과 실제 행동이 다를 수 있음'],
      ['Observation', '실제 업무, 암묵지, 우회 절차', '관찰만으로 의도를 알기 어려울 수 있음'],
      ['Workshop', '이해관계 충돌, 범위, 용어, 우선순위', '강한 이해관계자에게 논의가 편향될 수 있음'],
      ['Prototype', '표현하기 어려운 요구와 interaction', 'Prototype을 확정 solution으로 오해할 수 있음']
    ] },
    foot: { kw: '선택', color: 'navy', body: '말한 내용·실제 행동·이해관계 충돌·표현하기 어려운 요구는 각각 다른 방법으로 드러난다.' },
    notes: '3분.'
  },

  // 15. 원칙 — Prototype
  {
    kind: '원칙',
    title: 'Prototype — 보여주면서 요구를 발견한다',
    sub: '말과 문서만으로 알 수 없는 Requirement를 보면서 발견하고 검증한다',
    question: '말과 문서만으로 모든 요구를 알 수 있는가?',
    lead: { label: '발견', text: 'Assumption을 Prototype으로 보여주고 사용하게 하여 Feedback으로 Requirement를 정제한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'assumption', label: '가정' },
      { id: 'prototype', label: '시제품' },
      { id: 'use', label: '사용' },
      { id: 'feedback', label: '피드백' },
      { id: 'learn', label: '학습' },
      { id: 'refine', label: '요구 정제' }
    ], edges: [
      { from: 'assumption', to: 'prototype' },
      { from: 'prototype', to: 'use' },
      { from: 'use', to: 'feedback' },
      { from: 'feedback', to: 'learn' },
      { from: 'learn', to: 'refine' }
    ] } },
    foot: { kw: '주의', color: 'failT', body: 'Prototype을 확정 solution으로 오해할 수 있다.' },
    notes: '2분. 정식 명칭은 Assumption → Prototype → See/Use → Feedback → Learn → Requirement Refinement다.'
  },

  // 16. 원칙 — Wireframe + 복잡한 업무 화면
  {
    kind: '원칙',
    title: 'Wireframe과 복잡한 업무 화면',
    sub: '단순 정보 구조와 복잡한 업무 판단은 서로 다른 확인 항목을 요구한다',
    question: '실제로 이 화면으로 업무를 수행할 수 있는가?',
    lead: { label: '핵심 질문', text: '실제로 이 화면으로 업무를 수행할 수 있는가를 확인한다.' },
    visual: { type: 'versus', data: [
      { title: 'Wireframe', body: ['정보 구조', '주요 입력/출력', 'Navigation', '주요 Action', 'Interaction Flow'], negative: false },
      { title: '복잡한 업무 화면', body: ['동시에 필요한 정보', '업무 판단 순서', '상태별 가능한 Action', 'Exception', '정보 간 관계'], negative: false }
    ] },
    foot: { kw: '질문', color: 'navy', body: '실제로 이 화면으로 업무를 수행할 수 있는가?' },
    notes: '2분.'
  },

  // 17. 원칙 — Report Prototype
  {
    kind: '원칙',
    title: 'Report Prototype',
    sub: 'Sample Report 자체가 Requirement Discovery 도구가 된다',
    question: '보고서를 만들려면 무엇을 먼저 확인해야 하는가?',
    lead: { label: '확인 항목', text: '지표·산식·집계 기준부터 의사결정 목적까지 확인한다.' },
    visual: { type: 'bullets', data: [
      { text: '지표·산식·집계 기준' },
      { text: '기간·비교 기준' },
      { text: 'Drill-down·정렬·필터' },
      { text: '의사결정 목적' }
    ] },
    foot: { kw: '도구', color: 'teal', body: 'Sample Report / Mock Report 자체가 Requirement Discovery 도구가 된다.' },
    notes: '2분.'
  },

  // 18. 적용 — EventStorming
  {
    kind: '적용',
    title: 'EventStorming — 함께 Event를 발견한다',
    sub: '업무를 아는 사람과 개발자가 함께 Domain Event를 시간순으로 배열해 빠진 것을 발견한다',
    question: 'Order 흐름에서 EventStorming은 무엇을 드러내는가?',
    lead: { label: '예', text: 'Customer placed order → Order total determined → Payment requested → Payment completed를 배열하며 Trigger/Actor/Rule/Question을 확인한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'present', label: '사건 제시' },
      { id: 'sequence', label: '시간순 정리' },
      { id: 'confirm', label: '규칙 확인' },
      { id: 'gap', label: '누락 발견' },
      { id: 'usecase', label: 'UC 연결' }
    ], edges: [
      { from: 'present', to: 'sequence' },
      { from: 'sequence', to: 'confirm' },
      { from: 'confirm', to: 'gap' },
      { from: 'gap', to: 'usecase' }
    ] } },
    foot: { kw: '경계', color: 'teal', body: '이 세션은 workshop 활용과 요구 발견 연결까지만 다룬다 — Aggregate·Bounded Context·Context Map은 확장하지 않는다.' },
    notes: '3분. 정식 명칭은 업무 사건 제시 → 시간순 인과관계 정리 → Trigger/Actor/Rule/Question 확인 → 누락·충돌 발견 → Use Case 후보 연결이다.'
  },

  // 19. 원칙 — 왜 Use Case인가
  {
    kind: '원칙',
    title: '왜 Use Case인가',
    sub: '“어떤 기능이 있어야 하는가”가 아니라 “Actor가 어떤 Goal을 달성하려 하는가”를 묻는다',
    question: '기능 목록과 Use Case는 무엇이 다른가?',
    lead: { label: '전환', text: 'Actor Goal에서 출발하면 사용 목적과 직접 관계없는 기능을 최소화할 수 있다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'actor', label: 'Actor' },
      { id: 'goal', label: 'Goal' },
      { id: 'event', label: 'Event' },
      { id: 'behavior', label: 'Behavior' },
      { id: 'feature', label: '기능' }
    ], edges: [
      { from: 'actor', to: 'goal' },
      { from: 'goal', to: 'event' },
      { from: 'event', to: 'behavior' },
      { from: 'behavior', to: 'feature' }
    ] } },
    foot: { kw: '질문', color: 'navy', body: '“이 Actor는 시스템을 이용하여 어떤 Goal을 달성하려 하는가?”' },
    notes: '2분. 정식 명칭은 Specific Actor → Actor Goal → 필요한 Event → 필요한 System Behavior → 필요한 기능이다.'
  },

  // 20. 원칙 — Use Case 정의 (boxes: Actor/Goal/System/Behavior는 정의를 이루는 4개의 distinct semantic unit)
  {
    kind: '원칙',
    title: 'Use Case 정의',
    sub: 'Actor가 System을 사용하여 가치 있는 Goal을 달성하기 위해 필요한 System Behavior',
    question: 'Use Case의 핵심 요소는 무엇인가?',
    lead: { label: '정의', text: 'Actor가 System을 사용하여 가치 있는 Goal을 달성하기 위해 필요한 System Behavior다.' },
    visual: { type: 'boxes', data: [
      { title: 'Actor', body: ['System과 상호작용하는 외부 Role'] },
      { title: 'Goal', body: ['달성하려는 가치 있는 결과'] },
      { title: 'System', body: ['분석·구축 대상'] },
      { title: 'Behavior', body: ['Goal 달성에 필요한 System의 행위'] }
    ] },
    foot: { kw: '핵심 요소', color: 'navy', body: 'Actor·Goal·System·Behavior 네 요소로 구성된다.' },
    notes: '2분.'
  },

  // 21. 원칙 — Use Case의 본질은 Text다 (Larman) — citation: 저작명을 learner-facing lead에 노출
  {
    kind: '원칙',
    title: 'Use Case의 본질은 Text다 — Larman',
    sub: 'Diagram을 그리는 것이 Use Case 분석의 본질이 아니다',
    question: 'Use Case Diagram을 잘 그리면 Use Case 분석이 끝나는가?',
    lead: { label: 'Larman', text: 'Use Case ≠ Use Case Diagram (Applying UML and Patterns) — Diagram은 Overview, Text가 Behavior/Requirement Detail이다.' },
    visual: { type: 'versus', data: [
      { title: 'Use Case Diagram', body: ['Overview / Map'], negative: false },
      { title: 'Use Case Text', body: ['Behavior / Requirement Detail'], negative: false }
    ] },
    foot: { kw: '본질', color: 'teal', body: 'Diagram을 그리는 것이 Use Case 분석의 본질이 아니다.' },
    notes: '2분. [Sources] Larman, Applying UML and Patterns.'
  },

  // 22. 원칙 — Actor 정의와 식별
  {
    kind: '원칙',
    title: 'Actor — 정의와 식별',
    sub: 'System과 상호작용하는 외부 Role',
    question: '누가 Actor인가?',
    lead: { label: '식별 질문', text: '누가 시스템을 사용하고, 정보를 제공하고, 결과를 받으며, 어떤 외부 사건이 System Behavior를 시작하는가?' },
    visual: { type: 'bullets', data: [
      { text: 'Customer' },
      { text: 'Administrator' },
      { text: 'Payment Gateway' },
      { text: 'External System' },
      { text: 'Scheduler' }
    ] },
    foot: { kw: '예', color: 'navy', body: '사람뿐 아니라 외부 시스템·스케줄러도 Actor가 될 수 있다.' },
    notes: '2분.'
  },

  // 23. 원칙 — System Boundary
  {
    kind: '원칙',
    title: 'System Boundary',
    sub: '무엇을 우리가 분석하고 만들 System으로 볼 것인가',
    question: 'Boundary 안과 밖은 각각 무엇인가?',
    lead: { label: '경계', text: 'Boundary 안은 분석 대상 System의 책임, Boundary 밖은 Actor와 External System이다.' },
    visual: { type: 'versus', data: [
      { title: 'Boundary 안', body: ['분석 대상 System의 책임'], negative: false },
      { title: 'Boundary 밖', body: ['Actor', 'External System'], negative: false }
    ] },
    foot: { kw: '질문', color: 'navy', body: '무엇을 우리가 분석하고 만들 System으로 볼 것인가?' },
    notes: '1분.'
  },

  // 24. 원칙 — Association
  {
    kind: '원칙',
    title: 'Association',
    sub: '어떤 Actor가 어떤 Use Case에 참여하는가를 보여준다',
    question: 'Association은 업무 흐름이나 호출 순서를 의미하는가?',
    lead: { label: '의미', text: 'Association은 참여 관계만 보여준다 — 업무 흐름, 데이터 흐름, 호출 순서를 의미하지 않는다.' },
    visual: { type: 'bullets', data: [
      { text: '어떤 Actor가 어떤 Use Case에 참여하는가를 보여준다.' },
      { text: '업무 흐름을 의미하지 않는다.' },
      { text: '데이터 흐름을 의미하지 않는다.' },
      { text: '호출 순서를 의미하지 않는다.' }
    ] },
    foot: { kw: '주의', color: 'failT', body: 'Association을 실행 순서로 오해하지 않는다 — Diagram에서도 방향 화살표가 아니라 무방향 선으로 그린다.' },
    notes: '1분.'
  },

  // 25. 원칙 — Use Case Diagram (표기 자체) — [D] System Boundary rectangle + 무방향 association
  {
    kind: '원칙',
    title: 'Use Case Diagram',
    sub: 'System Boundary·Actor·Use Case·Association을 함께 표기한다',
    question: 'Use Case Diagram이 보여주는 것은 무엇인가?',
    lead: { label: '목적', text: 'System Boundary·주요 Actor·Actor Goal·전체 Use Case 범위를 확인한다.' },
    visual: { type: 'uml', data: {
      kind: 'usecase',
      source: 'left to right direction\nactor Actor\nrectangle "System" {\n  usecase "Use Case" as UC1\n}\nActor -- UC1'
    } },
    foot: { kw: '목적', color: 'navy', body: 'System Boundary 확인, 주요 Actor 확인, Actor Goal 확인, 전체 Use Case 범위 확인이 목적이다.' },
    notes: '2분. Actor는 Boundary 밖, Use Case는 Boundary 안, Association은 무방향 선(--)이다 — 방향 화살표는 workflow처럼 보여 쓰지 않는다.'
  },

  // 26. 적용 — Order Use Case Diagram — [D] System Boundary rectangle + 무방향 association
  {
    kind: '적용',
    title: 'Order Use Case Diagram',
    sub: '각 Actor에게 실제 필요한 Goal이 무엇인가를 확인한다',
    question: 'Order System에는 어떤 Actor와 Use Case가 있는가?',
    lead: { label: '예', text: 'Customer·Payment Gateway·Administrator가 서로 다른 Goal로 Order System과 상호작용한다.' },
    visual: { type: 'uml', data: {
      kind: 'usecase',
      source: 'left to right direction\nactor Customer\nactor "Payment Gateway" as PG\nactor Administrator\nrectangle "Order System" {\n  usecase "Place Order" as UC1\n  usecase "Check Order Status" as UC2\n  usecase "Pay Order" as UC3\n  usecase "Manage Order" as UC4\n}\nCustomer -- UC1\nCustomer -- UC2\nCustomer -- UC3\nPG -- UC3\nAdministrator -- UC4'
    } },
    foot: { kw: '핵심', color: 'navy', body: '각 Actor에게 실제 필요한 Goal이 무엇인지 확인하는 것이 핵심이다.' },
    notes: '3분.'
  },

  // 27. 원칙 — Use Case Diagram 작성 방법
  {
    kind: '원칙',
    title: 'Use Case Diagram 작성 방법',
    sub: 'System Boundary 결정부터 Scope 검토까지 여섯 단계로 진행한다',
    question: 'Use Case Diagram은 어떤 순서로 작성하는가?',
    lead: { label: '순서', text: 'System Boundary를 먼저 정하고 Actor·Goal·Use Case·Association 순서로 채운다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'boundary', label: 'Boundary' },
      { id: 'actor', label: 'Actor' },
      { id: 'goal', label: 'Goal' },
      { id: 'usecase', label: 'UC 정의' },
      { id: 'assoc', label: '연결' },
      { id: 'scope', label: 'Scope' }
    ], edges: [
      { from: 'boundary', to: 'actor' },
      { from: 'actor', to: 'goal' },
      { from: 'goal', to: 'usecase' },
      { from: 'usecase', to: 'assoc' },
      { from: 'assoc', to: 'scope' }
    ] } },
    foot: { kw: '순서', color: 'navy', body: 'Boundary를 먼저 정하지 않으면 Actor와 Use Case의 경계도 흔들린다.' },
    notes: '2분. 정식 명칭은 System Boundary 결정 → Actor 식별 → Actor Goal 식별 → Goal을 Use Case로 정의 → Association 연결 → Scope/Level 검토다.'
  },

  // 28. 적용 — 좋은 Use Case를 찾는 질문
  {
    kind: '적용',
    title: '좋은 Use Case를 찾는 질문',
    sub: 'Actor에게 가치 있는 결과인지, 너무 잘게 쪼갠 것은 아닌지 확인한다',
    question: 'Place Order는 좋은 Use Case이고 Click Submit Button은 왜 아닌가?',
    lead: { label: '판별', text: 'Actor의 Goal이자 가치 있는 결과인지, 단순 UI action이나 내부 operation은 아닌지 확인한다.' },
    visual: { type: 'versus', data: [
      { title: '좋은 예', body: ['Place Order', 'Check Order Status', 'Pay Order'], negative: false },
      { title: '부적절한 수준', body: ['Click Submit Button', 'Validate Product ID', 'Insert Order Row'], negative: true }
    ] },
    foot: { kw: '질문', color: 'failT', body: 'Actor에게 가치 있는 결과인가, Actor의 Goal인가, 단순 UI action이나 내부 operation은 아닌가?' },
    notes: '2분.'
  },

  // 29. 원칙 — Use Case Specification
  {
    kind: '원칙',
    title: 'Use Case Specification',
    sub: 'Use Case Diagram을 완성했다고 분석이 끝난 것이 아니다',
    question: 'Diagram 다음에 무엇을 정의해야 하는가?',
    lead: { label: '항목', text: 'Name·Scope·Primary Actor·Precondition·Trigger·Main Success Scenario·Alternative/Exception Flow·Postcondition을 정의한다.' },
    visual: { type: 'bullets', data: [
      { text: 'Use Case Name / Scope' },
      { text: 'Primary Actor / Stakeholders' },
      { text: 'Preconditions / Trigger' },
      { text: 'Main Success Scenario' },
      { text: 'Alternative / Exception Flows' },
      { text: 'Postconditions' }
    ] },
    foot: { kw: '핵심', color: 'navy', body: 'Use Case Diagram을 완성했다고 Use Case 분석이 끝난 것이 아니다.' },
    notes: '2분.'
  },

  // 30. 적용 — Main Success Scenario 작성법 (steps: 순차 진행이므로 정당)
  {
    kind: '적용',
    title: 'Main Success Scenario — 좋은 Scenario 작성법',
    sub: 'Actor Action → System Response 흐름으로 외부에서 관찰 가능한 행위만 쓴다',
    question: 'Check Order Status의 Main Success Scenario는 어떻게 쓰는가?',
    lead: { label: '예', text: 'Customer가 조회를 요청하면 System이 주문을 식별하고 현재 상태를 제공한다.' },
    visual: { type: 'steps', data: [
      { title: '1. Customer 요청', body: ['자신의 주문 상태 조회를 요청한다'] },
      { title: '2. System 식별', body: ['조회할 주문을 식별한다'] },
      { title: '3. System 응답', body: ['현재 주문 상태를 제공한다'] }
    ] },
    foot: { kw: '금지', color: 'failT', body: 'Controller·Service·Repository·Database·Table·Design Pattern은 쓰지 않는다 — 구현 방법이 아니라 관찰 가능한 Behavior를 기술한다.' },
    notes: '3분. Actor Action → System Response → Actor Action → System Response 패턴을 구두로 짚는다.'
  },

  // 31. 원칙 — Alternative Flow / Exception Flow
  {
    kind: '원칙',
    title: 'Alternative Flow / Exception Flow',
    sub: 'Main Success Scenario와 다른 의미 있는 경로를 정의한다',
    question: '정상 흐름과 다른 경로는 언제 필요한가?',
    lead: { label: '예', text: '조회할 주문을 찾을 수 없거나 Customer에게 조회 권한이 없는 경우를 분리해 정의한다.' },
    visual: { type: 'boxes', data: [
      { title: 'Alternative Flow', body: ['정상 흐름의 변형 경로'] },
      { title: 'Exception Flow', body: ['조회할 주문을 찾을 수 없음', 'Customer에게 조회 권한이 없음'] }
    ] },
    foot: { kw: '목적', color: 'navy', body: 'Main Success Scenario와 다른 의미 있는 경로를 분리해 누락을 막는다.' },
    notes: '2분.'
  },

  // 32. 원칙 — Flow와 Scenario 구분
  {
    kind: '원칙',
    title: 'Flow와 Scenario 구분',
    sub: 'Flow는 정의된 경로, Scenario는 실제 실행된 구체적 인스턴스다',
    question: 'Flow와 Scenario는 같은 것인가?',
    lead: { label: '구분', text: 'Flow는 Use Case Specification에 정의된 가능한 행동 경로이고, Scenario는 그 Flow를 따라 실제 한 번 수행되는 구체적 실행 인스턴스다.' },
    visual: { type: 'versus', data: [
      { title: 'Flow', body: ['Use Case Specification에 정의된 가능한 행동 경로'], negative: false },
      { title: 'Scenario', body: ['정의된 Flow를 따라 실제 한 번 수행되는 구체적 실행 인스턴스'], negative: false }
    ] },
    foot: { kw: '명칭', color: 'teal', body: '이 과정에서는 주 경로를 가리키는 고유 명칭으로 Main Success Scenario를 사용하며, 표에서는 Main Success로 줄여 쓸 수 있다.' },
    notes: '2분.'
  },

  // 33. 원칙 — Domain (내부 identifier 제거)
  {
    kind: '원칙',
    title: 'Domain — 문제와 업무의 세계',
    sub: 'Domain은 특정 DDD Pattern을 뜻하지 않는다',
    question: '여기서 Domain은 무엇을 가리키는가?',
    lead: { label: '정의', text: 'Domain은 SW가 해결하려는 문제와 업무의 세계다.' },
    visual: { type: 'bullets', data: [
      { text: 'Use Case의 외부 행위를 내부 구현으로 바로 변환하지 않는다.' },
      { text: '문제영역에서 어떤 변화가 요구되는지까지 분석한다.' },
      { text: '이 세션은 Domain State Change까지 식별한다.' },
      { text: '의미 구조를 모델링하는 것은 다음 세션(정적 모델)으로 넘긴다.' }
    ] },
    foot: { kw: '경계', color: 'teal', body: '이 세션에서는 Domain의 개념 구조를 본격적으로 모델링하지 않는다.' },
    notes: '2분.'
  },

  // 34. 원칙 — SSD
  {
    kind: '원칙',
    title: 'SSD — System Sequence Diagram',
    sub: 'System은 하나의 Black Box다 — 내부 객체 interaction을 그리지 않는다',
    question: 'SSD는 무엇을 보여주고 무엇을 숨기는가?',
    lead: { label: 'Black Box', text: 'Actor와 System 사이의 메시지만 보여주고, System 내부 객체 interaction은 그리지 않는다.' },
    visual: { type: 'uml', data: {
      kind: 'sequence',
      source: 'participant Customer\nparticipant "Order System" as OS\nCustomer -> OS: placeOrder(items)\nOS -> Customer: orderConfirmation'
    } },
    foot: { kw: '경계', color: 'navy', body: 'System을 Black Box로 보고 내부 객체 interaction은 그리지 않는다.' },
    notes: '2분.'
  },

  // 35. 원칙 — System Event → System Operation
  {
    kind: '원칙',
    title: 'System Event → System Operation',
    sub: '아직 어떤 객체가 구현할지는 결정하지 않는다',
    question: 'System Event와 System Operation은 각각 무엇인가?',
    lead: { label: '정의', text: 'Actor의 의미 있는 요청을 System Event로 보고, 이에 대응해 System이 제공해야 하는 행위를 System Operation으로 식별한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'request', label: 'Actor 요청' },
      { id: 'event', label: 'Event' },
      { id: 'operation', label: 'Operation' }
    ], edges: [
      { from: 'request', to: 'event' },
      { from: 'event', to: 'operation' }
    ] } },
    foot: { kw: '경계', color: 'teal', body: '아직 어떤 객체가 구현할지는 결정하지 않는다.' },
    notes: '1분. 정식 명칭은 Actor 요청 → System Event → System Operation이다.'
  },

  // 36. 원칙 — Operation Contract
  {
    kind: '원칙',
    title: 'Operation Contract — What changed, not how',
    sub: 'System Operation이 완료되면 문제영역에서 무엇이 달라져 있어야 하는가',
    question: 'Operation Contract가 답하는 질문은 무엇인가?',
    lead: { label: '질문', text: 'System Operation이 완료되면 문제영역에서 무엇이 달라져 있어야 하는가?' },
    visual: { type: 'versus', data: [
      { title: 'What changed?', body: ['문제영역에서 필요한 결과와 상태 변화'], negative: false },
      { title: 'How implemented?', body: ['객체·DB·API·framework와 같은 solution decision'], negative: false }
    ] },
    foot: { kw: '예', color: 'navy', body: 'Order가 생성된다, OrderItem들이 Order와 연관된다, Order 총액이 결정되고 Payment가 요청된다.' },
    notes: '2분. 이 구분은 Brooks의 Essence/Accident를 실무적으로 적용하는 지점이다. 개별 객체의 Object Contract는 이후 책임 설계 세션이 소유한다.'
  },

  // 37. 원칙 — 요구 분석의 전체 연결 (내부 identifier 제거)
  {
    kind: '원칙',
    title: '요구 분석의 전체 연결',
    sub: '이 세션은 Required Domain State Change까지 도달한다',
    question: 'System Operation 다음에는 무엇을 검증하는가?',
    lead: { label: '연결', text: '다음 세션들(정적 모델·동적 모델)은 별도 단계가 아니라 이 요구를 구현 결정과 분리해 충분히 이해했는지 검증하는 다음 분석 관점이다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'usecase', label: 'Use Case' },
      { id: 'ssd', label: 'SSD' },
      { id: 'operation', label: 'Operation' },
      { id: 'contract', label: 'Contract' },
      { id: 'statechange', label: '상태 변화' },
      { id: 'model', label: '분석 모델' }
    ], edges: [
      { from: 'usecase', to: 'ssd' },
      { from: 'ssd', to: 'operation' },
      { from: 'operation', to: 'contract' },
      { from: 'contract', to: 'statechange' },
      { from: 'statechange', to: 'model' }
    ] } },
    foot: { kw: '다음', color: 'navy', body: 'Analysis Model은 Static View(무엇이 존재하는가)와 Dynamic View(무엇이 일어나는가)로 나뉜다.' },
    notes: '2분. 다음 세션(분석 정적 모델)으로 연결한다. 정식 명칭은 Use Case → Use Case Specification → Flow → SSD → System Event → System Operation → Operation Contract → Required Domain State Change → Analysis Model이다.'
  },

  // 38. 원칙 — User Story ([C] boxes → bullets로 정리: 템플릿/특징은 비교·grouping이 아니다)
  {
    kind: '원칙',
    title: 'User Story',
    sub: '사용자 가치 중심의 작은 요구 단위이며 Conversation의 출발점',
    question: 'User Story의 핵심은 템플릿인가?',
    lead: { label: '템플릿', text: 'As a <role>, I want <goal>, so that <value> — 템플릿보다 사용자 가치와 Conversation이 핵심이다.' },
    visual: { type: 'bullets', data: [
      { text: '사용자 가치' },
      { text: '작은 요구 단위' },
      { text: 'Conversation' },
      { text: '점진적 상세화' }
    ] },
    foot: { kw: '핵심', color: 'navy', body: '템플릿 자체보다 사용자 가치와 Conversation이 핵심이다.' },
    notes: '2분.'
  },

  // 39. 원칙 — Use Case vs User Story (table: 실제 비교 매핑이므로 정당)
  {
    kind: '원칙',
    title: 'Use Case와 User Story',
    sub: '복잡한 interaction과 점진적 가치 전달, 서로 다른 상황에 적합하다',
    question: '언제 Use Case를, 언제 User Story를 쓰는가?',
    lead: { label: '비교', text: 'Use Case는 Actor Goal과 System Behavior, User Story는 사용자 Value와 작은 요구 단위가 중심이다.' },
    visual: { type: 'table', data: [
      ['관점', 'Use Case', 'User Story'],
      ['중심', 'Actor Goal과 System Behavior', '사용자 Value와 작은 요구 단위'],
      ['본질', 'Text Specification', 'Conversation을 위한 Backlog Item'],
      ['상세화', 'Main/Alternative/Exception Flow', 'Acceptance Criteria'],
      ['적합', '복잡한 interaction과 업무 흐름', '점진적인 가치 전달'],
      ['위험', '과도한 문서화', 'Story 한 줄을 완전한 Requirement로 착각']
    ] },
    foot: { kw: '위험', color: 'failT', body: 'Use Case는 과도한 문서화, User Story는 한 줄을 완전한 Requirement로 착각하는 위험이 있다.' },
    notes: '2분.'
  },

  // 40. 원칙 — Acceptance Criteria
  {
    kind: '원칙',
    title: 'Acceptance Criteria',
    sub: '해당 Requirement나 Story가 충족됐다고 판단할 수 있는 조건',
    question: '무엇을 만들어야 완료로 볼 수 있는가?',
    lead: { label: '정의', text: '해당 Requirement 또는 Story가 충족됐다고 판단할 수 있는 조건이다.' },
    visual: { type: 'bullets', data: [
      { text: '재고가 있는 상품만 주문할 수 있다.' },
      { text: '결제가 완료되어야 주문이 확정된다.' },
      { text: '결제가 실패하면 주문은 확정되지 않는다.' }
    ] },
    foot: { kw: '역할', color: 'navy', body: '완료 여부를 판단할 수 있는 명시적 조건을 제공한다.' },
    notes: '1분.'
  },

  // 41. 적용 — BDD / Example (steps: 순차 진행이므로 정당)
  {
    kind: '적용',
    title: 'BDD / Example — Given / When / Then',
    sub: '문법을 배우는 것이 아니라 Concrete Example로 Requirement를 함께 검증한다',
    question: '재고 있는 상품 결제 완료 시나리오를 Given/When/Then으로 어떻게 쓰는가?',
    lead: { label: '예', text: 'Concrete Example을 통해 Requirement를 함께 이해하고 검증한다.' },
    visual: { type: 'steps', data: [
      { title: 'Given', body: ['재고가 있는 상품을 선택한 주문'] },
      { title: 'When', body: ['고객이 결제를 완료하면'] },
      { title: 'Then', body: ['주문은 결제 완료 상태가 된다'] }
    ] },
    foot: { kw: '목적', color: 'navy', body: 'BDD는 Given/When/Then 문법을 배우는 것이 목적이 아니다.' },
    notes: '2분.'
  },

  // 42. 현상 — 요구사항 정의와 Analysis의 분리 문제
  {
    kind: '현상',
    title: '요구사항 정의와 Analysis의 분리 문제',
    sub: '요구사항 정의는 강조하면서도 문제를 구현 결정과 분리해 이해하는 사고가 약해질 수 있다',
    question: '요구·문제 측과 개발·설계 측에서 각각 어떤 징후가 나타나는가?',
    lead: { label: '핵심', text: 'Analysis를 단계가 아니라 사고 프로세스로 유지하지 못하면 Problem Understanding이 특정 Solution에 조기에 종속된다.' },
    visual: { type: 'versus', data: [
      { title: '요구·문제 측', body: ['문제보다 원하는 기능·solution을 먼저 제시', '상세 요구와 solution을 함께 확정', '미결정 사항을 기술적 assumption으로 채움'], negative: true },
      { title: '개발·설계 측', body: ['고객 요청을 분석 없이 Requirement로 전환', 'Requirement와 Solution Design을 혼합', 'Story에서 바로 구현으로 이동'], negative: true }
    ] },
    foot: { kw: '원칙', color: 'navy', body: 'Requirement Engineering은 고객과 개발자가 Problem과 Solution을 구분하며 불확실성을 함께 줄이는 분석 활동이어야 한다.' },
    notes: '3분.'
  },

  // 43. 적용 — [실습] Place Order Use Case 작성
  {
    kind: '적용',
    title: '[실습] Place Order Use Case 작성 · 25~30분',
    sub: 'Use Case Diagram과 Specification을 직접 작성하고 LLM으로 검토한다',
    question: 'Place Order의 Main Success Flow와 Alternative/Exception Flow를 어떻게 구성할 것인가?',
    lead: { label: 'Input', text: '고객은 하나 이상의 물건을 고르고 Card 또는 Bank Transfer로 결제하여 주문한다.' },
    visual: { type: 'table', data: [
      ['Use Case', 'Primary Actor', 'Goal', 'Trigger', 'Precondition', 'Main Success Flow', 'Alternative/Exception Flow', 'Postcondition'],
      ['', '', '', '', '', '', '', '']
    ] },
    foot: { kw: '산출물', color: 'navy', body: 'Place Order Use Case Diagram 1개, Use Case Specification 1개. LLM 제안은 Requirement 근거 없으면 채택하지 않는다.' },
    notes: '25~30분. Diagram 8~10분 → Specification 10~12분 → LLM 검토·수정 5~8분. 먼저 독립적으로 Main Success Flow를 도출한 뒤 LLM을 사용한다. Payment Gateway·UI Button·REST API·DB Table을 섣불리 넣으면 “Problem인가 Solution인가”를 질문한다. 모든 예외를 완전하게 쓰게 하지 않는다 — 주요 Alternative/Exception 1~2개면 충분하다. SSD와 Operation Contract는 이 실습 산출물이 아니다.\n\nLLM용 추천 프롬프트: 이 요구에서 Place Order의 사용자 Goal과 System Responsibility를 구분해 검토하라. 내 Main Success Flow에서 빠진 Event나 불필요하게 추가한 Event가 있는가? Main Success Flow와 Alternative/Exception Flow의 구분이 적절한가? UI, DB, API, Framework 등 Solution Detail을 미리 결정한 부분이 있는가? 원래 요구에서 확인할 수 없는 assumption과 이해관계자에게 확인할 질문은 무엇인가? ...\n\nReview Criteria: 사용자 Goal이 명확한가? 정상 흐름이 시작부터 종료까지 연결되는가? Alternative/Exception이 필요한 곳에서 분리됐는가? Requirement와 assumption이 구분되는가? 불필요한 UI·DB·API·Framework Solution Detail이 없는가? 다음 세션들(정적 모델·동적 모델) 분석에 필요한 evidence가 남는가?'
  },

  // 44. 적용 — [별첨] 실습 해설: Use Case Diagram — [D] System Boundary rectangle + 무방향 association
  {
    kind: '적용',
    title: '[별첨] 실습 해설 — Place Order Use Case Diagram',
    sub: 'Customer는 Primary Actor이고 Place Order는 Customer Goal을 나타낸다',
    question: '결제 방식 변형과 외부 결제 사업자는 어떻게 반영하는가?',
    lead: { label: '해설', text: '결제 방식(Card/Bank Transfer)은 Flow의 variation이며 별도 Use Case나 Actor로 강제하지 않는다.' },
    visual: { type: 'uml', data: {
      kind: 'usecase',
      source: 'left to right direction\nactor Customer\nrectangle "Order System" {\n  usecase "Place Order" as UC1\n}\nCustomer -- UC1'
    } },
    foot: { kw: '주의', color: 'teal', body: '외부 결제 사업자를 Actor로 둘지는 확인된 System Boundary가 있을 때만 결정한다.' },
    notes: '2분. 이 별첨은 Practice 완료가 어려운 수강생에게 강사가 제공할 수 있는 Recovery Baseline이며 기본 Input이나 Practice 전 정답이 아니다.'
  },

  // 45. 적용 — [별첨] 실습 해설: Use Case Specification
  {
    kind: '적용',
    title: '[별첨] 실습 해설 — Place Order Use Case Specification',
    sub: 'Main Success Flow와 Alternative/Exception Flow의 연결을 확인한다',
    question: 'Main Success Flow는 어디서 시작해 어디서 끝나는가?',
    lead: { label: '해설', text: 'Main Success Flow: 요청 → 확인 → 결제방식 요청 → 선택 → 결제 처리 → 완료 결과 제공. Actor Action과 System Response가 번갈아 이어진다.' },
    visual: { type: 'table', data: [
      ['항목', '예시'],
      ['Use Case', 'Place Order'],
      ['Primary Actor', 'Customer'],
      ['Goal', '물건을 결제하여 주문을 완료한다'],
      ['Trigger / Precondition', '주문 요청 / 물건이 하나 이상 선택되어 있다'],
      ['Postcondition', '주문·결제 결과가 기록되고 완료 결과가 제공된다']
    ] },
    foot: { kw: 'Exception', color: 'failT', body: '미지원 결제 방식은 재선택을 안내하고, 결제 실패 시 주문을 확정하지 않는다. Shipment·Cancellation·Refund는 답안 범위 밖이다.' },
    notes: '2분. 전체 Flow 원문은 강사가 구두로 제공하거나 별도 자료로 배포한다.'
  },

  // 46. 요약 (내부 identifier 제거)
  {
    kind: '요약',
    head: '과정 요약과 다음 질문',
    title: '과정 요약과 다음 질문',
    sub: '오늘 세운 판단을 회수하고 다음 세션(정적 모델)으로 넘긴다',
    question: '오늘 세운 판단을 한 문장으로 어떻게 연결할 수 있는가?',
    lead: { label: '회수', text: '고객 요구는 Requirement Discovery의 입력이며, 구체화는 Solution을 고정하는 것이 아니라 Essential Problem을 더 정확히 이해하는 것이다.' },
    visual: { type: 'takeaways', data: [
      { title: '왜', body: ['고객도 개발자도 처음부터 완전한 답을 알고 있지 않다 — 발견·시험·학습·정제한다.'] },
      { title: '구분', body: ['Analysis는 고정된 단계가 아니라 Problem과 Solution을 구분하는 사고 활동이다.'] },
      { title: '다음', body: ['Use Case → SSD → Operation Contract로 Domain State Change까지 분석해 Analysis input을 완성했다.'] }
    ] },
    foot: { kw: '다음 질문', color: 'navy', body: '그 상태 변화를 구성하는 개념·속성·관계를 문제영역의 구조로 어떻게 표현하고, 현재 문제 이해가 충분한지 어떻게 검증할 것인가?' },
    notes: '3분. 다음 세션(분석 정적 모델)으로 연결한다.'
  }

];

module.exports = { session: {
  no: 2, title: '문제 발견과 요구 이해', type: '설명형', slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
} };
