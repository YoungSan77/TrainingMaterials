# MSA — Verified Sources & Evidence

> **Course ID:** msa
> **Standard:** `portfolio/evidence-policy.md` (Verification Status / Evidence Role / Source Provenance / Evidence Strength / Transferability / Curriculum Use / BP Classification 스키마의 정본 — 여기서 재정의하지 않는다)
> **Source:** `context/course-portfolio-unified-v2.6/support/03_source-evidence/04_msa-source-evidence-v2.0.md` (MSA Verified Principles & Sources Pack v2.0) — 이 문서는 그 원문을 요약본으로 다시 쓰지 않고 원형 그대로 보존하며, `portfolio/evidence-policy.md` 스키마의 개별 claim 단위 메타데이터를 추가로 부여한 것이다.
> **Purpose (Pack 원문):** MSA를 microservice pattern catalog가 아니라 Distribution Decision / Contract / Failure / Operation으로 가르치기 위한 source baseline.
> **Legacy notice:** 이 Pack에는 legacy slide-placement/font/display 권고가 없다 — 해당 사항 없음.
> **Cross-reference:** `courses/msa/design/course-context.md` §5는 이 문서 §1 Foundational Position을 직접 인용한다("Microservice는 목표가 아니라 비용을 지불하고 얻는 autonomy option이다").

---

## Portfolio Evidence Classification (Pack 원문, 원형 보존)

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Microservice boundary/distribution principles | Established Practice-Pattern | Foundational/Authoritative practitioner literature | Strong | Conditional | Core | Not classified |
| Saga / Transactional Outbox / Idempotent Consumer | Established Practice-Pattern | Original/Authoritative pattern sources | Strong | Conditional | Core | Not classified |
| Remote interaction / failure / observability claims | Foundational/Core | Cross-source engineering lineage | Strong | Broad | Core | Not classified |

이 표는 Pack이 이미 지정한 claim-family 단위 분류다. 아래 §2–§5의 각 claim(M01–M11)은 이 표의 어느 family에 속하는지 명시하고, family 표가 다루지 않는 claim(M08)은 `portfolio/evidence-policy.md` §2 스키마를 이 문서 저자가 개별 판단으로 적용했음을 별도로 표시한다(Pack 원문에 없는 판단은 원문 claim과 분리해 표기).

---

## 1. Foundational Position

```text
Boundary
→ Distribution Decision
→ Contract
→ Data Ownership
→ Consistency
→ Failure
→ Observability / Operation
```

Microservice는 목표가 아니라 비용을 지불하고 얻는 autonomy option이다.

---

## 2. Distribution

**Claim Family (Portfolio Evidence Classification 표 기준):** Microservice boundary/distribution principles — Evidence Role: Established Practice-Pattern · Source Provenance: Foundational/Authoritative practitioner literature · Evidence Strength: Strong · Transferability: Conditional · Curriculum Use: Core · BP Classification: Not classified.

### M01 — Monolith vs Microservice is a decision
**Verification Status:** Verified
**Source:** microservices.io, Microservice Architecture pattern.
**Principle:** 첫 질문은 microservice를 어떻게 구현할지가 아니라 monolithic architecture와 microservice architecture 중 무엇을 선택할 것인가다.
**Locator:** https://microservices.io/patterns/microservices.html

### M02 — Distribution adds interaction, consistency and runtime coupling costs
**Verification Status:** Verified
**Source:** microservices.io Microservice Architecture pattern.
**Principle:** inefficient interactions, eventually consistent transactions, tight runtime coupling은 explicit architecture costs다.
**Locator:** https://microservices.io/patterns/microservices.html

---

## 3. Data / Consistency

**Claim Family:** M03은 Saga/Outbox/Idempotent Consumer와 함께 microservices.io의 named pattern 계열이므로 아래 §4의 Family("Saga / Transactional Outbox / Idempotent Consumer" — Established Practice-Pattern · Original/Authoritative pattern sources · Strong · Conditional · Core · Not classified)에 귀속시킨다. M04–M07도 동일 family다.

### M03 — Database per Service creates cross-service consistency problem
**Verification Status:** Verified
**Principle:** service autonomy를 위해 data ownership을 분리하면 local ACID transaction 밖의 business operation을 별도로 설계해야 한다.
**Locator:** https://microservices.io/patterns/data/database-per-service.html

### M04 — Saga is a sequence of local transactions
**Verification Status:** Verified
**Source:** Chris Richardson, Saga pattern.
**Short verified phrase:** "a saga is a sequence of local transactions."
**Important:** automatic rollback이 아니다. compensation을 명시적으로 설계해야 하고 isolation도 자동 보장되지 않는다.
**Locator:** https://microservices.io/patterns/data/saga.html
**Quote Attribution (evidence-policy.md §11):** 원전 영문 quote, ko 의역 없이 원문 유지 — Principle/quote 분리 규칙에 따라 quote는 위 인용문으로 한정하고 "automatic rollback이 아니다" 이하는 Pack 저자의 paraphrase(따옴표 미사용)로 취급한다.

### M05 — Transactional Outbox addresses atomic state-change + message publication
**Verification Status:** Verified
**Source:** microservices.io Transactional Outbox.
**Principle:** business state update와 message/event 기록을 같은 DB transaction에 저장하고 별도 relay가 발행한다.
**Locator:** https://microservices.io/patterns/data/transactional-outbox.html

### M06 — Outbox implies duplicate-delivery handling
**Verification Status:** Verified
**Principle:** relay 또는 broker 특성상 duplicate delivery가 가능하므로 consumer idempotency가 필요할 수 있다.
**Locator:** https://microservices.io/patterns/data/transactional-outbox.html (M05와 동일 출처의 연장 원칙)

### M07 — Idempotent Consumer
**Verification Status:** Verified
**Source:** microservices.io Idempotent Consumer.
**Principle:** 같은 message를 여러 번 처리해도 한번 처리한 것과 동일한 outcome을 갖도록 설계한다.
**Locator:** https://microservices.io/patterns/communication-style/idempotent-consumer.html

---

## 4. Contract

### M08 — Service autonomy depends on explicit external contracts
**Verification Status:** Verified
**Principle:** API/Event/Schema semantics, compatibility, consumer impact를 명시하지 않으면 independent evolution이 어렵다.

Curriculum must include:
- backward compatibility
- forward compatibility
- additive vs breaking change
- deprecation
- consumer impact

**Claim Family 판단 (Pack의 3-family 표에 명시적으로 없음 — 이 문서 저자가 `portfolio/evidence-policy.md` §2 스키마를 개별 적용):**
- Evidence Role: Established Practice/Pattern — API/Event Contract discipline(backward/forward compatibility, additive vs breaking change, deprecation)은 여러 환경에서 재사용되어 정착된 설계 관행이다.
- Source Provenance: Authoritative Secondary — M01/M02(microservices.io)의 boundary/autonomy 원칙에서 파생되는 contract 요구이며 별도 1차 출처 문헌이 Pack에 명시되어 있지 않다.
- Evidence Strength: Strong — service autonomy가 explicit contract 없이 성립하지 않는다는 것은 M01/M02/M03이 이미 성립시킨 boundary/data-ownership 논증의 직접 귀결이다.
- Transferability: Conditional — 어떤 compatibility 정책(backward-only/forward-only/both)을 택할지는 consumer 수·변경 빈도 등 조건에 따라 달라진다.
- Curriculum Use: Core.
- BP Classification: Not classified.
- **주의:** 이 메타데이터는 Pack 원문에 없는 이 문서 저자의 판단이며, Pack이 이미 분류한 M01–M07/M09–M11과 신뢰 수준이 같지 않다. Curriculum/Deck 저작 시 이 claim을 Core로 사용하기 전 재검증 대상으로 남긴다(evidence-policy.md §2.3 Pending과 구분되는 "Strong이나 저자-판단"임을 명시).

---

## 5. Failure / Operation

**Claim Family:** Remote interaction / failure / observability claims — Evidence Role: Foundational/Core · Source Provenance: Cross-source engineering lineage · Evidence Strength: Strong · Transferability: Broad · Curriculum Use: Core · BP Classification: Not classified.

### M09 — Remote interaction is not local interaction
**Verification Status:** Verified
**Principle:** latency, timeout, partial failure, retry, duplication, availability dependency가 생긴다.

### M10 — Retry is not resilience by itself
**Verification Status:** Verified
**Principle:** retry는 load amplification/duplicate side effect를 만들 수 있으며 timeout, backoff, idempotency, isolation과 함께 판단한다.

### M11 — Observability is architecture cost and capability
**Verification Status:** Verified
**Principle:** distributed system은 failure localization과 causality 추적을 위해 logs/metrics/traces/correlation/version visibility가 필요하다.

---

## 6. Teaching Distinctions

- Bounded Context ≠ Microservice
- Domain Event ≠ Integration Event
- Module ≠ Service
- Local call ≠ Remote call
- Eventual Consistency ≠ no consistency
- Saga ≠ rollback
- Retry ≠ resilience
- Observability ≠ logging

## 7. Depth Policy

1-day core:
`Boundary → Contract → Failure → Operation`

Saga/Outbox/Idempotency는 위 문제를 설명하는 대표 패턴으로 제한.
API Gateway, Service Discovery, CQRS 등은 필요에 따라 forward/advanced.

## 8. Source Baseline

- Chris Richardson / microservices.io
- Martin Fowler microservices / DDD context background
- Sam Newman can be authoritative secondary for broader operational trade-offs

URLs:
- https://microservices.io/patterns/microservices.html
- https://microservices.io/patterns/data/saga.html
- https://microservices.io/patterns/data/transactional-outbox.html
- https://microservices.io/patterns/communication-style/idempotent-consumer.html
- https://microservices.io/patterns/data/database-per-service.html

---
## Unified Portfolio Alignment v2.6 (Pack 원문, 원형 보존)
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.

---

## Global Baseline / Korean Source Rules 적용 메모 (evidence-policy.md §1, §8 관련)

- 이 Pack의 모든 claim은 국제 practitioner literature(microservices.io/Chris Richardson, Martin Fowler, Sam Newman)에 근거하며 특정 국가·조직·벤더 사례가 아니다 — Global Baseline에 해당하고 Contextual/Korea BP·Korea WP는 적용 대상이 아니다(evidence-policy.md §7).
- Tool/Vendor 독립성(evidence-policy.md §9): Saga/Outbox/Idempotent Consumer는 pattern이며 특정 broker/DB 제품에 종속되지 않는다 — Awareness 수준(Kubernetes, Service Mesh 등)은 `courses/msa/design/practice-design.md` "Optional/Reference Candidates"로 분리되어 있다.
- BP Classification 기본값은 Not classified이며, 이 Pack의 모든 claim(M01–M11)이 이미 Not classified로 일관되어 있어 이 문서도 그대로 유지한다(evidence-policy.md §2.6).
