# DDD — Verified Sources

> **Course ID:** ddd
> **Pipeline stage:** Course Design (Stage 1) — `guides/과정_설계_지침.md` §2-c가 정하는 절차의 산출물.
> **Authority order:** `portfolio/evidence-policy.md`(Evidence/Source Policy Canon, 스키마의 정본) → 이 문서 → `courses/ddd/curriculum.md` / `courses/ddd/design/practice-design.md`(이 문서의 claim을 소비하되 재정의하지 않음).
> **Source:** `context/course-portfolio-unified-v2.6/support/03_source-evidence/02_ddd-source-evidence-v2.0.md`(DDD Verified Principles & Sources Pack v2.0) — 아래 내용은 이 Pack을 요약하지 않고 원형 그대로 보존한 것이다. `guides/과정_설계_지침.md` §2-c: "source/evidence 원문(요약본으로 다시 쓰지 않는다 — 원형 보존)".
> **Legacy note:** 이 문서에는 옛 slide placement·font·display 권고 등 legacy 지시사항이 없다 — Pack v2.0 전체가 source/evidence 판정이며 지금도 normative reference로 유효하다.

---

## Portfolio Evidence Classification

스키마 정본: `portfolio/evidence-policy.md` §2 (Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use), §2.6 (BP Classification — 기본값 Not classified).

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Eric Evans, *Domain-Driven Design* | Foundational/Core | Original-Foundational Author | Strong | Broad/Conditional by pattern | Core | Not classified |
| Fowler explanatory material | Foundational/Core | Authoritative Secondary | Moderate | Broad | Supporting | Not classified |
| Vernon and later DDD literature | Established Practice-Pattern | Authoritative Secondary | Moderate | Conditional | Supporting/Reference | Not classified |
| Bounded Context ≠ deployment boundary inference | Foundational/Core | Derived from foundational sources | Moderate | Broad | Core | Not classified |

## 1. Foundational Position

DDD는 OOAD의 대체물이 아니다. 기존 OO 책임·협력·계약 사고 위에서 domain meaning, model-driven design, invariant, aggregate, bounded context를 심화한다.

### Verified source baseline
- Eric Evans, *Domain-Driven Design* (2003) — foundational primary source.
- Martin Fowler, "Domain Driven Design" — authoritative synthesis.
- Martin Fowler, "Ubiquitous Language" — Evans 개념에 대한 authoritative summary.
- Martin Fowler, "Bounded Context" — strategic design의 authoritative summary.
- Martin Fowler, "DDD Aggregate" — Aggregate의 integrity/transaction boundary 설명.

## 2. Principle Assets

### D01 — Domain Model must live in software, not only on paper
**Verification Status:** Verified
**Principle:** Domain model은 분석 산출물로 끝나지 않고 구현과 함께 진화해야 한다.
**Source:** Martin Fowler, "Domain Driven Design", 2020.
**Use:** DDD opening / Model-Driven Design.

### D02 — Ubiquitous Language is model-based and evolves
**Verification Status:** Verified
**Principle:** 개발자와 domain expert가 공통 언어를 사용하고, 그 언어는 Domain Model에 기반해 함께 진화한다.
**Source:** Martin Fowler, "Ubiquitous Language", 2006.
**Verified note:** Fowler는 Evans가 언어를 대화와 software design 모두에서 사용하고, 이해가 성장함에 따라 model/language가 진화해야 한다고 강조한다고 설명한다.

### D03 — Bounded Context protects internal model consistency
**Verification Status:** Verified
**Principle:** 큰 domain 전체에 하나의 unified model을 강제하지 않고, 내부적으로 일관된 model을 유지할 수 있는 경계를 명시한다.
**Source:** Martin Fowler, "Bounded Context", 2014.

### D04 — Aggregate is an integrity / consistency boundary
**Verification Status:** Verified
**Principle:** Aggregate는 단순 object collection이 아니라 하나의 단위로 consistency/integrity를 보호하는 domain boundary다.
**Source:** Martin Fowler, "DDD Aggregate", 2013.
**Short verified quote:** "Transactions should not cross aggregate boundaries."
**Use:** Aggregate / invariant session.

### D05 — Bounded Context ≠ Microservice
**Verification Status:** Traceable
**Principle:** Bounded Context는 semantic/model boundary이고 Microservice는 deployment/runtime boundary다. 하나가 다른 하나를 자동 결정하지 않는다.
**Evidence:** Fowler의 Bounded Context 설명은 unified model/language와 interrelationship에 초점을 둔다; deployment unit을 정의하지 않는다.
**Use:** Strategic Design / MSA forward.

### D06 — DDD is most valuable where domain logic is complex
**Verification Status:** Verified
**Principle:** DDD는 복잡한 domain rules/processes를 조직해야 하는 문제에서 특히 가치가 크다.
**Source:** Martin Fowler, "Domain Driven Design", 2020.

## 3. Teaching Distinctions

- Domain Model ≠ Analysis Model
- Entity ≠ ORM entity
- Value Object ≠ DTO
- Aggregate ≠ object graph
- Domain Invariant ≠ Object Invariant
- Repository ≠ DAO
- Domain Service ≠ Application Service
- Domain Event ≠ Integration Event
- Bounded Context ≠ Microservice
- Domain Model ≠ Ontology

## 4. Source Use Rules

1. Evans 원전이 확보되면 definition/quote의 최종 authority는 Evans.
2. Fowler는 authoritative secondary로 사용.
3. Vaughn Vernon은 implementation guidance로 사용 가능하나 foundational definition 대체 금지.
4. Ontology는 DDD mandatory stage가 아니라 Explicit Semantics bridge로만 사용.
5. Tactical patterns를 catalog로 가르치지 않는다.

## 5. Primary Verification Pending

- Evans 원문에서 Entity / Value Object / Repository / Service exact quote.
- Evans Supple Design의 Intention-Revealing Interface, Side-Effect-Free Function, Assertion, Conceptual Contour exact locator.
- Context Mapping pattern별 exact original wording.

## 6. Recommended Authoring Use

Curriculum spine:
`Discovery → UL → Domain Model → Model-Driven Design → Entity/VO → Invariant/Aggregate → Domain Interaction → BC/Context Map → Model Evolution → Explicit Semantics`

Source URLs:
- https://martinfowler.com/bliki/DomainDrivenDesign.html
- https://martinfowler.com/bliki/UbiquitousLanguage.html
- https://martinfowler.com/bliki/BoundedContext.html
- https://martinfowler.com/bliki/DDD_Aggregate.html

---
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.

---

## Cross-references within `courses/ddd/design/`

- `course-context.md` §9 (Course Scope), §11 (Course-specific Principles DDD-01~06), §14 (Known Gap)는 이 문서의 D01–D06과 Teaching Distinctions(§3)를 근거로 삼는다.
- `practice-design.md`의 각 Practice `Evidence of Learning`은 이 문서의 D02(P1)·D04(P3)·D03/D04(P3)·D05(P4) 및 Course Principle DDD-02/03/04/05와 연결된다.
- Primary Verification Pending(§5) 항목은 교재에 exact quote로 사용하지 않는다 — `portfolio/evidence-policy.md` §2.5 Curriculum Use "Hold"에 준하는 상태로 취급한다.
