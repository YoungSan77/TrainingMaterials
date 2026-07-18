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
 *   [치명] sub/question/lead/foot 누락(statement는 없음 — 골격 예외) · 인용 4필드(id/ko/en/author) 누락 ·
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

// ── 아래는 오케스트레이터(얇은 배선). 실제 렌더 로직은 engine/render/{context,primitives,visuals,pages,lint}.js. ──
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const measure = require('./measure.js');                          // 폭 모델 단일 소스
const QA = require('./quotes.js');                                // 인용 자산 파서(verify와 공유)
const skeleton = require('./skeleton.js');                        // 골격 규칙 단일 소스(verify와 공유)
const makeCtx        = require('./render/context.js');
const makePrimitives = require('./render/primitives.js');
const makeVisuals    = require('./render/visuals.js');
const makePages      = require('./render/pages.js');
const makeLint       = require('./render/lint.js');

async function buildDeck(DECK) {
    console.log('[가동] 렌더 엔진 시작...');
    const pres = new pptxgen(); pres.layout = 'LAYOUT_4x3';

    // 인용 자산 — 경로는 데이터가 선언한다(meta.quotes). 자산이 없으면 빈 맵.
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

    const DRAFT = process.argv.includes('--draft');

    // ── ctx 조립: context가 substrate(상수·헬퍼·band)를 만들고, 각 층을 순서대로 얹는다.
    //    primitives → visuals → pages 순(하위 층이 상위 산출을 ctx에서 받는다).
    const ctx = makeCtx(DECK, { pres, ASSETS, measure, noteTail, skeleton });
    ctx.DRAFT = DRAFT;
    Object.assign(ctx, makePrimitives(ctx));
    Object.assign(ctx, makeVisuals(ctx));
    Object.assign(ctx, makePages(ctx));
    const { lint } = makeLint(ctx);
    const { NN, addFrontMatter, renderBody } = ctx;

    lint();

    // ===== 실행: 프론트매터 → 본문 순차 렌더 (페이지는 러닝 카운터로 자동 보정) =====
    let pg = addFrontMatter();
    for (const slide of DECK.session.slides) renderBody(slide, ++pg);

    // 산출 위치: --out 우선 → meta.outDir(과정 폴더 out/) → cwd.
    const outArg = process.argv.indexOf('--out');
    const outDir = (outArg >= 0 && process.argv[outArg + 1]) || (DECK.meta && DECK.meta.outDir) || process.cwd();
    fs.mkdirSync(outDir, { recursive: true });
    const fileName = `Course_Session${NN}_Output${DRAFT ? '_DRAFT' : ''}.pptx`;
    await pres.writeFile({ fileName: path.join(outDir, fileName) })
        .then(f => console.log(`[성공] ${f} 생성 완료 (총 ${pg}p)`))
        .catch(e => console.error(`[오류] 생성 실패:`, e));
}

module.exports = buildDeck;
if (require.main === module) buildDeck(require('./load_deck.js')(process.argv[2] || './01.js'));
