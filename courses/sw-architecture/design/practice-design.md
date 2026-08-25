# SW Architecture Practice Design — LLM-Integrated Practice

> **Course ID:** sw-architecture
> **Standard:** `portfolio/practice-standard.md` (필드 상세·운영 규칙의 정본 — 여기서 재정의하지 않는다)
> **Legacy migration provenance:** context v2.6 Practice Pack v1.1의 7개 Practice 전체를 `portfolio/practice-standard.md` §6 필드 스키마로 재구성했으며, 어떤 Practice도 병합·삭제·축약하지 않았다. 각 필드의 한글 원문은 유지하고 원출처는 Git history에 보존된다.
> **Complements, does not replace:** `courses/sw-architecture/lab-design.md` — lab-design.md는 실습 대상·코드·스니펫 대조쌍(스파게티/TS/리치 3벌, Order 도메인 코드)을 소유하고, 이 문서는 학습자가 LLM과 어떻게 상호작용하는가(운영 흐름·개입·평가)를 소유한다. 두 문서는 같은 Order 도메인 사례를 공유하되 서로 다른 층위를 다룬다 — lab-design.md는 "무엇을 실습 소재로 쓰는가", 이 문서는 "그 소재를 LLM과 함께 어떻게 판단으로 바꾸는가".
>
> **Practice Count:** 7 (P1–P7) — Portfolio Quantity/Cadence Rule(practice-standard.md §3)의 16h 과정 기준 6–8개 범위 안, Pack Baseline 지정 Day 1 3개 / Day 2 4개.
> **Total Practice Time:** 약 160분 — 기존 instructional time(16교시) 안에 포함, 별도 운영시간으로 추가하지 않는다.
> **Common Case:** 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황(Order Domain, 기존 Canon 사례 유지 — `portfolio/shared-cases/order-domain.md`, `courses/sw-architecture/lab-design.md`와 공유).

## Placement Note — Pack Baseline T-번호와 실제 curriculum.md 16교시의 관계

Practice Pack v1.1 원문의 `Placement`는 `T03 / T04-T05 / T07 / T10 / T11-T12 / T13-T14 / T15-T16` 형식으로, Unified Portfolio Baseline 자체의 Topic 번호 체계를 따른다. 이는 `courses/sw-architecture/curriculum.md`(정본, 실제 16교시 구조)의 교시 번호와 1:1 대응하지 않는다 — `course-context.md` §4 Critical Gap이 이미 명시한 대로, 실제 커리큘럼은 Structural Baseline 축(Spaghetti→TS→Rich Domain→DIP)에 강하게 배분되어 있고 Decision Basis 축(QA Scenario·대안 비교·ADR)의 세션 밀도가 상대적으로 얕다. Pack의 T-번호는 baseline 자체의 (실제로 구현되지 않은) topic 순서를 가리키는 것이지, 실제 16교시 세션 내용과 무관하다.

아래 Practice Index의 `Curriculum Placement(실제 교시)`는 Pack 원문 T-번호를 **대체하지 않고**, 실제 `curriculum.md` 16교시 내용에 가장 잘 들어맞는 삽입 지점을 Course Design 판단으로 추가 매핑한 것이다. Pack 원문 Placement는 각 Practice 섹션에 `Pack Baseline Placement`로 그대로 보존한다. Day 1(교시1–8)/Day 2(교시9–16) 3개/4개 cadence는 두 체계 모두에서 동일하게 유지된다. 세션이 50분을 넘어서는 것은 위반이 아니다 — practice-standard.md §3: "Topic은 50분 고정 단위가 아니다. Practice 위치 때문에 Topic을 기계적으로 50분에 맞추지 않는다."

## Operating Rules (practice-standard.md §2, §5 적용; Pack v1.1 Operating Rules와 동일)

- 실습 시작 시 Recommended Prompt를 제공하지 않는다. 학습자가 먼저 자신의 Prompt와 작업 접근을 설계한다(Phase B).
- 시작 후 5–10분에 Instructor Intervention을 제공한다(Phase C).
- 학습자는 새 과제로 재시작하지 않고 **Keep Going**하며 Prompt·산출물·판단을 개선한다(Phase D).
- 종료 시 Recommended Prompt와 Prompt Design Intent를 공개한다(Phase E). Recommended Prompt는 정답이 아니며, 자신의 Context에 맞게 유지·삭제·수정한다.
- 평가 대상은 Prompt 문장력이 아니라 **Course-owned decision, evidence, trade-off, failure condition**의 품질이다 — 여기서 Course-owned은 SWA OWNER(Architecture Driver / Dependency Rule / ADR / Evaluation / Fitness Function / Evolution)를 뜻한다.
- LLM 사용이 Concept OWNER를 이동시키지 않는다(practice-standard.md §9) — SW Architecture Practice에서 quality-driven structure를 판단하면 그 판단은 여전히 **SWA OWNER**다.

## Practice Index

| ID | Pack Baseline Placement | Curriculum Placement(실제 교시) | Practice | Timebox | Course Ownership |
|---|---|---|---|---:|---|
| P1 | T03 | 교시6 도입부(아키텍처 스타일 개관 직전) | Quality Attribute Scenario | 20분 | Architecture Drivers |
| P2 | T04/T05 | 교시6(아키텍처 스타일 개관, 대안 비교부) | Structure Alternatives & Trade-offs | 25분 | Architecture Decision |
| P3 | T07 | 교시8(스파게티 → TS 전환, Repository/DTO 도입 시점) | Policy vs Detail Dependency | 20분 | Dependency Rule |
| P4 | T10 | 교시11(유스케이스·포트 — Payment/Inventory/Shipping 포트 도입, DIP 결정) | ADR from Decision Evidence | 20분 | ADR / Trade-off |
| P5 | T11/T12 | 교시12(리치 완성·의존성 검증 — ArchUnit 게이트) | Scenario-based Architecture Evaluation | 25분 | Architecture Evaluation |
| P6 | T13/T14 | 교시13(인프로세스 도메인 이벤트 — 결합 완화 이후 보호 특성 확장) | Fitness Function / Conformance Rule | 25분 | Architecture Enforcement |
| P7 | T15/T16 | 교시15(MSA 티저 — "왜 모놀리스 먼저였나"를 새 evidence로 재평가) | Evolution Decision under New Evidence | 25분 | Evolutionary Architecture |

**Day 1 (교시1–8):** P1, P2, P3 — 3개. **Day 2 (교시9–16):** P4, P5, P6, P7 — 4개. Pack Baseline의 Day 1 3개/Day 2 4개 cadence를 실제 교시 재배치 후에도 그대로 보존한다.

---

## P1. Quality Attribute Scenario

| Field | Content |
|---|---|
| **Practice ID / Title** | P1 — Quality Attribute Scenario |
| **Pack Baseline Placement** | T03 |
| **Curriculum Placement(실제 교시)** | 교시6 도입부 — 아키텍처 스타일 개관 직전. 스타일 대안을 비교하기 전에 먼저 검증 가능한 driver를 만든다. |
| **Course Ownership** | Architecture Drivers — SWA OWNER |
| **Decision Practiced** | 막연한 품질 요구를 검증 가능한 scenario로 어떻게 바꿀 것인가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | "빠르고 안정적" 요구를 stimulus/context/response/measure로 구체화한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | "빠르고 안정적" 요구를 stimulus/context/response/measure로 구체화한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 정상 부하와 peak 부하, 허용 가능한 degradation 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n품질 형용사를 측정 가능한 quality attribute scenario로 바꾸고 아직 모르는 수치를 질문으로 남겨라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P2. Structure Alternatives & Trade-offs

| Field | Content |
|---|---|
| **Practice ID / Title** | P2 — Structure Alternatives & Trade-offs |
| **Pack Baseline Placement** | T04/T05 |
| **Curriculum Placement(실제 교시)** | 교시6 — 아키텍처 스타일 개관(레이어드·헥사고날·오니온·클린)의 대안 비교부. P1의 QA scenario를 입력으로 사용한다. |
| **Course Ownership** | Architecture Decision — SWA OWNER |
| **Decision Practiced** | driver에 대해 어떤 구조 대안이 무엇을 사고 무엇을 지불하는가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 2~3개 구조 대안을 비교하고 gain/cost/risk를 기록한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 2~3개 구조 대안을 비교하고 gain/cost/risk를 기록한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 운영 인력과 변경 빈도 제약을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n패턴 이름을 정답으로 고르지 말고 drivers와 constraints에 대해 대안별 gain/cost/risk를 비교하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P3. Policy vs Detail Dependency

| Field | Content |
|---|---|
| **Practice ID / Title** | P3 — Policy vs Detail Dependency |
| **Pack Baseline Placement** | T07 |
| **Curriculum Placement(실제 교시)** | 교시8 — 스파게티 → TS 전환. Repository/DTO가 처음 도입되는 시점으로, 어떤 detail을 경계 뒤로 숨길지 결정하는 실제 순간과 일치한다. |
| **Course Ownership** | Dependency Rule — SWA OWNER |
| **Decision Practiced** | 어떤 정책을 volatile detail에서 보호해야 하는가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 의존성 구조를 분석하고 inward dependency를 위한 최소 경계를 제안한다. |
| **Timebox** | 20분 |
| **Initial Instruction** | 의존성 구조를 분석하고 inward dependency를 위한 최소 경계를 제안한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | DB 교체 가능성은 낮고 외부 결제 API 변동성은 높다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n변동 evidence가 있는 detail만 분리하고 불필요한 layer/interface를 만들지 않는 최소안을 제시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P4. ADR from Decision Evidence

| Field | Content |
|---|---|
| **Practice ID / Title** | P4 — ADR from Decision Evidence |
| **Pack Baseline Placement** | T10 |
| **Curriculum Placement(실제 교시)** | 교시11 — 유스케이스·포트. Payment/Inventory/Shipping 포트(DIP) 도입이라는 실제 아키텍처 결정이 이 교시에서 일어난다 — ADR로 남길 첫 번째 소재. |
| **Course Ownership** | ADR / Trade-off — SWA OWNER |
| **Decision Practiced** | 어떤 의사결정을 ADR로 남길 가치가 있는가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | context/options/decision/consequence를 담은 ADR 초안을 만든다. |
| **Timebox** | 20분 |
| **Initial Instruction** | context/options/decision/consequence를 담은 ADR 초안을 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 선택이 되돌리기 어렵고 migration cost가 크다는 정보를 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n결론보다 context, considered options, trade-off, consequences, revisit trigger가 드러나는 ADR을 작성하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P5. Scenario-based Architecture Evaluation

| Field | Content |
|---|---|
| **Practice ID / Title** | P5 — Scenario-based Architecture Evaluation |
| **Pack Baseline Placement** | T11/T12 |
| **Curriculum Placement(실제 교시)** | 교시12 — 리치 완성·의존성 검증. ArchUnit(의존 방향)+캡슐화 린터 게이트가 이미 걸리는 교시로, "이 구조가 주요 scenario에서 어디서 깨지는가"를 같은 시점에 묻는다. |
| **Course Ownership** | Architecture Evaluation — SWA OWNER |
| **Decision Practiced** | 설계가 주요 scenario에서 어디서 깨질 수 있는가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 핵심 scenario로 architecture risk와 sensitivity point를 찾는다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 핵심 scenario로 architecture risk와 sensitivity point를 찾는다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 장애 시나리오와 보안 제약을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n설계를 칭찬하지 말고 scenario별 risk, sensitivity, trade-off point와 필요한 evidence를 찾으라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P6. Fitness Function / Conformance Rule

| Field | Content |
|---|---|
| **Practice ID / Title** | P6 — Fitness Function / Conformance Rule |
| **Pack Baseline Placement** | T13/T14 |
| **Curriculum Placement(실제 교시)** | 교시13 — 인프로세스 도메인 이벤트. 결합을 완화한 직후, 새로 얻은 특성(느슨한 결합)을 포함해 어떤 특성을 fitness function 후보로 확장할지 다룬다. |
| **Course Ownership** | Architecture Enforcement — SWA OWNER |
| **Decision Practiced** | 어떤 아키텍처 특성을 자동 검증할 가치가 있는가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 중요 rule을 executable fitness/conformance check 후보로 만든다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 중요 rule을 executable fitness/conformance check 후보로 만든다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 모든 규칙 자동화 비용이 높다는 제약을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n가치·검증가능성·오탐비용 기준으로 자동화할 규칙과 사람 검토로 남길 규칙을 구분하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## P7. Evolution Decision under New Evidence

| Field | Content |
|---|---|
| **Practice ID / Title** | P7 — Evolution Decision under New Evidence |
| **Pack Baseline Placement** | T15/T16 |
| **Curriculum Placement(실제 교시)** | 교시15 — MSA 티저. "왜 모놀리스 먼저였나"를 새 workload/조직/비용 evidence로 재평가하는 것이 이 교시의 실제 내용과 정확히 일치한다. |
| **Course Ownership** | Evolutionary Architecture — SWA OWNER |
| **Decision Practiced** | 새 evidence가 나왔을 때 어떤 결정을 유지/변경할 것인가 |
| **Work Context** | 주문 플랫폼이 새로운 품질 요구와 변경 압력을 받아 구조 대안·의존성·평가·진화를 결정해야 하는 아키텍처 상황 |
| **Preconditions** | 해당 Placement까지의 핵심 개념을 학습했고, 필요한 입력자료와 LLM 접근이 준비되어 있으며, 최종 판단·검증 책임은 학습자에게 있다. |
| **Inputs** | 공통 사례 설명, 해당 Topic까지 학습한 판단 기준, 직전 Practice 산출물(있는 경우), 강사가 제공한 제약·Evidence |
| **Deliverable** | 새 workload/조직/비용 evidence에 따라 기존 ADR을 재평가한다. |
| **Timebox** | 25분 |
| **Initial Instruction** | 새 workload/조직/비용 evidence에 따라 기존 ADR을 재평가한다. 필요한 Prompt와 Context는 학습자가 직접 구성한다. |
| **Intervention** (5–10분 후) | 초기 예측과 실제 운영 데이터가 다르다는 조건을 추가한다. |
| **Evidence of Learning** | 최초 LLM 출력에서 누락·과잉·가정 오류를 식별한다. Intervention 이후 선택/거절/수정의 근거가 Course Principle에 연결된다. 최종 산출물이 실제 업무에서 재사용 가능한 수준으로 정리된다. |
| **Recommended Prompt** | ```text\n기존 결정을 존중하되 새 evidence로 keep/change/reverse를 판단하고 migration cost와 trigger를 명시하라.\n입력자료와 현재 Context를 사용하고, 모르는 사실은 가정하지 말고 질문/불확실성으로 남긴다.\n최종 답에는 선택한 안, 버린 안, trade-off, failure condition, 추가 확인 evidence를 포함한다.\n``` |
| **Prompt Design Intent** | Prompt는 정답 형식을 강제하지 않고 해당 과정의 판단축·경계·검증을 외부화한다. |
| **Trade-off** | 빠른 대안 탐색과 critique를 얻지만 검증·선택 책임은 학습자에게 남는다. |
| **Failure Condition** | LLM 제안을 근거 없이 권위로 채택하거나 Course Ownership 밖의 결정을 대신 맡길 때. |
| **Transfer** | 동일 판단 구조를 실제 프로젝트의 자료와 제약으로 바꿔 재사용한다. |

---

## Optional / Reference Candidates When Time Is Tight

Time-pressure Rule(practice-standard.md §11)에 따라, Core Narrative와 7개 Practice는 유지하고 다음 상세만 강의 중 생략 가능 계층으로 이동할 수 있다(삭제하지 않음):

- ATAM 정식 facilitator procedure/certification 상세(verified-sources.md §6 참조 — 범위 밖으로 이미 명시됨)
- Clean Architecture 4-layer 동심원 그림의 다수 변형 표기
- 디자인 패턴(Adapter/Strategy/Factory/Observer/Template) 각각의 추가 예제
- MSA 분산 패턴(Service Boundary/Saga 등)의 상세 — MSA OWNER, 이름만 예고
- Fitness Function 도구(ArchUnit 외 대안)의 상세 비교

## Course Practice Quality Gate (Pack v1.1 원문 그대로 유지)

- 7개 Practice가 과정 전반에 분산되어 있는가?
- 모든 Practice가 15–30분 범위인가?
- Recommended Prompt를 마지막에만 공개하는가?
- Intervention이 정답이 아니라 추가 관점/제약/evidence를 제공하는가?
- 기존 OWNER/RECAP/APPLY/FORWARD 경계를 유지하는가?
- 기존 instructional time 한도를 넘기지 않는가?
- 강의 상세는 삭제보다 Optional/Reference/Appendix로 보존하는가?
- (본 문서 추가 확인) Curriculum Placement(실제 교시) 재배치가 Pack Baseline Placement의 순서·Day1/Day2 cadence를 훼손하지 않는가?
