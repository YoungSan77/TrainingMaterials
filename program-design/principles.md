# 02. Engineering Principles v2.2

> **Purpose:** 명언을 장식으로 쓰지 않고 현재 및 향후 과정의 설계·판단·교재 품질 기준으로 사용한다.
> **Portfolio rule:** 원칙은 특정 과정 수에 종속되지 않으며, 새 과정은 기존 원칙을 APPLY/EXTEND하거나 새 원칙의 필요성을 입증해야 한다.
> **Citation rule:** 축자 인용문은 별도 source/quote 자산에서 원전을
> 검증한 경우에만 사용한다. 이 문서는 **원칙의 의미와 적용 판단**을
> 정본으로 한다.

------------------------------------------------------------------------

## A. Modeling & Object Responsibility --- OOAD

### P01. Object = State + Behavior + Message + Responsibility

**Lineage:** Alan Kay의 messaging/state/late binding 관점과 초기 OO
계보.

-   **판단:** 객체가 자신의 상태와 규칙을 보호하며 협력하는가?
-   **얻는 것:** Encapsulation, 변경 국소화.
-   **잃는 것:** 책임 배치 설계 비용.
-   **실패 조건:** DTO/Projection까지 Rich Object로 강제.
-   **Anti-pattern:** Getter/Setter Data Bag + 외부 Service가 모든 판단.

### P02. Model before Notation

**Lineage:** Booch의 object-oriented analysis/design 및 object-oriented
decomposition 계보.

-   UML은 모델이 아니라 표현 수단이다.
-   정적 구조와 동적 협력을 모두 설명해야 한다.
-   **실패 조건:** Class Diagram을 먼저 그리고 현실을 끼워 맞춘다.

### P03. Responsibility before Class

**Lineage:** Responsibility-Driven Design / GRASP 계보.

-   "어떤 클래스가 필요한가?"보다 "이 책임을 누가 져야 하는가?"를 먼저
    묻는다.
-   **Trade-off:** 책임 탐색 비용을 지불하고 구조적 응집도를 얻는다.

### P04. Information Expert

**Lineage:** Craig Larman / GRASP.

-   책임 수행에 필요한 정보를 가장 잘 알고 있는 객체를 우선 후보로 둔다.
-   **한계:** Expert만으로 결정하지 않는다. Coupling/Cohesion/Protected
    Variation과 함께 판단한다.

### P05. Tell, Don't Ask

-   객체의 상태를 꺼내 외부에서 판단하기보다 의미 있는 행위를 요청한다.
-   **Anti-pattern:** `if (order.getStatus()) order.setStatus(...)`
-   **Better:** `order.cancel()`
-   **실패 조건:** Query/Reporting/DTO에까지 기계적으로 적용.

> 이 원칙은 특정 한 사람의 축자 명언으로 고정하지 않는다. 여러 OO 실천
> 전통에서 발전한 heuristic으로 취급한다.

### P06. Law of Demeter / Least Knowledge

**Lineage:** Ian Holland.

-   협력에 필요한 최소한의 이웃만 안다.
-   `a.b().c().d()`의 점 개수 자체가 법칙은 아니다.
-   **Trade-off:** 구조 은닉을 얻지만 무의미한 forwarding method 남발
    가능.

### P07. Command--Query Separation

**Lineage:** Bertrand Meyer.

-   상태 변경(Command)과 관찰(Query)의 의미를 분리해 side effect를 예측
    가능하게 한다.
-   **실패 조건:** 모든 API를 기계적으로 둘로 쪼개 오히려 의도를 흐린다.

### P08. High Cohesion / Low Coupling

-   함께 변하는 책임은 모으고 독립적으로 변하는 책임은 분리한다.
-   Object → Module → Component → Service → Agent boundary까지 반복되는
    공통 원리.
-   **실패 조건:** 결합을 0으로 만들려다 indirection만 증가.

### P09. Program to an Interface, not an Implementation

**Lineage:** GoF.

-   변동성이 있는 협력 상대의 구체 구현보다 필요한 계약에 의존한다.
-   **실패 조건:** 변동성이 없는 곳에도 interface를 기계적으로 추가.

### P10. Favor Composition over Inheritance

**Lineage:** GoF.

-   변화 가능한 행위를 상속 계층보다 협력 객체 조합으로 구성하는 것을
    우선 검토한다.
-   **판단:** 진짜 is-a인가? 독립적 변화가 필요한가?

### P11. Dependency Inversion

**Lineage:** Robert C. Martin.

-   중요한 정책이 세부 구현에 끌려가지 않도록 의존 방향을 제어한다.
-   **확장:** OOAD의 DIP → SW Architecture의 Dependency Rule.
-   **실패 조건:** DI Framework 사용을 DIP 준수로 착각.


### P11A. Design by Contract

**Lineage:** Bertrand Meyer / Eiffel의 Design by Contract 계보.

-   객체의 책임은 호출자와 제공자 사이의 **명시적 계약**으로 표현할 수 있다.
-   최소 요소는 **Precondition / Postcondition / Invariant**다.
-   **판단:** 이 책임을 호출하기 전에 무엇이 참이어야 하고, 완료 후 무엇을 보장하며, 객체는 어떤 유효 상태를 계속 지켜야 하는가?
-   **얻는 것:** 책임 경계와 실패 조건의 명시성, 검증 가능성.
-   **Trade-off:** 계약을 작성·동기화하는 비용을 부담한다.
-   **실패 조건:** 단순 getter/DTO까지 과도한 계약으로 포장하거나, 계약과 구현/테스트가 분리되어 이중 장부가 된다.

> DDD는 이 원칙을 다시 소유하지 않는다. OOAD의 계약 사고를 Domain Invariant와 Aggregate consistency에 적용·심화한다.

------------------------------------------------------------------------

## B. Domain Meaning & Boundary --- DDD

### P12. Put Domain Rules with the Model that Owns Them

**Lineage:** Rich Domain Model / DDD.

-   Domain 상태와 불변식을 외부 Service에 흩뜨리지 않는다.
-   **전제:** 의미 있는 규칙과 상태 전이가 존재.
-   **실패 조건:** 단순 CRUD에 Rich Domain Model 강제.

### P13. Ubiquitous Language Is Executable Alignment

**Lineage:** Eric Evans / DDD.

-   대화·모델·코드에서 같은 Domain Language를 사용한다.
-   용어집만 만드는 것으로 끝나지 않는다.
-   **실패 조건:** 문서의 용어와 코드/대화가 분리.

### P14. Invariants Define Consistency Boundaries

-   함께 즉시 지켜야 할 규칙이 Aggregate boundary의 강한 근거다.
-   **Trade-off:** 큰 Aggregate는 일관성을 단순화하지만 경합·확장 비용을
    높인다.
-   **실패 조건:** 객체 참조 편의성으로 Aggregate를 정한다.

### P15. Boundary Protects Meaning

-   Bounded Context는 특정 모델과 언어의 의미가 일관되는 경계다.
-   조직도나 서비스 목록을 그대로 복사하지 않는다.

### P16. Domain Boundary ≠ Deployment Boundary

-   **Bounded Context ≠ Microservice.**
-   Domain boundary는 의미를 보호하고, service boundary는 독립 실행·운영
    비용까지 포함한다.
-   **선택:** Module / Modular Monolith / Service.

### P17. Explicit Semantics before Ontology

-   Ontology 도구/형식보다 먼저 공유해야 할
    Concept/Relation/Role/Constraint를 확인한다.
-   **전제:** 여러 시스템·조직·Agent 사이 의미 불일치 비용이 크다.
-   **실패 조건:** 단순 vocabulary에 formal ontology부터 도입.

------------------------------------------------------------------------

## C. Architecture Decisions --- SW Architecture

### P18. Architecture Is a Set of Consequential Decisions

-   Architecture는 그림이 아니라 변경 비용이 크고 품질에 영향을 주는
    구조적 결정이다.
-   **판단:** 이 결정이 어떤 driver/constraint 때문에 중요한가?

### P19. Quality Attributes Drive Structure

-   기능 요구만으로 Architecture를 결정하지 않는다.
-   성능·가용성·변경용이성·보안·운영성 등 **얼마나 잘** 해야 하는지가
    구조를 바꾼다.
-   **실패 조건:** Quality Attribute를 "좋아야 한다" 수준의 형용사로만
    둔다.

### P20. Every Architecture Choice Buys Something and Pays Something

-   Architecture에는 무료 해법이 없다.
-   선택은 `Context → Options → Gain → Cost/Risk → Decision`으로
    설명한다.
-   **실패 조건:** Pattern/Style 이름을 근거로 선택.

### P21. Stable Policy Should Not Depend on Volatile Detail

**Structural anchor:** Clean Architecture / Dependency Rule 계보.

-   Domain/Use Case 같은 정책을 Framework/DB/API 세부사항에서 보호한다.
-   Clean Architecture의 핵심 가치는 동심원 그림 자체가 아니라 **Policy와 Detail의 분리 및 inward dependency**다.
-   Port/Adapter는 이 목적을 위한 수단이지 목표가 아니다.
-   **실패 조건:** Clean Architecture의 layer/package 이름을 복제했지만 실제 dependency가 외부 detail을 향한다.

### P22. Architecture Must Be Enforceable

-   합의만 있고 검증이 없으면 시간이 지나며 구조는 붕괴한다.
-   Test, lint, dependency rule, fitness function 등 가능한 부분은 자동
    검증한다.
-   **Trade-off:** 강제력을 얻지만 gate 유지 비용을 부담한다.

### P23. Architecture Evolves

**Lineage:** Evolutionary Architecture — guided, incremental change across multiple dimensions.

-   초기 설계를 고정하지 않는다. 새로운 evidence와 quality pressure에 따라 의사결정을 재평가한다.
-   중요한 architectural characteristic은 가능한 경우 **fitness function**으로 지속 관찰·검증한다.
-   변화는 무제한 자유가 아니라 중요한 특성을 보호하는 **guided incremental change**다.
-   **실패 조건:** 미래의 모든 변화에 대비한 과잉 설계.

------------------------------------------------------------------------

## D. Distribution & Operational Reality --- MSA

### P24. Monolith First unless Distribution Pays

-   분산은 기본값이 아니다.
-   독립 배포·확장·소유의 가치가 Network/Consistency/Operation 비용보다
    클 때 선택한다.

### P25. Validate Boundaries Cheaply before Distributing

-   Module/Modular Monolith에서 경계를 먼저 검증하면 잘못된 분할을 싸게
    고칠 수 있다.
-   **실패 조건:** 조직도나 데이터 테이블 기준으로 바로 서비스 분리.

### P26. Data Ownership Follows Service Autonomy

-   독립 서비스가 같은 데이터 구조를 직접 공유하면 자율성은 환상이다.
-   **Trade-off:** 독립성을 얻고 데이터 중복·동기화 비용을 부담할 수
    있다.

### P27. Remote Calls Are Not Local Calls

-   Network에는 latency, partial failure, retry, timeout, duplication이
    존재한다.
-   **실패 조건:** 메서드 호출을 HTTP/gRPC로 치환하고 같은 설계라 생각.

### P28. Consistency Is a Business Decision

-   모든 데이터를 즉시 일관되게 만들 필요도, eventual consistency가 항상
    정답인 것도 아니다.
-   **판단:** 어떤 invariant가 어느 시간 범위 안에서 반드시 지켜져야
    하는가?

### P29. Design for Failure and Observability Together

-   분산 시스템에서 failure는 예외가 아니라 정상 조건이다.
-   Timeout/Retry/Idempotency/Compensation과 Trace/Metric/Log를 함께
    설계한다.
-   **실패 조건:** 장애 대응 메커니즘만 있고 원인 관찰이 불가능.

### P30. Operational Complexity Is Architecture Cost

-   Deployment, scaling, security, observability, on-call burden은 구현
    이후의 문제가 아니라 Architecture 비용이다.

------------------------------------------------------------------------

## E. AI Delegation & Control --- AI-Native SE

### P31. Specification before Delegation

-   AI에게 더 큰 책임을 위임할수록
    Intent/Input/Constraint/Acceptance/Verification을 더 명시한다.
-   **Trade-off:** 자율성을 얻고 specification/evaluation 비용을
    부담한다.

### P32. Context Is More Than Prompt

-   Prompt는 Context의 일부다.
-   최소 관점: **Task / Knowledge / Tool / State / Domain-Policy**.
-   **실패 조건:** Context 문제를 문구 튜닝만으로 해결.

### P33. Reuse Engineering Assets as AI Context

-   Requirement, Domain Model, Architecture Rule, Test, ADR 같은 기존
    공학 자산을 AI가 소비 가능한 Context로 만든다.
-   AI용 별도 진실을 만들지 않는다.

### P34. Guardrail before Autonomy

-   허용 범위·금지 범위·권한·승인·검증을 먼저 설계한 뒤 자율성을 넓힌다.
-   **계보:** Encapsulation → Domain Boundary → Architecture Policy → AI
    Guardrail.

### P35. Harness, not Model Alone, Determines Engineering Reliability

-   Context 공급, Tool, State, Workflow, Gate, Retry, Evaluation,
    Logging, HITL을 포함한 실행 구조가 실제 품질을 결정한다.
-   **Trade-off:** 재현성과 통제를 얻고 orchestration complexity를
    부담한다.

### P36. Autonomy Is a Risk Allocation Decision

-   자율성은 모델 capability만으로 결정하지 않는다.
-   최소 판단축: **risk × reversibility × observability × verification
    cost**.
-   높은 위험/낮은 가역성은 HITL 또는 deterministic gate를 강화한다.

### P37. Probabilistic Generation Requires Deterministic Evidence where Possible

-   Test, schema, compiler, static analysis, policy check처럼 자동 판정
    가능한 것은 확률적 reviewer에게만 맡기지 않는다.
-   인간/LLM 판단은 자동화하기 어려운 의미·Trade-off 영역에 집중한다.

### P38. Agent Is a Responsible Execution Boundary, not an LLM Call

-   Agent에는 목표, 허용 범위, Context, Tool, State, 완료 조건, 실패
    처리, 관찰 가능성이 필요하다.
-   **실패 조건:** API call 하나에 Agent라는 이름만 붙인다.

### P39. Agentic Workflow Must Have Stage Contracts

-   단계마다 Input / Output / Constraint / Gate / Failure path를
    명시한다.
-   **Trade-off:** 추적성과 복구성을 얻고 workflow 설계 비용을 부담한다.

### P40. Capability Growth Requires Control Redesign

-   모델/Agent 능력이 높아지면 기존 gate를 제거하는 것이 아니라 risk와
    evidence에 따라 자율 폭과 통제를 재배치한다.

------------------------------------------------------------------------

## F. Cross-Course Meta Principles

### P41. One Concept, One Canonical Owner

-   정의는 한 곳에서 소유한다.
-   다른 과정은 recap/apply/extend만 한다.

### P42. Prerequisite Recommended, Never Assumed

-   독립 수강 가능성을 위해 최소 재정박을 제공한다.
-   재정박을 이유로 OWNER 내용을 통째로 복제하지 않는다.

### P43. Just Enough Engineering

-   명시성의 이익이 작성·유지·운영 비용보다 클 때만 구조를 추가한다.

### P44. Tool Names Are Examples, not Curriculum Architecture

-   Framework, LLM, Vendor, 특정 제품은 교체 가능한 사례다.
-   과정 구조는 오래 남는 Engineering Decision으로 구성한다.

### P45. Readability Is a Maintenance Property

-   코드는 실행뿐 아니라 사람과 AI가 변경하기 위한 지식 표현이다.
-   명확한 이름·작은 책임·드러난 의도는 검토·변경·AI Context 비용을
    줄인다.

------------------------------------------------------------------------


### P45A. Contract Must Be Explicit Enough to Verify

-   책임·경계·서비스·워크플로 단계의 계약은 성공/실패를 판정할 수 있을 만큼 명시적이어야 한다.
-   **확장:** Object Contract → Domain Invariant → Interface/Service Contract → AI Stage Contract.
-   **실패 조건:** "잘 동작한다", "적절해야 한다"처럼 판정 불가능한 계약.

### P45B. Contract Evolution Must Protect Consumers

-   외부 소비자가 존재하는 계약은 제공자 내부 구현처럼 자유롭게 바꿀 수 없다.
-   API/Event/Schema 변경은 compatibility와 consumer impact를 함께 판단한다.
-   **주 소유:** MSA에서 Service/API/Event Contract evolution으로 정본 교육.
-   **실패 조건:** 내부 refactoring과 외부 contract 변경을 같은 비용으로 취급.

### P45C. Quality Requires Evidence, Not Assertion

-   "품질이 좋다", "준수한다", "안전하다"는 선언만으로는 통제가 아니다.
-   가능한 부분은 test, review record, metric, trace, policy check, audit evidence 등으로 검증 가능하게 만든다.
-   **주 적용:** Modern QM은 여러 과정의 품질 기준을 evidence / gate / feedback으로 지속 검증한다.
-   **실패 조건:** 문서·승인만 존재하고 실제 실행 증거와 연결되지 않는다.



### P45D. Global Principle / Global BP Takes Precedence over Local Practice

-   교재의 원칙과 권고 판단은 Global primary/authoritative evidence에 근거한 **Global Principle / Global BP를 우선**한다.
-   Global Principle / Global BP와 국내 관행이 충돌하면 **Global Principle / Global BP를 교육 정본으로 유지**한다.
-   국내 사례는 **Korea BP / Korea WP / Local Context**로 성격을 분리해 제시한다.
-   법·규제·계약상 그대로 적용할 수 없는 경우는 원칙을 수정하지 않고 **Local Constraint**로 명시한다.
-   한국에서 흔한 관행을 근거 없이 Best Practice로 승격하지 않는다.
-   **판단:** 이 주장은 보편 공학 원칙인가, 검증된 지역 적응인가, 단순 관행인가, 법·시장 제약인가?
-   **실패 조건:** 국내 다수 조직이 한다는 이유로 Global Principle을 약화·변형하거나 공학적 정당성을 부여한다.

### P45E. Trace Claims to the Strongest Available Source

> 세부 source hierarchy와 localization 판정 규칙은
> `evidence-source-localization-policy.md`를 따른다.

-   원저자·표준·공식 연구·공식 통계를 우선하며 재인용보다 원출처를 추적한다.
-   한글 자료는 지역 맥락에 필요할 때 사용하되 원개념의 번역·귀속·맥락을 교차 확인한다.
-   **실패 조건:** vendor 자료, 블로그, 교육자료의 요약을 원칙의 근거로 사용한다.

## Principle Usage Contract

교재에서 원칙을 사용할 때 최소한 다음을 함께 제시한다.

`Problem → Principle → Decision Question → Example/Counterexample → Trade-off → Failure Condition → Evidence/Verification`

축자 인용이 필요하면: 1. 원전 또는 신뢰 가능한 1차/공식 출처 확인 2.
정확한 문구와 attribution 확인 3. paraphrase와 quote를 명확히 구분

검증되지 않은 인터넷 명언을 정본으로 승격하지 않는다.
