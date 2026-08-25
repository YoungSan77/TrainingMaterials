# MSA Verified Principles & Sources Pack v2.0

> Purpose: MSA를 microservice pattern catalog가 아니라 Distribution Decision / Contract / Failure / Operation으로 가르치기 위한 source baseline.


## Portfolio Evidence Classification

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Microservice boundary/distribution principles | Established Practice-Pattern | Foundational/Authoritative practitioner literature | Strong | Conditional | Core | Not classified |
| Saga / Transactional Outbox / Idempotent Consumer | Established Practice-Pattern | Original/Authoritative pattern sources | Strong | Conditional | Core | Not classified |
| Remote interaction / failure / observability claims | Foundational/Core | Cross-source engineering lineage | Strong | Broad | Core | Not classified |

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

## 2. Distribution

### M01 — Monolith vs Microservice is a decision
**Verification Status:** Verified  
**Source:** microservices.io, Microservice Architecture pattern.  
**Principle:** 첫 질문은 microservice를 어떻게 구현할지가 아니라 monolithic architecture와 microservice architecture 중 무엇을 선택할 것인가다.

### M02 — Distribution adds interaction, consistency and runtime coupling costs
**Verification Status:** Verified  
**Source:** microservices.io Microservice Architecture pattern.  
**Principle:** inefficient interactions, eventually consistent transactions, tight runtime coupling은 explicit architecture costs다.

## 3. Data / Consistency

### M03 — Database per Service creates cross-service consistency problem
**Verification Status:** Verified  
**Principle:** service autonomy를 위해 data ownership을 분리하면 local ACID transaction 밖의 business operation을 별도로 설계해야 한다.

### M04 — Saga is a sequence of local transactions
**Verification Status:** Verified  
**Source:** Chris Richardson, Saga pattern.  
**Short verified phrase:** “a saga is a sequence of local transactions.”  
**Important:** automatic rollback이 아니다. compensation을 명시적으로 설계해야 하고 isolation도 자동 보장되지 않는다.

### M05 — Transactional Outbox addresses atomic state-change + message publication
**Verification Status:** Verified  
**Source:** microservices.io Transactional Outbox.  
**Principle:** business state update와 message/event 기록을 같은 DB transaction에 저장하고 별도 relay가 발행한다.

### M06 — Outbox implies duplicate-delivery handling
**Verification Status:** Verified  
**Principle:** relay 또는 broker 특성상 duplicate delivery가 가능하므로 consumer idempotency가 필요할 수 있다.

### M07 — Idempotent Consumer
**Verification Status:** Verified  
**Source:** microservices.io Idempotent Consumer.  
**Principle:** 같은 message를 여러 번 처리해도 한번 처리한 것과 동일한 outcome을 갖도록 설계한다.

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

## 5. Failure / Operation

### M09 — Remote interaction is not local interaction
**Verification Status:** Verified  
**Principle:** latency, timeout, partial failure, retry, duplication, availability dependency가 생긴다.

### M10 — Retry is not resilience by itself
**Verification Status:** Verified  
**Principle:** retry는 load amplification/duplicate side effect를 만들 수 있으며 timeout, backoff, idempotency, isolation과 함께 판단한다.

### M11 — Observability is architecture cost and capability
**Verification Status:** Verified  
**Principle:** distributed system은 failure localization과 causality 추적을 위해 logs/metrics/traces/correlation/version visibility가 필요하다.

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
## Unified Portfolio Alignment v2.6
- 이 Source/Evidence Pack은 Course Spec의 보조 근거이며 Curriculum Owner가 아니다.
- `Problem → Principle → Decision → Evidence → Feedback` 구조를 지원한다.
- 다른 과정의 OWNER 개념은 재정의하지 않는다.
- Tool/Vendor 이름은 현재 구현 예제로만 사용한다.
