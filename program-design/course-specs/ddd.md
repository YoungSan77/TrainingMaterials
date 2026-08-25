# DDD Course Specification v1.0

> **Status:** Pre-curriculum specification candidate
> **Basis:** Program Governance v2.2.2
> **Purpose:** OOAD와의 계보를 유지하면서 DDD가 새로 소유하는 Domain 중심 판단을 고정한다.

## 1. Identity

- **Course ID:** ddd
- **Course Name:** Domain-Driven Design
- **Portfolio Category:** Engineering Foundations
- **Course Thesis:**

> 도메인의 개념·규칙·언어·경계를 명시적인 모델로 만들고,
> 모델과 구현이 함께 진화하도록 설계한다.

## 2. Problem It Owns

OOAD만으로도 객체 책임과 협력은 설계할 수 있다.
DDD가 필요한 문제는 다음이다.

- 동일 단어가 조직/시스템마다 다른 의미를 가진다.
- 중요한 business rule이 코드·문서·DB·서비스에 흩어진다.
- 모델과 구현이 분리되어 시간이 갈수록 의미가 붕괴한다.
- 어떤 규칙을 함께 즉시 보호해야 하는지 불분명하다.
- 조직/시스템 간 모델 의미가 충돌한다.
- system boundary를 기술 구조가 아니라 domain meaning 관점에서도 판단해야 한다.

## 3. OOAD Foundation

DDD를 OOAD 대체물로 가르치지 않는다.

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
Domain Invariant
Aggregate
Domain Service / Repository / Domain Event
Bounded Context / Context Mapping
Model Evolution / Explicit Semantics
```

### Minimum Recap
독립 수강자를 위해:
- Object / Responsibility / Collaboration
- Encapsulation
- Design by Contract
- Analysis Model vs Design Model
- Cohesion / Coupling
만 최소 재정박한다.

OO 원칙 자체를 장시간 재교육하지 않는다.

## 4. Core Flow

```text
Domain Discovery
→ Ubiquitous Language
→ Domain Model
→ Model-Driven Design
→ Entity / Value Object
→ Domain Invariant
→ Aggregate
→ Domain Interaction
→ Bounded Context
→ Context Relationship
→ Model Evolution
→ Explicit Semantics
```

## 5. Canonical Ownership

### OWNER
- Domain / Subdomain
- Ubiquitous Language
- Domain Model
- Model-Driven Design
- Entity
- Value Object
- Domain Invariant
- Aggregate / Aggregate Root
- Domain Service
- Repository concept
- Domain Event
- Event Storming / discovery technique
- Bounded Context
- Context Mapping
- Domain Model evolution
- Explicit Semantics need
- Domain Model ≠ Ontology

### APPLY
- OOAD Responsibility / DbC / GRASP / cohesion / coupling
- SWA dependency/boundary principles only as forward context
- QM evidence/verification principles

### FORWARD
- Bounded Context → MSA Service Boundary candidate
- Repository implementation placement → SWA Port/Adapter
- Domain Event outside boundary → MSA Integration Event
- Explicit Semantics → AI Context / Ontology bridge

## 6. Explicit Non-Scope

DDD는 다음을 소유하지 않는다.
- Bounded Context = Microservice 결정
- Application/Infrastructure dependency rule 정본
- Port/Adapter 구현 구조 상세
- Distributed transaction
- Saga / Outbox
- Deployment / resilience / observability
- AI Context / Guardrail / Harness
- Ontology 구현 기술

## 7. Key Distinctions

- Domain ≠ Application
- Subdomain ≠ Bounded Context
- Analysis Model ≠ Domain Model
- Concept ≠ Class
- Entity ≠ ORM Entity
- Value Object ≠ DTO
- Aggregate ≠ object graph
- Domain Invariant ≠ Object Invariant
- Domain Service ≠ Application Service
- Repository ≠ DAO
- Domain Event ≠ Integration Event
- Bounded Context ≠ Microservice
- Domain Model ≠ Ontology

## 8. Core Decision Questions

1. 이 문제에서 핵심 domain concept는 무엇인가?
2. 같은 용어가 문맥별로 다른 의미를 가지는가?
3. 어떤 business rule이 반드시 model 안에서 보호되어야 하는가?
4. 어떤 객체가 identity를 가지고 어떤 객체가 value로 정의되는가?
5. 어떤 invariant를 함께 즉시 보호해야 하는가?
6. Aggregate boundary를 무엇이 정당화하는가?
7. 어떤 behavior가 Entity/VO에 속하지 않고 Domain Service에 속하는가?
8. 어떤 사실이 Domain Event로 의미 있는가?
9. 어느 지점에서 하나의 model/language가 더 이상 일관되지 않는가?
10. 어떤 Bounded Context 관계가 translation/protection을 요구하는가?
11. Domain Model만으로 충분하지 않고 explicit semantics가 더 필요한 상황은 언제인가?

## 9. Model-Driven Design

과정의 중심은 pattern catalog가 아니다.

핵심:
> model은 분석용 그림으로 끝나지 않고 implementation과 지속적으로 연결되어야 한다.

따라서:
- 이름이 code에 반영되는가?
- rule이 model owner에 위치하는가?
- model change가 code/design에 반영되는가?
- code smell이 model weakness를 드러내는가?

를 반복적으로 묻는다.

## 10. Aggregate

Aggregate는 “객체 묶음”으로 가르치지 않는다.

```text
Domain Invariant
        ↓
Consistency Requirement
        ↓
Aggregate Boundary
        ↓
Aggregate Root
```

판단 기준:
- 어떤 invariant가 transaction/consistency boundary를 요구하는가?
- 너무 큰 Aggregate가 concurrency와 coupling을 키우지 않는가?
- reference convenience로 boundary를 정하지 않았는가?

## 11. Tactical Patterns

필수 본편:
- Entity
- Value Object
- Aggregate
- Domain Service
- Repository
- Domain Event

원칙:
- 이름 암기보다 언제 필요한지
- 어떤 rule/meaning을 보호하는지
- 어떤 trade-off가 있는지
를 우선한다.

## 12. Strategic Design

필수:
- Subdomain
- Bounded Context
- Context Mapping
- language/model boundary
- upstream/downstream relationship
- translation / protection 필요

중요:
> strategic design은 “microservice découpage”가 아니다.

## 13. Supple Design — Depth Policy

검토 후보:
- Intention-Revealing Interface
- Side-Effect-Free Function
- Assertion
- Conceptual Contour
- Specification pattern

### Recommended
16시간 이하 본편이라면:
- 개념 존재와 목적은 소개
- 전체 pattern catalog는 Advanced/Appendix

### Reason
핵심 Course Identity는 Domain Model / Invariant / Boundary다.
Supple Design을 과도하게 넣으면 Tactical Pattern catalog로 변질될 수 있다.

## 14. Explicit Semantics / Ontology Bridge

```text
Domain Model
→ Concept / Relation / Role / Constraint
→ Explicit Semantics
→ Ontology
→ AI Context
```

DDD에서 다룰 것:
- 왜 의미를 더 명시할 필요가 있는가
- Domain Model과 Ontology는 무엇이 다른가
- 언제 over-engineering인가

DDD에서 다루지 않을 것:
- RDF/OWL 기술 강의
- graph database 사용법
- AI retrieval implementation

## 15. Exercise Evidence

Order domain에서 학습자는 다음을 설명/작성할 수 있어야 한다.

1. Domain vocabulary
2. 핵심 Domain Model
3. Entity / VO 구분
4. 최소 2개 Domain Invariant
5. Aggregate boundary와 근거
6. Domain Service 필요 여부
7. Domain Event
8. Bounded Context candidate
9. Context relationship
10. 하나의 model evolution/change scenario

## 16. Suggested 8–12 Session Backbone

### Part 1 — Domain Meaning
S01 Why DDD / OOAD lineage  
S02 Domain / Subdomain / Ubiquitous Language  
S03 Domain Discovery / Event Storming  

### Part 2 — Model
S04 Domain Model / Model-Driven Design  
S05 Entity / Value Object  
S06 Invariant / Aggregate  
S07 Domain Service / Repository / Domain Event  

### Part 3 — Boundary
S08 Bounded Context  
S09 Context Mapping  
S10 Boundary / model translation lab  

### Part 4 — Evolution
S11 Model Evolution / Supple Design orientation  
S12 Explicit Semantics / Ontology bridge / MSA forward  

실제 시간 제약에 따라 8-session 압축형 또는 12-session 확장형으로 조정한다.

## 17. Primary Source Baseline

우선:
- Eric Evans — *Domain-Driven Design*
- Martin Fowler / Evans 관련 공식/원출처
- Vaughn Vernon 등은 secondary/implementation guidance로 사용 가능하나 원칙 정본은 Evans 계보 우선
- OO foundation은 Wirfs-Brock / Meyer / Larman 원전 참조

## 18. Quality Gate

- OOAD를 대체물처럼 설명하지 않는가?
- DDD가 pattern catalog로 축소되지 않는가?
- UL이 glossary로 축소되지 않는가?
- Aggregate가 object grouping으로 오해되지 않는가?
- BC가 Microservice로 자동 매핑되지 않는가?
- Domain Event와 Integration Event를 구분하는가?
- Repository가 DAO abstraction으로만 설명되지 않는가?
- Ontology를 필수 단계로 강제하지 않는가?
