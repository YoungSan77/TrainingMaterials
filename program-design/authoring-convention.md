# 6과정 공통 저작 규약
> 버전: v0.9 (§3-c 신설 — 3자 역할과 경계원칙, concept-ownership-map.md §R&R 미러)

> **이 문서는 결정만 담는다. 미결정은 결함 목록으로(`open-issues.md`).**

> 이 문서는 OOAD·SW 아키텍처·DDD·MSA·AI-assisted·Agentic 여섯 과정이 공통으로 따르는 저작 계약이다.
> 개별 과정의 목차·실습은 `*-curriculum.md`·`*-lab-design.md`가 갖고, 여긴 **여섯 과정을 관통하는 것만** 정한다.
> QM `guides/`의 자매 문서다 — 같은 문제의식(측정 안 되면 균일화·왜곡된다, 판단 근거는 표로 남긴다)을 쓴다.
> **6과정은 QM과 같은 pptxgenjs 엔진(`engine/`)으로 렌더된다(§3, 확정)** — 다만 QM 어휘(kind·skeleton)를
> 고쳐서가 아니라 **항상 추가로만** 얹는다. 그 원칙이 §3-a 회귀 불변식이다.

---

## 1. 이 문서가 정하는 것과 정하지 않는 것

QM 교재 지침의 "무엇을 누가 정하는가"(§0)와 같은 자리다. 안 적으면 다음 저자가 매번 새로 판단하고, 여섯 과정이 각자 다르게 굳는다 — 지금 프로그램 자세 선언 문구가 과정마다 이미 조금씩 갈린 것(4장에서 다룬다)이 그 증거다.

| 결정 | 주인 |
|---|---|
| 여섯 과정이 공유하는 개념의 소유·참조·의존 방향 | `concept-ownership-map.md` |
| 축자 인용 대상인 프로그램 명제·자세의 정본 원문 | `canon-stance.md` |
| 아직 정하지 못한 것 · 구조적 결함 후보 | `open-issues.md` |
| 공유 예제 도메인(Order)의 업무 규칙 | `order-domain-definition.md` |
| 공유 레이어·패키지 구조(Java) | `clean-layer-convention.md` |
| 공유 실습 환경(오프라인 번들) | `sw-lab-environment-setup.md` |
| 이 여섯 문서가 **어떻게 서로를 참조하는가**, 자세 선언·forward-ref 표기 같은 **글쓰기 규약** | 이 문서(`authoring-convention.md`) |
| 각 과정의 목차·교시·무게 배분·해당 과정만의 판단 | 각 `*-curriculum.md` |
| 각 과정의 실습 스니펫·통짜·코더 빈칸 | 각 `*-lab-design.md` |
| 각 과정의 실제 슬라이드·발표 자료 형식 | QM과 같은 pptxgenjs 엔진(`engine/`) — §3 |

이 문서는 **글쓰기 규약**만 정한다. 무엇을 가르칠지(소유 지도)·도메인이 무엇인지(Order 정의)는 이미 있는 세 문서가 정본이고, 여기서 다시 쓰지 않는다. 여기서 다루는 것은 그 세 문서와 여섯 과정 문서가 **서로 어떻게 맞물리는가** — 그 맞물림 방식이 지금 문서마다 조금씩 다르게 쓰이고 있어서(2·4장에서 구체적으로 짚는다), 그 어긋남부터 고정한다.

---

## 2. 문서 지도

```
program-design/
├─ authoring-convention.md      이 문서 — 글쓰기 규약(문서 간 참조·표기법)
├─ concept-ownership-map.md     개념 소유·의존 방향의 정본
├─ canon-stance.md              프로그램 명제·자세의 축자 인용 정본(§4)
├─ open-issues.md               미결정·구조적 결함 목록(결정되면 여기서 지운다)
├─ order-domain-definition.md   공유 도메인의 정본
├─ clean-layer-convention.md    공유 레이어 구조의 정본
├─ sw-lab-environment-setup.md  공유 실습 환경의 정본
├─ ooad-curriculum-2day.md      · ooad-lab-design.md
├─ sw-architecture-curriculum-2day.md · sw-architecture-lab-design.md
├─ ddd-curriculum-1day.md       · ddd-lab-design.md
├─ msa-curriculum-1day.md       · msa-lab-design.md
├─ llm-ai-assisted-curriculum.md · llm-ai-assisted-lab-design.md
└─ llm-agentic-curriculum.md    · llm-agentic-lab-design.md
```

**읽는 순서가 곧 의존 순서다.** 위 네 개(소유·도메인·레이어·환경)를 먼저 정본으로 확정하고, 그다음 여섯 과정이 그것을 인용한다 — 역방향 참조(예: `order-domain-definition.md`가 특정 과정 이름을 지목)는 금지한다. 이 규칙은 `cross-course-framework.md` §1 Governance Layers(Program Governance ↓ Course Portfolio ↓ Course Architecture ↓ Curriculum — 위 layer는 아래 layer를 모른다)와 같은 패턴이며, 정본 문서 전체에도 그대로 적용된다: **정본은 과정을 모른다. 과정이 정본을 안다.** (구 `concept-ownership-map.md` §"LLM 트랙 격리 불변식"이 이 절이 인용하던 자리였으나, Program Governance v2.2.2 편입으로 그 절은 없어졌다 — 원문은 Git history 참조.)

각 과정 폴더가 실제로 생기면(3장 참조) 이 지도에 `courses/<과정>/`도 추가한다 — 지금은 `program-design/`가 유일한 산출물 위치이므로 비워 둔다.

---

## 3. 결정 — 6과정은 QM 엔진으로 렌더된다

1장 초안에서 미해결로 남겼던 질문("이 여섯 과정은 무엇으로 렌더되는가")에 답이 났다. **6과정은 QM/SWQM과 같은 pptxgenjs 엔진(`engine/`)으로 슬라이드까지 만든다** — 별도 산출 체계를 새로 짓지 않는다. `courses/<과정>/{global_config.js, <커리큘럼>.md, decks/NN.js}` 레이아웃도 그대로 따른다.

이 결정에 따라 이미 시작된 실제 작업: 여섯 과정의 실습 핵심 장치(스니펫 대조·통짜 대조·코더 빈칸)가 기존 14종 `visual.type` 어디에도 안 맞는다는 것이 사전 조사(엔진·verify 경계 진단)의 결론이었다 — `table`은 monospace가 아니고 셀 줄바꿈이 들여쓰기를 보존 못 한다. 그래서 `shape.js`·`layout.js`·`render/*.js`·`verify.js`에 새 `visual.type: 'codepair'`(N벌 코드 대조, 2~3벌·marks로 R# 짚기·blanks로 코더 빈칸 표시)를 추가했다(커밋 `f98349f`/`a532f32`, `test/corpus/36~40`에 회귀 등록). 기존 14종은 한 줄도 안 건드렸다.

같은 원칙으로 두 번째 추가: `visual.type: 'uml'` — 여섯 과정이 표준 UML 표기(클래스·유스케이스·시퀀스·협업·상태 머신·패키지)를 그려야 하는데 15종 어디에도 다이어그램 렌더 경로가 없었다. `engine/plantuml/{fetch.js, render.js}`를 새로 두어 PlantUML을 JVM 위에서 완전 오프라인으로 렌더한다(`plantuml-mit-light` jar를 1회만 온라인 캐시로 굽고, 이후는 `engine/.cache/plantuml/`만 쓴다 — sw-lab 실습 환경의 "온라인 1회 캐시 굽기" 패턴과 동일). Graphviz 의존은 `!pragma layout smetana`(순수 자바 레이아웃 엔진)로 우회해 해소했다 — 이 우회가 없으면 클래스·유스케이스·상태·패키지·협업 다이어그램은 오류 없이 "Cannot find Graphviz" 자리표시자 이미지를 조용히 내놓는다(시퀀스는 원래 Graphviz가 필요 없어 영향 없음). `layout.js`의 "순수 기하" 원칙은 지켰다 — 다이어그램은 실제로 한 번 그려야 픽셀 치수를 아는 유일한 시각 타입이라, I/O(렌더 호출)는 `verify.js`·`render/visuals.js`가 맡고 `layout.js`의 `uml()`은 이미 렌더된 이미지의 치수(`{wIn, hIn}`)만 받아 순수 함수로 배치를 계산한다. 렌더 결과는 내용 해시로 캐싱해(두 번째 호출부터 1ms) verify·실제 렌더가 같은 소스를 두 번 그리는 비용을 없앴다. `test/corpus/41~47`에 지원 6종 렌더 성공 + 지원 범위 밖 kind 결함 탐지를 회귀 등록했다. 기존 15종(14종 + codepair)은 한 줄도 안 건드렸다.

세 번째 함정(OOAD 교시4 4차 재작성 중 실사용 보고로 발견, 2026-08): PlantUML의 기본 출력 원본 픽셀이 아주 작다(클래스 박스 하나 ~99x75px) — `-density` 플래그는 이 원본 해상도에 영향을 주지 않는다(실측: 150이든 600이든 같은 픽셀 수). 슬라이드에 배치할 때 이 작은 원본을 몇 배 크게 늘려 그리면 가장 얇은 선(박스 맨 아래 테두리 등)이 확대 보간에 씻겨 나가 "테두리가 잘렸다"처럼 보인다. 해법은 소스에 `scale 4`를 주입해 원본 픽셀 밀도만 올리는 것 — 물리적 인치는 그대로다(`wIn`/`hIn` 계산을 `DENSITY*SCALE`로 나눠 되돌린다), `layout.js`·`verify.js` 쪽 계약은 안 바뀐다. `engine/plantuml/render.js`의 `hashOf`에 `SCALE`을 넣어 캐시가 옛 저해상도 PNG를 조용히 돌려주지 않게 했다.

**아직 안 한 것**: 세션 유형("교시" 기반, `session_types.js`에 새 TYPES 항목)과 `course.js`의 6과정 전용 검사(무게 배분 합계, forward-ref/재정박 짝, 개념 소유 위반)는 이번에 손대지 않았다. codepair·uml은 "무엇을 그릴 수 있는가"의 벽을 허문 것이고, "교시 편성을 세션 유형으로 어떻게 담는가"는 다음 장의 몫이다. 실제 OOAD 등 6과정 덱에 `visual.type:'uml'`을 쓰는 것은 이번에 하지 않았다 — §3-c 경계원칙(내용 판단은 대화, Code 즉석 생성 금지)에 따라 어느 슬라이드에 어떤 다이어그램을 실을지는 소스 저작(대화) 몫이다.

### 3-a. 회귀 불변식 — 엔진을 건드릴 때마다 지킨다

QM/SWQM은 6과정 작업과 무관하게 계속 굴러가는 실제 산출물이다. `engine/`에 손대는 모든 6과정 작업은 다음을 지킨다 — codepair 추가가 그 실행 사례이자 앞으로의 기준이다.

1. **QM은 한 줄도 수정하지 않는다.** 새 kind·세션 유형·`visual.type`은 항상 *추가*로만 넣는다 — 기존 `TYPES`(session_types.js)·`SHAPES`(shape.js)·`SUB_KINDS`(render/primitives.js) 항목을 고치지 않는다.
2. **매 파일 변경 직후 `npm test`를 돌린다.** 코퍼스 전건 통과 + 스냅샷(`test/__snapshots__/geometry.json`) 기하 변화 없음 — 이 둘이 "QM 산출물이 그대로다"의 유일한 증거다. 하나라도 달라지면 그 변경을 되돌린다.
3. **`node engine/cli.js course courses/qm`·`courses/swqm`도 오류 0/경고 0을 유지한다.** verify.js 확장(예: 새 타입의 오버플로 계산)이 기존 과정에 새 경고를 내면, 그 확장이 QM 어휘에 잘못 걸린 것이다.
4. **신설 기능은 스모크 테스트 후 정식 코퍼스로 옮긴다.** 임시 fixture로 렌더 성공·형태 오류·오버플로 각각을 먼저 손으로 확인하고, 그다음 `test/corpus/`에 등록해 다음 변경부터는 회귀로 보호받게 한다.

이 네 가지는 새로 정한 규칙이 아니라 이번에 codepair를 넣으며 실제로 밟은 순서를 그대로 적은 것이다 — 다음에 세션 유형·`course.js`를 확장할 때도 같은 순서를 따른다.

### 3-b. 산출물(pptx)은 저장소에 커밋하지 않는다

**소스(`.js`)만 버전 관리 대상이다.** 렌더 산출물(pptx)은 커밋하지 않는다 — `.js`에서 언제든 재생성되고, 바이너리 커밋은 git·pull을 무겁게 만든다(이 절이 pptx 산출물 관리 규정의 정본이다 — 구 `concept-ownership-map.md` §R&R도 같은 원칙을 명문화했으나 v2 교체로 그 절은 소실됐다, Git history 참조).

- 렌더는 두 용도뿐이다: 사용자가 로컬에서 `node engine/cli.js build <deck>`으로 직접 만들거나, Code가 검증 목적으로 렌더한다.
- **Code는 검증 후 그 산출물을 커밋하지 않는다.** `courses/*/out/`은 `.gitignore` 대상이며 예외를 두지 않는다 — `git add -f`로 우회하지 않는다.

### 3-c. 3자 역할과 경계원칙

이 절이 R&R의 정본이다. 원래는 `concept-ownership-map.md` §R&R을 정본으로 하고 이 문서는 그 미러였으나, v2 Governance 교체(구성원 명단·경계원칙과 무관한 5과정 개념 소유 재편)로 옛 §R&R 절이 소실되면서 이 절이 유일한 원문이 됐다(구 절은 Git history 참조). 새 4정본(reference-frame·principles·terminology·concept-ownership-map)은 개념 소유·판단 원칙 정본이지 저작 R&R(누가 무엇을 쓰는가) 정본이 아니므로, R&R은 저작 규약 문서인 이 자리에 계속 둔다.

**3자 역할**
- **Youngon**: 판단·정본의 원천. 교과 내용의 깊이·범위·계보·서술 방식 결정, 원전 해석 최종 판정, 최종 승인권.
- **Claude(대화)**: 밀도 필요 교과의 소스 저작, 구조·규약 설계, 판단 보조. 결정은 사용자, 근거는 Claude.
- **Claude Code**: 소스→슬라이드 변환(소스의 설명을 슬라이드 본문으로 펴는 것까지 책임), 엔진·회귀 수호, 저장소 관리.

**경계원칙**
1. **내용 판단은 대화에서, 구현은 Code** — Code 즉석 생성 금지(소스 없이 밀도 교시 만들지 말 것).
2. **Code 산출이 얕으면 소스를 의심한다** — Code는 있는 걸 펴는 것까지, 없는 걸 채우는 건 소스(Claude).
3. **정본은 저장소, 판단은 대화, 반영은 Code.** 확정된 규칙·계보·결정은 반드시 저장소 md에 박는다.

---

## 4. 참조 규약 — canon-stance.md 인용

여섯 과정의 오리엔테이션(1교시)은 프로그램 명제·자세를 **손으로 다시 쓰지 않는다.** `canon-stance.md`의 id를 참조하고, 화면·문서에 옮길 때는 그 id의 TEXT를 축자로 가져온다.

**왜 필요한가.** 진단(2026-08) 결과 여섯 curriculum.md의 "프로그램 자세" 절이 이미 갈려 있었다 — DDD·MSA는 "예방 중심"으로 줄였고, AI-assisted·Agentic 두 LLM 과정은 이 절 자체가 없었다(자신들의 "과정 명제"만 있었다). `canon-stance.md`는 이 자세가 "전 과정 공통 — 각 과정 1교시 오리엔테이션에서 선언"이라고 명시하는데(구 `concept-ownership-map.md`가 원래 이 문구의 출처였으나 v2 교체로 소실 — 지금은 `canon-stance.md` 자신이 이 규정의 정본이다), 실제로 선언한 것은 넷뿐이었다. §3-a 회귀 불변식이 "코드가 QM과 어긋나지 않았는지 매번 대조"를 요구하듯, 이 절은 "문서가 정본과 어긋나지 않았는지"를 요구한다.

**표기 규약 (design 문서 — `*-curriculum.md`)**
- curriculum.md의 헤더는 `## 프로그램 자세 (1교시에서 선언 — 정본: canon-stance.md)`로 통일한다(과거의 "소유 지도 인용"은 폐기 — 소유 지도가 아니라 canon-stance.md가 축자 인용 정본이다).
- 세 항목(`stance.necessary-evil` · `stance.just-enough` · `stance.prevent-repay`)을 항상 이 순서로, id와 **TEXT**(전문)를 함께 적는다: `- \`id\`: TEXT`. design 문서는 슬라이드가 아니라 참고 자료라 밴드 제약이 없다 — 전문을 그대로 쓴다.
- 과정별 보충 설명(예: "MSA판 Just Enough = 필요 없으면 짓지 마라")은 TEXT를 바꾸는 대신 세 항목 **뒤에 별도 줄**로 붙인다 — canon-stance.md §자산 블록 형식이 정한 규율과 같다.
- `proposition.governing`(프로그램 명제)은 과정 개요나 오리엔테이션에서 인용할 때 최소 TEXT를, 반론이 나올 자리에서는 REBUTTAL도 함께 인용한다(canon-stance.md §proposition.governing 참조).

**TEXT vs SHORT — 어디에 쓰나 (실제 슬라이드 — `courses/<과정>/decks/*.js`, OI-1에서 확정)**
- **선언 장**(`kind:'선언'`, `proposition.governing` 전용)은 **TEXT 전문**을 싣는다. 과정을 여는 단언이라 한 슬라이드에 하나뿐이고, §6 회귀 불변식(선언은 2줄 상한 면제)이 이미 긴 문장을 전제한다.
- **그 밖의 반복 인용**(예: `stance.*` 세 항목을 한 슬라이드에 bullets로 나열)은 **SHORT**를 쓴다. 여러 항목이 한 밴드를 나눠 쓰면 TEXT 전문은 밀도 경고나 밴드 여유 소진을 부른다(OOAD 부0에서 실측 — OI-1).
- TEXT를 쓸 자리에 SHORT를, SHORT를 쓸 자리에 TEXT를 섞어 넣지 않는다 — 어느 쪽이든 canon-stance.md의 문자열을 그대로 옮기고 다시 짓지 않는다.
- **canon-stance.md 자체를 고치면(TEXT든 SHORT든) 여섯 문서·이미 만든 덱을 전부 다시 대조한다.** 부분 반영은 드리프트를 새로 만드는 것과 같다.

이 절 적용 결과(6과정 자세 통일, TEXT/SHORT 구분)는 커밋에 함께 반영한다 — design 문서 쪽 상세는 각 `*-curriculum.md`의 "프로그램 자세" 절을, 슬라이드 쪽 실례는 `courses/ooad/decks/01.js`를 본다.

---

## 5. (예고) 다음 장에서 다룰 것

앞 장은 지도와 참조 규약을 세웠다. 진단에서 확인한 보완 대상 중 다음 것들이 이어질 장의 후보다 — 순서는 논의로 정한다.

- **크로스 코스 의존 규약의 격상**: `cross-course-framework.md` §1 Governance Layers(구 `concept-ownership-map.md`의 "LLM 트랙 격리 불변식"이 담당하던 자리 — Program Governance v2.2.2 편입으로 그 절 자체는 없어졌다)를 개별 문서의 서술에서 이 규약의 **강제 규칙**으로 승격 — 위반 예시와 함께.
- **forward-ref → 재정박 표기 표준**: 지금 자유 서술인 `**forward-ref: ...**` / `**재정박: ...**`을 짝을 추적할 수 있는 표기(예: 공통 표)로 표준화.
- **실습 3층 형식의 필드 스펙화**: "형식을 복제한다"는 지시를 실제 체크리스트(판단/대면/작성 3층, (a)/(b) 대조, 코더 빈칸이 각각 무엇을 반드시 가져야 하는가)로.
- **무게 배분의 파생 여부 결정**: 지금처럼 저자 판단으로 둘지, QM처럼 파생 공식과 검사를 둘지.
- **세션 유형(교시 기반) 신설**: §3에서 "아직 안 함"으로 남긴 것 — `session_types.js`에 새 TYPES 항목(kind 어휘 "강의/실습/강의+실습")을 추가하고, `course.js`에 6과정 전용 검사(무게 배분 합계·forward-ref/재정박 짝·개념 소유 위반)를 얹는다. §3-a 회귀 불변식을 그대로 따른다.

---

## 6. 교시·kind 매핑 규칙

OOAD 부 0(`courses/ooad/decks/01.js`, 교시 1)을 실제로 뽑으며 확정했다. 미해결로 남은 것(canon-stance.md TEXT 길이, 커리큘럼 노드 md 부재)은 규칙이 아니라 `open-issues.md`(OI-1·OI-2)에 있다.

- **교시 = 덱.** `courses/<과정>/decks/NN.js`의 NN은 세션 번호가 아니라 **교시 번호**다. 6과정의 "교시"(50분)는 QM의 "세션"(50~95분)과 같은 크기 단위이지, QM의 "슬라이드(kind 장)"와 같은 단위가 아니다 — 1교시 안에 여러 슬라이드(학습목표·현상·원칙·…·요약)가 들어간다.
- **선언(`kind:'선언'`) = `proposition.governing` 전용.** canon-stance.md는 자산을 둘로 나눈다 — 명제(하나, 과정 전체를 여는 단언)와 자세(셋, 판단 기준). QM의 선언(세션당·과정당 최대 1개)은 명제 쪽에 배정한다. `stance.*` 세 항목은 선언이 아니라 일반 논증 장(예: `kind:'원칙'`, `visual.type:'bullets'`, 항목마다 `head: id, text: TEXT`)으로 얹는다 — 선언 자리가 하나뿐이라 셋을 다 못 담는다.

---

## 7. 슬라이드 본문 규약 — 설명이 주, 코드는 예시

OOAD 교시9(GRASP 강의)를 처음 만들었을 때 codepair 코드만 있고 소스의 정보 소재 추론(설명 산문)이 슬라이드 본문에 없는 결함이 나왔다 — 코드 주석에 정의를 욱여넣고 화면엔 이름만 남았다. 재작성하며 세운 규칙을 6과정 공통으로 올린다.

- **코드만 있고 설명 없는 장을 금지한다.** 원칙·개념 하나를 다루는 슬라이드는 정의(온전한 문장)를 먼저 세우고, 그다음 그 배치를 정당화하는 추론(왜 이 책임을·왜 이 경계를 — 산문으로)을 편다. 코드·다이어그램은 그 설명을 뒷받침하는 **예시로 종속**된다 — codepair 등 시각 자료가 본문을 대신하지 않는다.
- **상위 프레임을 하위 도구보다 먼저 세운다.** 어떤 원칙 체계(GRASP·SOLID 등)를 가르치기 전에, 그 체계가 속한 상위 방법론(예: RDD)을 먼저 설명한다 — 하위 도구를 정답표처럼 던지지 않는다. 상위 프레임은 최소 2~3장을 들여 정의·동기·"왜 도구가 필요한가"를 편다.
- **정의(definition) → 정보 소재 추론(추론 본문) → 예시(코드 등) → 한계**, 이 순서를 원칙·개념 슬라이드의 기본 골격으로 삼는다. 다음 원칙·개념으로의 연결(한계가 무엇을 부르는가)까지 적으면 원칙들이 낱개로 나열되지 않고 서로 이어진다.
- **원작자·출전 표시**: 개념 수준(방법론·원칙 체계 자체 — 예: RDD·GRASP·SOLID)에만 원작자·출전을 표시한다. 개별 원칙·개별 항목에는 붙이지 않는다. 표시 위치는 슬라이드 하단, 페이지 번호 2줄 위, 9pt, 슬라이드 가로 가운데 — 엔진 지원 필드는 `slide.origin`(문자열, 선택). 이 필드를 안 쓰는 슬라이드·덱은 렌더가 전혀 달라지지 않는다(`engine/render/primitives.js`의 `origin()` 참조).

## 8. "한글(영어)" 표기 규약

- 원어 개념·원칙·패턴 이름은 **첫 등장하는 자리(제목·상세 설명 슬라이드)에서 "한글역(English)" 완전 표기**로 쓴다 — 예: 정보 전문가(Information Expert), 낮은 결합도(Low Coupling).
- 같은 슬라이드나 이후 슬라이드에서 **반복 언급할 때는 한글만** 쓴다 — 매번 괄호 영문을 되풀이하지 않는다.
- **축약·조어를 만들지 않는다.** 사전에 있는 온전한 단어·문장만 쓴다 — 저자가 지어낸 압축 라벨(예: "네 개념 네 이름" 같은 캐치프레이즈)을 제목·kw·라벨 자리에 쓰지 않는다.
- **의문형 문장은 물음표로 끝맺는다.**
- 이 규약은 6과정 전체에 적용된다 — GRASP·SOLID·DDD 전술처럼 원어 개념이 많은 과정(OOAD·아키텍처·DDD)일수록 적용 빈도가 높다.
