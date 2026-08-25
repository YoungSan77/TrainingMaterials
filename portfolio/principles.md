# 02. Engineering Principles v3.0

> **Status:** Portfolio Canon
> **Purpose:** Portfolio 전체의 판단 철학을 Parent로 두고, 각 Course의 전문 원칙을 Child로 유지한다. 새 과정이나 변경은 Parent Lens와 Learner Context를 먼저 검토한 후 Course-specific principle을 추가한다.
> **Portfolio rule:** 원칙은 특정 과정 수에 종속되지 않는다. 새 과정은 기존 원칙을 APPLY/EXTEND하거나 새 원칙의 필요성을 입증해야 한다.
> **Citation rule:** 축자 인용문은 별도 source/quote 자산에서 원전을 검증한 경우에만 사용한다. 이 문서는 원칙의 의미와 적용 판단을 Portfolio-level authority로 소유한다.

## A. Foundational Decision Lenses — Parent

Foundational Lens는 방법론 목록이나 순차 프로세스가 아니다. **상황에 따라 문제를 다르게 보기 위한 상위 판단 관점**이다. 모든 과정에 모든 Lens를 강제하지 않는다.

### SYS-01. Optimize the Whole
부분의 효율보다 전체 시스템의 outcome과 flow를 우선한다. Local optimization이 전체 성과를 악화시킬 수 있음을 전제로 한다.

- **Look for:** interaction, dependency, feedback loop, delay, unintended consequence.
- **Includes:** socio-technical system — technology, people, process, organization, incentive, information, governance를 함께 본다.
- **Failure condition:** 한 팀·컴포넌트·metric만 최적화하고 전체 영향은 보지 않는다.

### SYS-02. Structure Produces Behavior
반복되는 문제를 개인의 태도만으로 설명하지 않고 구조·경계·정보흐름·규칙·feedback에서 원인을 찾는다.

- **Decision question:** 이 행동을 반복해서 만들어내는 시스템 구조는 무엇인가?
- **Failure condition:** symptom이 발생한 위치를 원인 위치로 단정한다.

### LEAN-01. Value before Activity
활동량·산출물량보다 실제 outcome과 value flow를 우선한다.

- **Decision question:** 이 작업이 누구의 어떤 outcome을 개선하는가?
- **Failure condition:** 수행한 작업량을 가치로 간주한다.

### LEAN-02. Optimize Flow, Reduce Waste and Batch
대기·handoff·재작업·불필요한 batch를 줄이고 feedback이 빠르게 흐르도록 한다.

- **Includes:** built-in quality / quality at source.
- **Failure condition:** utilization을 높였지만 queue와 lead time이 증가한다.

### TOC-01. Improve the Limiting Constraint First
전체 성과를 현재 제한하는 핵심 constraint를 먼저 찾고, 비제약 영역의 과잉 최적화를 피한다.

- **Core flow:** Identify → Exploit → Subordinate → Elevate → Repeat.
- **Failure condition:** 쉬운 곳이나 눈에 띄는 곳을 개선하지만 전체 throughput/outcome은 변하지 않는다.

### DT-01. Problem before Solution
기술·방법·기능을 먼저 선택하지 않고 실제 사용자/업무 context와 문제를 먼저 이해한다.

- **Core flow:** Understand Context → Frame Problem → Generate Alternatives → Prototype Assumptions → Learn.
- **Failure condition:** 이미 선택한 solution을 정당화하기 위해 문제를 재정의한다.

### DT-02. Prototype to Learn, Not to Miniaturize Delivery
Prototype/Pilot은 작은 완제품이 아니라 중요한 가설을 싸게 검증하기 위한 learning device다.

- **Failure condition:** 검증할 assumption 없이 prototype 자체를 산출물로 취급한다.

### EMP-01. Separate Fact, Interpretation, Assumption, and Hypothesis
관찰된 사실과 해석·가정·가설을 구분한다. LLM이 생성한 그럴듯한 설명도 Evidence가 아니다.

### EMP-02. Make Important Assumptions Testable
중요한 판단은 무엇이 관찰되면 유지·수정·폐기할지를 설명할 수 있어야 한다.

### EMP-03. Prefer Cheap Learning before Expensive Commitment
큰 투자·비가역적 결정 전에 가능한 작은 실험·spike·pilot·example로 uncertainty를 줄인다.

### EMP-04. Evidence Must Change Decisions
`Decision → Expected Outcome → Evidence → Feedback → Re-decision`의 학습 루프를 만든다. 측정만 하고 결정이 바뀌지 않으면 경험주의가 아니다.

### EMP-05. Claim Strength Must Not Exceed Evidence Strength
주장의 확실성은 evidence의 질과 범위를 넘지 않는다. Opinion, example, observation, repeated observation, controlled verification을 같은 수준으로 취급하지 않는다.

## B. Cross-cutting Engineering Principles — Parent

### META-01. Outcome over Activity
교재·프로세스·산출물·도구 사용 자체가 아니라 의미 있는 outcome을 기준으로 판단한다.

### META-02. Engineering Economics / Just Enough Engineering
명시성·통제·자동화·구조가 주는 가치가 작성·변경·운영 비용보다 클 때만 추가한다. lifecycle cost와 opportunity cost를 함께 본다.

### META-03. Risk-proportional Rigor
실패 영향, 불확실성, 가역성에 비례해 specification·verification·approval의 강도를 정한다. 모든 상황에 같은 통제를 강제하지 않는다.

### META-04. Simplest Adequate Solution
충분한 품질과 제약을 만족하는 가장 단순한 실행형태를 우선한다. 단순하지만 불충분한 해법과 가치 없는 과잉 복잡성을 모두 피한다.

### META-05. Prefer Reversible Decisions where Possible
되돌릴 수 있는 결정은 빠르게 학습하고, 비가역적 결정은 더 강한 evidence와 검증을 요구한다.

### META-06. Evidence Proportional to Claim
중요한 품질·준수·안전 주장은 가능한 경우 실행 가능한 evidence로 뒷받침한다.

### META-07. One Concept, One Owner
정의는 한 곳에서 소유하고 다른 과정은 RECAP / APPLY / EXTEND / BRIDGE / FORWARD로 사용한다.

### Parent–Child Rule
Course-owned principle은 위 Parent Lens/Principle을 전문영역에서 구체화한다. Child가 Parent를 재정의하지 않으며, 관련 Parent가 있으면 추적 가능하게 한다.

------------------------------------------------------------------------

## C. Course-owned Engineering Principles — Child
## C1. Modeling & Object Responsibility — OOAD

**Primary Parent Lenses:** Systems Thinking / Empiricism.

### OOAD-01. Object = State + Behavior + Message + Responsibility

**Lineage:** Alan Kay의 messaging/state/late binding 관점과 초기 OO
계보.

-   **판단:** 객체가 자신의 상태와 규칙을 보호하며 협력하는가?
-   **얻는 것:** Encapsulation, 변경 국소화.
-   **잃는 것:** 책임 배치 설계 비용.
-   **실패 조건:** DTO/Projection까지 Rich Object로 강제.
-   **Anti-pattern:** Getter/Setter Data Bag + 외부 Service가 모든 판단.

### OOAD-02. Model before Notation

**Lineage:** Booch의 object-oriented analysis/design 및 object-oriented
decomposition 계보.

-   UML은 모델이 아니라 표현 수단이다.
-   정적 구조와 동적 협력을 모두 설명해야 한다.
-   **실패 조건:** Class Diagram을 먼저 그리고 현실을 끼워 맞춘다.

### OOAD-03. Responsibility before Class

**Lineage:** Responsibility-Driven Design / GRASP 계보.

-   "어떤 클래스가 필요한가?"보다 "이 책임을 누가 져야 하는가?"를 먼저
    묻는다.
-   **Trade-off:** 책임 탐색 비용을 지불하고 구조적 응집도를 얻는다.

### OOAD-04. Information Expert

**Lineage:** Craig Larman / GRASP.

-   책임 수행에 필요한 정보를 가장 잘 알고 있는 객체를 우선 후보로 둔다.
-   **한계:** Expert만으로 결정하지 않는다. Coupling/Cohesion/Protected
    Variation과 함께 판단한다.

### OOAD-05. Tell, Don't Ask

-   객체의 상태를 꺼내 외부에서 판단하기보다 의미 있는 행위를 요청한다.
-   **Anti-pattern:** `if (order.getStatus()) order.setStatus(...)`
-   **Better:** `order.cancel()`
-   **실패 조건:** Query/Reporting/DTO에까지 기계적으로 적용.

> 이 원칙은 특정 한 사람의 축자 명언으로 고정하지 않는다. 여러 OO 실천
> 전통에서 발전한 heuristic으로 취급한다.

### OOAD-06. Law of Demeter / Least Knowledge

**Lineage:** Ian Holland.

-   협력에 필요한 최소한의 이웃만 안다.
-   `a.b().c().d()`의 점 개수 자체가 법칙은 아니다.
-   **Trade-off:** 구조 은닉을 얻지만 무의미한 forwarding method 남발
    가능.

### OOAD-07. Command--Query Separation

**Lineage:** Bertrand Meyer.

-   상태 변경(Command)과 관찰(Query)의 의미를 분리해 side effect를 예측
    가능하게 한다.
-   **실패 조건:** 모든 API를 기계적으로 둘로 쪼개 오히려 의도를 흐린다.

### OOAD-08. High Cohesion / Low Coupling

-   함께 변하는 책임은 모으고 독립적으로 변하는 책임은 분리한다.
-   Object → Module → Component → Service → Agent boundary까지 반복되는
    공통 원리.
-   **실패 조건:** 결합을 0으로 만들려다 indirection만 증가.

### OOAD-09. Program to an Interface, not an Implementation

**Lineage:** GoF.

-   변동성이 있는 협력 상대의 구체 구현보다 필요한 계약에 의존한다.
-   **실패 조건:** 변동성이 없는 곳에도 interface를 기계적으로 추가.

### OOAD-10. Favor Composition over Inheritance

**Lineage:** GoF.

-   변화 가능한 행위를 상속 계층보다 협력 객체 조합으로 구성하는 것을
    우선 검토한다.
-   **판단:** 진짜 is-a인가? 독립적 변화가 필요한가?

### OOAD-11. Dependency Inversion

**Lineage:** Robert C. Martin.

-   중요한 정책이 세부 구현에 끌려가지 않도록 의존 방향을 제어한다.
-   **확장:** OOAD의 DIP → SW Architecture의 Dependency Rule.
-   **실패 조건:** DI Framework 사용을 DIP 준수로 착각.


### OOAD-12. Design by Contract

**Lineage:** Bertrand Meyer / Eiffel의 Design by Contract 계보.

-   객체의 책임은 호출자와 제공자 사이의 **명시적 계약**으로 표현할 수 있다.
-   최소 요소는 **Precondition / Postcondition / Invariant**다.
-   **판단:** 이 책임을 호출하기 전에 무엇이 참이어야 하고, 완료 후 무엇을 보장하며, 객체는 어떤 유효 상태를 계속 지켜야 하는가?
-   **얻는 것:** 책임 경계와 실패 조건의 명시성, 검증 가능성.
-   **Trade-off:** 계약을 작성·동기화하는 비용을 부담한다.
-   **실패 조건:** 단순 getter/DTO까지 과도한 계약으로 포장하거나, 계약과 구현/테스트가 분리되어 이중 장부가 된다.

> DDD는 이 원칙을 다시 소유하지 않는다. OOAD의 계약 사고를 Domain Invariant와 Aggregate consistency에 적용·심화한다.

------------------------------------------------------------------------

## C2. Domain Meaning & Boundary — DDD

**Primary Parent Lenses:** Systems Thinking / Design Thinking / Empiricism.

### DDD-01. Put Domain Rules with the Model that Owns Them

**Lineage:** Rich Domain Model / DDD.

-   Domain 상태와 불변식을 외부 Service에 흩뜨리지 않는다.
-   **전제:** 의미 있는 규칙과 상태 전이가 존재.
-   **실패 조건:** 단순 CRUD에 Rich Domain Model 강제.

### DDD-02. Ubiquitous Language Is Executable Alignment

**Lineage:** Eric Evans / DDD.

-   대화·모델·코드에서 같은 Domain Language를 사용한다.
-   용어집만 만드는 것으로 끝나지 않는다.
-   **실패 조건:** 문서의 용어와 코드/대화가 분리.

### DDD-03. Invariants Define Consistency Boundaries

-   함께 즉시 지켜야 할 규칙이 Aggregate boundary의 강한 근거다.
-   **Trade-off:** 큰 Aggregate는 일관성을 단순화하지만 경합·확장 비용을
    높인다.
-   **실패 조건:** 객체 참조 편의성으로 Aggregate를 정한다.

### DDD-04. Boundary Protects Meaning

-   Bounded Context는 특정 모델과 언어의 의미가 일관되는 경계다.
-   조직도나 서비스 목록을 그대로 복사하지 않는다.

### DDD-05. Domain Boundary ≠ Deployment Boundary

-   **Bounded Context ≠ Microservice.**
-   Domain boundary는 의미를 보호하고, service boundary는 독립 실행·운영
    비용까지 포함한다.
-   **선택:** Module / Modular Monolith / Service.

### DDD-06. Explicit Semantics before Ontology

-   Ontology 도구/형식보다 먼저 공유해야 할
    Concept/Relation/Role/Constraint를 확인한다.
-   **전제:** 여러 시스템·조직·Agent 사이 의미 불일치 비용이 크다.
-   **실패 조건:** 단순 vocabulary에 formal ontology부터 도입.

------------------------------------------------------------------------

## C3. Architecture Decisions — SW Architecture

**Primary Parent Lenses:** Systems Thinking / Empiricism.

### ARCH-01. Architecture Is a Set of Consequential Decisions

-   Architecture는 그림이 아니라 변경 비용이 크고 품질에 영향을 주는
    구조적 결정이다.
-   **판단:** 이 결정이 어떤 driver/constraint 때문에 중요한가?

### ARCH-02. Quality Attributes Drive Structure

-   기능 요구만으로 Architecture를 결정하지 않는다.
-   성능·가용성·변경용이성·보안·운영성 등 **얼마나 잘** 해야 하는지가
    구조를 바꾼다.
-   **실패 조건:** Quality Attribute를 "좋아야 한다" 수준의 형용사로만
    둔다.

### ARCH-03. Every Architecture Choice Buys Something and Pays Something

-   Architecture에는 무료 해법이 없다.
-   선택은 `Context → Options → Gain → Cost/Risk → Decision`으로
    설명한다.
-   **실패 조건:** Pattern/Style 이름을 근거로 선택.

### ARCH-04. Stable Policy Should Not Depend on Volatile Detail

**Structural anchor:** Clean Architecture / Dependency Rule 계보.

-   Domain/Use Case 같은 정책을 Framework/DB/API 세부사항에서 보호한다.
-   Clean Architecture의 핵심 가치는 동심원 그림 자체가 아니라 **Policy와 Detail의 분리 및 inward dependency**다.
-   Port/Adapter는 이 목적을 위한 수단이지 목표가 아니다.
-   **실패 조건:** Clean Architecture의 layer/package 이름을 복제했지만 실제 dependency가 외부 detail을 향한다.

### ARCH-05. Architecture Must Be Enforceable

-   합의만 있고 검증이 없으면 시간이 지나며 구조는 붕괴한다.
-   Test, lint, dependency rule, fitness function 등 가능한 부분은 자동
    검증한다.
-   **Trade-off:** 강제력을 얻지만 gate 유지 비용을 부담한다.

### ARCH-06. Architecture Evolves

**Lineage:** Evolutionary Architecture — guided, incremental change across multiple dimensions.

-   초기 설계를 고정하지 않는다. 새로운 evidence와 quality pressure에 따라 의사결정을 재평가한다.
-   중요한 architectural characteristic은 가능한 경우 **fitness function**으로 지속 관찰·검증한다.
-   변화는 무제한 자유가 아니라 중요한 특성을 보호하는 **guided incremental change**다.
-   **실패 조건:** 미래의 모든 변화에 대비한 과잉 설계.

------------------------------------------------------------------------

## C4. Distribution & Operational Reality — MSA

**Primary Parent Lenses:** Systems Thinking / Lean Thinking / Theory of Constraints / Empiricism.

### MSA-01. Monolith First unless Distribution Pays

-   분산은 기본값이 아니다.
-   독립 배포·확장·소유의 가치가 Network/Consistency/Operation 비용보다
    클 때 선택한다.

### MSA-02. Validate Boundaries Cheaply before Distributing

-   Module/Modular Monolith에서 경계를 먼저 검증하면 잘못된 분할을 싸게
    고칠 수 있다.
-   **실패 조건:** 조직도나 데이터 테이블 기준으로 바로 서비스 분리.

### MSA-03. Data Ownership Follows Service Autonomy

-   독립 서비스가 같은 데이터 구조를 직접 공유하면 자율성은 환상이다.
-   **Trade-off:** 독립성을 얻고 데이터 중복·동기화 비용을 부담할 수
    있다.

### MSA-04. Remote Calls Are Not Local Calls

-   Network에는 latency, partial failure, retry, timeout, duplication이
    존재한다.
-   **실패 조건:** 메서드 호출을 HTTP/gRPC로 치환하고 같은 설계라 생각.

### MSA-05. Consistency Is a Business Decision

-   모든 데이터를 즉시 일관되게 만들 필요도, eventual consistency가 항상
    정답인 것도 아니다.
-   **판단:** 어떤 invariant가 어느 시간 범위 안에서 반드시 지켜져야
    하는가?

### MSA-06. Design for Failure and Observability Together

-   분산 시스템에서 failure는 예외가 아니라 정상 조건이다.
-   Timeout/Retry/Idempotency/Compensation과 Trace/Metric/Log를 함께
    설계한다.
-   **실패 조건:** 장애 대응 메커니즘만 있고 원인 관찰이 불가능.

### MSA-07. Operational Complexity Is Architecture Cost

-   Deployment, scaling, security, observability, on-call burden은 구현
    이후의 문제가 아니라 Architecture 비용이다.

------------------------------------------------------------------------

## C5. AI Delegation & Control — AI-Native SE

**Primary Parent Lenses:** Systems Thinking / Design Thinking / Empiricism.

### AI-01. Specification before Delegation

-   AI에게 더 큰 책임을 위임할수록
    Intent/Input/Constraint/Acceptance/Verification을 더 명시한다.
-   **Trade-off:** 자율성을 얻고 specification/evaluation 비용을
    부담한다.

### AI-02. Context Is More Than Prompt

-   Prompt는 Context의 일부다.
-   최소 관점: **Task / Knowledge / Tool / State / Domain-Policy**.
-   **실패 조건:** Context 문제를 문구 튜닝만으로 해결.

### AI-03. Reuse Engineering Assets as AI Context

-   Requirement, Domain Model, Architecture Rule, Test, ADR 같은 기존
    공학 자산을 AI가 소비 가능한 Context로 만든다.
-   AI용 별도 진실을 만들지 않는다.

### AI-04. Guardrail before Autonomy

-   허용 범위·금지 범위·권한·승인·검증을 먼저 설계한 뒤 자율성을 넓힌다.
-   **계보:** Encapsulation → Domain Boundary → Architecture Policy → AI
    Guardrail.

### AI-05. Harness, not Model Alone, Determines Engineering Reliability

-   Context 공급, Tool, State, Workflow, Gate, Retry, Evaluation,
    Logging, HITL을 포함한 실행 구조가 실제 품질을 결정한다.
-   **Trade-off:** 재현성과 통제를 얻고 orchestration complexity를
    부담한다.

### AI-06. Autonomy Is a Risk Allocation Decision

-   자율성은 모델 capability만으로 결정하지 않는다.
-   최소 판단축: **risk × reversibility × observability × verification
    cost**.
-   높은 위험/낮은 가역성은 HITL 또는 deterministic gate를 강화한다.

### AI-07. Probabilistic Generation Requires Deterministic Evidence where Possible

-   Test, schema, compiler, static analysis, policy check처럼 자동 판정
    가능한 것은 확률적 reviewer에게만 맡기지 않는다.
-   인간/LLM 판단은 자동화하기 어려운 의미·Trade-off 영역에 집중한다.

### AI-08. Agent Is a Responsible Execution Boundary, not an LLM Call

-   Agent에는 목표, 허용 범위, Context, Tool, State, 완료 조건, 실패
    처리, 관찰 가능성이 필요하다.
-   **실패 조건:** API call 하나에 Agent라는 이름만 붙인다.

### AI-09. Agentic Workflow Must Have Stage Contracts

-   단계마다 Input / Output / Constraint / Gate / Failure path를
    명시한다.
-   **Trade-off:** 추적성과 복구성을 얻고 workflow 설계 비용을 부담한다.

### AI-10. Capability Growth Requires Control Redesign

-   모델/Agent 능력이 높아지면 기존 gate를 제거하는 것이 아니라 risk와
    evidence에 따라 자율 폭과 통제를 재배치한다.

------------------------------------------------------------------------


## C6. Adaptive Delivery — Agile

**Primary Parent Lenses:** Lean Thinking / Systems Thinking / Empiricism.

### AGILE-01. Diagnose before Adopting a Framework
Process name보다 문제의 원인을 먼저 분리한다: Engineering Capability / Uncertainty / Feedback / Organization / Governance.

### AGILE-02. Shorten the Learning Loop
Batch Size와 Feedback Delay를 줄여 uncertainty를 조기에 노출한다.

### AGILE-03. Working Increment before Progress Assertion
Task completion보다 검증 가능한 Working Software/Increment를 진척 Evidence로 우선한다.

### AGILE-04. Engineering Discipline Enables Agility
기술적 탁월성과 좋은 설계는 변화 비용을 낮춰 agility를 높인다.

### AGILE-05. Scrum Is a Framework, not Engineering Capability
Scrum ceremony가 Version Control / Build / Test / Review / Design capability를 대신하지 않는다.

### AGILE-06. Pilot before Scaling
작은 Pilot에서 Evidence를 만들고 확대·유지·수정·중단을 판단한다.


------------------------------------------------------------------------

## C7. Quality as an Engineering System — Modern SWQM

**Primary Parent Lenses:** Systems Thinking / Lean Thinking / Theory of Constraints / Empiricism.

### QM-01. Prevention before Detection
가능하면 결함을 가장 싼 지점에서 예방·확인한다. 마지막 QA 단계로 품질 책임을 이관하지 않는다.

### QM-02. Shift Left Selectively
모든 검사를 앞당기는 것이 아니라 defect source와 feedback cost를 기준으로 가장 효과적인 지점에 검증을 배치한다.

### QM-03. Evidence before Assertion
검토 완료·준수·품질 양호 같은 상태 선언보다 test, review, analysis, trace 등 검증 가능한 evidence를 우선한다.

### QM-04. Verification Rigor Follows Risk
모든 산출물에 동일 Gate를 적용하지 않고 실패 영향과 uncertainty에 맞춰 verification 강도를 정한다.

### QM-05. Metrics Diagnose; Targets Can Distort
Metric은 시스템 상태를 이해하고 결정을 바꾸기 위한 evidence다. Metric 자체를 목표·보상으로 고정해 gaming을 만들지 않는다.

### QM-06. Improve the System before Blaming the Actor
반복되는 품질 문제는 개인보다 process, incentive, boundary, information flow 등 시스템 구조에서 먼저 원인을 찾는다.

### QM-07. Improve the Current Quality Constraint
가장 큰 품질 bottleneck 하나를 선택해 작은 개선과 evidence로 다음 판단을 만든다.

## C8. Delivery Flow & Operations — DevOps

**Primary Parent Lenses:** Lean Thinking / Systems Thinking / Theory of Constraints / Empiricism.

### DEVOPS-01. Diagnose before Automating
도구나 pipeline을 먼저 도입하지 않고 실제 delivery bottleneck과 engineering capability를 진단한다.

### DEVOPS-02. Optimize End-to-End Delivery Flow
개발·운영의 개별 utilization보다 change가 build, verify, release, operate, recover를 통과하는 전체 flow를 최적화한다.

### DEVOPS-03. Small Batch and Fast Feedback Reduce Delivery Risk
작은 변경과 빠른 feedback은 학습비용과 blast radius를 줄인다.

### DEVOPS-04. Reproducibility before Deployment Sophistication
복잡한 배포 전략보다 먼저 same artifact, environment consistency, repeatable build/deploy를 확보한다.

### DEVOPS-05. Recovery and Learning Are Part of Delivery
실패를 완전히 제거할 수 없으면 detect, contain, recover, learn을 delivery capability에 포함한다.

## C9. Project Value & Governance — SW Project Management

**Primary Parent Lenses:** Systems Thinking / Theory of Constraints / Empiricism.

### PM-01. Adopt a Holistic View
한 영역의 최적화가 프로젝트 전체 value와 outcome을 악화시키지 않는지 본다.

### PM-02. Focus on Value
output completion보다 stakeholder와 organization에 필요한 value/outcome을 기준으로 판단한다.

### PM-03. Embed Quality into Processes and Deliverables
품질을 마지막 검사로 분리하지 않고 planning, execution, verification에 내재화한다.

### PM-04. Be an Accountable Leader
직위보다 결정과 결과에 대한 accountability, escalation, ownership을 명확히 한다.

### PM-05. Integrate Sustainability across the Project
프로젝트 종료 이후의 운영·유지·사회·환경 영향까지 lifecycle consequence로 본다.

### PM-06. Build an Empowered Culture
정보가 있는 지점 가까이에 적절한 decision right와 feedback을 둔다.

## C10. Customer Decision & Proposal — SW Proposal

**Primary Parent Lenses:** Design Thinking / Systems Thinking / Empiricism.

### PROP-01. Customer Decision before Proposal Document
RFP 목차나 자사 capability보다 고객이 실제로 내려야 할 buying/business decision을 먼저 이해한다.

### PROP-02. Bid only when Value, Win Probability, and Delivery Feasibility Align
모든 기회를 pursuit하지 않고 attractiveness, win probability, delivery feasibility와 evidence를 함께 본다.

### PROP-03. Model the Stakeholder Decision System
Sponsor, buyer, evaluator, user, procurement, operations의 서로 다른 concern과 influence를 하나의 decision system으로 본다.

### PROP-04. Requirement Compliance Is Necessary but Not Sufficient
stated requirement와 underlying problem을 구분하고 compliance를 insight와 differentiation으로 연결한다.

### PROP-05. Credibility Requires Evidence
주장과 promise는 reference, proof, delivery plan, acceptance evidence 등 신뢰 가능한 근거와 연결한다.

## C11. Transformation Strategy — DT→AX

**Primary Parent Lenses:** Design Thinking / Systems Thinking / Lean Thinking / Theory of Constraints / Empiricism.

### AX-01. Outcome before Technology Adoption
신기술 도입률이나 시스템 구축 완료보다 business, customer, process, decision outcome을 먼저 정의한다.

### AX-02. Transformation Is Socio-Technical System Change
technology만 바꾸지 않고 process, data, organization, governance, capability, decision right를 함께 본다.

### AX-03. Find the Transformation Constraint
AI capability 자체보다 value flow를 실제로 제한하는 data, process, decision, governance, adoption constraint를 먼저 개선한다.

### AX-04. Pilot to Learn before Scaling
pilot은 showcase가 아니라 중요한 transformation assumption을 검증하는 learning device다.

### AX-05. Scale only with Evidence
pilot 결과가 target outcome과 연결될 때 확대하고, 그렇지 않으면 수정·중단·재설계한다.

------------------------------------------------------------------------

## Principle Usage Contract

교재에서 원칙을 사용할 때 최소한 다음을 함께 제시한다.

`Learner/Work Context → Problem → Parent Lens → Course Principle → Decision Question → Example/Counterexample → Trade-off → Failure Condition → Evidence/Verification`

축자 인용이 필요하면: 1. 원전 또는 신뢰 가능한 1차/공식 출처 확인 2.
정확한 문구와 attribution 확인 3. paraphrase와 quote를 명확히 구분

검증되지 않은 인터넷 명언을 authoritative principle/source로 승격하지 않는다.


---
## Unified Portfolio Alignment v2.6
- 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
- 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
- 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
- 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.
