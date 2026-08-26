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
- 데이터와 행위를 분리해 규칙이 여러 service와 호출부에 흩어진다
- UML 표기나 원칙 이름을 설계 판단보다 앞세운다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- 분석 문제와 구현 결정을 구분한다
- 상태와 행위를 소유할 객체 경계를 찾는다
- 책임·협력·계약을 통해 변경 영향을 국소화한다
- 정적·동적 모델과 코드 evidence로 설계를 검토·개선한다

## Course Thesis

> OOAD는 현실의 명사를 클래스로 옮기는 작업이 아니라, 변화하는 행위를 책임 있는 객체와 협력으로 조직하는 판단 과정이다.

## Core Learning Scope

- 요구와 black-box scenario에서 설계 질문 추출
- 객체 = 상태·행위·책임·메시지
- 분석 모델과 설계 모델의 구분
- 책임 할당, information expert, cohesion/coupling, information hiding
- 협력·sequence·state를 위한 just-enough modeling
- precondition·postcondition·invariant와 객체 계약
- composition/interface/dependency 원칙의 압력 기반 적용
- test와 refactoring evidence를 통한 설계 feedback

## Ownership

- **Owns:** 객체 책임·협력·계약과 분석→객체 설계 전환

### Non-scope

- DDD strategic/tactical pattern을 완결적으로 가르치기
- architecture style·quality-attribute trade-off
- MSA 서비스 분할
- 특정 언어·framework 숙련
- pattern catalog 암기

### Cross-course Boundary / Handoff

- 도메인 의미·aggregate·bounded context는 DDD로 넘긴다
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

1. 절차적 변경 파급을 관찰한다
2. 객체·책임·메시지 관점으로 전환한다
3. 정적 모델로 개념과 관계를 제한한다
4. 동적 모델로 협력과 상태 전이를 확인한다
5. 계약·응집도·결합도로 책임 배치를 검토한다
6. 코드와 test evidence로 설계를 개선하고 DDD/Architecture 경계를 확인한다

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Order 책임 재배치 | 분산된 취소 규칙을 어떤 객체 책임과 계약으로 옮길지 판단 | 책임표·계약·협력 sketch | 클래스 이름만 늘거나 규칙 owner가 여전히 여러 곳인 경우 |
| Just-enough 모델 선택 | 변경 질문에 필요한 정적·동적 모델을 선택 | 선택한 모델과 제외 이유 | 모든 UML을 만들거나 표기 자체가 목적이 되는 경우 |
| 설계 feedback | test failure와 변경 요청에서 최소 책임 이동/refactoring 결정 | before/after 책임과 근거 | SOLID·pattern 이름만으로 변경을 정당화하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [FOUNDATION][QUOTE][ANCHOR] | Object-Oriented Programming | “OOP to me means only messaging, local retention and protection and hiding of state-process, and extreme late-binding of all things.” | Alan Kay, “Clarification of object-oriented”, 2003 | https://www.accu.org/content/conf2011/Kevlin-Henney-Will-the-Real-OO-Please-Stand-Up.pdf | OOP의 출발점을 message·local state·late binding으로 고정 (ACCU) |
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
| [BOUNDARY][QUOTE][ANCHOR] | OO Design → DDD | “This book is not an introduction to object-oriented design. Nor does it propose radical design fundamentals.” | Eric Evans, Domain-Driven Design, Part II | https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf | DDD가 OOAD의 대체물이 아니라 기존 OO design 위에서 출발함을 고정 (Fabio Fumarola) |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][CORE] | Applying UML and Patterns | Craig Larman, Applying UML and Patterns | — | OOAD Curriculum의 핵심 backbone. Use Case→Domain Model→Interaction→Responsibility→GRASP→Design Model→Patterns를 풀어내는 주 reference |
| [SOLID][REFERENCE][CORE] | SOLID Principles | Robert C. Martin, “Design Principles and Design Patterns”; acronym lineage: Michael Feathers | — | SOLID 전체를 하나의 design-principle family로 다룸. SRP/OCP/LSP/ISP/DIP 상세는 Curriculum |
| [PATTERN][REFERENCE][CORE] | Design Patterns | Christopher Alexander → Gamma, Helm, Johnson, Vlissides, Design Patterns | — | Pattern의 의미와 사용법을 위한 foundational reference. 23개 목록 자체가 Anchor는 아님 |
