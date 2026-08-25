// 01.js — 세션 1 오리엔테이션 (순수 session 데이터)
// 계약: 교재_작성_지침.md / 씨앗: ooad-curriculum.md #S01 (주장·구조) + sources/01-orientation.md (방향·점·예제)
//
// [2026-08 자율 생성] 씨앗(커리큘럼+전개) → LLM이 각 슬라이드를 자율로 교재-밀도 생성. 환각 방어 = 사람 검토.
//   층 경계: 오리엔 수준 — anemic·RDD·GRASP·SOLID·정보은닉 '용어'는 안 씀(소유 세션). 자세는 canon-stance 축자.
//   [밀도 보정] lead(거버닝)는 유지, 박스/대비 body는 두 줄 실질 내용으로(한 줄 키워드 금지). 두 층의 밀도를 맞춘다.
//   본문 16장: 학습목표1 · C1~C16 · 요약1 = 18장.
//   ※검토 지점: Order 코드·상태 규칙(NEW/PAID/CANCELLED, PAID 취소 불가, 부분취소)이 order-domain-definition와 맞는지.

const slides = [

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '이 과정이 다루는 것',
    sub: '절차지향이 무너지는 이유에서 출발해, 객체라는 답과 과정의 자세를 세운다.',
    question: '이 세션에서 무엇을 얻는가?',
    lead: { label: '여정', text: '이 세션은 과정 전체의 출발점이다. 절차지향이 규모에서 왜 무너지는지 코드로 확인하고, 객체라는 "경계"가 그 답인 이유를 본 뒤, 과정을 관통하는 자세와 지향을 세운다.' },
    visual: { type: 'boxes', data: [
      { title: '문제', body: ['절차지향은 왜 규모에서 무너지는가?', '흩어진 규칙과 산탄총 수정을 코드로 본다'] },
      { title: '해결의 씨앗', body: ['객체=경계가 무엇을 바꾸는가?', '규칙을 데이터 곁에 두어 변경을 가둔다'] },
      { title: '자세·지향', body: ['어떤 태도로 어디를 향하는가?', '필요악 · Just Enough · 예방/상환', 'UC·UL 나침반과 요구→진화 여정'] }
    ]},
    foot: { kw: '핵심', color: 'navy', body: '객체는 데이터와 행위를 한 경계로 묶어 변경을 국소화한다 — 이 한 문장이 과정 전체의 씨앗이다.' },
    notes: '과정 첫 세션. 청중에게 "규칙 하나 바꾸는데 여러 파일을 고쳤던" 경험을 먼저 묻고 시작한다. 배분 3분.'
  },

  // 02. 계보 — 조직 축
  {
    kind: '현상', claim: 'C1',
    title: '코드 조직 방식의 계보',
    sub: '코드 조직은 흐름·지식·데이터를 차례로 통제하며 진화해왔다.',
    question: '각 세대는 앞 세대의 무엇을 고쳤는가?',
    lead: { label: '조직 축', text: '코드를 어떻게 조직하나에는 계보가 있다. 각 세대는 앞 세대가 통제하지 못한 것을 통제하며 나아갔다 — 그 순서를 보면 객체지향이 왜 그 자리에 있는지 보인다.' },
    visual: { type: 'steps', data: [
      { title: '스파게티', body: ['GOTO로 아무 데나 분기 — 흐름을 못 따라간다'] },
      { title: '구조적/절차적', body: ['순차·분기·반복으로 흐름을 길들인다'] },
      { title: '모듈화', body: ['변경될 결정을 모듈 안에 숨긴다'] },
      { title: '객체지향', body: ['데이터와 행위를 한 경계에 함께 둔다'] }
    ]},
    origin: 'Dijkstra(Go To Statement Considered Harmful) · Parnas(1972)',
    foot: { kw: '조직 축', color: 'navy', body: '각 세대는 앞 세대가 못 통제한 것을 통제했다 — 흐름, 다음 지식의 위치, 다음 데이터와 행위의 관계.' },
    notes: '계보는 동기·지도이지 원칙이 아니다(그 경계는 C3). "정보 은닉" 용어는 세션 8 소유라 여기선 descriptive로만. 배분 4분.'
  },

  // 03. 계보 — 상태 축(함수형)
  {
    kind: '현상', claim: 'C2',
    title: '함수형이라는 나란한 축',
    sub: '함수형은 상태를 불변·순수로 다루는, 객체와 나란한 다른 축이다.',
    question: '함수형은 객체의 다음 단계인가?',
    lead: { label: '상태 축', text: '앞의 계보가 "코드를 어떻게 나누나"였다면, 이와 별개로 "상태를 어떻게 다루나"의 축이 있다. 함수형은 명령형의 가변 상태 문제에 답하는, 객체 다음이 아니라 나란히 자란 다른 계보다.' },
    visual: { type: 'versus', data: [
      { title: '명령형 (조직 축)', body: ['변수를 계속 바꿔가며 일한다', '부작용이 곳곳에 남아 값의 추적이 어렵다'], negative: false },
      { title: '함수형 (상태 축)', body: ['값을 바꾸지 않고 새 값을 계산한다', '같은 입력이면 늘 같은 결과', '부작용이 없어 추론·테스트가 쉽다'], negative: false }
    ]},
    origin: '람다 대수 · Lisp(McCarthy)',
    foot: { kw: '상태 축', color: 'teal', body: '객체는 코드의 조직을, 함수형은 상태의 규율을 준다 — 서로 다른 축의 답이다.' },
    notes: '함수형은 이름·기여(불변·순수)까지만 — 깊이는 과정 밖. 배분 3분.'
  },

  // 04. 계보 — 수렴
  {
    kind: '현상', claim: 'C3',
    title: '두 계보의 수렴',
    sub: '현대의 좋은 객체 코드는 조직과 상태 규율을 함께 쓴다.',
    question: '왜 계보를 알아야 뒤의 효용이 보이는가?',
    lead: { label: '수렴', text: '현대의 좋은 객체 코드는 두 계보를 함께 쓴다 — 객체로 조직하고, 그 안에서 함수형의 상태 규율을 빌린다. 그 수렴의 증거는 이 과정 뒤에서 배운다.' },
    visual: { type: 'boxes', data: [
      { title: '객체가 주는 것', body: ['데이터와 행위를 한 경계로 조직', '"무엇을 아는가"와 "무엇을 하는가"를 함께'] },
      { title: '함수형이 주는 것', body: ['값을 안 바꿔 상태를 규율', '언제 무엇이 바뀌는지 예측 가능하게'] },
      { title: '수렴의 증거', body: ['불변 값 객체', '부작용 없는 순수 계산', '다형성으로 분기 제거 (뒤에서 배움)'] }
    ]},
    foot: { kw: '경계', color: 'navy', body: '계보는 동기이자 지도다 — "옛날엔 이랬다"가 "그래서 맞다"로 미끄러지면 안 된다. 각 기법은 그 자체 근거로 선다.' },
    notes: '각 기법의 깊이는 소유 세션(모듈화=8). 배분 3분.'
  },

  // 05. 절차지향의 한계 — 정의·현상
  {
    kind: '현상', claim: 'C4',
    title: '절차지향의 한계',
    sub: '데이터와 함수를 갈라놓으면 규모가 커질수록 규칙의 주인이 사라진다.',
    question: '규모가 커지면 무엇이 무너지는가?',
    lead: { label: '정의', text: '절차지향은 "무엇을 저장하나"(자료구조)와 "무엇을 하나"(함수)를 따로 둔다. 작은 규모에선 깔끔하지만, 커지면 하나의 주문을 여러 함수가 제각기 열어 고치게 된다.' },
    visual: { type: 'flow', data: {
      dir: 'LR',
      nodes: [ { id: 'calc', label: 'calcTotal' }, { id: 'val', label: 'validate' }, { id: 'can', label: 'cancel' }, { id: 'ord', label: 'Order 데이터' } ],
      edges: [ { from: 'calc', to: 'ord', label: '읽고 고침' }, { from: 'val', to: 'ord', label: '읽고 고침' }, { from: 'can', to: 'ord', label: '읽고 고침' } ]
    }},
    foot: { kw: '현상', color: 'failL', body: '한 규칙의 진실이 코드 어디에도 온전히 없다 — 바꾸려면 그 규칙을 아는 함수를 다 찾아야 한다.' },
    notes: '다음 두 장이 이 현상을 코드 실물과 변경 시나리오로 구체화. 배분 3분.'
  },

  // 06. 절차적 코드
  {
    kind: '현상', claim: 'C5',
    title: '절차적 Order 코드',
    sub: '로직이 서비스로 빠지면 데이터는 규칙 없는 자료구조로 전락한다.',
    question: '이 코드에서 "취소 가능 여부"는 누가 아는가?',
    lead: { label: '코드 읽기', text: 'OrderData는 필드와 게터·세터만 갖는다. 취소 가능 판단은 OrderService.cancel 안에, 합계·검증 규칙은 또 다른 메서드에 있다. 주문 객체를 손에 쥐어도 그것으로 무엇을 할 수 있는지 객체 스스로는 모른다.' },
    visual: { type: 'codepair', data: { versions: [
      { label: 'OrderData — 규칙 없는 자료구조',
        code: 'class OrderData {\n  private List<Item> items;\n  private String status;   // "NEW","PAID","CANCELLED"\n  List<Item> getItems() { return items; }\n  void setStatus(String s) {\n    this.status = s;         // 아무 값이나 받는다\n  }\n}' },
      { label: 'OrderService — 규칙이 흩어진 곳',
        code: 'class OrderService {\n  void cancel(OrderData o) {\n    if (o.getStatus().equals("PAID"))\n      throw new IllegalStateException();\n    o.setStatus("CANCELLED");   // 취소 규칙\n  }\n  int calcTotal(OrderData o) { ... }  // 합계 규칙\n}' }
    ] } },
    foot: { kw: '흩어짐', color: 'failL', body: 'setStatus는 아무 값이나 받는다 — "PAID는 못 되돌린다"는 규칙을 데이터가 스스로 못 지킨다.' },
    notes: '코드는 예시 골격. 실제 상태·규칙은 order-domain-definition와 대조해 교정. 배분 4분.'
  },

  // 07. 산탄총
  {
    kind: '현상', claim: 'C6',
    title: '산탄총 수정',
    sub: '규칙 하나를 바꾸면 그 규칙을 아는 모든 함수를 동시에 고쳐야 한다.',
    question: '"부분 취소"를 새로 넣으면 어디를 고쳐야 하는가?',
    lead: { label: '무너지는 순간', text: '"주문 일부만 취소" 규칙 하나를 넣는다고 하자. 규칙이 한 곳에 없으니 그 규칙을 아는 함수를 다 찾아 함께 고쳐야 한다 — 하나라도 빠뜨리면 합계는 맞는데 상태가 틀리는 조용한 버그가 된다.' },
    visual: { type: 'boxes', data: [
      { title: 'cancel', body: ['부분 취소 로직 자체를 바꾼다'] },
      { title: 'calcTotal', body: ['남은 항목으로 합계를 다시 센다'] },
      { title: 'validate', body: ['부분 취소가 가능한지 새로 판단한다'] }
    ]},
    foot: { kw: '산탄총', color: 'failL', body: '변경 하나 = 산탄처럼 흩어진 여러 발. 빠뜨린 한 발이 조용한 버그가 된다.' },
    notes: '다음 장이 이 파급의 원인(지식의 위치)을 짚는다. 배분 3분.'
  },

  // 08. 원인 — 흩어진 지식
  {
    kind: '원인', claim: 'C7',
    title: '흩어진 지식',
    sub: '규칙이 여러 곳에 퍼져 있으면 변경 파급을 예측할 수 없다.',
    question: '왜 변경 파급을 예측할 수 없는가?',
    lead: { label: '원인', text: '산탄총 수정은 증상이고, 원인은 "지식이 어디 있나"다. 도메인 규칙이 특정 객체가 아니라 여러 곳에 전역처럼 퍼져 있으면, 한 규칙을 바꿀 때 파급이 어디까지 미칠지 알 수 없다.' },
    visual: { type: 'versus', data: [
      { title: '지식이 흩어짐', body: ['여러 모듈이 같은 규칙을 안다', '바꿀 때 고칠 범위를 알 수 없다', '빠뜨린 한 곳이 조용한 버그가 된다'], negative: true },
      { title: '지식이 경계 안', body: ['한 객체가 자기 규칙을 안다', '변경 파급이 그 안에 갇힌다'], negative: false }
    ]},
    foot: { kw: '원인', color: 'navy', body: '파급을 예측하려면 지식에 경계가 있어야 한다 — 다음 장의 답이 그 경계다.' },
    notes: '우측 칸이 다음 장(객체=경계)의 forward-ref. 배분 3분.'
  },

  // 09. 객체 = 경계
  {
    kind: '원칙', claim: 'C8',
    title: '객체, 데이터와 행위의 경계',
    sub: '규칙을 데이터 곁에 두면 밖에서는 요청만 하고 세부는 몰라도 된다.',
    question: '경계를 그으면 코드가 어떻게 달라지는가?',
    lead: { label: '해결', text: '객체는 데이터와 그것을 지키는 규칙을 한 경계 안에 함께 둔다. 밖에서는 order.cancel()만 부르고 규칙의 세부는 몰라도 되며, 규칙이 바뀌어도 고칠 곳은 Order 안 한 곳뿐이다.' },
    visual: { type: 'codepair', data: { versions: [
      { label: '절차적 — 밖에서 상태를 직접 바꾼다',
        code: '// 규칙을 아는 쪽과 데이터가 분리\nif (order.getStatus().equals("PAID"))\n  throw new IllegalStateException();\norder.setStatus("CANCELLED");' },
      { label: '객체 — 규칙이 경계 안에서 지켜진다',
        code: 'class Order {\n  private Status status;\n  void cancel() {\n    if (status == Status.PAID)\n      throw new IllegalStateException();\n    this.status = Status.CANCELLED;\n  }\n}\n// 밖에서는: order.cancel();' }
    ] } },
    foot: { kw: '국소화', color: 'teal', body: '상태를 직접 바꾸던 것을 "취소해줘"라는 요청으로 바꾼다 — 규칙의 주인이 데이터 자신이 된다.' },
    notes: '훈련: "취소 조건을 하나 더 넣으면 절차적은 몇 곳, 객체는 몇 곳?"을 먼저 묻는다. anemic·RDD 용어 금지(설계 세션). 배분 5분.'
  },

  // 10. 경계가 책임을 만든다
  {
    kind: '원칙', claim: 'C9',
    title: '경계가 만드는 책임 소재',
    sub: '규칙이 한 객체 안에 있으면 고칠 곳도 책임질 주체도 하나다.',
    question: '경계는 무엇에 답을 주는가?',
    lead: { label: '책임 소재', text: '경계가 생기면 "이 규칙은 누구 일인가"에 답이 생긴다. 취소 규칙이 Order 안에 있으면 고칠 곳도, 물어볼 곳도 Order 하나로 좁혀진다.' },
    visual: { type: 'versus', data: [
      { title: '경계 없음', body: ['아무나 상태를 직접 바꾼다', '규칙의 주인이 없다', '버그가 나면 "누구 코드인가"부터 헤맨다'], negative: true },
      { title: '경계 있음', body: ['Order만 자기 상태를 바꾼다', '고칠 곳도 책임질 주체도 하나로 좁혀진다'], negative: false }
    ]},
    foot: { kw: '원칙', color: 'teal', body: '경계는 지식만이 아니라 책임의 주소를 정한다.' },
    notes: '다음 장이 이 책임을 OOAD의 두 축으로 잇는다. 배분 3분.'
  },

  // 11. 분석 / 설계 두 축
  {
    kind: '원칙', claim: 'C10',
    title: '분석과 설계, 두 질문',
    sub: '분석은 무엇이 있나를, 설계는 누가 무엇을 하나를 묻는다.',
    question: 'OOAD는 무엇을 가르치는가?',
    lead: { label: '두 축', text: 'OOAD가 가르치는 것은 그 경계를 "어디에" 긋는가다. 두 질문으로 나뉜다 — 분석이 재료(개념)를 찾고, 설계가 그 재료에 일(책임)을 맡긴다.' },
    visual: { type: 'versus', data: [
      { title: '분석 (OOA)', body: ['무엇이 있나 — 개념과 관계', '주문·상품·고객과 그 사이 관계를 찾는다'], negative: false },
      { title: '설계 (OOD)', body: ['누가 무엇을 하나 — 책임', '찾은 개념에 할 일(책임)을 배치한다'], negative: false }
    ]},
    foot: { kw: '원칙', color: 'navy', body: '"무엇이 있나"에서 "누가 하나"로 — 이 과정의 두 축이다.' },
    notes: '이 두 축이 과정 관통 축(개념 모델 → 책임 설계)의 기초. 배분 3분.'
  },

  // 12. 자세 ① 필요악
  {
    kind: '원칙', claim: 'C11',
    title: '자세 ① 필요악',
    sub: '완벽한 코드가 불가능하기에 도입된 보정이다.',
    question: '분석·설계는 왜 필요악인가?',
    lead: { label: '필요악', text: '분석·설계·테스트는 그 자체가 목적이 아니다. 완벽한 코드를 처음부터 쓸 수 있다면 불필요하지만, 그럴 수 없기에 도입된 보정이다 — 쓰는 법에 따라 도움도, 필요악도 된다.' },
    visual: { type: 'versus', data: [
      { title: '아는 채로', body: ['목적에 맞게 필요한 만큼 한다', '미래의 부채를 막는 도움이 된다'], negative: false },
      { title: '모르거나 지나치면', body: ['관행으로 또는 과하게 한다', '아무것도 못 막는 순수 오버헤드(필요악)'], negative: true }
    ]},
    origin: 'canon-stance.md · stance.necessary-evil',
    foot: { kw: '자세①', color: 'navy', body: '도구가 아니라 쓰는 법이 도움과 오버헤드를 가른다.' },
    notes: 'canon-stance SHORT 축자. 반론 "OO가 오버헤드 아닌가"에 이 자세가 답. 배분 3분.'
  },

  // 13. 자세 ② Just Enough
  {
    kind: '원칙', claim: 'C12',
    title: '자세 ② Just Enough',
    sub: '코드가 요구하는 만큼만 — 모자라도 넘쳐도 부채다.',
    question: '사전 활동은 얼마나 해야 하는가?',
    lead: { label: 'Just Enough', text: '그렇다면 얼마나 해야 하나. 답은 "코드가 요구하는 만큼만"이다 — 전부 미리 정하는 BDUF가 아니라, 반복하며 코드가 가르쳐주는 만큼 채운다.' },
    visual: { type: 'versus', data: [
      { title: '모자람', body: ['몰라서 대충 넘어간다', '나중에 되돌리는 무지의 부채'], negative: true },
      { title: '넘침 (BDUF)', body: ['안 쓸 것까지 미리 설계한다', '짊어지고 가는 과잉의 부채'], negative: true }
    ]},
    origin: 'canon-stance.md · stance.just-enough',
    foot: { kw: '자세②', color: 'navy', body: '모자람도 넘침도 부채다 — 코드가 요구하는 선이 기준이다.' },
    notes: 'canon-stance SHORT 축자. 배분 3분.'
  },

  // 14. 자세 ③ 예방/상환
  {
    kind: '원칙', claim: 'C13',
    title: '자세 ③ 예방과 상환',
    sub: '사전 활동은 예방, 사후 리팩토링은 상환이다.',
    question: '오늘의 자세는 예방인가 상환인가?',
    lead: { label: '예방/상환', text: '이 활동들을 언제 하느냐로 두 종류를 가른다. 오늘 서론에서 세우는 자세는 예방이고, 상환(리팩토링)은 코드를 다룬 뒤 세션 13에서 만난다.' },
    visual: { type: 'boxes', data: [
      { title: '예방 (오늘)', body: ['코드 전 분석·설계·테스트', '부채가 생기기 전에 막는다'] },
      { title: '상환 (세션 13)', body: ['이미 쌓인 부채를 갚는다', '리팩토링으로 나중에 되돌린다'] }
    ]},
    origin: 'canon-stance.md · stance.prevent-repay',
    foot: { kw: '자세③', color: 'navy', body: '예방과 상환은 한 쌍이다 — 오늘은 예방, 상환은 세션 13.' },
    notes: 'canon-stance SHORT 축자. 배분 3분.'
  },

  // 15. 지향 — UC·UL
  {
    kind: '원칙', claim: 'C14',
    title: 'UC·UL이라는 나침반',
    sub: '기능이 아니라 사용자 목표를 향하고, 도메인을 한 어휘로 말한다.',
    question: '무엇을 향해 설계하는가?',
    lead: { label: '나침반', text: '무엇을 향해 설계하나. 기능이 아니라 사용자가 이루려는 목표(유스케이스)를 향하고, 그 목표를 모두가 같은 단어로 말하도록 편재 언어를 정한다.' },
    visual: { type: 'boxes', data: [
      { title: '유스케이스 (UC)', body: ['사용자 목표를 겨눈다', '"버튼"이 아니라 "주문 취소"가 설계 단위'] },
      { title: '편재 언어 (UL)', body: ['대화·코드가 같은 단어를 쓴다', '"취소"가 어디서나 같은 뜻', '다음 세션 유스케이스부터 적용'] }
    ]},
    foot: { kw: '지향', color: 'navy', body: 'UL은 선언이 아니라 실천이다 — 유스케이스 세션부터 실제로 쓴다.' },
    notes: 'UL 개념 소유는 이후 DDD 과정, 여기선 적용의 시작만. 배분 3분.'
  },

  // 16. 지향 — 과정 지도
  {
    kind: '원칙', claim: 'C15',
    title: '과정 지도',
    sub: '요구에서 진화까지, 2일의 여정을 미리 본다.',
    question: '이 과정은 어디를 향해 가는가?',
    lead: { label: '여정', text: '이 과정은 하나의 여정을 따라간다 — 요구에서 시작해 분석·설계·코드를 거쳐 진화로 이어진다. 오늘은 그 출발점, 왜 이 여정이 필요한지와 어떤 자세로 걸을지를 정하는 날이다.' },
    visual: { type: 'flow', data: {
      dir: 'LR',
      nodes: [ { id: 'req', label: '요구' }, { id: 'ana', label: '분석' }, { id: 'des', label: '설계' }, { id: 'code', label: '코드' }, { id: 'evo', label: '진화' } ],
      edges: [ { from: 'req', to: 'ana' }, { from: 'ana', to: 'des' }, { from: 'des', to: 'code' }, { from: 'code', to: 'evo' } ]
    }},
    foot: { kw: '오늘', color: 'navy', body: '오늘은 출발점 — 자세와 지향을 세운다. 다음은 요구를 유스케이스로 옮긴다.' },
    notes: '각 정거장은 이후 세션이 소유. 배분 3분.'
  },

  // 17. 예제 — Order
  {
    kind: '적용', claim: 'C16',
    title: 'Order, 과정의 예제 도메인',
    sub: '규칙이 살아 있는 도메인이라야 경계 안에서 규칙 지키기를 연습한다.',
    question: '이 도메인은 왜 예제로 적합한가?',
    lead: { label: '적용', text: '과정 내내 하나의 도메인으로 이야기한다. 개념은 라만의 NewPOS(판매 시점 관리)로 설명하고, 실습은 Order(주문)로 한다. Order를 고른 건 규칙이 살아 있는 도메인이라, "경계 안에서 규칙을 지킨다"를 연습하기 좋기 때문이다.' },
    visual: { type: 'boxes', data: [
      { title: '설명', body: ['라만의 NewPOS(판매)', '개념은 검증된 예제로 설명한다'] },
      { title: '실습', body: ['Order(주문)', '경계·책임을 손으로 만든다'] },
      { title: '특징', body: ['합계 = 항목들의 합', '결제된 주문은 취소 불가', '상태는 정해진 순서로만 전이', '항목이 0개인 주문은 없다'] }
    ]},
    foot: { kw: '훈련', color: 'navy', body: '"주문에 항목이 0개일 수 있나?" — 도메인 규칙을 미리 감각한다.' },
    notes: '세부 규칙은 실습 세션(정본 order-domain-definition.md)로 미룬다. 배분 3분.'
  },

  // 18. 요약
  {
    kind: '요약',
    head: '요약과 다음 연결',
    title: '요약과 다음 연결',
    sub: '객체는 경계이고, 그 경계가 과정 전체를 관통한다.',
    question: '오늘 세운 것은 무엇인가?',
    lead: { label: '정리', text: '오늘 세운 것을 정리하자 — 절차지향의 한계에서 출발해, 객체라는 답과 과정의 자세·지향에 닿았다.' },
    visual: { type: 'takeaways', data: [
      { title: '경계', body: ['객체는 데이터와 행위를 한 경계로 묶어 변경을 국소화한다'] },
      { title: '자세', body: ['필요악 · Just Enough · 예방과 상환'] },
      { title: '지향', body: ['사용자 목표를 겨누고 편재 언어로 말한다'] }
    ]},
    foot: { kw: '다음', color: 'navy', body: '다음은 요구를 유스케이스로 옮긴다.' },
    next: '요구를 유스케이스로 옮긴다',
    notes: '첫 장의 질문("규칙 하나 바꾸는데 여러 파일을 고쳤던 경험")으로 닫는다. 배분 3분.'
  }

];

module.exports = { session: {
  no: 1,
  title: '오리엔테이션',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};