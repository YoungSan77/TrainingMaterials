# QM 커리큘럼 (온톨로지 · 산출물) > 버전: v4.3 (2026-07, v4.2를 온톨로지 포맷으로 재구성)

> "무엇을 가르칠지"의 기계 판독 모델. **한 문서**다. 형식·시각·인용 규칙은 여기 없다 — `교재_작성_지침.md`에 있다.
> 원본 `QM_교육_커리큘럼_v4_0.md`를 신 포맷으로 리팩토링. 조정 두 가지: (1) 구 §0.5(분량 15~20장 등)는 형식 어휘라 제거 — 정본은 교재 작성 지침(12~17장). (2) 인용 자산은 id·세션태그가 붙은 machine 형식(구 부록 A의 enriched 버전).

---

## A0. 과정 개요
- **제목:** 현대적 품질 관리(Modern QM) · **부제:** 프로세스 내재화와 품질 파이프라인
- **목적:** 품질을 테스트 활동이 아니라 시스템 설계로 재정의하고, 요구사항부터 운영까지 하나의 품질 파이프라인을 구축한다.
- **대상:** SW 개발자, QA, PM, Architect, BA, Designer, 관리자, 경영진 (Full-Stack Stakeholders)
- **형식:** 2일 / 총 16세션 (세션당 50분 강의 + 10분 휴식)
- **전개 축:** Why → What → How → Operate (Day1 = 예방 철학, Day2 = 자동화·운영). Shift-Left는 특정 세션이 아니라 전 과정 공통 원칙.
- **과정 철학:** 모든 문제는 시스템의 문제다 — 개인의 문제가 아니다.

## 용어 규칙 (이 교재 고정)
- 표준 용어만 사용: **시스템, 수준, 보상 시스템, 시스템 미비, 이해 없는 개입, 작업, 요구사항**.
- "레벨" 금지 → **수준**. "감리"(제도 색채) 금지 → **감사 / 독립 검토**.
- 특정 국가·시장 관행(예: SI 감리 제도)은 배제. 보편 SW 공학 원칙과 비용 대비 효율만 기준.

## 역할 매핑 (직군–3주체)
- 3주체 = **작업자 / QA / PM·경영진**.
- BA·Architect·Designer는 작업자 주체의 **선행 방어 직군**으로 흡수(별도 4주체 아님). BA=요구 모호성 제거, Architect=복잡성·인지 부하 제어, Designer=휴먼 에러 예방.

## A1. 개념 소유 매트릭스
개념마다 원리 소유 세션 1개. 재등장은 "심화·적용"으로만 표기하고 원리를 다시 정의하지 않는다. **이 매트릭스가 세션 상세화의 범위를 고정한다(반복이 발산하지 않고 종료됨).**

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

---

## A2. 세션 노드

> 각 노드의 **문제 → 해결 → 적용**은 덱의 **현상 → (원인) → 원칙 → 적용** 전개로, **선택과 버림**은 **타협** 분류로 매핑된다(교재 작성 지침 §2). 분류별 최소 1장은 덱 생성이 보장한다. **시각 지정**은 그림이어야 하는 명제만 명시(나머지 타입은 덱 생성이 선택).

### S01. 품질 패러다임 전환과 Shift-Left
- **목표:** 품질을 테스트가 아닌 시스템 관점에서 정의하고, Shift-Left를 전 과정 공통 원칙으로 설명.
- **문제:** 기획-개발-테스트 사일로의 산출물 떠넘기기·핑퐁. "품질=테스트 부서 책임" 착각.
- **해결:** 재작업 비용(CoQ)·결함 이관 비용(Boehm) — 로컬을 벗어날수록 수정 비용 폭증. 통제력을 릴리즈 직전에서 앞단으로 당기는 Shift-Left.
- **적용:** 결함 94%는 시스템 미비(Deming). 질의를 "누가"→"무엇이 원인인가"로.
- **선택과 버림:** 전제=탓하지 않는 문화 의지 / Trade-off=앞단 검증이 초기 속도 내주고 총 리드타임 단축 / 실패=예방을 비용으로만 보는 권한 상존 시 형식만 / 판단맥락=로컬 검증 건너뛴 속도는 100배 부채.
- **인용 ref:** `[Q-DEMING-BADSYS, Q-CROSBY-FREE, Q-DEMING-TOOLATE, Q-DEMING-94-6]`
- **시각 지정:** 94:6 → `statement`(그림 금지) · 1:10:100 → `magnitude` · Shift-Left → `pipeline`
- **다음 연결:** 이 시스템을 방어하는 세 주체는 누구인가.

### S02. 품질을 만드는 3주체와 R&R
- **목표:** 작업자·QA·경영진의 예방 중심 역할을 구분하고, R&R 경계의 빈틈을 설계로 막는다.
- **문제:** 장애 수습을 영웅시하는 보상이 예방을 실종시킨다. "모두의 책임"이 "누구의 책임도 아님"으로 붕괴.
- **해결:** 탓하지 않는 문화(Blameless)가 3주체 협력의 전제. 비난은 결함 정보를 은폐시키는 가장 강한 힘.
- **적용:** 작업자=상태 무결성 자기 방어(예방 로직 내재화) / QA=사후 검열 탈피, 앞단 예방 조력(서번트 리더십) / 경영진=무리한 일정 차단, 방어 인프라 스폰서십 / 선행 직군 BA·Architect·Designer가 상류 결함 유형별 방어.
- **선택과 버림:** 전제=보고자 비처벌 심리적 안전 / Trade-off=R&R 세분은 명확하나 경직, 겹치면 유연하나 책임 희석 / 실패=경계를 핑퐁 도구로 쓰면 책임 회피 근거 / 판단맥락=예방 주체 미지정 시 예방은 실행되지 않는다.
- **인용 ref:** `[Q-DEMING-FEAR, Q-GREENLEAF-SERVANT, Q-DEMING-BADSYS]`
- **시각 지정:** 3주체 책임 경계·빈틈 → `flow`
- **다음 연결:** 이 역할을 뒷받침하는 표준은 무엇인가.

### S03. 글로벌 품질 표준 1 — ISO 9001
- **목표:** QMS의 목적을 규제 통과가 아니라 결과의 예측 가능성으로 재정의.
- **문제:** 실제 작업과 분리된 감사용 "이중 장부"를 양산하는 형식주의.
- **해결:** ISO 9001의 본질은 PDCA 개선 루프. 표준은 지키는 벽이 아니라 계속 높이는 기준선. 프레임워크 매핑 — ISO(개선 체계)/CMMI(조직 성숙도)/SPICE(프로세스 역량)는 상호 보완.
- **적용:** 문서를 위한 문서를 폐기하는 Lean QMS. 요건을 형상 관리·파이프라인에 녹여 증거 자동 생성.
- **선택과 버림:** 전제=개선 루프가 실제로 도는 조직(문서가 작업에서 파생) / Trade-off=QMS 무거우면 통제, 가벼우면 속도(위험도로 균형) / 실패=인증 획득이 유일 목적이면 표준은 지표이길 멈춘다 / 판단맥락=위험 낮은데 무거운 표준은 비용만 증폭.
- **인용 ref:** `[Q-DEMING-IMPROVE, Q-DEMING-NOINSPECT, Q-DEMING-TOOLATE, Q-DEMING-SURVIVAL]`
- **시각 지정:** 필수 지정 없음(덱 생성이 선택).
- **다음 연결:** 개선을 등급으로 진단하는 성숙도 모델은 무엇인가.

### S04. 프로세스 성숙도 — CMMI & SPICE
- **목표:** 성숙도 모델을 심판이 아니라 진단 거울로 쓰고, 양방향 추적성을 설계.
- **문제:** 성숙도를 평가·문책 무기로 쓸 때의 지표 조작·거짓 성숙.
- **해결:** L1(영웅주의)→L5(최적화)는 개인 의존→시스템 관리 축. V-Model은 방법론이 아니라 정의와 검증의 대응 관계.
- **적용:** 양방향 추적성 — Forward(요구→코드)/Backward(코드→요구). 도구 범주(이슈 트래커·버전 관리·정적 분석기) 연동으로 추적을 시스템이 강제.
- **선택과 버림:** 전제=두려움 없는 보고 문화·식별자 규칙 정착 / Trade-off=깊은 추적은 통제 주고 속도 뺏음(위험도로 깊이) / 실패=수준을 평가 무기로 쓰면 진단 정보 오염 / 판단맥락=총괄 등급보다 약한 프로세스 특정이 개선에 유용.
- **인용 ref:** `[Q-HUMPHREY-MAP, Q-DEMING-SURVIVAL, Q-HOPPER-ALWAYS]`
- **시각 지정:** 필수 지정 없음.
- **다음 연결:** 이 표준 준수를 어떻게 상시로 검증하는가.

### S05. 감사(Audit)와 상시 준수(Continuous Compliance)
- **목표:** 감사를 통과 관문에서 시스템 미비를 찾는 피드백 루프로 재정의.
- **문제:** 감사철에 개발을 멈추고 과거 산출물을 소급 조작하는 파괴적 이벤트화.
- **해결:** 방어적 태도(처벌 회피) vs 개선적 태도(미비 발견)가 성과를 가른다. 산출물 감사→프로세스 감사로 대상 이동.
- **적용:** 커밋·테스트 로그 자체가 감사 증거인 상시 준수. 결과는 등급이 아니라 개선 백로그로. 지표 오염(Goodhart, S09 도입)의 감사 적용 — LOC·커버리지 강요 배제.
- **선택과 버림:** 전제=자동 기록 체계·미비 비처벌 / Trade-off=감사 무거우면 통제, 가벼우면 속도이자 조작 유인 감소 / 실패=독립성 없으면 자동 감사도 만든 사람 맹점 계승 / 판단맥락=지표를 고과에 연동하는 순간 데이터 진실성 소멸.
- **인용 ref:** `[Q-DEMING-NOINSPECT, Q-DEMING-IMPROVE, Q-HOPPER-ALWAYS, Q-STRATHERN-MEASURE]`
- **시각 지정:** 감사→시정→재감사 상시 준수 → `loop`
- **명제:** 한 줄이 한 장의 주장이다. 분류는 그 장의 kind가 된다. 학습 목표·요약은 회수·예고이므로 명제를 갖지 않는다.
  - `C1` [현상] 감사철에 개발을 멈추고 과거 산출물을 소급 조작한다
  - `C2` [현상] 같은 감사도 태도가 결과를 가른다 — 처벌 회피 vs 미비 발견
  - `C3` [원인] 감사를 통과 관문으로 두면 대상이 산출물에 고정된다
  - `C4` [원인] 지표가 고과에 연결되는 순간 데이터의 진실성이 사라진다
  - `C5` [원칙] 감사의 대상은 산출물이 아니라 프로세스다
  - `C6` [원칙] 감사는 관문이 아니라 감사·시정·재감사가 도는 루프다
  - `C7` [원칙] 감사의 결과물은 등급이 아니라 개선 백로그다
  - `C8` [적용] 커밋과 시험 기록 자체가 증거인 상시 준수로 옮긴다
  - `C9` [적용] 강요 지표를 배제하고 지표를 고과에서 분리한다
  - `C10` [타협] 감사의 무게는 통제와 조작 유인 사이에서 정한다
- **반론:** 강사가 받게 될 반박. 슬라이드가 아니라 강사 노트에서 답한다.
  - "감사 없이 어떻게 준수를 보장하나" → 감사를 없애자는 것이 아니라 시점을 옮기자는 것이다
  - "상시 감사는 감시 아닌가" → 대상이 사람이 아니라 프로세스일 때만 성립한다
  - "자동 감사면 독립성은 어떻게 확보하나" → 만든 사람의 맹점을 그대로 계승한다, 그래서 설계 검토가 남는다
- **다음 연결:** 결함을 앞단에서 예방하는 최전선은 무엇인가.

### S06. 예방의 최전선 — 동료 검토(Peer Review)
- **목표:** 검토 유형을 목적별로 분리 적용하고, 인간을 비즈니스 룰 방어에 집중.
- **문제:** 탓하지 않는 문화 부재 시 리뷰가 자존심 싸움·스타일 꼬투리로 전락. 컨텍스트 없는 기계적 승인(LGTM).
- **해결:** 목적 매트릭스 — 워크쓰루(지식 공유)/인스펙션(엄격 적발)/PR(비동기 통합)의 전략적 선택. 문법이 아니라 도메인 무결성·요구 반영을 논의.
- **적용:** 정적 분석기를 앞단에 배치해 기계적 오류를 먼저 걸러내고, 인간은 아키텍처·비즈니스 룰에 집중.
- **선택과 버림:** 전제=리뷰어가 비즈니스 컨텍스트 공유 / Trade-off=인스펙션은 결함 많이 잡으나 리드타임 소모 / 실패=컨텍스트 없이 스타일만 지적하면 핑퐁으로 지연 / 판단맥락=기계가 잡을 오류를 인간이 잡으면 리뷰 설계가 틀린 것.
- **인용 ref:** `[Q-DIJKSTRA-TESTING, Q-FEYNMAN-FOOL]`
- **시각 지정:** 동료 검토 게이트 통과·되돌림 → `pipeline`
- **다음 연결:** 가장 비싼 결함, 요구사항 자체의 결함은 어떻게 막는가.

### S07. 요구사항과 품질 계획 — 가장 비싼 결함 막기
- **목표:** 요구사항 상류 결함을 조기 합의로 차단하고, 제약을 도메인 모델·온톨로지로 형식화.
- **문제:** 코드를 잘 짜도 요구사항이 틀리면 가장 비싼 결함. 자연어 명세·주문 받기식 기획의 한계.
- **해결:** (1) Context Engineering — 도메인·엔지니어링 맥락 단절을 메우는 설계. 3 Amigos(BA·개발·QA)가 유비쿼터스 언어로 엣지 케이스·인수 조건을 착수 전 합의. (2) Rich Domain Model + Ontology — 빈약한 모델(Anemic) 배제, 제약을 객체 내부에 응집. 유비쿼터스 언어를 온톨로지(개념·관계·제약의 형식 모델)로 승격(ERD/DFD→OOAD→DDD→Ontology 계보).
- **적용:** BDD 시나리오가 곧 자동화 테스트가 되는 Living Documentation. 온톨로지는 AI 가드레일의 진실 원천(S14)으로 재사용.
- **선택과 버림:** 전제=도메인 전문가가 합의 테이블에 실제 참여 / Trade-off=Rich Model·온톨로지는 선행 비용 늘리나 불법 상태 변이를 구조로 차단 / 실패=온톨로지를 문서로만 두고 코드·검증과 연결 안 하면 또 다른 이중 장부 / 판단맥락=요구가 자주 뒤집히는 초기 탐색에 무거운 온톨로지는 낭비.
- **인용 ref:** `[Q-BROOKS-HARDEST, Q-BROOKS-SPEC, Q-BEZOS-DISCONTENT, Q-EVANS-HEART]`
- **시각 지정:** 필수 지정 없음.
- **다음 연결:** 1일 차 개념으로 우리 조직의 병목을 어떻게 진단하는가.

### S08. 워크숍 1 — 조직 품질 성숙도 자가 진단
- **목표:** 1일 차 개념으로 팀 성숙도를 매핑하고 단일 병목을 식별.
- **문제:** 개념을 현실에 투영하지 않으면 학습이 관념에 머문다.
- **해결:** CMMI/SPICE 차용 간이 진단지로 부서별 품질 내재화 수준 자가 평가.
- **적용:** 제약 이론(TOC)으로 가치 인도 속도를 결정짓는 가장 치명적 단일 병목 도출(기술 부채·잘못된 보상·이해 없는 개입·모호한 요구 중). 산출물 — 성숙도 히트맵 1장, 단일 병목 진술문 1문장, 2일 차 후보 기법 목록.
- **선택과 버림:** 전제=진단을 평가로 쓰지 않는 합의 / Trade-off=자가 진단은 신속하나 편향(익명·교차 보정) / 실패=병목을 여러 개 나열하면 TOC 집중 효과 소멸 / 판단맥락=병목 아닌 지점 개선은 처리량 불변.
- **인용 ref:** `[Q-HUMPHREY-MAP]`
- **시각 지정:** 필수 지정 없음(워크숍).
- **다음 연결:** 식별한 병목을 자동화로 어떻게 뚫는가.

### S09. 현대적 테스트 전략 — 피라미드와 자동화
- **목표:** 투자 밸런스를 피라미드로 재배분하고, 지표 오염을 식별.
- **문제:** 느리고 깨지기 쉬운 E2E 중심의 아이스크림 콘 구조.
- **해결:** 단위 70/통합 20/E2E 10의 피라미드로 빠르고 견고한 피드백. Goodhart 법칙(지표 오염 원리 도입) — 지표가 목표가 되면 지표이길 멈춘다. TDD를 통제 강요가 아니라 사용자 관점 설계 유도로 재정의.
- **적용:** 무의미한 Mocking·가짜 커버리지 배제.
- **선택과 버림:** 전제=단위 테스트가 빠르고 격리 가능한 설계 / Trade-off=피라미드 하단 투자는 초기 노력 요구하나 회귀 비용 감소 / 실패=커버리지를 고과에 연동하면 숫자만 오르고 검증은 빔 / 판단맥락=재기 쉬운 것을 재면 재야 할 것을 놓친다.
- **인용 ref:** `[Q-STRATHERN-MEASURE, Q-DIJKSTRA-TESTING, Q-DEMING-TOOLATE, Q-DEMING-NOINSPECT, Q-FEYNMAN-FOOL]`
- **시각 지정:** 테스트 피라미드 → `pyramid`
- **다음 연결:** 이 검증을 파이프라인으로 어떻게 상시화하는가.

### S10. 지속적 품질 파이프라인 — DevOps와 CI/CD
- **목표:** 수동 검열을 자동 검증 파이프라인으로 이관하고, 운영 복원력을 훈련.
- **문제:** 별도 부서 사람에 의한 수동 검열이 병목.
- **해결:** 상시 병합·자동 검증 CI/CD. 취약점을 앞단으로 당기는 DevSecOps(보안 Shift-Left). 빌드 실패 시 징계 대신 즉시 복구하는 Stop the Line.
- **적용:** 무중단 롤백의 블루/그린, 리스크 격리의 카나리 배포. 카오스 엔지니어링 — 운영에 의도적 결함 주입해 자가 복구력을 평시 훈련.
- **선택과 버림:** 전제=파이프라인이 배포 자동화할 만큼 신뢰 가능 / Trade-off=자동화·이중화는 인프라 비용 늘리나 외부 실패 비용 감소 / 실패=비효율 프로세스를 먼저 정리 안 하면 자동화가 낭비 증폭 / 판단맥락=카오스 주입은 롤백·관측 갖춘 뒤에만 안전.
- **인용 ref:** `[Q-GATES-AUTOMATION]`
- **시각 지정:** CI/CD 품질 게이트 → `pipeline`
- **다음 연결:** 자동화가 작동하려면 개발자 경험과 조직 구조는 어때야 하는가.

### S11. 개발자 경험(DX)과 아키텍처 (Team Topologies)
- **목표:** 인지 부하를 제어하고, 조직 구조로 아키텍처를 유도.
- **문제:** 로컬 빌드 지연 등 열악한 인프라가 인지 부하를 초과시켜 예방 의지를 소멸.
- **해결:** 복잡성이 인지 부하 한계를 넘으면 무결성 붕괴. 사일로의 소통 단절이 스파게티 코드를 낳는 Conway의 법칙.
- **적용:** 독립 배포를 위한 목적 조직 재편(역방향 콘웨이). 인프라 복잡성을 셀프 서비스로 추상화하는 내부 플랫폼 엔지니어링.
- **선택과 버림:** 전제=플랫폼 팀에 투자할 조직 규모·여력 / Trade-off=플랫폼 추상화는 초기 구축 비용 요구하나 작업자를 비즈니스 로직에 집중 / 실패=소규모 조직에 무거운 플랫폼 팀은 오버헤드가 이득 초과 / 판단맥락=MSA를 원하면 코드보다 조직 구조부터 독립 배포 단위로.
- **인용 ref:** `[Q-CONWAY-STRUCTURE, Q-EVANS-HEART]`
- **시각 지정:** Conway 조직→설계 → `flow`
- **다음 연결:** 이 파이프라인의 건강을 무엇으로 측정하는가.

### S12. 방어적 품질 지표 설계 — DORA 매트릭스
- **목표:** 상호 견제하는 지표를 설계하고, 진단용과 평가용을 분리.
- **문제:** 불가능한 낡은 KPI('버그 0%')가 결함 은폐·방어적 태업을 유발.
- **해결:** 속도(배포 빈도·변경 리드타임)와 안정성(변경 실패율·MTTR)이 상호 견제하는 DORA 4대 매트릭스.
- **적용:** 지표 설계 원리 소유 세션 — 지표는 평가용 통제가 아니라 진단용 피드백(S09 Goodhart의 설계적 귀결). 실시간 대시보드로 가시성.
- **선택과 버림:** 전제=지표를 개인 고과와 절연하는 리더십 약속 / Trade-off=속도만 강조하면 품질 붕괴, 안정성만 강조하면 릴리즈 정지 / 실패=4개 중 하나만 KPI로 뽑으면 나머지 조작 / 판단맥락=수집 지표를 보상에 직결하는 순간 조작 시작.
- **인용 ref:** `[Q-GOLDRATT-MEASURE, Q-STRATHERN-MEASURE]`
- **시각 지정:** 진단 지표 vs 평가 지표(2축) → `quadrant`
- **다음 연결:** 지표가 정직하려면 보상 시스템을 어떻게 바꾸는가.

### S13. 시스템 미비와 보상 체계의 재설계
- **목표:** 예방에 보상을 정렬하고, 실패를 학습으로 전환하는 문화를 완성.
- **문제:** 리더십의 무리한 일정 강요 한 번에 하위 두 주체 방어가 무너지는 구조적 취약성.
- **해결:** 소방수(사후 수습) 영웅주의 폐기, 예방 활동(리팩토링·테스트)에 시간·인센티브. 비난 없는 포스트모템(Blameless Post-mortem).
- **적용:** 개인 성과에서 집단 코드 소유권(Collective Ownership)으로 전환. 스프린트의 일정 비율을 예방 활동에 공식 할당.
- **선택과 버림:** 전제=보상 변경 권한 경영진이 개혁 주체로 참여 / Trade-off=예방 시간 할당은 단기 산출 줄이나 실패 비용을 구조적으로 낮춤 / 실패=문화만 선언하고 보상·일정 그대로면 예방 재실종 / 판단맥락=사고를 내야 보상받는 구조에서는 아무도 예방에 시간을 쓰지 않는다.
- **인용 ref:** `[Q-DEMING-FEAR, Q-DEMING-BADSYS, Q-GREENLEAF-SERVANT, Q-GOLDRATT-MEASURE, Q-DEMING-BESTEFFORT]`
- **시각 지정:** 보상 시스템 악순환 → `loop`
- **다음 연결:** AI가 이 3주체의 역할을 어떻게 바꾸는가.

### S14. 품질의 미래 — AI 시대의 QA
- **목표:** 비결정론적 AI 산출물의 리스크를 통제하고, 검증을 자동화.
- **문제:** AI 환각·예측 불가 산출물의 통제력 상실. 생성 속도가 폭증할수록 검증·방어 아키텍처 중요성이 커지는 역설.
- **해결:** (1) Guardrail Engineering — 자유 생성을 비즈니스·보안 경계 내로 제한, 정책 위반을 입출력에서 강제 필터링. 경계의 진실 원천은 S07 도메인 온톨로지. (2) Harness & Eval — 비결정 AI 코드를 결정론적 샌드박스에 가두어 자동 평가, 실패 로그 기반 자가 수정. (3) Context Engineering(AI 적용) — 온톨로지·요구·테스트를 구조화 컨텍스트로 주입해 환각 감소.
- **적용:** 최종 무결성은 인간의 몫 — AI는 생산성 도구, 상태 무결성·요구 책임은 3주체 고유 영역.
- **선택과 버림:** 전제=도메인 온톨로지·평가 기준(Eval)이 먼저 존재 / Trade-off=가드레일·하네스는 생성 자유도 낮추나 통제 가능성 확보 / 실패=온톨로지·Eval 없이 AI 도입하면 그럴싸한 스파게티 대량 생산 / 판단맥락=AI가 잘 만든 코드일수록 근거 없을 위험 — 역방향 추적 필수.
- **인용 ref:** `[Q-GATES-AUTOMATION, Q-DIJKSTRA-TESTING]`
- **시각 지정:** 필수 지정 없음.
- **다음 연결:** 도구·문화를 하나의 운영 체계로 어떻게 통합하는가.

### S15. QM Operating Model (통합 운영 모델)
- **목표:** 개별 도구·문화를 단일 운영 체계로 통합해 회귀를 방지.
- **문제:** 강압 도입된 프로세스는 위기가 오면 가장 먼저 버려진다.
- **해결:** 5대 요소의 유기적 결합 — 원칙(Shift-Left)·문화(Blameless)·프로세스(Context Engineering)·자동화(CI/CD)·지속적 개선(PDCA).
- **적용:** 작업자=방어적 설계(Rich Model)·온톨로지 내재화 / QA=가드레일·하네스 활용 예방 조력 자동화 / 경영진=지표 기반 피드백 수용·환경 보호 스폰서십.
- **선택과 버림:** 전제=5요소 중 문화(Blameless)가 이미 작동 / Trade-off=통합 운영은 표준화 비용 요구하나 개인 이탈에도 품질 유지 / 실패=외부 지시로 강제 이식하면 위기에 가장 먼저 폐기 / 판단맥락=억지 규제가 아니라 숨 쉬듯 하는 습관이 될 때만 내재화.
- **인용 ref:** `[]`  (자산 없음 — 억지로 채우지 않는다)
- **시각 지정:** 필수 지정 없음.
- **다음 연결:** 이 모델을 내일 실행 가능한 한 조각으로 어떻게 자르는가.

### S16. 워크숍 2 — 품질 파이프라인 액션 플랜
- **목표:** 단일 병목을 타파할 솔루션을 매핑하고, 점진 실행을 선언.
- **문제:** 16시간의 이상론을 현장으로 가져가지 못하면 아무것도 바뀌지 않는다.
- **해결:** S08에서 식별한 단일 병목에 2일 차 기법 매칭. 빅뱅 배제한 파일럿(Pilot) 점진 적용.
- **적용:** 주체별 "내일 멈출 행동(Stop) 1개 / 시작할 행동(Start) 1개" 명문화. 선언한 액션을 스크럼 백로그에 기술 부채로 공식 등록.
- **선택과 버림:** 전제=실행 권한 주체가 워크숍에 함께 / Trade-off=파일럿은 확산 늦추나 실패 비용 국소화 / 실패=Start만 선언하고 Stop 안 하면 부하만 증가 / 판단맥락=백로그에 등록 안 된 선언은 다음 스프린트에 소멸.
- **인용 ref:** `[]`  (자산 없음)
- **시각 지정:** 필수 지정 없음(워크숍).
- **다음 연결:** 품질은 단일 프로젝트가 아니라 영원한 여정이다.

---

## A3. 인용 자산 (verify 파싱 대상 · v4.2 부록 A 원문 그대로)

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
