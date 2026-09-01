# 객체지향 분석과 설계 실무 — Course Design

## Identity

- **Slug:** `ooad`
- **Confirmed duration:** 16h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

업무 요구와 변경 압력을 객체의 책임·협력·계약으로 변환하고, 설계 결정을 코드로 이어갈 수 있게 한다.

## Target Learner

절차적 서비스 중심 코드에서 변경 파급과 책임 분산을 경험한 개발자·설계자

## Capability Gap

- 요구·use case를 곧바로 클래스 목록으로 바꾼다
- Analysis를 특정 phase의 산출물로만 보거나, 반대로 iterative/agile이라는 이유로 Problem과 Solution을 구분하는 분석 사고를 생략한다
- Problem Understanding에 UI·DB·API·framework 등 premature solution detail을 섞어 문제와 구현 기준을 결합한다
- 데이터와 행위를 분리해 규칙이 여러 service와 호출부에 흩어진다
- UML 표기나 원칙 이름을 설계 판단보다 앞세운다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- Analysis를 lifecycle phase가 아니라 Problem을 Solution과 구분하여 이해하는 사고 활동으로 적용한다
- 분석 문제와 구현 결정을 구분하고, legitimate constraint와 premature solution decision을 구별한다
- 정적·동적 관점으로 Problem Understanding을 명시하고 검토한다
- 상태와 행위를 소유할 객체 경계를 찾는다
- 책임·협력·계약을 통해 변경 영향을 국소화한다
- 정적·동적 모델과 Code evidence로 설계를 검토·개선하고, OOAD 결과가 개발·검증·운영 이관과 이후 전문 설계 영역의 출발점이 됨을 설명한다

## Course Thesis

> OOAD는 현실의 명사를 클래스로 옮기는 작업이 아니라, 문제영역의 본질적 복잡성을 구현 결정과 구분해 이해하고, 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 판단 과정이다.

Analysis와 Design은 고정된 lifecycle phase를 뜻하지 않는다.

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

Brooks의 Essence / Accident 관점에서 Analysis는 problem-domain의 essential conceptual complexity를 명시적으로 이해하고, accidental 또는 premature solution detail이 Problem Understanding을 대신하거나 조기에 왜곡·제약하지 않도록 구분한다. 기술·운영·법적 제약처럼 문제 정의에 정당하게 영향을 주는 constraint까지 배제한다는 뜻은 아니다.

## Core Learning Scope

- 요구와 black-box scenario에서 Problem Understanding을 정제하고 설계 질문 추출
- Analysis activity/concern과 lifecycle phase의 구분
- Brooks Essence / Accident를 이용한 essential problem과 premature solution detail의 구분
- 객체는 상태와 행위를 캡슐화하고, 책임을 맡아 메시지로 협력한다 — Responsibility는 어떤 상태·행위를 그 객체가 소유·수행해야 하는지를 정하는 설계 판단이며 Behavior와 동의어가 아니다
- 분석 모델과 설계 모델의 구분
- 정적·동적 모델을 동일한 Problem Understanding의 상호보완적 관점으로 사용
- 책임 할당, information expert, cohesion/coupling, information hiding
- 협력·sequence·state를 위한 just-enough modeling
- precondition·postcondition·invariant와 객체 계약
- composition/interface/dependency 원칙의 압력 기반 적용
- OOAD 모델이 객체·상태·책임·협력·계약에서 Code의 class·state·method·message·executable rule로 자연스럽게 구체화되는 연결
- 구현 중 Debugging·Developer Test·TDD·Refactoring을 통한 빠른 feedback과, 필요 시 Requirement·Analysis·Architecture·Design 판단의 재검토(재작업을 Refactoring이라는 이름으로 미화하지 않는다)
- Commit 이후 통합 검증과 CI/CD의 역할, 그리고 DevOps를 도구 도입이 아닌 Dev·Ops의 flow·feedback·shared responsibility를 만드는 문화로 positioning
- OOAD를 기반으로 Software Architecture·DDD·MSA·AI-Native가 추가로 다루는 문제와 경계

객체에 메시지를 요청하기 전에 무엇이 참이어야 하고, 수행 뒤 무엇을 보장하며, 객체가 계속 지켜야 할 일관성이 무엇인지 객체 계약(precondition/postcondition/invariant)으로 먼저 명시한다. 그 계약을 누가 소유하고 보장해야 하는지 물으며 책임 할당 판단(정보 전문가·응집도·결합도·정보 은닉)으로 이어가고, 이후 실제 change가 기존 계약에 주는 압력을 관찰해 composition/interface/dependency 같은 변화 대응 원칙을 필요한 만큼 적용한다. **GRASP는 서로 배타적인 해결책 목록이 아니라 Responsibility Assignment를 검토하는 중첩 가능한 판단 관점으로 사용하며, 하나의 설계 결정이 여러 GRASP 관점에서 동시에 설명될 수 있다. GoF Design Pattern은 반복되는 특정 설계 문제에 대한 재사용 가능한 solution structure로 다루며, 문제·책임·협력·계약과 change pressure를 먼저 이해한 뒤 그 해결 구조와 Pattern vocabulary를 연결한다.** 원칙과 Pattern을 checklist나 이름 맞히기로 사용하지 않으며, Pattern별 상세 적용·비교·조합은 현재 과정의 completeness를 위해 확장하지 않는다. 개별 GRASP/Pattern 항목의 적용 절차는 Curriculum·Session Detailed Design이 결정한다.

## Ownership

- **Owns:** 객체 책임·협력·계약과 분석→객체 설계 전환

### Non-scope

- DDD strategic/tactical pattern을 완결적으로 가르치기
- architecture style·quality-attribute trade-off
- MSA 서비스 분할
- 특정 언어·framework 숙련
- pattern catalog 암기 및 GoF Pattern별 상세 적용·비교·조합을 완결적으로 가르치기
- CI/CD pipeline 구축·자동화 도구 사용법(예: GitHub Actions/Jenkins pipeline 작성), container/orchestration 상세(Docker/Kubernetes/ArgoCD 등), DevOps 전문 과정 수준의 delivery flow·recovery·operational learning

### Cross-course Boundary / Handoff

> **OOAD는 객체 수준의 분석·설계에서 끝나는 독립 기술이 아니라, 이후 개발·검증·운영 이관과 Software Architecture·DDD·MSA·AI-Native로 이어지는 출발점이다.** 다음 영역들은 OOAD의 하위 개념이 아니라, OOAD가 제공한 problem understanding·responsibility·collaboration·contract·change judgment를 기반으로 더 큰 범위와 새로운 관심사를 다룬다.

- OOAD에서 Domain은 SW가 해결하려는 문제와 업무의 세계로 사용하고, Conceptual/Analysis Domain Model을 통해 필요한 의미 구조를 다룬다. Domain Model의 지속적 정제, Ubiquitous Language, Aggregate·Bounded Context 등 DDD 전문 판단은 DDD로 넘긴다
- MDD/MDA는 OOAD와 무관한 별도 흐름으로 다루지 않는다. OOAD의 Analysis Model → Design Model → Implementation이라는 모델 기반 흐름이 이후 더 체계화·정형화·표준화된 관계만 필요한 맥락에서 연결하고, MDD/MDA 자체의 상세 기법은 이 과정의 필수 scope로 확장하지 않는다
- 구조적 품질 선택과 architecture evaluation은 SW Architecture로 넘긴다
- 분산 경계와 운영 실패는 MSA로 넘긴다
- CI/CD와 DevOps는 S10에서 OOAD 결과가 개발·검증·운영으로 이어지는 next step으로 positioning하되, CI/CD 도구 숙련이나 DevOps 조직·운영 전문 내용으로 확장하지 않는다. CI Quality Gate는 무엇을 검증하는지 이해시키기 위한 품질 관점과 대표 도구 예시까지만 다루고, 실제 pipeline 구축·YAML 작성·container/orchestration 상세는 CI/CD·DevOps 과정으로 넘긴다
- AI-Native는 OOAD의 problem/model/boundary/responsibility judgment를 전제로 Human과 Agent의 역할 분담, Context·Guardrail·Harness 등 다음 수준의 개발 방식을 다루는 영역으로 S11에서 handoff한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 어떤 규칙과 상태를 어느 객체가 소유해야 하는가
- 현재 질문에 어떤 모델이 필요한가
- 책임 이동이 coupling과 change impact를 실제로 줄이는가
- 추상화·pattern·refactoring 비용을 지금 지불할 근거가 있는가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 문제 오해와 절차적 변경 파급을 관찰하고, Analysis를 phase가 아니라 Problem/Solution을 구분하는 사고 활동으로 정립한다
2. 요구·scenario·System Operation Contract에서 essential problem과 required domain change를 구현 detail과 구분한다
3. 정적 모델로 Domain의 concept·attribute·relationship을 명시하여 Problem Understanding의 구조 관점을 만든다
4. 동적 모델로 interaction·state change를 확인하여 같은 Problem Understanding의 행위 관점을 보완한다
5. 분석 모델을 구현 Class로 기계 변환하지 않고, 학습자 자신의 기존 경험으로 먼저 객체 경계·책임·메시지 관점의 initial design(before model)을 만든다
6. 그 initial design의 핵심 메시지에 객체 계약을 명시하고, 그 계약을 누가 보장할지 RDD·응집도·결합도 같은 공학적 판단 기준으로 검토해 책임 배치를 정제한다(refined design)
7. 새로운 change request가 기존 계약과 협력에 주는 압력을 관찰해 필요한 variation mechanism으로 local refinement하고, Pattern 이름 없이 설계 문제와 해결 구조를 먼저 이해한 뒤 대표 GoF Pattern vocabulary와 연결한다
8. 여러 설계 대안을 change impact·cohesion/coupling·dependency·abstraction cost·SOLID·pattern·trade-off 관점에서 종합 판단한다
9. S02~S09에서 통합한 OOAD 결과가 Code로 자연스럽게 구체화되는 모습을 확인하고, 구현 중 문제를 Code에 국한할지 Requirement·Analysis·Architecture·Design 수준까지 다시 판단할지 구분한다. 개발 중 Debugging·Developer Test·TDD·Refactoring과 Commit 이후 통합 검증을 구분하고, 품질이 개발 단계에서 먼저 확보된 뒤 CI/CD와 DevOps로 이어지는 흐름을 이해한다
10. OOAD가 Software Architecture·DDD·MSA·AI-Native의 출발점임을 확인하고, OOAD가 이미 해결한 문제와 각 전문 영역이 추가로 소유하는 문제를 구분한다

이 progression에서 **S02~S09는 OOAD Core**를 구성한다. S07은 실제 change에 대한 **local refinement**, S08은 **여러 Design Alternative를 평가하고 선택하는 판단**, S09는 앞선 분석·설계 판단을 통합하는 workshop을 소유한다. **S10과 S11은 OOAD Core 이후의 Next Steps**다. S10은 OOAD 결과가 개발·개발 중 Test·TDD·Refactoring·Commit 이후 검증·CI/CD·DevOps로 이어지는 연결을 소유하고, S11은 OOAD를 출발점으로 Software Architecture·DDD·MSA·AI-Native가 추가로 다루는 문제와 경계를 소유한다. S08의 기본 판단 흐름은 `Change Impact → Cohesion/Coupling → Dependency → Abstraction Cost → SOLID/Pattern → Trade-off → Design Decision`이다. SOLID와 Pattern은 적용 개수나 checklist가 아니라 대안을 설명·평가하는 판단 언어로 사용한다. Abstraction·interface·Pattern을 추가하는 선택에도 이해·구현·협력 비용이 있으므로 실제 change evidence와 얻는 효과를 함께 비교한다.

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## Running Example Strategy

Curriculum은 하나의 공통 progression을 기본 예로 사용해 Requirement → Static Problem Understanding → Dynamic Problem Understanding → Initial Design → Refined Design을 관통한다. Shipment는 이 기본 흐름의 필수 concept으로 강제하지 않는다. Order Cancellation/Refund는 기본 설계가 끝난 뒤 투입하는 variation/change request로 사용하며, 기본 설계 자체의 대상으로 앞당기지 않는다. 구체적인 시나리오 명칭과 실습 산출물은 Curriculum/Session Detailed Design이 정한다.

## Change as Learning Device

핵심 실습은 먼저 정상 요구의 핵심 메시지에 객체 계약을 명시하고 그 계약을 보장할 책임과 협력 구조를 설계하게 한 뒤, 후속 학습에서 새로운 change request를 투입해 기존 계약과 설계가 어디서 흔들리는지 관찰하고 책임·variation 대응을 보완하게 한다. Order Cancellation/Refund는 이 change request의 대표 사례이며 기본 설계의 대상이 아니다. 이 원칙은 이후 change impact·design evaluation·refactoring 학습으로 이어지는 교육적 장치다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Order 책임 재배치 | 정상 흐름(주문→결제)에서 분산되기 쉬운 책임을 어떤 객체 책임과 계약으로 옮길지 판단 | 책임표·계약·협력 sketch | 클래스 이름만 늘거나 규칙 owner가 여전히 여러 곳인 경우 |
| Just-enough 모델 선택 | 변경 질문에 필요한 정적·동적 모델을 선택 | 선택한 모델과 제외 이유 | 모든 UML을 만들거나 표기 자체가 목적이 되는 경우 |
| OOAD Next-Step 판단 평가 A — Development Feedback Scope | 구현 중 문제 상황에서 Code/Design/Analysis/Architecture 중 어디까지 다시 판단할지, 개발 중 Test와 Commit 이후 검증 중 어디서 발견해야 할 문제인지 판단 | 재판단 수준 분류 + 근거 | 모든 문제를 Code 수준 수정으로만 보거나, 산출물을 반드시 다시 써야 한다고 오해하는 경우 |
| OOAD Next-Step 판단 평가 B — CI/CD·DevOps Readiness | Dev/Ops 성숙도가 낮은 상황 자료를 주고 CI/CD 연결의 우선순위, Dev/Ops 중 먼저 안정화할 대상, CI가 반복 확인할 품질을 판단 | 판단 + 근거(둘 중 하나는 discussion으로 축소 가능) | 코딩 자체를 요구하거나, CI/CD를 품질 생성 장치로 보거나, DevOps를 도구 도입으로 축소하거나, 재작업을 Refactoring 이름으로 미화하거나, SA·MSA·DDD·AI-Native를 OOAD와 단절된 별도 기술로 설명하는 경우 |
| 설계 대안 평가 | S07 설계를 바탕으로 두 Design Alternative의 비용·효과와 trade-off를 비교해 선택 | 선택한 설계 + 짧은 판단 근거 | 원칙 이름이나 추상화 수만으로 대안을 선택하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [FOUNDATION][QUOTE][ANCHOR] | Object-Oriented Programming | “OOP to me means only messaging, local retention and protection and hiding of state-process, and extreme late-binding of all things.” | Alan Kay, “Clarification of object-oriented”, 2003 | https://www.accu.org/content/conf2011/Kevlin-Henney-Will-the-Real-OO-Please-Stand-Up.pdf | OOP의 출발점을 message·local state·late binding으로 고정 (ACCU) |
| [FOUNDATION][COMPLEXITY][ANCHOR] | Essence / Accident | “The essence of a software entity is a construct of interlocking concepts: data sets, relationships among data items, algorithms, and invocations of functions.” | Frederick P. Brooks Jr., “No Silver Bullet — Essence and Accident in Software Engineering” | https://www2.csc.liv.ac.uk/~coopes/comp319/2016/papers/NoSilverBullet-Brooks1987.htm | SW의 핵심 난점이 conceptual construct의 specification·design·testing에 있음을 고정하고, Problem Understanding과 accidental/premature solution detail을 구분하는 상위 Anchor |
| [DEFINITION][OOA][ANCHOR] | Object-Oriented Analysis | “Object-oriented analysis examines requirements from the perspective of the classes and objects found in the vocabulary of the problem domain.” | Grady Booch, Object-Oriented Analysis and Design with Applications | — | [OOA의 canonical definition (ScienceDirect)](https://www.sciencedirect.com/topics/computer-science/object-oriented-software?utm_source=chatgpt.com "object oriented software - an overview") |
| [DEFINITION][OOD][ANCHOR] | Object-Oriented Design | “Object-oriented design is a method of design encompassing the process of object-oriented decomposition and a notation for depicting both logical and physical as well as static and dynamic models of the system under design.” | Grady Booch, Object-Oriented Analysis and Design with Applications | https://citeseerx.ist.psu.edu/document?doi=b3078a446b543e7aacb12db4e3ab5ef0338c2257&repid=rep1&type=pdf | OOD의 핵심을 object-oriented decomposition으로 고정. 전체 정의에는 logical/physical, static/dynamic model까지 이어짐. (CiteSeerX) |
| [DEFINITION][USE-CASE][ANCHOR] | Use Case | “description of a set of sequences of actions and variants that a system performs that yield an observable result of value to an actor.” | Ivar Jacobson et al., The Unified Software Development Process, 1999, p.41 | https://www.pmi.org/learning/library/use-cases-project-manager-know-8262 | Use Case의 일반적으로 통용되는 canonical definition (프로젝트 관리 협회) |
| [MODELING][QUOTE][ANCHOR] | Aggregation | “In spite of the few semantics attached to aggregation, everybody thinks it is necessary (for different reasons). Think of it as a modeling placebo.” | James Rumbaugh et al., The Unified Modeling Language Reference Manual | — | [UML 표기를 의미 자체로 착각하지 않는 modeling attitude (InformIT)](https://www.informit.com/articles/article.aspx?p=1398623\&seqNum=14\&utm_source=chatgpt.com "16.13 Composition Over Aggregation") |
| [DESIGN][QUOTE][ANCHOR] | Design Principles over UML | “The critical design tool for software development is a mind well educated in design principles. It is not UML or any other technology.” | Craig Larman, Applying UML and Patterns | https://en.wikipedia.org/wiki/GRASP_%28object-oriented_design%29 | 이 과정이 UML 과정이 아니라 설계 판단 과정임을 고정 (위키백과) |
| [RESPONSIBILITY][QUOTE][ANCHOR] | Responsibility-Driven Design | “We propose an alternative object-oriented design method which takes a responsibility-driven approach.” | Rebecca Wirfs-Brock, Brian Wilkerson, “Object-Oriented Design: A Responsibility-Driven Approach”, OOPSLA 1989 | — | Class보다 responsibility/collaboration을 먼저 보는 설계 관점 |
| [RESPONSIBILITY][DEFINITION][ANCHOR] | GRASP | “General Responsibility Assignment Software Patterns (or Principles)” | Craig Larman, Applying UML and Patterns | https://www.rose-hulman.edu/class/cs/csse374/Resources/larmanCovers.pdf | 개별 GRASP 항목이 아니라 object design과 responsibility assignment를 위한 원칙군으로 사용 (로즈-헐먼 기술대학) |
| [MODULARITY][QUOTE][ANCHOR] | Information Hiding | “Each module is then designed to hide such a decision from the others.” | D. L. Parnas, “On the Criteria To Be Used in Decomposing Systems into Modules”, CACM, 1972 | — | Encapsulation을 data hiding이 아니라 change-sensitive design decision hiding으로 확장 |
| [CONTRACT][QUOTE][ANCHOR] | Design by Contract | “their cooperation should be based on precise specifications — contracts — describing each party’s expectations and guarantees.” | Bertrand Meyer, Eiffel / Design by Contract | https://se.inf.ethz.ch/~meyer/ongoing/etl/nutshell.pdf | 객체 협력을 expectation/guarantee가 있는 계약으로 고정 (소프트웨어 공학 연구실) |
| [SOLID][QUOTE][ANCHOR] | Dependency orientation | “Depend upon Abstractions. Do not depend upon concretions.” | Robert C. Martin, “Design Principles and Design Patterns”, DIP | https://blog.thedojo.mx/assets/pdfs/DesignPrinciplesAndPatterns.pdf | SOLID를 단순 acronym 암기가 아니라 dependency/change 판단으로 연결 (The Dojo MX Blog) |
| [PATTERN][QUOTE][ANCHOR] | Interface / Composition | “Program to an interface, not an implementation.” / “Favor object composition over class inheritance.” | Gang of Four, Design Patterns | https://en.wikipedia.org/wiki/Design_Patterns | Pattern을 관통하는 두 개의 압축된 design principle (위키백과) |
| [EVOLUTION][DEFINITION][ANCHOR] | Refactoring | “a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior.” | Martin Fowler, “Definition Of Refactoring” | — | Refactoring을 generic cleanup과 구분 Agile에서도 engineering practice로 재사용. |
| [DOMAIN][DEFINITION][ANCHOR] | Domain | “A sphere of knowledge, influence, or activity.” | Eric Evans, Domain-Driven Design | https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf | Domain을 기술 구현이 아니라 SW가 다루는 문제·업무의 지식 영역으로 고정. S03의 용어집/Conceptual Domain Model과 DDD handoff를 연결 |
| [BOUNDARY][QUOTE][ANCHOR] | OO Design → DDD | “This book is not an introduction to object-oriented design. Nor does it propose radical design fundamentals.” | Eric Evans, Domain-Driven Design, Part II | https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf | DDD가 OOAD의 대체물이 아니라 기존 OO design 위에서 출발함을 고정 (Fabio Fumarola) |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][CORE] | Applying UML and Patterns | Craig Larman, Applying UML and Patterns | — | OOAD Curriculum의 핵심 backbone. Use Case→Domain Model→Interaction→Responsibility→GRASP→Design Model→Patterns를 풀어내는 주 reference |
| [SOLID][REFERENCE][CORE] | SOLID Principles | Robert C. Martin, “Design Principles and Design Patterns”; acronym lineage: Michael Feathers | — | SOLID 전체를 하나의 design-principle family로 다룸. SRP/OCP/LSP/ISP/DIP 상세는 Curriculum |
| [PATTERN][REFERENCE][CORE] | Design Patterns | Christopher Alexander → Gamma, Helm, Johnson, Vlissides, Design Patterns | — | Pattern의 의미와 사용법을 위한 foundational reference. 23개 목록 자체가 Anchor는 아님 |
