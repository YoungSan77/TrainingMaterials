# 도메인 주도 설계 개요와 실무 — Course Design

## Identity

- **Slug:** `ddd`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

복잡한 업무 규칙의 의미를 공통 언어·도메인 모델·불변식·명시적 경계로 보호하는 판단 능력을 만든다.

## Target Learner

객체 설계 경험은 있으나 업무 용어 충돌과 복잡한 규칙을 기술 구조로만 해결하려는 개발자·설계자

## Capability Gap

- 데이터 구조를 도메인 모델로 오해한다
- Entity·Value Object·Aggregate를 모양이나 annotation으로 구분한다
- Bounded Context를 서비스나 조직도와 동일시한다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- 핵심 도메인과 일반 지원 문제를 구분한다
- Ubiquitous Language로 용어와 모델을 함께 정제한다
- 정체성·값·불변식으로 model element를 결정한다
- 일관성 요구로 Aggregate 경계를 정하고 context 간 관계를 명시한다

## Course Thesis

> DDD는 pattern 모음이 아니라 복잡한 도메인 의미를 모델과 언어에 담고, 그 의미가 유효한 경계를 의식적으로 선택하는 접근이다.

## Core Learning Scope

- domain/subdomain과 복잡성 판단
- Ubiquitous Language와 knowledge crunching
- Entity·Value Object·Domain Service·Repository·Domain Event의 판단 기준
- invariant와 Aggregate consistency boundary
- Bounded Context와 context relationship
- model evolution과 strategic/tactical 연결

## Ownership

- **Owns:** 도메인 언어·모델·불변식·aggregate·bounded context

### Non-scope

- 일반 객체 책임 설계 재교육
- Bounded Context를 microservice로 자동 변환
- 전체 architecture style 선택
- event platform·distributed transaction 구현
- DDD pattern 전수

### Cross-course Boundary / Handoff

- 객체 책임과 계약은 OOAD에서 받는다
- quality attribute와 architecture option은 SW Architecture로 넘긴다
- 서비스 배포·데이터 분산 결정은 MSA로 넘긴다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 이 문제가 DDD 비용을 지불할 만큼 도메인 복잡성이 높은가
- 어떤 용어와 모델이 업무 의미를 가장 정확히 보호하는가
- 어떤 규칙이 즉시 일관되어야 하며 Aggregate 경계는 어디인가
- 같은 단어의 다른 의미를 어떤 Context로 분리할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 업무 언어의 충돌과 핵심 복잡성을 찾는다
2. 용어와 모델을 함께 정제한다
3. model element와 불변식을 판정한다
4. Aggregate로 일관성 경계를 정한다
5. Bounded Context와 관계를 설계하고 MSA와의 경계를 확인한다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| 언어 정제 | 모호한 요구에서 채택할 용어와 질문을 판단 | 용어집·모델 후보·미해결 질문 | 용어만 정리하고 규칙·행위가 모델에 반영되지 않는 경우 |
| Order 불변식과 Aggregate | 즉시 함께 보호할 규칙과 경계를 판단 | 불변식 목록·Aggregate 경계·transaction 이유 | 화면·테이블 기준으로 Aggregate를 만드는 경우 |
| Context 경계 | 동일 용어의 의미 충돌과 통합 관계를 판단 | Context map과 번역 책임 | 조직도나 microservice 개수를 그대로 Context로 쓰는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [FOUNDATION][QUOTE][ANCHOR] | Essence vs. Accident | “Following Aristotle, I divide them into essence—the difficulties inherent in the nature of the software—and accidents—those difficulties that today attend its production but that are not inherent.” | Frederick P. Brooks Jr., No Silver Bullet — Essence and Accident in Software Engineering | https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf | 기술적 수단(accidental)과 SW가 표현해야 할 본질적 어려움(essential)을 구분 (Worrydream) |
| [FOUNDATION][QUOTE][ANCHOR] | The Hard Part is Conceptual | “I believe the hard part of building software to be the specification, design, and testing of this conceptual construct, not the labor of representing it and testing the fidelity of the representation.” | Frederick P. Brooks Jr., No Silver Bullet | https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf | DDD가 도구보다 conceptual model/problem에 집중해야 하는 근거 (Worrydream) |
| [FOUNDATION][QUOTE][ANCHOR] | The Heart of Software | “The heart of software is its ability to solve domain-related problems for its user. All other features, vital though they may be, support this basic purpose.” | Eric Evans, Domain-Driven Design | https://studylib.net/doc/27486792/domain-driven-desing | DDD의 존재 이유 자체를 압축 (studylib.net) |
| [DEFINITION][MODEL][ANCHOR] | Model | “A system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain.” | Eric Evans, Domain-Driven Design Reference, Definitions | https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf | DDD에서 말하는 Model 자체를 canonical definition으로 고정 (Domain Language) |
| [DEFINITION][UL][ANCHOR] | Ubiquitous Language | “A language structured around the domain model and used by all team members within a bounded context to connect all the activities of the team with the software.” | Eric Evans, Domain-Driven Design Reference, Definitions | https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf | 핵심은 UL이 domain model을 중심으로 구조화된 언어라는 것. 단순 공통용어집이 아님 (Domain Language) |
| [DEFINITION][BOUNDED-CONTEXT][ANCHOR] | Bounded Context | “A description of a boundary (typically a subsystem, or the work of a particular team) within which a particular model is defined and applicable.” | Eric Evans, Domain-Driven Design Reference, Definitions | https://www.domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf | Bounded Context를 service/deployment boundary가 아니라 model applicability boundary로 고정 (Domain Language) |
| [BOUNDARY][QUOTE][ANCHOR] | DDD builds on OO Design | “This book is not an introduction to object-oriented design. Nor does it propose radical design fundamentals.” | Eric Evans, Domain-Driven Design, Part II | https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf | OOAD → DDD 관계 고정 (Fabio Fumarola) |
| [EXPERT][COMMENT][ANCHOR] | DDD centers on a Domain Model | “Domain-Driven Design is an approach to software development that centers the development on programming a domain model” | Martin Fowler, “Domain Driven Design” | — | DDD를 tactical pattern collection으로 축소하는 것을 방지 |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][CORE] | Domain-Driven Design | Eric Evans, Domain-Driven Design: Tackling Complexity in the Heart of Software, 2003 | — | DDD 전체 Curriculum의 primary reference |
| [BOOK][REFERENCE] | Implementing Domain-Driven Design | Vaughn Vernon, Implementing Domain-Driven Design, 2013 | — | Evans의 전략·전술 개념을 실제 구현 판단으로 풀 때 참고 |
| [BOOK][REFERENCE] | Introducing EventStorming | Alberto Brandolini, Introducing EventStorming: An Act of Deliberate Collective Learning | — | collaborative domain discovery를 Curriculum에서 다룰 때 참고 |
