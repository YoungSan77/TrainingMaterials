/* ============================================================================
 * MASTER — 교재 세션 생성기 (생성 계약 + 렌더 엔진, 도메인 독립)
 * ============================================================================
 * 이 파일 하나와 "커리큘럼 문서" 하나만 있으면 세션 덱을 만든다.
 *   지시:  "세션 NN 생성"
 *   결과:  NN.js  ─(이 엔진)→  Course_SessionNN_Output.pptx
 *          데이터 파일명은 세션 번호 두 자리다: 01.js, 02.js … 16.js (다른 이름을 쓰지 않는다)
 *
 * 이 파일은 특정 교재를 알지 못한다. 콘텐츠와 과정 규칙(용어·톤·분량·인용)은
 * 전부 커리큘럼 문서에서 온다. 이 파일은 "커리큘럼을 슬라이드 스펙으로 바꾸는
 * 방법"과 "그 스펙을 그리는 엔진"만 담는다.
 * 아래 예시에 등장하는 소재는 전부 가상이다(어떤 커리큘럼의 주제도 아니다).
 * 예시에서 가져올 것은 필드 구성과 문장 밀도뿐이며, 어휘·개념·인용은 커리큘럼에서만 온다.
 *
 * ┌── 생성 절차 (생성기 LLM이 따른다) ──────────────────────────────────────┐
 * │ 1. 커리큘럼의 "설계·표기 규칙" 절을 먼저 읽고 그 규칙을 이 세션 생성      │
 * │    전체에 그대로 적용한다. 규칙이 충돌하면 커리큘럼이 항상 우선한다.      │
 * │ 2. 지시된 세션 항목을 찾는다.                                            │
 * │ 3. 세션 하위 항목(문제/해결/적용/…)을 아래 [슬라이드 계획]에 따라        │
 * │    12~17장의 본문 슬라이드로 논리적으로 분할 전개한다.                    │
 * │ 4. 각 슬라이드를 [슬라이드 스펙 스키마]의 객체로 기술하고 데이터 파일로   │
 * │    저장한다:  module.exports = { book, curriculum, session } .           │
 * │ 5. 엔진을 실행한다. 표지·전체목차·세션목차·페이지 번호는 엔진이 자동      │
 * │    처리한다. 본문 슬라이드만 생성하며 페이지 번호를 스펙에 쓰지 않는다.   │
 * │ 6. 데이터 파일 끝에 아래 self-run 가드를 반드시 붙인다. 그래야           │
 * │    "node NN.js" 직접 실행으로도 바로 pptx가 생성된다.                    │
 * │      if (require.main === module) require('./master_render.js')(module.exports); │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * [실행 진입점]  (둘 다 동작 — pptxgenjs 설치 필요: npm i pptxgenjs)
 *   · node 01.js                             (데이터 파일 직접 실행, 위 가드 필요)
 *   · node master_render.js 01.js            (엔진에 데이터 전달)
 *   ※ 데이터 파일은 module.exports 뿐이므로, 가드가 없으면 직접 실행해도 아무 일도 없다.
 *
 * [슬라이드 계획]  (정본 골격 — 모든 세션 동일. 본문 12~17장, 내용에 따라 가변)
 *   순서와 분류(kind)를 고정한다. 헤더 연번은 엔진이 slides 배열의 위치로 자동 부여한다.
 *   kind ∈ 학습 목표 | 현상 | 원인 | 원칙 | 적용 | 타협 | 요약   — 모든 본문 슬라이드가 kind를 갖는다.
 *   (분류 요건을 세는 것은 현상·원인·원칙·적용·타협 다섯뿐이다. 학습 목표·요약은 위치가 고정된 장이다)
 *   모든 본문 슬라이드가 01부터 순차 연번을 받는다(학습 목표=01, 마지막 세션 요약=NN).
 *   헤더 = 'NN. {head || title}'. 분류(kind)는 데이터에만 남고 헤더에 출력하지 않는다.
 *   세션 목차(3p)도 같은 형식으로 렌더한다 → 'NN. {목차 제목}'.
 *   번호 체계 구분: 슬라이드 연번은 두 자리(01·02…), 세션 번호는 한 자리부터(1·2…16).
 *   세션 목차 헤더 = '{세션번호}. {세션 제목} 목차', 푸터 세션 표기 = '{세션번호}. {세션 제목}'.
 *   title 안에 부제를 붙일 때는 '—'를 쓴다(연번 구분자와 겹치지 않는다). 따옴표는 쓰지 않는다.
 *   장수 배분 원칙: 한 슬라이드 = 한 명제. 장수를 채우려고 명제를 쪼개거나 합치지 않는다.
 *   분류별 범위는 권장이고, 총량(본문 12~17장)이 강제다(lint가 검사한다).
 *   범위 상한을 모두 쓰면 총량을 넘는다 — 충돌하면 총량이 이긴다.
 *   각 분류는 최소 1장을 유지한다(분류를 통째로 비우지 않는다).
 *   · 학습 목표   1장   kind:'학습 목표'  → 연번 01. visual: table(대비 3행)
 *   · 현상        2~3장 kind:'현상'       증상을 국면별로 분할
 *   · 원인        1~3장 kind:'원인'       구조적 원인(국소 최적화, 통제 수단의 한계 등)
 *                        원인의 층위 수가 장수를 정한다. 단일 원인이면 1장, 층위가 갈리면 3장.
 *   · 원칙        3~4장 kind:'원칙'       정의·법칙·비용 구조
 *   · 적용        2~3장 kind:'적용'       사고 전환과 실행
 *   · 타협        1~2장 kind:'타협'       전제/Trade-off/실패조건 + 지표 재정의
 *                        기본 2장(① 전제·Trade-off·실패조건  ② 지표 재정의).
 *                        지표를 재정의하지 않는 세션에 한해 1장으로 합친다.
 *                        전제·Trade-off·실패조건 셋 중 하나라도 빠지면 안 된다.
 *   · 단문        2~4장 visual: statement — 인용이나 핵심 메시지를 한 문장으로 던진다.
 *                        분류 요건을 채우지 못한다(논증이 없다). 장수에는 포함된다.
 *   · 요약        1장   kind:'요약'  head:'요약과 다음 연결', visual: takeaways
 *                        head를 써도 연번은 붙는다 → 'NN. 요약과 다음 연결'
 *
 * [본문 슬라이드 공통 3단]  (모든 본문 슬라이드가 반드시 갖는다)
 *   sub      : 슬라이드 명제 한 줄(무엇을 말하는가)
 *   question : 핵심 질문 한 줄. 반드시 물음표로 끝난다("왜 …?", "이 방식은 …인가?")
 *   lead     : { label, text } 라벨 문장(예: '통제 변수', '비용 구조', '선택과 버림')
 *
 * [필수 산출 체크리스트]  ★ 세션 생성 후 반드시 이 목록으로 자가 점검한다 ★
 *   기능이 "사라지는" 유일한 원인은 데이터가 그 필드를 넘기지 않는 것이다.
 *   엔진은 필드가 없으면 조용히 건너뛴다. 따라서 아래를 매 세션 확인한다.
 *   lint가 [치명]으로 잡으면 pptx를 만들지 않고 중단한다(exit 1). [경고]는 출력하고 진행한다.
 *   작업 중 초안만 보려면 --draft 를 붙인다 → 치명이 경고로 강등되고 파일명에 _DRAFT가 붙는다.
 *     예: node 03.js --draft
 *   [치명] sub/question/lead/foot 누락(statement는 sub만) · 인용 4필드(id/ko/en/author) 누락 ·
 *          학습 목표 슬라이드 없음 · 분류(현상/원인/원칙/적용/타협)의 논증 슬라이드 누락 ·
 *          같은 세션 내 인용 중복 · 알 수 없는 visual.type
 *   [경고] notes 없음 · share/magnitude에 caption 없음 · 본문 장수가 12~17장을 벗어남 ·
 *          시각화 트리거 회피(visualNote로 사유를 남기면 꺼진다)
 *   □ 모든 본문 슬라이드에 sub / question / lead / foot 4종이 있는가
 *   □ 인용을 개수로 채우지 않았는가  ← 자산에 맞는 인용이 없으면 0장이 정답이다
 *      쓸 때는 커리큘럼 인용 자산의 id와 원문을 글자 그대로 옮긴다(창작·의역 금지).
 *   □ 모든 본문 슬라이드에 notes(강사 노트)를 썼는가
 *   □ 본문 슬라이드가 12~17장인가 (프론트매터 제외)
 *   □ box/표 본문이 명사 나열이 아니라 완결된 서술문인가
 *   □ 학습 목표(연번 01)와 요약(head 지정, 마지막 연번)이 각각 1장씩 있는가
 *   □ session.toc를 slides에서 파생시켰는가(손으로 쓰면 헤더 연번과 어긋난다)
 *        toc: slides.map((s, i) => [String(i + 1).padStart(2, '0'), s.head || s.title])
 *
 * [타이포/여백 규격]  (엔진이 강제. 데이터에서 폰트를 지정하지 않는다)
 *   · 본문 텍스트(질문/리드/하단 결론/목차)        14pt
 *   · box/표 내부 텍스트                          12pt
 *   · box/표 제목·헤더                            12pt bold
 *   · 인용 한글 14pt / 인용 영문·저자 10pt
 *   · 모든 폰트: 맑은 고딕.  기울임체 사용 금지.
 *   · box/표 내부 여백 상하좌우 0.2cm, 문장 간 전후 간격 3pt
 *   · 모든 도형은 직각(라운드 코너·원형 배지 사용 안 함)
 *   · box 높이는 텍스트 줄 수에 따라 자동 가변
 *   · 표/box는 질문·리드 밴드의 마지막 라인과 하단 수평선의 중간에 자동 배치
 *
 * [폭 모델]  ★ 문자폭 계산은 measure.js 하나만 쓴다. 이 파일에 상수를 다시 두지 않는다.
 *   한글은 전각이라 12pt에서 1자 = 12/72 = 0.167in이다. 이 값을 잘못 잡으면 엔진이
 *   박스를 1줄 높이로 그리고 PowerPoint는 2줄로 흘려 글자가 박스를 벗어난다.
 *   검증기(verify)도 같은 measure.js를 import 해야 "verify 통과 = 안 넘친다"가 성립한다.
 *   1줄에 들어가는 한글 자수(12pt 기준):
 *     boxes 2열 22자 · boxes 3열 14자
 *     steps 3열 14자 · steps 4열 10자 · steps 5열 7자
 *     versus 2열 22자 · versus 3열 13자 · loop 타원(10pt) 8자 · statement(20pt) 27자
 *   ※ 1줄은 목표가 아니라 참고치다. 뜻을 살린 서술문은 좁은 열(steps 4열 등)에서
 *     1줄에 들어가지 않는다. 축약으로 뜻이 깎이면 2줄을 쓴다 — 엔진이 실제 글자
 *     높이만큼 박스를 키우므로 넘치지 않는다. 3줄부터는 밀도 과다로 본다.
 *     명사 나열로 줄이는 것은 금지다(§0.5). 뜻 > 1줄.
 *
 * [표기 규칙]  (전 세션 공통. 위반하면 정본과 어긋난다)
 *   · 기울임체(italic) 사용 금지. 강조는 굵게(bold)와 색으로만 한다.
 *   · 텍스트는 독립 개체로 흩뿌리지 않고 표/박스/카드 안에 내장한다.
 *     질문(question)과 리드(lead)는 엔진이 하나의 배경 밴드에 내장해 렌더한다.
 *   · 과도한 축약을 하지 않는다. 박스 본문은 명사 나열이 아니라 서술문으로 쓴다.
 *     (X) '점검 주기 미준수'   (O) '점검 주기가 지켜지지 않아 이상 징후가 누적된다'
 *   · 과정 목차와 세션 목차는 표를 쓰지 않는다(엔진이 카드/리스트로 렌더).
 *   · box/표 위에 떠 있는 독립 텍스트를 만들지 않는다. 모든 텍스트는 도형에 내장된다.
 *
 * [시각 문법]  visual.type — 한 슬라이드에 주 시각화는 1개
 *
 *   ★ 선택 규칙 (이것이 타입 목록보다 중요하다)
 *     관계가 내용이면  → flow / pipeline / loop
 *     항목이 내용이면  → boxes / steps / versus / table
 *     숫자가 명제이면  → share / magnitude
 *     계층이 내용이면  → pyramid
 *     두 축이 내용이면 → quadrant
 *     ※ "숫자가 명제"란 그 수치 자체가 슬라이드의 주장인 경우다(예: 원인의 대부분은 시스템에 있다 = 94:6).
 *       주장을 뒷받침하는 근거 수치는 명제가 아니다 → 그것은 표(table)가 맞다.
 *     ※ table은 최후의 수단이다. 무엇이든 담기기 때문에, 타입 선택에 실패하면 반드시 표로 흘러간다.
 *       "표로도 되는데"는 표를 고를 이유가 되지 못한다. 위 규칙에 해당하면 해당 타입을 쓴다.
 *
 *   [항목 계열]
 *   · boxes    : 병렬 2~3요소(국면별 증상, 주체별 역할)   [ {title, body:[...]} ]
 *   · table    : 비교·매핑 표(대비 표, 판단 기준 표)       [ [헤더...], [행...] ]
 *   · steps    : 번호 단계 전개(절차·국면의 순차 진행)     [ {title, body:[...]} ]
 *                권장 3~4단계(본문 2줄까지). 5단계부터 열이 좁아지니 본문을 1줄로 줄인다.
 *   · versus   : 열 대비. 2열이 기본(좌=대비/적색, 우=지향/청록).
 *                [ {title, body:[...]}, ... ]  negative:false로 적색 해제(3주체처럼 대비가 아닐 때)
 *   · takeaways: 세션 요약 번호 리스트                     [ {title, body} ]
 *
 *   [단문]  — 골격 예외. 이 타입만 question/lead/foot을 쓰지 않는다.
 *   · statement: 한 문장만 보여주는 슬라이드.
 *                { text:'한 문장' | quote:{id,ko,en,author}, note?:'해설 한 문장', caption?:'근거·한계' }
 *                  20pt  text 또는 quote.ko  — 이 슬라이드가 하려는 말
 *                  14pt  note                — 해설(본문 크기다. 각주가 아니다)
 *                  10pt  quote.en / 저자     — 원문·출처
 *                   8pt  caption             — 근거·한계만. 해설을 여기 넣으면 논지가 각주로 강등된다.
 *                그림을 넣지 않는다. 단문의 힘은 비어 있음에서 나온다.
 *                세션당 2~3장. 4장부터 경고한다 — 단문이 많으면 논증이 사라진다.
 *                분류(현상/원인/원칙/적용/타협) 요건을 채우지 못한다(논증이 없다).
 *
 *   ★ 인용의 기본 자리는 statement가 아니다.
 *     인용은 논증 슬라이드의 quote 오버레이(하단)로 붙이는 것이 기본이다.
 *     statement는 세션의 전환점에만 쓴다 — 인용 하나에 단문 한 장씩 만들지 않는다.
 *
 *   [관계 계열]  — 노드·간선을 선언한다. 코드 문자열이 아니다.
 *   · flow     : 인과·구조 흐름   { dir:'LR'|'TD', nodes:[{id,label}], edges:[{from,to,label?}] }
 *                기본은 LR이다 — 좌우가 시간·단계의 방향이다(앞 단계 → 뒤 단계).
 *                TD는 계층(상위→하위)일 때만 쓴다. 밴드를 넘는다는 오류를 피하려고 TD로 돌리지 않는다.
 *                (밴드를 넘으면 노드나 라벨을 줄여야 한다. 방향은 내용이 정하는 것이지 검증을 피하는 수단이 아니다)
 *                권장 노드 3~6, 라벨 10자 이내(2줄까지). 역방향 간선은 하단 채널로 우회한다.
 *   · pipeline : 단계 + 게이트 + 되돌림  { nodes:[{id,label,gate?:true}], edges?:[...] }
 *                edges를 생략하면 순차로 잇는다. 되돌림(재작업)은 역방향 edge로 준다.
 *                gate:true인 노드는 청록으로 구분된다(통과/차단 지점).
 *   · loop     : 순환·되먹임      { nodes:[{id,label}], edges?:[...] }
 *                노드를 원형으로 배치하고 고리로 잇는다. 권장 3~5노드. 악순환/선순환에 쓴다.
 *
 *   [수치 계열]  — 숫자가 명제일 때만 쓴다. caption(출처·한계) 필수.
 *   · share    : 구성비(합 100)   [ {label, value, note?} ]        예: 94 / 6
 *                100% 스택 바. 비례가 곧 메시지다. 2~4항목.
 *   · magnitude: 자릿수 격차      [ {label, value, unit?, note?} ] 예: 1 / 10 / 100
 *                면적 비례를 포기하고 계단형으로 그린다(1을 비례로 그리면 보이지 않는다).
 *                대신 숫자를 크게 병기한다. 명제는 "정확히 100배"가 아니라 "자릿수가 바뀐다"이다.
 *   · pyramid  : 폭이 곧 양인 계층 [ {label, note?} ]   위(좁음) → 아래(넓음) 순서로 준다.
 *   · quadrant : 두 축의 사분면   { x:{label,low,high}, y:{label,low,high},
 *                                  cells:[{at:'TL'|'TR'|'BL'|'BR', title, body?}] }
 *
 *   · caption (선택): 시각화 하단 출처·한계(8pt, 최대 3줄). share·magnitude·statement는 필수.
 *                     근거·한계만 쓴다. 인용 원문(영문)을 여기에 넣지 않는다 — 8pt 각주에 원문을 밀어넣으면
 *                     그림이 주가 되고 말이 종이 된다. 원문·출처·URL은 엔진이 강사 노트에 자동으로 붙인다.
 *   · quote (선택)  : {id,ko,en,author} 인용 오버레이 — 검증된 커리큘럼 자산일 때만.
 *   · notes (선택)  : 강사 노트. 인용이 있으면 엔진이 자산에서 출처·원문·URL을 자동으로 덧붙인다
 *                     (생성기는 URL을 쓰지 않는다 → 지어낼 수 없다).
 *
 *   [인용 정책]  개수를 채우지 않는다.
 *     인용은 근거이지 장식이 아니다. 커리큘럼 인용 자산에 그 슬라이드의 명제와 직접 연결되는
 *     인용이 없으면 인용을 쓰지 않는다. 세션 전체에 인용이 0장이어도 정당하다.
 *     쓰는 경우에는 반드시 자산의 id를 함께 적는다(verify가 원문과 대조한다). 창작·의역은 금지다.
 *     같은 인용을 다른 세션에서 다시 쓰는 것은 허용된다. 같은 세션 안에서의 중복은 금지다.
 *
 * [K블록(foot) 규칙]  { kw, color, body }
 *   · kw    : 슬라이드 결론 라벨(자유. 예: 구조적 결함/절대 법칙/전략적 인내/세션 결론)
 * [슬라이드 스펙 스키마]
 *   book        : { title, subtitle, tagline? }        // 세션1 커버(전 세션 공통 상수)
 *   curriculum  : [ { day, items:[...] }, ... ]        // 세션1 과정목차(2열, 공통 상수)
 *                 items에는 세션 제목만 쓴다. 세션 번호(로마자)는 엔진이 위치로 부여한다.
 *                 (데이터에 번호가 남아 있어도 엔진이 벗기고 다시 붙인다)
 *   session.no  : 1이면 커버+과정목차+세션목차 자동 / 2+이면 세션목차만
 *   session.title, session.toc : [ [번호, 제목], ... ]  // 본문 전 슬라이드를 순서대로. slides에서 파생시킨다.
 *                                 toc: slides.map((s,i)=>[String(i+1).padStart(2,'0'), s.head||s.title])
 *   session.slides[] = {
 *     kind              : '학습 목표'|'현상'|'원인'|'원칙'|'적용'|'타협'|'인용'
 *                         데이터에만 남는 분류. 헤더에 출력하지 않으며 lint 점검에만 쓰인다.
 *     title             : 헤더 제목(연번은 엔진이 자동으로 앞에 붙인다 → 'NN. 제목')
 *     head              : (선택) title 대신 쓰는 헤더 제목. 연번은 동일하게 붙는다.
 *     sub               : 슬라이드 명제 한 줄
 *     question          : 핵심 질문 한 줄(물음표로 끝난다)
 *     lead              : { label, text }
 *     visual            : { type, data, caption? }
 *                         type ∈ boxes|table|steps|versus|takeaways             (항목 계열)
 *                              | statement                                      (단문 — 골격 예외)
 *                              | flow|pipeline|loop                             (관계 계열)
 *                              | share|magnitude|pyramid|quadrant               (수치 계열)
 *     visualNote (선택)  : 시각화 트리거 경고를 끄는 근거 한 줄. 판단을 지우지 않고 기록에 남긴다.
 *                         (예: 이 수치는 명제가 아니라 근거다 → 표를 쓴다)
 *     quote (선택)       : { id, ko, en, author }       // 검증된 인용 자산 원문 그대로 + 자산 id
 *     foot              : { kw, color:'navy'|'teal'|'failL'|'failT', body }
 *   }
 *   meta (선택)         : { quotes:'./인용자산.md',      // 인용 자산 경로 — 엔진(노트 출처)·verify(원문 대조)가 읽는다
 *                           visualTriggers:{ loop:[...], share:[...], magnitude:[...] } }
 *                         어휘 트리거는 도메인 자산이다. 엔진·verify에 어휘를 넣지 않는다.
 *                         (엔진이 아는 트리거는 형태뿐이다: n:m 비율, % 두 개 이상)
 *   ※ 본문에는 intro를 쓰지 않는다(질문+리드가 대신한다). intro는 구버전 호환용으로만 남아 있다.
 *
 * [형식 앵커 예시]  ★ 소재는 전부 가상이다(상수도 누수 점검 — 어떤 커리큘럼의 주제도 아니다).
 *   여기서 가져올 것은 필드 구성과 문장 밀도(명사 나열이 아닌 완결된 서술문)뿐이다.
 *   아래의 어휘·개념·주장을 교재로 옮기지 않는다. 콘텐츠는 오직 커리큘럼 문서에서 온다.
 *
 *   // 원인 슬라이드 (versus) — 대비 2열
 *   { kind:'원인', title:'사후 대응 중심 운영의 구조적 한계',
 *     sub:'터진 뒤에 고치는 방식은 이미 발생한 손실을 되돌리지 못한다',
 *     question:'늦게 발견하는 것이 왜 구조적 한계인가?',
 *     lead:{ label:'대응의 한계', text:'수리는 파손을 복구할 뿐 파손의 발생을 막지 못한다' },
 *     visual:{ type:'versus', data:[
 *       { title:'사후 대응', body:[
 *         '누수가 지표로 드러난 뒤에야 이상을 인지한다',
 *         '여러 구간의 손상이 겹쳐 원인 지점을 특정하기 어렵다' ] },
 *       { title:'사전 점검', body:[
 *         '압력 편차를 상시 측정해 이상을 조기에 확정한다',
 *         '구간 단위로 격리해 손상 범위를 즉시 봉쇄한다' ] } ]},
 *     foot:{ kw:'구조적 한계', color:'failT',
 *       body:'사후 대응에 의존하는 한 안정성은 운영의 결과가 아니라 운에 맡겨진다.' } }
 *
 *   // 원칙 슬라이드 (steps) — 순차 단계 전개
 *   { kind:'원칙', title:'발견 시점에 따른 대응 비용의 증가',
 *     sub:'통제 범위를 벗어난 뒤에 발견할수록 비용은 계단식으로 커진다',
 *     question:'초기에 잡지 못한 이상은 나중에 얼마나 비싸지는가?',
 *     lead:{ label:'비용 구조', text:'단계가 넘어갈 때마다 대응 비용의 자릿수가 바뀐다' },
 *     visual:{ type:'steps', data:[
 *       { title:'계측 단계',   body:['측정값의 미세한 편차로 나타난다','설정을 조정해 즉시 해소한다'] },
 *       { title:'국소 단계',   body:['한 구간의 압력 손실로 확대된다','해당 구간만 차단해 교체한다'] },
 *       { title:'연결 단계',   body:['인접 구간까지 부하가 전이된다','연결부 전체를 재검증해야 한다'] },
 *       { title:'공급 단계',   body:['이용자가 직접 단수를 겪는다','복구·보상·신뢰 손실이 함께 청구된다'] } ]},
 *     foot:{ kw:'비용의 법칙', color:'navy',
 *       body:'앞 단계에서 건너뛴 점검은 뒤 단계에서 몇 배의 비용으로 되돌아온다.' } }
 *
 *   // 단문 슬라이드 (statement) — 골격 예외. question/lead/foot을 쓰지 않는다.
 *   //   인용은 창작 금지 자산이다. id/ko/en/author를 커리큘럼 인용 자산에서 글자 그대로 옮긴다.
 *   //   URL은 쓰지 않는다 — 엔진이 자산에서 붙인다.
 *   { kind:'{분류}', title:'{슬라이드 제목}',
 *     sub:'{이 문장이 교정하려는 시각 한 줄}',
 *     visual:{ type:'statement',
 *              quote:{ id:'{자산 id}', ko:'{한글 원문}', en:'{영문 원문}', author:'{저자}' },
 *              caption:'{근거·한계 한 줄. WIDELY-CITED이면 필수}' },
 *     notes:'{던질 질문 · 흔한 반론 · 시간 배분}' }
 *   //   인용이 아닌 핵심 메시지는 quote 대신 text를 쓴다 → visual:{ type:'statement', text:'{한 문장}' }
 * ============================================================================ */
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { IN, textW, avail, lineCount } = require('./measure.js');   // 폭 모델 단일 소스
const QA = require('./quotes.js');                                // 인용 자산 파서(verify와 공유)

// 세션 번호는 아라비아 숫자다(1. 2. … 16.). 본문 슬라이드 연번은 두 자리 zero-pad(01. 02. …)이므로
// 형태로 구분된다. 로마자는 읽기에 어색해 폐기했다.

async function buildDeck(DECK) {
    console.log('[가동] 렌더 엔진 시작...');
    const pres = new pptxgen(); pres.layout = 'LAYOUT_4x3';

    // 세션 메타는 전부 데이터에서 파생한다 (엔진에 고정 내용 없음)
    // 인용 자산 — 경로는 데이터가 선언한다(meta.quotes). 엔진은 특정 교재를 알지 않는다.
    // 자산이 없으면 빈 맵으로 돌아간다(인용을 안 쓰는 덱도 정상이다).
    const { noteTail } = QA;
    const ASSETS = (() => {
        const rel = DECK.meta && DECK.meta.quotes;
        if (!rel) return new Map();
        const base = process.argv[2] ? path.dirname(path.resolve(process.argv[2])) : process.cwd();
        for (const p of [path.resolve(base, rel), path.resolve(process.cwd(), rel)]) {
            if (fs.existsSync(p)) {
                const r = QA.parse(p);
                r.bad.forEach(b => console.log(`[자산 경고] ${b}`));
                return r.assets;
            }
        }
        console.log(`[자산 경고] meta.quotes 경로를 찾지 못했다: ${rel} — 강사 노트에 출처를 붙이지 못한다.`);
        return new Map();
    })();

    const NN = String(DECK.session.no).padStart(2, '0');   // 파일명·정렬용(아라비아)
    const RN = String(DECK.session.no);                    // 화면 표기용(아라비아, zero-pad 없음)
    const SF = `${RN}. ${DECK.session.title}`;
    const AT = DECK.attribution || `Generated by Claude | Concepts, Requirements and feedback: Youngon Kim`;

    const C = { navy: '1B3A6B', navyLight: 'EBF1F8', white: 'FFFFFF', dark: '2D3748', muted: '6B7280', line: '1B3A6B', lineL: 'CBD5E1', fail: 'FEE2E2', failL: 'DC2626', failT: '991B1B', teal: '007965' };
    const FF = '맑은 고딕';
    const LM = 0.35, CW = 9.30, Y_START = 1.60, Y_LINE = 5.70, Y_BOT = 5.90;
    // 시각화 밴드: 질문/리드 밴드(1.45~2.23) 아래 ~ 하단 구분선 위
    const CTX_TOP = 1.45;              // 질문/리드 밴드 시작
    const VB = 5.66;                   // 시각화 하한(수평선 5.70 위)
    let VT = 2.40, VH = VB - VT;       // 시각화 밴드 — 슬라이드마다 동적 갱신
    // ── 타이포/여백 규격 (전 세션 공통) ──
    const F_BODY = 14;      // 본문 텍스트(질문/리드/도입)
    const F_IN   = 12;      // box/표 내부 텍스트
    const F_HEAD = 12;      // box/표 제목·헤더 (bold)
    const F_QKO  = 14;      // 인용 한글
    const F_QEN  = 10;      // 인용 영문·저자
    const PAD    = 0.0787;  // 0.2cm = 0.0787in — box/표 상하좌우 내부 여백
    const MG     = 5.67;    // 0.2cm를 pptxgenjs margin(pt) 단위로: 0.2cm ≈ 5.67pt
    const SP     = 3;       // 문장 간 전후 간격 3pt
    const LH     = 0.24;    // 텍스트 1줄 높이 추정(F_IN 기준, in)
    // ── 폭 모델(단일 소스) ─────────────────────────────────────────────────
    // 문자폭 계산은 measure.js 하나만 쓴다. 엔진과 verify가 같은 함수를 공유해야
    // "엔진이 그리는 줄 수 = 검증기가 세는 줄 수"가 성립하고, 오버플로가 구조적으로 사라진다.
    // 이 파일 안에서 문자폭 상수를 다시 정의하지 않는다.
    //   bullet : 불릿 들여쓰기(pt). 불릿이 없는 텍스트는 false를 넘긴다.
    //   fs     : 폰트 크기(pt). 기본은 box/표 본문(12pt).
    const lines = (t, w, bullet = 10, fs = F_IN) => {
        const av = bullet === false ? w - PAD * 2 : avail(w, bullet);
        return String(t).split('\n').reduce((n, par) => n + lineCount(par, av, fs), 0);
    };
    // 글자가 실제로 먹는 높이 = 줄 수 × 줄높이(1.2em) + 문단 수 × 문단간격(전후 3pt) + 상하 여백.
    // 박스 높이는 이 값으로 배정한다. '줄 수 × 0.24' 같은 근사치를 쓰면 문단이 늘어날수록
    // 배정이 모자라 글자가 박스를 벗어난다.
    const lineH = (fs) => IN(fs * 1.2);
    const textH = (ln, paras, fs = F_IN) => ln * lineH(fs) + paras * (2 * SP / 72) + PAD * 2;
    const SLACK = 0.06;                                  // 폰트 대체 오차 흡수용 여유

    // 헤더 폰트는 길이에 따라 분기한다: 22pt로 한 줄에 들어가면 22pt, 아니면 18pt.
    // (헤더 박스 h=0.50 / 구분선 y=0.80이 고정이라 두 줄이 되면 구분선을 침범한다)
    const hdrFS = (t) => (textW(t, 22) <= CW - 0.10 ? 22 : 18);
    const hdr = (s, t) => { s.addText(t, { x: LM, y: 0.20, w: CW, h: 0.50, fontSize: hdrFS(t), fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'middle', margin: 0 }); s.addShape(pres.shapes.LINE, { x: LM, y: 0.80, w: CW, h: 0, line: { color: C.navy, width: 1.5 } }); };
    const sub = (s, t) => { s.addText(t, { x: LM, y: 0.95, w: CW, h: 0.30, fontSize: 14, fontFace: FF, color: C.dark, bold: true, align: 'center', margin: 0 }); s.addShape(pres.shapes.LINE, { x: LM, y: 1.35, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } }); };
    // title에 ''를 넘기면 좌측 세션 표기를 생략한다(과정 목차처럼 세션에 귀속되지 않는 페이지).
    const ftr = (s, pg, title) => { s.addShape(pres.shapes.LINE, { x: LM, y: 7.10, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } }); s.addText(title ?? SF, { x: LM, y: 7.15, w: 4.0, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, margin: 0 }); s.addText(`${pg}`, { x: 4.5, y: 7.15, w: 1.0, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, align: 'center', margin: 0 }); s.addText(AT, { x: 5.0, y: 7.15, w: 4.65, h: 0.20, fontSize: 8, fontFace: FF, color: C.muted, align: 'right', margin: 0 }); };
    const dL = (s, y) => s.addShape(pres.shapes.LINE, { x: LM, y, w: CW, h: 0, line: { color: C.lineL, width: 0.5 } });
    // 인용 오버레이: 한글 14 / 영문·저자 10. 직각 배경 밴드에 내장(0.2cm 여백, 3pt 간격).
    // 높이는 실제 줄 수로 정한다. 긴 인용이 오면 밴드가 커진다(고정 높이면 글자가 밴드를 넘친다).
    const quoteH = (ko, en, author) => {
        const av = CW - PAD * 2;                                   // 중앙 정렬, 불릿 없음
        return Math.max(0.78, lineCount(`\u201C${ko}\u201D`, av, F_QKO) * 0.24
                            + lineCount(`${en} — ${author}`, av, F_QEN) * 0.18 + PAD * 2);
    };
    const addQuote = (s, ko, en, author) => {
        const h = quoteH(ko, en, author), y = VB - h;
        s.addText([
            { text: `“${ko}”`, options: { fontSize: F_QKO, bold: true, color: C.dark, fontFace: FF, breakLine: true, paraSpaceAfter: 0 } },
            { text: `${en} — ${author}`, options: { fontSize: F_QEN, color: C.muted, fontFace: FF, paraSpaceBefore: 0 } }
        ], { shape: pres.shapes.RECTANGLE, x: LM, y, w: CW, h,
             fill: { color: C.navyLight }, line: { color: C.lineL, width: 0.75 },
             align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
    };
    const sec = (title, tc, items) => { const out = [ { text: title, options: { bold: true, fontSize: 14, fontFace: FF, color: tc || C.navy, breakLine: true, paraSpaceBefore: SP, paraSpaceAfter: SP } } ]; items.forEach((it) => { it.forEach((part, k) => { out.push({ text: part.text, options: { bullet: k === 0 ? { indent: 14 } : undefined, fontSize: 14, fontFace: FF, color: part.options?.color || C.dark, bold: part.options?.bold || false, breakLine: k === it.length - 1, paraSpaceBefore: k === 0 ? SP : 0, paraSpaceAfter: k === it.length - 1 ? SP : 0 } }); }); }); return out; };
    const tocT = (arr) => { const out = []; arr.forEach((a, i) => { const last = i === arr.length - 1; out.push({ text: a[0] + `. `, options: { bold: true, color: C.navy, fontSize: F_BODY, fontFace: FF, paraSpaceBefore: SP, paraSpaceAfter: SP } }); out.push({ text: a[1], options: { color: C.dark, fontSize: F_BODY, fontFace: FF, breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } }); }); return out; };
    const K = (kw, kc, body) => [ { text: kw + `:  `, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: kc, paraSpaceBefore: SP, paraSpaceAfter: SP } }, { text: body, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, breakLine: true, paraSpaceBefore: SP, paraSpaceAfter: SP } } ];
    const hC = (t) => ({ text: t, isHeader: true });
    const td = (t, o = {}) => ({ text: t, options: o });

    // 표: 열폭은 실제 텍스트 폭 비율로, 행 높이는 실제 줄 수로 정한다.
    // (구버전은 열폭을 자체 상수 2.0/1.1로 재고, 행 높이를 무조건 0.45in로 두어
    //  셀이 2줄로 흐르면 표가 밴드를 넘겼다.)
    const autoTable = (s, y, tblData, opts = {}) => {
        const cellTxt = (cell) => (typeof cell === 'object' && cell !== null && cell.text !== undefined) ? String(cell.text) : String(cell ?? '');
        // 1) 열폭 — 각 열에서 가장 넓은 셀의 실제 텍스트 폭 비율로 배분한다.
        const maxW = new Array(tblData[0].length).fill(0);
        tblData.forEach(row => row.forEach((cell, i) => { maxW[i] = Math.max(maxW[i], textW(cellTxt(cell), F_IN)); }));
        const sumW = maxW.reduce((a, b) => a + b, 0);
        const tableW = Math.min(CW - (LM * 2), 8.6);
        let colW = sumW === 0 ? new Array(maxW.length).fill(tableW / maxW.length)
                              : maxW.map(w => Math.max((w / sumW) * tableW, 1.6));
        const scale = colW.reduce((a, b) => a + b, 0) > tableW ? tableW / colW.reduce((a, b) => a + b, 0) : 1;
        colW = colW.map(w => w * scale);
        // 2) 행 높이 — 그 행에서 가장 많이 흐르는 셀의 줄 수로 정한다(최소 0.45in).
        const rowH = tblData.map(row => Math.max(0.45,
            Math.max(...row.map((cell, i) => lineCount(cellTxt(cell), colW[i] - PAD * 2, F_IN))) * 0.28 + PAD * 2));
        const tblH = rowH.reduce((a, b) => a + b, 0);
        const finalY = y === 'auto' ? VT + (VH - Math.min(tblH, VH)) / 2 : y;
        const formattedTbl = tblData.map((row, rIdx) => row.map((cell, cIdx) => {
            const isHeader = rIdx === 0 || (cell && cell.isHeader);
            const bdr = isHeader ? [ { pt: 1, color: C.navy },
                                     cIdx === row.length - 1 ? { pt: 1, color: C.navy } : { pt: 1, color: C.white },
                                     { pt: 1, color: C.navy },
                                     cIdx === 0 ? { pt: 1, color: C.navy } : { pt: 0, color: C.navy } ]
                                 : { pt: 1, color: C.lineL };
            return { text: cellTxt(cell), options: { bold: isHeader || (cell && cell.options?.bold),
                color: isHeader ? C.white : C.dark, fill: { color: isHeader ? C.navy : C.white },
                align: isHeader || cIdx === 0 ? 'center' : 'left', valign: 'middle',
                fontSize: F_IN, fontFace: FF, margin: [MG, MG, MG, MG],
                paraSpaceBefore: SP, paraSpaceAfter: SP, border: bdr } };
        }));
        s.addTable(formattedTbl, { x: LM, y: finalY, w: tableW, colW, rowH, ...opts });
    };

    const renderAutoBoxes = (s, y, boxes) => {
        const n = boxes.length, gap = 0.20, w = (CW - gap * (n - 1)) / n;
        const need = Math.max(...boxes.map(b => textH(b.body.reduce((a, t) => a + lines(t, w), 0), b.body.length)));
        const h = Math.min(VH, 0.42 + need + SLACK);
        const top = y === 'auto' ? VT + (VH - h) / 2 : y;      // 밴드 수직 중앙
        boxes.forEach((b, i) => {
            const x = LM + i * (w + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            // 제목 — box에 내장 (12 bold)
            s.addText(b.title, { x, y: top, w, h: 0.42, fill: { color: C.navy }, color: C.white, bold: true, fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            // 본문 — box에 내장 (12), 문장 간 전후 3pt
            s.addText(b.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark, bullet: { indent: 10 }, breakLine: k < b.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + 0.42, w, h: h - 0.42, valign: 'top', margin: [MG, MG, MG, MG] });
        });
    };

    // ========================================================================
    // 시각화 모듈 — 데이터 표면은 7종이지만 내부 구현은 2개다.
    //   관계 계열(flow·pipeline·loop) → 노드·간선 배치 하나를 공유한다. 배치 모드만 다르다.
    //   수치 계열(share·magnitude·pyramid) → 막대 기하 하나를 공유한다.
    //   quadrant만 별도(2축 격자).
    // 선언 데이터만 받는다. 코드 문자열(mermaid)은 받지 않는다 — 문법 실패가 없고,
    // verify가 노드 수·라벨 폭을 잴 수 있어 다른 타입과 같은 등급의 검증을 받는다.
    // ========================================================================

    const F_CAP = 8;                                     // caption(출처·한계) — 원문을 넣으면 길어진다
    const F_ELAB = 10;                                   // 간선 라벨 (선 위에, 배경 없이)
    const F_STMT = 20;                                   // statement 본문 한 문장
    const F_SRC = 10;                                    // statement의 영문 원문·저자
    const F_NUM = 18;                                    // 수치 계열의 숫자
    const CAP_LH = 0.16;                                 // caption 한 줄 높이(8pt)
    const CAP_MAX = 3;                                   // caption 최대 줄 수 — 넘으면 발췌하고 '…'로 줄인다
    const capLines = (t) => Math.min(CAP_MAX, lineCount(String(t), CW - PAD * 2, F_CAP));
    const capH = (t) => t ? capLines(t) * CAP_LH + 0.06 : 0;
    const PAL = [C.navy, C.teal, C.muted, C.lineL];      // 수치 계열 색 순서
    const onDark = (c) => c === C.navy || c === C.teal || c === C.failT;

    const addCaption = (s, text) => {
        s.addText(text, { x: LM, y: VT + VH + 0.04, w: CW, h: capH(text) - 0.04, fontSize: F_CAP, fontFace: FF,
                          color: C.muted, align: 'center', valign: 'top', margin: 0 });
    };

    // ── 관계 계열 공통: 노드·간선 배치 ────────────────────────────────────────
    // mode: 'flow' | 'pipeline'(게이트 강조 + 되돌림) | 'loop'(원형 배치)
    const nodesOf = (d) => (d.nodes || []).map(n => ({ ...n, label: String(n.label).replace(/\\n|<br\s*\/?>/gi, '\n') }));
    const edgesOf = (d, ns) => (d.edges && d.edges.length) ? d.edges
                              : ns.slice(1).map((n, i) => ({ from: ns[i].id, to: n.id }));   // 생략 시 순차 체인

    const seg = (s, x1, y1, x2, y2, arrow, color) => s.addShape(pres.shapes.LINE, {
        x: Math.min(x1, x2), y: Math.min(y1, y2),
        w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
        line: { color: color || C.muted, width: 1.25, endArrowType: arrow ? 'triangle' : 'none' },
        flipH: x2 < x1, flipV: y2 < y1 });
    // 간선 라벨은 배경 없이 선 '바깥'에 둔다. 선의 법선 방향으로 밀어내므로 대각선 간선도 겹치지 않는다.
    // (예전에는 흰 배경 상자 1.5in을 선 한가운데 얹어 화살표를 덮었고, 그 다음엔 대각선 선을 라벨이 뚫었다)
    //   dir: 라벨을 밀 방향(+1 아래 / -1 위). 호출부가 그래프의 위/아래를 보고 정한다.
    const eLab = (s, x, y, t, dx = 1, dy = 0, dir = -1) => { if (!t) return;
        // 폭은 실측 + 여유다. 딱 맞춰 잡으면 렌더러의 자간 오차만큼 넘쳐 두 줄로 접힌다(SAFE 1.05를 여기서도 쓴다).
        const w = Math.min(1.70, Math.max(0.60, textW(String(t), F_ELAB) * 1.05 + 0.20)), h = 0.24;   // 상한은 노드 간격(eGap)과 같다
        const L = Math.hypot(dx, dy) || 1;
        let nx = -dy / L, ny = dx / L;                     // 선의 법선
        if ((ny > 0 ? 1 : -1) !== dir) { nx = -nx; ny = -ny; }   // 지정한 쪽(위/아래)으로 뒤집는다
        // 상자는 회전하지 않으므로, 법선 방향 반경 = (w/2)|nx| + (h/2)|ny| 만큼 밀어야 선과 닿지 않는다.
        // 수평선이면 h/2, 기울수록 커진다. 고정 오프셋을 쓰면 대각선에서 라벨 모서리가 선을 스친다.
        // 여기에 숨통(0.12)을 더한다 — 선에 붙으면 읽기 어렵다. (x,y)는 화살표선의 중점이다.
        const off = (w / 2) * Math.abs(nx) + (h / 2) * Math.abs(ny) + 0.12;
        s.addText(t, { x: x + nx * off - w / 2, y: y + ny * off - h / 2, w, h, fontSize: F_ELAB, fontFace: FF,
                       color: C.teal, bold: true, align: 'center', valign: 'middle', margin: 0 }); };
    const nodeBox = (s, r, label, gate) => s.addText(label, { shape: pres.shapes.RECTANGLE,
        x: r.x, y: r.y, w: r.w, h: r.h,
        fill: { color: gate ? C.white : C.navyLight }, line: { color: gate ? C.teal : C.navy, width: 1.25 },
        color: gate ? C.teal : C.navy, bold: true, fontSize: F_HEAD, fontFace: FF,
        align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });

    // flow / pipeline — 레벨 배치(최장 경로). 역방향 간선은 하단 채널로 우회한다.
    const renderChain = (s, d) => {
        const ns = nodesOf(d), edges = edgesOf(d, ns);
        const idx = {}; ns.forEach((n, i) => idx[n.id] = i);
        const H = String(d.dir || 'LR').toUpperCase() !== 'TD';
        const fwd = edges.filter(e => idx[e.to] > idx[e.from]);
        const col = {}; ns.forEach(n => col[n.id] = 0);
        for (let k = 0; k < ns.length; k++) fwd.forEach(e => { if (col[e.to] < col[e.from] + 1) col[e.to] = col[e.from] + 1; });
        const levels = []; ns.forEach(n => { (levels[col[n.id]] = levels[col[n.id]] || []).push(n.id); });
        const L = levels.length, hasBack = edges.length > fwd.length;
        // 노드 블록 + (되돌림) 채널 전체를 밴드 중앙에 둔다.
        const chanH = hasBack ? 0.45 : 0.0;
        const usable = VH - chanH, uMid = VT + usable / 2;
        const widest = Math.max(...levels.map(l => l.length));
        const rowGap = 0.34;
        const mainStart = H ? (LM + 0.10) : (uMid - usable / 2), mainSpan = H ? (CW - 0.20) : usable;
        const mainStep = mainSpan / L;
        // 노드 크기를 먼저 확정한다. 블록 높이를 추정치(가정된 노드 높이)로 잡으면
        // 라벨이 2줄이 되는 순간 실제 블록이 커져 밴드를 벗어난다 → 추정하지 않고 잰다.
        // 간선 라벨이 있으면 노드 간격을 넓힌다 — 라벨이 놓일 자리가 없으면 노드를 침범한다.
        // 간선 라벨이 있으면 노드 간격을 라벨 실폭에 맞춰 넓힌다. 고정값(1.05)으로 잡으면 라벨이 길 때 노드를 침범한다.
        const labW = Math.max(0, ...edges.filter(e => e.label).map(e => textW(String(e.label), F_ELAB) * 1.05 + 0.20));
        const eGap = labW ? Math.min(1.70, Math.max(1.05, labW + 0.30)) : 0.55;
        const nodeW = H ? Math.min(2.25, Math.max(1.10, mainStep - eGap)) : Math.min(2.40, (CW - 0.20) / widest - 0.30);
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW - PAD * 2, F_HEAD), 0);
        const maxLines = Math.max(1, ...ns.map(n => nLines(n.label)));
        const nodeH = Math.min(1.50, Math.max(0.60, 0.34 + maxLines * 0.26));
        const blockH = H ? (widest * nodeH + (widest - 1) * rowGap) : usable;   // 실제 노드 높이로 계산
        const crossStart = H ? (uMid - blockH / 2) : (LM + 0.10);
        const crossSpan = H ? blockH : (CW - 0.20);
        const chan = H ? (crossStart + crossSpan + chanH * 0.55) : (VT + VH - chanH * 0.45);
        // 배치는 blockH를 만든 것과 같은 식(노드 높이 + rowGap)으로 한다.
        // 예전에는 blockH를 rowGap으로 계산해 놓고 배치는 균등 분할로 해서, 실제 간격이 0.17in까지 좁아졌다.
        const R = {}, blockMid = crossStart + crossSpan / 2;
        levels.forEach((lvl, li) => { lvl.forEach((id, ri) => {
            const mainC = mainStart + mainStep * (li + 0.5);
            const lvlH = H ? (lvl.length * nodeH + (lvl.length - 1) * rowGap) : (lvl.length * nodeW + (lvl.length - 1) * 0.24);
            const lvlStart = crossStart + (crossSpan - lvlH) / 2;
            const crossC = H ? (lvlStart + ri * (nodeH + rowGap) + nodeH / 2)
                             : (lvlStart + ri * (nodeW + 0.24) + nodeW / 2);
            const cx = H ? mainC : crossC, cy = H ? crossC : mainC;
            R[id] = { x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH, cx, cy };
        }); });
        edges.forEach(e => {
            const a = R[e.from], b = R[e.to]; if (!a || !b) return;
            const back = idx[e.to] <= idx[e.from];
            if (!back) {
                const x1 = H ? a.x + a.w : a.cx, y1 = H ? a.cy : a.y + a.h, x2 = H ? b.x : b.cx, y2 = H ? b.cy : b.y;
                seg(s, x1, y1, x2, y2, true);
                const my = (y1 + y2) / 2;
                eLab(s, (x1 + x2) / 2, my, e.label, x2 - x1, y2 - y1, my <= blockMid ? -1 : 1);  // 위쪽 간선은 위로, 아래쪽은 아래로
            } else if (H) {                                    // 되돌림 — 노드 블록 아래 채널로 우회
                const x1 = a.cx, y1 = a.y + a.h, x2 = b.cx, y2 = b.y + b.h;
                seg(s, x1, y1, x1, chan, false, C.failT); seg(s, x1, chan, x2, chan, false, C.failT);
                seg(s, x2, chan, x2, y2, true, C.failT); eLab(s, (x1 + x2) / 2, chan, e.label, 1, 0, 1);
            } else {
                const cX = LM + CW - 0.15, y1 = a.cy, y2 = b.cy;
                seg(s, a.x + a.w, y1, cX, y1, false, C.failT); seg(s, cX, y1, cX, y2, false, C.failT);
                seg(s, cX, y2, b.x + b.w, y2, true, C.failT); eLab(s, cX, (y1 + y2) / 2, e.label, 0, 1, -1);
            }
        });
        ns.forEach(n => nodeBox(s, R[n.id], n.label, n.gate));   // 간선 위에 노드를 얹는다
    };

    // loop — 원형 배치 + 타원 노드. 사각형으로 그리면 원형으로 놓아도 순환으로 읽히지 않는다.
    //   대가: 타원은 내접 사각형이 폭의 70%뿐이다 → 라벨 예산이 준다(10pt 기준 한글 8자).
    //   8자를 넘으면 라벨을 잘못 뽑은 것이다(명제가 아니라 문장을 넣고 있다). verify가 오류로 잡는다.
    const LOOP_IN = 0.70;                                   // 타원 내접 폭 비율
    const renderLoop = (s, d) => {
        const ns = nodesOf(d), n = ns.length;
        const edges = (d.edges && d.edges.length) ? d.edges
                    : ns.map((x, i) => ({ from: x.id, to: ns[(i + 1) % n].id }));   // 생략 시 고리로 잇는다
        const nodeW = Math.min(2.40, Math.max(1.60, CW / (n <= 3 ? 3.2 : 3.9)));
        const nLines = (t) => String(t).split('\n').reduce((a, p) => a + lineCount(p, nodeW * LOOP_IN, F_ELAB), 0);
        const nodeH = Math.min(1.30, Math.max(0.80, 0.42 + Math.max(1, ...ns.map(x => nLines(x.label))) * 0.24));
        const cx = LM + CW / 2, cy = VT + VH / 2;
        const rx = Math.min((CW - nodeW) / 2 - 0.10, 3.30);
        const ry = Math.max(0.55, (VH - nodeH) / 2 - 0.06);
        const R = {};
        ns.forEach((x, i) => {
            const th = -Math.PI / 2 + (2 * Math.PI * i) / n;     // 12시에서 시계방향
            const px = cx + rx * Math.cos(th), py = cy + ry * Math.sin(th);
            R[x.id] = { x: px - nodeW / 2, y: py - nodeH / 2, w: nodeW, h: nodeH, cx: px, cy: py };
        });
        // 간선: 노드 경계에서 경계로 직선. 고리가 다각형으로 보인다.
        const trim = (a, b) => {                                  // 중심선을 노드 경계까지 자른다
            const dx = b.cx - a.cx, dy = b.cy - a.cy, L = Math.hypot(dx, dy) || 1;
            const cut = (r) => Math.min(r.w / 2 / (Math.abs(dx) / L || 1e-6), r.h / 2 / (Math.abs(dy) / L || 1e-6));
            const ca = Math.min(cut(a), Math.max(a.w, a.h)) + 0.04, cb = Math.min(cut(b), Math.max(b.w, b.h)) + 0.04;
            return [a.cx + (dx / L) * ca, a.cy + (dy / L) * ca, b.cx - (dx / L) * cb, b.cy - (dy / L) * cb];
        };
        edges.forEach(e => {
            const a = R[e.from], b = R[e.to]; if (!a || !b) return;
            const [x1, y1, x2, y2] = trim(a, b);
            seg(s, x1, y1, x2, y2, true);
            const my = (y1 + y2) / 2;
            eLab(s, (x1 + x2) / 2, my, e.label, x2 - x1, y2 - y1, my <= cy ? -1 : 1);
        });
        ns.forEach(x => { const r = R[x.id];
            s.addText(x.label, { shape: pres.shapes.OVAL, x: r.x, y: r.y, w: r.w, h: r.h,
                fill: { color: C.navyLight }, line: { color: C.navy, width: 1.25 },
                color: C.navy, bold: true, fontSize: F_ELAB, fontFace: FF,
                align: 'center', valign: 'middle', margin: 0 }); });
    };

    // ── 수치 계열 ────────────────────────────────────────────────────────────
    // share — 100% 스택 바. 비례가 곧 메시지다(면적 = 값). 비례는 절대 건드리지 않는다.
    const renderShare = (s, items) => {
        const tot = items.reduce((a, it) => a + Number(it.value), 0) || 100;
        const barW = CW * 0.80, barX = LM + (CW - barW) / 2;   // 화면을 꽉 채우면 큰 조각이 위압한다 → 폭을 줄이고 가운데로
        const barH = Math.min(0.95, Math.max(0.70, VH * 0.30));
        const legLn = items.reduce((a, it) => a + lines(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, CW - 0.60, false), 0);
        const legH = legLn * 0.26 + PAD;
        const h = Math.min(VH, barH + 0.14 + legH);
        const top = VT + (VH - h) / 2;
        let x = barX;
        items.forEach((it, i) => {
            const w = barW * (Number(it.value) / tot), fill = PAL[i % PAL.length];
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h: barH, fill: { color: fill }, line: { color: C.white, width: 1 } });
            // 숫자는 조각 폭을 '재서' 넣는다. 고정 임계로 자르면 들어갈 숫자도 밖으로 밀려난다.
            const txt = `${it.value}%`;
            const fsz = textW(txt, F_NUM) + 0.06 <= w ? F_NUM : (textW(txt, F_IN) + 0.04 <= w ? F_IN : 0);
            if (fsz) s.addText(txt, { x, y: top, w, h: barH, fontSize: fsz, bold: true, fontFace: FF,
                    color: onDark(fill) ? C.white : C.dark, align: 'center', valign: 'middle', margin: 0 });
            x += w;
        });
        // 범례 — 색 조각 + 라벨(+주석). 좁은 조각의 숫자는 여기서 읽힌다.
        const parts = [];
        items.forEach((it, i) => {
            const last = i === items.length - 1;
            parts.push({ text: `■ `, options: { fontSize: F_IN, fontFace: FF, color: PAL[i % PAL.length], paraSpaceBefore: SP } });
            parts.push({ text: `${it.value}% `, options: { fontSize: F_IN, bold: true, fontFace: FF, color: C.dark, paraSpaceBefore: SP } });
            parts.push({ text: it.note ? `${it.label} — ${it.note}` : it.label,
                options: { fontSize: F_IN, fontFace: FF, color: C.dark, breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } });
        });
        // 범례는 '블록을 가운데, 글자는 왼쪽'이다. 여러 줄을 가운데 정렬하면 좌측이 들쭉날쭉해 읽기 어렵다.
        const legW = Math.min(CW, Math.max(...items.map(it =>
            textW(`■ ${it.value}% ${it.label}${it.note ? ' — ' + it.note : ''}`, F_IN))) + 0.20);
        s.addText(parts, { x: LM + (CW - legW) / 2, y: top + barH + 0.10, w: legW, h: h - barH - 0.10,
                           align: 'left', valign: 'top', margin: 0 });
    };

    // magnitude — 자릿수 격차. 면적 비례를 포기하고 계단형으로 그린 뒤 숫자를 병기한다.
    // (1:10:100을 비례로 그리면 1은 1픽셀이 되어 사라지고, 로그 축은 청중이 오독한다.)
    const renderMagnitude = (s, items) => {
        const n = items.length;
        const labW = Math.min(3.00, Math.max(1.60, Math.max(...items.map(it => textW(it.label, F_IN))) + PAD * 2 + 0.10));
        const numW = 1.30, gapX = 0.12;
        const barMax = CW - labW - numW - gapX * 2;
        const gapY = 0.16;
        // 행 높이 상한을 낮게 둔다. 밴드가 남는다고 행을 키우면 그림이 뚱뚱해진다 — 여백은 낭비가 아니다.
        const rowH = Math.min(0.70, Math.max(0.46, (VH - gapY * (n - 1)) / n));
        const blockH = rowH * n + gapY * (n - 1);
        const top = VT + (VH - blockH) / 2;
        items.forEach((it, i) => {
            const y = top + i * (rowH + gapY);
            const w = barMax * ((i + 1) / n);                  // 계단형 — 값이 아니라 순위로 자란다
            const fill = i === n - 1 ? C.navy : (i === 0 ? C.lineL : C.teal);
            s.addText(it.label, { x: LM, y, w: labW, h: rowH, fontSize: F_IN, fontFace: FF, color: C.dark,
                bold: true, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addShape(pres.shapes.RECTANGLE, { x: LM + labW + gapX, y, w, h: rowH,
                fill: { color: fill }, line: { color: C.navy, width: 0.75 } });
            if (it.note && w >= 1.40)
                s.addText(it.note, { x: LM + labW + gapX, y, w, h: rowH, fontSize: F_IN, fontFace: FF,
                    color: onDark(fill) ? C.white : C.dark, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(`${it.value}${it.unit || ''}`, { x: LM + labW + gapX + w + gapX, y, w: numW, h: rowH,
                fontSize: F_NUM, bold: true, fontFace: FF, color: C.navy, align: 'left', valign: 'middle', margin: 0 });
        });
    };

    // pyramid — 폭이 곧 양인 계층. items[0]이 꼭대기(좁은 층)다.
    const renderPyramid = (s, items) => {
        const n = items.length, gapY = 0.10;
        const rowH = Math.min(0.92, Math.max(0.46, (VH - gapY * (n - 1)) / n));
        const blockH = rowH * n + gapY * (n - 1);
        const top = VT + (VH - blockH) / 2;
        const wMin = CW * 0.26, wMax = CW * 0.66, cx = LM + CW / 2;
        items.forEach((it, i) => {
            const w = n === 1 ? wMax : wMin + (wMax - wMin) * (i / (n - 1));
            const y = top + i * (rowH + gapY), x = cx - w / 2;
            const fill = PAL[i % PAL.length];
            s.addText(it.label, { shape: pres.shapes.RECTANGLE, x, y, w, h: rowH,
                fill: { color: fill }, line: { color: C.navy, width: 1 },
                color: onDark(fill) ? C.white : C.dark, bold: true, fontSize: F_HEAD, fontFace: FF,
                align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            if (it.note) {                                     // 주석은 층 오른쪽 여백에 붙인다
                const nx = x + w + 0.12, nw = LM + CW - nx;
                if (nw > 1.0) s.addText(it.note, { x: nx, y, w: nw, h: rowH, fontSize: F_IN, fontFace: FF,
                    color: C.muted, align: 'left', valign: 'middle', margin: 0 });
            }
        });
    };

    // quadrant — 두 축의 사분면. 축이 사라지면 의미가 사라지므로 축 라벨을 반드시 그린다.
    const renderQuadrant = (s, d) => {
        const axX = 0.30, axY = 0.42;                          // 축 라벨이 쓰는 여백(좌·하)
        const gw = CW - axY - 0.06, gh = Math.min(VH - axX - 0.06, 4.30);   // 밴드를 최대한 쓴다 — 칸이 좁으면 문장이 명사구로 깎인다
        const top = VT + (VH - (gh + axX)) / 2;
        const left = LM + axY;
        const gap = 0.10, cw = (gw - gap) / 2, ch = (gh - gap) / 2;
        const pos = { TL: [0, 0], TR: [1, 0], BL: [0, 1], BR: [1, 1] };
        (d.cells || []).forEach(c => {
            const p = pos[String(c.at).toUpperCase()] || [0, 0];
            const x = left + p[0] * (cw + gap), y = top + p[1] * (ch + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            s.addText(c.title, { x, y, w: cw, h: 0.40, fill: { color: C.navy }, color: C.white, bold: true,
                fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            if (c.body) s.addText(Array.isArray(c.body)
                ? c.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark,
                    bullet: { indent: 10 }, breakLine: k < c.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } }))
                : c.body,
                { x, y: y + 0.40, w: cw, h: ch - 0.40, fontSize: F_IN, fontFace: FF, color: C.dark,
                  align: 'left', valign: 'top', margin: [MG, MG, MG, MG] });
        });
        // x축: 한 줄을 3등분한다(왼쪽=low, 가운데=축 이름, 오른쪽=high). 셋을 같은 폭에 겹쳐 그리면 글자가 포개진다.
        const ax = (t, o) => { if (t) s.addText(t, { fontSize: F_CAP, fontFace: FF, color: C.muted, margin: 0, ...o }); };
        const t3 = gw / 3, ay = top + gh + 0.02;
        ax(`◀ ${d.x?.low || ''}`, { x: left, y: ay, w: t3, h: axX, align: 'left', valign: 'middle' });
        ax(d.x?.label, { x: left + t3, y: ay, w: t3, h: axX, align: 'center', valign: 'middle', bold: true });
        ax(`${d.x?.high || ''} ▶`, { x: left + 2 * t3, y: ay, w: t3, h: axX, align: 'right', valign: 'middle' });
        // y축: 회전 라벨은 상자 중심을 기준으로 돌아간다 → 좌측 여백의 중심(yCx)에 상자 중심을 맞춘다.
        const yCx = LM + axY / 2, yBoxW = Math.max(0.60, Math.min(ch, 2 * (yCx - 0.02)));
        const yAx = (t, cy) => { if (t) ax(t, { x: yCx - yBoxW / 2, y: cy - 0.15, w: yBoxW, h: 0.30, align: 'center', valign: 'middle', rotate: 270 }); };
        yAx(d.y?.high, top + ch / 2);
        yAx(d.y?.low, top + ch + gap + ch / 2);
    };

    // ===== 프론트매터 모듈 (도메인 독립: 세션1 커버/전체목차/세션목차, 세션2+ 세션목차) =====
    const addCover = () => {
        const s = pres.addSlide(); s.background = { color: C.navy };
        s.addText(DECK.book.title, { x: LM, y: 2.2, w: CW, h: 0.8, fontSize: 32, fontFace: FF, color: C.white, bold: true, align: 'center', margin: 0 });
        s.addShape(pres.shapes.LINE, { x: 3.50, y: 3.2, w: 3.0, h: 0, line: { color: C.white, width: 1.5 } });  // 중심 5.00
        s.addText(DECK.book.subtitle, { x: LM, y: 3.5, w: CW, h: 0.5, fontSize: 16, fontFace: FF, color: C.white, align: 'center', margin: 0 });
    };
    // 과정 목차: 1열로 쌓는다. 2열로 나누면 열 폭이 좁아 제목이 줄바꿈되고 목록이 지저분해진다.
    // 그룹(일자) 라벨의 'Day N —' 접두어는 벗기고 유형 제목만 남긴다(PPT 표기에 Day/세션 단어를 쓰지 않는다).
    // 세션 번호는 데이터가 아니라 위치에서 나온다 → day 순서 × items 순서 = 전역 세션 번호, 로마자로 붙인다.
    // 데이터에 번호가 이미 붙어 있어도(01. / 1) / I.) 벗기고 다시 붙인다. 번호 체계는 엔진 한 곳에서만 정한다.
    // 번호 접두어를 벗긴다. 'Session 01.' / '세션 01.' 형태도 함께 벗긴다(PPT 표기에 그 단어를 쓰지 않는다).
    const stripNo  = (t) => String(t)
        .replace(/^\s*(?:Session|세션)\s*\d+\s*[.):-]?\s*/i, '')
        .replace(/^\s*(?:[IVXLC]+|\d+)\s*[.)]\s*/i, '');
    const stripDay = (t) => String(t).replace(/^\s*Day\s*\d+\s*[—\-:.]?\s*/i, '').trim();
    // 목록 블록은 내용 폭에 맞춰 잡고 가운데(살짝 왼쪽)에 놓는다. 글자는 왼쪽 정렬 — 그래야 번호가 세로로 선다.
    const listBlock = (rows, fs) => {
        const w = Math.max(...rows.map(r => textW(r, fs))) + 0.70;   // 가로 여유(글자 좌우 숨통)
        return { w: Math.min(CW, w), x: LM + Math.max(0, (CW - Math.min(CW, w))) * 0.40 };
    };
    const addFullToc = (pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        hdr(s, `과정 목차`); ftr(s, pg, '');   // 과정 목차는 특정 세션에 귀속되지 않는다 → 세션 표기 없음
        const cur = DECK.curriculum;
        const flat = [];                        // [그룹 라벨 | 세션 항목] 한 줄씩
        let sno = 0;
        cur.forEach(d => {
            flat.push({ group: stripDay(d.day) });
            d.items.forEach(t => flat.push({ no: ++sno, title: stripNo(t) }));
        });
        // 밴드를 넓게 쓴다: 구분선(0.80) 아래 한 줄 ~ 페이지 번호 위 한 줄.
        // 세로를 늘리면 규격(줄 전후 3pt)을 지키면서도 14pt가 들어간다 — 폰트를 낮출 이유가 없어진다.
        const BAND = 5.95, y0 = 1.00;
        // 줄 간격은 전 슬라이드 공통 규격(SP = 3pt 전후)을 그대로 쓴다. 목차만 예외를 두지 않는다.
        // 항목이 많으면 그때 폰트를 낮춘다. 잘라내지 않는다 — 목차는 전체가 보여야 목차다.
        let fs = F_BODY, need;
        for (const f of [F_BODY, 13, 12, 11, 10]) {
            fs = f;
            need = flat.length * (f / 72 * 1.25 + 2 * SP / 72);   // 줄 높이 + 문단 전후 간격
            if (need <= BAND) break;
        }
        const rows = flat.map(r => r.group ? r.group : `${r.no}. ${r.title}`);
        const B = listBlock(rows, fs);
        const parts = [];
        flat.forEach((r, i) => {
            const last = i === flat.length - 1;
            // 문단 간격은 전 슬라이드 공통 규격(SP = 3pt)이다. 여기만 다른 값을 쓰면 규격이 무너진다.
            if (r.group) parts.push({ text: r.group, options: { bold: true, fontSize: fs, fontFace: FF, color: C.navy,
                breakLine: !last, paraSpaceBefore: SP, paraSpaceAfter: SP } });
            else {
                parts.push({ text: `${r.no}. `, options: { bold: true, fontSize: fs, fontFace: FF, color: C.navy,
                    paraSpaceBefore: SP, paraSpaceAfter: SP } });
                parts.push({ text: r.title, options: { fontSize: fs, fontFace: FF, color: C.dark, breakLine: !last,
                    paraSpaceBefore: SP, paraSpaceAfter: SP } });
            }
        });
        s.addText(parts, { x: B.x, y: y0, w: B.w, h: BAND, align: 'left', valign: 'top', margin: 0 });
    };

    const addSessionToc = (pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        hdr(s, `${RN}. ${DECK.session.title} 목차`); ftr(s, pg, SF);   // 세션 번호(1.) vs 슬라이드 연번(01.)
        const B = listBlock((DECK.session.toc || []).map(([n, t]) => `${n}. ${t}`), F_BODY);
        s.addText(tocT(DECK.session.toc), { x: B.x, y: 1.12, w: B.w, h: 5.62, align: 'left', valign: 'top', margin: 0 });
    };
    // 세션 번호로 분기 렌더링 후, 소비한 페이지 수(본문 시작 오프셋)를 반환한다.
    const addFrontMatter = () => {
        if (DECK.session.no === 1) { addCover(); addFullToc(2); addSessionToc(3); return 3; } // 커버=p1(표기없음)/전체목차=p2/세션목차=p3
        addSessionToc(1); return 1;                                                           // 세션목차=p1
    };

    // ===== 본문 렌더러 (도메인 독립: 슬라이드 스펙 → 시각화) =====
    // 스펙: { head|kind, sub?, question?, lead?{label,text}, intro?, visual?, quote?, foot }
    // visual.type ∈ TYPES (항목: boxes|table|steps|versus|takeaways · 단문: statement
    //                  · 관계: flow|pipeline|loop · 수치: share|magnitude|pyramid|quadrant)
    const buildIntro = (intro) => sec(intro.title, C.navy, intro.items.map(([label, text]) => [
        { text: label + ': ', options: { bold: true, color: C.dark } },
        { text }
    ]));
    const toTable = (rows) => rows.map((row, r) => row.map((cell, c) =>
        r === 0 ? hC(cell) : td(cell, c === 0 ? { bold: true } : {})));

    // 질문 + 리드(라벨 문장) — 정본 패턴: 모든 본문 슬라이드 상단
    // 질문 + 리드를 하나의 배경 밴드에 내장한다(독립 텍스트 개체를 만들지 않는다).
    const addContext = (s, q, lead) => {
        const parts = []; let ln = 0;
        if (q) { parts.push({ text: q, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.navy, breakLine: !!lead, paraSpaceAfter: SP } }); ln += lines(q, CW, false, F_BODY); }
        if (lead) {
            parts.push({ text: lead.label + `: `, options: { bold: true, fontSize: F_BODY, fontFace: FF, color: C.teal, paraSpaceBefore: SP } });
            parts.push({ text: lead.text, options: { fontSize: F_BODY, fontFace: FF, color: C.dark, paraSpaceBefore: SP } });
            ln += lines(lead.label + ': ' + lead.text, CW, false, F_BODY);
        }
        if (!parts.length) return CTX_TOP;
        const h = Math.max(0.52, ln * 0.28 + PAD * 2 + 0.10);
        s.addText(parts, { shape: pres.shapes.RECTANGLE, x: LM, y: CTX_TOP, w: CW, h,
            fill: { color: C.navyLight }, line: { color: C.lineL, width: 0.75 },
            align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
        return CTX_TOP + h;
    };

    // steps: 번호 진행 박스 (절차·국면의 순차 전개)
    const renderSteps = (s, items) => {
        const n = items.length, gap = n > 4 ? 0.10 : 0.16, w = (CW - gap * (n - 1)) / n;
        // 높이: 제목 1줄 + 본문 줄 수 (0.2cm 여백 포함). 밴드를 넘으면 밴드에 맞춰 자른다.
        const need = 0.42 + Math.max(...items.map(it => textH(it.body.reduce((a, t) => a + lines(t, w), 0), it.body.length))) + SLACK;
        const h = Math.min(VH, need);
        const top = VT + (VH - h) / 2;                     // 밴드 수직 중앙
        const fT = F_HEAD, fB = F_IN;
        items.forEach((it, i) => {
            const x = LM + i * (w + gap);
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: C.navy, width: 1.25 } });
            // 제목 헤더 — box에 내장(12 bold)
            s.addText(`${i + 1}. ${it.title}`, { x, y: top, w, h: 0.42, fill: { color: C.navy }, color: C.white, bold: true, fontSize: fT, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            // 본문 — box에 내장(12), 문장 간 전후 3pt
            s.addText(it.body.map((t, k) => ({ text: t, options: { fontSize: fB, fontFace: FF, color: C.dark, bullet: { indent: 10 }, breakLine: k < it.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + 0.42, w, h: h - 0.42, valign: 'top', margin: [MG, MG, MG, MG] });
        });
        // 진행 화살표는 그리지 않는다 — 순서는 제목의 번호(1. 2. 3. …)로만 표기한다.
    };

    // versus: 2열 대비 (좌=대비 대상, 우=지향 대상)
    const renderVersus = (s, data) => {
        const cols = data, n = cols.length, gap = 0.30, w = (CW - gap * (n - 1)) / n;
        const need = Math.max(...cols.map(c => textH(c.body.reduce((a, t) => a + lines(t, w, 12), 0), c.body.length)));
        const h = Math.min(VH, 0.44 + need + SLACK);
        const top = VT + (VH - h) / 2;
        cols.forEach((c, i) => {
            const x = LM + i * (w + gap);
            const neg = c.negative !== undefined ? c.negative : (i === 0 && n === 2);   // 기본: 2열일 때 좌=대비
            const bar = neg ? C.failT : C.teal;
            s.addShape(pres.shapes.RECTANGLE, { x, y: top, w, h, fill: { color: C.white }, line: { color: bar, width: 1.25 } });
            s.addText(c.title, { x, y: top, w, h: 0.44, fill: { color: bar }, color: C.white, bold: true, fontSize: F_HEAD, fontFace: FF, align: 'center', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(c.body.map((t, k) => ({ text: t, options: { fontSize: F_IN, fontFace: FF, color: C.dark, bullet: { indent: 12 }, breakLine: k < c.body.length - 1, paraSpaceBefore: SP, paraSpaceAfter: SP } })), { x, y: top + 0.44, w, h: h - 0.44, valign: 'top', margin: [MG, MG, MG, MG] });
        });
    };

    // statement: 단문 슬라이드 — 한 문장만 크게 보여준다.
    //   교재의 모든 장이 같은 밀도(질문+리드+시각화+결론)면 강조가 사라진다. 호흡을 만드는 장이다.
    //   질문·리드·결론이 없다(계약이 예외를 판다). 대신 문장 하나가 슬라이드 전체를 쓴다.
    //   인용이면 영문 원문·저자를 10pt로 아래에 붙인다. 근거·한계는 caption, 나머지는 강사 노트로 간다.
    //   세 개체는 성격이 다르다 — 크기로 구분한다.
    //     text/quote.ko  20pt  이 슬라이드가 하려는 말
    //     note           14pt  해설. 그 말이 무슨 뜻인지(본문과 같은 크기다 — 각주가 아니다)
    //     quote.en/저자  10pt  원문·출처
    //     caption         8pt  근거·한계만. 해설을 여기 넣지 않는다(그러면 논지가 각주로 강등된다).
    //   그림은 넣지 않는다. 단문의 힘은 비어 있음에서 나온다 — 채우면 5단 슬라이드로 되돌아간다.
    const renderStatement = (s, v) => {
        const av = CW - 1.20;                              // 좌우 여백을 크게 준다 — 여백이 강조를 만든다
        // 문장은 text가 우선이다(우리말 명제). text가 없으면 인용 원문(ko)을 그대로 띄운다.
        const q = v.quote;
        const text = v.text ? String(v.text) : (q && q.ko ? `\u201C${q.ko}\u201D` : '');
        const tl = lineCount(text, av, F_STMT);
        // 인용을 근거로 한 메시지는 영문 원문 · 저자 · 출처가 따라붙는다(10pt). 이것이 인용 메시지의 기본형이다.
        // 출처는 자산에서 끌어온다 — 생성기가 쓰지 않으므로 지어낼 수 없다.
        const asset = q && q.id ? ASSETS.get(q.id) : null;
        const by = q ? `— ${q.author}${asset && asset.src ? `, ${asset.src.split(/[(—]/)[0].trim()}` : ''}` : '';
        const srcTxt = q ? `${q.en}\n${by}` : (v.source || '');
        const sl = srcTxt ? srcTxt.split('\n').reduce((a, p) => a + lineCount(p, av, F_SRC), 0) : 0;
        const nl = v.note ? lineCount(String(v.note), av, F_BODY) : 0;
        const tH = tl * 0.34, sH = sl ? sl * 0.20 + 0.10 : 0, nH = nl ? nl * 0.26 : 0;
        // 밴드에 고르게 나눈다: 위 여백 · 문장(+원문) · 사이 여백 · 해설 · 아래 여백.
        // 가운데로 몰면 위아래가 텅 비고 글이 한 덩어리로 뭉친다.
        const gap = Math.max(0.24, (VH - (tH + sH + nH)) / 3);
        const y1 = VT + gap;
        s.addText(text, { x: LM + 0.60, y: y1, w: av, h: tH, fontSize: F_STMT, bold: true, fontFace: FF,
                          color: C.navy, align: 'center', valign: 'middle', margin: 0 });
        if (srcTxt) s.addText(srcTxt, { x: LM + 0.60, y: y1 + tH + 0.10, w: av, h: sH - 0.10, fontSize: F_SRC, fontFace: FF,
                          color: C.muted, align: 'center', valign: 'top', margin: 0 });
        if (nl) s.addText(String(v.note), { x: LM + 0.60, y: y1 + tH + sH + gap, w: av, h: nH,
                          fontSize: F_BODY, fontFace: FF, color: C.dark, align: 'center', valign: 'top',
                          paraSpaceBefore: SP, paraSpaceAfter: SP, margin: 0 });
    };

    // takeaways: 세션 요약 번호 리스트 (요약 슬라이드 전용)
    const renderTakeaways = (s, items) => {
        const n = items.length, gap = n >= 5 ? 0.08 : 0.12;
        const hRaw = Math.max(...items.map(it => textH(lines(it.body, CW - 3.2, false), 1))) + SLACK;
        const h = Math.min((VH - gap * (n - 1)) / n, Math.max(0.52, hRaw));
        const blockH = h * n + gap * (n - 1);
        const top = VT + (VH - blockH) / 2;
        items.forEach((it, i) => {
            const y = top + i * (h + gap);
            s.addShape(pres.shapes.RECTANGLE, { x: LM, y, w: CW, h, fill: { color: C.white }, line: { color: C.lineL, width: 0.75 } });
            s.addText(`${i + 1}. ${it.title}`, { x: LM, y, w: 2.85, h, fill: { color: C.navyLight }, fontSize: F_HEAD, fontFace: FF, color: C.navy, bold: true, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
            s.addText(it.body, { x: LM + 2.85, y, w: CW - 2.85, h, fontSize: F_IN, fontFace: FF, color: C.dark, align: 'left', valign: 'middle', margin: [MG, MG, MG, MG] });
        });
    };

    const renderBody = (slide, pg) => {
        const s = pres.addSlide(); s.background = { color: C.white };
        // 헤더 연번: 본문 슬라이드 위치 기반 순차 번호(01부터). 분류(kind)는 데이터에만 남고 헤더에 찍지 않는다.
        // head를 직접 지정한 슬라이드(요약)도 번호를 받는다 → 'NN. {head}'.
        const seq = DECK.session.slides.indexOf(slide) + 1;
        const head = `${String(seq).padStart(2, '0')}. ${slide.head || slide.title}`;
        hdr(s, head); ftr(s, pg, SF);
        const v = slide.visual;
        const free = v && FREE.includes(v.type);            // statement — 5단 골격을 쓰지 않는다
        if (slide.sub && !free) sub(s, slide.sub);   // statement는 헤더 아래 한 줄을 두지 않는다(한 문장이 전부다)
        // 질문/리드 밴드를 그리고 그 하단 y를 받는다.
        const ctxBottom = (free ? CTX_TOP : (addContext(s, slide.question, slide.lead) || CTX_TOP));
        if (slide.intro) s.addText(buildIntro(slide.intro), { x: LM, y: Y_START, w: CW, h: 1.0, valign: 'top', margin: 0 });
        // 시각화 밴드 = 문맥 밴드 마지막 라인 아래 ~ 하단 수평선 위. 인용이 있으면 그만큼 위로 줄인다.
        const QH = slide.quote ? quoteH(slide.quote.ko, slide.quote.en, slide.quote.author) + 0.04 : 0;
        VT = free ? (ctxBottom + 0.10) : (ctxBottom + 0.16);
        VH = Math.max(0.8, ((free ? Y_LINE - 0.20 : VB) - QH) - VT);   // statement는 하단 결론이 없으니 밴드를 더 쓴다
        // caption(출처·한계)은 밴드에서 자기 몫을 먼저 가져간다 → 시각화가 caption을 덮지 않는다.
        if (v && v.caption) VH = Math.max(0.8, VH - capH(v.caption));
        if (v) {
            if (v.type === 'boxes') renderAutoBoxes(s, 'auto', v.data);
            else if (v.type === 'table') autoTable(s, 'auto', toTable(v.data));
            else if (v.type === 'steps') renderSteps(s, v.data);
            else if (v.type === 'versus') renderVersus(s, v.data);
            else if (v.type === 'takeaways') renderTakeaways(s, v.data);
            else if (v.type === 'statement') renderStatement(s, v);
            else if (v.type === 'flow' || v.type === 'pipeline') renderChain(s, v.data);
            else if (v.type === 'loop') renderLoop(s, v.data);
            else if (v.type === 'share') renderShare(s, v.data);
            else if (v.type === 'magnitude') renderMagnitude(s, v.data);
            else if (v.type === 'pyramid') renderPyramid(s, v.data);
            else if (v.type === 'quadrant') renderQuadrant(s, v.data);
            if (v.caption) addCaption(s, v.caption);
        }
        if (slide.quote && !free) addQuote(s, slide.quote.ko, slide.quote.en, slide.quote.author);
        if (!free) {
            dL(s, Y_LINE);
            s.addText([...K(slide.foot.kw, C[slide.foot.color] || C.navy, slide.foot.body)], { x: LM, y: Y_BOT, w: CW, h: 1.0, valign: 'top', margin: 0 });
        }
        addNotes(s, slide);
    };

    // 강사 노트 — 데이터의 notes + 인용 출처·URL(엔진이 자산에서 끌어온다).
    // 생성기는 URL을 쓰지 않는다 → 지어낼 수 없다. 인용 id 하나로 출처가 따라온다.
    const addNotes = (s, slide) => {
        const parts = [];
        if (slide.notes) parts.push(String(slide.notes).trim());
        const q = slide.quote || (slide.visual && slide.visual.quote);
        const tail = q && q.id ? noteTail(ASSETS.get(q.id)) : '';
        if (tail) parts.push(tail);
        if (parts.length) s.addNotes(parts.join('\n\n'));
    };

    // ===== 자가 점검(lint): 치명(FATAL)이면 중단하고, 경고(WARN)면 진행한다 =====
    // 기능이 "사라지는" 원인은 엔진이 아니라 데이터의 필드 누락이다. 렌더 전에 잡는다.
    //   치명 : 산출물이 계약을 위반한다 → pptx를 만들지 않는다(피드백 루프에서 놓치는 것을 막는다).
    //   경고 : 품질이 떨어질 뿐 산출물은 성립한다 → 출력하고 진행한다.
    //   --draft : 치명을 경고로 강등해 초안을 렌더한다. 파일명에 _DRAFT가 붙어 최종본과 섞이지 않는다.
    const DRAFT = process.argv.includes('--draft');
    const TYPES = ['boxes', 'table', 'steps', 'versus', 'takeaways', 'statement',
                   'flow', 'pipeline', 'loop', 'share', 'magnitude', 'pyramid', 'quadrant'];
    const FREE = ['statement'];      // 5단 골격(question/lead/foot)을 요구하지 않는 타입
    const NUMERIC = ['share', 'magnitude'];
    const lint = () => {
        const S = DECK.session.slides, fatal = [], warn = [];
        // 인용 4필드(id/ko/en/author) 중 하나라도 없으면 대조가 불가능하거나 undefined가 찍힌다 → 치명
        const qBad = (q) => !q || !q.id || !q.ko || !q.en || !q.author;
        const used = new Map();                       // 인용 id → 사용한 슬라이드 번호(세션 내 중복 금지)
        // 시각화 트리거 — 엔진이 아는 것은 '형태'뿐이다(언어·도메인 무관).
        //   어휘 트리거는 도메인 자산이므로 데이터(meta.visualTriggers)에서 주입받는다.
        const VTRIG = (DECK.meta && DECK.meta.visualTriggers) || {};
        const claim = (sl) => [sl.sub, sl.question, sl.lead && sl.lead.text, sl.foot && sl.foot.body].filter(Boolean).join(' ');
        const hasRatio = (t) => /\d+\s*:\s*\d+/.test(t) || (t.match(/\d+\s*%/g) || []).length >= 2;

        S.forEach((sl, i) => {
            const id = sl.head || `${sl.kind} — ${sl.title}`, tag = `슬라이드 ${i + 1} (${id})`;
            const free = sl.visual && FREE.includes(sl.visual.type);
            // statement는 5단 골격을 쓰지 않는다 — question/lead/foot을 요구하지 않는다(계약 예외).
            (free ? [] : ['sub', 'question', 'lead', 'foot']).forEach(f => { if (!sl[f]) fatal.push(`${tag}: ${f} 누락`); });
            if (free && !(sl.visual.text || (sl.visual.quote && sl.visual.quote.ko)))
                fatal.push(`${tag}: statement에 text도 quote도 없다 — 보여줄 문장이 없다`);
            // 강사 노트는 모든 본문 슬라이드에 쓴다. 슬라이드에 넣지 않은 것(질문·반론·시간 배분)이 여기 남는다.
            // 개수가 아니라 존재만 본다 — 길이 하한은 두지 않는다(그건 쿼터이고, 쿼터는 채우기를 부른다).
            if (!sl.notes) warn.push(`${tag}: notes(강사 노트)가 없다 — 던질 질문·흔한 반론·시간 배분을 남긴다`);
            const qs = [sl.quote, sl.visual && sl.visual.quote].filter(Boolean);
            qs.forEach((q, k) => {
                if (qBad(q)) fatal.push(`${tag}: 인용 ${k + 1}번에 id/ko/en/author 중 누락 — 인용은 자산 id와 함께 적는다`);
                if (q.id) {                            // 같은 세션 안에서의 중복은 금지(세션 간 재사용은 허용)
                    const prev = used.get(q.id);
                    if (prev === i + 1) fatal.push(`${tag}: 인용 '${q.id}'를 같은 슬라이드에서 두 번 쓴다 — 오버레이와 전용 슬라이드에 같은 인용을 넣지 않는다`);
                    else if (prev) fatal.push(`${tag}: 인용 '${q.id}'가 슬라이드 ${prev}에서 이미 쓰였다 — 같은 세션 내 중복 금지`);
                    else used.set(q.id, i + 1);
                }
            });
            const v = sl.visual;
            if (v) {
                if (!TYPES.includes(v.type)) fatal.push(`${tag}: 알 수 없는 visual.type '${v.type}'`);
                if (NUMERIC.includes(v.type) && !v.caption)
                    warn.push(`${tag}: ${v.type}에 caption이 없다 — 숫자를 명제로 올렸으면 출처·한계를 밝힌다`);
            }
            // 트리거: 명제 자리(sub/question/lead/foot)에 신호가 있는데 시각화가 그것을 그리지 않는다.
            // 오탐은 반드시 난다 → 오류가 아니라 경고이고, visualNote로 사유를 남기면 꺼진다.
            if (!sl.visualNote) {
                const t = claim(sl), ty = v && v.type;
                if (hasRatio(t) && !NUMERIC.includes(ty))
                    warn.push(`${tag}: 명제에 비율·배수가 있는데 시각화가 '${ty || '없음'}'이다 — share/magnitude를 검토한다 (근거 수치일 뿐이면 visualNote에 사유를 남긴다)`);
                Object.entries(VTRIG).forEach(([type, words]) => {
                    if ((words || []).some(w => t.includes(w)) && ty !== type)
                        warn.push(`${tag}: 명제가 '${type}' 신호를 담고 있는데 시각화가 '${ty || '없음'}'이다 — ${type}을 검토한다`);
                });
            }
        });
        if (!S.some(sl => sl.kind === '학습 목표')) fatal.push(`학습 목표 슬라이드(kind:'학습 목표')가 없다`);
        // 분류별 최소 1장 — 단, '인용'은 뺀다. 인용은 자산이 있을 때만 성립하며 개수를 강제하지 않는다.
        // statement로는 분류 요건을 채울 수 없다. 명제만 던지고 논증이 없는 장으로 분류를 때우면 교재가 빈다.
        const arg = (sl) => !(sl.visual && FREE.includes(sl.visual.type));
        ['현상', '원인', '원칙', '적용', '타협'].forEach(k => {
            if (!S.some(sl => sl.kind === k && arg(sl))) fatal.push(`분류 '${k}'의 논증 슬라이드가 없다 — statement(단문)는 분류 요건을 채우지 못한다`);
        });
        // 아래는 경고 — 산출물은 성립하지만 정본 규격에서 벗어난다.
        if (S.length < 12 || S.length > 17) warn.push(`본문 ${S.length}장 — 권장 12~17장을 벗어났다`);
        const nStmt = S.filter(sl => sl.visual && FREE.includes(sl.visual.type)).length;
        if (nStmt > 3) warn.push(`statement(단문) ${nStmt}장 — 2~3장이 적정하다. 인용 하나에 단문 한 장씩 만들고 있는지 점검한다(인용의 기본 자리는 논증 슬라이드의 quote 오버레이다)`);
        const nVis = S.filter(sl => sl.visual && ['table', 'boxes'].includes(sl.visual.type)).length;
        const nAll = S.filter(sl => sl.visual && !FREE.includes(sl.visual.type)).length;
        if (nAll && nVis / nAll > 0.6) warn.push(`시각화의 ${Math.round(nVis / nAll * 100)}%가 table/boxes다 — 관계·수치 타입을 회피하고 있는지 점검한다`);

        if (warn.length) { console.log('[경고] 진행하되 확인이 필요하다:'); warn.forEach(w => console.log('   - ' + w)); }
        if (fatal.length) {
            console.log(DRAFT ? '[치명→강등] --draft 이므로 진행한다:' : '[치명] 계약 위반:');
            fatal.forEach(f => console.log('   - ' + f));
            if (!DRAFT) {
                console.error(`[중단] 치명 ${fatal.length}건 — pptx를 생성하지 않는다. 수정 후 다시 실행한다. (초안 확인만 필요하면 --draft)`);
                process.exit(1);
            }
        }
        if (!fatal.length && !warn.length) console.log('[점검] 필수 항목 이상 없음');
    };
    lint();

    // ===== 실행: 프론트매터 → 본문 순차 렌더 (페이지는 러닝 카운터로 자동 보정) =====
    let pg = addFrontMatter();
    // 본문 연번은 renderBody가 slides 배열의 위치로 스스로 매긴다(학습 목표=01부터 순차).
    // 여기서 따로 세지 않는다 — 두 곳에서 세면 반드시 어긋난다.
    for (const slide of DECK.session.slides) renderBody(slide, ++pg);

    const fileName = `Course_Session${NN}_Output${DRAFT ? '_DRAFT' : ''}.pptx`;
    await pres.writeFile({ fileName })
        .then(f => console.log(`[성공] ${f} 생성 완료 (총 ${pg}p)`))
        .catch(e => console.error(`[오류] 생성 실패:`, e));
}

module.exports = buildDeck;
if (require.main === module) buildDeck(require(process.argv[2] || './01.js'));
