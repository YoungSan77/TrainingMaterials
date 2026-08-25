# 마이크로서비스 아키텍처(MSA) 개요와 설계 원칙 — Unified Baseline v2.6

> **Course ID:** msa  
> **Duration:** 8h 운영 기준  
> **Instructional time:** 약 400분 + 휴식 약 80분  
> **Status:** Baseline  
> **Portfolio Category:** Architecture & Distribution  
> **Time rule:** Topic은 동일 50분 단위가 아니며, 중요도·난이도·실습/토론량에 따라 가변 배분한다.


- **기준 시간:** 8시간 / 총 운영 480분 이내 / 권장 순수 학습 400분
- **Portfolio:** Architecture & Distribution

## 1. Course Thesis
> 독립 서비스가 주는 자율성의 가치가 Network·Consistency·Failure·Operation 비용보다 클 때만 분산하고, 서비스 경계·계약·데이터·실패를 명시적으로 설계한다.

## Learner & Context Fit

- **Audience / Work Context:** 분산 구조 도입·분해·운영 결정을 내려야 하는 개발자·아키텍트.
- **Current Capability / Failure Mode:** 서비스 분리를 목표로 삼고 분산비용·운영 constraint·bottleneck을 과소평가한다.
- **Target Capability:** 분산이 실제 가치를 만드는 조건을 판단하고 boundary·data·failure·operation trade-off를 통제한다.
- **Decision Level:** Decide.
- **Transfer:** 수업 산출물과 판단을 실제 업무의 동일 유형 결정에 재사용할 수 있어야 한다.

## Foundational Decision Lens Alignment

- **APPLY:** Systems Thinking; Lean Thinking; Theory of Constraints; Empiricism / Scientific Thinking.
- **Why:** 전체 delivery/operation flow와 현재 constraint를 보고, 분산가치를 작은 경계 검증과 운영 evidence로 확인한다.
- **Rule:** 관련 없는 Lens를 과정 형식상 억지로 추가하지 않는다. Lens는 Course-owned concept를 재정의하지 않고 판단을 강화한다.

## 2. Problem It Owns
- 언제 Monolith를 유지하고 언제 분산하는가?
- 어떤 Boundary가 Independent Service가 될 가치가 있는가?
- Service Autonomy와 Operational Cost의 Trade-off는 무엇인가?
- Remote Interaction이 만드는 Failure Mode는 무엇인가?
- Contract/Data/Consistency를 어떻게 보호하는가?
- 분산 후 System을 어떻게 관찰하고 운영하는가?

## 3. Core Narrative
`Domain/Module Boundary → Modular Monolith → Boundary Validation → Distribution Decision → Service Extraction → Data Ownership → Service Contract → Communication → Consistency → Failure/Resilience → Observability → Operation`

## 4. Decisions Learner Must Make
1. 분산이 실제 Business/Engineering Value를 만드는가?
2. Boundary가 독립 Change/Deploy/Scale/Ownership 단위인가?
3. Data Ownership을 분리할 수 있는가?
4. Sync/Async 중 어떤 Coupling을 감당할 것인가?
5. 어떤 Consistency Lag가 허용되는가?
6. Failure/Retry/Duplication을 어떻게 처리할 것인가?
7. 운영 복잡성을 감당할 Capability가 있는가?

## 5. Course Scope
### OWNER
Modular Monolith, Service Boundary Evaluation/Extraction, Data Ownership, Independent Deployment/Operation, Sync/Async, API/Event/Schema Contract, Compatibility/Contract Evolution, Integration Event, Distributed Consistency, Saga, Outbox, Idempotency, Partial Failure, Retry/Isolation/Fallback, Distributed Observability, Operational Complexity, Adoption/Rejection Decision.

### APPLY
DDD Bounded Context/Domain Event, SW Architecture Boundary/Port/Trade-off.

### NON-SCOPE / FORWARD
DDD 정의 재교육, CI/CD Pipeline 상세, Kubernetes/Broker Vendor Catalog, SRE 전체 → DevOps/전문 과정.

## 6. Key Distinctions
- Bounded Context ≠ Microservice
- Module ≠ Service
- Local Call ≠ Remote Call
- Domain Event ≠ Integration Event
- Eventual Consistency ≠ No Consistency
- Retry ≠ Resilience
- Observability ≠ Logging
- Saga ≠ Automatic Rollback

## 7. Learning Outcomes
1. Monolith/Modular Monolith/MSA 중 적절한 분산 수준을 판단한다.
2. Service Boundary와 Data Ownership을 설계한다.
3. API/Event Contract와 Compatibility Risk를 평가한다.
4. Sync/Async와 Consistency Strategy를 Trade-off한다.
5. Partial Failure와 Retry/Idempotency를 설계한다.
6. Observability/Operation Cost를 MSA 의사결정에 포함한다.

## 8. Principles / Trade-off / Failure
| Principle | Trade-off | Failure Condition |
|---|---|---|
| Distribution is not Default | 초기 확장성 환상은 줄지만 불필요한 운영비용 방지 | “MSA가 현대적”이라서 선택 |
| Boundary before Distribution | 경계 검증 시간이 필요 | 조직도/BC를 서비스로 즉시 변환 |
| Contract enables Autonomy | Versioning 비용 발생 | Consumer Impact 없이 Breaking Change |
| Consistency is Business Decision | 일부 즉시 일관성을 포기할 수 있음 | 모든 것을 분산 트랜잭션 또는 무조건 Eventual로 처리 |
| Failure is Normal | 설계/운영 복잡성 증가 | Happy Path만 설계 |

## 9. Exercise Evidence
- Modular Monolith Boundary
- Extraction Candidate와 Extract/Don't Extract 근거
- Data Ownership
- API/Event Contract
- Compatibility Change
- Failure Scenario
- Retry/Idempotency Design
- Consistency Decision
- Observability Plan

## LLM-Integrated Practice Design

공통 `support/01_governance/12_llm-integrated-practice-standard.md`를 적용한다. **4개**, 1일 4개, 총 약 **90분**이며 기존 instructional time 안에 포함한다.

상세 Practice Pack: `support/02_course-assets/04_msa/01_llm-integrated-practice-pack-v1.1.md`

| ID | Placement | Practice | Time | Core Decision |
|---|---|---|---:|---|
| P1 | T01/T03 | Should We Distribute? | 20분 | 분산이 실제로 비용을 지불할 가치가 있는가 |
| P2 | T04 | Service Boundary & Data Ownership | 25분 | 서비스 경계와 데이터 소유를 어디에 둘 것인가 |
| P3 | T05/T06 | Contract, Compatibility & Consistency | 25분 | 변경 호환성과 consistency 요구를 어떻게 함께 설계할 것인가 |
| P4 | T07/T08 | Failure + Observability + Ops Cost | 20분 | 장애 설계와 관찰성, 운영비용을 어떻게 한 결정으로 볼 것인가 |

운영은 `Learner Prompt → First Run → Instructor Intervention → Keep Going → Recommended Prompt Reveal → Compare/Adapt` 순서다. Recommended Prompt는 정답이 아니며, 평가는 Prompt 문장력이 아니라 해당 과정의 전문적 판단 Evidence를 기준으로 한다.

## 10. Curriculum Backbone — 8 Topics / 권장 순수 학습 400분
1. Why / When MSA — Distribution Economics — **40분**
2. DDD/SWA Recap → Boundary Candidate — **35분**
3. Modular Monolith / Boundary Validation — **45분**
4. Service Extraction / Data Ownership — **55분**
5. Service Contract / Compatibility — **55분**
6. Communication / Consistency — Saga/Outbox Awareness 포함 — **60분**
7. Failure / Resilience / Observability — **60분**
8. Operation Cost / Integrated Decision Workshop — **50분**

## 11. Awareness 1~5분
Choreography vs Orchestration, API Gateway, Service Mesh, Kubernetes, Platform Engineering은 위치와 목적만 소개한다. Tool Catalog로 확대하지 않는다.

## 12. Quality Gate
분산이 Default가 아닌가, BC와 Service를 구분하는가, Contract Evolution/Failure/Operation이 중심에 있는가, Saga/Outbox를 만능 Pattern으로 만들지 않는가를 확인한다.

---


LLM-integrated Practice 추가 Gate:
- Course duration에 맞는 Practice 수와 cadence를 충족하는가?
- 모든 Practice가 기존 instructional time 안에 포함되는가?
- Recommended Prompt 없이 시작하고 Intervention 후 Keep Going하는가?
- Prompt Engineering이 아니라 Course-owned decision/evidence를 평가하는가?
- Practice 때문에 기존 Course Ownership 경계가 이동하지 않는가?
## Portfolio Alignment v2.6
- **OWNER:** Service boundary/extraction, distributed communication/consistency/failure/operation, evolutionary distributed architecture trade-offs.
- **Key Inputs:** DDD bounded contexts and SW Architecture structure/evaluation.
- **Boundary:** CI/CD and end-to-end delivery flow belong to DevOps.
