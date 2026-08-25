# 03. Program Terminology v2.2

> **Purpose:** 현재 및 향후 과정이 같은 용어를 다른 뜻으로 쓰거나 서로 다른 개념을 동일시하는 것을 방지한다.
> **Portfolio rule:** 용어 OWNER는 과정 수 변화와 무관하게 안정적으로 관리한다.
> **Rule:** `Definition / Not the same as / Owner / Usage`를 기준으로
> 한다.

------------------------------------------------------------------------

## A. Modeling Core

### Model

-   **Definition:** 특정 목적을 위해 현실 또는 시스템의 일부를
    선택적으로 단순화한 표현.
-   **Not:** Diagram.
-   **Owner:** 공통 기반; OOAD가 최초 정박.

### Modeling

-   **Definition:** 개념·관계·행위·경계·제약을 선택하고 표현하며
    검증하는 활동.
-   **Not:** UML drawing.

### Concept

-   **Definition:** 문제 영역에서 구별할 필요가 있는 의미 단위.
-   **Not:** Class.
-   **Owner:** OOAD → DDD에서 domain concept로 심화.

### Analysis Model

-   **Definition:** 구현 결정에 앞서 문제·사용자·도메인을 이해하기 위한
    모델.
-   **Owner:** OOAD.

### Design Model

-   **Definition:** 요구/분석 모델을 구현 가능한 책임·협력·구조로
    구체화한 모델.
-   **Owner:** OOAD.

### Domain

-   **Definition:** 소프트웨어가 해결하려는 문제와 관련 지식·규칙·활동의
    영역.
-   **Owner:** DDD.

### Domain Model

-   **Definition:** Domain의 핵심 개념·관계·규칙·행위를 문제 해결 목적에
    맞게 표현한 모델.
-   **Not:** Analysis class diagram / Database model / Ontology.
-   **Owner:** DDD.
-   **OOAD relation:** OOAD는 conceptual/analysis model과 object
    design을 가르치며, DDD가 이를 domain-centric model로 심화한다.

------------------------------------------------------------------------

## B. OOAD

### Object

상태와 행위를 캡슐화하고 메시지를 통해 협력하는 실행 책임 주체. **Object
≠ DTO/Record.**

### Class

객체의 공통 구조·행위·생성 규칙을 기술하는 타입/분류. **Class ≠ Concept
≠ Entity.**

### Message

다른 객체에게 책임 수행을 요청하는 상호작용의 개념적 표현. **Message ≠
network message.**

### Responsibility

어떤 요소가 알고 있거나 수행해야 할 의무. Knowing / Doing
responsibility로 볼 수 있다.

### Collaboration

둘 이상의 책임 주체가 계약/메시지를 통해 공동 목적을 달성하는 구조.

### Encapsulation

상태·구현·규칙을 책임 주체 내부에 보호하고 외부에는 필요한 계약만
노출하는 원리. **private keyword 자체가 아님.**

### Cohesion

한 요소 안의 책임들이 얼마나 밀접하게 하나의 목적을 향하는가.

### Coupling

한 요소의 변경/동작이 다른 요소의 지식·변경에 얼마나 의존하는가.

### Invariant

유효한 상태를 유지하기 위해 특정 안정 지점에서 만족해야 하는 조건을 가리키는
공통 상위 용어. 문맥 없이 `Invariant`만으로 OWNER를 판단하지 않는다.

### Object Invariant

객체가 외부에 안정된 상태로 노출될 때 유지해야 하는 유효성 조건.
Design by Contract의 Precondition / Postcondition과 함께 OOAD에서 정박한다.
**Owner:** OOAD.

### Domain Invariant

Domain 의미상 반드시 보호되어야 하는 business consistency rule.
Aggregate boundary와 consistency 판단에 사용한다.
**Owner:** DDD.

**Object Invariant ≠ Domain Invariant:** 겹칠 수 있으나 전자는 object contract,
후자는 domain meaning/consistency 관점이다.


### Contract

책임 주체 또는 경계가 상대에게 요구하는 조건과 제공하는 보장을 명시한 약속.
**Not:** 문서 형식 자체 / 법적 계약.

### Precondition

책임/operation을 수행하기 전에 호출자 또는 실행 환경이 만족해야 하는 조건.
**Owner:** OOAD의 Design by Contract에서 최초 정박.

### Postcondition

책임/operation이 정상 완료된 뒤 제공자가 보장해야 하는 결과 조건.
**Owner:** OOAD의 Design by Contract에서 최초 정박.

### Design by Contract

Precondition / Postcondition / Invariant를 이용해 객체 책임과 협력의 계약을
명시하는 OO 설계 접근. **Owner:** OOAD.


------------------------------------------------------------------------

## C. DDD

### Entity

속성 값보다 지속되는 식별성과 생명주기로 구별되는 Domain Object. **ORM
annotation이 정의가 아님.**

### Value Object

식별성보다 값과 의미로 정의되는 Domain Object. 가능한 한 불변으로
다룬다.

### Aggregate

일관성 규칙을 함께 보호해야 하는 Domain Object들의 경계.

### Aggregate Root

Aggregate 외부가 해당 Aggregate와 상호작용하는 대표 Entity.

### Domain Service

특정 Entity/VO에 자연스럽게 귀속되지 않지만 Domain 의미를 가진 행위.

### Repository

Domain 관점에서 Aggregate의 저장/조회 컬렉션 의미를 제공하는 추상화.
**DAO와 항상 동일하지 않다.**

### Domain Event

Domain에서 이미 발생했으며 비즈니스적으로 의미 있는 사실.

### Ubiquitous Language

특정 Bounded Context에서 모델·대화·문서·코드가 공유하는 Domain Language.

### Bounded Context

특정 Domain Model과 Ubiquitous Language의 의미가 일관되게 적용되는
경계.\
**Not:** Microservice / Team / Module. 정렬될 수 있으나 동일하지 않다.

### Context Mapping

Bounded Context 사이의 관계와 모델 번역/통합 관계를 명시하는 활동/모델.

### Subdomain

Business Domain을 문제 성격과 중요도에 따라 나눈 문제 공간의 일부.\
**Not:** Bounded Context. Subdomain은 problem space, Bounded Context는
model/solution boundary 관점이다.

------------------------------------------------------------------------

## D. SW Architecture

### Software Architecture

시스템의 중요한 구조적 요소·관계·제약과, 품질 및 변경 비용에 큰 영향을
주는 핵심 의사결정의 집합.

### Architecture Driver

Architecture 결정에 실질적 영향을 주는 핵심 functional concern, quality
attribute, constraint, business/technical force.

### Quality Attribute

시스템이 **얼마나 잘** 동작해야 하는지를 나타내는 품질 특성. 예:
performance, availability, modifiability, security, operability.

### Quality Attribute Scenario

Quality Attribute를 자극·환경·대상·반응·측정값 등 검증 가능한 맥락으로
구체화한 표현.

### Architectural Style / Pattern

반복되는 구조 문제에 대한 상위 수준의 구조적 조직 방식. **이름 자체가
선택 근거가 아니다.**

### Module

개발·변경 관점에서 책임과 의존성을 묶는 구조 단위.

### Component

명확한 책임과 interface를 가지고 다른 요소와 조립되는 구성 요소. 문맥에
따라 runtime 관점 여부를 명시한다.

### Port

Application/Domain이 외부와 상호작용하기 위해 정의한 기술 독립적 계약.

### Adapter

특정 기술/프로토콜을 Port 계약에 연결하는 구현.

### Application Service

Use Case 실행을 위해 Domain Object와 외부 Port를 조정하는 orchestration
역할.\
**Not:** Domain Service / business-rule dumping ground.

### Dependency Rule

중요한 정책이 세부사항에 의존하지 않도록 의존 방향을 제한하는
Architecture 규칙.

### Architecture Decision

Context와 forces를 고려해 대안 중 하나를 선택하고 근거·Trade-off를 남긴
결정.

### Architecture Evaluation

Architecture가 주요 driver/quality/risk를 만족하는지
대안·scenario·evidence를 통해 검토하는 활동.

### Architecture Fitness Function

원하는 Architecture 특성을 지속적으로 검증하는 자동/반자동 검사.
Dependency test, policy check 등이 예다.

### Clean Architecture

중요한 business/application policy를 UI, database, framework 같은 detail에서 보호하고
source-code dependency가 더 높은 수준의 policy 방향으로 향하도록 구성하는 architecture
접근. **핵심은 layer 이름이 아니라 Dependency Rule과 separation of concerns.**
**Owner:** SW Architecture.

### Evolutionary Architecture

중요한 architectural characteristics를 보호하면서 여러 차원에서
**guided, incremental change**를 지원하는 architecture 접근.
Fitness Function은 변화가 의도한 특성을 훼손하는지 지속 판단하는 핵심 수단 중 하나.
**Owner:** SW Architecture.

### Architectural Characteristic

시스템 구조 선택에 영향을 주며 지속적으로 보호·평가할 필요가 있는 특성.
Quality Attribute와 강하게 관련되지만 문맥에 따라 운영·구조적 특성까지 포함할 수 있다.


------------------------------------------------------------------------


### Interface Contract

경계 밖 소비자가 의존할 수 있도록 제공하는 operation, data, error, constraint의
명시적 약속. **Owner:** SW Architecture에서 interface/port 수준을 정박하고,
MSA에서 원격 service contract로 확장한다.


## E. MSA / Distributed Systems

### Service

명확한 책임과 계약을 가지며 독립적인 실행/운영 경계를 가질 수 있는
소프트웨어 단위.

### Microservice

특정 business capability/responsibility를 중심으로 독립 배포·운영
가능성을 추구하는 작은 서비스.\
**Not:** REST API / small class / Bounded Context.

### Modular Monolith

하나의 배포 단위 안에서 module boundary와 dependency를 명시적으로
통제하는 Architecture.

### Service Boundary

독립 배포·운영·소유·실패의 범위를 결정하는 실행 경계.\
**Not:** Domain boundary의 자동 복사.

### Data Ownership

특정 서비스가 자신의 상태 schema와 변경 규칙을 통제하는 책임.

### Integration Event

경계 밖 소비자를 위해 발행되는 integration contract.\
**Not:** Domain Event와 항상 동일한 객체/스키마.


### API Contract

서비스 소비자가 의존하는 operation, request/response, error, semantic constraint의
외부 계약. **Owner:** MSA.

### Event Contract

경계 밖 event consumer가 의존하는 event 의미, schema, version/compatibility의
계약. **Not:** Domain Event 자체와 항상 동일하지 않음. **Owner:** MSA.

### Schema Contract

서비스/메시지 경계에서 교환 데이터의 구조·필수성·허용 값·버전 규칙을
명시한 계약. **Owner:** MSA.

### Compatibility

계약이 진화해도 기존 producer/consumer가 허용된 범위에서 계속 상호운용할
수 있는 성질. backward/forward compatibility의 방향을 문맥에 명시한다.
**Owner:** MSA.

### Distributed Transaction

여러 독립 실행 경계에 걸친 상태 변화의 일관성을 다루는 문제와 메커니즘.

### Eventual Consistency

서로 다른 경계의 상태가 즉시 같지 않을 수 있으나 허용된 시간/조건 안에서
수렴하는 일관성 모델.\
**Not:** "일관성을 신경 쓰지 않는다."

### Saga

여러 local transaction을 연결하고 실패 시 보상 행위를 통해 장기 실행
business process를 조정하는 패턴.\
**Not:** 일반적인 Agent rollback의 동의어.

### Idempotency

동일 요청/메시지가 반복되어도 의도한 최종 효과가 중복되지 않도록 하는
성질.

### Resilience

부분 장애를 예상하고 timeout, retry, isolation, fallback 등으로 서비스
수준의 영향을 통제하는 능력.

### Observability

외부 출력인 log/metric/trace 등을 통해 내부 상태와 실패 원인을 추론할 수
있는 성질.\
**Not:** Logging만.

------------------------------------------------------------------------

## F. Ontology / Semantics

### Semantics

개념·관계·표현이 무엇을 의미하는지에 관한 규칙과 해석.

### Semantic Model

개념과 관계의 의미를 명시적으로 표현하는 모델의 일반적 표현. **반드시
formal ontology는 아님.**

### Taxonomy

개념을 주로 분류/상하위 관계로 조직한 체계. **Ontology보다 표현력이
제한적일 수 있다.**

### Ontology

특정 영역의 개념·관계·속성·역할·제약과 의미를 명시적으로 정의한 모델.
필요에 따라 formal semantics를 사용할 수 있다.\
**Not:** ERD / Class Diagram / Domain Model / Knowledge Base.

### Knowledge Base

사실·규칙·문서·관계 등 활용 가능한 지식 콘텐츠의 저장/관리 체계.
Ontology가 semantic schema 역할을 할 수 있으나 둘은 동일하지 않다.

------------------------------------------------------------------------

## G. AI-Native Software Engineering

### AI-assisted Development

인간이 작업의 주 책임자이고 AI가 생성·분석·검토 등 일부 작업을 보조하는
방식.

### AI-Native Software Engineering

AI를 실행 주체 중 하나로 전제하고 Specification, Context, Guardrail,
Harness, Evaluation을 포함해 전체 engineering system을 설계하는 접근.

### Intent

달성하려는 목적과 기대 결과. **Intent ≠ Prompt text.**

### Specification

실행 주체가 일관되게 구현·판정할 수 있도록 결과·행위·제약·계약·완료
조건을 명시한 기술. 특정 문서 형식에 한정하지 않는다.

### Specification Engineering

Intent와 constraint를 구조화·명시·검증·진화시켜 사람과 AI가 구현·검증
가능한 형태로 만드는 활동.

### Context

특정 AI 실행에서 판단과 생성을 조건짓는 관련 정보의 집합.

### Context Engineering

AI 실행에 필요한 **Task / Knowledge / Tool / State / Domain-Policy
Context**를 선택·구성·전달·갱신하는 engineering 활동.

### Prompt

모델에 전달되는 명시적 지시/입력 표현의 일부.

### Prompt Engineering

Prompt 표현을 설계하는 활동. 이 프로그램에서는 Context Engineering의
부분 활동으로 취급한다.

### Tool

AI/Agent가 외부 세계를 조회하거나 변경하기 위해 호출할 수 있는 명시적
capability/interface.

### State

한 실행 또는 여러 단계에 걸쳐 유지되어 다음 판단에 영향을 주는 작업
상태/기억.

### Guardrail

AI/Agent가 허용 범위 안에서 행동하도록 input, action, output,
permission, approval을 제한·검증하는 통제.

### Harness

모델/Agent 주변에서 Context 공급, Tool 연결, State, Workflow, Gate,
Retry, Evaluation, Logging, HITL 등을 조직하는 실행·통제 구조.\
**Not:** Agent 자체 / Guardrail 자체.

### Agent

목표/Task를 받아 Context와 Tool을 사용하고 상태를 유지하며 허용 범위
안에서 여러 단계를 수행하는 AI 기반 실행 주체.\
**Not:** 단순 LLM call.

### Agentic Workflow

Agent, Tool, deterministic step이 단계적 계약과 gate를 통해 목표를
달성하는 실행 흐름.


### Stage Contract

Agentic workflow의 한 단계가 요구하는 Input / Output / Precondition /
Constraint / Acceptance(Postcondition) / Gate / Failure Path를 명시한 계약.
**Owner:** AI-Native. **Not:** OOAD Design by Contract와 동일 개념이 아니라
계약 기반 사고를 새로운 실행 주체에 확장한 것.

### Quality Evidence

요구·품질·정책·계약 충족 여부를 검토할 수 있는 관찰·검증 결과.
예: test result, review record, metric, trace, policy check, audit record.
**Owner:** Modern QM의 cross-cutting 관점에서 정박.

### Quality Gate

사전에 정의한 quality/evidence 기준을 만족해야 다음 흐름으로 진행하도록 하는
판정 지점. **Not:** 사람 승인만 / 특정 CI 제품 기능.

**Ownership:** cross-course mechanism. 특정 과정 하나가 모든 Gate를 소유하지 않는다.
- Modern QM: quality governance와 evidence-backed gate의 운영 원칙
- SW Architecture: architecture fitness / conformance gate
- AI-Native: execution / evaluation gate
- 향후 DevOps: delivery pipeline gate를 소유할 수 있음

따라서 `Quality Gate = QM 전용 개념`으로 고정하지 않는다.

### HITL

위험·불확실성·권한 수준에 따라 인간 승인·판단·수정을 흐름에 명시적으로
포함하는 통제 방식.

### Autonomy Boundary

Agent가 인간 승인 없이 판단·행동할 수 있는 책임·권한·자원·시간의 범위.

### Evaluation

AI/Agent의 산출과 행위가 요구·제약·품질 기준을 충족하는지 측정·판정하는
활동.

------------------------------------------------------------------------

## H. 반드시 구분할 쌍

  -----------------------------------------------------------------------
  A                       B                       핵심 차이
  ----------------------- ----------------------- -----------------------
  Concept                 Class                   현실 의미 vs 구현 타입

  Analysis Model          Domain Model            문제 이해 모델 vs
                                                  domain-centric
                                                  rule/behavior model

  Object                  DTO                     책임 주체 vs 데이터
                                                  전달

  Entity                  ORM Entity              Domain identity vs
                                                  persistence mechanism

  Domain Service          Application Service     Domain rule vs use-case
                                                  orchestration

  Domain Model            Ontology                문제 해결 모델 vs
                                                  explicit semantic model

  Subdomain               Bounded Context         problem space vs model
                                                  boundary

  Bounded Context         Microservice            semantic boundary vs
                                                  deployment/operation
                                                  boundary

  Module                  Microservice            development boundary vs
                                                  independent runtime
                                                  boundary

  Domain Event            Integration Event       domain fact vs
                                                  cross-boundary contract

  DIP                     DI                      design principle vs
                                                  implementation
                                                  mechanism

  Port                    Adapter                 contract vs technology
                                                  implementation

  Quality Attribute       Functional Requirement  how well vs what
                                                  behavior

  Prompt                  Context                 instruction
                                                  representation vs full
                                                  decision context

  Prompt Engineering      Context Engineering     prompt design vs
                                                  execution context
                                                  design

  Context                 Guardrail               information vs
                                                  behavioral
                                                  constraint/control

  Guardrail               Harness                 control rule vs
                                                  execution/control
                                                  structure

  Agent                   Harness                 execution actor vs
                                                  surrounding execution
                                                  system

  Ontology                Knowledge Base          semantic structure vs
                                                  knowledge content

  Saga                    Agent rollback          distributed business
                                                  transaction pattern vs
                                                  generic workflow
                                                  recovery
  -----------------------------------------------------------------------

------------------------------------------------------------------------

### 추가 구분

- **Object Contract ≠ API Contract:** 객체 내부 협력 계약 vs 원격 소비자와의 외부 계약.
- **Domain Invariant ≠ Service Contract:** domain 유효성 규칙 vs 독립 서비스 간 상호운용 약속.
- **Design by Contract ≠ Stage Contract:** OO object collaboration 원칙 vs AI workflow 단계 계약.
- **Quality Gate ≠ Harness:** 판정 지점/기준 vs 실행·통제 구조 전체.

---

## I. Term Admission Rule

새 용어는 다음을 통과해야 정본에 들어온다.

1.  기존 용어로 충분히 설명할 수 없는가?
2.  현재 또는 향후 Portfolio에서 OWNER가 명확한가?
3.  Vendor/Framework 이름에 종속되지 않는가?
4.  혼동되는 인접 개념을 설명할 수 있는가?
5.  실제 의사결정을 바꾸는가?
6.  빠르게 변하는 용어라면 Core가 아니라 부록이 더 적절하지 않은가?

제품명·모델명·도구명은 원칙적으로 과정별 사례/부록에 둔다.


---

## J. Evidence / Localization Terms

### Global Best Practice (Global BP)

특정 국가의 관행이 아니라 국제 표준, 원전, 다수 환경의 검증과 축적된 engineering
knowledge에 의해 지지되는 우수 practice. **"많이 사용됨"만으로 BP가 되지 않는다.**

### Korea Best Practice (Korea BP)

한국의 법·시장·조직·사업 환경에서 효과가 확인된 우수 사례.
**Not:** Global BP의 자동 대체물. 적용 조건과 결과 evidence를 함께 제시한다.

### Korea Worst Practice (Korea WP)

한국 환경에서 반복 관찰되는 비효율·위험·왜곡 사례를 반면교사로 설명하기 위한 분류.
**Not:** 한국의 일반적 표준 또는 문화 전체에 대한 단정.

### Local Context

국가·시장·계약·규제·조직 구조 등 특정 지역에서 적용 판단에 영향을 주는 조건.
**Not:** Best Practice 자체.

### Primary Source

주장·표준·개념·사례를 최초 또는 공식적으로 제시한 출처.
예: 표준 원문, 원저자 저작, 법령, 정부 공식 통계, 조직의 공식 case evidence.

### Secondary Source

Primary Source를 분석·해설·요약한 자료. 유용할 수 있으나 Canon claim의 근거는
가능하면 Primary Source로 추적한다.
