# 01. Program Reference Frame v2.2

> **Status:** Canon candidate
> **Scope:** 확장 가능한 교육 프로그램 전체. 현재 Portfolio는 별도 `portfolio/course-catalog.md`가 소유한다.
> **Current engineering anchors:** OOAD · DDD · SW Architecture · MSA · AI-Native Software Engineering
> **Cross-cutting course:** Modern QM
> **Bridge:** Ontology / Explicit Semantics
> **Rule:** Program Governance는 과정 수와 과정명 변화에 안정적이어야 하며, 현재 과정 목록을 정본 구조에 고정하지 않는다.
> **Purpose:** 프로그램·커리큘럼·교재·실습·슬라이드가 과정별 최적화나
> 최신 유행에 끌려 전체 축을 잃지 않도록 최상위 판단 기준을 고정한다.

------------------------------------------------------------------------

## 1. 최상위 명제

**소프트웨어 공학의 핵심은 현실 문제의 개념·책임·관계·경계·제약을 필요한
수준까지 명시적으로 모델링하고, 변화와 실행의 영향을 통제 가능한 구조로
만드는 것이다.**

구현 기술과 도구가 바뀌어도 다음 질문은 남는다.

  -----------------------------------------------------------------------
  질문                                판단 대상
  ----------------------------------- -----------------------------------
  **What?**                           무엇을 구분하고 모델링해야 하는가?

  **Who?**                            누가 알고, 판단하고, 수행할 책임을
                                      갖는가?

  **How?**                            책임 주체들은 어떤 계약과
                                      상호작용으로 협력하는가?

  **Where?**                          상태·규칙·변경·배포·실행의 경계를
                                      어디에 둘 것인가?

  **Why / Quality?**                  어떤 품질·제약·Trade-off 때문에 이
                                      구조를 선택하는가?

  **Meaning?**                        사람·시스템·AI가 개념과 규칙의
                                      의미를 어떻게 공유하는가?
  -----------------------------------------------------------------------

> v1의 5문항에 **Why / Quality**를 독립 축으로 추가한다. SW
> Architecture와 MSA를 제대로 포괄하려면 "어디에 경계를 둘
> 것인가"만으로는 부족하고, **왜 그 구조를 선택했는가**가 명시되어야
> 한다.

------------------------------------------------------------------------

## 2. 현재 Engineering Portfolio Snapshot

``` text
                    Core Engineering Track

      OOAD  ─────────→  DDD  ─────────→  AI-Native SE
       │                │  ╲               ▲
       │                │   ╲ Ontology     │
       │                │    ╲ / Semantics │
       │                │     ─────────────┘
       │                │
       └──────┐    ┌────┘
              ▼    ▼
          SW Architecture ─────────→ MSA
          [Specialized]             [Specialized]
```

이 그림은 **강제 선수 순서가 아니라 현재 Engineering Portfolio의 개념 확장 관계**다.
과정의 추가·분리·통합은 `portfolio/course-catalog.md`에서 관리하며 이 Reference Frame의 최상위 명제를 재정의하지 않는다.

### Cross-Cutting Professional Course

- **Modern QM** --- 다른 과정의 기술 개념을 재정의하지 않고, Prevention / Verification / Evidence / Gate / Feedback / Continuous Improvement 관점에서 전체 Engineering System의 품질을 다룬다.
- QM은 위 그림의 마지막 단계가 아니라 여러 과정에 횡단 적용되는 과정이다.

### Core Track

1.  **OOAD** --- 현실 문제를 모델·책임·협력으로 구조화한다.
2.  **DDD** --- 도메인의 개념·규칙·언어·경계를 명시적인 모델로 만든다.
3.  **AI-Native Software Engineering** --- 명시된 의도·모델·제약을
    바탕으로 AI에게 작업을 위임하고 실행을 검증·통제한다.

### Specialized Track

4.  **SW Architecture** --- 시스템 수준의 구조적 의사결정과 품질
    Trade-off를 다룬다.
5.  **MSA** --- 독립 서비스로 분산할 가치와 분산으로 새로 생기는
    복잡성의 Trade-off를 다룬다.

### Bridge

-   **Ontology / Explicit Semantics** --- DDD의 Domain Semantics를 AI가
    소비 가능한 명시적 의미 구조로 확장하는 다리.
-   현재 독립 과정으로 두지 않는다. 필요성이 커질 때 별도 전문과정으로
    분리할 수 있다.

------------------------------------------------------------------------

## 3. Course 1 --- OOAD

### Course Thesis

**현실의 문제를 모델·책임·협력으로 구조화한다.**

### Core Flow

`Problem → Requirement → Analysis Model → Object → Responsibility → Collaboration → Design Model → Code`

### Owns

-   Object, Message, State, Behavior, Encapsulation
-   Use Case와 분석 관점
-   정적·동적 모델링
-   Conceptual Model / Analysis Model
-   Responsibility, Collaboration, GRASP
-   Cohesion / Coupling의 객체·모듈 기초
-   SOLID와 객체 설계 원리
-   Pattern의 역할과 선택 원리
-   TDD / Refactoring의 설계 피드백 역할

### Bridges Forward

-   Object/Responsibility → DDD의 Domain Responsibility
-   DIP/Cohesion/Coupling → SW Architecture의 구조·의존성
-   Model/Meaning → DDD의 Domain Model

### Does Not Own

-   DDD tactical patterns의 정본 교육
-   Architecture Driver / Quality Attribute / Architecture Evaluation
-   Distributed-system patterns
-   AI Context / Guardrail / Harness

------------------------------------------------------------------------

## 4. Course 2 --- DDD

### Course Thesis

**도메인의 개념·규칙·언어·경계를 명시적인 모델로 만든다.**

### Core Flow

`Domain Discovery → Ubiquitous Language → Domain Model → Invariant → Aggregate → Domain Interaction → Bounded Context → Context Relationship → Explicit Semantics`

### Owns

-   Domain / Subdomain
-   Ubiquitous Language
-   Domain Model
-   Entity / Value Object
-   Invariant
-   Aggregate / Aggregate Root
-   Domain Service
-   Repository의 Domain 의미
-   Domain Event
-   Event Storming 등 discovery technique
-   Bounded Context / Context Mapping
-   Domain Model의 진화와 경계

### Bridges Forward

-   Bounded Context → MSA의 Service Boundary 후보
-   Domain Model → SW Architecture에서 보호·배치할 핵심 정책
-   Domain Semantics → Ontology / AI Context

### Does Not Own

-   Bounded Context를 Microservice로 구현할지 결정하는 것
-   Application/Infrastructure dependency structure의 정본
-   Distributed transaction / resilience
-   Ontology 구현 기술
-   AI 실행 구조

------------------------------------------------------------------------

## 5. Course 3 --- SW Architecture

### Course Thesis

**중요한 품질과 제약을 만족하도록 시스템 수준의 구조와 의존성을 선택하고,
그 Trade-off를 설명·검증하며 변화에 따라 지속적으로 진화시킨다.**

### Core Flow

`Drivers → Quality / Constraints → Policy vs Detail → Decomposition → Dependency → Architecture Style → Decision → Enforcement → Evaluation → Evolution`

### Owns

-   Architecture의 목적과 범위
-   Architecture Drivers
-   Quality Attributes와 scenario-based reasoning
-   System-level decomposition
-   Module / Component와 dependency
-   DIP의 시스템 수준 확장과 Dependency Rule
-   **Clean Architecture를 기본 구조적 기준점으로 사용**: Policy와 Detail의 분리, Dependency Rule, Use Case/Application boundary
-   Hexagonal / Onion 등 인접 구조와의 공통점·차이를 비교하되 이름 암기로 가르치지 않음
-   Layered 등 다른 style/pattern은 Driver와 Quality Attribute에 따라 선택
-   Application boundary / Port / Adapter
-   Architecture Decision과 Trade-off
-   Architecture Fitness / Enforcement / Governance
-   **Evolutionary Architecture**: guided incremental change, fitness function, 다차원 변화 관리
-   Architecture Evaluation과 continuous evolution

### Uses

-   OOAD의 responsibility / cohesion / coupling / DIP
-   DDD의 Domain Model과 domain boundary

### Critical Decision

**좋은 Architecture는 특정 구조가 아니라, 중요한 품질과 변화에 대해 설명
가능한 선택이다.**

### Current Curriculum Gap to Close

기존 SW Architecture 과정은
`Spaghetti → Transaction Script → Rich Domain → Dependency Inversion`이라는
진화형 실습이 강점이다. 이 흐름은 **Clean Architecture의 Policy/Detail 분리와
Dependency Rule을 학습시키는 구조적 spine**으로 재정박한다.

단, Clean Architecture를 Software Architecture 전체와 동일시하지 않는다.
Architecture의 선택은 Architecture Driver와 Quality Attribute Scenario가 먼저이며,
Clean Architecture는 중요한 정책을 기술 세부사항으로부터 보호하는 기본 구조적 렌즈다.

여기에 **Evolutionary Architecture**를 시간축으로 결합한다.
Architecture는 한 번 결정하고 끝나는 청사진이 아니라, 중요한 architectural
characteristics를 fitness function 등으로 지속 검증하면서 guided incremental change를
수용해야 한다.

따라서 본 과정의 판단 spine은 다음과 같다.

`Driver / Quality → Structural Decision → Dependency Rule → Evidence / Fitness → Evolution`

------------------------------------------------------------------------

## 6. Course 4 --- MSA

### Course Thesis

**분산으로 얻는 자율성의 가치가 Network·Consistency·Failure·Operation
비용보다 클 때만 서비스 경계를 분리한다.**

### Core Flow

`Domain/Module Boundary → Modular Monolith → Boundary Validation → Distribution Decision → Service Extraction → Communication → Consistency → Failure/Resilience → Observability/Operation`

### Owns

-   Modular Monolith
-   Service Boundary evaluation
-   Service extraction
-   Independent deployment/operation의 의미
-   Sync vs Async communication
-   Integration Event / Messaging
-   Distributed consistency / transaction
-   Saga / Outbox 등 분산 패턴
-   Failure / resilience
-   Distributed observability
-   Deployment / scaling / operational complexity
-   분산 여부와 경계의 경제적 판단

### Uses

-   DDD의 Bounded Context / Context Mapping
-   SW Architecture의 Port / Adapter / Quality Trade-off

### Non-negotiable

**Bounded Context ≠ Microservice**

`Bounded Context → Module | Modular Monolith | Service`

### Current Curriculum Gap to Close

기존 MSA 과정은 **경계를 먼저 모듈러 모놀리스에서 싸게 검증한 뒤
추출**한다는 흐름이 매우 좋다. 다만 8교시 안에서
**resilience·observability·deployment/operation**이 충분히 독립 주제로
드러나지 않는다. 핵심 과정의 범위를 유지하려면 기존 내용을 압축하거나
과정 시간을 늘리는 선택이 필요하다.

------------------------------------------------------------------------

## 7. Course 5 --- AI-Native Software Engineering

### Course Thesis

**AI의 능력을 활용하되, 책임·Context·제약·검증 구조를 설계하여 확률적
실행을 공학적으로 통제한다.**

### Evolution

`AI as Tool → AI-assisted → Specification → Context → Guardrail → Harness → Bounded Autonomy → Agentic Workflow → Evaluation`

### Owns

-   Human--AI R&R
-   AI-assisted development
-   Specification Engineering
-   Context Engineering
-   Prompt Engineering의 위치와 한계
-   Knowledge / Tool / State / Task / Domain-Policy Context
-   Guardrail Engineering
-   Harness Engineering
-   Agent responsibility / boundary
-   HITL와 autonomy width
-   Agentic workflow
-   AI evaluation / observability / cost
-   capability 변화에 따른 통제 구조 재설계

### Uses

-   OOAD: responsibility / collaboration / encapsulation
-   DDD: domain language / model / invariant / semantics
-   SW Architecture: boundary / dependency / policy / quality gate
-   MSA: distributed workflow에서 배운 failure / observability 원리

### Current Curriculum Migration

기존 **AI-assisted 16교시 + Agentic 16교시**의 교육 의도는 보존하되 단순
연결하지 않는다.

-   기존 AI-assisted의 `지시 → 생성 → Gate → Feedback`은 전반부의 실증
    기반으로 유지
-   `Prompt`보다 상위인 **Specification / Context Engineering**을
    명시적으로 추가
-   기존 Agentic의
    `Agent → Pipeline → HITL → Failure → Observability → Cost`는
    후반부로 통합
-   **Guardrail → Harness → Agentic execution**의 통제 순서를 명확히
    한다
-   MSA의 Saga를 Agent rollback과 동일시하지 않고 "실패·보상 사고의
    유사성" 수준에서만 참조한다

------------------------------------------------------------------------

## 8. Ontology / Explicit Semantics Bridge

### Why

Domain Model은 특정 시스템의 문제 해결에 충분할 수 있다. 그러나 여러
시스템·조직·AI Agent가 개념과 관계를 **기계적으로 공유·해석**해야 하면
의미를 더 명시할 필요가 생긴다.

### Flow

`Domain Model → Concept / Relation / Role / Constraint → Explicit Semantics → Ontology → AI Context`

### DDD Side Owns

-   Domain meaning이 왜 중요한가
-   Domain Model과 Ontology의 차이
-   어떤 의미를 명시해야 하는가

### AI-Native Side Owns

-   명시적 semantics를 Context / Retrieval / Tool / Agent interaction에
    어떻게 활용하는가
-   Ontology가 실제로 필요한 조건과 과잉 조건

### Failure Condition

단순 CRUD, 단일 팀, 좁은 vocabulary처럼 의미 불일치 비용이 낮은 문제에
Ontology를 강제하지 않는다.

------------------------------------------------------------------------

## 9. Common Decision Axes

  -----------------------------------------------------------------------------------------------------------------------------
  Axis              OOAD                    DDD              SWA                   MSA                 AI-Native
  ----------------- ----------------------- ---------------- --------------------- ------------------- ------------------------
  **What**          Object/Concept          Domain Concept   Module/Component      Service             Task/Agent/Context

  **Who**           Object Responsibility   Domain           Component             Service Ownership   Human/Agent
                                            Responsibility   Responsibility                            Responsibility

  **How**           Message/Collaboration   Domain           Interface/Port        API/Event/Message   Tool/Agent Workflow
                                            Interaction                                                

  **Where**         Encapsulation           Aggregate/BC     Architecture Boundary Deployment Boundary Context/Permission
                                                                                                       Boundary

  **Why/Quality**   Cohesion/Coupling       Domain Integrity Quality               Autonomy vs         Risk/Cost/Verification
                                                             Attribute/Trade-off   Distribution Cost   

  **Meaning**       Model Semantics         Ubiquitous       Architecture          Integration         Specification/Ontology
                                            Language         Intent/Contract       Contract            
  -----------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 10. Course Independence

**Prerequisite recommended, never assumed.**

각 과정은 시작 시 다음을 제공한다.

1.  **Program Map** --- 전체에서 현재 위치
2.  **Minimum Recap** --- 필요한 선행 개념만 재정박
3.  **Owner Reference** --- 상세 정의의 OWNER
4.  **This Course Adds** --- 이번 과정이 새로 추가하는 판단 능력
5.  **Forward View** --- 후속 확장

재정박은 재교육이 아니다. 독립 수강 가능성을 확보하기 위한 최소 복구다.

------------------------------------------------------------------------

## 11. Just Enough / Cost-of-Complexity Principle

어떤 모델·패턴·Architecture·Ontology·Agent 구조도 목적 자체가 아니다.

### Adopt When

-   암묵적 이해로 감당하기 어려운 복잡성·위험·협업 비용이 있다.
-   잘못된 판단의 비용이 모델링/통제 비용보다 크다.
-   독립적 변화나 실행 경계의 가치가 실제로 존재한다.

### Trade-off

명시성·통제·변경 국소화를 얻고, 설계·동기화·운영 비용을 부담한다.

### Reject When

-   단순 CRUD에 Rich Domain Model
-   단일 배포가 충분한데 MSA
-   의미 충돌이 없는데 Ontology
-   단발성 생성인데 Agent/Harness
-   변동성이 없는데 추상화 계층 추가

------------------------------------------------------------------------

## 12. Topic / Course Admission Gate

새 주제를 기존 과정 본편에 넣거나 새로운 과정을 Portfolio에 추가하기 전에 답한다.

1.  어떤 문제를 해결하는가?
2.  Common Decision Axes 중 무엇을 다루는가?
3.  OWNER는 누구인가?
4.  기존 개념의 어떤 한계에서 등장하는가?
5.  어떤 선택지를 비교하게 만드는가?
6.  전제 조건은 무엇인가?
7.  무엇을 얻고 무엇을 잃는가?
8.  언제 사용하지 않아야 하는가?
9.  독립 수강자에게 필요한 recap은 무엇인가?
10. 도구·Vendor가 사라져도 이 판단은 남는가?

답할 수 없으면 본편에서 제외하거나 부록/전문과정으로 격리한다.


---

## 13. Program / Portfolio / Course Separation — v2.1

프로그램 확장성을 위해 다음 네 층을 구분한다.

```text
Program Governance
        ↓
Course Portfolio
        ↓
Course Architecture / Specification
        ↓
Curriculum / Source / Deck
```

- **Program Governance:** 과정 수와 무관한 철학, 원칙, 용어, ownership 규칙.
- **Course Portfolio:** 현재 제공하는 과정과 분류. `portfolio/course-catalog.md`가 소유.
- **Course Architecture / Specification:** 개별 과정의 문제, 판단, OWNER/CONSUMER, 범위, 학습 증거.
- **Course Content:** 세션·심층 source·실습·deck.

새 과정 추가 때문에 Program Governance의 최상위 원칙을 반복 수정하지 않는다.

## 14. Reusable Engineering Axes — v2.1

과정은 선형 진화 단계가 아니라 다음 재사용 축의 조합으로 볼 수 있다.

`Value / Meaning / Responsibility / Contract / Boundary / Dependency / Flow / Distribution / Delegation / Evidence / Feedback / Adaptation / Governance`

현재 과정의 대표적 초점:

- OOAD: Meaning / Responsibility / Contract / Collaboration
- DDD: Meaning / Invariant / Model Boundary
- SW Architecture: Boundary / Dependency / Quality Decision
- MSA: Distribution / Service Contract / Failure / Operation
- AI-Native: Delegation / Stage Contract / Control / Evaluation
- Modern QM: Prevention / Evidence / Gate / Feedback / Improvement

향후 Agile, DevOps, Proposal, DT, AT 등은 새 OWNER가 실제로 필요한지 Admission Gate를 통과한 뒤 Portfolio에 추가한다.


---

## 15. Evidence & Localization — Canon Pointer

모든 과정의 source/evidence/localization 규칙은
`evidence-source-localization-policy.md`가 단일 정본으로 소유한다.

Reference Frame 수준의 비협상 원칙만 유지한다.

> **Global Principle / Global BP와 국내 관행이 충돌하면 교육 정본·권고의 기준은
> Global Principle / Global BP를 우선한다.**

국내 법·규제·계약·조달 등 적용 제약은 원칙의 대체물이 아니라 `Local Context /
Constraint`로 분리한다. Korea BP/WP의 정의·증거 기준·출처 우선순위는 source policy를 따른다.
