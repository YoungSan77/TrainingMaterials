// 01.js — 세션 1 덱 데이터 (순수 session 데이터 — 경로·병합·실행 로직 없음)
// 계약: 교재_작성_지침.md / 내용: courses/ooad/sources/01-orientation.md 전사(정본), claim 계약은 ooad-curriculum.md #S01
// book·curriculum·meta는 courses/ooad/global_config.js가 소유한다 — 로더가 병합한다.
// 본문 17장: 선언1(과정 첫 세션이라 여기서 연다, claim 없음) · 학습목표1 · 현상4(C1,C2,C5,C6) ·
//           원인1(C7) · 원칙8(C3,C8,C9,C10,C11,C12,C13,C14) · 적용1(C15) · 요약1
// 인용: 없음(canon-stance.md 축자 인용은 quote가 아니라 선언 statement·lead.text로 옮긴다 — 6과정
//   정본은 QM 인용 자산과 형식이 달라 quote:{id,ko,en,author} 대상이 아니다)

const slides = [

  // 00. 선언 — 과정 전체를 여는 단언. canon-stance.md proposition.governing TEXT 축자(claim 없음).
  {
    kind: '선언',
    title: '선언',
    visual: { type: 'statement',
      text: 'LLM은 우발 복잡도를 걷어낸다. 남는 본질 복잡도는 대부분 암묵지 — 요구사항·도메인 규칙·불변식·경계 — 이고, LLM은 이를 확률로 추론할 뿐 명세하지 못한다. 그 명세는 인간의 몫이며, 명세하지 못한 격차는 개발자가 메운다. 이 프로그램이 가르치는 요구공학·도메인 모델링·아키텍처가 바로 그 명세 기술이다. 도구가 강해질수록 이 역량은 덜 필요해지지 않고 더 드러난다. 용어는 새로워도 문제는 Brooks(essence/accidental)·에반스(VO·Aggregate)가 정리한 그것이다.' },
    origin: 'canon-stance.md proposition.governing · Fred Brooks(No Silver Bullet)',
    notes: '과정 전체를 여는 단언 — canon-stance.md 축자(program-design/canon-stance.md, ooad-curriculum.md A0-1과 동일 문구). 이후 모든 세션의 명제가 이 선언을 증명하는 각도만 바꾼다. 배분 2분.'
  },

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '이 과정이 다루는 것',
    sub: '객체가 코드 조직의 답인 이유와 이 과정의 자세를 정한다.',
    question: '이 과정에서 무엇을 얻는가?',
    lead: { label: '무엇을 얻는가', text: '절차지향의 한계를 보고, 객체가 그 답이 되는 이유를 확인하며, 과정을 관통하는 세 자세와 지향을 세운다.' },
    visual: { type: 'boxes', data: [
      { title: '문제', body: ['절차지향은 왜', '규모에서 무너지는가'] },
      { title: '해결의 씨앗', body: ['객체 = 경계가', '무엇을 바꾸는가'] },
      { title: '자세·지향', body: ['어떤 태도로,', '어디를 향해 가는가'] }
    ]},
    foot: { kw: '핵심', color: 'navy', body: '객체는 데이터와 행위를 한 경계로 묶어 변경을 국소화한다.' },
    notes: '과정 첫 세션. 청중에게 절차지향 코드에서 겪은 "고칠 곳이 여러 군데였던" 경험을 먼저 물어본다. 배분 3분.'
  },

  // 02. 현상 — 코드 조직의 진화(계보, 조직 축) [C1]
  {
    kind: '현상',
    claim: 'C1',
    title: '코드 조직 방식의 계보',
    sub: '코드 조직은 스파게티에서 객체지향까지 진화해왔다.',
    question: '각 세대는 앞 세대의 무엇을 고쳤는가?',
    lead: { label: '조직 축', text: '스파게티(흐름 통제 불능)→구조적/절차적(흐름을 길들임)→모듈화(결정을 숨김)→객체지향(데이터+행위를 경계로) — 각 세대가 앞 세대의 문제를 고쳤다.' },
    visual: { type: 'steps', data: [
      { title: '스파게티', body: ['GOTO,', '흐름 통제 불능'] },
      { title: '구조적/절차적', body: ['순차·분기·반복으로', '흐름을 길들임'] },
      { title: '모듈화', body: ['변경될 결정을', '모듈에 숨김'] },
      { title: '객체지향', body: ['데이터+행위를', '한 경계로'] }
    ]},
    origin: 'Dijkstra(Go To Statement Considered Harmful) · Parnas(1972)',
    foot: { kw: '조직 축', color: 'navy', body: '흐름 → 지식의 위치 → 데이터·행위의 분리, 순서로 문제가 옮겨갔다.' },
    notes: '정본: 01-orientation.md §1-0 [조직 축]. 계보는 동기·지도이지 원칙이 아니다(경계·원칙 아님 캐비앗은 C3에서 다룬다). 배분 4분.'
  },

  // 03. 현상 — 함수형은 다른 축(계보, 상태 축) [C2]
  {
    kind: '현상',
    claim: 'C2',
    title: '함수형이라는 나란한 축',
    sub: '함수형은 상태를 불변·순수 함수로 다루는 다른 축이다.',
    question: '함수형은 객체의 다음 단계인가?',
    lead: { label: '상태 축', text: '명령형의 가변 상태·부작용 문제에 불변 값·순수 함수로 답한다 — 객체 다음 단계가 아니라 나란히 자란 계보다.' },
    visual: { type: 'versus', data: [
      { title: '명령형(조직 축)', body: ['가변 상태·부작용', '흐름을 길들이는 계보'], negative: false },
      { title: '함수형(상태 축)', body: ['불변 값·순수 함수', '나란히 자란 계보'], negative: false }
    ]},
    origin: '람다 대수 · Lisp(McCarthy)',
    foot: { kw: '상태 축', color: 'teal', body: '객체는 조직을, 함수형은 상태 규율을 각각 다른 축에서 다룬다.' },
    notes: '정본: §1-0 [상태 축]. 이름·기여(불변·순수)까지만 — 함수형 자체의 깊이는 과정 밖. 배분 3분.'
  },

  // 04. 원칙 — 두 계보의 수렴 [C3]
  {
    kind: '원칙',
    claim: 'C3',
    title: '두 계보의 수렴',
    sub: '현대 OO는 조직 축과 상태 축, 두 계보가 수렴한 결과다.',
    question: '왜 계보를 알아야 뒤의 효용이 보이는가?',
    lead: { label: '수렴', text: '객체가 조직을, 함수형이 상태 규율을 준다 — 이 과정 뒤에서 배울 불변 값 객체·부작용 없는 계산·다형성으로 분기 제거가 그 증거다.' },
    visual: { type: 'boxes', data: [
      { title: '객체가 주는 것', body: ['조직 —', '데이터+행위를 경계로'] },
      { title: '함수형이 주는 것', body: ['상태 규율 —', '불변·순수'] },
      { title: '수렴의 증거', body: ['불변 값 객체,', '부작용 없는 계산'] }
    ]},
    foot: { kw: '경계', color: 'navy', body: '"옛날엔 이랬다"가 "그래서 맞다"로 미끄러지면 안 된다 — 각 기법은 그 자체 근거로 선다.' },
    notes: '정본: §1-0 [수렴]·[경계·원칙 아님]. 계보는 동기·지도이지 원칙이 아니다. 각 기법의 깊이는 소유 세션(모듈화=세션8). 배분 3분.'
  },

  // 05. 현상 — 절차지향의 한계(정의) [C5]
  {
    kind: '현상',
    claim: 'C5',
    title: '절차지향의 한계',
    sub: '절차지향은 데이터와 함수를 분리해 함수 분해로 문제를 푼다.',
    question: '규모가 커지면 무엇이 무너지는가?',
    lead: { label: '정의', text: '절차지향은 데이터(자료구조)와 그것을 다루는 함수를 분리한다 — 규모가 커지면 데이터와 함수가 따로 자라, 한 데이터를 여러 함수가 만지고 한 함수가 여러 데이터를 만진다.' },
    visual: { type: 'boxes', data: [
      { title: '데이터', body: ['자료구조만 보유'] },
      { title: '함수', body: ['여러 데이터를', '넘나들며 조작'] },
      { title: '결과', body: ['한 데이터를 여러', '함수가 만진다'] }
    ]},
    foot: { kw: '현상', color: 'failL', body: '데이터와 함수가 따로 자라 서로를 넘나들며 얽힌다.' },
    notes: '정본: §1-1(정의·현상). 다음 장(C6)이 이 얽힘의 구체적 파급을 보여준다. 배분 3분.'
  },

  // 06. 현상 — 흩어진 변경(산탄총 수정) [C6]
  {
    kind: '현상',
    claim: 'C6',
    title: '흩어진 변경 — 산탄총 수정',
    sub: '취소 규칙 하나가 바뀌면 여러 곳이 동시에 바뀐다.',
    question: '왜 규칙 하나가 여러 곳을 흔드는가?',
    lead: { label: '무너지는 순간', text: '취소 규칙이 바뀌면 서비스·검증·상태 코드가 여러 곳에서 동시에 바뀐다(산탄총 수정) — 지식이 전역 상태·공유 자료구조에 흩어져 있기 때문이다.' },
    visual: { type: 'flow', data: {
      dir: 'LR',
      nodes: [ { id: 'rule', label: '취소 규칙 변경' }, { id: 'svc', label: '서비스' }, { id: 'val', label: '검증' }, { id: 'state', label: '상태 코드' } ],
      edges: [
        { from: 'rule', to: 'svc', label: '동시 수정' },
        { from: 'rule', to: 'val', label: '동시 수정' },
        { from: 'rule', to: 'state', label: '동시 수정' }
      ]
    }},
    foot: { kw: '현상', color: 'failL', body: '지식이 전역에 흩어져 있어 규칙 하나의 변경이 여러 곳을 동시에 흔든다.' },
    notes: '정본: §1-1(무너지는 순간). 절차적 Order 코드 골격(OrderData 게터·세터 + OrderService.calcTotal/validate/cancel)은 다음 원칙 장(C8)에서 객체 버전과 나란히 대조한다. 배분 4분.'
  },

  // 07. 원인 — 지식이 전역 상태에 새어 있다 [C7]
  {
    kind: '원인',
    claim: 'C7',
    title: '흩어진 지식이 만드는 불확실성',
    sub: '지식이 전역 상태·공유 자료구조에 새어 있어 파급이 넓다.',
    question: '왜 변경 파급을 예측할 수 없는가?',
    lead: { label: '원인', text: '"무엇을 아는가"가 여러 모듈에 흩어져 경계가 없다 — 그래서 어디를 고치면 어디가 깨질지 예측할 수 없다.' },
    visual: { type: 'boxes', data: [
      { title: '지식의 위치', body: ['전역 상태·공유', '자료구조에 산재'] },
      { title: '경계의 부재', body: ['어느 모듈이 무엇을', '아는지 불명확'] },
      { title: '결과', body: ['변경 파급을', '예측 못 한다'] }
    ]},
    foot: { kw: '원인', color: 'navy', body: '경계 없는 지식이 예측 불가능한 변경 파급의 원인이다.' },
    notes: '정본: §1-2. 다음 장(C8)이 이 원인에 대한 답(경계)을 연다. 배분 3분.'
  },

  // 08. 원칙 — 객체 = 경계(해결의 씨앗) [C8] — codepair 2벌(절차적 vs 객체 Order)
  {
    kind: '원칙',
    claim: 'C8',
    title: '객체, 데이터와 행위의 경계',
    sub: '객체는 데이터와 행위를 한 경계로 묶어 변경을 국소화한다.',
    question: '경계를 그으면 무엇이 달라지는가?',
    lead: { label: '해결의 씨앗', text: '객체는 데이터와 그 데이터를 다루는 행위를 한 경계로 묶는다 — 규칙이 바뀌어도 그 객체 안만 바뀐다(변경 국소화).' },
    visual: { type: 'codepair', data: { versions: [
      { label: '절차적 Order', code: 'class OrderData {\n  // 게터·세터만\n}\n\nclass OrderService {\n  calcTotal(order) { /* ... */ }\n  validate(order) { /* ... */ }\n  cancel(order) { /* ... */ }\n}' },
      { label: '객체 Order', code: 'class Order {\n  cancel() {\n    // 취소 규칙이\n    // 여기서 지켜진다\n  }\n}' }
    ] } },
    foot: { kw: '원칙', color: 'teal', body: '취소 조건이 추가돼도 절차적은 여러 곳, 객체는 Order 한 곳만 바뀐다.' },
    notes: '정본: §2-1. 훈련: "방금 두 버전에서 취소 조건 추가를 하면 각각 몇 곳을 고치나?"(절차적=흩어진 여러 곳 / 객체=한 곳) — 청중에게 먼저 묻는다. anemic·RDD 용어는 쓰지 않는다(설계 세션 소유). 배분 5분.'
  },

  // 09. 원칙 — 경계가 책임을 만든다 [C9]
  {
    kind: '원칙',
    claim: 'C9',
    title: '경계가 만드는 책임 소재',
    sub: '경계는 "이건 누구 일인가"에 답을 준다.',
    question: '경계는 무엇에 답을 주는가?',
    lead: { label: '책임 소재', text: '경계가 생기면 책임 소재가 생긴다 — "이건 누구 일인가"에 답이 생긴다.' },
    visual: { type: 'versus', data: [
      { title: '경계 없음', body: ['누구 일인지', '불명확하다'], negative: true },
      { title: '경계 있음', body: ['이 객체의 일이라고', '답할 수 있다'], negative: false }
    ]},
    foot: { kw: '원칙', color: 'teal', body: '경계는 지식만이 아니라 책임의 소재도 정한다.' },
    notes: '정본: §2-2(전반). 다음 장(C10)이 이 책임 소재를 OOAD의 두 축(분석/설계)으로 잇는다. 배분 3분.'
  },

  // 10. 원칙 — OOAD가 가르치는 것(분석/설계) [C10]
  {
    kind: '원칙',
    claim: 'C10',
    title: '분석과 설계, 두 질문',
    sub: 'OOAD는 그 경계를 어디에 긋는지를 가르친다.',
    question: '분석과 설계는 각각 무엇을 묻는가?',
    lead: { label: '두 축', text: '분석 = 무엇이 있나(개념), 설계 = 누가 무엇을 하나(책임) — 이 과정의 두 축이다.' },
    visual: { type: 'versus', data: [
      { title: '분석(OOA)', body: ['무엇이 있나', '개념을 본다'], negative: false },
      { title: '설계(OOD)', body: ['누가 무엇을 하나', '책임을 정한다'], negative: false }
    ]},
    foot: { kw: '원칙', color: 'navy', body: 'OOAD는 경계를 긋는 두 질문 — 무엇이 있나, 누가 하나 — 을 가르친다.' },
    notes: '정본: §2-2(후반). 이 두 축이 A0-2 관통 축(anemic→rich, 개념 객체→SW 객체)의 기초다. 배분 3분.'
  },

  // 11. 원칙 — 자세 ① 필요악 [C11]
  {
    kind: '원칙',
    claim: 'C11',
    title: '자세 ① 필요악',
    sub: '완벽한 코드가 불가능해서 도입된 보정이다.',
    question: '분석·설계는 왜 필요악인가?',
    lead: { label: '필요악', text: '완벽한 코드가 불가능해서 도입된 보정이다 — 목적에 맞게 쓰면 도움, 오용하면 필요악이다.' },
    visual: { type: 'boxes', data: [
      { title: '완벽한 코드라면', body: ['분석·설계·테스트', '불필요'] },
      { title: '불가능하기에', body: ['도입된 보정'] },
      { title: '오용하면', body: ['순수 오버헤드', '(필요악)'] }
    ]},
    origin: 'canon-stance.md · stance.necessary-evil',
    foot: { kw: '자세①', color: 'navy', body: '아는 채로 쓰면 도움, 모르거나 지나치면 필요악이다.' },
    notes: '정본: §3-1, canon-stance.md SHORT 축자(program-design/canon-stance.md). 반론: "OO 오버헤드 아닌가" → 필요악이 이미 답한다. 배분 3분.'
  },

  // 12. 원칙 — 자세 ② Just Enough [C12]
  {
    kind: '원칙',
    claim: 'C12',
    title: '자세 ② Just Enough',
    sub: '사전 활동은 코드가 요구하는 만큼만 한다.',
    question: '사전 활동은 얼마나 해야 하는가?',
    lead: { label: 'Just Enough', text: '사전 활동은 코드가 요구하는 만큼만 — 모자라면 부채(무지), 넘치면 그 자체가 부채(과잉)다.' },
    visual: { type: 'versus', data: [
      { title: '모자람', body: ['무지의 부채'], negative: true },
      { title: '넘침(BDUF)', body: ['과잉의 부채'], negative: true }
    ]},
    origin: 'canon-stance.md · stance.just-enough',
    foot: { kw: '자세②', color: 'navy', body: 'BDUF(전부 미리)가 아니다 — 반복·점진으로 나머지는 코드로 배운다.' },
    notes: '정본: §3-2, canon-stance.md SHORT 축자. 배분 3분.'
  },

  // 13. 원칙 — 자세 ③ 예방/상환 [C13]
  {
    kind: '원칙',
    claim: 'C13',
    title: '자세 ③ 예방과 상환',
    sub: '사전 활동은 예방이고 사후 리팩토링은 상환이다.',
    question: '오늘의 자세는 예방인가 상환인가?',
    lead: { label: '예방/상환', text: '사전 활동(분석·설계·테스트) = 부채 예방 / 사후(리팩토링) = 이미 진 부채의 상환 — 서론(오늘)의 자세는 예방이다.' },
    visual: { type: 'boxes', data: [
      { title: '사전(오늘)', body: ['분석·설계·테스트', '= 예방'] },
      { title: '사후(세션 13)', body: ['리팩토링', '= 상환'] }
    ]},
    origin: 'canon-stance.md · stance.prevent-repay',
    foot: { kw: '자세③', color: 'navy', body: '예방과 상환은 한 쌍이다 — 상환은 세션 13에서 다시 만난다.' },
    notes: '정본: §3-3, canon-stance.md SHORT 축자. 배분 3분.'
  },

  // 14. 원칙 — UC·UL이 나침반(+과정 지도) [C14]
  {
    kind: '원칙',
    claim: 'C14',
    title: 'UC·UL이라는 나침반',
    sub: '유스케이스와 편재 언어로 과정을 관통한다.',
    question: '이 과정은 어디를 향해 가는가?',
    lead: { label: '지향', text: '유스케이스(사용자 목표)를 이루려 설계하고, 편재 언어(UL)로 도메인을 한 어휘로 말한다 — UL은 다음 세션(유스케이스)부터 실제로 적용된다.' },
    visual: { type: 'flow', data: {
      dir: 'LR',
      nodes: [ { id: 'req', label: '요구' }, { id: 'ana', label: '분석' }, { id: 'des', label: '설계' }, { id: 'code', label: '코드' }, { id: 'evo', label: '진화' } ],
      edges: [
        { from: 'req', to: 'ana' }, { from: 'ana', to: 'des' }, { from: 'des', to: 'code' }, { from: 'code', to: 'evo' }
      ]
    }},
    foot: { kw: '지향', color: 'navy', body: '오늘은 출발점 — 자세와 지향을 세운다. 다음은 요구를 유스케이스로 옮긴다.' },
    notes: '정본: §4-1·§4-2(과정 지도). 여정: 요구→분석(rich 개념 모델)→OO 설계→코드→진화(DDD·MSA 이음). 배분 3분.'
  },

  // 15. 적용 — Order를 예제 도메인으로 [C15]
  {
    kind: '적용',
    claim: 'C15',
    title: 'Order, 과정의 예제 도메인',
    sub: '설명은 NewPOS, 실습은 Order로 과정 내내 이어간다.',
    question: '이 도메인은 왜 예제로 적합한가?',
    lead: { label: '적용', text: '과정 내내 하나의 도메인을 쓴다 — 설명은 NewPOS(판매), 실습은 Order(주문). Order는 합계·수량·상태 전이 같은 규칙(불변식)을 가진 도메인이다.' },
    visual: { type: 'boxes', data: [
      { title: '설명', body: ['NewPOS(판매)'] },
      { title: '실습', body: ['Order(주문)'] },
      { title: '특징', body: ['합계·수량·상태 전이', '같은 규칙(불변식)'] }
    ]},
    foot: { kw: '훈련', color: 'navy', body: '주문에 항목이 0개일 수 있나? — 도메인 규칙을 미리 감각한다.' },
    notes: '정본: §5. 세부 규칙은 실습(세션 5, 정본 order-domain-definition.md)로 미룬다. 배분 3분.'
  },

  // 16. 요약과 다음 연결
  {
    kind: '요약',
    head: '요약과 다음 연결',
    title: '요약과 다음 연결',
    sub: '객체는 경계이고, 그 경계가 과정 전체를 관통한다.',
    question: '오늘 세운 자세와 지향은 무엇인가?',
    lead: { label: '정리', text: '절차지향의 한계를 보고, 객체라는 경계를 답으로 확인했으며, 세 자세와 UC·UL 지향을 세웠다.' },
    visual: { type: 'takeaways', data: [
      { title: '경계', body: ['객체는 데이터+행위를', '한 경계로 묶는다'] },
      { title: '자세', body: ['필요악·Just Enough', '예방/상환'] },
      { title: '지향', body: ['UC·UL이 나침반'] }
    ]},
    foot: { kw: '다음', color: 'navy', body: '다음은 요구를 유스케이스로 옮긴다.' },
    next: '요구를 유스케이스로 옮긴다',
    notes: '첫 장의 질문(절차지향 코드에서 고칠 곳이 여러 군데였던 경험)으로 닫는다. 배분 3분.'
  }

];

module.exports = { session: {
  no: 1,
  title: '오리엔테이션',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};
