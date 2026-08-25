# MSA Course Specification v1.0

> **Status:** Pre-curriculum specification candidate
> **Basis:** Program Governance v2.2.2
> **Purpose:** MSA를 분산 pattern catalog가 아니라 boundary / contract / failure / operation의 경제적 판단 과정으로 고정한다.

## 1. Identity

- **Course ID:** msa
- **Course Name:** Microservices Architecture
- **Portfolio Category:** Architecture & Distribution
- **Course Thesis:**

> 독립 서비스가 주는 자율성의 가치가 Network·Consistency·Failure·Operation 비용보다
> 클 때만 분산하고, 서비스 경계·계약·데이터·실패를 명시적으로 설계한다.

## 2. Problem It Owns

- 언제 monolith를 유지하고 언제 분산해야 하는가?
- 어떤 module/boundary가 independent service가 될 가치가 있는가?
- service autonomy와 operational cost의 trade-off는 무엇인가?
- remote interaction은 어떤 failure mode를 만든다?
- service contract가 진화할 때 consumer를 어떻게 보호하는가?
- local transaction을 벗어난 consistency를 어떻게 판단하는가?
- failure / retry / duplication / timeout을 어떻게 다루는가?
- 분산 후 system을 어떻게 관찰·운영하는가?

## 3. Prerequisite Recap

Minimum:
- DDD Bounded Context / Context Mapping
- SWA Boundary / Port / Dependency / Quality Trade-off

### Critical
`Bounded Context ≠ Microservice`

```text
Bounded Context
→ Module
→ Modular Monolith
→ Service
```

은 선택지 관계이지 자동 변환이 아니다.

## 4. Core Flow

```text
Domain / Module Boundary
→ Modular Monolith
→ Boundary Validation
→ Distribution Decision
→ Service Extraction
→ Data Ownership
→ Service Contract
→ Communication
→ Consistency
→ Failure / Resilience
→ Observability
→ Deployment / Operation
```

## 5. Canonical Ownership

### OWNER
- Modular Monolith
- Service Boundary Evaluation
- Service Extraction
- Data Ownership
- Independent deployment / operation
- Sync vs Async
- API Contract
- Event / Schema Contract
- Compatibility / Contract Evolution
- Integration Event
- Distributed Consistency / Transaction
- Saga
- Outbox
- Idempotency
- Partial Failure
- Timeout / Retry / Isolation / Fallback
- Distributed Observability
- Deployment / Scaling / Operational Complexity
- MSA adoption / rejection decision

### APPLY
- DDD Bounded Context
- DDD Domain Event
- SWA Port / Adapter
- SWA Quality Trade-off

### FORWARD
- DevOps deployment pipeline / operational flow
- Platform Engineering
- advanced SRE

## 6. Explicit Non-Scope

- Bounded Context canonical definition
- DDD Event Storming
- Clean Architecture deep teaching
- CI/CD pipeline details
- Kubernetes/tool catalog
- broker/vendor comparison
- SRE full course
- cloud-native product training

## 7. Key Distinctions

- Bounded Context ≠ Microservice
- Module ≠ Service
- Local call ≠ Remote call
- Domain Event ≠ Integration Event
- Transaction boundary ≠ business process boundary
- Eventual Consistency ≠ no consistency
- Retry ≠ resilience
- Observability ≠ logging
- Saga ≠ automatic rollback
- API Contract ≠ internal method signature
- Deployment autonomy ≠ organizational fashion

## 8. Distribution Decision

분산을 default로 두지 않는다.

Decision frame:

```text
Independent Change / Deploy / Scale / Ownership Value
                    vs
Network / Data / Failure / Security / Operation Cost
```

질문:
- boundary가 실제 독립 변화 단위인가?
- 독립 배포가 실제 business value를 만드는가?
- 서로 다른 scale profile이 있는가?
- failure isolation이 필요한가?
- data ownership을 독립시킬 수 있는가?
- 운영 복잡성을 감당할 수 있는가?

## 9. Modular Monolith First

모든 MSA가 반드시 monolith에서 시작해야 한다는 교리가 아니다.

원칙:
> boundary가 아직 검증되지 않았다면 분산 전에 더 싼 구조에서 경계를 검증하는 것이 유리하다.

Lab:
```text
Bounded Context candidate
→ Module boundary
→ dependency enforcement
→ change scenario
→ extract / don't extract decision
```

## 10. Service Contract

MSA에서 반드시 강화한다.

### API Contract
- operation semantics
- input/output
- error semantics
- compatibility
- versioning
- consumer impact

### Event Contract
- event meaning
- schema
- ordering assumptions
- duplication
- version evolution
- consumer compatibility

### Contract Evolution
- backward compatibility
- forward compatibility
- additive vs breaking change
- consumer-driven impact
- deprecation window

목적:
> service autonomy는 contract stability 없이는 성립하지 않는다.

## 11. Data Ownership

```text
Service Autonomy
→ State Ownership
→ Change Authority
→ Data Contract
```

금지:
- shared database table as hidden coupling
- direct cross-service schema dependency

단:
- reporting/analytics/read model은 별도 trade-off로 다룬다.

## 12. Communication

### Sync
장점:
- simple request/response
- immediate result

비용:
- temporal coupling
- latency accumulation
- cascading failure

### Async
장점:
- temporal decoupling
- buffering
- workflow flexibility

비용:
- eventual consistency
- duplication
- ordering
- observability complexity

목적은 async 찬양이 아니라 trade-off 판단이다.

## 13. Consistency

핵심:
> Consistency는 business decision이다.

질문:
- 어떤 invariant를 어디까지 즉시 지켜야 하는가?
- 어떤 consistency lag가 허용되는가?
- compensation이 가능한가?
- irreversible side effect가 있는가?

### Patterns
- Saga
- Transactional Outbox
- Idempotent Consumer

Pattern은 문제/force/대안과 함께 가르친다.

## 14. Failure / Resilience

분산 시스템에서 partial failure는 정상 조건이다.

필수:
- timeout
- retry
- idempotency
- backoff
- isolation
- fallback
- circuit breaking concept
- duplicate handling

중요:
- retry는 idempotency 없이 위험할 수 있다.
- resilience mechanism 자체가 side effect를 만들 수 있다.

## 15. Observability / Operation

필수:
- log / metric / trace
- correlation / request identity
- service health
- failure localization
- dependency visibility
- deployment/version visibility

Operational cost:
- deployment
- config
- secrets/security
- scaling
- on-call
- incident handling
- data migration
- schema evolution

## 16. Pattern Depth Policy

1일 과정이면 우선순위:

```text
Boundary
→ Contract
→ Failure
→ Operation
```

Saga / Outbox / advanced messaging pattern은 핵심 예제로 사용하되 전체 catalog로 확장하지 않는다.

2일 과정이라면:
- choreography vs orchestration
- detailed outbox
- schema evolution
- resilience
- observability lab
까지 심화 가능.

## 17. Exercise Evidence

Order domain에서:

1. Modular Monolith boundary
2. extraction candidate
3. extract / don't extract rationale
4. data ownership
5. API/Event contract
6. one compatibility change
7. one failure scenario
8. retry/idempotency design
9. consistency decision
10. observability plan

## 18. Suggested 8-Session Backbone

S01 Why / When MSA — Distribution Economics  
S02 DDD Recap → Boundary Candidate  
S03 Modular Monolith / Boundary Validation  
S04 Service Extraction / Data Ownership  
S05 Service Contract / Compatibility  
S06 Communication / Consistency  
S07 Failure / Resilience / Observability  
S08 Operation Cost / Integrated Decision Workshop  

Pattern details:
- Saga / Outbox / Idempotency는 S06–S07 내부 problem-solving examples로 배치.

## 19. Primary Source Baseline

- Chris Richardson / microservices.io — Saga, Transactional Outbox, Idempotent Consumer pattern references
- Martin Fowler — microservices background
- Sam Newman — architecture/operational trade-off secondary reference
- official protocol/platform docs는 implementation example일 뿐 curriculum spine이 아님

## 20. Quality Gate

- 분산이 default가 아닌가?
- Bounded Context와 Microservice를 구분하는가?
- contract evolution이 포함되는가?
- remote call failure가 핵심으로 드러나는가?
- consistency를 business decision으로 가르치는가?
- Saga/Outbox를 만능해법으로 가르치지 않는가?
- Observability/Operation이 부록으로 밀리지 않는가?
- DevOps tooling을 과도하게 가져오지 않는가?
