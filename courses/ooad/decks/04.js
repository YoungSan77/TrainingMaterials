// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델) — 3차 전면 재작성판(static-model-source.md 3차 반영)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/static-model-source.md 3차(즉석 생성 금지)
// 3차 재작성 사유(소스 상단 명시): 2차가 (1) 표기·개념을 "이미 아는 사람에게 정리"하는 형식이었고
//   (2) UML 다이어그램을 슬라이드에 안 넣고 말로 때웠다 — 개념 모델이 아니라 업무 설명이 됐다(낙제).
//   이번판은 ① UML 클래스 다이어그램 표기(클래스 박스·연관·다중도)를 처음부터 표·다이어그램으로
//   가르치고 ② 모든 다이어그램을 engine의 uml visual.type(PlantUML 렌더)으로 실제로 그린다 —
//   말로 서술하지 않는다.
// 층 경계(엄수): 이것은 OOA(분석)다. 책임 배치(RDD·GRASP)는 이 파일에 한 글자도 안 들어간다 —
//   "책임 배치는 (이 프로그램 뒤쪽) 설계의 몫"이라고만 예고한다.
// authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기 규약) 적용.
// 원작자·출전(slide.origin): 개념 모델(Domain Model) 개념 자체를 세우는 슬라이드(A, "개념 모델은
//   코드가 아니다")에 Larman 1회만 — 개별 개념·다이어그램 장엔 안 붙인다(§7 원칙).
// 분량 판단(OI-5): 소스가 스스로 "~2.5시간"이라 명시하고 표기 교육 슬라이드가 늘어 2차(16장)보다도
//   길다(18장). 이미 커밋된 05~16.js 번호를 흔들지 않기 위해 지금도 단일 파일(교시4)로 유지한다 —
//   OOAD 완성 후 일괄 정리 때 실제 분할(2강)을 다시 검토한다(2차 재작성 때부터 이어지는 유보).
// 본문 18장: 학습목표1 · 현상1(A) · 원칙1(A) · 적용15(B 표기5·C 개념3·D 속성2·E 완성1·F 진화3) · 요약1(G)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'UML 클래스 다이어그램 표기를 읽고 그리며, 개념 모델의 네 요소를 NewPOS로 판단할 수 있다.',
    question: '이 강의가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'UML 클래스 다이어그램 표기(클래스 박스·연관·다중도)를 직접 읽고 그릴 수 있고, 개념 모델(Domain Model)의 네 요소(개념 클래스·연관·다중도·속성)를 정의하고 NewPOS 예제로 직접 판단할 수 있다 — 명세 개념·다중도가 곧 규칙임을, 속성과 개념의 경계를 손으로 가른다.' },
    visual: { type: 'bullets', data: [
      { head: '표기', text: 'UML 클래스 다이어그램(박스·연관·다중도)을 읽고 그린다.' },
      { head: '요소', text: '개념 클래스·연관·다중도·속성 네 가지를 정의한다.' },
      { head: '판단', text: '명세 개념·다중도=규칙·속성 대 개념을 직접 가려낸다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '이 강의는 OOA(분석)다 — 책임을 어디 둘지(설계)는 다루지 않는다.' },
    notes: '정본: static-model-source.md 3차. 분량 판단은 open-issues OI-5. 배분 3분.'
  },

  // 02. 현상 — 정적 모델은 무엇이며 왜 그리는가 (A)
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
    notes: '정본: static-model-source.md §A. 배분 3분.'
  },

  // 03. 원칙 — 개념 모델은 코드가 아니다, 표현 수단은 UML (A)
  {
    kind: '원칙',
    title: '개념 모델은 코드가 아니다',
    sub: '개념 모델은 소프트웨어가 아니라 현실의 개념을, UML 클래스 다이어그램으로 그린다.',
    question: '왜 코드 대신 이 그림부터 그리는가?',
    lead: { label: '핵심 오해 제거', text: '개념 모델은 소프트웨어 설계가 아니라 현실의 개념을 그린다 — 메서드도, 가시성도, 자료구조도 없다. 구현을 먼저 생각하면 그 편의가 도메인 이해를 오염시킨다. 먼저 도메인을 정직하게 이해하고, 그다음 설계로 넘어간다. 이때 쓰는 표현 수단이 UML 클래스 다이어그램(UML Class Diagram)이다 — 이 표기를 읽고 그리는 것이 이 강의의 실질 목표다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델이 아닌 것', body: ['소프트웨어 설계가 아니다 — 메서드·가시성·자료구조가 없다.'] },
      { title: '이 강의가 답할 질문', body: ['도메인에 어떤 개념이 있는가? 어떻게 관계 맺는가?', '그 표기(UML)를 어떻게 읽고 그리는가?'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '개념 모델은 "정직한 이해"의 도구다 — 책임을 어디 둘지는 여기서 다루지 않는다.' },
    origin: '도메인 모델(Domain Model): Craig Larman (Applying UML and Patterns, 3rd ed.) · UML 표기: OMG UML 표준',
    notes: '정본: static-model-source.md §A. 배분 4분.'
  },

  // 04. 적용 — B-1 클래스 박스 표기
  {
    kind: '적용',
    title: '클래스 박스 표기',
    sub: '클래스는 이름·속성·연산 세 칸 박스다 — 개념 모델은 연산 칸을 비운다.',
    question: 'UML은 개념을 어떤 그림으로 그리는가?',
    lead: { label: '표기', text: '클래스(Class)는 세 칸 박스로 그린다 — 이름, 속성, 연산. 개념 모델에서는 연산 칸을 비운다 — 행위(메서드)는 아직 다루지 않는다(행위는 설계에서 붙는다). 지금 그리는 것은 Sale(판매)과 SalesLineItem(판매 항목) 두 개념이 각각 어떤 속성을 갖는지다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale {\n  dateTime\n}\nclass SalesLineItem {\n  quantity\n}' } },
    foot: { kw: '다음', color: 'teal', body: '박스 두 개는 그렸다 — 이 둘이 관계 맺는 것을 표기하는 법이 다음 장이다.' },
    notes: '정본: static-model-source.md §B-1. uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 05. 적용 — B-2 연관 표기
  {
    kind: '적용',
    title: '연관(Association) 표기',
    sub: '두 개념을 선으로 잇고 관계 이름을 붙인다.',
    question: 'Sale과 SalesLineItem은 어떤 관계이고, 어떻게 그리는가?',
    lead: { label: '표기', text: '연관(Association)은 개념 사이의 의미 있는 관계다. 표기는 두 클래스 박스를 선으로 잇고, 그 위에 관계 이름을 적는다 — Sale과 SalesLineItem은 "포함" 관계다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nSale -- SalesLineItem : 포함' } },
    foot: { kw: '다음', color: 'teal', body: '이 선 양 끝에 몇 개씩 대응하는지를 적는 표기가 다중도(multiplicity)다.' },
    notes: '정본: static-model-source.md §B-2. uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 06. 적용 — B-3 다중도 표기 (표로 가르친다)
  {
    kind: '적용',
    title: '다중도(Multiplicity) 표기',
    sub: '연관선 양 끝에 개수 규칙을 적는다 — 기호마다 뜻이 다르다.',
    question: '"1..*"와 "*"는 같은 뜻인가?',
    lead: { label: '표', text: '다중도(Multiplicity)는 연관선 양 끝에 붙는 개수 규칙이다. 기호를 하나씩 표로 짚는다 — 특히 "*"(= 0..*)는 "0개 이상", 즉 하나도 없을 수 있다는 뜻이다. "1..*"(하나 이상)와 혼동하면 안 된다 — 하나는 반드시 있어야 하는가, 없어도 되는가의 차이다.' },
    visual: { type: 'table', data: [
      ['표기', '뜻'],
      ['1', '정확히 하나'],
      ['0..1 · 2..5', '없거나 하나 · 정해진 범위(예: 2~5개)'],
      ['1..*', '하나 이상 (상한 없음)'],
      ['* (= 0..*)', '0개 이상 (없어도 됨)'],
    ]},
    foot: { kw: '핵심', color: 'failT', body: '"*"는 "0개 이상"이다 — "1..*"(하나 이상)와 다르다. 하나도 없어도 되는가가 갈림길이다.' },
    notes: '정본: static-model-source.md §B-3(표). 배분 4분.'
  },

  // 07. 적용 — B-3 다중도 표기 예제
  {
    kind: '적용',
    title: '다중도 표기 — Sale과 SalesLineItem',
    sub: '판매 하나에 항목 하나 이상이 대응한다.',
    question: '이 관계에 다중도를 붙이면 어떤 그림이 되는가?',
    lead: { label: '예제', text: 'Sale과 SalesLineItem의 "포함" 관계에 다중도를 붙인다 — Sale 쪽은 "1"(판매 하나), SalesLineItem 쪽은 "1..*"(항목 하나 이상)다. 판매 하나에 항목이 하나 이상 있어야 한다는 뜻이 표기에 그대로 드러난다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nSale "1" -- "1..*" SalesLineItem : 포함' } },
    foot: { kw: '다음', color: 'teal', body: '이 다중도가 정말 규칙을 뜻하는지, 바꾸면 무엇이 달라지는지 훈련한다.' },
    notes: '정본: static-model-source.md §B-3(예제). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 08. 적용 — B-4 다중도가 규칙을 드러낸다 (훈련)
  {
    kind: '적용',
    title: '다중도가 규칙을 드러낸다',
    sub: '다중도를 정하는 것은 곧 규칙을 정하는 것이다.',
    question: '이 다중도가 "*"(0개 이상)라면 무엇이 달라지는가?',
    lead: { label: '판단 훈련(불변식 예고)', text: 'Sale에 SalesLineItem이 "1..*"라는 것은 곧 "판매는 최소 한 항목을 가져야 한다"는 도메인 규칙이다 — 다중도가 불변식을 미리 보여준다. 만약 "*"(0개 이상)로 바꾸면 빈 판매를 허용한다는 뜻이 된다 — 도메인이 정말 그것을 원하는가? 다중도를 정하는 것은 규칙을 정하는 것이다.' },
    visual: { type: 'versus', data: [
      { title: '1..*로 정하면', body: ['빈 판매를 만들 수 없다 — 규칙이 다중도에 산다.'] },
      { title: '*(0개 이상)로 정하면', body: ['빈 판매가 허용된다 — 도메인이 원하는지 되물어야 한다.'], negative: false },
    ]},
    foot: { kw: '유보', color: 'navy', body: '이 규칙을 코드에서 누가 어떻게 지키는가는 설계의 몫이다 — 여기서는 규칙이 드러난다까지.' },
    notes: '정본: static-model-source.md §B-4(훈련, 불변식 예고). 배분 5분.'
  },

  // 09. 적용 — C-1 개념 클래스란
  {
    kind: '적용',
    title: '개념 클래스(Conceptual Class)란?',
    sub: '도메인에 실재하는 개념 — 사물·역할·사건·명세다.',
    question: 'NewPOS 도메인에는 어떤 개념 클래스가 있는가?',
    lead: { label: '정의', text: '개념 클래스(Conceptual Class)는 도메인에 실재하는 개념이다 — 사물·역할·사건·명세이며, 소프트웨어 객체가 아니라 현실의 명사다. 앞서 표기를 익힐 때 쓴 Sale·SalesLineItem도 개념 클래스였다.' },
    visual: { type: 'bullets', data: [
      { head: '거래 개념', text: '판매(Sale) · 판매 항목(SalesLineItem) · 지불(Payment).' },
      { head: '명세·목록 개념', text: '상품 명세(ProductDescription) · 상품 목록(ProductCatalog).' },
      { head: '장치 개념', text: '계산대(Register).' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 개념들을 어떻게 찾아내는지는 다음 장에서 절차로 본다.' },
    notes: '정본: static-model-source.md §C-1. 배분 3분.'
  },

  // 10. 적용 — C-2 어떻게 찾나: 절차와 판단 훈련
  {
    kind: '적용',
    title: '개념 클래스를 어떻게 찾나?',
    sub: '명사구를 뽑고, 판단으로 거른다.',
    question: '"지불"은 개념인가, 속성인가?',
    lead: { label: '절차', text: '출발점은 요구사항·유스케이스 서술의 명사구다 — "고객이 여러 상품을 계산대에서 구매하고 지불한다"에서 고객·상품·계산대·지불·구매(판매)를 뽑는다. 명사라고 다 개념 클래스가 아니다 — 속성일 뿐인 것, 중복·모호한 것을 거른다. 명사 추출은 출발점이지 기계적 규칙이 아니다, 판단이 든다.' },
    visual: { type: 'boxes', data: [
      { title: '훈련 — "지불"', body: ['개념이다 — 지불 방식·금액·승인을 갖는 독립 개념이다.'] },
      { title: '훈련 — "여러"', body: ['개념이 아니다 — 다중도의 신호다(앞서 배운 표기).'] },
    ]},
    foot: { kw: '판단', color: 'teal', body: '명사를 뽑는 것과 개념 클래스를 가리는 것은 다른 일이다 — 후자에 판단이 든다.' },
    notes: '정본: static-model-source.md §C-2(훈련 포함). 배분 5분.'
  },

  // 11. 적용 — C-3 함정: 명세 개념 (Larman 핵심 예 · 훈련)
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
    notes: '정본: static-model-source.md §C-3(Larman 핵심 예, 훈련). 배분 5분.'
  },

  // 12. 적용 — D-1 속성이란
  {
    kind: '적용',
    title: '속성(Attribute)이란?',
    sub: '개념이 갖는 단순한 값이다.',
    question: 'Sale이 갖는 단순한 값은 무엇인가?',
    lead: { label: '정의', text: '속성(Attribute)은 개념이 갖는 단순한 값이다 — Sale.dateTime, SalesLineItem.quantity, ProductDescription.price·itemID. 앞서 클래스 박스 표기(B-1)에서 이미 이 값들을 속성 칸에 적었다.' },
    visual: { type: 'bullets', data: [
      { head: 'Sale', text: 'dateTime.' },
      { head: 'SalesLineItem', text: 'quantity.' },
      { head: 'ProductDescription', text: 'price · itemID.' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '그런데 어떤 값은 속성이 아니라 별도 개념이어야 한다 — 다음 장의 판단.' },
    notes: '정본: static-model-source.md §D-1. 배분 3분.'
  },

  // 13. 적용 — D-2 속성인가, 개념인가: 훈련
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
    foot: { kw: '연결', color: 'navy', body: '이 판단은 명세 개념(C-3)과 같은 판단이다 — 그 자체가 개념이면 속성으로 뭉개지 않는다.' },
    notes: '정본: static-model-source.md §D-2(훈련, 핵심 판단). 배분 5분.'
  },

  // 14. 적용 — E 개념 모델 완성 (NewPOS 전체 다이어그램)
  {
    kind: '적용',
    title: '개념 모델 완성 — NewPOS',
    sub: '지금까지 뽑은 개념·연관·다중도·속성을 한 다이어그램으로 모은다.',
    question: '지금까지 뽑은 것을 한 그림으로 모으면 어떤 모습인가?',
    lead: { label: '완성', text: '개념 클래스·연관·다중도·속성을 모으면 NewPOS의 개념 모델이 완성된다 — 메서드는 여전히 없다, 현실의 명사·관계·값만 있다. 다섯 연관을 하나씩 짚는다 — ProductCatalog가 ProductDescription을 포함하고(1..*), Register가 Sale을 기록하고(1), Sale이 SalesLineItem을 포함하고(1..*), SalesLineItem이 ProductDescription을 참조하고(*), Sale이 Payment로 지불된다(1).' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'left to right direction\nclass ProductCatalog\nclass ProductDescription {\n  itemID\n  price\n}\nclass Register\nclass Sale {\n  dateTime\n}\nclass SalesLineItem {\n  quantity\n}\nclass Payment {\n  amount\n}\nProductCatalog "1" -- "1..*" ProductDescription : 포함\nRegister "1" -- "1" Sale : 기록\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '수준', color: 'navy', body: '개념 수준이다 — 메서드 없음, 현실의 명사·관계·값만이다.' },
    notes: '정본: static-model-source.md §E. uml visual.type(class) 실제 렌더, NewPOS 전체. 배분 6분.'
  },

  // 15. 적용 — F-1 세 단계 진화
  {
    kind: '적용',
    title: '개념 모델에서 코드까지 — 세 단계 진화',
    sub: '개념 모델은 설계 클래스 모델을 거쳐 코드가 된다.',
    question: '이 그림은 결국 무엇이 되는가?',
    lead: { label: '세 단계', text: '개념 모델(OOA)은 현실의 개념·관계·값이다 — "무엇이 있나"만 답한다. 설계 클래스 모델은 그 개념에 책임(연산)·가시성·타입을 붙인다 — 책임을 어디에 둘지는 이 프로그램 뒤쪽(설계)에서 다룬다. 코드는 그 설계 클래스가 소스로 사는 것이다. 이 강의는 첫 단계까지 가르치되, 어디로 가는지는 보여준다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델(OOA)', body: ['현실의 개념·관계·값 — 무엇이 있나.'] },
      { title: '설계 클래스 모델', body: ['책임·가시성·타입이 붙는다 — 다음 몫.'] },
      { title: '코드', body: ['설계 클래스가 소스로 산다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '이 강의는 첫 단계(개념 모델)까지다 — 책임 배치는 여기서 하지 않는다.' },
    notes: '정본: static-model-source.md §F-1. 층 경계 엄수 — RDD·GRASP 명명 안 함. 배분 4분.'
  },

  // 16. 적용 — F-2 구조는 코드로 곧장 매핑된다
  {
    kind: '적용',
    title: '구조는 코드로 곧장 매핑된다',
    sub: '구조는 코드 골격이 되지만, 행위는 비어 있다.',
    question: '개념 모델의 구조가 코드에서는 어떤 모습인가?',
    lead: { label: '매핑 규칙', text: '개념 모델의 구조(개념·연관·다중도·속성)는 코드 골격으로 거의 그대로 이어진다 — 개념 클래스는 클래스로, 속성은 필드로, "1" 연관은 참조 필드로, "1..*" 다중도는 컬렉션으로. 그러나 행위(메서드)는 비어 있다 — 그 자리는 설계에서 책임을 배치하며 채운다.' },
    visual: { type: 'codepair', data: {
      prompt: '앞서 그린 UML 표기와 코드 골격을 나란히 보면 무엇이 오고 무엇이 비어 있는가?',
      versions: [
        { label: 'UML 표기', code: 'class Sale {\n  dateTime\n}\nclass SalesLineItem {\n  quantity\n}\nSale "1" -- "1..*" SalesLineItem : 포함',
          marks: [{ line: 5, tag: '구조만 — 행위 없음' }] },
        { label: '코드 골격', code: 'class Sale {\n  private LocalDateTime dateTime;\n  private List<SalesLineItem> lines;\n  // 행위는 비어 있다 — 설계에서 채운다\n}',
          marks: [{ line: 4, tag: '구조는 왔다 — 행위는 비움' }] },
      ] } },
    foot: { kw: '핵심', color: 'teal', body: '구조는 개념 모델에서 왔고 곧 코드다 — 그러나 행위는 비어 있다. 그 경계가 코드에서도 보인다.' },
    notes: '정본: static-model-source.md §F-2(코드 축자). 배분 6분.'
  },

  // 17. 적용 — F-3 그래서 개념 모델이 중요하다
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
    notes: '정본: static-model-source.md §F-3. 배분 3분.'
  },

  // 18. 요약 — 닫기: 동적 모델과 설계로 (G)
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '정적 모델은 무엇이 있는가를 준다 — 언제 무엇이 일어나는지는 안 보인다.',
    question: '무엇을 가지고 다음 강의로 가는가?',
    lead: { label: '회수', text: '정적 모델은 UML 표기로 "무엇이 있나"를 그리는 법을 줬다 — 그러나 "유스케이스가 실행될 때 이 개념들이 어떤 순서로 협력하나"는 답하지 못한다. 이 개념들에 책임을 배치해 설계 클래스로 만드는 것은 이 프로그램 뒤쪽(설계)의 몫이다 — 여기서 심은 개념 모델이 그 입력이 된다.' },
    visual: { type: 'takeaways', data: [
      { title: 'UML 표기', body: ['클래스 박스·연관·다중도를 읽고 그린다 — "*"는 0개 이상.'] },
      { title: '개념 클래스·명세 개념', body: ['도메인의 명사 — 명세 개념을 놓치지 않는다.'] },
      { title: '연관·다중도·속성', body: ['다중도가 곧 규칙이다. 속성은 단순 값만.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '유스케이스가 실행되는 순간, 이 개념들이 어떤 순서로 협력하는지 본다.' },
    next: '유스케이스가 실행되는 순간, 개념들은 어떤 순서로 협력하는가?',
    notes: '정본: static-model-source.md §G. 다음 연결은 부1(동적 모델)로 이어진다. 책임 배치(설계)는 이 프로그램 뒤쪽에서 정식으로 다룬다. 배분 3분.'
  }
];

module.exports = { session: {
  no: 4,
  title: '정적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
