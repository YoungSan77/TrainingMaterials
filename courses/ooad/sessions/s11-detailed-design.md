# S11. OOAD Next Step ② — 고급 설계와 AI-Native

- **상태:** 최종 승인 상세설계
- **Teaching Order:** Software Architecture → DDD → MSA → AI-Native
- **Positioning:** 네 전문과정의 축약본이 아니라, 각 전문영역의 Big Picture와 OOAD에서 확보한 Engineering Judgment가 어떻게 재사용·확장되는지를 보여주는 handoff session
- **현재 시간 기준:** Session Architecture의 35분을 유지하되, 실제 instructional time은 Whole-Curriculum Integration Review에서 재산정한다.
- **권장 Main Slides:** 26~30장. 숫자를 quota로 사용하지 않고 Keyword / Core Concept 하나당 대략 Main Slide 한 장 수준의 밀도를 기본으로 한다.

---

## 1. Session Purpose

OOAD에서 확보한 다음 판단을 회수한다.

```text
Problem
Model
Responsibility
Collaboration
Contract
Boundary
Dependency
```

S11의 핵심 질문은 다음과 같다.

> **OOAD에서 확보한 Problem·Model·Responsibility·Collaboration·Contract·Boundary·Dependency 판단은 Software Architecture·DDD·MSA·AI-Native에서 어떻게 재사용되며, 각 전문영역은 어떤 새로운 문제와 Engineering Judgment를 추가로 소유하는가?**

네 영역은 OOAD의 하위 개념이 아니다. 이 순서는 Engineering lifecycle이 아니라 **learning sequence / concern map**이다.

```text
Software Architecture
→ DDD
→ MSA
→ AI-Native
```

---

## 2. Learning Outcomes

학습자는 S11 종료 시 다음을 할 수 있어야 한다.

- OOAD의 object-level 판단과 Software Architecture의 system-level 판단을 구분한다.
- DDD의 Domain Model, Tactical Design, Strategic Design 관계를 큰 그림으로 설명한다.
- Subdomain과 Bounded Context, Bounded Context와 Microservice를 구분한다.
- MSA의 핵심을 작은 Service가 아니라 autonomy·boundary·data ownership·distribution cost 관점으로 설명한다.
- API Composition과 Materialized Read Model, CQRS와 Event Sourcing, Compensation과 DB rollback을 구분한다.
- AI-Native에서 Human/Agent responsibility, knowledge, context, control, verification을 다시 설계해야 하는 이유를 설명한다.
- 주어진 문제가 어느 전문영역의 추가 판단을 요구하는지 근거와 함께 식별한다.

---

## 3. Scope and Teaching Principle

각 영역은 다음 구조로 설명한다.

```text
Definition
+
Big Picture
+
Representative Structure
+
OOAD Connection
```

다음은 specialist course ownership으로 넘긴다.

- Architecture evaluation·ATAM과 style별 상세 설계
- DDD Aggregate design workshop·Context Mapping 실습
- MSA service decomposition·CQRS/Saga 구현·resilience 상세
- Agent framework 비교·Ontology 구축·Harness framework 구현

Pattern catalog, 상세 implementation, 억지 Code Example을 추가하지 않는다. Diagram과 Text가 개념을 더 직접적으로 보여주면 Code를 사용하지 않는다.

---

## 4. Opening — Common Engineering Lens

새로운 Engineering 접근은 기존 Capability를 자동으로 제거하지 않는다.

```text
Existing Engineering Judgment
+
New Problem Scope
        ↓
기존 Judgment 재사용
+
새로운 Judgment 추가
```

기존 Engineering Capability가 취약한 상태에서 새로운 복잡성을 추가하면 Technical Debt·Rework·Stabilization Cost의 위험이 커질 수 있다. 그렇다고 모든 기반이 완성될 때까지 새 기술을 미루는 것도 현실적이지 않다.

> **Adopt + Strengthen + Verify + Learn + Expand**

이 lens는 Opening과 Closing에서만 사용하고 각 전문영역의 본편을 지배하지 않는다.

---

# Part I. Software Architecture

## 5. Software Architecture — Big Picture

> **Software Architecture는 시스템의 주요 구성요소와 관계, 경계와 Dependency, 그리고 중요한 Quality Attribute와 Constraint를 만족시키기 위한 주요 구조적 결정을 다루는 영역이다.**

```text
OOAD
Object Responsibility / Collaboration
        ↓
Software Architecture
System Structure
Boundary / Dependency
Quality Attribute / Trade-off
```

OOAD의 object-level 책임 판단을 버리는 것이 아니라 system-level structure와 품질 판단으로 범위를 확장한다.

---

## 6. Quality Attribute and Decision Flow

> **Quality Attribute는 시스템이 기능을 어떤 품질로 제공해야 하는지를 나타내는 특성이다.**

Recognition 수준의 대표 항목:

- Availability
- Performance
- Scalability
- Security
- Reliability
- Modifiability
- Testability
- Deployability

목록이 Decision을 만들지는 않는다. 실제 Need와 Constraint에서 중요한 품질을 구체화하고 대안을 비교한다.

```text
Need / Constraint
→ Quality Attribute
→ Architecture Alternative
→ Trade-off
→ Decision
```

---

## 7. Layered Architecture — Structure and Responsibility

> **Layered Architecture는 서로 다른 종류의 Responsibility를 논리적 Layer로 분리하고 각 Layer의 역할과 Dependency를 통제하는 Architecture 방식이다.**

```text
Controller / Presentation
→ I/O와 외부 표현

Application
→ Use Case orchestration

Domain / Entity
→ Business Rule와 Invariant

Infrastructure
→ DB / External System / Framework
```

Application은 Use Case 흐름을 조정하고, Domain/Entity는 Business Rule과 Invariant를 소유한다. Infrastructure는 technical capability를 구현한다.

---

## 8. DIP — Layer 이름보다 Dependency Direction

Layer를 나누는 것만으로 Boundary가 보호되지는 않는다.

```text
Bad

Application
    ↓
DB Implementation
```

```text
DIP

Application
    ↓
Repository Port
    ↑
Infrastructure
```

> **DIP가 Dependency Direction을 통해 Business Policy를 Technical Detail로부터 보호한다.**

```text
S07
Object variation 보호

S11
System boundary 보호
```

같은 Principle을 새로운 abstraction scale에서 재사용한다. DIP를 모든 Architecture의 절대 조건이나 concrete class마다 interface를 만드는 규칙으로 일반화하지 않는다.

---

## 9. Architecture Trade-off — Payment Availability

Requirement:

> **Payment System 장애 중에도 Order 조회는 가능해야 한다.**

```text
A. Live Call

Order → Payment

Latest Data ↑
Failure Propagation ↑
Runtime Dependency ↑
```

```text
B. Local Read Model

Payment → Read Model ← Order Query

Query Availability ↑
Failure Isolation ↑
Freshness ↓
Synchronization / Recovery Cost ↑
```

Decision:

> **Order 조회 Availability를 Payment 상태의 실시간 최신성보다 우선하고 동기화·복구 비용을 감당할 수 있다면 B를 선택할 수 있다.**

---

## 10. Software Architecture Handoff

```text
System Structure
+
Boundary / Dependency
+
Quality Attribute / Constraint
+
Trade-off
        ↓
Architecture Decision
```

Layered, Ports & Adapters / Hexagonal, Event-Driven, Microservices는 recognition 수준으로 연결한다. 상세 Architecture Design과 evaluation은 Software Architecture 과정으로 넘긴다.

---

# Part II. Domain-Driven Design

## 11. DDD — Big Picture

> **Domain-Driven Design은 복잡한 Domain의 지식을 Model에 지속적으로 반영하고, Domain의 의미·규칙·경계를 Software Design과 일치시키기 위한 접근이다.**

Domain Model은 Tactical Design의 하위 Pattern이 아니다.

```text
                 DDD
                  │
             Domain Model
             /          \
            /            \
   Tactical Design    Strategic Design
   Model 내부          Model 의미 / 경계
```

Tactical Design과 Strategic Design은 lifecycle phase가 아니며 서로 feedback하며 Domain Model을 발전시킨다.

---

## 12. Domain Model — Anemic and Rich

> **Domain Model은 Software가 다루는 Domain의 중요한 Concept·Relationship·State·Behavior·Rule을 표현한 모델이다.**

```text
Anemic

Domain Object
= State 중심

Business Rule / Behavior
= 외부 Service에 분산
```

```text
Rich

Domain Object
= State
+ Behavior
+ Rule
+ Invariant
```

> **모든 Domain Object가 Rich할 필요는 없다. 그러나 의미 있는 Business Rule·State Transition·Invariant의 owner가 되어야 할 Object까지 단순 Data Holder로 만들면 Domain Model이 빈약해진다.**

---

## 13. Tactical Design Map

> **Tactical Design은 하나의 Domain Model 안에서 State·Behavior·Identity·Value·Rule·Consistency를 명확하게 표현하기 위한 설계 개념과 Pattern의 집합이다.**

```text
Entity
→ Identity

Value Object
→ Value / Meaning

Aggregate
→ Consistency Boundary

Repository
→ Domain Object access abstraction

Domain Service
→ 특정 Entity/VO에 자연스럽게 속하지 않는 Domain Behavior

Domain Event
→ Domain에서 의미 있는 Event
```

Pattern 이름을 추가하는 것 자체가 Domain Behavior나 더 나은 Model을 만들지는 않는다.

---

## 14. Aggregate — Consistency Boundary

> **Aggregate는 변경 시 즉시 일관성을 함께 보장해야 하는 Domain Object의 경계이며, 외부 명령은 Aggregate Root를 통해 Invariant를 보호한다.**

```text
Order ← Aggregate Root
 ├ OrderItem
 └ OrderItem

External Change
→ Aggregate Root
→ Internal Objects
```

핵심 질문:

> **어디까지 즉시 일관성을 함께 보호해야 하는가?**

Aggregate workshop이나 구현 상세로 확장하지 않는다.

---

## 15. Strategic Design Map

> **Strategic Design은 큰 Domain을 서로 다른 의미와 책임을 가진 영역으로 나누고, Model의 의미 경계와 Context 간 관계, 설계 투자 위치를 판단하는 접근이다.**

```text
Ubiquitous Language
→ Context 안의 공통 언어

Subdomain
→ Business Problem Space의 구분

Core Domain
→ 핵심 Business Value 영역

Bounded Context
→ Model / Language가 일관된 경계

Context Map
→ Context 간 관계
```

```text
Subdomain
= Problem Space

Bounded Context
= Model / Language Boundary

Subdomain ≠ Bounded Context
```

두 경계는 관련되지만 항상 1:1 대응하지 않는다.

---

## 16. Bounded Context Example

```text
Sales Context

Order
Price / Discount / Payment
```

```text
Fulfillment Context

FulfillmentOrder
Shipment / Dispatch
```

같은 Business Entity를 참조하거나 같은 identifier를 공유해도 Context별 State·Rule·Responsibility·Vocabulary가 달라질 수 있다.

---

## 17. DDD Handoff to MSA

```text
DDD
Domain / Context Boundary
        ↓ evidence
MSA
Service / Deployment Boundary
```

> **Bounded Context ≠ Microservice**

DDD의 logical/model boundary는 Service Boundary 판단의 evidence가 될 수 있지만 deployment unit으로 기계 변환되지 않는다. Context Mapping과 Aggregate 설계 실습은 DDD 과정으로 넘긴다.

---

# Part III. Microservices Architecture

## 18. MSA — Big Picture

> **Microservices Architecture는 독립 배포 가능성을 높이도록 Service Boundary와 Ownership을 구성하고, Service별 Business Capability와 Data Ownership을 통해 변경·확장·운영의 자율성을 추구하는 분산 Architecture 접근이다.**

```text
Independent Service
→ Service Boundary
→ Data Ownership
→ Distributed Data
→ Query / Transaction / Consistency
```

핵심은 `Small Service`가 아니라 autonomy다. 독립성은 절대 상태가 아니라 change·deployment·data·team·runtime dependency별 degree의 문제다.

---

## 19. Service Boundary

> **Service Boundary는 어떤 Business Capability·Responsibility·Data를 하나의 실행·배포 단위가 소유할지 결정하는 경계다.**

판단 evidence:

- Business Capability
- Bounded Context
- Cohesion
- Change Reason
- Data Ownership
- Scaling / Failure / Operation

```text
Logical Boundary
≠
Deployment Boundary
```

DDD Model을 Service로 기계 변환하지 않는다.

---

## 20. Data Ownership — Shared vs Service-owned

```text
Shared DB

Order ─────┐
Payment ───┼→ Shared Data
Shipping ──┘
```

Shared Schema와 direct data access가 Service의 독립 변경·배포를 제한하는지 판단한다.

```text
Service-owned Data

Order Service    → Order Data
Payment Service  → Payment Data
Shipping Service → Shipping Data
```

> **Database per Service의 본질은 물리 DB server 수가 아니라 Logical Data Ownership이다.**

Independent Deployment가 반드시 Database per Service를 요구하는 것은 아니다. Shared Data Coupling이 autonomy를 제한할 때 ownership 분리가 design pressure에 대한 대안이 된다.

---

## 21. Distributed Query — Two Alternatives

Data가 Service별로 분리되면 composite query 방법을 판단해야 한다.

```text
A. API Composition

Query
 ├→ Order Service
 ├→ Payment Service
 └→ Shipping Service

Freshness ↑
Runtime Dependency / Latency ↑
```

```text
B. Materialized Read Model

Order ─────┐
Payment ───┼→ Read Model → Query
Shipping ──┘

Query Simplicity / Availability ↑
Synchronization / Staleness / Recovery Cost ↑
```

Business freshness requirement, failure tolerance, query load와 operational cost를 근거로 선택한다.

---

## 22. CQRS — Positioning

> **CQRS는 Command Responsibility / Model과 Query Responsibility / Model을 분리하는 Pattern이다.**

```text
Command Model
≠
Query Model
```

Materialized Read Model은 Query Model을 구현하는 한 방법일 수 있다.

```text
CQRS ≠ Event Sourcing
CQRS does not require Event-Driven Architecture
```

CQRS는 MSA의 필수 Pattern이 아니며 Read와 Write의 요구가 충분히 다를 때 검토하는 대안이다. CQRS와 Event Sourcing 구현은 전문과정으로 넘긴다.

---

## 23. Eventual Consistency

> **Eventual Consistency는 분산된 데이터가 모든 순간 즉시 동일하지 않을 수 있지만, update propagation과 recovery가 정상적으로 계속되고 추가 변경이 없다면 시간이 지나 일관된 상태로 수렴하는 Consistency Model이다.**

```text
10:00:00 Payment Completed

10:00:01 Read Model = Pending

10:00:03 Read Model = Completed
```

Stale read의 허용 범위와 복구 기준은 Pattern이 아니라 Business Requirement와 운영 조건이 결정한다.

---

## 24. Saga — Distributed Business Transaction

> **Saga는 여러 Service의 Local Transaction을 연결하고, 중간 실패 시 필요한 Compensating Action을 수행하여 하나의 분산 Business Transaction을 관리하는 Pattern이다.**

```text
Order Tx
  ↓
Payment Tx
  ↓
Inventory Tx
```

실패:

```text
Inventory FAILED
      ↓
Payment Refund
      ↓
Order Cancel
```

```text
Compensation ≠ DB Rollback
```

Compensation은 새로운 Business Action이며 실패할 수 있다. Recovery와 중간 상태 관리가 필요하다. Orchestration / Choreography 구현은 다루지 않는다.

---

## 25. MSA Recognition Map and Handoff

```text
Communication
→ REST / Messaging / Event

Resilience
→ Timeout / Retry / Circuit Breaker

External Entry
→ API Gateway

Reliable Publishing
→ Transactional Outbox
```

Service Discovery는 필요할 때 Notes에서만 언급한다.

> **MSA는 Modularity를 Deployment와 Network Boundary까지 확장하면서 Distributed Query·Transaction·Consistency·Failure·Operation 문제를 받아들이는 Architecture Decision이다.**

Service decomposition, pattern implementation과 distributed resilience 상세는 MSA 과정으로 넘긴다.

---

# Part IV. AI-Native Software Engineering

## 26. AI-Native — Big Picture

> **이 과정에서 AI-Native Software Engineering은 AI Agent를 분석·설계·구현·검증 작업의 수행 주체 중 하나로 포함하고, Human과 Agent의 Responsibility·Knowledge·Execution·Verification 구조를 재설계하는 접근으로 정의한다.**

업계 전체의 단일 표준 정의를 주장하지 않는다.

```text
Human / Agent Responsibility
Knowledge
Context
Ontology / Knowledge Model
Guardrail
Harness
Human Feedback
```

이들은 sequential pipeline이 아니라 서로 다른 Engineering concern이다. Ontology는 필수 layer가 아니다.

---

## 27. Human / Agent Responsibility

핵심 질문:

> **AI가 무엇을 할 수 있는가가 아니라 어떤 Responsibility를 어떤 조건과 Control 아래 위임할 것인가?**

판단 기준:

- Risk
- Uncertainty
- Reversibility
- Tacit Knowledge Dependency
- Verification Cost

```text
Routine / Reversible / Easy to Verify
→ Agent 비중 확대 가능

High Risk / Tacit / Hard to Verify
→ Human Judgment 확대
```

> **Agent는 목표와 Context를 바탕으로 판단·생성·Tool 사용·실행 등의 작업을 수행하는 AI 기반 실행 주체다.**

---

## 28. Explicit / Tacit Knowledge and Context

```text
Explicit Knowledge
→ Requirement / Model / Rule / Decision / Test

Tacit Knowledge
→ Experience / Context / Judgment / Pattern Recognition
```

Tacit Knowledge는 Agent에게 자동으로 전달되지 않는다.

```text
Provided Context
+ Missing Knowledge
        ↓
Model Inference
```

> **출력 변동 여부와 별개로 Model Inference가 실제 Domain Rule·조직 경험·상황 판단과 일치한다는 보장은 없다.**

Non-determinism과 correctness를 동일시하지 않는다.

> **Context Engineering은 Agent가 현재 작업에 필요한 목표·지식·제약·상태·Tool·Verification Criteria를 선택하고 구성하여 제공하는 활동이다.**

Prompt는 Context의 일부다.

---

## 29. Knowledge Representation, Guardrail and Harness

### Ontology / Knowledge Model

Ontology는 AI-Native의 필수 layer가 아니라 **필요한 경우 사용하는 Knowledge Representation Approach**다.

```text
Concept
Relationship
Property
Semantic Constraint
```

Operational Business Rule 전체가 반드시 Ontology에 포함되는 것은 아니다. 핵심 난점은 형식 자체보다 조직의 Explicit/Tacit Knowledge에서 중요한 의미를 발견하고 충분히 정확하게 외재화하는 것이다.

### Guardrail

```text
Allowed / Forbidden
Constraint
Policy
Human Approval Boundary
```

### Harness

```text
Agent
 ↓
Build / Test / Static Analysis / Architecture Check
 ↓
Evidence
 ↓
Feedback
```

Harness는 기존 Test/CI를 대체하지 않고 Verification Capability를 Agent execution까지 연결한다.

---

## 30. Human Feedback and Closing

Human은 단순 approver가 아니다.

```text
Agent Work
→ Verification
→ Missing Knowledge 발견
→ Human Judgment
→ Model / Rule / Test / Context 보강
→ 재수행
```

외재화하기 어렵거나 위험한 판단은 Human이 직접 소유한다.

최종 회수:

```text
OOAD
Responsibility / Collaboration / Contract / Boundary / Dependency
        │
        ├→ Software Architecture
        │  System Structure / Quality / Trade-off
        │
        ├→ DDD
        │  Domain Meaning / Behavior / Context
        │
        ├→ MSA
        │  Deployment / Data / Distribution
        │
        └→ AI-Native
           Human-Agent / Knowledge / Control / Verification
```

> **Software Architecture·DDD·MSA·AI-Native는 OOAD의 하위 개념이 아니다. OOAD에서 확보한 Engineering Judgment를 서로 다른 Problem Scope에서 재사용하면서 각자의 새로운 판단을 추가한다.**

> **S11의 목적은 네 전문영역을 축약 강의하는 것이 아니라, 각 영역의 큰 그림과 OOAD와의 연결을 이해하고 이후 어떤 전문영역의 판단이 필요한지 식별하게 하는 것이다.**

---

## Closing Evaluation

Order System에 다음 상황이 함께 존재한다.

- Business Rule이 여러 Service에 흩어져 있다.
- Application이 DB detail에 직접 의존한다.
- Payment의 독립 배포 필요성이 커지고 있다.
- Order / Payment / Shipping data 분리를 검토한다.
- 자동 Verification이 약한 상태에서 AI Coding Agent를 확대하려 한다.

학습자는 각 문제를 다음 형식으로 분류한다.

```text
OOAD에서 이미 확보한 판단
→ 새롭게 남은 문제
→ Owner 영역
→ 추가로 필요한 Judgment / Evidence
```

평가 기준:

- 네 영역을 OOAD의 하위 개념이나 lifecycle 단계로 배열하지 않는다.
- Bounded Context를 Microservice로 기계 변환하지 않는다.
- CQRS·Saga·Ontology를 모든 상황의 필수 solution으로 선택하지 않는다.
- 얻는 가치뿐 아니라 비용·실패·운영·검증 조건을 함께 설명한다.

---

## Whole-Curriculum Integration Follow-up

### Main Slide Architecture — 현재 추정 29장

| 영역 | Main Slides | 구성 |
|---|---:|---|
| Opening | 2 | Session Purpose·Concern Map / Common Engineering Lens |
| Software Architecture | 5 | Big Picture·QA / Layered / DIP / Trade-off / Handoff |
| DDD | 7 | Big Picture / Domain Model / Tactical Map / Aggregate / Strategic Map / BC Example / MSA Handoff |
| MSA | 8 | Big Picture / Service Boundary / Data Ownership / Distributed Query / CQRS / Eventual Consistency / Saga / Recognition·Handoff |
| AI-Native | 5 | Big Picture / Responsibility / Knowledge·Context / Ontology·Guardrail·Harness / Human Feedback |
| Closing | 2 | Integrated Map·Thesis / Evaluation |
| **합계** | **29** | Notes·recognition·appendix는 별도 Main Slide로 기계 분리하지 않는다. |

이 수치는 현재 content density의 추정값이며 quota가 아니다. Deck stage에서 Keyword를 여러 장으로 자동 분해하지 않고, 실제 설명·interaction 밀도에 따라 인접 내용을 한 장에서 통합할 수 있다.

S11 내용 승인 후 Whole-Curriculum Integration Review에서 다음을 명시적으로 재검토한다.

1. 현재 35분 allocation과 26~30장 Main Slide의 실제 강의 가능성
2. S10/S11 시간 재배분 필요성
3. S11 content 중 Main Slide / Diagram / Notes / Recognition 구분
4. S07/S08/S10의 DIP·Payment example과 S11 reinforcement progression
5. 네 전문과정 ownership과 S11 handoff depth
6. Foundation / Technical Debt lens가 Opening/Closing에만 유지되는지

이번 단계에서는 전체 16시간을 임의로 재배분하지 않는다.
