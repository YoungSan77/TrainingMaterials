// 01.js — 세션 01 덱 데이터 (순수 session 데이터 — 경로·병합·실행 로직 없음)
// 계약: 교재_작성_지침.md / 내용: QM_커리큘럼.md S01 노드
// 본문 13장: 선언1(과정 첫 세션이라 여기서 연다) · 학습목표1 · 현상2 · 원인3(statement 1) ·
//           원칙2 · 적용2(statement 1) · 타협1 · 요약1
// 인용 4건: Q-DEMING-BADSYS · Q-DEMING-TOOLATE · Q-CROSBY-FREE · Q-DEMING-94-6 (모두 S01 태그, 세션 내 중복 없음)
// book·curriculum·meta는 courses/qm/global_config.js가 소유한다 — 로더가 병합한다. 덱은 경로를 모른다.

const slides = [

  // 00. 선언 — 과정 전체를 여는 단언(기능 1 PoC). 명제가 아니라 manifesto라 claim이 없다.
  {
    kind: '선언',
    title: '선언',
    visual: { type: 'statement',
      text: '품질 문제는 시스템에서 주로 발생한다. 결함 예방이 우선이고, 발생하면 바로 찾아 고친다. 시스템은 조직 영역이지만, 개선은 각자의 자리에서 시작한다.' },
    notes: '과정 전체의 입장을 먼저 선언한다 — 이후 모든 세션의 논증은 이 세 문장을 각도만 바꿔 증명한다. 배분 2분.'
  },

  // 01. 학습 목표
  {
    kind: '학습 목표',
    title: '품질 패러다임 전환과 Shift-Left',
    sub: '품질은 테스트 활동이 아니라 시스템 설계의 결과다.',
    question: '품질은 어느 단계에서 결정되는가?',
    lead: { label: '무엇을 얻는가', text: '품질을 시스템 관점에서 정의하고, Shift-Left를 전 과정 공통 원칙으로 세운다.' },
    visual: { type: 'boxes', data: [
      { title: '정의 전환', body: ['품질을 테스트가 아닌', '시스템 관점으로 본다'] },
      { title: 'Shift-Left', body: ['통제력을 릴리즈에서', '앞단으로 당긴다'] },
      { title: '질문 전환', body: ['누가 틀렸나가 아니라', '무엇이 원인인가'] }
    ]},
    foot: { kw: '핵심', color: 'navy', body: '품질은 검사로 넣는 것이 아니라 앞단에서 설계로 만든다.' },
    notes: '이 세션의 논지를 한 줄로: 품질의 소유주는 테스트 부서가 아니라 시스템이다. 청중에게 먼저 물어라 — 지난 장애의 원인을 사람으로 적었는지 시스템으로 적었는지. 이 질문의 답을 마지막 요약에서 다시 확인한다. 배분 3분.'
  },

  // 02. 현상 — 사일로의 떠넘기기와 핑퐁
  {
    kind: '현상',
    title: '사일로의 떠넘기기와 핑퐁',
    sub: '기획·개발·테스트가 산출물을 넘기고 결함을 되돌린다.',
    question: '결함은 어디에서 반복해 되돌아오는가?',
    lead: { label: '현상', text: '단계가 나뉘면 책임이 경계에서 미끄러지고, 결함은 뒤에서야 드러나 앞으로 반송된다.' },
    visual: { type: 'flow', data: {
      dir: 'LR',
      nodes: [ { id: 'plan', label: '기획' }, { id: 'dev', label: '개발' }, { id: 'test', label: '테스트' } ],
      edges: [
        { from: 'plan', to: 'dev', label: '요구 전달' },
        { from: 'dev', to: 'test', label: '빌드 전달' },
        { from: 'test', to: 'dev', label: '결함 반송' }
      ]
    }},
    foot: { kw: '문제', color: 'failL', body: '품질을 테스트 부서만의 책임으로 보는 착각이 이 핑퐁을 정상으로 만든다.' },
    notes: '핑퐁은 개인의 게으름이 아니라 단계 분업이 만든 구조적 결과다. 흔한 반론 — "테스트가 있으니 앞단은 빨리 가도 된다". 이 반론이 뒤 슬라이드의 1:10:100으로 반박된다. 배분 4분.'
  },

  // 03. 현상 — 품질을 마지막 관문으로 보는 착각
  {
    kind: '현상',
    title: '품질을 마지막 관문으로 보는 착각',
    sub: '품질을 테스트 단계의 검열로 좁히면 앞단이 방치된다.',
    question: '품질은 마지막에 걸러내는 것인가?',
    lead: { label: '현상', text: '검사를 통과하면 품질이 확보된다는 믿음이 앞단의 결함 유입을 방치한다.' },
    visual: { type: 'versus', data: [
      { title: '흔한 착각', body: ['품질은 테스트가 걸러낸다', '검사 통과가 곧 품질이다'], negative: true },
      { title: '실제', body: ['품질은 앞단에서 만들어진다', '검사는 이미 든 품질을 볼 뿐'], negative: false }
    ]},
    foot: { kw: '전환', color: 'teal', body: '품질은 걸러내는 것이 아니라 앞단에서 만들어 넣는 것이다.' },
    notes: '검사(inspection)와 품질(quality)의 개념 분리가 이 장의 핵심이다. 검사는 정보를 주지만 품질을 더하지 못한다. 다음 장의 Deming 인용이 이 명제를 원전으로 뒷받침한다. 배분 4분.'
  },

  // 04. 원인 — 단문: 나쁜 시스템이 좋은 사람을 이긴다
  {
    kind: '원인',
    title: '나쁜 시스템은 좋은 사람을 이긴다',
    visual: { type: 'statement',
      quote: {
        id: 'Q-DEMING-BADSYS',
        ko: '나쁜 시스템은 언제나 좋은 사람을 이긴다.',
        en: 'A bad system will beat a good person every time.',
        author: 'W. Edwards Deming'
      },
      note: '개인을 더 노력시키는 대신 시스템을 고쳐야 한다. 결함의 대부분은 사람의 부주의가 아니라 일하는 방식에서 나온다.',
      caption: '세미나 발언으로 귀속되며 원전 문헌 문구는 확인되지 않는다.'
    },
    notes: '이 장은 현상에서 원인으로 넘어가는 전환점이다. 여기서 시선을 사람에서 시스템으로 돌린다. 반론 — "그래도 실수한 사람이 있지 않나". 답 — 같은 실수를 반복시키는 조건을 남겨두면 다음 사람도 같은 실수를 한다. 배분 3분.'
  },

  // 05. 원인 — 결함은 뒤로 갈수록 비싸진다 (1:10:100)
  {
    kind: '원인',
    title: '결함은 뒤로 갈수록 비싸진다',
    sub: '같은 결함도 발견 단계가 늦을수록 수정 비용이 자릿수로 뛴다.',
    question: '왜 늦게 찾은 결함이 그토록 비싼가?',
    lead: { label: '원인', text: '앞단의 결함은 뒤로 흘러가며 다른 작업 위에 쌓이고, 걷어내는 비용이 자릿수로 커진다.' },
    visual: { type: 'magnitude',
      data: [
        { label: '설계 단계', value: 1, unit: '배' },
        { label: '개발 단계', value: 10, unit: '배' },
        { label: '운영 단계', value: 100, unit: '배' }
      ],
      caption: 'Boehm(1981)·Boehm & Basili(2001) 기반의 통용 정식화. 대규모·고신뢰 시스템에 가깝고, 소규모 비핵심 시스템에서는 5:1 수준으로 보고된다.'
    },
    foot: { kw: '원인', color: 'navy', body: '로컬에서 잡으면 1의 비용이, 운영까지 흘러가면 100의 부채가 된다.' },
    notes: '명제는 "정확히 100배"가 아니라 "단계가 넘어갈수록 자릿수가 바뀐다"이다. 100배를 단정하면 S12에서 가르칠 지표 왜곡을 이 교재가 스스로 저지른다 — 그래서 caption에 한계를 명시했다. 배분 5분.'
  },

  // 06. 원인 — 검사는 품질을 만들지 못한다 (TOOLATE 오버레이)
  {
    kind: '원인',
    title: '검사는 품질을 만들지 못한다',
    sub: '검사는 이미 든 품질을 확인할 뿐, 없던 품질을 넣지 못한다.',
    question: '마지막 검사로 품질을 되돌릴 수 있는가?',
    lead: { label: '원인', text: '품질은 만들어지는 순간 제품에 들어간다. 검사는 그 결과를 뒤늦게 읽을 뿐이다.' },
    visual: { type: 'boxes', data: [
      { title: '검사의 한계', body: ['결함을 발견할 뿐', '원인을 없애지 못한다'] },
      { title: '시점의 문제', body: ['품질은 앞단에서 결정', '검사는 그 뒤에 온다'] },
      { title: '비용의 문제', body: ['재작업이 뒤로 쌓여', '수정 비용이 커진다'] }
    ]},
    quote: {
      id: 'Q-DEMING-TOOLATE',
      ko: '검사는 너무 늦다. 품질은 좋든 나쁘든 이미 제품 안에 들어가 있다.',
      en: 'Inspection is too late. The quality, good or bad, is already in the product.',
      author: 'W. Edwards Deming'
    },
    foot: { kw: '원인', color: 'navy', body: '품질은 검사로 넣는 것이 아니라 만드는 과정에서 들어간다.' },
    notes: '원문은 "검사는 품질을 개선하지도, 보장하지도 않는다"로 이어지는 축약 인용이다(강사 노트에 원전 자동 첨부). 이 장이 앞의 착각(03)을 원전으로 닫는다. 배분 4분.'
  },

  // 07. 원칙 — 통제력을 앞단으로 당긴다 (Shift-Left, pipeline)
  {
    kind: '원칙',
    title: '통제력을 앞단으로 당긴다',
    sub: '품질 통제를 릴리즈 직전이 아니라 요구 단계부터 건다.',
    question: '품질을 언제부터 통제해야 하는가?',
    lead: { label: '원칙', text: '검증을 뒤가 아니라 앞에 두면 결함이 흘러가기 전에 막힌다. 이것이 Shift-Left다.' },
    visual: { type: 'pipeline', data: {
      nodes: [
        { id: 'req', label: '요구', gate: true },
        { id: 'des', label: '설계', gate: true },
        { id: 'dev', label: '개발', gate: true },
        { id: 'test', label: '테스트', gate: true },
        { id: 'rel', label: '릴리즈' }
      ]
    }},
    foot: { kw: '원칙', color: 'teal', body: '각 단계에 검증 게이트를 두면 결함이 다음 단계로 넘어가지 못한다.' },
    notes: 'Shift-Left는 특정 세션의 주제가 아니라 전 과정 공통 원칙이다. 게이트를 모든 단계에 두는 것이 요점 — 마지막 한 곳에만 두면 그것이 곧 사후 검사다. 반론 — "앞단 게이트가 개발을 늦춘다". 다음 장이 비용으로 답한다. 배분 5분.'
  },

  // 08. 원칙 — 예방은 총비용을 낮춘다 (CROSBY 오버레이)
  {
    kind: '원칙',
    title: '예방은 총비용을 낮춘다',
    sub: '예방과 평가에 앞서 쓰는 비용은 실패 비용을 줄여 총합을 낮춘다.',
    question: '품질에 드는 돈은 늘어나는 비용인가?',
    lead: { label: '원칙', text: '앞에 쓰는 예방·평가 비용은, 뒤에서 터지는 실패 비용을 줄여 품질의 총비용을 낮춘다.' },
    visual: { type: 'boxes', data: [
      { title: '예방 비용', body: ['결함을 미리 막는 데', '드는 비용'] },
      { title: '평가 비용', body: ['결함을 찾는 데', '드는 비용'] },
      { title: '실패 비용', body: ['놓친 결함이 뒤에서', '터지는 비용'] }
    ]},
    quote: {
      id: 'Q-CROSBY-FREE',
      ko: '품질은 공짜다. 선물은 아니지만, 공짜다.',
      en: "Quality is free. It's not a gift, but it is free.",
      author: 'Philip B. Crosby'
    },
    foot: { kw: '원칙', color: 'navy', body: '앞의 두 비용에 투자하면 실패 비용이 줄어 품질은 공짜에 가까워진다.' },
    notes: '품질비용(CoQ)의 네 갈래 중 세 갈래를 다룬다 — 예방·평가·실패. 네 번째(재작업)는 실패 비용에 포함해 단순화했다. "공짜"의 뜻은 무상이 아니라 순비용이 음수라는 것. 배분 4분.'
  },

  // 09. 적용 — 단문: 문제의 94%는 시스템에 있다
  {
    kind: '적용',
    title: '문제의 94%는 시스템에 있다',
    visual: { type: 'statement',
      text: '대부분의 문제는 개인의 잘못이 아니라 시스템에 있다.',
      quote: {
        id: 'Q-DEMING-94-6',
        ko: '문제의 94%는 시스템에 속하고(경영의 책임), 6%가 특수 원인이다.',
        en: '94% belongs to the system (responsibility of management), 6% special.',
        author: 'W. Edwards Deming'
      },
      note: '책임을 물을 대상은 개인이 아니라 일하는 방식이다. 질문을 "누가 틀렸나"에서 "무엇이 이 결함을 만들었나"로 옮긴다.',
      caption: '측정값이 아니라 저자의 경험적 추정치다.'
    },
    notes: 'Deming이 1985년에 85:15에서 94:6으로 상향한 값이다(강사 노트에 원전 자동 첨부). 정확한 숫자를 방어하지 말고 비율의 방향을 방어하라 — 대부분은 시스템이다. 이 문장이 다음 장의 질문 전환으로 곧장 이어진다. 배분 3분.'
  },

  // 10. 적용 — 질문을 누가에서 무엇으로
  {
    kind: '적용',
    title: '질문을 누가에서 무엇으로',
    sub: '결함 앞에서 사람을 찾는 대신 원인을 찾는다.',
    question: '결함이 났을 때 먼저 무엇을 물어야 하는가?',
    lead: { label: '적용', text: '"누가 실수했나"는 정보를 숨기게 하고, "무엇이 이 결함을 가능하게 했나"는 시스템을 고치게 한다.' },
    visual: { type: 'versus', data: [
      { title: '누가 틀렸나', body: ['책임자를 지목한다', '정보가 숨는다'], negative: true },
      { title: '무엇이 원인인가', body: ['일하는 방식을 본다', '시스템을 고친다'], negative: false }
    ]},
    foot: { kw: '적용', color: 'teal', body: '질문의 방향을 바꾸면 비난이 아니라 개선이 시작된다.' },
    notes: '이 질문 전환이 다음 세션의 탓하지 않는 문화(Blameless)로 연결된다. 실무 적용 — 장애 회고 템플릿의 첫 칸을 "담당자"가 아니라 "유입 지점"으로 바꾼다. 배분 4분.'
  },

  // 11. 타협 — 앞단 투자를 언제 접어야 하는가
  {
    kind: '타협',
    title: '앞단 투자를 언제 접어야 하는가',
    sub: 'Shift-Left는 공짜가 아니라 조건 위에서만 값을 한다.',
    question: '앞단 검증은 언제 형식으로 전락하는가?',
    lead: { label: '선택과 버림', text: '전제가 무너지면 앞단 투자는 초기 속도만 깎아먹고 효과를 내지 못한다.' },
    visual: { type: 'boxes', data: [
      { title: '전제', body: ['탓하지 않는', '문화의 의지'] },
      { title: 'Trade-off', body: ['초기 속도를 내주고', '총 리드타임 단축'] },
      { title: '실패 조건', body: ['예방을 비용으로만', '보면 형식만 남는다'] }
    ]},
    foot: { kw: '판단', color: 'failT', body: '로컬에서 건너뛴 검증은 운영에서 훨씬 큰 비용으로 돌아온다.' },
    notes: '전제가 없는 조직에 Shift-Left를 강제하면 게이트가 통과 도장으로 전락한다. 도입 판단 — 비난 문화가 남아 있으면 문화부터, 아니면 게이트부터. 이것이 이 원칙을 버려야 하는 유일한 조건이다. 배분 4분.'
  },

  // 12. 요약과 다음 연결
  {
    kind: '요약',
    title: '요약과 다음 연결',
    head: '요약과 다음 연결',
    sub: '품질은 테스트가 아니라 시스템 설계의 결과다.',
    question: '이 시스템을 방어하는 세 주체는 누구인가?',
    lead: { label: '정리', text: '품질을 앞단에서 설계로 만들고, 질문을 사람에서 원인으로 옮긴다.' },
    visual: { type: 'takeaways', data: [
      { title: '품질의 정의', body: ['품질은 검사로 넣는 것이 아니라 앞단에서 설계로 만든다.'] },
      { title: 'Shift-Left', body: ['통제력을 릴리즈 직전에서 요구 단계로 당긴다.'] },
      { title: '질문 전환', body: ['누가 틀렸나가 아니라 무엇이 원인인가를 묻는다.'] }
    ]},
    foot: { kw: '다음', color: 'navy', body: '다음은 이 시스템을 방어하는 세 주체와 R&R이다.' },
    next: '품질관리란 무엇이고 누가 정하는가',
    notes: '첫 장에서 던진 질문(장애 원인을 사람으로 적었나 시스템으로 적었나)으로 닫는다. 세 개의 핵심만 남기고 나머지는 버려도 좋다. 다음 주제는 3주체의 역할 경계다. 배분 3분.'
  }

];

module.exports = { session: {
  no: 1,
  title: '품질 패러다임 전환과 Shift-Left',
  slides,
  get toc() { return this.slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title]); }
}};