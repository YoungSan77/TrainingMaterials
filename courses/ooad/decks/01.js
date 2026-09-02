// 01.js — S01. OOAD 개요 (CLEAN REGENERATION — 교재 작성 지침 + 3대 재현성 규칙 +
//   Evidence/Essence-Accident 통일 source presentation format 적용)
// Generation input: courses/ooad/course-design.md, courses/ooad/ooad-curriculum.md,
//   courses/ooad/sessions/s01-detailed-design.md(Source Presentation subsection 보완본),
//   guides/교재_작성_지침.md(Teaching Unit Preservation / Slide Decomposition Minimum /
//   Narrative Continuity 포함 보완본). 기존 01.js와 기존 PPTX/PDF/PNG는 semantic/style
//   source로 사용하지 않았다 — 전량 재작성. (committed baseline은 evidence 비교 목적으로만 조회.)
//
// ── 이번 회차 merge/split 판단 기록 ──
//   [Source Presentation — Slide 4/5(PPTX p7/p8)] Evidence(Boehm & Basili/Standish/Brooks)와
//     Essence/Accident의 Brooks 인용을 모두 "한글 → Original → Source" 동일 grammar로 통일했다.
//     Evidence는 box/card 3분할(boxes) 대신 bullets 3-item(source당 1 item, 저자/주제를 head로,
//     한글·Original·Source를 \n으로 구분한 본문)으로 위→아래 배치했다 — box/card 사용 조건
//     (실제 grouping/comparison/독립 semantic unit)에 해당하지 않는 순수 참고자료 나열이라
//     bullets가 Representation Selection상 더 정확하다.
//   [원문 검증 결과] Boehm & Basili, Brooks는 1차 출처에서 확인된 원문을 사용했다(완료 보고에
//     상세 기록). Standish/Jim Johnson은 XP2002(2002년 5월) 발표 통계로 폭넓게 2차 인용되나
//     검증 가능한 저자 prose 원문을 찾지 못해 Original을 임의로 구성하지 않고 그 사실을
//     learner-facing으로 명시했다(DD "Source Presentation" 규정에 따른 처리).
//   [Essence/Accident] 정의(versus)·판단질문(question)·Analysis 연결(lead)은 이전 회차 그대로
//     유지하고, foot에 Brooks Original+Source를 추가해 Slide 4와 동일한 citation typography·
//     순서(한글→Original→Source)를 이 slide에도 적용했다.
//   [기타 unit] Course Map 4-slide 분할, Analysis≠Phase의 Predictive/Iterative 통합+forward/
//     backward transition, 나머지 citation(Parnas/Alan Kay/Booch/Larman) 배치는 이전 회차와
//     동일하게 유지했다 — 이번 변경 범위는 Evidence/Essence-Accident의 source presentation
//     format뿐이며 다른 teaching unit의 내용을 다시 흔들지 않는다.

const slides = [

  // 1. 학습 목표
  {
    kind: '학습 목표',
    title: 'OOAD 개요',
    sub: '분석과 설계를 서로 다른 질문으로 구분하고, 객체지향이 필요한 이유를 이해한다',
    question: '이 세션에서 무엇을 이해해야 하는가?',
    lead: { label: '학습 목표', text: '문제와 요구를 올바르게 이해해야 하는 이유를 알고, 분석과 설계를 서로 다른 질문으로 구분한다.' },
    visual: { type: 'bullets', data: [
      { text: '분석·설계가 왜 필요하며 서로 다른 질문임을 설명한다.' },
      { text: '문제 자체의 복잡성과 구현이 더하는 복잡성을 구분한다.' },
      { text: '왜 객체지향이 필요한지 설명하고 OOA·OOD의 연결을 설명한다.' },
      { text: '문제영역을 정적·동적 관점으로 함께 이해하는 이유를 설명한다.' },
      { text: 'Analysis/Architecture/Design/Technical Design이 서로 다른 Engineering Judgment이며 Session 순서가 실제 Lifecycle이 아님을 구분한다.' },
      { text: 'Define↔Build↔Test처럼 반복되며 evidence가 앞선 판단을 다시 열 수 있음을 설명한다.' }
    ] },
    foot: { kw: '관점', color: 'navy', body: '문제영역의 본질적 복잡성을 구현 결정과 구분해 이해하고, 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 것이 OOAD의 출발점이다.' },
    notes: '4분. Boehm/Standish/Brooks는 다음 slide에서 하나의 evidence unit으로 다룬다.'
  },

  // 2. 현상 — 문을 여는 한 문장 (statement)
  {
    kind: '현상',
    title: '문제는 코드에서만 시작되지 않는다',
    visual: { type: 'statement', text: '문제는 코드에서만 시작되지 않는다 — 요구를 잘못 이해하면 구현이 좋아도 실패한다.' },
    notes: '1분. 이 세션 전체를 여는 문장이다 — 다음 slide의 5단 연쇄로 구체화한다.'
  },

  // 3. 현상 — 잘못 이해한 문제의 연쇄
  {
    kind: '현상',
    title: '잘못 이해한 문제의 연쇄',
    sub: '요구를 잘못 이해하면 구현 품질과 무관하게 실패로 이어진다',
    question: '문제를 잘못 이해하면 무엇이 뒤따르는가?',
    lead: { label: '연쇄', text: '문제 오해는 구현 단계가 아니라 그 이전에 이미 실패를 결정한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'misunderstand', label: '문제 오해' },
      { id: 'wrongfeature', label: '잘못된 기능' },
      { id: 'latefound', label: '뒤늦은 발견' },
      { id: 'rework', label: '재작업' },
      { id: 'ripple', label: '변경 파급' }
    ], edges: [
      { from: 'misunderstand', to: 'wrongfeature' },
      { from: 'wrongfeature', to: 'latefound' },
      { from: 'latefound', to: 'rework' },
      { from: 'rework', to: 'ripple' }
    ] } },
    foot: { kw: '연쇄', color: 'failT', body: '이 5단 연쇄 자체가 왜 분석·설계가 필요한지의 출발점이다.' },
    notes: '2분. 정식 명칭은 잘못 이해한 문제 → 필요 없는 기능·잘못된 기능 → 뒤늦은 발견 → 시간 낭비·재작업 → 변경 파급이다.'
  },

  // 4. 현상 — SW 개발의 재작업 비용과 기능 사용 비율. Title → 두 Anchor group(Keyword + Message)만
  //    learner-facing content다. 두 Anchor 자체가 이 slide의 전부이므로 question/lead/sub/conclusion을
  //    만들지 않는다 — 이번 turn에 skeleton.js를 완화해(engine/skeleton.js) sub/question/lead/foot을
  //    선택 필드로 만들었으므로 placeholder 없이 완전히 생략한다. Keyword(item.head)는 이제 그 자체로
  //    한 줄(section label, bold navy)로 그려지고 Message는 다음 줄부터 시작한다(engine/render/
  //    visuals.js) — box/card 없이 두 근거를 시각적으로 분리하기 위해서다. 두 group 사이의 여백은
  //    item.text 끝에 붙인 break:true 빈 run 두 개로 만든다(본문 2줄 분량의 빈 줄).
  {
    kind: '현상',
    title: 'SW 개발의 재작업 비용과 기능 사용 비율',
    visual: { type: 'bullets', data: [
      { head: '재작업 비용', text: [
        { text: '현재 SW 프로젝트는 전체 노력의 약 40~50%를 회피 가능한 재작업에 사용한다 -- 배포 후 문제를 수정하는 비용은 요구사항·설계 단계에서 수정하는 것보다 최대 100배 더 비쌀 수 있다, ' },
        { text: 'Current software projects spend about 40 to 50 percent of their effort on avoidable rework. -- Finding and fixing a software problem after delivery is often 100 times more expensive than finding and fixing it during the requirements and design phase., ', small: true },
        { text: 'Boehm & Basili', small: true, break: true },
        { text: '', break: true },
        { text: '', break: true }
      ] },
      { head: '기능 사용 비율', text: [
        { text: '항상 사용 7%, 자주 사용 13%, 가끔 사용 16%, 거의 사용하지 않음 19%, 사용하지 않음 45%, ' },
        { text: 'Jim Johnson / Standish Group, 원문 미확인', small: true }
      ] }
    ] },
    notes: '4분. 100배는 보편 법칙이 아니라 저자들이 명시한 범위(소규모 비핵심 시스템 약 5:1)로 설명한다. Standish/Johnson은 2002 XP 컨퍼런스 발표 통계로 널리 2차 인용되나 검증 가능한 저자 prose 원문을 찾지 못해 원문을 임의로 구성하지 않았다 — 원문 미확인을 learner-facing으로 명시한다. 상세 bibliographic 정보(Boehm & Basili, "Software Defect Reduction Top 10 List," IEEE Computer, Vol. 34, No. 1, Jan. 2001, pp. 135–137)는 DD에 유지한다. Brooks/Essence·Accident는 다음 slide에서 다룬다.'
  },

  // 5. 원칙 — Essence / Accident. Brooks Anchor를 하나의 rich-text block으로 lead에 담는다 —
  //    한글 번역(본문 크기) + 영어 원문·저자(F_SRC 10pt)가 같은 문단에 있다. 'Brooks:' label
  //    prefix는 없앤다(문장 끝에 이미 저자명이 있어 앞쪽 label이 중복이었다 — render/pages.js의
  //    addContext가 label이 빈 문자열이면 prefix를 생략하도록 이번에 확장했다). question은 그대로
  //    유지한다. Essence/Accident versus box는 단순 반복이 아니라 OOAD 관점 구체화이므로 유지한다.
  {
    kind: '원칙',
    title: 'Essence와 Accident — 지금 어려운 이유는 무엇인가',
    sub: '문제 자체의 어려움과 구현 방식이 더하는 어려움을 구분한다',
    question: '지금 문제가 요구사항을 충분히 이해하지 못했기 때문인가, 아니면 선택한 구현 방식 때문인가?',
    lead: { label: '', text: [
      { text: '아리스토텔레스의 구분을 따라, 소프트웨어 자체의 본질에 내재한 어려움을 Essence로, 소프트웨어 생산 과정에 수반되지만 본질적이지 않은 어려움을 Accident로 구분한다, ' },
      { text: 'Following Aristotle, I divide them into essence—the difficulties inherent in the nature of the software—and accidents—those difficulties that today attend its production but that are not inherent., ', small: true },
      { text: 'Brooks', small: true }
    ] },
    visual: { type: 'versus', data: [
      { title: 'Essence', body: ['문제 자체의 개념·규칙·관계', '상태·행위와 그 상호작용에서 오는 복잡성'], negative: false },
      { title: 'Accident', body: ['특정 기술·도구·표현 방식', '구현 방식과 개발 환경이 추가하는 복잡성'], negative: false }
    ] },
    foot: { kw: '결론', color: 'navy', body: '따라서 분석은 구현 기술과 독립적으로 본질적 문제와 요구사항을 이해하는 활동이다. 분석 모델은 특정 구현 기술이나 구현 결정 같은 accidental detail이 문제 자체의 의미를 대신하지 않도록 해야 한다.' },
    notes: '4분. Problem/Requirement → Essential Concepts → Analysis → Design Decisions → Implementation의 흐름을 구두로 짚는다. 상세 bibliographic 정보(Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering," IEEE Computer, Vol. 20, No. 4, April 1987, pp. 10–19)는 DD에 유지한다.'
  },

  // 6. 원칙 — 분석과 설계, 서로 다른 질문 (versus: DD의 5개 질문을 각 측 모두 보존)
  {
    kind: '원칙',
    title: '분석과 설계 — 서로 다른 질문',
    sub: '분석과 설계는 문서 단계가 아니라 서로 다른 질문에 답하는 활동이다',
    question: '분석과 설계는 각각 무엇을 판단하는가?',
    lead: { label: '질문의 구분', text: '분석은 무엇을 해결해야 하는지 묻고, 설계는 그것을 누가 어떻게 책임질지 묻는다.' },
    visual: { type: 'versus', data: [
      { title: 'Analysis — 무엇을 해결해야 하는가', body: [
        '사용자가 해결하려는 문제는 무엇인가?',
        '어떤 목표를 달성하려 하는가?',
        '어떤 개념과 관계가 존재하는가?',
        '어떤 행위와 상태 변화가 일어나는가?',
        '어떤 규칙과 제약이 존재하는가?'
      ], negative: false },
      { title: 'Design — 어떤 책임과 구조로 해결하는가', body: [
        '어떤 객체가 필요한가?',
        '상태와 행위는 누가 책임지는가?',
        '객체들은 어떻게 협력하는가?',
        '무엇을 계약으로 보장해야 하는가?',
        '변경 영향을 어디에 국소화할 것인가?'
      ], negative: false }
    ] },
    foot: { kw: '연속', color: 'navy', body: '분석과 설계는 별개 문서 절차가 아니라 문제 이해를 구현 가능한 해결책으로 전환하는 연속된 판단이다.' },
    notes: '3분. 여기서 전달할 것은 순서가 아니라 각 활동이 답하는 질문이 다르다는 것이다.'
  },

  // 7. 원칙 — Analysis ≠ Phase (Narrative Continuity: Predictive/Iterative 대조를 1장에 유지)
  {
    kind: '원칙',
    title: 'Analysis ≠ Phase — 질문을 구분한다',
    sub: '분석과 설계는 프로세스가 아니라 사고에서 구분하는 질문이다',
    question: 'Analysis는 반드시 별도의 lifecycle 단계여야 하는가?',
    lead: { label: '질문 vs 단계', text: 'Analysis와 Design은 단계의 구분이 아니라 질문의 구분이다.' },
    visual: { type: 'versus', data: [
      { title: 'Predictive', body: ['Analyze → Design → Implement', '순차적으로 배치된 프로세스'], negative: false },
      { title: 'Iterative / Agile', body: ['Define ↔ Build ↔ Test', '같은 iteration 안에서 반복·통합'], negative: false }
    ] },
    foot: { kw: '원칙', color: 'navy', body: 'Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다 — 다음 slide에서 Iterative/Agile의 Define↔Build↔Test가 실제로 어떻게 반복·feedback하는지 구체화한다.' },
    notes: '3분. 두 프로세스 모두 Analysis/Design 질문 자체는 사라지지 않는다는 것이 핵심.'
  },

  // 8. 원칙 — Define ↔ Build ↔ Test (loop. 이전 slide의 backward reference를 lead에 명시)
  {
    kind: '원칙',
    title: 'Define ↔ Build ↔ Test',
    sub: '어느 활동에서든 새로운 evidence는 관련된 판단을 다시 연다',
    question: '새로운 evidence는 어떤 판단을 다시 열 수 있는가?',
    lead: { label: 'Feedback', text: '앞서 본 Iterative/Agile의 반복을 구체화한다 — evidence가 관련된 판단을 다시 여는 것이지, 정해진 마지막 단계에서 앞 단계로 되돌아가는 rollback이 아니다.' },
    visual: { type: 'loop', data: { nodes: [
      { id: 'define', label: 'Define' },
      { id: 'build', label: 'Build' },
      { id: 'test', label: 'Test' }
    ], edges: [
      { from: 'define', to: 'build' },
      { from: 'build', to: 'test' },
      { from: 'build', to: 'define', label: 'evidence' },
      { from: 'test', to: 'build', label: 'evidence' },
      { from: 'test', to: 'define', label: 'evidence' }
    ] } },
    foot: { kw: 'Evidence → Reopen', color: 'teal', body: 'Analysis=Define, Design=Build, Test=마지막 단계처럼 1:1로 고정하지 않는다.' },
    visualNote: '"1:1"은 비율·배수 수치가 아니라 "고정 대응하지 않는다"는 부정 표현이다 — 반복·feedback을 보여주는 loop가 적절하다.',
    notes: '3분. Test뿐 아니라 Build도 evidence로 Define 판단을 다시 열 수 있다 — Test만 유일한 feedback source가 아니다.'
  },

  // 9. 원인 — 복잡성 증가 → 책임 소유자 불명확 (pipeline: 실제 인과 흐름)
  {
    kind: '원인',
    title: '복잡성이 커지면 책임 소유자가 불명확해진다',
    sub: '규모가 커질수록 어떤 객체에 책임을 할당할지가 핵심 질문이 된다',
    question: '어떤 객체에 어떤 책임을 할당할 것인가?',
    lead: { label: '원인', text: '상태·행위·업무 규칙이 분산되고 책임 소유자가 불명확해지면 작은 변경도 널리 퍼진다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'scale', label: '복잡성 증가' },
      { id: 'modular', label: '분할·모듈화' },
      { id: 'hiding', label: '정보 은닉' },
      { id: 'assign', label: '책임 할당' }
    ], edges: [
      { from: 'scale', to: 'modular' },
      { from: 'modular', to: 'hiding' },
      { from: 'hiding', to: 'assign' }
    ] } },
    foot: { kw: 'Responsibility Assignment', color: 'failT', body: '절차적 접근이 틀려서가 아니라, 규모가 커질수록 어떤 객체가 그 상태와 행위를 책임질지 할당하는 질문이 중요해진다.' },
    notes: '3분. 모호한 위치 표현 대신 책임 소유자(owner)·책임 할당·Responsibility Assignment 용어를 사용한다.'
  },

  // 10. 원칙 — Information Hiding (Parnas 저자·원전 learner-facing 노출)
  {
    kind: '원칙',
    title: 'Information Hiding — Parnas(1972)',
    sub: '모듈은 코드를 나누는 단위가 아니라 변경 가능성이 있는 설계 결정을 숨기는 경계다',
    question: '무엇을 숨기고 무엇을 드러내야 하는가?',
    lead: { label: 'Parnas', text: '변경될 가능성이 있는 설계 결정을 다른 부분으로부터 숨기는 경계가 중요하다.' },
    visual: { type: 'bullets', data: [
      { text: '모듈은 단순히 코드를 나누는 단위가 아니다.' },
      { text: '변경 가능성이 있는 설계 결정을 경계 뒤에 숨긴다.' },
      { text: '이 경계는 이후 객체의 Encapsulation과 Responsibility로 연결된다.' }
    ] },
    foot: { kw: '연결', color: 'teal', body: 'Information Hiding은 다음 slide의 Encapsulation·Responsibility 정의로 이어진다.' },
    notes: '2분. [Source] Parnas, "On the Criteria to Be Used in Decomposing Systems into Modules"(1972).'
  },

  // 11. 원칙 — 객체는 상태와 행위를 캡슐화하고 책임을 맡아 메시지로 협력한다 (boxes: 3개의 distinct semantic unit)
  {
    kind: '원칙',
    title: '객체는 상태와 행위를 캡슐화하고, 책임을 맡아 메시지로 협력한다',
    sub: 'Responsibility와 Message는 서로 다른 층위의 설계 의미다',
    question: '변경될 수 있는 설계 결정을 어떤 경계 안에 두고, 그 경계는 무엇을 책임지는가?',
    lead: { label: 'Alan Kay(2003)', text: 'Alan Kay는 객체지향의 중심을 Class hierarchy가 아니라 messaging과 local state에 둔다.' },
    visual: { type: 'boxes', data: [
      { title: 'Object', body: ['State와 Behavior를 캡슐화한다'] },
      { title: 'Responsibility', body: ['그 State·Behavior를 이 객체가 맡아야 하는지 정하는 설계 판단'] },
      { title: 'Message', body: ['객체들이 각자의 Responsibility를 수행하며 협력하는 방식'] }
    ] },
    foot: { kw: '경계', color: 'navy', body: 'Behavior와 Responsibility는 같은 뜻이 아니다 — Behavior는 Responsibility를 수행하는 구체적인 행위이고, Responsibility는 더 높은 수준의 설계 의미다.' },
    notes: '4분. [Sources] Parnas, Information Hiding(1972); Alan Kay, Email to Stefan Ram(2003) — paraphrase로 설명하고 축자 인용하지 않는다.'
  },

  // 12. 적용 — Order Mini Exercise (Example Semantic Integrity: 정답·GRASP 선행 없음)
  {
    kind: '적용',
    title: 'Order Mini Exercise',
    sub: 'OrderItem, Order, OrderService 중 주문 총액 계산 책임은 누구에게 있어야 하는가',
    question: '주문 총액 계산 책임은 `OrderItem`, `Order`, `OrderService` 중 누구에게 있어야 하는가?',
    lead: { label: '상황', text: 'OrderItem은 자기 항목에 필요한 정보를 가지고, Order는 여러 OrderItem을 가지며, OrderService는 Order를 사용한다.' },
    visual: { type: 'flow', data: { dir: 'LR', nodes: [
      { id: 'orderservice', label: 'OrderService' },
      { id: 'order', label: 'Order' },
      { id: 'orderitem', label: 'OrderItem' }
    ], edges: [
      { from: 'orderservice', to: 'order', label: 'uses' },
      { from: 'order', to: 'orderitem', label: 'contains' }
    ] } },
    foot: { kw: '열린 질문', color: 'failT', body: '이 단계에서는 정답을 확정하지 않는다 — 필요한 상태와 규칙을 알고 있는 위치와 responsibility를 어디까지 함께 둘 것인가?' },
    notes: '4분. Information Expert나 GRASP의 formal teaching은 여기서 다루지 않는다 — 책임 있는 owner인 이후 세션(책임 설계)이 소유한다. OrderService=orchestration, Order/OrderItem=반드시 owner 같은 formal answer를 선행하지 않는다.'
  },

  // 13. 원칙 — OOA (Booch 저자 learner-facing 노출)
  {
    kind: '원칙',
    title: 'OOA — Booch: 문제영역을 객체 관점에서 이해한다',
    sub: '분석 모델은 아직 상세 모델링 방법으로 들어가지 않는다',
    question: 'OOA는 무엇을 하는 활동인가?',
    lead: { label: 'Booch', text: 'OOA는 문제영역을 객체 관점에서 이해하는 활동이다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'requirement', label: 'Requirements' },
      { id: 'ooa', label: 'OOA' },
      { id: 'understanding', label: '문제영역 이해' },
      { id: 'model', label: '분석 모델' }
    ], edges: [
      { from: 'requirement', to: 'ooa' },
      { from: 'ooa', to: 'understanding' },
      { from: 'understanding', to: 'model' }
    ] } },
    foot: { kw: '경계', color: 'teal', body: '이 세션에서는 상세 모델링 방법까지 들어가지 않는다 — 다음 세션들(정적 모델·동적 모델)이 소유한다.' },
    notes: '2분. [Source] Booch, OOA definition.'
  },

  // 14. 원칙 — 분석 정적 모델 / 분석 동적 모델 (versus: 실제 비교)
  {
    kind: '원칙',
    title: '분석 정적 모델과 분석 동적 모델',
    sub: '분석 모델은 같은 문제영역을 정적·동적 두 관점으로 구체화한다',
    question: '같은 문제영역을 왜 두 관점에서 봐야 하는가?',
    lead: { label: '상호보완', text: '정적·동적 관점은 서로 다른 단계가 아니라 같은 문제를 이해하기 위한 상호보완적 관점이다.' },
    visual: { type: 'versus', data: [
      { title: '분석 정적 모델', body: ['무엇이 존재하는가?', '어떤 속성과 관계를 가지는가?'], negative: false },
      { title: '분석 동적 모델', body: ['무엇이 일어나는가?', '어떻게 상호작용하고 상태가 변하는가?'], negative: false }
    ] },
    foot: { kw: '상호보완', color: 'navy', body: '둘은 서로 다른 단계가 아니라 같은 문제를 이해하기 위한 상호보완적 관점이다.' },
    notes: '2분. 상세 기법은 다음 세션들(정적 모델·동적 모델)에서 다룬다.'
  },

  // 15. 원칙 — OOD (Booch 저자 learner-facing 노출)
  {
    kind: '원칙',
    title: 'OOD — Booch: 분석한 문제를 책임 있는 구조로 설계한다',
    sub: '분석에서 발견한 개념을 그대로 Class로 바꾸는 것은 설계가 아니다',
    question: '분석 모델을 그대로 Class Diagram으로 옮기면 설계가 완성되는가?',
    lead: { label: 'Booch', text: 'OOD는 분석한 문제를 객체의 책임과 협력 구조로 설계하는 활동이다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'model', label: '분석 모델' },
      { id: 'boundary', label: '객체 경계' },
      { id: 'resp', label: '책임' },
      { id: 'collab', label: '협력' },
      { id: 'contract', label: '계약' }
    ], edges: [
      { from: 'model', to: 'boundary' },
      { from: 'boundary', to: 'resp' },
      { from: 'resp', to: 'collab' },
      { from: 'collab', to: 'contract' }
    ] } },
    foot: { kw: '핵심', color: 'navy', body: '분석은 문제를 이해하고, 설계는 그 문제를 해결할 책임 있는 객체 구조를 결정한다.' },
    notes: '3분. 정식 명칭은 Object Boundary/Responsibility/Message·Collaboration/Contract다(노드는 밀도상 국문 표기, 개념 재정의 아님).'
  },

  // 16. 원칙 — UML보다 솔루션 (statement: Larman 저자·원전 caption에 learner-facing 노출)
  {
    kind: '원칙',
    title: 'UML보다 솔루션',
    visual: { type: 'statement',
      text: 'UML을 잘 그리는 것이 아니라, 올바른 솔루션을 분석하고 설계하는 것이 목적이다.',
      note: 'UML은 분석과 설계의 결과를 표현·공유·검토하기 위한 수단이다.',
      caption: 'Larman, Design Principles over UML'
    },
    notes: '2분. UML 표기 자체를 가르치는 slide가 아니다 — 목적과 수단을 구분하는 전환점이다.'
  },

  // 17. 원칙 — Engineering Judgment / Abstraction Map
  {
    kind: '원칙',
    title: 'Engineering Judgment / Abstraction Map',
    sub: 'Intent부터 Code까지, 서로 다른 질문을 구분하는 판단 지도',
    question: 'Analysis와 Design은 이 지도에서 같은 질문을 다루는가?',
    lead: { label: '지도', text: '화살표는 순서를 강제하지 않으며, 새로운 evidence가 나타나면 그와 관련된 판단 수준을 다시 연다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'intent', label: 'Intent' },
      { id: 'requirement', label: '요구' },
      { id: 'analysis', label: '분석' },
      { id: 'architecture', label: '구조' },
      { id: 'design', label: '설계' },
      { id: 'techdesign', label: '기술설계' },
      { id: 'code', label: 'Code' }
    ], edges: [
      { from: 'intent', to: 'requirement' },
      { from: 'requirement', to: 'analysis' },
      { from: 'analysis', to: 'architecture' },
      { from: 'architecture', to: 'design' },
      { from: 'design', to: 'techdesign' },
      { from: 'techdesign', to: 'code' }
    ] } },
    foot: { kw: '경계', color: 'navy', body: 'Architecture는 시스템 수준 구조·제약을 판단하는 별개의 judgment로만 위치를 확인한다 — 상세 판단은 SW Architecture 과정이 소유한다.' },
    notes: '4분. 정식 명칭은 Intent→Requirement→Analysis→Architecture→Design→Technical Design→Code다(노드는 밀도상 국문 축약, 개념 재정의 아님). 특정 마지막 단계에서 앞으로 돌아가는 고정 경로가 아니라 evidence와 관련된 수준을 다시 여는 것이다.'
  },

  // 18. 원칙 — Course Sequence ≠ Engineering Lifecycle (versus: 실제 비교)
  {
    kind: '원칙',
    title: 'Course Sequence ≠ Engineering Lifecycle',
    sub: 'Session 순서는 학습을 위한 순서이지 실제 개발 순서가 아니다',
    question: '이 과정의 Session 순서를 실제 개발이 밟아야 할 순서로 읽어도 되는가?',
    lead: { label: '구분', text: 'Session 순서는 Analysis와 Design 중심으로 판단 유형을 나누어 가르치기 위한 Learning Sequence다.' },
    visual: { type: 'versus', data: [
      { title: 'Course Session Sequence', body: ['Learning Sequence로 판단 유형을 순서대로 가르침', '실제 Engineering Lifecycle을 의미하지 않음'], negative: false },
      { title: 'Engineering Judgment Map', body: ['서로 다른 질문을 구분', '필요한 시점에 반복·왕복 가능'], negative: false }
    ] },
    foot: { kw: '반복', color: 'failT', body: 'Learning Sequence 안에서는 앞으로 진행하지만, 실제 engineering에서는 후속 evidence가 앞선 판단을 다시 열 수 있다.' },
    notes: '3분.'
  },

  // 19. 적용 — 과정 지도 ① (Analysis Thinking의 하위 vocabulary "분석 정적/동적 모델"을 learner-facing으로 명시)
  {
    kind: '적용',
    title: '과정 지도 ① — 문제 이해에서 분석 사고까지',
    sub: '문제/요구에서 Problem Understanding을 거쳐 분석 사고로 이어지는 흐름',
    question: '문제를 이해한 뒤 어떤 사고로 이어지는가?',
    lead: { label: '흐름', text: '고정된 lifecycle phase가 아니라 이 과정에서 익힐 사고와 판단의 논리적 흐름이다. Analysis Thinking은 분석 정적 모델·분석 동적 모델 두 관점을 함께 포함한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'problem', label: 'Problem/Requirement' },
      { id: 'understanding', label: 'Problem Understanding' },
      { id: 'analysis', label: 'Analysis Thinking' }
    ], edges: [
      { from: 'problem', to: 'understanding' },
      { from: 'understanding', to: 'analysis' }
    ] } },
    foot: { kw: '흐름', color: 'navy', body: 'Analysis Thinking은 분석 정적 모델과 분석 동적 모델을 함께 포함한다.' },
    notes: '2분. 과정 지도는 4개 slide(①~④)로 나눠 각 progression vocabulary를 압축 없이 보존한다.'
  },

  // 20. 적용 — 과정 지도 ② (책임 설계의 하위 vocabulary "책임과 협력"·"계약과 변화 대응"을 learner-facing으로 명시)
  {
    kind: '적용',
    title: '과정 지도 ② — 설계 사고에서 책임 설계로',
    sub: '설계 사고가 객체 설계 전환을 거쳐 책임 설계로 이어지는 흐름',
    question: '분석 사고는 어떤 설계 판단으로 이어지는가?',
    lead: { label: '흐름', text: '분석에서 객체 설계로 전환한 뒤 책임 설계로 이어진다. 책임 설계는 책임과 협력·계약과 변화 대응 두 하위 판단을 포함한다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'design', label: 'Design Thinking' },
      { id: 'transition', label: '분석에서 객체 설계로' },
      { id: 'responsibility', label: '책임 설계' }
    ], edges: [
      { from: 'design', to: 'transition' },
      { from: 'transition', to: 'responsibility' }
    ] } },
    foot: { kw: '흐름', color: 'navy', body: '책임 설계는 책임과 협력, 계약과 변화 대응이라는 두 하위 판단을 포함한다.' },
    notes: '2분. 책임 설계 노드는 책임과 협력·계약과 변화 대응 두 하위 관점을 갖는다.'
  },

  // 21. 적용 — 과정 지도 ③ (책임 설계 → 객체 설계의 판단 → 통합 설계)
  {
    kind: '적용',
    title: '과정 지도 ③ — 판단에서 통합 설계로',
    sub: '책임 설계가 객체 설계의 판단을 거쳐 통합 설계로 이어지는 흐름',
    question: '책임 설계 다음에는 무엇을 판단하는가?',
    lead: { label: '흐름', text: '책임 설계에서 정제한 판단을 평가한 뒤 하나의 통합된 설계 판단으로 모은다.' },
    visual: { type: 'pipeline', data: { nodes: [
      { id: 'responsibility2', label: '책임 설계' },
      { id: 'judgment', label: '객체 설계의 판단' },
      { id: 'integration', label: '통합 설계' }
    ], edges: [
      { from: 'responsibility2', to: 'judgment' },
      { from: 'judgment', to: 'integration' }
    ] } },
    foot: { kw: '흐름', color: 'navy', body: '통합 설계는 앞선 모든 분석·설계 판단을 하나의 일관된 결정으로 모으는 단계다.' },
    notes: '2분. 이 slide의 첫 노드(책임 설계)는 ②의 마지막 노드와 같은 지점이다 — 새 개념이 아니라 흐름의 연결이다.'
  },

  // 22. 적용 — 과정 지도 ④ (Feedback을 loop로 표현. loop는 최소 3 node 필요)
  {
    kind: '적용',
    title: '과정 지도 ④ — 구현과 Feedback',
    sub: '구현과 검증에서 얻은 evidence는 관련된 이전 판단을 다시 연다',
    question: 'Test/구현 evidence는 어디로 이어지는가?',
    lead: { label: '반복', text: '실제 Iterative/Agile 개발에서는 이 흐름을 작은 범위에서 반복하며 앞뒤로 왕복한다.' },
    visual: { type: 'loop', data: { nodes: [
      { id: 'implementation', label: 'Implementation/Test' },
      { id: 'feedback', label: 'Feedback/Refactoring' },
      { id: 'reopen', label: '관련 판단 재검토' }
    ], edges: [
      { from: 'implementation', to: 'feedback' },
      { from: 'feedback', to: 'reopen' },
      { from: 'reopen', to: 'implementation' }
    ] } },
    foot: { kw: 'Feedback', color: 'teal', body: 'Feedback/Refactoring은 구현 이전의 책임 설계·통합 설계 판단도 다시 열 수 있다 — 마지막 단계에서 끝나지 않는다.' },
    notes: '2분. 이 세션은 이 전체 과정에서 왜 이 사고 흐름이 필요한가를 이해하는 세션이다.'
  },

  // 23. 요약 — DD 8개 Q&A를 5개 grouped takeaway로 무손실 재편
  {
    kind: '요약',
    head: '과정 요약과 다음 질문',
    title: '과정 요약과 다음 질문',
    sub: '오늘 세운 판단을 회수하고 다음 세션으로 넘긴다',
    question: '오늘 세운 판단을 한 문장으로 어떻게 연결할 수 있는가?',
    lead: { label: '회수', text: '문제를 잘못 이해하면 구현이 아무리 좋아도 실패한다 — 그래서 Analysis와 Design을 서로 다른 질문으로 구분한다.' },
    visual: { type: 'takeaways', data: [
      { title: '왜', body: ['잘못 이해한 문제는 구현 품질과 무관하게 실패로 이어진다.'] },
      { title: '분석/설계', body: ['고정 단계가 아니라 서로 다른 질문이다(분석/설계).'] },
      { title: '정적/동적', body: ['같은 문제영역을 상호보완적인 두 관점(정적·동적)으로 이해한다.'] },
      { title: '객체지향', body: ['책임 있는 객체의 경계 안에 상태·행위를 두고 메시지로 협력한다.'] },
      { title: 'Judgment Map ≠ Session 순서', body: ['Session 순서는 Learning Sequence, delivery는 반복된다.'] }
    ] },
    foot: { kw: '다음', color: 'navy', body: '그렇다면 우리가 해결해야 할 문제와 요구를 어떻게 제대로 발견하고 정의할 것인가?' },
    notes: '3분. 다음 세션(문제 발견과 요구 이해)으로 연결한다.'
  }

];

module.exports = { session: {
  no: 1, title: 'OOAD 개요', type: '설명형', slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
} };
