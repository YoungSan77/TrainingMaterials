// 14.js — 교시 14 (부 4 · 설계 원칙과 테스트 압력 — TDD로 설계 압력, 부4 마지막)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/tdd-source.md (즉석 생성 금지 — 이 소스를 옮긴다)
// 도메인 소재: order-domain-definition.md §5(R5 취소조건·R6 전이규칙)
// 핵심 축(정본 §C): 리팩터의 방향은 GRASP·SOLID가 준다 — TDD는 그 이동을 겁 없이 하게 하는 안전망일
//   뿐이다. 이전 버전(R2·addLine 예)은 이 소스로 교체됐다 — R5·R6(cancel) 예가 정본이다.
// 본문 8장: 학습목표1 · 현상1 · 원칙1 · 적용5(Red→Green·Green→Refactor·나침반·한계) · 요약1
// codepair 3벌 한 슬라이드는 밴드를 넘어(오류) Green→Refactor 2벌로 쪼갰다 — 정본 §B의
// "Green→Refactor를 codepair 2벌로" 대안 배치를 그대로 따른 것.

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'TDD가 설계 기법임을 알고, 리팩터의 방향을 원칙으로 설명할 수 있다.',
    question: '이 교시가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'Red-Green-Refactor 한 사이클을 cancel()에 적용하고, Refactor의 방향을 GRASP·SOLID로 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '교정', text: 'TDD가 테스트 기법이 아니라 설계 기법임을 안다.' },
      { head: '사이클', text: 'Red-Green-Refactor 한 바퀴를 코드로 본다.' },
      { head: '나침반', text: '리팩터 방향은 원칙이 주고, 테스트는 안전망임을 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시13(SOLID)의 판단 도구가 오늘 리팩터의 나침반으로 다시 쓰인다.' },
    notes: '정본: tdd-source.md §A. 부4 마지막 교시. 배분 3분.'
  },

  // 02. 현상 — TDD를 테스트 기법으로 오해하면
  {
    kind: '현상',
    title: 'TDD는 테스트 기법이 아니다',
    sub: '테스트는 부산물이다 — TDD가 정하는 것은 설계다.',
    question: 'TDD가 남기는 것은 테스트인가, 설계 판단인가?',
    lead: { label: '교정', text: '테스트를 먼저 쓰면 구현 전에 "무엇이 있어야 하고 무엇을 던져야 하나"라는 계약이 먼저 선다 — 이게 설계 압력이다.' },
    visual: { type: 'boxes', data: [
      { title: '오해', body: ['TDD = 커버리지를 위한 테스트 작성법.'] },
      { title: '실제', body: ['TDD = 구현보다 계약을 먼저 정하는 설계 절차.'] },
    ]},
    foot: { kw: '동기', color: 'failT', body: '테스트 기법으로만 보면 "왜 먼저 쓰나"를 놓친다 — 계약이 구현보다 먼저 서는 것이 핵심이다.' },
    notes: '정본: tdd-source.md §A. 배분 4분.'
  },

  // 03. 원칙 — Red-Green-Refactor
  {
    kind: '원칙',
    title: 'Red-Green-Refactor',
    sub: '실패 → 최소 통과 → 원칙이 가리키는 방향으로 정리, 한 사이클.',
    question: '세 단계는 각각 무엇을 정하는가?',
    lead: { label: '절차', text: 'Red(계약을 실패로 선언) → Green(딱 통과할 만큼만) → Refactor(원칙이 가리키는 구조로 정리).' },
    visual: { type: 'boxes', data: [
      { title: 'Red', body: ['아직 없는 동작의 계약을 테스트로 먼저 던진다.'] },
      { title: 'Green', body: ['통과만 목표 — 인라인이어도, 못생겨도 된다.'] },
      { title: 'Refactor', body: ['초록을 유지하며 원칙이 가리키는 구조로 옮긴다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: 'Green에서 미리 다듬지 않는다 — 다듬는 건 Refactor의 몫이다(단계를 섞지 않는다).' },
    notes: '정본: tdd-source.md §B 도입부. 배분 4분.'
  },

  // 04. 적용 — Red → Green
  {
    kind: '적용',
    title: 'Red → Green',
    sub: '실패하는 계약을 먼저 쓰고, 통과만 목표로 최소 구현한다.',
    question: '구현 전에 무엇이 먼저 정해지는가?',
    lead: { label: '재료', text: 'R5(취소 조건)·R6(전이 규칙)를 시연 규칙으로 쓴다 — 교시3·12에서 이미 다룬 그 규칙이다.' },
    visual: { type: 'codepair', data: {
      prompt: '계약이 구현보다 먼저 서는가',
      versions: [
        { label: 'Red', code: '@Test void cannotCancelAfterShipped() {\n  Order o = anOrder(); o.pay(); o.ship();\n  assertThrows(CancelNotAllowed.class, o::cancel);\n}',
          marks: [{ line: 3, tag: '계약이 구현보다 먼저 선다' }] },
        { label: 'Green', code: 'void cancel() {\n  if (status == SHIPPED || status == DELIVERED)\n    throw new CancelNotAllowed(status);\n  this.status = CANCELLED;\n}',
          marks: [{ line: 2, tag: '인라인 조건 — 통과만 목표' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: 'cancel() 존재·CancelNotAllowed 던지는 계약이 Red에서 이미 정해졌다 — Green은 그 계약을 어기지 않은 채로만, 아름답지 않아도 통과만 한다.' },
    notes: '정본: tdd-source.md §B(코드 축자). 배분 6분.'
  },

  // 05. 적용 — Green → Refactor
  {
    kind: '적용',
    title: 'Green → Refactor',
    sub: '초록을 유지하며, 인라인 조건을 transitionTo로 뽑아낸다.',
    question: '초록을 유지한 채 무엇이 바뀌는가?',
    lead: { label: '이동', text: '동작은 그대로다 — 전이 조건을 흩어진 인라인에서 한 메서드(transitionTo)로 모은다.' },
    visual: { type: 'codepair', data: {
      prompt: '전이 규칙이 어디에서 어디로 갔나',
      versions: [
        { label: 'Green', code: 'void cancel() {\n  if (status == SHIPPED || status == DELIVERED)\n    throw new CancelNotAllowed(status);\n  this.status = CANCELLED;\n}',
          marks: [{ line: 2, tag: '인라인 조건' }] },
        { label: 'Refactor', code: 'void cancel() { transitionTo(CANCELLED); }\nvoid transitionTo(OrderStatus next) {\n  if (!ALLOWED.get(status).contains(next))\n    throw new IllegalTransition(status, next); }',
          marks: [{ line: 2, tag: 'transitionTo로 추출' }] },
      ] } },
    foot: { kw: '짚기', color: 'teal', body: '테스트(Red)가 초록인 채로 옮겨졌다 — 깨지면 즉시 안다. 이 이동이 안전했는지는 테스트가, 이 방향이 맞는지는 다음 장의 원칙이 답한다.' },
    notes: '정본: tdd-source.md §B(코드 축자), "Green→Refactor를 codepair 2벌로" 지침대로 배치. 배분 6분.'
  },

  // 06. 적용 — 나침반: 왜 이 방향인가
  {
    kind: '적용',
    title: '리팩터의 나침반',
    sub: '어디로 리팩터할지는 TDD가 아니라 GRASP·SOLID가 정한다.',
    question: 'transitionTo로 옮긴 방향은 무엇이 정했나?',
    lead: { label: '분업', text: 'TDD는 그 이동을 겁 없이 하게 하는 안전망이다 — 방향 자체는 원칙이 준다.' },
    visual: { type: 'boxes', data: [
      { title: 'High Cohesion·Expert', body: ['전이 규칙을 상태를 가진 Order 한 곳에 모은다.'] },
      { title: 'OCP', body: ['새 전이가 생겨도 cancel()·pay()는 안 고친다.'] },
      { title: '안전망', body: ['테스트가 초록인 채로 옮겼다 — 깨지면 즉시 안다.'] },
    ]},
    foot: { kw: '핵심', color: 'navy', body: '이 분업(원칙=방향, 테스트=안전망)이 없으면 "언제 멈추고 뭘 고칠지"를 감으로 하게 된다.' },
    notes: '정본: tdd-source.md §C — 이 교시의 핵심 장. 배분 6분.'
  },

  // 07. 적용 — 한계와 다음 복선
  {
    kind: '적용',
    title: 'TDD가 못 하는 것',
    sub: '좋은 테스트도 방향이 없으면 나쁜 설계를 못 막는다.',
    question: 'TDD만으로 충분한가?',
    lead: { label: '한계', text: '도구는 판단을 대체하지 않는다(부0 자세) — TDD는 안전망이지 판단 그 자체가 아니다.' },
    visual: { type: 'versus', data: [
      { title: 'TDD가 주는 것', body: ['겁 없이 옮길 안전망(초록 유지 확인).'] },
      { title: 'TDD가 못 주는 것', body: ['어디로 옮길지의 판단(원칙의 몫).'], negative: false },
    ]},
    foot: { kw: 'forward-ref', color: 'navy', body: '이 "원칙=방향, 테스트=안전망" 구도는 아키텍처 과정의 스파게티→TS→리치 리팩토링에서 그대로 재등장한다.' },
    notes: '정본: tdd-source.md §D. 배분 5분.'
  },

  // 08. 요약 — 부4 마무리
  {
    kind: '요약',
    head: '요약',
    title: '요약 — 부 4 마무리',
    sub: '테스트는 안전망, 방향은 원칙 — 이 분업이 부4의 결론이다.',
    question: '무엇을 가지고 다음 부로 가는가?',
    lead: { label: '회수', text: '부3(GRASP)의 배치, 부4(SOLID·TDD)의 내구성·안전망을 거쳐, 다음은 그 배치의 "경계"를 정하는 DDD 전술이다.' },
    visual: { type: 'takeaways', data: [
      { title: '교정', body: ['TDD는 설계 기법이다 — 테스트는 부산물이다.'] },
      { title: '분업', body: ['방향은 GRASP·SOLID, 안전망은 테스트.'] },
      { title: '한계', body: ['도구는 판단을 대체하지 않는다(부0 자세).'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '책임을 어디 둘지(GRASP)는 정했다 — 이제 무엇을 하나의 모델 경계로 볼지를 본다.' },
    next: 'Order라는 경계 자체는 무엇이 정하는가 — Entity·VO·Aggregate는 무엇이 다른가.',
    notes: '다음 연결은 ooad-curriculum-2day.md 부 5(교시 15 "구성요소 개관·Entity·VO·Aggregate")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 14,
  title: 'TDD로 설계 압력',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
