// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델) — 5차 나선형 재구성(static-model-source.md 5차 반영)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/static-model-source.md 5차(즉석 생성 금지)
// 5차 재구성 사유(소스 상단 명시): 4차까지 순서가 뒤죽박죽이었다 — 개념 클래스 정의가 표기
//   뒤에 나왔고, 연관 표기에서 완성 다이어그램으로 비약했고(작성 절차 설명 없음), 클래스 박스
//   세 칸 설명이 아예 없었다. 5차는 Larman의 반복·점진(iterative & incremental)을 구성 원리로
//   삼아 5개 주기로 나선형 재구성한다 — 각 주기가 이전 주기를 다시 방문하며 심화한다(나쁜
//   중복이 아니라 의도된 심화).
// 나선형 순서(엄수): 1주기(무엇을 그리나 — 개념 클래스 정의를 표기보다 먼저, 완성본 미리보기)
//   → 2주기(어떻게 표기하나 — 표기법, 개념 클래스 재방문 두 번) → 3주기(어떻게 그리나 — 작성
//   절차를 먼저 세우고 그 절차대로 워크스루) → 4주기(왜 중요한가 — 코드로 매핑) → 5주기(닫기).
// 비약 제거: 3-1(작성 절차 5단계)을 3-2(워크스루) 앞에 반드시 둔다 — 4차는 이 절차 설명 없이
//   표기(2주기 상당)에서 곧장 완성 다이어그램(워크스루)으로 건너뛰어 못 따라오는 결함이 있었다.
// 층 경계(엄수): 이것은 OOA(분석)다. 책임 배치(RDD·GRASP)는 이 파일에 한 글자도 안 들어간다.
// authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기 규약) 적용.
// 원작자·출전(slide.origin): 개념 모델(Domain Model) 개념 자체를 세우는 슬라이드(1주기 원칙)에
//   Larman 1회만 — 개별 개념·다이어그램·워크스루 단계 장엔 안 붙인다(§7 원칙).
// 렌더: engine/plantuml/render.js가 scale 4로 PNG 원본 픽셀 밀도를 올려 테두리 씻김을 막는다
//   (2026-08 확인·수정, authoring-convention.md §3 세 번째 함정 참조) — 이 덱의 uml 슬라이드마다
//   실제 렌더 후 PNG를 육안으로 확인했다(하단 잘림 없음).
// 분량 판단(OI-5): 소스가 스스로 "~2.5시간"이라 명시한다. 24장 — 4차(25장)와 비슷한 두께를
//   유지하되 순서를 전면 재편했다(다중도 훈련 3사례·판매상태 사례는 5차 소스에 없어 뺐고, 대신
//   1-3 미리보기·3-1 작성 절차 2장을 새로 얻었다). 단일 파일(교시4) 유지, 억지 분할 안 함.
// 본문 24장: 학습목표1 · 현상1(1-1a) · 원칙1(1-1b) · 적용20(1주기2·2주기8·3주기7·4주기3) · 요약1(5주기)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'Process Sale 유스케이스에서 개념 모델을 절차대로 작성할 수 있다.',
    question: '이 강의가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'UML 클래스 다이어그램 표기(클래스 박스·연관·다중도)를 읽고 그릴 수 있고, 클래스 다이어그램 작성 절차(개념 클래스 찾기→박스→연관→다중도→속성)를 NewPOS Process Sale 유스케이스에 직접 적용해 개념 모델을 만들 수 있다 — 이 강의는 나선형으로 진행된다, 같은 개념을 여러 번 다시 만나며 심화한다.' },
    visual: { type: 'bullets', data: [
      { head: '무엇을', text: '개념 클래스가 무엇인지 먼저 정의하고, 완성 다이어그램을 미리 본다.' },
      { head: '어떻게 표기', text: 'UML 클래스 다이어그램(박스·연관·다중도)을 읽고 그린다.' },
      { head: '어떻게 작성', text: '작성 절차를 먼저 세우고, 그 절차로 직접 만든다 — 심장이다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '이 강의는 OOA(분석)다 — 책임을 어디 둘지(설계)는 다루지 않는다.' },
    notes: '정본: static-model-source.md 5차. 분량 판단은 open-issues OI-5. 배분 3분.'
  },

  // ═══ 1주기 — 무엇을 그리나 ═══

  // 02. 현상 — 1-1a 정적 모델·개념 모델이란
  {
    kind: '현상',
    title: '무엇이 있는가와 무엇이 일어나는가',
    sub: '객체지향 분석은 정적(구조)과 동적(행위) 두 그림으로 본다.',
    question: '분석은 도메인의 무엇을 그리는가?',
    lead: { label: '두 그림', text: '객체지향 분석(OOA)은 도메인을 두 그림으로 본다 — 정적 모델(무엇이 존재하는가: 개념과 구조), 동적 모델(무엇이 일어나는가: 행위와 시간). 이 강의는 정적 모델이다.' },
    visual: { type: 'boxes', data: [
      { title: '정적 모델', body: ['도메인에 무엇이 존재하고 어떻게 관계 맺는가?'] },
      { title: '동적 모델', body: ['객체가 시간에 따라 어떻게 협력하는가?'] },
    ]},
    foot: { kw: '산물', color: 'navy', body: '정적 모델의 산물은 개념 모델(Domain Model, 도메인 모델)이다 — 문제 영역에 무엇이 존재하고 어떻게 관계 맺는지의 그림이다.' },
    notes: '정본: static-model-source.md §1-1. 배분 3분.'
  },

  // 03. 원칙 — 1-1b 개념 모델엔 연산이 없다 — 그러나 속성은 있다
  {
    kind: '원칙',
    title: '개념 모델엔 연산이 없다 — 그러나 속성은 있다',
    sub: '개념 모델은 소프트웨어가 아니라 현실의 개념을, UML 클래스 다이어그램으로 그린다.',
    question: '왜 코드 대신 이 그림부터 그리는가?',
    lead: { label: '핵심 오해 제거', text: '개념 모델은 소프트웨어 설계가 아니라 현실의 개념을 그린다 — 여기엔 연산(메서드)이 없다. 그러나 속성(자료)은 있다 — "자료구조가 없다"는 틀린 말이다, 속성이 곧 자료다. 가시성·타입 같은 세부는 "없다"가 아니라 "아직 정하지 않는다" — 그건 설계 단계의 몫이다. 구현을 먼저 생각하면 그 편의가 도메인 이해를 오염시킨다. 먼저 도메인을 정직하게 이해하고, 그다음 설계로 넘어간다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델에 없는 것', body: ['연산(메서드) — 행위는 아직 다루지 않는다.'] },
      { title: '개념 모델에 있는 것', body: ['속성(자료) — 단순 값은 지금도 담는다.', '가시성·타입은 "없다"가 아니라 "아직 정하지 않는다".'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '개념 모델은 "정직한 이해"의 도구다 — 책임을 어디 둘지는 여기서 다루지 않는다.' },
    origin: '도메인 모델(Domain Model): Craig Larman (Applying UML and Patterns, 3rd ed.) · UML 표기: OMG UML 표준',
    notes: '정본: static-model-source.md §1-1(정정 반영). 배분 4분.'
  },

  // 04. 적용 — 1-2 개념 클래스란 무엇인가 (정의 — 표기보다 먼저)
  {
    kind: '적용',
    title: '개념 클래스(Conceptual Class)란 무엇인가?',
    sub: '도메인에 실재하는 개념 — 표기를 배우기 전에 "무엇을 그리나"부터 정한다.',
    question: '이 강의에서 우리는 무엇을 그리게 되는가?',
    lead: { label: '정의 — 표기보다 먼저', text: '개념 클래스(Conceptual Class)는 도메인에 실재하는 개념이다 — 소프트웨어 객체가 아니라 현실의 명사다. 유형으로 나눠 보면 물리적 사물(상품), 역할(고객·계산원), 사건(판매·지불), 명세(상품 명세), 목록·장부(상품 목록)가 있다. 이 강의에서 그릴 것이 바로 이런 개념 클래스들과 그 관계다 — "무엇을 그리나"의 답이 개념 클래스다.' },
    visual: { type: 'bullets', data: [
      { head: '물리적 사물·역할', text: '상품 · 고객(Customer) · 계산원.' },
      { head: '사건·거래', text: '판매(Sale) · 지불(Payment).' },
      { head: '명세·장부', text: '상품 명세(ProductDescription) · 상품 목록(ProductCatalog).' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 개념들을 어떤 그림으로 그리는지 미리 한 번 본 다음(1-3), 표기법을 배운다(2주기).' },
    notes: '정본: static-model-source.md §1-2. 표기보다 앞서 정의(나선형 순서 엄수). 배분 4분.'
  },

  // 05. 적용 — 1-3 개념 모델의 큰 그림 (미리보기)
  {
    kind: '적용',
    title: '개념 모델의 큰 그림 — 미리보기',
    sub: '이 강의가 끝나면 이걸 스스로 그린다. 세부는 아직 몰라도 된다.',
    question: '이 강의가 끝나면 어떤 그림을 그리게 되는가?',
    lead: { label: '나침반', text: '지금은 세부(표기·작성법)를 몰라도 된다 — 이 완성본을 나침반 삼아 이후 주기가 이걸 향해 심화된다. NewPOS Process Sale의 개념 모델이다 — 4개 개념 클래스가 연관·다중도·속성으로 엮여 있다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'left to right direction\nclass Sale {\n  dateTime: Date\n}\nclass SalesLineItem {\n  quantity: int\n}\nclass ProductDescription {\n  itemID: String\n  price: Money\n  description: String\n}\nclass Payment {\n  amount: Money\n}\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '나침반', color: 'navy', body: '이 그림을 향해 간다 — 2주기는 표기법, 3주기는 이 그림을 직접 그리는 절차와 워크스루다.' },
    notes: '정본: static-model-source.md §1-3(미리보기). uml visual.type(class) 실제 렌더, 크게. 3-2 완성 슬라이드와 동일 다이어그램 — 나란히 대조된다. 배분 4분.'
  },

  // ═══ 2주기 — 어떻게 표기하나 ═══

  // 06. 적용 — 2-1 클래스 박스 (필수 — 세 칸, 타입 포함)
  {
    kind: '적용',
    title: '클래스 박스 표기 — 세 칸',
    sub: '이름 / 속성(타입 포함) / 연산 — 분석에서는 연산 칸을 정의하지 않는다.',
    question: 'UML은 개념을 어떤 그림으로 그리는가?',
    lead: { label: '표기(필수)', text: '클래스는 세 칸 박스로 그린다 — 맨 위 클래스 이름, 가운데 속성(이름과 데이터 타입, 예: quantity: int), 맨 아래 연산(operation, 메서드). 분석(OOA)에서는 연산 칸을 정의하지 않는다 — 연산(행위)은 설계(OOD)의 몫이다, 박스는 이름과 속성만 채운다. 속성의 데이터 타입도 분석 단계에선 개념적 타입(금액·수량·날짜)까지만 쓴다 — 구현 타입(BigDecimal 등)은 설계에서 정한다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale {\n  dateTime: Date\n}\nclass SalesLineItem {\n  quantity: int\n}' } },
    foot: { kw: '훈련', color: 'teal', body: '"총액을 계산한다"는 어느 칸인가? 연산 칸이다 — 개념 모델엔 아직 없다.' },
    notes: '정본: static-model-source.md §2-1(필수, 세 칸+타입). uml visual.type(class) 실제 렌더. 배분 5분.'
  },

  // 07. 적용 — 2-2 연관 (말과 그림 일치 — 포함·참조 둘 다)
  {
    kind: '적용',
    title: '연관(Association) 표기',
    sub: '두 개념을 선으로 잇고, 동사구로 관계 이름을 붙인다 — 방향은 화살표로.',
    question: 'Sale·SalesLineItem·ProductDescription은 어떤 관계이고, 어떻게 그리는가?',
    lead: { label: '표기(말과 그림 일치)', text: '연관(Association)은 개념 사이의 의미 있는 관계다 — 선은 "이 둘이 의미 있게 관계 맺는다"를 뜻한다. 관계 이름은 동사구로 적고, 읽는 방향은 화살표(삼각형)로 표시할 수 있다. Sale은 SalesLineItem을 "포함"하고, SalesLineItem은 ProductDescription을 "참조"한다 — 방금 설명한 두 관계를 그림에도 둘 다 그린다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'left to right direction\nclass Sale\nclass SalesLineItem\nclass ProductDescription\nSale --> SalesLineItem : 포함\nSalesLineItem --> ProductDescription : 참조' } },
    foot: { kw: '훈련', color: 'teal', body: '"계산원이 판매를 기록한다"의 연관은? Register --> Sale : 기록이다.' },
    notes: '정본: static-model-source.md §2-2(말과 그림 일치). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 08. 적용 — 2-3 다중도 표기 (표)
  {
    kind: '적용',
    title: '다중도(Multiplicity) 표기',
    sub: '연관선 양 끝에 개수 규칙을 적는다 — 기호마다 뜻이 다르다.',
    question: '"1..*"와 "*"는 같은 뜻인가?',
    lead: { label: '표', text: '다중도(Multiplicity)는 연관선 양 끝에 붙는 개수 규칙이다. 기호를 하나씩 표로 짚는다 — 핵심은 "*"(= 0..*, "0개 이상")와 "1..*"("하나 이상")의 차이다. *는 하나도 없을 수 있고, 1..*는 최소 하나가 있어야 한다 — 이 차이가 규칙을 가른다.' },
    visual: { type: 'table', data: [
      ['표기', '뜻'],
      ['1', '정확히 하나'],
      ['0..1 · 2..5', '없거나 하나(선택적) · 정해진 범위(예: 2~5개)'],
      ['1..*', '하나 이상 (상한 없음)'],
      ['* (= 0..*)', '0개 이상 (없어도 됨)'],
    ]},
    foot: { kw: '핵심', color: 'failT', body: '"*"는 "0개 이상"이다 — "1..*"(하나 이상)와 다르다. 하나도 없어도 되는가가 갈림길이다.' },
    notes: '정본: static-model-source.md §2-3(표). 배분 4분.'
  },

  // 09. 적용 — 2-3 다중도 예제와 읽는 법
  {
    kind: '적용',
    title: '다중도 표기 — Sale과 SalesLineItem',
    sub: '판매 하나에 항목 하나 이상이 대응한다.',
    question: '이 관계에 다중도를 붙이면 어떤 그림이 되고, 어떻게 읽는가?',
    lead: { label: '예제와 읽는 법', text: 'Sale과 SalesLineItem의 "포함" 관계에 다중도를 붙인다 — Sale 쪽은 "1"(판매 하나), SalesLineItem 쪽은 "1..*"(항목 하나 이상)다. 양 끝을 함께 읽는다 — "판매 하나에 항목이 하나 이상, 항목 하나는 판매 하나에 속한다."' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nSale "1" -- "1..*" SalesLineItem : 포함' } },
    foot: { kw: '다음', color: 'teal', body: '이 다중도가 정말 규칙을 뜻하는지, 바꾸면 무엇이 달라지는지 다음 장에서 짚는다.' },
    notes: '정본: static-model-source.md §2-3(예제+읽는 법). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 10. 적용 — 2-4 다중도가 규칙을 드러낸다 (심화, 훈련)
  {
    kind: '적용',
    title: '다중도가 규칙을 드러낸다',
    sub: '다중도를 정하는 것은 곧 규칙을 정하는 것이다.',
    question: '이 다중도가 "*"(0개 이상)라면 무엇이 달라지는가?',
    lead: { label: '판단 훈련(불변식 예고)', text: 'Sale에 SalesLineItem이 "1..*"라는 것은 곧 "판매는 최소 한 항목을 가져야 한다"는 도메인 규칙이다 — 다중도가 불변식을 미리 드러낸다. "*"(0개 이상)로 바꾸면 빈 판매를 허용하게 된다 — 도메인이 빈 판매를 원하는가? 다중도를 정하는 것이 규칙을 정하는 것이다.' },
    visual: { type: 'versus', data: [
      { title: '1..*로 정하면', body: ['빈 판매를 만들 수 없다 — 규칙이 다중도에 산다.'] },
      { title: '*(0개 이상)로 정하면', body: ['빈 판매가 허용된다 — 도메인이 원하는지 되물어야 한다.'], negative: false },
    ]},
    foot: { kw: '유보', color: 'navy', body: '이 규칙을 코드 어디서 지키는가는 설계·DDD의 몫이다 — 여기서는 "다중도가 규칙을 드러낸다"까지.' },
    notes: '정본: static-model-source.md §2-4(심화). 배분 4분.'
  },

  // 11. 적용 — 2-5 속성 + 개념 클래스 재방문 (2번째 방문, 심화)
  {
    kind: '적용',
    title: '속성인가, 개념 클래스인가? — 개념 클래스, 다시 만나다',
    sub: '단순 값은 속성, 자기만의 속성·관계를 가지면 다시 개념 클래스다.',
    question: '고객의 주소는 속성인가, 개념 클래스인가?',
    lead: { label: '심화(개념 클래스 2번째 방문)', text: '속성은 개념이 갖는 단순 값이다 — Sale.dateTime, SalesLineItem.quantity. 그런데 어떤 값은 속성이 아니라 1-2에서 정의한 개념 클래스로 다시 봐야 한다 — 판단 신호는 "자기만의 속성·관계를 갖는가?"다, Yes면 개념, No면 속성. price를 SalesLineItem 속성으로? 아니다 — 가격은 "상품이 무엇인가"에 속하므로 ProductDescription으로 민다. 고객 주소는? 단일 문자열이면 속성, 나뉘고 이력을 가지면 개념이다 — 도메인이 정한다.' },
    visual: { type: 'boxes', data: [
      { title: 'price', body: ['SalesLineItem 속성이 아니다 — ProductDescription 속성이다.'] },
      { title: '고객 주소', body: ['단일 문자열이면 속성, 나뉘고 이력 있으면 개념 클래스다.'] },
    ]},
    foot: { kw: '신호', color: 'navy', body: '"자기만의 속성·관계를 갖는가?" — 이 질문 하나로 속성과 개념 클래스를 가른다.' },
    notes: '정본: static-model-source.md §2-5(개념 클래스 2번째 방문, i&i 심화). 배분 5분.'
  },

  // 12. 적용 — 2-6 누락하기 쉬운 개념 클래스: 명세 개념 (3번째 방문, 심화)
  {
    kind: '적용',
    title: '누락하기 쉬운 개념 클래스 — 명세 개념',
    sub: '함정이 아니라, 초보가 빠뜨리기 쉬운 전형적 개념 클래스다.',
    question: '재고가 0이면 상품의 가격·설명도 사라지는가?',
    lead: { label: '심화(개념 클래스 3번째 방문)', text: '명세 개념은 함정이 아니라 초보가 빠뜨리기 쉬운 전형적 개념 클래스다. 물리적 상품(한 개)과 "그 상품이 무엇인가"(명세: 이름·가격·바코드)는 다르다 — 재고가 0이어도 명세·가격은 존재해야 한다, 그래서 상품 명세(ProductDescription)를 별도 개념으로 분리한다. 물리적 사물만 보고 명세를 빠뜨리는 것이 흔한 누락이다.' },
    visual: { type: 'versus', data: [
      { title: '명세를 빠뜨리면', body: ['재고 0이면 가격도 사라지는 잘못된 모델이 된다.'] },
      { title: '명세를 분리하면', body: ['ProductDescription이 재고와 무관하게 남는다.'], negative: false },
    ]},
    foot: { kw: '교훈', color: 'failT', body: '물리적 사물만 보고 명세를 빠뜨리는 것 — 이게 초보가 가장 흔히 놓치는 개념 클래스다.' },
    notes: '정본: static-model-source.md §2-6(명세 개념=누락 쉬운 클래스로 재정의, 개념 클래스 3번째 방문). 배분 4분.'
  },

  // 13. 적용 — 2-6 훈련 (김치찌개 예)
  {
    kind: '적용',
    title: '명세 개념 훈련 — 메뉴판과 그릇',
    sub: '메뉴판의 항목과 지금 나온 한 그릇은 같은 개념인가?',
    question: '"메뉴판의 김치찌개"와 "지금 나온 김치찌개 한 그릇"은 같은 개념인가?',
    lead: { label: '판단 훈련', text: '같은 판단을 다른 도메인에 적용해 본다 — "메뉴판의 김치찌개"(이름·가격·재료가 적힌 명세)와 "지금 내 앞에 나온 김치찌개 한 그릇"(물리적 인스턴스)은 같은 개념인가, 다른가? 메뉴에서 내려도(품절이어도) 그 항목의 이름·가격 정보는 존재할 수 있다 — 명세와 물리적 인스턴스는 다른 개념이다.' },
    visual: { type: 'versus', data: [
      { title: '메뉴판의 김치찌개', body: ['명세다 — 이름·가격·재료. 품절이어도 남는다.'] },
      { title: '나온 김치찌개 한 그릇', body: ['물리적 인스턴스다 — 지금 이 그릇 하나.'], negative: false },
    ]},
    foot: { kw: '연결', color: 'navy', body: '이 구분은 ProductDescription(명세)과 상품(물리적 아이템)의 구분과 정확히 같은 판단이다.' },
    notes: '정본: static-model-source.md §2-6(훈련). 배분 4분.'
  },

  // ═══ 3주기 — 어떻게 그리나 ═══

  // 14. 적용 — 3-1 클래스 다이어그램 작성 절차 (비약 제거)
  {
    kind: '적용',
    title: '클래스 다이어그램 작성 절차',
    sub: '개별 표기를 배웠으니, 이제 하나의 다이어그램으로 조립하는 절차다.',
    question: '개별 표기를 하나의 다이어그램으로 어떻게 조립하는가?',
    lead: { label: '절차(비약 없이)', text: '2주기에서 박스·연관·다중도·속성을 개별 표기로 배웠다. 이제 그것들을 하나의 다이어그램으로 조립하는 절차 다섯 단계다. 이 절차 없이 표기에서 완성 다이어그램으로 건너뛰면 못 따라온다 — 절차를 먼저 세우고, 다음 장부터 실제 유스케이스에 이 절차를 그대로 밟는다(워크스루).' },
    visual: { type: 'steps', data: [
      { title: '개념 클래스 찾기', body: ['명사구를 뽑고 거른다.'] },
      { title: '박스로 놓기', body: ['이름 + 속성.'] },
      { title: '연관 긋기', body: ['관계 이름을 붙인다.'] },
      { title: '다중도 정하기', body: ['규칙을 결정한다.'] },
      { title: '속성 채우기', body: ['타입까지 채운다.'] },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 다섯 단계를 NewPOS Process Sale 유스케이스에 그대로 밟는다.' },
    notes: '정본: static-model-source.md §3-1(비약 제거 — 이 설명이 4차까지 빠졌었다). 배분 5분.'
  },

  // 15. 적용 — 3-2 워크스루 출발: 유스케이스 서술
  {
    kind: '적용',
    title: '절차를 실제로 밟는다 — Process Sale에서 출발',
    sub: '방금 배운 다섯 단계를 이 유스케이스 한 문단에 그대로 적용한다.',
    question: 'Process Sale 유스케이스는 무엇을 말하는가?',
    lead: { label: '출발', text: 'Process Sale(요약)을 그대로 읽는다 — 이 한 문단에 3-1의 다섯 단계(개념 클래스 찾기→박스→연관→다중도→속성)를 그대로 적용한다.' },
    visual: { type: 'boxes', data: [
      { title: 'Process Sale — 앞부분', body: [
        '고객이 상품들을 계산대로 가져온다.',
        '계산원이 각 상품의 항목을 입력한다.',
      ] },
      { title: 'Process Sale — 뒷부분', body: [
        '시스템이 항목별 소계와 판매 총액을 계산한다.',
        '고객이 지불한다.',
      ] },
    ]},
    foot: { kw: '심장', color: 'navy', body: '이 워크스루가 이 강의의 심장이다 — 절차 다섯 단계를 하나씩 밟는다.' },
    notes: '정본: static-model-source.md §3-2(출발). Process Sale 요약 원문. 배분 3분.'
  },

  // 16. 적용 — 3-2 단계 1: 명사구 추출
  {
    kind: '적용',
    title: '단계 1 — 명사구 추출',
    sub: '유스케이스 문장에서 명사구를 그대로 뽑는다.',
    question: '이 문단에서 어떤 명사구가 뽑히는가?',
    lead: { label: '단계 1', text: '앞 문단에서 명사구를 그대로 뽑는다 — 아직 거르지 않는다. 고객, 상품, 계산대, 계산원, 항목, 소계, 판매, 총액, 지불. 아홉 개가 나왔다 — 이 중 어떤 것이 개념 클래스로 남을지는 다음 단계(거르기)에서 판단한다.' },
    visual: { type: 'bullets', data: [
      { head: '역할·장치', text: '고객, 계산대, 계산원.' },
      { head: '거래·항목', text: '상품, 항목, 판매, 지불.' },
      { head: '값(의심)', text: '소계, 총액 — 계산된 값 같다, 다음 단계에서 판단.' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '아홉 명사 중 몇은 개념이 아니라 속성이거나 잡음이다 — 거르는 것이 다음 단계다.' },
    notes: '정본: static-model-source.md §3-2(단계 1). 배분 4분.'
  },

  // 17. 적용 — 3-2 단계 2: 거르기 (uml — 박스만)
  {
    kind: '적용',
    title: '단계 2 — 거르기: 개념 vs 속성 vs 잡음',
    sub: '아홉 명사 중 남는 것을 개념 클래스 박스로 그린다.',
    question: '소계·총액·계산대는 왜 개념 클래스로 안 남는가?',
    lead: { label: '단계 2', text: '소계·총액은 계산된 값이다 — 개념이 아니라 속성/파생이다. 계산대는 이 범위에선 계산원 역할에 흡수한다(또는 Register로 남길 수도 있다 — 판단). 상품은 물리적 상품과 상품 명세로 갈린다(2-6) → ProductDescription을 채택한다. 남는 개념: Sale, SalesLineItem, ProductDescription, Payment. 아직 연관은 긋지 않는다 — 박스만 그린다(작성 절차 2단계).' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment' } },
    foot: { kw: '판단', color: 'teal', body: '거르기는 기계적이지 않다 — 계산대를 흡수할지 남길지도 판단이었다.' },
    notes: '정본: static-model-source.md §3-2(단계 2). uml visual.type(class, 박스만) 실제 렌더. 배분 5분.'
  },

  // 18. 적용 — 3-2 단계 3: 연관 긋기 (uml)
  {
    kind: '적용',
    title: '단계 3 — 연관 긋기',
    sub: '박스 네 개를 의미 있는 관계로 잇는다 — 다중도는 아직이다.',
    question: '이 네 개념은 서로 어떻게 관계 맺는가?',
    lead: { label: '단계 3', text: '문단을 다시 읽으며 관계를 찾는다 — 판매는 항목을 포함한다(Sale -- SalesLineItem : 포함). 항목은 어떤 상품인지 참조한다(SalesLineItem -- ProductDescription : 참조). 판매는 지불된다(Sale -- Payment : 지불됨). 다중도는 아직 정하지 않는다 — 관계가 있다는 것만 먼저 확정한다(작성 절차 3단계).' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment\nSale -- SalesLineItem : 포함\nSalesLineItem -- ProductDescription : 참조\nSale -- Payment : 지불됨' } },
    foot: { kw: '다음', color: 'teal', body: '"몇 개씩"인지는 다음 단계 — 다중도를 정하는 것은 규칙을 정하는 것이었다(2-4).' },
    notes: '정본: static-model-source.md §3-2(단계 3). uml visual.type(class, 관계만) 실제 렌더. 배분 4분.'
  },

  // 19. 적용 — 3-2 단계 4: 다중도 정하기 (uml)
  {
    kind: '적용',
    title: '단계 4 — 다중도 정하기',
    sub: '각 관계에 개수 규칙을 매겨 도메인 규칙을 확정한다.',
    question: '이 세 관계에 다중도를 매기면 어떤 규칙이 드러나는가?',
    lead: { label: '단계 4', text: 'Sale — SalesLineItem: 판매 하나에 항목이 하나 이상 있어야 한다 → "1" / "1..*"(빈 판매 불허 규칙, 2-4). SalesLineItem — ProductDescription: 항목 여럿이 한 명세를 참조한다 → "*" / "1". Sale — Payment: 판매 하나에 지불은 하나다 → "1" / "1". 세 다중도 모두 2주기에서 배운 표기를 그대로 적용한 것이다(작성 절차 4단계).' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '다음', color: 'teal', body: '마지막으로 각 박스에 속성을 타입까지 채우면 완성이다.' },
    notes: '정본: static-model-source.md §3-2(단계 4). uml visual.type(class, 다중도) 실제 렌더. 배분 5분.'
  },

  // 20. 적용 — 3-2 단계 5: 속성 채우기 — 완성 (uml, 크게, 1-3 미리보기와 나란히)
  {
    kind: '적용',
    title: '단계 5 — 속성 채우기: 완성',
    sub: '1-3에서 미리 본 그 그림이다 — 한 문단에서 여기까지 왔다.',
    question: '유스케이스 한 문단이 결국 어떤 그림이 되는가?',
    lead: { label: '완성(작성 절차 5단계)', text: '마지막으로 각 박스에 속성을 타입까지 채운다 — Sale.dateTime: Date, SalesLineItem.quantity: int, ProductDescription.itemID·price·description, Payment.amount: Money. 이 완성본은 1-3에서 미리 본 그 다이어그램과 같다 — 나침반이 가리키던 곳에 실제로 도착했다. 유스케이스 한 문단에서 절차 다섯 단계를 밟아 여기까지 왔다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'left to right direction\nclass Sale {\n  dateTime: Date\n}\nclass SalesLineItem {\n  quantity: int\n}\nclass ProductDescription {\n  itemID: String\n  price: Money\n  description: String\n}\nclass Payment {\n  amount: Money\n}\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '도착', color: 'navy', body: '1-3의 미리보기와 같은 그림이다 — 이게 개념 모델 작성이다.' },
    notes: '정본: static-model-source.md §3-2(단계 5, 완성 — 워크스루의 도착점). uml visual.type(class) 실제 렌더, 크게. 05번 슬라이드(1-3 미리보기)와 동일 다이어그램. 배분 6분.'
  },

  // ═══ 4주기 — 왜 중요한가 ═══

  // 21. 적용 — 4-1 세 단계 진화
  {
    kind: '적용',
    title: '개념 모델에서 코드까지 — 세 단계 진화',
    sub: '개념 모델은 설계 클래스 모델을 거쳐 코드가 된다.',
    question: '방금 완성한 이 그림은 결국 무엇이 되는가?',
    lead: { label: '세 단계', text: '개념 모델(OOA)은 현실의 개념·관계·속성이다 — "무엇이 있나"만 답한다. 설계 클래스 모델은 그 개념에 연산(책임)·가시성·타입을 붙인다 — 다음 과정(설계)의 몫이다. 코드는 그 설계 클래스가 소스로 사는 것이다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델(OOA)', body: ['현실의 개념·관계·속성 — 무엇이 있나. 방금 만든 것.'] },
      { title: '설계 클래스 모델', body: ['연산·가시성·타입이 붙는다 — 다음 몫.'] },
      { title: '코드', body: ['설계 클래스가 소스로 산다.'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '이 강의는 첫 단계(개념 모델)까지다 — 책임 배치는 여기서 하지 않는다.' },
    notes: '정본: static-model-source.md §4-1. 층 경계 엄수 — RDD·GRASP 명명 안 함. 배분 4분.'
  },

  // 22. 적용 — 4-2 구조는 코드로 곧장 매핑된다
  {
    kind: '적용',
    title: '구조는 코드로 곧장 매핑된다',
    sub: '방금 완성한 개념 모델의 구조가 코드 골격이 된다 — 연산은 비어 있다.',
    question: '방금 완성한 개념 모델의 구조가 코드에서는 어떤 모습인가?',
    lead: { label: '매핑 규칙', text: '개념 모델의 구조(개념·연관·다중도·속성)는 코드 골격으로 거의 그대로 이어진다 — 개념 클래스는 클래스로, 속성은 타입 그대로 필드로, "1" 연관은 참조 필드로, "1..*" 다중도는 컬렉션으로. 연산(행위)은 비어 있다 — 그 자리는 설계에서 책임을 배치하며 채운다.' },
    visual: { type: 'codepair', data: {
      prompt: '방금 완성한 UML 표기와 코드 골격을 나란히 보면 무엇이 오고 무엇이 비어 있는가?',
      versions: [
        { label: 'UML 표기(요지)', code: 'class Sale { dateTime: Date }\nclass SalesLineItem { quantity: int }\nSale "1" -- "1..*" SalesLineItem : 포함',
          marks: [{ line: 3, tag: '구조만 — 연산 없음' }] },
        { label: '코드 골격', code: 'class Sale {\n  private Date dateTime;\n  private List<SalesLineItem> lines;\n  // 연산 없음 — 설계에서 채운다\n}',
          marks: [{ line: 4, tag: '구조는 왔다 — 연산은 비움' }] },
      ] } },
    foot: { kw: '핵심', color: 'teal', body: '구조는 개념 모델에서 왔고 곧 코드다 — 그러나 연산은 비어 있다. 그 경계가 코드에서도 보인다.' },
    notes: '정본: static-model-source.md §4-2(코드 축자, 완성본 반영). 배분 6분.'
  },

  // 23. 적용 — 4-3 그래서 개념 모델이 중요하다
  {
    kind: '적용',
    title: '그래서 개념 모델이 중요하다',
    sub: '개념 모델이 정확하면 코드 골격이 정확하다.',
    question: '개념 모델을 대충 그리면 무엇이 틀어지는가?',
    lead: { label: '결론', text: '개념 모델이 정확하면 코드 골격이 정확하다. 명세 개념을 놓치면(상품과 명세를 안 나누면) 코드도 틀린다 — 지금 그린 이 다이어그램이 코드의 뼈대다. 대충 그리면 코드가 뒤틀린다.' },
    visual: { type: 'versus', data: [
      { title: '개념을 정직하게 보면', body: ['코드 골격이 정확하게 선다.'] },
      { title: '개념을 놓치면', body: ['코드가 뒤틀린다(예: 명세 개념 누락).'], negative: false },
    ]},
    foot: { kw: '다짐', color: 'navy', body: '이 강의의 절차·워크스루·훈련들은 그 정직함을 기르는 연습이었다.' },
    notes: '정본: static-model-source.md §4-3. 배분 3분.'
  },

  // ═══ 5주기 — 닫기 ═══

  // 24. 요약 — 닫기: 동적 모델과 설계로
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '정적 모델은 무엇이 있는가를 준다 — 언제 무엇이 일어나는지는 안 보인다.',
    question: '무엇을 가지고 다음 강의로 가는가?',
    lead: { label: '회수', text: '정적 모델은 개념 클래스 정의(1주기)→표기(2주기)→작성 절차와 워크스루(3주기)→코드로의 의미(4주기), 나선형으로 심화하며 "무엇이 있나"를 그리는 법을 줬다 — 그러나 "유스케이스가 실행될 때 이 개념들이 어떤 순서로 협력하나"는 답하지 못한다. 이 개념들에 책임을 배치해 설계 클래스로 만드는 것은 이 프로그램 뒤쪽(설계)의 몫이다 — 여기서 만든 개념 모델이 그 입력이 된다.' },
    visual: { type: 'takeaways', data: [
      { title: '개념 클래스', body: ['표기보다 먼저 정의했다 — 명세 개념처럼 빠뜨리기 쉬운 것도 있다.'] },
      { title: 'UML 표기', body: ['클래스 박스(세 칸)·연관·다중도를 읽고 그린다 — "*"는 0개 이상.'] },
      { title: '작성 절차', body: ['찾기→박스→연관→다중도→속성, 절차대로 워크스루로 직접 만들었다.'] },
    ]},
    foot: { kw: '다음', color: 'navy', body: '유스케이스가 실행되는 순간, 이 개념들이 어떤 순서로 협력하는지 본다.' },
    next: '유스케이스가 실행되는 순간, 개념들은 어떤 순서로 협력하는가?',
    notes: '정본: static-model-source.md §5주기. 다음 연결은 부1(동적 모델)로 이어진다. 책임 배치(설계)는 이 프로그램 뒤쪽에서 정식으로 다룬다. 배분 3분.'
  }
];

module.exports = { session: {
  no: 4,
  title: '정적 모델',
  type: '설명형',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
