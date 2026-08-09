// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델) — 재작성판
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/static-model-source.md (즉석 생성 금지)
// authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기 규약) 적용.
// 설명 예제는 NewPOS(Larman) — 실습(교시5)의 Order와 의도적으로 다른 도메인이다(정본 방침, GRASP·
//   DDD 전술과 같은 결). 원작자·출전(slide.origin): 개념 모델·클래스 모델 핵심 구분 슬라이드(A-2)에
//   Larman을 표시한다 — 개념 수준 1회, 개별 항목(개념 클래스·연관·속성)엔 안 붙인다.
// 클래스 모델의 책임은 RDD·GRASP에서 온다(정본 §C-1) — 교시9(책임 주도 설계)와 명시적으로 연결한다.
// 아크(부1): 유스케이스 텍스트에서 개념·관계를 뽑아 개념 모델로, 거기에 책임을 얹어 클래스 모델로
//   정련한다. 손으로 직접 하는 것은 다음 교시(5, 실습, Order)다.
// 본문 9장: 학습목표1 · 현상1(A-1) · 원칙1(A-2) · 적용5(B-1~B-4·C) · 요약1(D)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '개념 모델과 클래스 모델을 구분하고, 그 승격 과정을 설명할 수 있다.',
    question: '이 교시가 끝나면 무엇을 설명할 수 있는가?',
    lead: { label: '도달점', text: '개념 모델(Domain Model)과 클래스 모델을 구분하고, 개념 클래스·연관·다중도·속성을 NewPOS 예로 설명할 수 있다.' },
    visual: { type: 'bullets', data: [
      { head: '구분', text: '개념 모델과 클래스 모델이 각각 무엇을 답하는지 안다.' },
      { head: '요소', text: '개념 클래스·연관·다중도·속성을 정의하고 예로 짚는다.' },
      { head: '연결', text: '클래스 모델의 책임이 어디서 오는지(RDD·GRASP) 안다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '교시2~3에서 만든 유스케이스·시나리오가 개념 클래스를 찾는 재료다.' },
    notes: '정본: static-model-source.md. 실습(교시5)에서 손으로 할 절차를 강의로 먼저 세운다. 배분 3분.'
  },

  // 02. 현상 — 두 모델 축 (A-1)
  {
    kind: '현상',
    title: '무엇이 있는가와 무엇이 일어나는가',
    sub: '객체 분석은 정적(구조)과 동적(행위) 두 축으로 본다.',
    question: '분석은 도메인의 무엇을 그리는가?',
    lead: { label: '두 축', text: '객체 분석은 두 축으로 본다 — 정적 모델(무엇이 있는가: 개념·구조)과 동적 모델(무엇이 일어나는가: 행위·시간). 이 교시는 정적 모델이다.' },
    visual: { type: 'boxes', data: [
      { title: '정적 모델', body: ['도메인에 무엇이 있고 어떻게 관계 맺는가.'] },
      { title: '동적 모델', body: ['그것들이 시간에 따라 어떻게 움직이는가.'] },
    ]},
    foot: { kw: '산물', color: 'navy', body: '정적 모델의 산물은 개념 모델(Domain Model) → 클래스 모델이다 — 도메인을 먼저 이해하고, 그다음 설계로 정련한다.' },
    notes: '정본: static-model-source.md §A-1. 배분 4분.'
  },

  // 03. 원칙 — 개념 모델 vs 클래스 모델 (A-2)
  {
    kind: '원칙',
    title: '개념 모델(Domain Model) 대 클래스 모델',
    sub: '무엇이 있는가와, 그것을 어떻게 소프트웨어로 옮기는가는 다른 질문이다.',
    question: '왜 개념 모델과 클래스 모델을 나누는가?',
    lead: { label: '핵심 구분', text: '개념 모델(Conceptual/Domain Model)은 문제 영역의 개념을 그린다 — 소프트웨어가 아니라 현실의 명사들이며, 메서드·가시성이 없다. 클래스 모델(Design Class Model)은 그 개념을 소프트웨어 클래스로 옮긴다 — 책임(메서드)·가시성·타입이 붙는다. 섞으면 구현 편의가 도메인 이해를 오염시킨다.' },
    visual: { type: 'versus', data: [
      { title: '개념 모델', body: ['현실의 명사들 — 도메인에 무엇이 존재하나?', '메서드·가시성이 없다.'] },
      { title: '클래스 모델', body: ['소프트웨어 클래스 — 책임·가시성·타입이 붙는다.', 'RDD·GRASP가 여기서 책임을 배치한다.'], negative: false },
    ]},
    foot: { kw: '순서', color: 'navy', body: '개념을 먼저 정직하게 본 뒤에 설계로 넘어간다 — 구현부터 생각하면 도메인 이해가 왜곡된다.' },
    origin: '도메인 모델·정적 모델 프레임: Craig Larman (Applying UML and Patterns, 3rd ed.)',
    notes: '정본: static-model-source.md §A-2. 배분 5분.'
  },

  // 04. 적용 — 개념 클래스(Conceptual Class) 찾기 (B-1)
  {
    kind: '적용',
    title: '개념 클래스(Conceptual Class) 찾기',
    sub: '도메인의 명사 — 사물·역할·사건·명세를 찾는다.',
    question: 'NewPOS 도메인에는 어떤 개념 클래스가 있는가?',
    lead: { label: '정의·판단', text: '개념 클래스는 도메인의 명사다. 요구사항·유스케이스의 명사구에서 후보를 뽑고, 도메인에 실재하는 개념만 남긴다 — 명사 추출은 출발점이지 기계적 규칙이 아니다, 판단이 든다. 특정 상품 한 개(물리적 아이템)와 "그 상품이 무엇인지"(명세)는 다르다 — 재고가 0이어도 상품 명세·가격은 존재해야 하므로, 명세를 별도 개념으로 둔다.' },
    visual: { type: 'boxes', data: [
      { title: '거래 개념', body: ['판매(Sale) · 판매 항목(SalesLineItem) · 지불(Payment).'] },
      { title: '명세·목록 개념', body: ['상품 명세(ProductDescription) · 상품 목록(ProductCatalog).'] },
      { title: '장치 개념', body: ['계산대(Register).'] },
    ]},
    foot: { kw: '판단', color: 'teal', body: '상품 명세가 별도 개념인 이유가 "개념을 정직하게 본다"의 예다 — 물리적 재고와 그 상품이 무엇인지는 다른 명사다.' },
    notes: '정본: static-model-source.md §B-1(Larman). 배분 6분.'
  },

  // 05. 적용 — 연관(Association)과 다중도 (B-2)
  {
    kind: '적용',
    title: '연관(Association)과 다중도(multiplicity)',
    sub: '개념 사이 의미 있는 관계와 그 개수 규칙을 명시한다.',
    question: '개념들은 몇 대 몇으로 엮이는가?',
    lead: { label: '정의·판단', text: '연관은 개념 사이의 의미 있는 관계다 — Sale이 SalesLineItem을 포함하고, SalesLineItem이 ProductDescription을 참조한다. 다중도는 그 관계의 개수 규칙이다 — 한 Sale에 SalesLineItem은 1개 이상(1..*), 한 SalesLineItem에 ProductDescription은 1개다. 연관과 다중도가 불변식의 자리를 예고한다 — "판매는 최소 1개 항목"(1..*) 같은 규칙이 여기서 드러난다.' },
    visual: { type: 'boxes', data: [
      { title: 'Sale — SalesLineItem', body: ['1..* — 판매 하나가 항목을 하나 이상 포함한다.'] },
      { title: 'SalesLineItem — ProductDescription', body: ['1 — 항목 하나가 상품 명세 하나를 참조한다.'] },
    ]},
    foot: { kw: '예고', color: 'navy', body: '다중도(1..*)가 곧 나중에 코드로 지켜야 할 불변식의 초안이다 — "최소 1개 항목" 규칙이 여기서 처음 보인다.' },
    notes: '정본: static-model-source.md §B-2(Larman). 배분 6분.'
  },

  // 06. 적용 — 속성(Attribute) (B-3)
  {
    kind: '적용',
    title: '속성(Attribute)',
    sub: '개념이 갖는 값 — 그 자체가 개념이면 속성이 아니라 연관이다.',
    question: '무엇을 속성으로 두고 무엇을 별도 개념으로 두는가?',
    lead: { label: '정의·판단', text: '속성은 개념이 갖는 값이다 — Sale.dateTime, SalesLineItem.quantity, ProductDescription.price·itemID. 판단 기준은 이렇다: 단순 값(수량·날짜)은 속성으로 두고, 그 자체가 개념인 것(상품 명세)은 별도 클래스와 연관으로 둔다. price를 SalesLineItem의 속성으로 두지 않고 ProductDescription으로 미는 이유가 바로 이 판단이다.' },
    visual: { type: 'boxes', data: [
      { title: '속성으로', body: ['Sale.dateTime · SalesLineItem.quantity — 단순 값.'] },
      { title: '별도 개념으로', body: ['ProductDescription.price·itemID — 그 자체가 명세 개념.'] },
    ]},
    foot: { kw: '표기', color: 'teal', body: '개념 모델은 여기까지다 — 메서드 없이 명사·관계·다중도·속성만 그린다.' },
    notes: '정본: static-model-source.md §B-3(Larman). 배분 5분.'
  },

  // 07. 적용 — 개념 모델의 한계 (B-4)
  {
    kind: '적용',
    title: '개념 모델은 정답이 아니다',
    sub: '도메인 이해의 도구이지 명세서가 아니다.',
    question: '개념 모델을 완벽하게 그리고 나서 다음 단계로 가야 하는가?',
    lead: { label: '한계', text: '개념 모델은 완전하거나 정답인 상태가 없다 — 반복(iteration)마다 다듬어지는 도메인 이해의 도구다. 처음부터 완벽을 추구하면 분석이 마비된다. 개념 모델엔 책임(행위)이 없다 — "누가 무엇을 하나"는 다음 단계의 질문이다.' },
    visual: { type: 'boxes', data: [
      { title: '완전하지 않다', body: ['반복마다 다듬어진다 — 처음부터 완벽을 추구하지 않는다.'] },
      { title: '책임이 없다', body: ['"누가 하나"는 개념 모델의 질문이 아니다.'] },
    ]},
    foot: { kw: '규율', color: 'navy', body: '부0의 Just Enough와 같은 결이다 — 개념 모델도 코드가 요구하는 만큼만 다듬는다.' },
    notes: '정본: static-model-source.md §B-4(Larman). 배분 4분.'
  },

  // 08. 적용 — 클래스 모델: 책임은 RDD·GRASP에서 온다 (C)
  {
    kind: '적용',
    title: '클래스 모델 — 책임이 붙는다',
    sub: '개념이 소프트웨어 클래스가 되며 책임·가시성·타입이 붙는다.',
    question: '그 책임(메서드)은 어디서 오는가?',
    lead: { label: '연결', text: '개념 모델의 각 개념이 소프트웨어 클래스가 된다 — 전부는 아니다, 일부는 설계에서 합쳐지거나 나뉜다. 붙는 것은 책임(메서드)·가시성·타입·방향 있는 연관이다. 그 책임은 어디서 오는가? 책임 주도 설계(RDD)·GRASP다 — getTotal은 Sale에(정보 전문가), makeLineItem은 Sale에(창조자) — 정적 모델과 GRASP가 여기서 만난다.' },
    visual: { type: 'codepair', data: {
      prompt: '개념 모델 표기와 클래스 코드를 나란히 보면 무엇이 늘어나는가?',
      versions: [
        { label: '개념 모델', code: 'Sale ──1..*── SalesLineItem\n |dateTime         |quantity\n(메서드 없음 — 개념 수준)',
          marks: [{ line: 3, tag: '메서드·가시성 없음' }] },
        { label: '클래스 모델', code: 'class Sale {\n  private LocalDateTime dateTime;\n  private List<SalesLineItem> lines;\n  public Money getTotal() { ... }\n}',
          marks: [{ line: 4, tag: '책임 — 정보 전문가(교시9 GRASP)' }] },
      ] } },
    foot: { kw: 'forward-ref', color: 'navy', body: 'getTotal()을 Sale에 배치한 판단(정보 전문가)은 교시9(책임 주도 설계)에서 정식으로 다룬다 — 여기서는 "책임이 이렇게 붙는다"까지만.' },
    notes: '정본: static-model-source.md §C-1(코드 축자). 클래스 모델은 코드의 골격이다 — 구조는 합의되지만 협력의 순서(동적 모델)는 아직 안 보인다(§C-2). 배분 6분.'
  },

  // 09. 요약 — 동적 모델로 (D)
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '정적 모델은 무엇이 있는가를 준다 — 언제 무엇이 일어나는지는 안 보인다.',
    question: '무엇을 가지고 다음 교시로 가는가?',
    lead: { label: '회수', text: '개념 모델(명사·관계·다중도·속성) → 클래스 모델(책임·가시성·타입)로 정련하는 과정을 오늘 강의로 봤다. 다음 교시에서 Order로 손수 해 본다.' },
    visual: { type: 'takeaways', data: [
      { title: '구분', body: ['개념 모델=무엇이 있나, 클래스 모델=책임까지.'] },
      { title: '요소', body: ['개념 클래스·연관·다중도·속성이 개념 모델의 전부다.'] },
      { title: '연결', body: ['클래스 모델의 책임은 RDD·GRASP(교시9)에서 온다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '정적 모델은 "무엇이 있는가"를 준다 — "유스케이스가 실행될 때 이 객체들이 어떤 순서로 메시지를 주고받는가?"는 답하지 못한다.' },
    next: '유스케이스가 실행되는 순간, 객체들은 어떤 순서로 협력하는가.',
    notes: '정본: static-model-source.md §D. 다음 연결은 부1(교시6 "동적 모델")로 이어진다. 배분 4분.'
  }
];

module.exports = { session: {
  no: 4,
  title: '정적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
