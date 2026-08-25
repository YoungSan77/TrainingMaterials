# Six-Course Architecture Completion Review v1.0

## Scope

- OOAD
- DDD
- SW Architecture
- MSA
- AI-Native Software Engineering
- Modern QM

## Verdict

**PROGRAM ARCHITECTURE READY FOR CURRICULUM AUTHORING**

Governance 자체는 freeze 가능한 수준이다.
남은 작업은 Course Spec에 따라 각 curriculum을 정렬하는 것이다.

## 1. Six-Course Roles

| Course | Primary Question | Primary Ownership |
|---|---|---|
| OOAD | 누가 무엇을 알고/수행하고 어떻게 협력하는가? | Responsibility / Object Contract / Collaboration |
| DDD | Domain meaning과 rule을 어떻게 model/boundary로 보호하는가? | Domain Model / Invariant / Bounded Context |
| SWA | 어떤 quality/constraint 때문에 어떤 구조를 선택할 것인가? | Structural Decision / Dependency / Evolution |
| MSA | 분산의 가치가 비용보다 큰가, 분산 후 무엇을 통제할 것인가? | Distribution / Service Contract / Failure / Operation |
| AI-Native | 무엇을 AI에 위임하고 어떻게 통제·검증할 것인가? | Delegation / Context / Guardrail / Harness / Evaluation |
| Modern QM | 전체 engineering system의 품질을 어떻게 예방·검증·개선할 것인가? | Evidence / Gate Governance / Feedback / Improvement |

## 2. Cross-Course Lineages

### Responsibility
`Object → Domain → Component → Service → Human/Agent`

### Contract
`Object Contract → Domain Invariant → Interface Contract → Service Contract → Stage Contract → Quality Evidence`

### Boundary
`Encapsulation → Aggregate/BC → Architecture Boundary → Deployment/Failure Boundary → Autonomy Boundary`

### Evidence
`Test → Invariant Verification → Fitness → Observability/Contract Verification → AI Evaluation → QM Improvement`

## 3. Critical Ownership Boundaries

- OOAD does not own Domain Model.
- DDD does not own deployment boundary.
- SWA does not own DDD tactical definitions.
- MSA does not equate BC with Microservice.
- AI does not redefine MSA Saga.
- QM does not own DDD/AI concepts.
- Future DevOps should own delivery/operational flow, not QM.

## 4. Curriculum Revision Order

1. OOAD
2. DDD
3. SW Architecture
4. MSA
5. AI-Native
6. Modern QM

This is authoring dependency, not learner prerequisite.

## 5. Evidence Policy

All courses:
- Global Principle / Global BP first
- Local Constraint separately
- Korea BP / Korea WP clearly labeled
- primary/original source preferred
- Korean secondary sources used conservatively

## 6. Quote Asset Strategy

Course-by-course verified packs:
1. OOAD — completed
2. DDD — next
3. SWA — next
4. MSA — next
5. AI-Native — current official sources + stable engineering principles
6. QM — existing asset requires attribution/freshness audit

## 7. Open but Non-Blocking Decisions

- exact session count for DDD
- MSA one-day vs two-day depth
- AI-Native final duration
- ATAM depth in SWA
- Supple Design depth in DDD
- future DevOps exact border with QM/SWA/MSA

## 8. Freeze Rule

Program Governance changes only if:
- a real ownership conflict emerges,
- a primary source disproves a canonical claim,
- a new course cannot fit admission framework.

Otherwise solve issues at Course Spec / Curriculum level.
