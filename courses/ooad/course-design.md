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
- 정적·동적 모델과 코드 evidence로 설계를 검토·개선한다

## Course Thesis

> OOAD는 현실의 명사를 클래스로 옮기는 작업이 아니라, 문제영역의 본질적 복잡성을 구현 결정과 구분해 이해하고, 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 판단 과정이다.

Analysis와 Design은 고정된 lifecycle phase를 뜻하지 않는다.

> **Process에서는 통합할 수 있지만, 사고에서는 Problem과 Solution을 구분한다.**

Brooks의 Essence / Accident 관점에서 Analysis는 problem-domain의 essential conceptual complexity를 명시적으로 이해하고, accidental 또는 premature solution detail이 Problem Understanding을 대신하거나 조기에 왜곡·제약하지 않도록 구분한다. 기술·운영·법적 제약처럼 문제 정의에 정당하게 영향을 주는 constraint까지 배제한다는 뜻은 아니다.

## Core Learning Scope

- 요구와 black-box scenario에서 Problem Understanding을 정제하고 설계 질문 추출
- Analysis activity/concern과 lifecycle phase의 구분
- Brooks Essence / Accident를 이용한 essential problem과 premature solution detail의 구분
- 객체 = 상태·행위·책임·메시지
- 분석 모델과 설계 모델의 구분
- 정적·동적 모델을 동일한 Problem Understanding의 상호보완적 관점으로 사용
- 책임 할당, information expert, cohesion/coupling, information hiding
- 협력·sequence·state를 위한 just-enough modeling
- precondition·postcondition·invariant와 객체 계약
- composition/interface/dependency 원칙의 압력 기반 적용
- test와 refactoring evidence를 통한 설계 feedback

책임 할당 판단(정보 전문가·응집도·결합도·정보 은닉)을 먼저 정착시킨 뒤, 계약·변화 대응 원칙(precondition/postcondition/invariant, composition/interface/dependency)으로 이어간다. 어떤 순서로든 principle/pattern은 checklist가 아니라 현재 설계 문제에 필요한 것만 선택하고 trade-off를 설명하는 heuristic으로 사용한다. 개별 GRASP/Pattern 항목의 적용 절차는 Curriculum·Session Detailed Design이 결정한다.

## Ownership

- **Owns:** 객체 책임·협력·계약과 분석→객체 설계 전환

### Non-scope

- DDD strategic/tactical pattern을 완결적으로 가르치기
- architecture style·quality-attribute trade-off
- MSA 서비스 분할
- 특정 언어·framework 숙련
- pattern catalog 암기

### Cross-course Boundary / Handoff

- OOAD에서 Domain은 SW가 해결하려는 문제와 업무의 세계로 사용하고, Conceptual/Analysis Domain Model을 통해 필요한 의미 구조를 다룬다. Domain Model의 지속적 정제, Ubiquitous Language, Aggregate·Bounded Context 등 DDD 전문 판단은 DDD로 넘긴다
- MDD/MDA는 OOAD와 무관한 별도 흐름으로 다루지 않는다. OOAD의 Analysis Model → Design Model → Implementation이라는 모델 기반 흐름이 이후 더 체계화·정형화·표준화된 관계만 필요한 맥락에서 연결하고, MDD/MDA 자체의 상세 기법은 이 과정의 필수 scope로 확장하지 않는다
- 구조적 품질 선택과 architecture evaluation은 SW Architecture로 넘긴다
- 분산 경계와 운영 실패는 MSA로 넘긴다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 어떤 규칙과 상태를 어느 객체가 소유해야 하는가
- 현재 질문에 어떤 모델이 필요한가
- 책임 이동이 coupling과 change impact를 실제로 줄이는가
- 추상화·pattern·refactoring 비용을 지금 지불할 근거가 있는가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 문제 오해와 절차적 변경 파급을 관찰하고, Analysis를 phase가 아니라 Problem/Solution을 구분하는 사고 활동으로 정립한다
2. 요구·scenario·Operation Contract에서 essential problem과 required domain change를 구현 detail과 구분한다
3. 정적 모델로 Domain의 concept·attribute·relationship을 명시하여 Problem Understanding의 구조 관점을 만든다
4. 동적 모델로 interaction·state change를 확인하여 같은 Problem Understanding의 행위 관점을 보완한다
5. 분석 모델을 구현 Class로 기계 변환하지 않고, 학습자 자신의 기존 경험으로 먼저 객체 경계·책임·메시지 관점의 initial design(before model)을 만든다
6. 그 initial design을 계약·응집도·결합도 같은 공학적 판단 기준으로 다시 검토해 책임 배치를 정제한다(refined design)
7. 코드와 test evidence로 설계를 개선하고 DDD/Architecture 경계를 확인한다

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## Running Example Strategy

Curriculum은 하나의 공통 progression을 기본 예로 사용해 Requirement → Static Problem Understanding → Dynamic Problem Understanding → Initial Design → Refined Design을 관통한다. Shipment는 이 기본 흐름의 필수 concept으로 강제하지 않는다. Order Cancellation/Refund는 기본 설계가 끝난 뒤 투입하는 variation/change request로 사용하며, 기본 설계 자체의 대상으로 앞당기지 않는다. 구체적인 시나리오 명칭과 실습 산출물은 Session Architecture/Detailed Design이 정한다.

## Change as Learning Device

핵심 실습은 먼저 정상 요구로 책임과 협력 구조를 설계하게 한 뒤, 후속 학습에서 새로운 change request를 투입해 그 설계가 어디서 흔들리는지 관찰하고 책임·계약·variation 대응을 보완하게 한다. Order Cancellation/Refund는 이 change request의 대표 사례이며 기본 설계의 대상이 아니다. 이 원칙은 이후 change impact·design evaluation·refactoring 학습으로 이어지는 교육적 장치다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Order 책임 재배치 | 정상 흐름(주문→결제)에서 분산되기 쉬운 책임을 어떤 객체 책임과 계약으로 옮길지 판단 | 책임표·계약·협력 sketch | 클래스 이름만 늘거나 규칙 owner가 여전히 여러 곳인 경우 |
| Just-enough 모델 선택 | 변경 질문에 필요한 정적·동적 모델을 선택 | 선택한 모델과 제외 이유 | 모든 UML을 만들거나 표기 자체가 목적이 되는 경우 |
| 설계 feedback | Order Cancellation/Refund 같은 change request와 test failure에서 최소 책임 이동/refactoring 결정 | before/after 책임과 근거 | SOLID·pattern 이름만으로 변경을 정당화하는 경우 |

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
