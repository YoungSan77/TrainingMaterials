// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델) — 전면 재작성판(static-model-source.md 재작성판 반영)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/static-model-source.md 재작성판(즉석 생성 금지)
// 재작성 사유: 이전판은 개념마다 정의 한 줄 수준(개요)이었다 — 결함으로 지적됨. 이번판은 개념
//   클래스·연관/다중도·속성 각각에 소개→NewPOS 예제→판단 훈련이 여러 슬라이드로 돈다.
// 층 경계(엄수): 이것은 OOA(분석)다. 책임 배치(RDD·GRASP)는 이 파일에 한 글자도 안 들어간다 —
//   "책임 배치는 (이 프로그램 뒤쪽) 설계의 몫"이라고만 예고한다. 05.js(실습)의 GRASP forward-ref는
//   이번 재작성 범위 밖이다(이미 "아직 안 정한다"는 톤으로 forward-ref만 하고 있어 층 경계를
//   어기지 않는다 — 건드리지 않았다).
// authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기 규약) 적용.
// 원작자·출전(slide.origin): 개념 모델 핵심 구분 슬라이드(A-2)에 Larman 1회만 — 개별 개념 장엔 안 붙임.
// 분량 판단(OI-5, open-issues 신설): 소스가 스스로 "~2.5시간"이라 명시 — 본문 15장(노트 배분 합산
//   약 66분)이 50분 교시를 넘는다. 이미 커밋된 05~16.js 번호를 흔들지 않기 위해 지금은 단일
//   파일(교시4)로 유지했다 — OOAD 완성 후 일괄 정리 때 실제 분할(2강)을 다시 검토한다.
// 본문 15장: 학습목표1 · 현상1(A-1) · 원칙1(A-2) · 적용11(B3·C3·D3·E3+2) · 요약1(F)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: '개념 클래스·연관·다중도·속성을 정의하고 NewPOS로 판단할 수 있다.',
    question: '이 강의가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: '개념 모델(Domain Model)의 네 요소(개념 클래스·연관·다중도·속성)를 정의하고, NewPOS 예제로 직접 판단할 수 있다 — 명세 개념·다중도가 곧 규칙임을, 속성과 개념의 경계를 손으로 가른다.' },
    visual: { type: 'bullets', data: [
      { head: '요소', text: '개념 클래스·연관·다중도·속성 네 가지를 정의한다.' },
      { head: '판단', text: '명세 개념·다중도=규칙·속성 대 개념을 직접 가려낸다.' },
      { head: '경계', text: '개념 모델이 코드로 어떻게 이어지는지 보되, 책임 배치는 여기서 하지 않는다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '이 강의는 OOA(분석)다 — 책임을 어디 둘지(설계)는 다루지 않는다.' },
    notes: '정본: static-model-source.md 재작성판. 분량 판단은 open-issues OI-5. 배분 3분.'
  },

  // 02. 현상 — 분석의 두 그림 (A-1)
  {
    kind: '현상',
    title: '무엇이 있는가와 무엇이 일어나는가',
    sub: '객체지향 분석은 정적(구조)과 동적(행위) 두 그림으로 본다.',
    question: '분석은 도메인의 무엇을 그리는가?',
    lead: { label: '두 그림', text: '객체지향 분석(OOA)은 도메인을 두 그림으로 본다 — 정적 모델(무엇이 존재하는가: 개념과 구조), 동적 모델(무엇이 일어나는가: 행위와 시간). 이 강의는 정적 모델이다.' },
    visual: { type: 'boxes', data: [
      { title: '정적 모델', body: ['도메인에 무엇이 존재하고 어떻게 관계 맺는가.'] },
      { title: '동적 모델', body: ['그것들이 시간에 따라 어떻게 협력하는가.'] },
    ]},
    foot: { kw: '산물', color: 'navy', body: '정적 모델의 산물은 개념 모델(Domain Model)이다 — 문제 영역에 무엇이 존재하고 어떻게 관계 맺는지의 그림이다.' },
    notes: '정본: static-model-source.md §A-1. 배분 3분.'
  },

  // 03. 원칙 — 개념 모델은 코드가 아니다 (A-2)
  {
    kind: '원칙',
    title: '개념 모델은 코드가 아니다',
    sub: '개념 모델은 소프트웨어가 아니라 현실의 개념을 그린다.',
    question: '왜 코드 대신 이 그림부터 그리는가?',
    lead: { label: '핵심 오해 제거', text: '개념 모델은 소프트웨어 설계가 아니라 현실의 개념을 그린다 — 메서드도, 가시성도, 자료구조도 없다. 구현을 먼저 생각하면 그 편의가 도메인 이해를 오염시킨다. 먼저 도메인을 정직하게 이해하고, 그다음 설계로 넘어간다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델이 아닌 것', body: ['소프트웨어 설계가 아니다 — 메서드·가시성·자료구조가 없다.'] },
      { title: '이 강의가 답할 질문', body: ['도메인에 어떤 개념이 있는가?', '그것들은 어떻게 관계 맺는가?', '그 관계에 어떤 규칙이 있는가?'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '개념 모델은 "정직한 이해"의 도구다 — 책임을 어디 둘지는 여기서 다루지 않는다.' },
    origin: '도메인 모델(Domain Model): Craig Larman (Applying UML and Patterns, 3rd ed.)',
    notes: '정본: static-model-source.md §A-2. 배분 4분.'
  },

  // 04. 적용 — 개념 클래스(Conceptual Class)란 (B-1)
  {
    kind: '적용',
    title: '개념 클래스(Conceptual Class)란?',
    sub: '도메인에 실재하는 개념 — 사물·역할·사건·명세다.',
    question: 'NewPOS 도메인에는 어떤 개념 클래스가 있는가?',
    lead: { label: '정의', text: '개념 클래스(Conceptual Class)는 도메인에 실재하는 개념이다 — 사물·역할·사건·명세이며, 소프트웨어 객체가 아니라 현실의 명사다.' },
    visual: { type: 'bullets', data: [
      { head: '거래 개념', text: '판매(Sale) · 판매 항목(SalesLineItem) · 지불(Payment).' },
      { head: '명세·목록 개념', text: '상품 명세(ProductDescription) · 상품 목록(ProductCatalog).' },
      { head: '장치 개념', text: '계산대(Register).' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 개념들을 어떻게 찾아내는지는 다음 장에서 절차로 본다.' },
    notes: '정본: static-model-source.md §B-1. 배분 4분.'
  },

  // 05. 적용 — 어떻게 찾나: 절차와 판단 훈련 (B-2)
  {
    kind: '적용',
    title: '개념 클래스를 어떻게 찾나?',
    sub: '명사구를 뽑고, 판단으로 거른다.',
    question: '"지불"은 개념인가, 속성인가?',
    lead: { label: '절차', text: '출발점은 요구사항·유스케이스 서술의 명사구다 — "고객이 여러 상품을 계산대에서 구매하고 지불한다"에서 고객·상품·계산대·지불·구매(판매)를 뽑는다. 명사라고 다 개념 클래스가 아니다 — 속성일 뿐인 것, 중복·모호한 것을 거른다. 명사 추출은 출발점이지 기계적 규칙이 아니다, 판단이 든다.' },
    visual: { type: 'boxes', data: [
      { title: '훈련 — "지불"', body: ['개념이다 — 지불 방식·금액·승인을 갖는 독립 개념이다.'] },
      { title: '훈련 — "여러"', body: ['개념이 아니다 — 다중도의 신호다(다음 장).'] },
    ]},
    foot: { kw: '판단', color: 'teal', body: '명사를 뽑는 것과 개념 클래스를 가리는 것은 다른 일이다 — 후자에 판단이 든다.' },
    notes: '정본: static-model-source.md §B-2(훈련 포함). 배분 5분.'
  },

  // 06. 적용 — 함정: 명세 개념 (B-3, Larman 핵심 예 · 훈련)
  {
    kind: '적용',
    title: '함정 — 명세 개념',
    sub: '물리적 상품 하나와 "그 상품이 무엇인가"는 다른 개념이다.',
    question: '재고가 0이면 상품의 가격·설명도 사라지는가?',
    lead: { label: '판단 훈련(Larman 핵심 예)', text: '상품 한 개(물리적 아이템)와 "그 상품이 무엇인가"(명세)는 같은가, 다른가? 재고가 0이어도 상품의 가격·설명은 존재해야 한다 — 물리적 아이템이 하나도 없어도 "이 상품은 무엇이고 얼마다"는 남는다. 그래서 상품 명세(ProductDescription)를 별도 개념으로 분리한다.' },
    visual: { type: 'versus', data: [
      { title: '놓치면', body: ['재고 0이면 가격도 사라지는 잘못된 모델이 된다.'] },
      { title: '분리하면', body: ['ProductDescription이 재고와 무관하게 남는다.'], negative: false },
    ]},
    foot: { kw: '교훈', color: 'failT', body: '개념을 정직하게 보는 것이 이런 오류를 막는다 — 개념 모델링은 단순 명사 나열이 아니다.' },
    notes: '정본: static-model-source.md §B-3(Larman 핵심 예, 훈련). 배분 5분.'
  },

  // 07. 적용 — 연관(Association)이란 (C-1)
  {
    kind: '적용',
    title: '연관(Association)이란?',
    sub: '개념 사이의 의미 있는 관계다.',
    question: 'Sale과 SalesLineItem은 어떤 관계인가?',
    lead: { label: '정의', text: '연관(Association)은 개념 사이의 의미 있는 관계다 — Sale과 SalesLineItem은 "포함", SalesLineItem과 ProductDescription은 "참조" 관계다. 표기는 두 개념을 선으로 잇고 관계 이름을 붙인다.' },
    visual: { type: 'boxes', data: [
      { title: 'Sale — SalesLineItem', body: ['"포함" 관계.'] },
      { title: 'SalesLineItem — ProductDescription', body: ['"참조" 관계.'] },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 관계에 몇 개씩 대응하는지가 다중도(multiplicity)다.' },
    notes: '정본: static-model-source.md §C-1. 배분 4분.'
  },

  // 08. 적용 — 다중도(multiplicity): 관계의 개수 규칙 (C-2)
  {
    kind: '적용',
    title: '다중도(multiplicity) — 관계의 개수 규칙',
    sub: '한쪽 개념 하나에 다른 쪽이 몇 개 대응하는지 명시한다.',
    question: '"1..*"는 무엇을 뜻하는가?',
    lead: { label: '정의', text: '다중도(multiplicity)는 한쪽 개념 하나에 다른 쪽이 몇 개 대응하는지다. Sale과 SalesLineItem은 "포함" 관계로 1..*(판매 하나에 항목 하나 이상)다. SalesLineItem과 ProductDescription은 "참조" 관계로 1(항목 여럿이 한 명세를 가리킴)이다. "1..*"는 "최소 하나, 상한 없음"을 뜻한다.' },
    visual: { type: 'boxes', data: [
      { title: 'Sale ↔ SalesLineItem', body: ['1 대 1..* — 판매 하나에 항목 하나 이상.'] },
      { title: 'SalesLineItem ↔ ProductDescription', body: ['* 대 1 — 항목 여럿이 한 명세를 가리킨다.'] },
    ]},
    foot: { kw: '표기', color: 'navy', body: '1, 0..1, 1..*, * — 각각 정확히 하나·없거나 하나·하나 이상·0개 이상을 뜻한다.' },
    notes: '정본: static-model-source.md §C-2. 배분 5분.'
  },

  // 09. 적용 — 다중도가 규칙을 드러낸다: 훈련 (C-3)
  {
    kind: '적용',
    title: '다중도가 규칙을 드러낸다',
    sub: '다중도를 정하는 것은 곧 규칙을 정하는 것이다.',
    question: '이 다중도가 "0..*"라면 무엇이 달라지는가?',
    lead: { label: '판단 훈련(불변식 예고)', text: 'Sale에 SalesLineItem이 "1..*"라는 것은 곧 "판매는 최소 한 항목을 가져야 한다"는 도메인 규칙이다 — 다중도가 불변식을 미리 보여준다. 만약 "0..*"이면 빈 판매를 허용한다는 뜻이 된다 — 도메인이 정말 그것을 원하는가? 다중도를 정하는 것은 규칙을 정하는 것이다.' },
    visual: { type: 'versus', data: [
      { title: '1..*로 정하면', body: ['빈 판매를 만들 수 없다 — 규칙이 다중도에 산다.'] },
      { title: '0..*로 정하면', body: ['빈 판매가 허용된다 — 도메인이 원하는지 되물어야 한다.'], negative: false },
    ]},
    foot: { kw: '유보', color: 'navy', body: '이 규칙을 코드에서 누가 어떻게 지키는가는 설계의 몫이다 — 여기서는 규칙이 드러난다까지.' },
    notes: '정본: static-model-source.md §C-3(훈련, 불변식 예고). 배분 5분.'
  },

  // 10. 적용 — 속성(Attribute)이란 (D-1)
  {
    kind: '적용',
    title: '속성(Attribute)이란?',
    sub: '개념이 갖는 단순한 값이다.',
    question: 'Sale이 갖는 단순한 값은 무엇인가?',
    lead: { label: '정의', text: '속성(Attribute)은 개념이 갖는 단순한 값이다 — Sale.dateTime, SalesLineItem.quantity, ProductDescription.price·itemID.' },
    visual: { type: 'bullets', data: [
      { head: 'Sale', text: 'dateTime.' },
      { head: 'SalesLineItem', text: 'quantity.' },
      { head: 'ProductDescription', text: 'price · itemID.' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '그런데 어떤 값은 속성이 아니라 별도 개념이어야 한다 — 다음 장의 판단.' },
    notes: '정본: static-model-source.md §D-1. 배분 3분.'
  },

  // 11. 적용 — 속성인가, 개념인가: 훈련 (D-2)
  {
    kind: '적용',
    title: '속성인가, 개념인가?',
    sub: '단순 값은 속성, 그 자체가 개념이면 별도 클래스다.',
    question: '고객의 주소는 속성인가, 개념인가?',
    lead: { label: '판단 훈련', text: '판단 규칙은 이렇다 — 단순 값(수량·날짜·금액)은 속성, 그 자체가 독립 개념이고 관계·속성을 갖는 것은 별도 개념 클래스와 연관이다. price를 SalesLineItem의 속성으로 둘까? 아니다 — 가격은 "상품이 무엇인가"에 속하므로 ProductDescription으로 민다(명세 개념과 같은 판단).' },
    visual: { type: 'boxes', data: [
      { title: '훈련 — 고객 주소', body: ['배송·청구로 나뉘고 이력을 가지면 개념이다.', '단일 문자열이면 속성이다 — 도메인이 정한다.'] },
      { title: 'price는 왜 속성이 아닌가?', body: ['가격은 "상품이 무엇인가"(명세)에 속한다.'] },
    ]},
    foot: { kw: '연결', color: 'navy', body: '이 판단은 명세 개념(B-3)과 같은 판단이다 — 그 자체가 개념이면 속성으로 뭉개지 않는다.' },
    notes: '정본: static-model-source.md §D-2(훈련, 핵심 판단). 배분 5분.'
  },

  // 12. 적용 — 개념 모델 완성 (D-3)
  {
    kind: '적용',
    title: '개념 모델 완성',
    sub: '개념·관계·다중도·속성을 한 그림으로 모은다.',
    question: '지금까지 뽑은 것을 한 그림으로 모으면 어떤 모습인가?',
    lead: { label: '완성', text: '개념 클래스·연관·다중도·속성을 모으면 NewPOS의 개념 모델이 완성된다 — 메서드는 여전히 없다, 현실의 명사·관계·값만 있다.' },
    visual: { type: 'boxes', data: [
      { title: 'ProductCatalog — ProductDescription', body: ['포함, 1 대 1..* · price·itemID 속성.'] },
      { title: 'Register — Sale — SalesLineItem', body: ['기록(1 대 1) · 포함(1 대 1..*) · dateTime·quantity 속성.'] },
    ]},
    foot: { kw: '수준', color: 'navy', body: '개념 수준이다 — 메서드 없음, 현실의 명사·관계·값만이다.' },
    notes: '정본: static-model-source.md §D-3(전체 표기). 배분 4분.'
  },

  // 13. 적용 — 세 단계 진화 (E-1)
  {
    kind: '적용',
    title: '개념 모델에서 코드까지 — 세 단계 진화',
    sub: '개념 모델은 설계 클래스 모델을 거쳐 코드가 된다.',
    question: '이 그림은 결국 무엇이 되는가?',
    lead: { label: '세 단계', text: '개념 모델(OOA)은 현실의 개념·관계·값이다 — "무엇이 있나"만 답한다. 설계 클래스 모델은 그 개념에 책임(메서드)·가시성·타입·방향을 붙인다 — 책임을 어디에 둘지는 이 프로그램 뒤쪽(설계)에서 다룬다. 코드는 그 설계 클래스가 소스로 사는 것이다. 이 강의는 첫 단계까지 가르치되, 어디로 가는지는 보여준다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델(OOA)', body: ['현실의 개념·관계·값 — 무엇이 있나.'] },
      { title: '설계 클래스 모델', body: ['책임·가시성·타입이 붙는다 — 다음 몫.'] },
      { title: '코드', body: ['설계 클래스가 소스로 산다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '이 강의는 첫 단계(개념 모델)까지다 — 책임 배치는 여기서 하지 않는다.' },
    notes: '정본: static-model-source.md §E-1. 층 경계 엄수 — RDD·GRASP 명명 안 함. 배분 4분.'
  },

  // 14. 적용 — 구조는 코드로 곧장 매핑된다 (E-2)
  {
    kind: '적용',
    title: '구조는 코드로 곧장 매핑된다',
    sub: '구조는 코드 골격이 되지만, 행위는 비어 있다.',
    question: '개념 모델의 구조가 코드에서는 어떤 모습인가?',
    lead: { label: '매핑 규칙', text: '개념 모델의 구조(개념·연관·다중도·속성)는 코드 골격으로 거의 그대로 이어진다 — 개념 클래스는 클래스로, 속성은 필드로, "1" 연관은 참조 필드로, "1..*" 다중도는 컬렉션으로. 그러나 행위(메서드)는 비어 있다 — 그 자리는 설계에서 책임을 배치하며 채운다.' },
    visual: { type: 'codepair', data: {
      prompt: '개념 모델 표기와 코드 골격을 나란히 보면 무엇이 오고 무엇이 비어 있는가?',
      versions: [
        { label: '개념 모델', code: 'Sale ──1..*── SalesLineItem\n |dateTime         |quantity\n(메서드 없음 — 개념 수준)',
          marks: [{ line: 3, tag: '구조만 — 행위 없음' }] },
        { label: '코드 골격', code: 'class Sale {\n  private LocalDateTime dateTime;\n  private List<SalesLineItem> lines;\n  // 행위는 비어 있다 — 설계에서 채운다\n}',
          marks: [{ line: 4, tag: '구조는 왔다 — 행위는 비움' }] },
      ] } },
    foot: { kw: '핵심', color: 'teal', body: '구조는 개념 모델에서 왔고 곧 코드다 — 그러나 행위는 비어 있다. 그 경계가 코드에서도 보인다.' },
    notes: '정본: static-model-source.md §E-2(코드 축자). 배분 6분.'
  },

  // 15. 적용 — 그래서 개념 모델이 중요하다 (E-3)
  {
    kind: '적용',
    title: '그래서 개념 모델이 중요하다',
    sub: '개념 모델이 정확하면 코드 골격이 정확하다.',
    question: '개념 모델을 대충 그리면 무엇이 틀어지는가?',
    lead: { label: '결론', text: '개념 모델이 정확하면 코드 골격이 정확하다. 개념을 잘못 보면(명세 개념을 놓치면) 코드도 틀린다 — 지금 그리는 이 그림이 코드의 뼈대다.' },
    visual: { type: 'versus', data: [
      { title: '개념을 정직하게 보면', body: ['코드 골격이 정확하게 선다.'] },
      { title: '개념을 놓치면', body: ['코드가 뒤틀린다(예: 명세 개념 누락).'], negative: false },
    ]},
    foot: { kw: '다짐', color: 'navy', body: '대충 그리면 코드가 뒤틀린다 — 이 강의의 훈련들은 그 정직함을 기르는 연습이었다.' },
    notes: '정본: static-model-source.md §E-3. 배분 3분.'
  },

  // 16. 요약 — 닫기: 동적 모델과 설계로 (F)
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '정적 모델은 무엇이 있는가를 준다 — 언제 무엇이 일어나는지는 안 보인다.',
    question: '무엇을 가지고 다음 강의로 가는가?',
    lead: { label: '회수', text: '정적 모델은 "무엇이 있나"를 줬다 — 그러나 "유스케이스가 실행될 때 이 개념들이 어떤 순서로 협력하나"는 답하지 못한다. 이 개념들에 책임을 배치해 설계 클래스로 만드는 것은 이 프로그램 뒤쪽(설계)의 몫이다 — 여기서 심은 개념 모델이 그 입력이 된다.' },
    visual: { type: 'takeaways', data: [
      { title: '개념 클래스', body: ['도메인의 명사 — 명세 개념을 놓치지 않는다.'] },
      { title: '연관·다중도', body: ['다중도가 곧 규칙이다.'] },
      { title: '속성', body: ['단순 값만 — 그 자체가 개념이면 별도 클래스다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '유스케이스가 실행되는 순간, 이 개념들이 어떤 순서로 협력하는지 본다.' },
    next: '유스케이스가 실행되는 순간, 개념들은 어떤 순서로 협력하는가?',
    notes: '정본: static-model-source.md §F. 다음 연결은 부1(동적 모델)로 이어진다. 책임 배치(설계)는 이 프로그램 뒤쪽에서 정식으로 다룬다. 배분 3분.'
  }
];

module.exports = { session: {
  no: 4,
  title: '정적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
