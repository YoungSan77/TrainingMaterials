// 04.js — 교시 4 (부 1 · 분석(OOA) · 정적 모델) — 4차 전면 재작성판(static-model-source.md 4차 반영)
// 계약: guides/교재_작성_지침.md / 내용 정본: program-design/static-model-source.md 4차(즉석 생성 금지)
// 4차 재작성 사유(소스 상단 명시): 3차가 다이어그램·표를 넣어 진일보했으나 여전히 개요 밀도라
//   "이 정도로는 정적 모델을 스스로 작성할 수 없다"(낙제). 이번판은 작성 과정 중심 — NewPOS
//   Process Sale 유스케이스에서 출발해 개념 모델을 단계별로 만들어가는 워크스루(E절)가 심장이다.
//   각 단계를 uml 다이어그램으로 점진 구축한다(박스만→연관→다중도→완성) — 완성본만 보여주지 않는다.
// 정정 반영(소스 §정정): "개념 모델엔 연산(메서드)이 없다 — 그러나 속성(자료)은 있다"로 고쳤다.
//   3차의 "메서드도, 가시성도, 자료구조도 없다"는 틀린 표현이었다(속성이 곧 자료). 가시성은
//   "없다"가 아니라 "아직 정하지 않는다"로 정정했다. 모든 의문형 문장에 물음표를 다시 훑었다.
// 엔진 결함 수정(이번 작업에서 함께 고침): engine/plantuml/render.js의 원본 PNG가 아주 작아
//   (예: 클래스 박스 하나 ~99x75px) 슬라이드에 크게 늘려 그리면 가장 얇은 선(박스 맨 아래
//   테두리)이 확대 보간에 씻겨 "테두리가 잘렸다"처럼 보이는 결함을 실측으로 확인·수정했다
//   (scale 4 pragma로 원본 픽셀 밀도를 올리고, 인치 환산은 DENSITY*SCALE로 나눠 물리 크기는
//   그대로 유지 — layout.js·verify.js 쪽은 한 글자도 안 건드렸다, wIn/hIn 계약이 그대로라서).
// 층 경계(엄수): 이것은 OOA(분석)다. 책임 배치(RDD·GRASP)는 이 파일에 한 글자도 안 들어간다 —
//   "책임 배치는 (이 프로그램 뒤쪽) 설계의 몫"이라고만 예고한다.
// authoring-convention.md §7(슬라이드 본문 규약)·§8("한글(영어)" 표기 규약) 적용.
// 원작자·출전(slide.origin): 개념 모델(Domain Model) 개념 자체를 세우는 슬라이드(A)에 Larman
//   1회만 — 개별 개념·다이어그램·워크스루 단계 장엔 안 붙인다(§7 원칙).
// 분량 판단(OI-5): 소스가 스스로 "~2.5시간"이라 명시하고 이번엔 작성 워크스루(E, 6장)가 새로
//   들어와 3차(18장)보다도 길다(25장). 소스 자체가 "억지 분할 안 함"을 명시해 단일 파일로
//   유지한다 — OOAD 완성 후 일괄 정리 때 실제 분할(2강)을 다시 검토한다(누적 유보, 2차부터 이어짐).
// 본문 25장: 학습목표1 · 현상1(A) · 원칙1(A) · 적용22(B 표기6·C 개념4·D 속성2·E 워크스루6·F 진화3) · 요약1(G)

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '학습 목표',
    sub: 'Process Sale 유스케이스에서 개념 모델을 직접 단계별로 작성할 수 있다.',
    question: '이 강의가 끝나면 무엇을 할 수 있는가?',
    lead: { label: '도달점', text: 'UML 클래스 다이어그램 표기(클래스 박스·연관·다중도)를 읽고 그릴 수 있고, NewPOS Process Sale 유스케이스에서 명사 추출→거르기→연관→다중도→속성 순서로 개념 모델을 직접 단계별로 작성할 수 있다 — 완성본을 감상하는 것이 아니라 만드는 과정을 손으로 밟는다.' },
    visual: { type: 'bullets', data: [
      { head: '표기', text: 'UML 클래스 다이어그램(박스·연관·다중도)을 읽고 그린다.' },
      { head: '작성', text: '유스케이스 한 문단에서 개념 모델을 단계별로 만든다 — 이게 심장이다.' },
      { head: '판단', text: '명세 개념·다중도=규칙·속성 대 개념을 직접 가려낸다.' },
    ]},
    foot: { kw: '출발점', color: 'navy', body: '이 강의는 OOA(분석)다 — 책임을 어디 둘지(설계)는 다루지 않는다.' },
    notes: '정본: static-model-source.md 4차. 분량 판단은 open-issues OI-5. 배분 3분.'
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
    foot: { kw: '산물', color: 'navy', body: '정적 모델의 산물은 개념 모델(Domain Model, 도메인 모델)이다 — 문제 영역에 무엇이 존재하고 어떻게 관계 맺는지의 그림이다.' },
    notes: '정본: static-model-source.md §A. 배분 3분.'
  },

  // 03. 원칙 — 개념 모델은 코드가 아니다: 연산 없음, 속성은 있음 (A, 정정 반영)
  {
    kind: '원칙',
    title: '개념 모델엔 연산이 없다 — 그러나 속성은 있다',
    sub: '개념 모델은 소프트웨어가 아니라 현실의 개념을, UML 클래스 다이어그램으로 그린다.',
    question: '왜 코드 대신 이 그림부터 그리는가?',
    lead: { label: '핵심 오해 제거(정정)', text: '개념 모델은 소프트웨어 설계가 아니라 현실의 개념을 그린다 — 여기엔 연산(메서드)이 없다. 그러나 속성(자료)은 있다 — "자료구조가 없다"는 틀린 말이다, 속성이 곧 자료다. 가시성·타입 같은 세부는 "없다"가 아니라 "아직 정하지 않는다" — 그건 설계 단계의 몫이다. 구현을 먼저 생각하면 그 편의가 도메인 이해를 오염시킨다. 먼저 도메인을 정직하게 이해하고, 그다음 설계로 넘어간다. 이때 쓰는 표현 수단이 UML 클래스 다이어그램이다 — 이 표기를 읽고 그리는 것이 이 강의의 실질 목표다.' },
    visual: { type: 'boxes', data: [
      { title: '개념 모델에 없는 것', body: ['연산(메서드) — 행위는 아직 다루지 않는다.'] },
      { title: '개념 모델에 있는 것', body: ['속성(자료) — 단순 값은 지금도 담는다.', '가시성·타입은 "없다"가 아니라 "아직 정하지 않는다".'] },
    ]},
    foot: { kw: '경계', color: 'navy', body: '개념 모델은 "정직한 이해"의 도구다 — 책임을 어디 둘지는 여기서 다루지 않는다.' },
    origin: '도메인 모델(Domain Model): Craig Larman (Applying UML and Patterns, 3rd ed.) · UML 표기: OMG UML 표준',
    notes: '정본: static-model-source.md §A(정정 반영). 배분 4분.'
  },

  // 04. 적용 — B-1 클래스 박스 표기
  {
    kind: '적용',
    title: '클래스 박스 표기',
    sub: '클래스는 이름·속성·연산 세 칸 박스다 — 연산 칸은 비우고, 속성 칸은 채운다.',
    question: 'UML은 개념을 어떤 그림으로 그리는가?',
    lead: { label: '표기', text: '클래스(Class)는 세 칸 박스로 그린다 — 이름, 속성, 연산. 개념 모델에서는 연산 칸을 비운다(연산=행위는 설계에서 붙는다). 속성 칸은 채운다 — 지금 그리는 것은 Sale(판매)과 SalesLineItem(판매 항목) 두 개념이 각각 어떤 속성을 갖는지다. 빈 칸은 그림에 아예 표시되지 않는다 — 채워지면 그때 나타난다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale {\n  dateTime\n}\nclass SalesLineItem {\n  quantity\n}' } },
    foot: { kw: '훈련', color: 'teal', body: '"dateTime"은 어느 칸인가? 속성 칸이다. "총액을 계산한다"는 어느 칸인가? 연산 칸이다 — 개념 모델엔 아직 없다.' },
    notes: '정본: static-model-source.md §B-1(예제+훈련). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 05. 적용 — B-2 연관 표기
  {
    kind: '적용',
    title: '연관(Association) 표기',
    sub: '두 개념을 선으로 잇고, 동사구로 관계 이름을 붙인다.',
    question: 'Sale과 SalesLineItem은 어떤 관계이고, 어떻게 그리는가?',
    lead: { label: '표기', text: '연관(Association)은 개념 사이의 의미 있는 관계다 — 선은 "이 둘이 의미 있게 관계 맺는다"를 뜻한다. 관계 이름은 동사구로 적는다 — Sale은 SalesLineItem을 "포함"하고, SalesLineItem은 ProductDescription을 "참조"한다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nSale -- SalesLineItem : 포함' } },
    foot: { kw: '훈련', color: 'teal', body: '"계산원이 판매를 기록한다"에서 연관은? Register(계산원) -- Sale, 이름="기록"이다.' },
    notes: '정본: static-model-source.md §B-2(예제+훈련). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 06. 적용 — B-3 다중도 표기 (표로 가르친다)
  {
    kind: '적용',
    title: '다중도(Multiplicity) 표기',
    sub: '연관선 양 끝에 개수 규칙을 적는다 — 기호마다 뜻이 다르다.',
    question: '"1..*"와 "*"는 같은 뜻인가?',
    lead: { label: '표', text: '다중도(Multiplicity)는 연관선 양 끝에 붙는 개수 규칙이다. 기호를 하나씩 표로 짚는다 — 핵심은 "*"(= 0..*, "0개 이상")와 "1..*"("하나 이상")의 차이다. *는 하나도 없을 수 있고, 1..*는 최소 하나가 있어야 한다.' },
    visual: { type: 'table', data: [
      ['표기', '뜻'],
      ['1', '정확히 하나'],
      ['0..1 · 2..5', '없거나 하나(선택적) · 정해진 범위(예: 2~5개)'],
      ['1..*', '하나 이상 (상한 없음)'],
      ['* (= 0..*)', '0개 이상 (없어도 됨)'],
    ]},
    foot: { kw: '핵심', color: 'failT', body: '"*"는 "0개 이상"이다 — "1..*"(하나 이상)와 다르다. 하나도 없어도 되는가가 갈림길이다.' },
    notes: '정본: static-model-source.md §B-3(표). 배분 4분.'
  },

  // 07. 적용 — B-3 다중도 표기 예제와 읽는 법
  {
    kind: '적용',
    title: '다중도 표기 — Sale과 SalesLineItem',
    sub: '판매 하나에 항목 하나 이상이 대응한다.',
    question: '이 관계에 다중도를 붙이면 어떤 그림이 되고, 어떻게 읽는가?',
    lead: { label: '예제와 읽는 법', text: 'Sale과 SalesLineItem의 "포함" 관계에 다중도를 붙인다 — Sale 쪽은 "1"(판매 하나), SalesLineItem 쪽은 "1..*"(항목 하나 이상)다. 양 끝을 함께 읽는다 — "판매 하나에 항목이 하나 이상, 항목 하나는 판매 하나에 속한다."' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nSale "1" -- "1..*" SalesLineItem : 포함' } },
    foot: { kw: '다음', color: 'teal', body: '이 표기를 다른 관계에도 적용해 본다 — 훈련이 다음 장이다.' },
    notes: '정본: static-model-source.md §B-3(예제+읽는 법). uml visual.type(class) 실제 렌더. 배분 4분.'
  },

  // 08. 적용 — B-3 다중도 훈련 여럿
  {
    kind: '적용',
    title: '다중도 훈련 — NewPOS의 다른 관계들',
    sub: '고객·지불·상품 명세 관계에 다중도를 직접 매겨 본다.',
    question: '한 고객이 여러 판매를 할 수 있는가? 판매 하나에 지불은 몇 개인가?',
    lead: { label: '훈련 여럿', text: '같은 표기를 세 관계에 더 적용해 본다. 한 고객이 여러 판매를 할 수 있고, 아직 한 번도 안 샀을 수도 있다 → Customer "1" -- "*" Sale. 판매 하나에 지불은 보통 정확히 하나다 → Sale "1" -- "1" Payment(단, 외상이면 "0..1"일 수 있다 — 도메인이 정한다). 한 상품 명세를 여러 항목이 참조한다 → SalesLineItem "*" -- "1" ProductDescription.' },
    visual: { type: 'boxes', data: [
      { title: 'Customer — Sale', body: ['"1" 대 "*" — 판매가 없을 수도 있다(0개 이상).'] },
      { title: 'Sale — Payment', body: ['"1" 대 "1"(외상이면 "0..1") — 도메인이 정한다.'] },
      { title: 'SalesLineItem — ProductDescription', body: ['"*" 대 "1" — 항목 여럿이 한 명세를 참조한다.'] },
    ]},
    foot: { kw: '판단', color: 'teal', body: '다중도는 암기가 아니라 매번 도메인에 되묻는 판단이다 — "이게 없을 수 있는가?"부터 묻는다.' },
    notes: '정본: static-model-source.md §B-3(훈련 여럿). 배분 5분.'
  },

  // 09. 적용 — B-4 다중도가 규칙을 드러낸다 (판단 훈련)
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
    foot: { kw: '유보', color: 'navy', body: '이 규칙을 코드 어디서 지키는가는 설계·DDD의 몫이다 — 여기서는 "다중도가 규칙을 드러낸다"까지.' },
    notes: '정본: static-model-source.md §B-4(훈련, 불변식 예고). 배분 5분.'
  },

  // 10. 적용 — C-1 개념 클래스란
  {
    kind: '적용',
    title: '개념 클래스(Conceptual Class)란?',
    sub: '도메인에 실재하는 개념 — 사물·역할·사건·명세다.',
    question: '개념 클래스에는 어떤 종류가 있는가?',
    lead: { label: '정의와 종류', text: '개념 클래스(Conceptual Class)는 도메인에 실재하는 개념이다 — 소프트웨어 객체가 아니라 현실의 명사다. 종류로 나눠 보면 물리적 사물(상품), 역할(고객·계산원), 사건(판매·지불), 명세(상품 명세), 장부·목록(상품 목록)이 있다.' },
    visual: { type: 'bullets', data: [
      { head: '물리적 사물·역할', text: '상품 · 고객(Customer) · 계산원.' },
      { head: '사건·거래', text: '판매(Sale) · 지불(Payment).' },
      { head: '명세·장부', text: '상품 명세(ProductDescription) · 상품 목록(ProductCatalog).' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '이 개념들을 어떻게 찾아내는지는 다음 장에서 절차로 본다.' },
    notes: '정본: static-model-source.md §C-1. 배분 4분.'
  },

  // 11. 적용 — C-2 찾는 절차: 명사구 추출과 거르기
  {
    kind: '적용',
    title: '개념 클래스를 어떻게 찾나?',
    sub: '명사구를 뽑고, 네 가지 기준으로 거른다.',
    question: '뽑은 명사를 어떤 기준으로 거르는가?',
    lead: { label: '절차', text: '출발점은 요구사항·유스케이스 서술의 명사구다. 이건 출발점이지 기계적 규칙이 아니다 — 뽑은 뒤 판단으로 거른다. 거르는 기준 넷: 단순 값일 뿐인 것(날짜·금액·수량)은 개념이 아니라 속성 후보다. 중복·동의어는 하나로 합친다. 시스템 자신·UI 용어는 도메인 개념이 아니다. 애매하면 남겨두고 반복(iteration)에서 정한다.' },
    visual: { type: 'bullets', data: [
      { head: '속성 후보로 거름', text: '날짜·금액·수량 같은 단순 값.' },
      { head: '하나로 합침', text: '중복·동의어.' },
      { head: '개념이 아님', text: '시스템 자신·UI 용어.' },
      { head: '보류', text: '애매하면 남겨두고 반복에서 정한다.' },
    ]},
    foot: { kw: '판단', color: 'teal', body: '명사를 뽑는 것과 개념 클래스를 가리는 것은 다른 일이다 — 후자에 판단이 든다.' },
    notes: '정본: static-model-source.md §C-2(거르는 기준 넷). 배분 5분.'
  },

  // 12. 적용 — C-3 함정: 명세 개념 (Larman 핵심 예)
  {
    kind: '적용',
    title: '함정 — 명세 개념',
    sub: '물리적 상품 하나와 "그 상품이 무엇인가"는 다른 개념이다.',
    question: '재고가 0이면 상품의 가격·설명도 사라지는가?',
    lead: { label: '판단 훈련(Larman 핵심 예)', text: '상품 한 개(물리적 아이템)와 "그 상품이 무엇인가"(명세: 이름·가격·바코드)는 같은가, 다른가? 재고가 0이어도 "이 상품은 무엇이고 얼마인가"는 존재해야 한다 → 상품 명세(ProductDescription)를 물리적 상품과 별도 개념으로 분리한다. 놓치면 "재고 0이면 가격 정보도 사라지는" 잘못된 모델이 된다.' },
    visual: { type: 'versus', data: [
      { title: '놓치면', body: ['재고 0이면 가격도 사라지는 잘못된 모델이 된다.'] },
      { title: '분리하면', body: ['ProductDescription이 재고와 무관하게 남는다.'], negative: false },
    ]},
    foot: { kw: '교훈', color: 'failT', body: '개념을 정직하게 보는 것이 이런 오류를 막는다 — 개념 모델링은 단순 명사 나열이 아니다.' },
    notes: '정본: static-model-source.md §C-3(Larman 핵심 예). 배분 4분.'
  },

  // 13. 적용 — C-3 함정: 명세 개념 훈련 (김치찌개 예)
  {
    kind: '적용',
    title: '명세 개념 훈련 — 메뉴판과 그릇',
    sub: '메뉴판의 항목과 지금 나온 한 그릇은 같은 개념인가?',
    question: '"메뉴판의 김치찌개"와 "지금 나온 김치찌개 한 그릇"은 같은 개념인가?',
    lead: { label: '판단 훈련', text: '같은 판단을 다른 도메인에 적용해 본다 — "메뉴판의 김치찌개"(이름·가격·재료가 적힌 명세)와 "지금 내 앞에 나온 김치찌개 한 그릇"(물리적 인스턴스)은 같은 개념인가, 다른가? 메뉴에서 내려도(품절이어도) 그 항목의 이름·가격 정보는 존재할 수 있다 — 명세와 물리적 인스턴스는 다른 개념이다. ProductDescription과 상품의 관계와 같은 구조다.' },
    visual: { type: 'versus', data: [
      { title: '메뉴판의 김치찌개', body: ['명세다 — 이름·가격·재료. 품절이어도 남는다.'] },
      { title: '나온 김치찌개 한 그릇', body: ['물리적 인스턴스다 — 지금 이 그릇 하나.'], negative: false },
    ]},
    foot: { kw: '연결', color: 'navy', body: '이 구분은 ProductDescription(명세)과 상품(물리적 아이템)의 구분과 정확히 같은 판단이다.' },
    notes: '정본: static-model-source.md §C-3(김치찌개 훈련, 4차 신설). 배분 4분.'
  },

  // 14. 적용 — D-1 속성이란
  {
    kind: '적용',
    title: '속성(Attribute)이란?',
    sub: '개념이 갖는 단순한 값 — 속성 칸에 적는다.',
    question: 'Sale이 갖는 단순한 값은 무엇인가?',
    lead: { label: '정의', text: '속성(Attribute)은 개념이 갖는 단순한 값이다 — Sale.dateTime, SalesLineItem.quantity, ProductDescription.price·itemID·description. 속성은 개념 박스의 속성 칸에 적는다 — 개념 모델에도 속성은 있다, 없는 것은 연산뿐이다(B-1에서 이미 그렸다).' },
    visual: { type: 'bullets', data: [
      { head: 'Sale', text: 'dateTime.' },
      { head: 'SalesLineItem', text: 'quantity.' },
      { head: 'ProductDescription', text: 'itemID · price · description.' },
    ]},
    foot: { kw: '다음', color: 'teal', body: '그런데 어떤 값은 속성이 아니라 별도 개념이어야 한다 — 다음 장의 판단.' },
    notes: '정본: static-model-source.md §D-1. 배분 3분.'
  },

  // 15. 적용 — D-2 속성인가, 별도 개념인가: 경계 사례 여럿
  {
    kind: '적용',
    title: '속성인가, 별도 개념인가?',
    sub: '자기만의 속성·관계를 가지면 개념, 아니면 속성이다.',
    question: '판매의 상태(PENDING/PAID…)는 속성인가, 별도로 다뤄야 하는가?',
    lead: { label: '판단 훈련(경계 사례 여럿)', text: '판단 신호는 하나다 — "이것이 자기만의 속성이나 관계를 갖는가?" Yes면 개념, No면 속성이다. price를 SalesLineItem 속성으로? 아니다 — 가격은 "상품이 무엇인가"에 속하므로 ProductDescription으로 민다. 고객 주소는? 단일 문자열이면 속성, 배송·청구로 나뉘고 이력을 가지면 개념이다. 판매 상태는? 단순 값이면 속성(enum)이지만, 상태별 행동·전이 규칙이 붙으면 별도로 다룬다(동적 모델의 몫).' },
    visual: { type: 'boxes', data: [
      { title: 'price', body: ['SalesLineItem 속성이 아니다 — ProductDescription 속성이다.'] },
      { title: '고객 주소', body: ['단일 문자열이면 속성, 나뉘고 이력 있으면 개념이다.'] },
      { title: '판매 상태', body: ['단순 값이면 속성(enum), 전이 규칙이 있으면 동적 모델로.'] },
    ]},
    foot: { kw: '신호', color: 'navy', body: '"자기만의 속성·관계를 갖는가?" — 이 질문 하나로 속성과 개념을 가른다.' },
    notes: '정본: static-model-source.md §D-2(경계 사례 여럿). 배분 5분.'
  },

  // 16. 적용 — E-1 작성 워크스루 출발: 유스케이스 서술
  {
    kind: '적용',
    title: '이제 직접 만든다 — Process Sale에서 출발',
    sub: '완성본을 감상하지 않는다 — 이 문단에서 개념 모델을 단계별로 만든다.',
    question: 'Process Sale 유스케이스는 무엇을 말하는가?',
    lead: { label: '출발', text: '지금까지 배운 표기·판단을 실제로 써 본다. Process Sale(요약)을 그대로 읽는다 — 이 한 문단에서 개념 모델을 다섯 단계로 만들어 간다: 명사 추출 → 거르기 → 연관 → 다중도 → 속성.' },
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
    foot: { kw: '심장', color: 'navy', body: '이 워크스루가 이 강의의 심장이다 — 다섯 단계를 하나씩 밟는다.' },
    notes: '정본: static-model-source.md §E-1. Process Sale 요약 원문. 배분 3분.'
  },

  // 17. 적용 — E-2 단계 1: 명사구 추출
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
    notes: '정본: static-model-source.md §E-2(명사구 추출). 배분 4분.'
  },

  // 18. 적용 — E-3 단계 2: 거르기 (uml — 박스만)
  {
    kind: '적용',
    title: '단계 2 — 거르기: 개념 vs 속성 vs 잡음',
    sub: '아홉 명사 중 남는 것을 개념 클래스 박스로 그린다.',
    question: '소계·총액·계산대는 왜 개념 클래스로 안 남는가?',
    lead: { label: '단계 2', text: '소계·총액은 계산된 값이다 — 개념이 아니라 속성/파생이다. 계산대는 이 범위에선 계산원 역할에 흡수하거나 Register로 남길 수 있다 — 판단이다(둘 다 가능, 여기선 흡수). 상품은 물리적 상품과 상품 명세로 갈린다(C-3의 함정) → ProductDescription을 채택한다. 남는 개념 후보: Sale, SalesLineItem, ProductDescription, Payment. 아직 연관은 긋지 않는다 — 박스만 그린다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment' } },
    foot: { kw: '판단', color: 'teal', body: '거르기는 기계적이지 않다 — 계산대를 흡수할지 남길지도 판단이었다.' },
    notes: '정본: static-model-source.md §E-3(거르기). uml visual.type(class, 박스만) 실제 렌더. 배분 5분.'
  },

  // 19. 적용 — E-4 단계 3: 연관 긋기 (uml — 관계만, 다중도 아직)
  {
    kind: '적용',
    title: '단계 3 — 연관 긋기',
    sub: '박스 네 개를 의미 있는 관계로 잇는다 — 다중도는 아직이다.',
    question: '이 네 개념은 서로 어떻게 관계 맺는가?',
    lead: { label: '단계 3', text: '문단을 다시 읽으며 관계를 찾는다 — 판매는 항목을 포함한다(Sale -- SalesLineItem : 포함). 항목은 어떤 상품인지 참조한다(SalesLineItem -- ProductDescription : 참조). 판매는 지불된다(Sale -- Payment : 지불됨). 다중도는 아직 정하지 않는다 — 관계가 있다는 것만 먼저 확정한다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment\nSale -- SalesLineItem : 포함\nSalesLineItem -- ProductDescription : 참조\nSale -- Payment : 지불됨' } },
    foot: { kw: '다음', color: 'teal', body: '"몇 개씩"인지는 다음 단계 — 다중도를 정하는 것은 규칙을 정하는 것이었다(B-4).' },
    notes: '정본: static-model-source.md §E-4(연관 긋기). uml visual.type(class, 관계만) 실제 렌더. 배분 4분.'
  },

  // 20. 적용 — E-5 단계 4: 다중도 정하기 (uml — 다중도 붙임)
  {
    kind: '적용',
    title: '단계 4 — 다중도 정하기',
    sub: '각 관계에 개수 규칙을 매겨 도메인 규칙을 확정한다.',
    question: '이 세 관계에 다중도를 매기면 어떤 규칙이 드러나는가?',
    lead: { label: '단계 4', text: 'Sale — SalesLineItem: 판매 하나에 항목이 하나 이상 있어야 한다 → "1" / "1..*"(빈 판매 불허 규칙, B-4). SalesLineItem — ProductDescription: 항목 여럿이 한 명세를 참조한다 → "*" / "1". Sale — Payment: 판매 하나에 지불은 하나다 → "1" / "1". 세 다중도 모두 B절에서 배운 표기를 그대로 적용한 것이다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'class Sale\nclass SalesLineItem\nclass ProductDescription\nclass Payment\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '다음', color: 'teal', body: '마지막으로 각 박스에 속성을 채우면 완성이다.' },
    notes: '정본: static-model-source.md §E-5(다중도 정하기). uml visual.type(class, 다중도) 실제 렌더. 배분 5분.'
  },

  // 21. 적용 — E-6 단계 5: 속성 붙이기 (uml — 완성, 크게)
  {
    kind: '적용',
    title: '단계 5 — 속성 붙이기: 완성',
    sub: '유스케이스 한 문단에서 여기까지 왔다.',
    question: '유스케이스 한 문단이 결국 어떤 그림이 되는가?',
    lead: { label: '완성', text: '마지막으로 각 박스에 속성을 채운다 — Sale.dateTime, SalesLineItem.quantity, ProductDescription.itemID·price·description, Payment.amount. 이것이 Process Sale의 개념 모델이다 — 유스케이스 한 문단에서 명사 추출→거르기→연관→다중도→속성, 다섯 단계를 밟아 여기까지 왔다.' },
    visual: { type: 'uml', data: { kind: 'class',
      source: 'left to right direction\nclass Sale {\n  dateTime\n}\nclass SalesLineItem {\n  quantity\n}\nclass ProductDescription {\n  itemID\n  price\n  description\n}\nclass Payment {\n  amount\n}\nSale "1" -- "1..*" SalesLineItem : 포함\nSalesLineItem "*" -- "1" ProductDescription : 참조\nSale "1" -- "1" Payment : 지불됨' } },
    foot: { kw: '수준', color: 'navy', body: '개념 수준이다 — 연산 없음, 현실의 명사·관계·다중도·속성만이다.' },
    notes: '정본: static-model-source.md §E-6(완성, 워크스루의 도착점). uml visual.type(class) 실제 렌더, 크게. 배분 6분.'
  },

  // 22. 적용 — F-1 세 단계 진화
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
    notes: '정본: static-model-source.md §F-1. 층 경계 엄수 — RDD·GRASP 명명 안 함. 배분 4분.'
  },

  // 23. 적용 — F-2 구조는 코드로 곧장 매핑된다
  {
    kind: '적용',
    title: '구조는 코드로 곧장 매핑된다',
    sub: '방금 완성한 개념 모델의 구조가 코드 골격이 된다 — 연산은 비어 있다.',
    question: '방금 완성한 개념 모델의 구조가 코드에서는 어떤 모습인가?',
    lead: { label: '매핑 규칙', text: '개념 모델의 구조(개념·연관·다중도·속성)는 코드 골격으로 거의 그대로 이어진다 — 개념 클래스는 클래스로, 속성은 필드로, "1" 연관은 참조 필드로, "1..*" 다중도는 컬렉션으로(ProductDescription 등 나머지 클래스도 같은 규칙이 그대로 적용된다). 다중도가 정한 규칙(예: 빈 판매 불허)은 코드에 아직 강제되지 않는다 — 그건 설계에서 채운다. 연산(행위)도 비어 있다 — 그 자리는 설계에서 책임을 배치하며 채운다.' },
    visual: { type: 'codepair', data: {
      prompt: '방금 완성한 UML 표기와 코드 골격을 나란히 보면 무엇이 오고 무엇이 비어 있는가?',
      versions: [
        { label: 'UML 표기(요지)', code: 'class Sale { dateTime }\nclass SalesLineItem { quantity }\nSale "1" -- "1..*" SalesLineItem : 포함',
          marks: [{ line: 3, tag: '구조만 — 연산 없음' }] },
        { label: '코드 골격', code: 'class Sale {\n  private LocalDateTime dateTime;\n  private List<SalesLineItem> lines;\n  // 연산 없음 — 설계에서 채운다\n}',
          marks: [{ line: 4, tag: '구조는 왔다 — 연산은 비움' }] },
      ] } },
    foot: { kw: '핵심', color: 'teal', body: '구조는 개념 모델에서 왔고 곧 코드다 — 그러나 연산은 비어 있다. 그 경계가 코드에서도 보인다.' },
    notes: '정본: static-model-source.md §F-2(코드 축자, E-6 완성본 반영). 배분 6분.'
  },

  // 24. 적용 — F-3 그래서 개념 모델이 중요하다
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
    foot: { kw: '다짐', color: 'navy', body: '이 강의의 워크스루와 훈련들은 그 정직함을 기르는 연습이었다.' },
    notes: '정본: static-model-source.md §F-3. 배분 3분.'
  },

  // 25. 요약 — 닫기: 동적 모델과 설계로 (G)
  {
    kind: '요약',
    head: '요약',
    title: '요약',
    sub: '정적 모델은 무엇이 있는가를 준다 — 언제 무엇이 일어나는지는 안 보인다.',
    question: '무엇을 가지고 다음 강의로 가는가?',
    lead: { label: '회수', text: '정적 모델은 UML 표기로 "무엇이 있나"를 그리는 법을 줬고, Process Sale 워크스루로 그 개념 모델을 직접 만드는 법을 줬다 — 그러나 "유스케이스가 실행될 때 이 개념들이 어떤 순서로 협력하나"는 답하지 못한다. 이 개념들에 책임을 배치해 설계 클래스로 만드는 것은 이 프로그램 뒤쪽(설계)의 몫이다 — 여기서 만든 개념 모델이 그 입력이 된다.' },
    visual: { type: 'takeaways', data: [
      { title: 'UML 표기', body: ['클래스 박스·연관·다중도를 읽고 그린다 — "*"는 0개 이상.'] },
      { title: '작성 워크스루', body: ['명사 추출→거르기→연관→다중도→속성, 다섯 단계로 직접 만든다.'] },
      { title: '판단', body: ['명세 개념·다중도=규칙·속성 대 개념을 가려낸다.'] },
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
