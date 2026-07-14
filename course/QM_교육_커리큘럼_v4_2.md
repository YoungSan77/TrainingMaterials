# QM 교육 커리큘럼 v4.2 (인용 자산 검증본 + 단문 슬라이드, 총 16시간)
## 현대적 품질 관리(Modern QM) — 프로세스 내재화와 품질 파이프라인

- **대상:** SW 개발자, QA, PM, Architect, BA, Designer, 관리자, 경영진 (Full-Stack Stakeholders)
- **형식:** 2일 / 총 16세션 (세션당 50분 강의 + 10분 휴식)
- **과정 철학:** 모든 문제는 시스템의 문제다 — 개인의 문제가 아니다.
- **통합 근거:** 프롬프트에 종속되어 있던 과정 특화 규칙(용어, 분량, 어조)을 커리큘럼 내부로 완전히 흡수하여 메타 지시어로 통합함.

> **핵심 메시지**
> 품질은 테스트 활동이 아니라 시스템 설계다. Shift-Left를 축으로 요구사항부터 운영까지 하나의 품질 파이프라인을 구축하는 것이 목표다.

---

## 0. 설계·표기 규칙 (일관성 장치)

### 0.1 학습 구조
- 전체 흐름: **Why → What → How → Operate** (Day1 = 예방 철학, Day2 = 자동화·운영).
- 모든 세션은 동일 골격: **학습목표 / 문제 / 해결 / 적용 / 선택과 버림 / 다음 연결**.
- **인용은 골격이 아니라 근거다(v4.1 변경).** 부록 A에 그 세션의 명제와 직접 연결되는 인용이 있을 때만 넣는다.
  맞는 인용이 없으면 세션에 인용이 한 장도 없어도 된다. 개수를 채우려고 인용을 끌어오지 않는다.
- Shift-Left는 특정 세션이 아니라 전 과정의 공통 원칙으로 재등장한다.

### 0.2 용어 규칙 (사전 정의)
- 반드시 다음의 표준 용어만을 사용한다: **시스템, 수준, 보상 시스템, 시스템 미비, 이해 없는 개입, 작업, 요구사항**.
- "레벨" 금지 → **수준**. "감리"(제도 색채) 금지 → **감사 / 독립 검토**.
- 특정 국가·시장 관행(예: SI 감리 제도)은 배제하고 보편 SW 공학 원칙과 비용 대비 효율만 기준으로 서술한다.

### 0.3 직군–3주체 매핑 규칙
- 3주체 = **작업자 / QA / PM·경영진**.
- BA·Architect·Designer는 **작업자 주체의 선행 방어 직군**으로 흡수한다(별도 4주체 아님). BA=요구 모호성 제거, Architect=복잡성·인지 부하 제어, Designer=휴먼 에러 예방.

### 0.4 개념 소유 매트릭스 (중복 → 나선형 심화로 규칙화)
각 개념의 **원리 소유 세션**을 1개만 둔다. 다른 세션의 재등장은 "적용/심화"로만 표기하고 원리를 다시 정의하지 않는다.

| 개념 | 원리 소유 | 심화·적용 |
|---|---|---|
| Shift-Left / CoQ / Boehm | S01 | 전 세션 |
| Deming 시스템 사고(94%) | S01 | S02, S13 |
| 탓하지 않는 문화(Blameless) | S02 | S05, S13 |
| 3주체 R&R | S02 | S13, S15 |
| PDCA / Lean QMS | S03 | S05, S12 |
| 표준 매핑(ISO/CMMI/SPICE) | S03 | S04 |
| 성숙도 수준 / 양방향 추적성 | S04 | S16 |
| 감사 / 상시 준수 | S05 | S16 |
| 동료 검토 | S06 | S09 |
| 요구공학 / Rich Domain Model / Context Engineering / Ontology | S07 | S02, S14, S15 |
| 지표 오염(Goodhart) | S09 (도입) | S05, S12 |
| 테스트 피라미드 / TDD | S09 | S10 |
| CI/CD / 배포 전략 / Chaos Engineering | S10 | S15 |
| Conway / 인지 부하 / Platform Eng | S11 | S15 |
| 지표 설계(진단 vs 평가, DORA) | S12 | S05, S13 |
| 보상 재설계 / Collective Ownership | S13 | S02, S15 |
| AI 리스크 / Guardrail / Harness / Eval | S14 | S15 |
| Operating Model(5요소) | S15 | S16 |
| TOC 병목 / Pilot 실행 | S16 | S08 |

### 0.5 교재 생성 메타 규칙 (프롬프트 이관 항목)
- **전개 방식:** 세션 본문 생성 시 반드시 지정된 세션의 하위 항목을 **(현상 → 원인 → 원칙 → 적용)** 흐름으로 논리적으로 분할 전개한다.
- **슬라이드 분량:** 각 세션의 본문 슬라이드는 **12~17장**이다(표지·목차 제외). 구 규격 '최소 15~20장'은 폐기한다 — 분량 하한은 §0.4의 개념 소유 규칙과 충돌해 타 세션 내용을 끌어오는 유인을 만든다. 분류(현상/원인/원칙/적용/타협)별 최소 1장이 분량보다 우선한다.
- **톤앤매너 강제:** '완벽히', '철저히', '거대한', '극단적인' 등의 감정적/과장된 수식어와 불필요한 영문 괄호를 철저히 배제하고, 건조한 공학적 문장만을 사용한다.
- **인용문 사실 확인:** 부록 A에 있는 인용만 사용한다. 임의 의역·추론·창작은 금지다. 인용을 쓸 때는 자산의 **id를 함께 적는다**(`quote:{id,ko,en,author}`) — 검증기가 원문과 문자열 대조한다. 자산에 없는 id, 자산과 다른 문구는 오류로 중단된다.
- **인용 등급:** `PRIMARY`(원전 문헌에서 문구 확인) / `WIDELY-CITED`(원전 문구는 미확인이나 업계에서 널리 통용). `WIDELY-CITED` 인용을 슬라이드에 쓸 때는 한계를 표기한다(`caption` 또는 강사노트). 출처가 불명이면서 통용되지도 않는 인용, 특정 국가·산업의 관행을 정설처럼 포장한 자료는 자산에 넣지 않는다.
- **인용 재사용:** 같은 인용을 여러 세션에서 쓰는 것은 허용된다(나선형 심화). 같은 세션 안에서의 중복은 금지다.


### 0.6 시각 문법 규칙 (v4.1 신설)

시각화 타입은 엔진이 제공하고, **무엇을 그릴지는 커리큘럼이 정한다.**

**선택 규칙** — 관계가 내용이면 `flow`/`pipeline`/`loop`, 항목이 내용이면 `boxes`/`steps`/`versus`/`table`, 숫자가 명제이면 `share`/`magnitude`, 계층이면 `pyramid`, 두 축이면 `quadrant`.
표(`table`)는 최후의 수단이다. 무엇이든 담기기 때문에, 타입 선택에 실패하면 반드시 표로 흘러간다.

**"숫자가 명제"의 뜻** — 그 수치 자체가 슬라이드의 주장인 경우다(예: 문제의 대부분은 시스템에 있다 = 94:6). 주장을 뒷받침하는 근거 수치는 명제가 아니다 → 표가 맞다. 수치를 그림으로 올릴 때는 `caption`에 출처와 한계를 반드시 적는다.

**단문 슬라이드(`statement`)** — 세션의 전환점을 한 문장으로 던진다. 질문·리드·결론을 붙이지 않는다(계약의 골격 예외).

| 개체 | 크기 | 내용 |
|---|---|---|
| `text` 또는 `quote.ko` | **20pt** | 이 슬라이드가 하려는 말 |
| `note` | **14pt** | 해설 — 그 말이 무슨 뜻인지. **본문과 같은 크기다(각주가 아니다)** |
| `quote.en` / 저자 / 출처 | **10pt** | 영문 원문 · 저자 · 출처. 인용 메시지의 기본형이다 — `quote:{id,...}`를 쓰면 **자동으로 붙는다**(출처는 엔진이 자산에서 끌어온다) |
| `caption` | **8pt** | **한계만**. 저자·출처를 여기 쓰지 않는다(위 10pt 줄이 이미 달고 있다). 해설을 여기 넣으면 슬라이드의 논지가 각주로 강등된다 |

인용을 근거로 한 메시지는 우리말 명제를 `text`에, 인용 자산을 `quote:{id,ko,en,author}`에 **함께** 쓴다.

**그림을 넣지 않는다.** 단문의 힘은 비어 있음에서 나온다 — 채우면 5단 슬라이드로 되돌아간다.
**세션당 2~3장. 4장부터 경고한다** — 단문이 많으면 논증이 사라진다.
**단문으로는 분류 요건(현상/원인/원칙/적용/타협)을 채울 수 없다** — 논증이 없는 장으로 분류를 때우면 교재가 빈다.

**★ 인용의 기본 자리는 단문 슬라이드가 아니다.** 인용은 논증 슬라이드 하단의 `quote` 오버레이로 붙이는 것이 기본이다.
`statement`는 전환점에만 쓴다 — **인용 하나에 단문 한 장씩 만들지 않는다.**

**강사 노트(`notes`)** — 슬라이드에 넣지 않은 것을 여기에 넣는다: 던질 질문, 흔한 반론, 시간 배분, 인용의 한계.
**모든 본문 슬라이드에 notes를 쓴다**(검증기가 경고한다). 길이 하한은 두지 않는다 — 그건 쿼터이고, 쿼터는 채우기를 부른다.
인용을 쓰면 **엔진이 자산에서 출처·원문·URL을 자동으로 덧붙인다.** 생성기는 URL을 쓰지 않는다(쓸 수 없으니 지어낼 수도 없다).

**`curriculum[].items`에는 세션 제목만 쓴다** — `Session 01.` 같은 접두어를 붙이지 않는다(번호는 엔진이 붙인다).
`curriculum[].day`는 `Day 1 — 품질의 본질과 표준`처럼 유형 제목까지 적는다(엔진이 `Day N —`만 벗기고 유형 제목을 남긴다).

**세션별 시각 자산 (필수 시각화)** — 아래 명제는 표·텍스트로 대체하지 않는다.

| 세션 | 그림이어야 할 명제 | 타입 |
|---|---|---|
| S01 | 문제의 94%는 시스템, 6%는 특수 원인 | **`statement`** + `quote:Q-DEMING-94-6` — 그림을 그리지 않는다. 이 명제는 말이 그림보다 세다 |
| S01 | 발견 시점에 따른 수정 비용의 자릿수 변화(1:10:100) | `magnitude` |
| S02 | 3주체(작업자·QA·PM/경영진)의 책임 경계와 빈틈 | `flow` |
| S05 | 감사 → 시정 → 재감사의 상시 준수 루프 | `loop` |
| S06 | 동료 검토 게이트의 통과·되돌림 | `pipeline` |
| S09 | 테스트 피라미드 | `pyramid` |
| S10 | CI/CD 품질 게이트 파이프라인 | `pipeline` |
| S11 | Conway — 조직 구조가 설계 구조를 낳는다 | `flow` |
| S12 | 진단 지표 vs 평가 지표 (2축) | `quadrant` |
| S13 | 보상 시스템이 만드는 악순환 | `loop` |

`loop`의 노드는 **타원**이다(사각형은 원형으로 놓아도 순환으로 안 읽힌다). 대가로 라벨 예산이 준다 —
**10pt 기준 한글 8자**. 8자를 넘으면 라벨을 잘못 뽑은 것이다: 노드는 문장이 아니라 상태의 이름이다.

**어휘 트리거 (검증기 주입용)** — 엔진·검증기는 도메인 어휘를 모른다. 아래를 세션 데이터의 `meta.visualTriggers`로 넘긴다. 명제에 이 어휘가 있는데 해당 타입을 쓰지 않으면 경고가 난다(근거일 뿐이면 `visualNote`에 사유를 적어 억제한다).

```js
meta: {
  quotes: './QM_교육_커리큘럼_v4_2.md',          // 인용 자산(부록 A) 경로 — 검증기가 원문을 대조한다
  visualTriggers: {
    loop:      ['악순환', '선순환', '되먹임', '상시 준수', '재유입'],
    pipeline:  ['게이트', '되돌림', '파이프라인'],        // '재작업'은 뺐다 — 품질 비용 논의에서 흔한 단어라 오탐이 잦다
    share:     ['구성비', '비중'],
    magnitude: ['자릿수', '배로', '몇 배'],
    pyramid:   ['피라미드', '계층 구조'],
    quadrant:  ['두 축', '사분면']
  }
}
```

---

# [Day 1] 품질의 본질과 표준 — "우리는 무엇을, 왜 지켜야 하는가?"

## Session 01. 품질 패러다임 전환과 Shift-Left
- **학습목표:** 품질을 테스트가 아닌 시스템 관점에서 정의하고, Shift-Left를 전 과정 공통 원칙으로 설명한다.
- **문제:** 기획-개발-테스트가 단절된 사일로(Silo)에서 발생하는 산출물 떠넘기기와 핑퐁 게임. "품질은 테스트 부서 책임"이라는 착각.
- **해결:** 재작업 비용(CoQ)의 구조와 결함 이관 비용(Boehm) — 로컬을 벗어날수록 수정 비용이 폭증한다. 통제력을 릴리즈 직전에서 가장 앞단으로 당기는 Shift-Left의 정의.
- **적용:** 결함의 94%는 개인 역량이 아니라 시스템 미비에서 온다는 Deming의 사고. 질의를 "누가"에서 "무엇이 원인인가"로 전환.
- **선택과 버림:**
  - *전제조건:* 탓하지 않는 문화가 정착될 조직 의지가 있다.
  - *Trade-off:* 앞단 검증은 초기 속도를 내주고 총 리드타임을 줄인다.
  - *실패조건:* 예방을 비용으로만 보는 권한이 상존하면 도입해도 형식만 남는다.
  - *판단맥락:* 로컬 검증을 건너뛴 속도는 100배 구간의 부채로 돌아온다.
- **인용:** Deming(나쁜 시스템 vs 좋은 사람), Crosby(품질은 공짜다), Deming 14 Points #3(검사 의존 중단).
- **다음 연결:** 이 시스템을 실제로 방어하는 세 주체는 누구인가.

## Session 02. 품질을 만드는 3주체와 R&R
- **학습목표:** 작업자·QA·경영진의 예방 중심 역할을 구분하고, R&R 경계의 빈틈을 설계로 막는다.
- **문제:** 장애 수습을 영웅시하는 보상 시스템이 예방을 실종시킨다. "모두의 책임"이 "누구의 책임도 아님"으로 붕괴.
- **해결:** 탓하지 않는 문화(Blameless)가 3주체 협력의 전제다. 비난은 결함 정보를 은폐시키는 가장 강한 힘이다.
- **적용:**
  - *작업자(제1주체):* 상태 무결성을 스스로 방어(예방 로직 내재화).
  - *QA(제2주체):* 사후 검열 탈피, 앞단 예방 조력(서번트 리더십).
  - *경영진(제3주체):* 무리한 일정 강요 차단, 방어적 인프라 스폰서십.
  - *선행 직군:* BA·Architect·Designer가 상류 결함을 유형별로 방어(§0.3).
- **선택과 버림:**
  - *전제조건:* 보고자를 처벌하지 않는 심리적 안전이 확보된다.
  - *Trade-off:* R&R을 세분하면 명확하나 경직되고, 겹치면 유연하나 책임이 희석된다.
  - *실패조건:* 경계를 핑퐁의 도구로 쓰면 R&R이 책임 회피 근거가 된다.
  - *판단맥락:* 예방의 주체가 지정되지 않으면 예방은 실행되지 않는다.
- **인용:** Deming 14 Points #8(두려움을 몰아내라), Greenleaf(섬김이 먼저).
- **다음 연결:** 이 역할을 뒷받침하는 표준은 무엇인가.

## Session 03. 글로벌 품질 표준 1 — ISO 9001
- **학습목표:** QMS의 목적을 규제 통과가 아니라 결과의 예측 가능성으로 재정의한다.
- **문제:** 실제 작업과 분리된 감사용 "이중 장부"를 양산하는 형식주의.
- **해결:** ISO 9001의 본질은 PDCA(계획-실행-확인-조치) 개선 루프다. 표준은 지키는 벽이 아니라 계속 높이는 기준선이다.
- **적용:** 문서를 위한 문서를 폐기하는 가벼운(Lean) QMS. 요건을 형상 관리·파이프라인에 녹여 증거를 자동 생성.
- **프레임워크 매핑:** ISO(지속적 개선 **체계**) / CMMI(조직 **성숙도** 진단) / SPICE(개별 **프로세스** 역량) — 상호 보완 관점.
- **선택과 버림:**
  - *전제조건:* 개선 루프가 실제로 도는 조직이다(문서가 작업에서 파생된다).
  - *Trade-off:* QMS가 무거우면 통제, 가벼우면 속도. 위험도로 균형점을 잡는다.
  - *실패조건:* 인증 획득이 유일한 목적이면 표준은 지표이길 멈춘다.
  - *판단맥락:* 위험이 낮은데 무거운 표준을 얹으면 비용만 증폭된다.
- **인용:** Deming 14 Points #5(끊임없는 개선), Deming(프로세스로 설명 못 하면 모르는 것).
- **다음 연결:** 개선을 등급으로 진단하는 성숙도 모델은 무엇인가.

## Session 04. 프로세스 성숙도 — CMMI & SPICE
- **학습목표:** 성숙도 모델을 심판이 아니라 진단 거울로 사용하고, 양방향 추적성을 설계한다.
- **문제:** 성숙도를 평가·문책 무기로 쓸 때 발생하는 지표 조작과 거짓 성숙.
- **해결:** L1(영웅주의)→L5(최적화)는 개인 의존에서 시스템 관리로 가는 축. V-Model은 방법론이 아니라 정의와 검증의 대응 관계다.
- **적용:** 양방향 추적성 — 요구사항이 어떤 코드로 구현됐는가(Forward), 코드가 어떤 요구에서 비롯됐는가(Backward). 도구 범주(이슈 트래커·버전 관리·정적 분석기) 연동으로 추적을 시스템이 강제.
- **선택과 버림:**
  - *전제조건:* 두려움 없는 보고 문화와 식별자 규칙이 정착됐다.
  - *Trade-off:* 깊은 추적은 통제를 주고 속도를 뺏는다. 위험도로 깊이를 정한다.
  - *실패조건:* 수준을 평가 무기로 쓰면 진단할 정보 자체가 오염된다.
  - *판단맥락:* 총괄 등급보다 약한 프로세스의 특정이 개선에 더 유용하다.
- **인용:** Watts Humphrey(위치를 모르면 지도도 소용없다)[확인 요망], Dijkstra(테스트는 결함 부재를 증명 못 한다), Brooks(무엇을 만들지 결정).
- **다음 연결:** 이 표준 준수를 어떻게 상시로 검증하는가.

## Session 05. 감사(Audit)와 상시 준수(Continuous Compliance)
- **학습목표:** 감사를 통과 관문에서 시스템 미비를 찾는 피드백 루프로 재정의한다.
- **문제:** 감사철에 개발을 멈추고 과거 산출물을 소급 조작하는 파괴적 이벤트화.
- **해결:** 방어적 태도(처벌 회피) vs 개선적 태도(미비 발견)가 성과를 가른다. 산출물 감사에서 프로세스 감사로 대상을 이동.
- **적용:** 파이프라인의 커밋·테스트 로그 자체가 감사 증거가 되는 상시 준수. 감사 결과는 등급이 아니라 개선 백로그로 전환. **지표 오염(Goodhart, §S09 도입)의 감사 적용** — 측정 쉬운 대리 지표(LOC·커버리지) 강요를 배제.
- **선택과 버림:**
  - *전제조건:* 자동 기록 체계가 있고, 미비를 벌하지 않는다.
  - *Trade-off:* 감사가 무거우면 통제, 가벼우면 속도이자 조작 유인 감소.
  - *실패조건:* 독립성이 없으면 자동 감사도 만든 사람의 맹점을 물려받는다.
  - *판단맥락:* 지표를 고과에 연동하는 순간 데이터의 진실성은 사라진다.
- **인용:** Deming(검사는 너무 늦다), Deming(변화는 의무가 아니다), Hopper(늘 이렇게 해왔다)[귀속].
- **다음 연결:** 결함을 사후에 찾지 않고 앞단에서 예방하는 최전선은 무엇인가.

## Session 06. 예방의 최전선 — 동료 검토(Peer Review)
- **학습목표:** 검토 유형을 목적별로 분리 적용하고, 인간을 비즈니스 룰 방어에 집중시킨다.
- **문제:** 탓하지 않는 문화 부재 시 리뷰가 자존심 싸움·스타일 꼬투리로 전락. 컨텍스트 없는 기계적 승인(LGTM).
- **해결:** 목적 매트릭스 — 워크쓰루(비공식 지식 공유), 인스펙션(엄격한 적발), PR(비동기 통합)의 전략적 선택. 문법이 아니라 도메인 무결성·요구 반영을 논의.
- **적용:** 정적 분석기를 파이프라인 앞단에 배치해 기계적 오류를 먼저 걸러내고, 인간은 아키텍처·비즈니스 룰에만 집중.
- **선택과 버림:**
  - *전제조건:* 리뷰어가 작업의 비즈니스 컨텍스트를 공유받는다.
  - *Trade-off:* 인스펙션은 결함을 많이 잡으나 리드타임을 쓴다. 위험도로 유형을 고른다.
  - *실패조건:* 컨텍스트 없이 스타일만 지적하면 리뷰가 핑퐁으로 리드타임을 지연시킨다.
  - *판단맥락:* 기계가 잡을 오류를 인간이 잡고 있으면 리뷰 설계가 잘못된 것이다.
- **인용:** Feynman(자신을 속이지 마라).
- **다음 연결:** 가장 비싼 결함, 즉 요구사항 자체의 결함은 어떻게 막는가.

## Session 07. 요구사항과 품질 계획 — 가장 비싼 결함 막기
- **학습목표:** 요구사항의 상류 결함을 조기 합의로 차단하고, 제약을 도메인 모델·온톨로지로 형식화한다.
- **문제:** 코드를 아무리 잘 짜도 요구사항이 틀리면 가장 비싼 결함이다. 자연어 명세와 주문 받기식 기획의 한계.
- **해결 1 — Context Engineering:** 도메인과 엔지니어링의 맥락 단절을 메우는 설계. 3 Amigos(BA·개발·QA)가 유비쿼터스 언어로 엣지 케이스·인수 조건을 착수 전 합의.
- **해결 2 — Rich Domain Model + Ontology:** 빈약한 도메인 모델(Anemic)을 배제하고 비즈니스 제약을 객체 내부에 응집. 유비쿼터스 언어를 **온톨로지(개념·관계·제약의 형식 모델)**로 승격하면 사람과 기계가 같은 도메인 정의를 공유한다(ERD/DFD → OOAD → DDD → Ontology 계보).
- **적용:** BDD 시나리오가 곧 자동화 테스트가 되는 살아있는 문서화(Living Documentation). 온톨로지는 뒤에서 AI 가드레일의 진실 원천(§S14)으로 재사용된다.
- **선택과 버림:**
  - *전제조건:* 도메인 전문가가 합의 테이블에 실제로 참여한다.
  - *Trade-off:* Rich Model·온톨로지는 선행 설계 비용을 늘리나 불법 상태 변이를 구조로 차단한다.
  - *실패조건:* 온톨로지를 문서로만 두고 코드·검증과 연결하지 않으면 또 다른 이중 장부가 된다.
  - *판단맥락:* 요구가 자주 뒤집히는 초기 탐색 단계에 무거운 온톨로지를 강제하면 낭비다.
- **인용:** Brooks(무엇을 만들지 결정이 가장 어렵다 / 사전 완전 명세는 불가능), Bezos(고객은 신성하게 불만족한다), Evans(소프트웨어의 핵심은 도메인 문제 해결).
- **다음 연결:** 1일 차 개념으로 우리 조직의 현재 병목을 어떻게 진단하는가.

## Session 08. 워크숍 1 — 조직 품질 성숙도 자가 진단
- **학습목표:** 1일 차 개념으로 팀 성숙도를 매핑하고 단일 병목을 식별한다.
- **문제:** 개념을 현실에 투영하지 않으면 학습이 관념에 머문다.
- **해결:** CMMI/SPICE를 차용한 간이 진단지로 부서별 품질 내재화 수준을 자가 평가.
- **적용:** 제약 이론(TOC)으로 가치 인도 속도를 결정짓는 **가장 치명적인 단일 병목**을 도출(기술 부채·잘못된 보상 시스템·이해 없는 개입·모호한 요구 중).
- **산출물(구체화):** ① 팀 성숙도 히트맵 1장, ② 단일 병목 진술문 1문장, ③ 2일 차에 매칭할 후보 기법 목록.
- **선택과 버림:**
  - *전제조건:* 진단을 평가로 쓰지 않겠다는 합의가 선행된다.
  - *Trade-off:* 자가 진단은 신속하나 편향된다. 익명·교차 검토로 보정한다.
  - *실패조건:* 병목을 여러 개로 나열하면 TOC의 집중 효과가 사라진다.
  - *판단맥락:* 병목 아닌 지점을 개선하면 전체 처리량은 그대로다.
- **다음 연결:** 식별한 병목을 자동화로 어떻게 뚫는가.

---

# [Day 2] 지속적 검증과 엔지니어링 — "품질을 어떻게 자동화할 것인가?"

## Session 09. 현대적 테스트 전략 — 피라미드와 자동화
- **학습목표:** 투자 밸런스를 피라미드로 재배분하고, 지표 오염을 식별한다.
- **문제:** 느리고 깨지기 쉬운 E2E 중심의 아이스크림 콘 구조.
- **해결:** 단위 70% / 통합 20% / E2E 10%의 테스트 피라미드로 빠르고 견고한 피드백 루프.
- **적용:** **Goodhart의 법칙(지표 오염의 원리 도입 세션)** — 지표가 목표가 되면 지표이길 멈춘다. 무의미한 Mocking·가짜 커버리지 배제. TDD를 통제 강요가 아니라 사용자 관점의 설계 유도 도구로 재정의.
- **선택과 버림:**
  - *전제조건:* 단위 테스트가 빠르고 격리 가능한 설계다.
  - *Trade-off:* 피라미드 하단 투자는 초기 노력을 요구하나 회귀 비용을 낮춘다.
  - *실패조건:* 커버리지를 고과에 연동하면 숫자만 오르고 검증은 비어간다.
  - *판단맥락:* 재기 쉬운 것을 재면 재야 할 것을 놓친다.
- **인용:** Strathern(지표가 목표가 되면 좋은 지표이길 멈춘다 — Goodhart 정식화), Goldratt(측정 방식이 행동을 정한다).
- **다음 연결:** 이 검증을 파이프라인으로 어떻게 상시화하는가.

## Session 10. 지속적 품질 파이프라인 — DevOps와 CI/CD
- **학습목표:** 수동 검열을 자동 검증 파이프라인으로 이관하고, 운영 복원력을 훈련한다.
- **문제:** 별도 부서의 사람에 의한 수동 검열이 병목이 된다.
- **해결:** 상시 병합·자동 검증의 CI/CD. 취약점을 앞단으로 당기는 DevSecOps(보안의 Shift-Left). 빌드 실패 시 징계 대신 즉시 복구하는 Stop the Line.
- **적용:** 무중단 롤백의 블루/그린, 리스크 격리의 카나리(Canary) 배포. **카오스 엔지니어링** — 운영 환경에 의도적 결함을 주입해 자가 복구력을 평시에 훈련.
- **선택과 버림:**
  - *전제조건:* 파이프라인이 배포를 자동화할 만큼 신뢰 가능하다.
  - *Trade-off:* 자동화·이중화는 인프라 비용을 늘리나 외부 실패 비용을 줄인다.
  - *실패조건:* 비효율적 프로세스를 먼저 정리하지 않으면 자동화가 낭비를 증폭한다.
  - *판단맥락:* 카오스 주입은 롤백·관측이 갖춰진 뒤에만 안전하다.
- **인용:** Bill Gates(비효율에 자동화를 적용하면 비효율이 증폭된다)[귀속].
- **다음 연결:** 자동화가 작동하려면 개발자 경험과 조직 구조는 어때야 하는가.

## Session 11. 개발자 경험(DX)과 아키텍처 (Team Topologies)
- **학습목표:** 인지 부하를 제어하고, 조직 구조로 아키텍처를 유도한다.
- **문제:** 로컬 빌드 지연 등 열악한 인프라가 인지 부하 초과시켜 예방 의지를 소멸시킨다.
- **해결:** 복잡성이 인지 부하 한계를 넘으면 무결성이 붕괴한다. 사일로의 소통 단절이 스파게티 코드를 낳는 Conway의 법칙.
- **적용:** 독립 배포를 위해 목적 조직으로 재편하는 역방향 콘웨이 전략. 인프라 복잡성을 셀프 서비스로 추상화하는 내부 플랫폼 엔지니어링.
- **선택과 버림:**
  - *전제조건:* 플랫폼 팀에 투자할 조직 규모·여력이 있다.
  - *Trade-off:* 플랫폼 추상화는 초기 구축 비용을 요구하나 작업자를 비즈니스 로직에 집중시킨다.
  - *실패조건:* 소규모 조직에 무거운 플랫폼 팀을 만들면 오버헤드가 이득을 넘는다.
  - *판단맥락:* MSA를 원하면 코드보다 조직 구조부터 독립 배포 단위로 나눈다.
- **인용:** Conway(시스템 구조는 조직의 소통 구조를 복제한다).
- **다음 연결:** 이 파이프라인의 건강을 무엇으로 측정하는가.

## Session 12. 방어적 품질 지표 설계 — DORA 매트릭스
- **학습목표:** 상호 견제하는 지표를 설계하고, 진단용과 평가용을 분리한다.
- **문제:** 불가능한 낡은 KPI('버그 0%')가 결함 은폐와 방어적 태업을 유발한다.
- **해결:** 속도(배포 빈도·변경 리드타임)와 안정성(변경 실패율·MTTR)이 상호 견제하는 DORA 4대 매트릭스.
- **적용:** **지표 설계 원리의 소유 세션** — 지표는 평가용 통제가 아니라 진단용 피드백이다(§S09 Goodhart의 설계적 귀결). 실시간 대시보드로 가시성 확보.
- **선택과 버림:**
  - *전제조건:* 지표를 개인 고과와 절연하겠다는 리더십 약속이 있다.
  - *Trade-off:* 속도만 강조하면 품질이 무너지고 안정성만 강조하면 릴리즈가 멈춘다.
  - *실패조건:* 4개 지표 중 하나만 KPI로 뽑으면 나머지가 조작된다.
  - *판단맥락:* 수집된 지표를 보상에 직결하는 순간 데이터 조작이 시작된다.
- **인용:** Goldratt(측정 방식이 행동을 정한다) — S05·S09와 나선 연결.
- **다음 연결:** 지표가 정직하려면 보상 시스템을 어떻게 바꿔야 하는가.

## Session 13. 시스템 미비와 보상 체계의 재설계
- **학습목표:** 예방에 보상을 정렬하고, 실패를 학습으로 전환하는 문화를 완성한다.
- **문제:** 리더십의 무리한 일정 강요 한 번에 하위 두 주체의 방어가 무너지는 구조적 취약성.
- **해결:** 소방수(사후 수습) 영웅주의를 폐기하고 예방 활동(리팩토링·테스트)에 시간과 인센티브를 부여. 실패 책임을 추궁하지 않는 비난 없는 포스트모템(Blameless Post-mortem).
- **적용:** 개인 성과에서 집단 코드 소유권(Collective Ownership)으로 전환. 스프린트의 일정 비율을 예방 활동에 공식 할당.
- **선택과 버림:**
  - *전제조건:* 보상 변경 권한을 가진 경영진이 개혁의 주체로 참여한다.
  - *Trade-off:* 예방 시간 할당은 단기 기능 산출을 줄이나 실패 비용을 구조적으로 낮춘다.
  - *실패조건:* 문화만 선언하고 보상·일정을 그대로 두면 예방은 다시 실종된다.
  - *판단맥락:* 사고를 내야 보상받는 구조에서는 아무도 예방에 시간을 쓰지 않는다.
- **인용:** Deming(두려움을 몰아내라) — S02와 나선 연결.
- **다음 연결:** AI가 이 3주체의 역할을 어떻게 바꾸는가.

## Session 14. 품질의 미래 — AI 시대의 QA
- **학습목표:** 비결정론적 AI 산출물의 리스크를 통제하고, 검증을 자동화한다.
- **문제:** AI의 환각(Hallucination)과 예측 불가능한 산출물에 대한 통제력 상실. 생성 속도가 폭증할수록 검증·방어 아키텍처의 중요성이 커지는 역설.
- **해결 1 — Guardrail Engineering:** AI의 자유 생성을 조직의 비즈니스·보안 경계 내부로 제한하고, 정책 위반을 입출력 단계에서 강제 필터링. **경계의 진실 원천은 S07의 도메인 온톨로지** — 온톨로지가 허용 개념·관계·제약을 정의하고, 이를 벗어난 출력을 차단한다.
- **해결 2 — Harness & Eval:** 비결정론적 AI 코드를 결정론적 샌드박스(Harness)에 가두어 자동 평가(Eval)하고, 실패 로그 기반 자가 수정을 유도.
- **해결 3 — Context Engineering(AI 적용):** 온톨로지·요구사항·테스트를 구조화된 컨텍스트로 주입해 환각을 줄인다(S07 원리의 AI 재적용).
- **적용:** 최종 무결성은 인간의 몫 — AI는 생산성 도구일 뿐, 상태 무결성·요구 책임은 3주체의 고유 영역.
- **선택과 버림:**
  - *전제조건:* 도메인 온톨로지·평가 기준(Eval)이 먼저 존재한다.
  - *Trade-off:* 가드레일·하네스는 생성 자유도를 낮추나 통제 가능성을 확보한다.
  - *실패조건:* 온톨로지·Eval 없이 AI를 도입하면 그럴싸한 스파게티를 대량 생산한다.
  - *판단맥락:* AI가 잘 만든 코드일수록 근거 없는 코드일 위험이 크다 — 역방향 추적이 필수.
- **인용:** Dijkstra(테스트는 결함 부재를 증명 못 한다) — S04와 나선 연결, AI 검증의 한계에 적용.
- **다음 연결:** 지금까지의 도구·문화를 하나의 운영 체계로 어떻게 통합하는가.

## Session 15. QM Operating Model (통합 운영 모델)
- **학습목표:** 개별 도구·문화를 단일 운영 체계로 통합해 회귀를 방지한다.
- **문제:** 강압적으로 도입(Adoption)된 프로세스는 위기가 오면 가장 먼저 버려진다.
- **해결:** 5대 요소의 유기적 결합 — **원칙(Shift-Left) · 문화(Blameless) · 프로세스(Context Engineering) · 자동화(CI/CD) · 지속적 개선(PDCA).**
- **적용(3주체 통합 운영):**
  - 작업자: 방어적 설계(Rich Model)와 온톨로지 내재화.
  - QA: 가드레일·하네스를 활용한 예방 조력 자동화.
  - 경영진: 지표 기반 피드백 수용과 환경 보호 스폰서십.
- **선택과 버림:**
  - *전제조건:* 5요소 중 문화(Blameless)가 이미 작동한다.
  - *Trade-off:* 통합 운영은 표준화 비용을 요구하나 개인 이탈에도 품질을 유지시킨다.
  - *실패조건:* 외부 지시로 강제 이식하면 위기에 가장 먼저 폐기된다.
  - *판단맥락:* 억지로 지키는 규제가 아니라 숨 쉬듯 하는 습관이 될 때만 내재화다.
- **인용:** Deming(최선을 다하는 것만으로는 부족하다) — 무엇을 할지 알고 나서 최선을.
- **다음 연결:** 이 운영 모델을 내일 당장 실행 가능한 한 조각으로 어떻게 자르는가.

## Session 16. 워크숍 2 — 품질 파이프라인 액션 플랜
- **학습목표:** 단일 병목을 타파할 솔루션을 매핑하고, 점진 실행을 선언한다.
- **문제:** 16시간의 이상론을 현장으로 가져가지 못하면 아무것도 바뀌지 않는다.
- **해결:** S08에서 식별한 단일 병목에 2일 차 기법을 매칭. 빅뱅 도입을 배제한 파일럿(Pilot) 점진 적용.
- **적용:** 각 주체별 "내일 멈출 행동(Stop) 1개 / 시작할 행동(Start) 1개" 명문화. 선언한 액션을 스크럼 백로그에 기술 부채로 공식 등록.
- **선택과 버림:**
  - *전제조건:* 실행 권한을 가진 주체가 워크숍에 함께 있다.
  - *Trade-off:* 파일럿은 확산 속도를 늦추나 실패 비용을 국소화한다.
  - *실패조건:* Start만 선언하고 Stop을 선언하지 않으면 부하만 늘어난다.
  - *판단맥락:* 백로그에 등록되지 않은 선언은 다음 스프린트에 사라진다.
- **다음 연결:** 품질은 단일 프로젝트가 아니라 영원한 여정이다.

---

# 부록 A. 검증 인용 자산 (기계 판독 형식)

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

# 부록 B. 변경 이력

## B-1. v4.0 → v4.1 (인용 자산 검증 · 시각 문법)

| 구분 | v4.0 | v4.1 |
|---|---|---|
| 인용 | 세션 골격의 필수 항목 | **조건부** — 자산에 맞는 인용이 없으면 0장도 정당하다 |
| 인용 검증 | [원전]/[귀속] 2등급, 사람이 판단 | **id + PRIMARY/WIDELY-CITED 등급**, 검증기가 원문 문자열 대조(환각·의역 차단) |
| 인용 재사용 | 규정 없음 | 세션 간 재사용 허용 / 세션 내 중복 금지 |
| 분량 | 본문 최소 15~20장 | **본문 12~17장**(구 규격 폐기 — 분량 하한이 개념 중복을 유발) |
| 시각화 | 규정 없음(사실상 표·박스로 수렴) | **§0.6 시각 문법** — 선택 규칙 + 세션별 필수 시각 자산 + 어휘 트리거 주입 |
| 수치 | 본문에 수치만 서술 | 수치가 명제이면 `share`/`magnitude`로 그리고 `caption`에 출처·한계를 명시 |

**인용 재평가 결과(21건):** 기각 0건. 등급 강등 6건 — `Q-DEMING-BADSYS`, `Q-DEMING-BESTEFFORT`, `Q-DEMING-SURVIVAL`, `Q-HOPPER-ALWAYS`, `Q-HUMPHREY-MAP`, `Q-GATES-AUTOMATION`이 [귀속] → `WIDELY-CITED`로 확정되고 각각 SRC에 한계가 명시됐다. 이들은 원전 문구가 확인되지 않지만 업계에서 널리 통용되는 명제이므로 **주석과 함께 사용한다**. 무명 출처나 특정 국가·산업의 관행을 정설로 포장한 자료는 애초에 자산에 없었다.

## B-2. v4.1 → v4.2 (단문 슬라이드 · 강사 노트 · 출처 URL)

| 구분 | v4.1 | v4.2 |
|---|---|---|
| 슬라이드 골격 | 전 슬라이드가 질문+리드+시각화+결론 5단 | **`statement`(단문) 예외 신설** — 한 문장만 보여주는 장 |
| 인용 전용 슬라이드 | `quotes`(3인 나열) | **폐기** — 인용은 한 장에 하나, `statement`로 |
| 강사 노트 | 없음 | `notes` 필드 + **인용 출처·원문·URL 자동 첨부**(엔진이 자산에서 읽는다) |
| 인용 자산 | ID·등급·세션 태그 | **`URL` 필드 추가** — 검증에 실제로 쓴 출처만 기재 |
| caption | 10pt 한 줄 | **8pt·최대 3줄** — 근거·한계 전용. 해설은 `note`(14pt)로 |
| 세션 번호 | 로마자(I·II·…) | **아라비아(1·2·…16)** — 로마자는 읽기에 어색해 폐기. 슬라이드 연번은 두 자리(01·02) |

## B-3. v2.1 대비 주요 변경 이력

| 구분 | v2.1 | v3.1 (보완) |
|---|---|---|
| 중복 | Chaos Engineering이 S10·S14 이중 | S10으로 단일화(운영 복원력) |
| 중복 | Rich Domain Model S02·S07 | 원리 소유 S07로 단일화 |
| 중복 | 지표 오염 분산(S05/S09/S12) | S09 도입 + S12 설계 소유 규칙화 |
| 일관성 | S03/S04 "표준 이해 1/2" | S03 ISO(체계) / S04 성숙도로 성격 명확화 |
| 일관성 | S15 "일상 내재화"(문화) | S15 Operating Model(운영 통합)로 정체성 확정 |
| 일관성 | 직군-주체 매핑 산발 | §0.3 전편 고정 규칙 |
| 명확성 | 학습목표·브리지 없음 | 세션별 학습목표 / 다음 연결 추가 |
| 명확성 | S14 동향 수준 | Guardrail / Harness / Eval / Context Eng로 공학화 |
| Fact | S07 "기능 50% 미사용" | 출처 논쟁으로 제거, Brooks·Bezos로 대체 |
| AI | Context Eng / Ontology 부재 | S07·S14·S15에 반영 |
| 인용 | 본문 인용 없음 | 검증 인용 자산 부록 고정(Brooks·Bezos 포함) |
| 의사결정 | 원리 서술 중심 | 세션별 전제·Trade-off·실패조건·판단맥락 추가 |

---

작성: Gemini  |  개념·요구·피드백: Youngon Kim