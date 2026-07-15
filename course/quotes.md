# 인용 자산 (기계 판독 형식)

> **이 파일은 검증기의 계약이다.** `verify.js`가 이 파일을 직접 파싱해 세션 데이터의 인용을 원문과 대조하고,
> `master_render.js`가 강사 노트에 출처·URL을 자동 첨부한다. 항목 형식을 바꾸면 대조가 깨진다.
> 덱은 `meta.quotes: '../course/quotes.md'`로 이 파일을 가리킨다.

> **이 절의 형식은 검증기의 계약이다.** `verify.js`가 이 문서를 직접 파싱해 세션 데이터의 인용을
> 원문과 문자열 대조한다. 항목 형식(`` - `ID` [등급] 세션태그 `` + 들여쓴 `EN/KO/AUTHOR/SRC`)을 바꾸면 대조가 깨진다.
>
> **사용 규칙**
> 1. 아래 원문·번역만 그대로 쓴다. 임의 의역·추론·창작은 금지다.
> 2. 인용을 쓸 때는 `id`를 함께 적는다. 자산에 없는 id, 자산과 다른 문구는 검증 오류로 중단된다.
> 3. **개수를 채우지 않는다.** 세션의 명제와 직접 연결되는 인용이 없으면 인용을 쓰지 않는다.
> 4. 세션 태그는 권장 사용처다. 태그 밖 사용은 금지가 아니라 경고다(나선형 심화에서의 전용을 막지 않는다).
> 5. 같은 인용의 세션 간 재사용은 허용. 같은 세션 내 중복은 금지.
>
> **등급**
> - `PRIMARY` — 저자의 저작·논문·공식 문서에서 문구를 확인했다.
> - `WIDELY-CITED` — 원전 문구는 확인되지 않으나 업계·학계에서 널리 통용된다(세미나 발언, 후대의 정식화 등).
>   슬라이드에 쓸 때는 한계를 표기한다(`caption` 또는 강사노트). 출처가 불명이면서 통용되지도 않는 문구,
>   특정 국가·산업의 관행을 정설처럼 포장한 자료는 자산에 넣지 않는다.

### 요구사항 (S07)

- `Q-BROOKS-HARDEST` [PRIMARY] S07
  EN: The hardest single part of building a software system is deciding precisely what to build.
  KO: 소프트웨어 시스템을 만드는 일에서 가장 어려운 단 하나는 무엇을 만들지 정확히 결정하는 것이다.
  AUTHOR: Frederick P. Brooks Jr.
  SRC: No Silver Bullet — Essence and Accident in Software Engineering (『The Mythical Man-Month』 기념판 수록)

- `Q-BROOKS-SPEC` [PRIMARY] S07
  EN: ...it is really impossible for a client, even working with a software engineer, to specify completely, precisely, and correctly the exact requirements of a modern software product before trying some versions of the product.
  KO: 고객이 소프트웨어 엔지니어와 함께 일하더라도, 제품의 몇몇 버전을 실제로 써 보기 전에 현대 소프트웨어 제품의 정확한 요구사항을 완전하고 정밀하고 올바르게 명세하는 것은 사실상 불가능하다.
  AUTHOR: Frederick P. Brooks Jr.
  SRC: No Silver Bullet (『The Mythical Man-Month』 기념판 수록)

- `Q-BEZOS-DISCONTENT` [PRIMARY] S07
  EN: One thing I love about customers is that they are divinely discontent. Their expectations are never static — they go up.
  KO: 내가 고객에 대해 사랑하는 한 가지는 그들이 신성하게 불만족스러워한다는 점이다. 그들의 기대는 결코 정체되지 않고 계속 높아진다.
  AUTHOR: Jeff Bezos
  SRC: Amazon 주주 서한 (2017)

### 시스템 사고·문화 (S01/S02/S13)

- `Q-DEMING-BADSYS` [WIDELY-CITED] S01, S02, S13
  EN: A bad system will beat a good person every time.
  KO: 나쁜 시스템은 언제나 좋은 사람을 이긴다.
  AUTHOR: W. Edwards Deming
  SRC: 저서가 아니라 세미나 발언으로 귀속된다(Deming Institute — 1993년 2월 Four Day 세미나, Phoenix). 원전 문헌 문구는 확인되지 않는다.
  URL: https://deming.org/a-bad-system-will-beat-a-good-person-every-time/

- `Q-DEMING-94-6` [PRIMARY] S01
  EN: 94% belongs to the system (responsibility of management), 6% special.
  KO: 문제의 94%는 시스템에 속하고(경영의 책임), 6%가 특수 원인이다.
  AUTHOR: W. Edwards Deming
  SRC: Out of the Crisis
  URL: https://quotes.deming.org/books/out-of-the-crisis

- `Q-DEMING-FEAR` [PRIMARY] S02, S13
  EN: Drive out fear, so that everyone may work effectively for the company.
  KO: 두려움을 몰아내라. 그래야 모두가 회사를 위해 효과적으로 일할 수 있다.
  AUTHOR: W. Edwards Deming
  SRC: Out of the Crisis — 14 Points #8
  URL: https://quotes.deming.org/books/out-of-the-crisis

- `Q-DEMING-BESTEFFORT` [WIDELY-CITED] S01, S13
  EN: It is not enough to do your best; you must know what to do, and then do your best.
  KO: 최선을 다하는 것만으로는 충분하지 않다. 무엇을 해야 할지 알아야 하고, 그다음 최선을 다해야 한다.
  AUTHOR: W. Edwards Deming
  SRC: 널리 통용되나 원전 페이지는 확인되지 않는다(강연·세미나 발언으로 귀속). 같은 취지의 명제가 Out of the Crisis 전반에 있다.
  URL: https://curiouscat.com/management/deming/quotes

- `Q-GREENLEAF-SERVANT` [PRIMARY] S02, S13
  EN: The servant-leader is servant first.
  KO: 서번트 리더는 섬김이 먼저인 사람이다.
  AUTHOR: Robert K. Greenleaf
  SRC: The Servant as Leader (1970)

### 표준·개선 (S03/S04/S05/S06/S08/S09)

- `Q-DEMING-NOINSPECT` [PRIMARY] S03, S05, S09
  EN: Cease dependence on inspection to achieve quality. Eliminate the need for inspection on a mass basis by building quality into the product in the first place.
  KO: 품질을 얻기 위해 검사에 의존하지 마라. 처음부터 제품에 품질을 심어 대량 검사의 필요 자체를 없애라.
  AUTHOR: W. Edwards Deming
  SRC: Out of the Crisis — 14 Points #3
  URL: https://quotes.deming.org/books/out-of-the-crisis

- `Q-DEMING-IMPROVE` [PRIMARY] S03, S05
  EN: Improve constantly and forever the system of production and service.
  KO: 생산과 서비스의 시스템을 끊임없이, 영원히 개선하라.
  AUTHOR: W. Edwards Deming
  SRC: Out of the Crisis — 14 Points #5
  URL: https://quotes.deming.org/books/out-of-the-crisis

- `Q-DEMING-TOOLATE` [PRIMARY] S01, S03, S09
  EN: Inspection is too late. The quality, good or bad, is already in the product.
  KO: 검사는 너무 늦다. 품질은 좋든 나쁘든 이미 제품 안에 들어가 있다.
  AUTHOR: W. Edwards Deming
  SRC: Out of the Crisis (원문은 'Inspection does not improve the quality, nor guarantee quality. Inspection is too late.'로 이어진다 — 위는 축약 인용이다)
  URL: https://quotes.deming.org/books/out-of-the-crisis

- `Q-DEMING-SURVIVAL` [WIDELY-CITED] S03, S04
  EN: It is not necessary to change. Survival is not mandatory.
  KO: 변화는 의무가 아니다. 생존 또한 의무가 아니다.
  AUTHOR: W. Edwards Deming
  SRC: 널리 통용되나 원전 문헌은 확인되지 않는다(강연 발언으로 귀속). 변형 'Learning is not compulsory... neither is survival.'도 함께 유통된다.
  URL: https://curiouscat.com/management/deming/quotes

- `Q-DIJKSTRA-TESTING` [PRIMARY] S06, S09
  EN: Program testing can be used to show the presence of bugs, but never to show their absence.
  KO: 테스트는 결함의 존재를 보일 수 있을 뿐, 결함의 부재를 증명하지 못한다.
  AUTHOR: Edsger W. Dijkstra
  SRC: Notes on Structured Programming (1970)

- `Q-HOPPER-ALWAYS` [WIDELY-CITED] S04, S05
  EN: The most dangerous phrase in the language is, 'We've always done it this way.'
  KO: 언어에서 가장 위험한 말은 '우리는 늘 이렇게 해왔다'이다.
  AUTHOR: Grace Hopper
  SRC: 널리 통용되는 정식화. 가장 이른 기록은 Computerworld(1976) 인터뷰이며 문구가 다르다 — 'the most dangerous phrase a DP manager can use is We've always done it that way.'
  URL: https://quoteinvestigator.com/2014/11/27/always-done/

- `Q-HUMPHREY-MAP` [WIDELY-CITED] S04, S08
  EN: If you don't know where you are, a map won't help.
  KO: 자신이 어디 있는지 모르면 지도도 소용없다.
  AUTHOR: Watts S. Humphrey
  SRC: 『Managing the Software Process』(1989)로 귀속되나 원문 페이지는 확인되지 않는다(인용 집계 사이트 경유).
  URL: https://www.azquotes.com/author/29694-Watts_Humphrey

### 비용·지표·자동화 (S01/S09/S10/S12/S13/S14)

- `Q-CROSBY-FREE` [PRIMARY] S01
  EN: Quality is free. It's not a gift, but it is free.
  KO: 품질은 공짜다. 선물은 아니지만, 공짜다.
  AUTHOR: Philip B. Crosby
  SRC: Quality Is Free (1979)

- `Q-STRATHERN-MEASURE` [PRIMARY] S05, S09, S12
  EN: When a measure becomes a target, it ceases to be a good measure.
  KO: 지표가 목표가 되면, 그것은 좋은 지표이기를 멈춘다.
  AUTHOR: Marilyn Strathern
  SRC: 'Improving ratings': audit in the British University system (1997) — Goodhart 법칙의 대중적 정식화

- `Q-GOLDRATT-MEASURE` [PRIMARY] S12, S13
  EN: Tell me how you measure me, and I will tell you how I will behave.
  KO: 나를 어떻게 측정하는지 말해 달라. 그러면 내가 어떻게 행동할지 말해 주겠다.
  AUTHOR: Eliyahu M. Goldratt
  SRC: The Haystack Syndrome

- `Q-GATES-AUTOMATION` [WIDELY-CITED] S10, S14
  EN: Automation applied to an inefficient operation will magnify the inefficiency.
  KO: 비효율적 작업에 자동화를 적용하면 비효율이 증폭된다.
  AUTHOR: Bill Gates
  SRC: 『The Road Ahead』(Gates·Myhrvold·Rinearson, 1996)로 귀속되나 원문 페이지는 확인되지 않는다. 완전한 형태는 앞 문장을 동반한다 — 'automation applied to an efficient operation will magnify the efficiency.'
  URL: https://www.azquotes.com/quote/1342994

### 설계·조직 (S06/S07/S11)

- `Q-FEYNMAN-FOOL` [PRIMARY] S06, S09
  EN: The first principle is that you must not fool yourself — and you are the easiest person to fool.
  KO: 첫 번째 원칙은 자신을 속이지 않는 것이다. 그리고 가장 속이기 쉬운 사람은 자기 자신이다.
  AUTHOR: Richard P. Feynman
  SRC: Cargo Cult Science — Caltech 졸업 연설 (1974)

- `Q-EVANS-HEART` [PRIMARY] S07, S11
  EN: The heart of software is its ability to solve domain-related problems for its user.
  KO: 소프트웨어의 핵심은 사용자의 도메인 문제를 해결하는 능력에 있다.
  AUTHOR: Eric Evans
  SRC: Domain-Driven Design (2003)

- `Q-CONWAY-STRUCTURE` [PRIMARY] S11
  EN: Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure.
  KO: 시스템을 설계하는 조직은 그 조직의 소통 구조를 복제한 구조의 설계를 만들어낸다.
  AUTHOR: Melvin E. Conway
  SRC: How Do Committees Invent? (1968) — 원문은 'designs a system (defined more broadly here than just information systems)'로 괄호 구를 포함한다

### 자산이 없는 세션

**S15(Operating Model)·S16(워크숍 2)에는 인용 자산이 없다.** 이는 결함이 아니다 — 억지로 채우지 않는다.
S08(워크숍 1)은 `Q-HUMPHREY-MAP`(현 위치 진단) 하나만 유효하다.

### 수치 명제의 출처 (시각화 `caption`에 그대로 쓴다)

수치를 그림으로 올릴 때 아래 문구를 `caption`에 넣는다. 인용과 같은 규칙을 적용한다 — **숫자를 명제로 올렸으면 근거를 대라.**
`caption`은 **근거·한계 전용(8pt)**이다. 인용 원문을 여기에 넣지 않는다.

- **94:6 (S01 `statement`)**  ← **그림으로 그리지 않는다.** 한 문장으로 던지고 해설은 `note`(14pt)로 받는다.
  구성비 막대는 이 명제를 설득하지 못한다 — 94와 6의 길이 차이는 이미 아는 것을 반복할 뿐이고,
  실제로 청중을 움직이는 것은 "대부분의 문제는 네 잘못이 아니다"라는 **말**이다. 그림이 붙으면 말이 종이 된다.
  `caption:'측정값이 아니라 저자의 경험적 추정치다.'`  (저자·출처는 caption에 쓰지 않는다 — 10pt 줄이 자동으로 붙인다)
  영문 원문은 **caption에 넣지 않는다** — 8pt 각주에 원문을 밀어넣으면 그림이 주가 되고 말이 종이 된다.
  원문·출처·URL은 엔진이 강사 노트에 자동으로 붙인다(인용 id를 쓰면 된다). 원문을 슬라이드에 보이려면 `quote` 오버레이를 쓴다.
  원문: "I should estimate that in my experience most troubles and most possibilities for improvement add up to the proportions something like this: 94% belongs to the system (responsibility of management), 6% special." (Deming 자신이 1985년에 85:15에서 94:6으로 상향 조정한 값이다)

- **1:10:100 (S01 `magnitude`)**
  `caption:'Boehm(1981)·Boehm & Basili(2001) 기반의 통용 정식화. 대규모·고신뢰 시스템에 가깝고, 소규모 비핵심 시스템에서는 5:1 수준으로 보고된다.'`
  근거와 한계: Boehm(1981)의 비용 곡선, Boehm & Papaccio(1988)의 "현장 발견 시 50~200배", Boehm & Basili(2001)의 "소규모 비핵심 시스템은 5:1에 가깝다". 근거 자료의 강도 자체를 비판한 문헌도 있다(Bossavit, *The Leprechauns of Software Engineering*). **명제는 "정확히 100배"가 아니라 "단계가 넘어갈수록 자릿수가 바뀐다"이다.** 이 한계를 밝히지 않고 100배를 단정하면, 이 교재가 S12에서 가르치는 지표 왜곡을 교재 자신이 저지르는 것이 된다.

---