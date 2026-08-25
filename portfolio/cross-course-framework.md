# 05. Cross-Course Engineering Framework v2.6

> **Status:** Portfolio Canon
> **Purpose:** 특정 과정 수나 이름에 종속되지 않고, 과정 사이에서 공통 개념이 어떻게 재정박·확장되는지 관리한다.
> **Does not own:** 개별 개념의 정의 자체. 정의 OWNER는 `portfolio/terminology.md`와 `portfolio/concept-ownership.md`가 소유한다.


## 0. Portfolio Design Axes

Cross-course 정합성은 Content Topic만 비교하지 않는다. 먼저 두 축을 확인한다.

1. **Learner & Context Fit:** 각 과정이 어떤 Capability Gap과 Required Decision을 해결하는가?
2. **Foundational Decision Lens:** Systems / Lean / ToC / Design / Empiricism 중 어떤 Lens가 해당 Course 판단을 실제로 강화하는가?

Lens는 Course OWNER가 아니다. Course는 Lens를 APPLY해 자신의 전문 판단을 구체화한다.

## 1. Governance Layers

```text
Program Governance
        ↓
Course Portfolio
        ↓
Course Architecture / Specification
        ↓
Curriculum / Source / Exercise / Deck
```

새 과정 추가 때문에 Program Governance를 재설계하지 않는다.

## 2. Reusable Axes

`Value / Meaning / Responsibility / Contract / Boundary / Dependency / Flow / Distribution / Delegation / Evidence / Feedback / Adaptation / Governance`

각 과정은 위 축의 조합이며 선형 성숙도 단계가 아니다.

## 3. Current Course Focus

| Course | Primary Focus |
|---|---|
| OOAD | Meaning / Responsibility / Object Contract / Collaboration |
| DDD | Domain Meaning / Invariant / Model Boundary |
| SW Architecture | Clean Dependency / Structural Boundary / Quality Decision / Evolution |
| MSA | Distribution / Service Contract / Failure / Operation |
| AI-Native SE | Delegation / Stage Contract / Control / Evaluation |
| Modern SWQM | Prevention / Evidence / Gate / Feedback / Improvement |

## 4. Responsibility Lineage

```text
Object Responsibility
→ Domain Responsibility
→ Component Responsibility
→ Service Ownership
→ Human / Agent Responsibility
```

같은 정의를 복제하지 않는다. 수준이 바뀌면 적용 질문이 바뀐다.

## 5. Contract Lineage

```text
Object Contract
  Precondition / Postcondition / Invariant
        ↓
Domain Invariant / Aggregate Consistency
        ↓
Interface / Port / Component Contract
        ↓
Service / API / Event / Schema Contract
        ↓
AI Stage Contract / Tool Contract
        ↓
Quality Evidence / Gate
```

- DbC는 OOAD OWNER.
- DDD는 Domain rule과 consistency에 재정박.
- SWA는 interface/boundary contract로 확장.
- MSA는 consumer-facing contract와 evolution을 소유.
- AI-Native는 stage/tool contract로 확장.
- QM은 충족 여부를 evidence/gate로 검증.

## 6. Boundary Lineage

```text
Encapsulation Boundary
→ Aggregate / Bounded Context
→ Architecture Boundary
→ Deployment / Failure Boundary
→ Context / Permission / Autonomy Boundary
```

경계들은 정렬될 수 있지만 동일하지 않다.

## 7. Evidence / Feedback Lineage

```text
Unit Test / Refactoring Feedback
→ Domain Rule / Invariant Verification
→ Architecture Fitness / Conformance
→ Distributed Observability / Contract Verification
→ AI Evaluation / Deterministic Gate
→ Quality Evidence / Audit / Improvement Loop
```

QM은 다른 과정의 기술을 소유하지 않고 이 evidence들이 품질 시스템으로 연결되는 방식을 소유한다.

## 8. DDD Lineage from OO Design

DDD를 OOAD 대체물로 설명하지 않는다.

```text
OOAD foundation
Object / Responsibility / Collaboration
RDD / GRASP
Design by Contract
Cohesion / Coupling / SOLID
Analysis / Design Model
        ↓
DDD deepens
Ubiquitous Language
Domain Model ↔ Implementation
Entity / Value Object
Invariant / Aggregate
Domain Service / Repository / Domain Event
Bounded Context / Context Mapping
Model Evolution / Explicit Semantics
```

DDD는 RDD/DbC를 최소 recap하고 Domain 문제에 적용한다.

## 9. Modern SWQM Position

Modern SWQM은 기술과정의 다음 단계가 아니라 cross-cutting professional course다.

```text
OOAD ─┐
DDD ──┤
SWA ──┼──→ Modern SWQM: Prevention / Evidence / Gate / Feedback / Improvement
MSA ──┤
AI ───┘
```

QM에서 재정의하지 않는 것:
- Context Engineering
- Rich Domain Model
- Ubiquitous Language
- Ontology
- Guardrail
- Harness

QM에서 묻는 질문:
- 요구/계약/품질 기준은 어떻게 검증 가능한가?
- 결함을 어디에서 예방·탐지하는 것이 비용 효과적인가?
- 어떤 evidence가 gate를 통과시키는가?
- feedback이 process/system improvement로 연결되는가?

## 10. Common Teaching Decision Structure

가능한 경우:

`Problem → Principle → Decision Question → Example → Trade-off → Failure Condition → Evidence / Verification → Forward / Re-anchor`

모든 과정의 slide layout을 동일하게 만들라는 뜻은 아니다. 과정 identity가 우선한다.

## 11. New Course Admission

신규 과정의 authoritative 절차는 `portfolio/governance.md` Part B(Change & Extension Protocol)를 따른다.

새 과정은 `portfolio/course-spec-template.md`를 먼저 작성한다.

필수 판단:
1. 어떤 독립 문제를 소유하는가?
2. 학습자가 어떤 decision을 내려야 하는가?
3. 새 OWNER 개념은 무엇인가?
4. 기존 개념을 어떻게 RECAP/APPLY/EXTEND하는가?
5. 다른 과정과 무엇이 겹치며 어디서 경계를 자르는가?
6. Trade-off / Failure Condition은 무엇인가?
7. 학습 evidence는 무엇인가?
8. 독립 과정이어야 하는가?

## 12. Future Portfolio

DevOps / SW Project Management / SW Proposal / DT→AX는 Course Admission을 통과한 현재 Baseline 과정이다. 이후 신규 과정도 이름만으로 OWNER를 확정하지 않는다.
Course Admission을 통과한 뒤 `portfolio/portfolio-context.md` Part B(course-catalog)에 status와 ownership을 등록한다.


## 13. Architecture Spine

SW Architecture 과정은 다음 세 축을 결합한다.

```text
1. Why
Architecture Drivers / Quality Attribute Scenarios / Constraints
        ↓
2. Structure
Clean Architecture as baseline lens
Policy vs Detail / Dependency Rule / Boundaries
        ↓
3. Time
Evolutionary Architecture
Fitness Functions / Guided Incremental Change / Continuous Evaluation
```

Clean Architecture는 **structure baseline**, Evolutionary Architecture는 **time/change
dimension**, Quality Attribute reasoning은 **decision basis**다. 셋 중 하나로 Architecture
전체를 대체하지 않는다.

## 14. Evidence / Localization Pointer

Global Baseline/source precedence, evidence role, Local/System Constraint와 Contextual Adaptation classification은
`portfolio/evidence-policy.md`가 authoritative owner로 소유한다.

Cross-course rule은 하나뿐이다.

> Local example은 Global Principle을 재정의하지 않으며, 적용·제약·실패를 설명하는 evidence다.


---
## Unified Portfolio Alignment v2.6
- 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
- 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
- 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
- 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.


## 15. Adaptive Delivery Lineage — Agile
`Uncertainty → Small Batch → Working Increment → Feedback → Learning → Adaptation`

- Agile owns adaptive delivery/adoption reasoning.
- QM owns quality evidence/gate, not Sprint flow.
- DevOps owns software delivery/deployment/operation flow, not Agile product feedback.

---

## Portfolio Focus — Current

| Course | Primary Focus |
|---|---|
| OOAD | Meaning / Responsibility / Object Contract / Collaboration |
| DDD | Domain Meaning / Invariant / Model Boundary |
| SW Architecture | Structural Boundary / Quality Decision / Evolution |
| MSA | Distribution / Service Contract / Failure / Operation |
| AI-Native SE | Delegation / Context / Guardrail / Harness / Evaluation |
| Modern SWQM | Prevention / Evidence / Gate / Feedback / Improvement |
| Agile | Small Value Increment / Customer Feedback / Adaptation |
| DevOps | Software Delivery Flow / Deployment / Operations Feedback |
| SW Project Management | Project Value / Governance / Integrated Control / Tailoring |
| SW Proposal | Customer Decision / Win Strategy / Commitment / Evidence |
| DT→AX | Transformation Value / Capability / Human+AI Operating Model / Governance |

### Extended Evidence / Feedback Lineage

```text
Product Feedback (Agile)
→ Delivery & Operations Feedback (DevOps)
→ Project Forecast / Change Evidence (PM)
→ Customer Decision Evidence (Proposal)
→ Transformation Outcome Evidence (DT→AX)
```

이는 선형 maturity model이 아니라 서로 다른 decision scope다.
