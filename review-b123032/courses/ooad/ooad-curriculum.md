# OOAD Curriculum

> **Role:** 객체지향 분석과 설계 실무 과정의 course-level entry point / Curriculum SSOT
>
> **Upstream Guardrail:** [`course-design.md`](./course-design.md)
>
> **Teaching Detail Owners:** [`sessions/`](./sessions/)
>
> **Status:** S01~S11 승인 상세설계를 통합한 content baseline. 시간과 최종 slide 범위는 content stabilization 이후 별도 단계에서 확정한다.

---

## 1. Course Overview

- **과정명:** 객체지향 분석과 설계 실무
- **대상:** 절차적 서비스 중심 코드에서 변경 파급과 책임 분산을 경험한 개발자·설계자
- **확정 교육시간:** 16시간
- **목적:** 업무 요구와 변경 압력을 객체의 책임·협력·계약으로 변환하고, 설계 결정을 코드로 이어갈 수 있게 한다.
- **구조:** S01 Overview, S02~S09 OOAD Core, S10~S11 Next Steps

이 과정은 UML 표기법이나 Pattern 이름을 암기하는 과정이 아니다. 문제를 구현 결정과 구분하여 이해하고, 정적·동적 evidence로 객체 경계와 책임을 판단하며, 변화와 실행 evidence에 따라 설계를 다시 검토하는 능력을 기른다.

## 2. Course Thesis

> **OOAD는 현실의 명사를 클래스로 옮기는 작업이 아니라, 문제영역의 본질적 복잡성을 구현 결정과 구분해 이해하고, 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 판단 과정이다.**

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

Session 순서는 학습 progression이며 lifecycle이 아니다. 실제 Engineering은 evidence에 따라 `Requirement ↔ Analysis ↔ Architecture/Design ↔ Code/Test` 사이를 반복한다.

## 3. Capability / Scope / Ownership

### Target Capability

- Analysis를 phase가 아니라 Problem을 Solution과 구분하는 사고 활동으로 적용한다.
- 정적·동적 관점으로 Problem Understanding을 명시하고 상호 검토한다.
- legitimate constraint와 premature solution detail을 구분한다.
- 상태와 행위를 소유할 객체 경계를 찾는다.
- 책임·협력·계약을 통해 변경 영향을 국소화한다.
- evidence와 비용을 근거로 variation mechanism과 Design Alternative를 판단한다.
- 모델과 Code evidence를 왕복하며 필요한 판단 수준을 다시 연다.
- OOAD 이후 개발·검증·운영 및 전문 설계 영역과의 경계를 설명한다.

### Ownership

OOAD는 Problem Understanding, Analysis Modeling, Analysis→Object Design 전환, Responsibility·Collaboration·Message·Contract, Object Boundary, Information Hiding, Cohesion/Coupling, Variation·Dependency와 object-level Design Judgment를 소유한다.

Software Architecture, DDD, MSA, DevOps/SW Quality 상세와 AI-Native 전문 내용은 Big Picture, OOAD Connection, Boundary와 Next Question까지만 다루고 owner 과정으로 넘긴다.

## 4. Learning Progression

```text
S01       Orientation / Why OOAD
S02~S04   Problem Understanding / Analysis
S05~S06   Object Design Formation
S07~S08   Change / Variation / Design Judgment
S09       Integrated OOAD Judgment
S10       Development / Verification / Delivery Handoff
S11       Advanced Engineering Landscape Handoff
```

### Running Example

- S02~S06은 `Place Order → Payment`를 baseline으로 사용한다.
- `ShoppingCart`/`ShoppingCartItem`은 결제 전 선택 상태, `Order`/`OrderItem`은 주문 시점에 확정된 거래 기록이다.
- `Shipment`는 기본 실습의 필수 Concept이 아니다.
- `Order Cancellation / Refund`는 S07의 teaching change로 투입한다.
- Payment는 S07 object-level variation, S08 alternative evaluation, S10 implementation realization, S11 architecture-scale boundary라는 새 질문으로 재사용한다.

## 5. Course Narrative

S01은 왜 문제 이해와 설계 판단이 필요한지 세운다. S02는 고객의 요구를 Event, Use Case, System Operation과 Contract로 구조화하고, S03과 S04는 같은 Problem을 Static과 Dynamic 관점에서 명시한다.

S05는 분석 결과를 Software Class로 기계 변환하지 않고 경험 기반 Initial Design을 만든다. S06은 Responsibility·Message·Object Contract·Collaboration과 GRASP로 이를 정제한다. S07은 actual change로 Variation Point와 Stable Boundary를 찾고 Pattern을 problem–solution vocabulary로 연결한다. S08은 Principle 적용 개수가 아니라 Change Impact, Dependency, Abstraction Cost, Trade-off와 evidence로 대안을 판단한다. S09는 이 판단을 새로운 문제에서 통합해 필요한 부분만 고친 뒤 멈춘다.

S10은 설계를 Code와 executable evidence, shared verification과 delivery flow로 연결한다. S11은 `Software Architecture → DDD → MSA → AI-Native`에서 새롭게 생기는 concern과 owner 영역으로 넘긴다.

## 6. Session Architecture

아래 시간은 승인 상세설계의 현재 content context를 보존하는 임시 값이다. 이 단계에서는 재배분하지 않으며 slide 수와 함께 별도 단계에서 확정한다.

| Session | Title | Role | Core Question / Outcome | Current Time |
|---|---|---|---|---:|
| S01 | OOAD 개요 | Overview | 왜 Analysis/Design과 Object Orientation이 필요하며 OOAD는 어떤 판단을 소유하는가? | 60분 |
| S02 | 문제 발견과 요구 이해 | Problem Understanding | essential problem과 solution detail을 구분해 요구를 Analysis input으로 구조화하는가? | 90분 |
| S03 | 분석 정적 모델 | Static Analysis | problem-domain structure를 구현 결정과 분리해 어떻게 명시하는가? | 75분 |
| S04 | 분석 동적 모델 | Dynamic Analysis | interaction·state change를 분석하고 질문에 맞는 동적 모델을 어떻게 선택하는가? | 75분 |
| S05 | 분석에서 객체 설계로 | Initial Design | 정적·동적 evidence에서 객체 경계와 책임 후보를 어떻게 만드는가? | 70분 |
| S06 | 책임 설계 ① — RDD로 책임과 협력 보완 | Responsibility Core | Initial Design을 Contract와 RDD/GRASP로 어떻게 정제하는가? | 85분 |
| S07 | 책임 설계 ② — 계약과 변화 대응 | Local Refinement | actual change의 압력을 어떻게 국소화하고 Pattern vocabulary와 연결하는가? | 70분 |
| S08 | 객체 설계의 판단 기준 | Alternative Evaluation | 여러 대안을 evidence, 효과와 비용으로 어떻게 비교·선택하는가? | 80분 |
| S09 | Order 통합 설계 Workshop | Integration | 앞선 판단을 결합해 필요한 부분만 개선하고 언제 멈추는가? | 90분 |
| S10 | OOAD Next Step ① — 개발·검증·DevOps | Development Handoff | OOAD 결과가 Code, feedback, verification과 delivery로 어떻게 이어지는가? | 70분 |
| S11 | OOAD Next Step ② — 고급 설계와 AI-Native | Advanced Handoff | OOAD 판단이 전문영역에서 어떻게 재사용되고 어떤 새 판단으로 넘어가는가? | 35분(재산정 대상) |

### Internal Ownership Boundary

- S07은 actual change의 local refinement와 selected Pattern handoff를 소유한다.
- S08은 이미 존재하는 Alternative의 비교와 decision을 소유한다.
- S09는 새 개념을 가르치지 않고 앞선 판단을 integrated problem에 적용한다.
- S10은 새 Object Design technique이 아니라 implementation·verification·delivery 연결을 소유한다.
- S11은 specialist technique을 완결하지 않고 다음 owner 영역의 Big Picture와 경계를 소유한다.

## 7. Session-to-Session Narrative

| Transition | Input → New Question |
|---|---|
| S01 → S02 | OOAD의 Why와 판단 지도 → 실제 문제와 요구를 어떻게 발견·정의하는가? |
| S02 → S03 | System Operation과 state change → 무엇이 존재하고 어떤 관계를 가져야 하는가? |
| S03 → S04 | 정적 구조 → 사건이 발생할 때 누가 상호작용하고 상태가 어떻게 변하는가? |
| S04 → S05 | 정적·동적 evidence → 어떤 객체 경계와 책임 후보로 전환할 것인가? |
| S05 → S06 | Initial Design → 책임 배치를 Contract와 Collaboration evidence로 설명·수정할 수 있는가? |
| S06 → S07 | Refined Design → 새 change를 어디에 국소화할 것인가? |
| S07 → S08 | Local refinement → 어떤 evidence와 trade-off로 대안을 선택할 것인가? |
| S08 → S09 | Design Decision → 새 문제에서 판단을 어떻게 함께 적용하고 멈출 것인가? |
| S09 → S10 | Integrated Design → 의도와 계약을 Code와 executable evidence에서 어떻게 검증할 것인가? |
| S10 → S11 | Development handoff → system·domain·distributed boundary·Human/Agent 책임에 어떤 새 판단이 필요한가? |

## 8. S01~S11 Summary & Detailed Design Index

### S01. OOAD 개요
- **Role / Flow:** rework evidence와 Essence/Accident → Analysis/Design 질문 구분 → Object Orientation → OOA/OOD → Judgment/Course Map.
- **Practice:** Order 변경 파급 위치와 예방 가능한 판단을 토론한다.
- **Boundary:** 후속 modeling·responsibility·pattern technique을 미리 가르치지 않는다.
- **Detail:** [`sessions/s01-detailed-design.md`](./sessions/s01-detailed-design.md)

### S02. 문제 발견과 요구 이해
- **Role / Flow:** Problem/Goal → Discovery → Requirement → Event/Response → Use Case → SSD/System Operation → Operation Contract → Domain State Change.
- **Practice:** Place Order Use Case를 작성하고 누락·가정·solution detail을 검토한다.
- **Boundary:** Requirement Engineering 전문과정이 아니라 OOAD Analysis input까지 소유한다.
- **Detail:** [`sessions/s02-detailed-design.md`](./sessions/s02-detailed-design.md)

### S03. 분석 정적 모델
- **Role / Flow:** 짧은 recap → Concept/Attribute/Value Domain → Relationship/Multiplicity/Whole-Part → Association Object/snapshot → Conceptual Domain Model → Requirement feedback.
- **Practice:** Place Order Conceptual Domain Model을 작성한다.
- **Boundary:** Analysis Concept을 implementation class, DB model, Ontology나 DDD tactical model로 바꾸지 않는다.
- **Detail:** [`sessions/s03-detailed-design.md`](./sessions/s03-detailed-design.md)

### S04. 분석 동적 모델
- **Role / Flow:** Event/Analysis Slice → Sequence와 State deep teaching → Communication/Activity overview → Static/Dynamic cross-check → Just-enough stop.
- **Practice:** Analysis Sequence를 작성하고 별도 실습에서 Static↔Dynamic 불일치를 수정한다.
- **Boundary:** Sequence는 software call trace가 아니며 Communication/Activity는 overview depth다.
- **Detail:** [`sessions/s04-detailed-design.md`](./sessions/s04-detailed-design.md)

### S05. 분석에서 객체 설계로
- **Role / Flow:** Static+Dynamic evidence → State/Behavior → Encapsulation/Information Hiding/Change Reason → Object Boundary/Responsibility candidate → Initial Design.
- **Practice:** RDD/GRASP 선행 주입 없이 experience-based Initial Design snapshot을 만든다.
- **Boundary:** systematic responsibility refinement는 S06으로 넘긴다.
- **Detail:** [`sessions/s05-detailed-design.md`](./sessions/s05-detailed-design.md)

### S06. 책임 설계 ①
- **Role / Flow:** Responsibility/Message → Contract → Collaboration → RDD/CRC → GRASP → 책임 이동 → Class↔Sequence feedback.
- **Practice:** S05 Initial Design을 Existing Model Refinement로 정제한다.
- **Boundary:** GRASP를 배타적 해법 목록이나 checklist로 사용하지 않는다.
- **Detail:** [`sessions/s06-detailed-design.md`](./sessions/s06-detailed-design.md)

### S07. 책임 설계 ②
- **Role / Flow:** Contract stress → Variation Point/Stable Boundary → variation-oriented GRASP/Composition → Payment practice → GoF map와 Strategy·Adapter·State·Factory Method.
- **Practice:** Payment Method/Provider variation을 Pattern 이름보다 먼저 해결 구조로 설계한다.
- **Boundary:** selected Pattern의 정의·짧은 code는 유지하되 catalog mastery나 framework detail로 확장하지 않는다.
- **Detail:** [`sessions/s07-detailed-design.md`](./sessions/s07-detailed-design.md)

### S08. 객체 설계의 판단 기준
- **Role / Flow:** Change Impact → Cohesion/Coupling → Dependency → Abstraction Cost/Technology Leakage → SOLID/Pattern → Trade-off → Decision.
- **Practice:** 두 Alternative를 비교하고 LLM 반론으로 근거를 검토한다.
- **Boundary:** SOLID coverage와 Pattern 사용 자체를 목표로 하지 않는다.
- **Detail:** [`sessions/s08-detailed-design.md`](./sessions/s08-detailed-design.md)

### S09. Order 통합 설계 Workshop
- **Role / Flow:** Problem 발견 → relevant judgment → local refinement → re-check → stop을 세 유형의 문제에서 반복한다.
- **Practice:** 필요한 evidence만 선택해 flawed/candidate model의 관련 부분만 고친다.
- **Boundary:** re-teaching이나 전체 모델 재작성 exercise가 아니다.
- **Detail:** [`sessions/s09-detailed-design.md`](./sessions/s09-detailed-design.md)

### S10. OOAD Next Step ①
- **Role / Flow:** Design→Code → feedback scope → JUnit/TDD `Red→Green→Refactor` → Correction/Rework/Change/Refactoring 경계 → Pre-commit → CI/CD → DevOps.
- **Practice:** Order evidence로 feedback level과 CI/CD·DevOps readiness를 판단한다.
- **Boundary:** tool catalog/pipeline 구축이 아니라 OOAD 판단과 evidence의 연결을 설명한다.
- **Detail:** [`sessions/s10-detailed-design.md`](./sessions/s10-detailed-design.md)

### S11. OOAD Next Step ②
- **Role / Flow:** Software Architecture → DDD → MSA → AI-Native.
- **Practice:** `확보한 판단 → 남은 문제 → owner → 추가 Judgment/Evidence`로 분류한다.
- **Boundary:** specialist-level technique과 기계적 solution 선택을 owner 과정으로 넘긴다.
- **Detail:** [`sessions/s11-detailed-design.md`](./sessions/s11-detailed-design.md)

## 9. Whole-Curriculum Integration Decisions

- S01의 Boehm·Standish·Brooks는 삭제하지 않고 하나의 evidence structure로 통합한다.
- S03의 Analysis≠Phase, Problem/Solution, Essence/Accident, Static/Dynamic Map은 current-session recap으로 묶는다.
- S04는 Sequence/State를 깊게, Communication/Activity를 overview로 유지한다.
- S06 owner depth, S07 selected Pattern 정의·짧은 code, S08 evidence-based SOLID 판단, S09 integrated exercises와 S11 승인 structure를 보존한다.
- S10 내용은 OOAD→evidence→delivery 연결에 필요한 positioning을 유지하며 S10→S11 순서는 `Software Architecture → DDD → MSA → AI-Native`로 통일한다.
- `Same Example + New Question/Scale/Judgment`는 reinforcement다. `Same Question + Same Explanation + Same Judgment`만 consolidation한다.
- Owner content는 필요한 Definition·Diagram·Example·Code·Practice depth를 허용하고, Handoff content는 Big Picture·Relationship·Boundary·Next Question 중심으로 제한한다.
- 이 문서는 Detailed Design의 전체 claim, code, diagram, practice procedure, notes와 answer를 복제하지 않는다.

## 10. Curriculum Completion / Downstream Handoff

이 Curriculum은 course narrative, Session role·연결·ownership boundary와 teaching-flow baseline을 소유하고, 각 Detailed Design은 실제 teaching detail을 소유한다.

Deck은 필수 outcome·sequence·practice role·boundary를 보존하면서 실제 visual/instructional form을 완성한다. claim을 slide와 기계적으로 1:1 대응시키거나 slide 수를 내용 삭제 quota로 사용하지 않는다. 300장 이상도 내용과 교육 흐름이 정당화하면 허용한다.

다음은 별도 단계로 넘긴다.

- Session Time
- Overall 2-day Time Allocation
- Final Slide Range
- 300+ Deck realization
- Deck Generation Policy
- Authoring Guide Final Revision
