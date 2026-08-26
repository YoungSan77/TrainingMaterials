# 애자일 개발 도입 실무 — Scrum 기반 단계적 적용 — Course Design

## Identity

- **Slug:** `agile`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

불확실성과 feedback 문제를 진단하고, 작은 working increment와 empiricism을 중심으로 Scrum을 맥락에 맞게 도입·개선하게 한다.

## Target Learner

Scrum event를 운영하거나 도입을 검토하지만 ceremony 준수와 adaptive delivery를 구분하기 어려운 team lead·product/development practitioner

## Capability Gap

- Agile을 빠른 개발이나 일정 압축으로 오해한다
- Scrum 역할·event를 설치하면 agility가 생긴다고 본다
- 작업을 horizontal task로 쪼개고 working increment evidence가 없다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- 문제의 불확실성·feedback·engineering·governance 원인을 구분한다
- value hypothesis를 작은 working increment로 나눈다
- Scrum의 transparency·inspection·adaptation mechanism을 설계한다
- pilot evidence로 적용을 확대·수정·중단한다

## Course Thesis

> Agile은 변화에 무조건 반응하는 태도가 아니라 작은 working increment와 빠른 feedback으로 불확실한 결정을 수정하는 delivery capability다.

## Core Learning Scope

- uncertainty와 feedback 진단
- iterative/incremental/adaptive 구분
- value slicing과 working increment
- empiricism과 feedback loop
- Scrum accountabilities/events/artifacts의 목적
- Definition of Done과 transparency
- pilot·adoption·improvement evidence

## Ownership

- **Owns:** adaptive delivery·empiricism·working increment·Scrum adoption

### Non-scope

- CI/CD와 test automation 설계
- project governance 전수
- product discovery 전체
- 조직 transformation 전체
- Scrum certification 대비

### Cross-course Boundary / Handoff

- engineering discipline은 OOAD/SWA/SWQM/DevOps에서 받는다
- delivery automation은 DevOps로 넘긴다
- project-level governance는 PM, enterprise transformation은 DT→AX로 넘긴다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 현재 문제는 Agile이 해결할 uncertainty/feedback 문제인가
- 어떤 vertical increment가 가치와 학습 evidence를 만드는가
- Scrum mechanism이 어떤 투명성·검사·적응을 회복해야 하는가
- 어떤 evidence로 pilot을 확대·수정·중단할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 도입 목적과 failure를 진단한다
2. iterative/incremental/adaptive를 구분한다
3. value를 working increment로 분할한다
4. Scrum mechanism을 목적 중심으로 구성한다
5. pilot과 evidence로 adoption을 개선한다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Agile fit diagnosis | 현재 문제와 Agile non-solution을 판단 | diagnosis map과 adoption hypothesis | ceremony 부재만 원인으로 보는 경우 |
| Vertical slice | 큰 요구를 가치·feedback 가능한 increment로 분할 | slice set과 acceptance evidence | 계층별 task만 나누는 경우 |
| Scrum repair/pilot | 무력화된 mechanism과 최소 pilot을 판단 | repair plan·success/stop evidence | Scrum Guide 준수 자체를 outcome으로 두는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [FOUNDATION][MANIFESTO][ANCHOR] | Agile Manifesto — 4 Values | “We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value: Individuals and interactions over processes and tools; Working software over comprehensive documentation; Customer collaboration over contract negotiation; Responding to change over following a plan. That is, while there is value in the items on the right, we value the items on the left more.” | Kent Beck et al., Manifesto for Agile Software Development, 2001 | — | Agile의 가치 판단 기준 전체를 고정 |
| [PRINCIPLE][01][ANCHOR] | Customer Satisfaction / Valuable Software | “Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.” | Principles behind the Agile Manifesto, Principle 1 | — | Agile의 최우선 목적은 activity가 아니라 customer value |
| [PRINCIPLE][02][ANCHOR] | Welcome Change | “Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage.” | Principle 2 | — | 변화 대응을 실패가 아니라 경쟁력으로 봄 |
| [PRINCIPLE][03][ANCHOR] | Frequent Delivery | “Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.” | Principle 3 | — | 작은 delivery/feedback cycle의 근거 |
| [PRINCIPLE][04][ANCHOR] | Business–Developer Collaboration | “Business people and developers must work together daily throughout the project.” | Principle 4 | — | 사일로·handoff가 아니라 지속적인 collaboration을 요구 |
| [PRINCIPLE][05][ANCHOR] | Motivated Individuals / Trust | “Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.” | Principle 5 | — | 자율성은 방임이 아니라 environment + support + trust 위에서 작동 |
| [PRINCIPLE][06][ANCHOR] | Communication | “The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.” | Principle 6 | — | Agile의 interaction 중심 사고를 고정. 특정 물리적 근무형태의 절대 규칙으로 확대하지 않음 |
| [PRINCIPLE][07][ANCHOR] | Working Software | “Working software is the primary measure of progress.” | Principle 7 | — | 문서량·task completion보다 검증 가능한 working software를 진척 기준으로 둠 |
| [PRINCIPLE][08][ANCHOR] | Sustainable Development | “Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.” | Principle 8 | — | Agile을 crunch나 단기 속도 경쟁과 구분 |
| [PRINCIPLE][09][ANCHOR] | Technical Excellence / Good Design | “Continuous attention to technical excellence and good design enhances agility.” | Principle 9 | — | 좋은 engineering이 agility의 장애물이 아니라 기반임을 고정 |
| [PRINCIPLE][10][ANCHOR] | Simplicity | “Simplicity—the art of maximizing the amount of work not done—is essential.” | Principle 10 | — | 더 많이 하는 것보다 불필요한 일을 제거하는 판단 기준 |
| [PRINCIPLE][11][ANCHOR] | Self-Organizing Teams | “The best architectures, requirements, and designs emerge from self-organizing teams.” | Principle 11 | — | architecture/design까지 team autonomy와 learning의 산물이라는 원칙 |
| [PRINCIPLE][12][ANCHOR] | Reflect and Adjust | “At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.” | Principle 12 | — | Agile을 feedback → learning → adaptation의 지속적 cycle로 고정 |
| [EMPIRICISM][QUOTE][ANCHOR] | Transparency → Inspection → Adaptation | “Transparency enables inspection. Inspection without transparency is misleading and wasteful. Inspection enables adaptation. Inspection without adaptation is considered pointless.” | Ken Schwaber, Jeff Sutherland, The Scrum Guide, 2020 | — | Scrum의 Event/Artifact보다 underlying empirical feedback mechanism을 고정 |
| [SCRUM][DEFINITION][ANCHOR] | Scrum | “Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems.” | Ken Schwaber, Jeff Sutherland, The Scrum Guide, 2020 | — | [Scrum을 Sprint/Event 집합이 아니라 complex problem에 adaptive solution을 통해 value를 만드는 lightweight framework로 정의. 현재 공식 정의. (Scrum Guides)](https://scrumguides.org/scrum-guide.html?from=hub\&utm_source=chatgpt.com "Scrum Guide") |
| [SCRUM][BOUNDARY][ANCHOR] | Scrum is Purposefully Incomplete | “The Scrum framework is purposefully incomplete, only defining the parts required to implement Scrum theory.” | Ken Schwaber, Jeff Sutherland, The Scrum Guide, 2020 | — | [Scrum이 TDD·CI·Refactoring 같은 engineering practice까지 제공한다고 오해하는 것을 차단. Scrum과 Agile engineering의 경계를 잡는 데 특히 중요. (Scrum Guides)](https://scrumguides.org/scrum-guide.html?from=hub\&utm_source=chatgpt.com "Scrum Guide") |
| [TDD][DEFINITION][ANCHOR] | Test-Driven Development | “Test-Driven Development (TDD) is a technique for building software that guides software development by writing tests.” | Martin Fowler, “Test Driven Development”, 2023; Kent Beck lineage | https://martinfowler.com/bliki/TestDrivenDevelopment.html | TDD를 단순 unit testing이나 test-first slogan이 아니라 tests가 development를 guide하는 technique으로 고정. (martinfowler.com) |
| [TDD][PRACTICE][ANCHOR] | Red → Green → Refactor | “Write a test for the next bit of functionality you want to add. Write the functional code until the test passes. Refactor both new and old code to make it well structured.” | Martin Fowler, “Test Driven Development”; Kent Beck lineage | https://martinfowler.com/bliki/TestDrivenDevelopment.html | TDD의 반복 구조를 Test → Working Code → Design Improvement로 완결해서 보여줌. Refactoring이 TDD의 부가 작업이 아니라 cycle 자체의 일부임을 명확히 함. (martinfowler.com) |
| [REFACTORING][DEFINITION][ANCHOR] | Refactoring | “a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior.” | Martin Fowler, Refactoring / “Definition Of Refactoring” | https://martinfowler.com/bliki/DefinitionOfRefactoring.html | Refactoring을 rewrite·cleanup·기능변경과 구분하는 canonical definition. (martinfowler.com) OOAD의 Refactoring 정의를 Agile engineering context에서 재사용. |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][BACKBONE] | Clean Agile: Back to Basics | Robert C. Martin, Clean Agile: Back to Basics, 2019 | — | 과정의 핵심 해석 backbone. Agile을 ceremony/framework가 아니라 feedback, engineering discipline, professionalism의 관점에서 해석 |
| [BOOK][REFERENCE][FOUNDATION] | Extreme Programming Explained | Kent Beck, Extreme Programming Explained | — | Feedback, simplicity, communication, courage와 XP engineering practice의 원류 |
| [FRAMEWORK][REFERENCE] | Scrum Guide | Ken Schwaber, Jeff Sutherland, The Scrum Guide, 2020 | — | Scrum은 Agile 전체가 아니라 대표적인 empirical framework로 사용 |
| [BOOK][REFERENCE][CORE] | Test-Driven Development: By Example | Kent Beck, Test-Driven Development: By Example, 2002 | — | TDD의 primary foundational reference. Clean Agile과 XP에서 다루는 engineering discipline을 구체화 |
| [BOOK][REFERENCE][CORE] | Refactoring | Martin Fowler, Refactoring: Improving the Design of Existing Code | — | 지속적인 design improvement, code smells, small safe changes를 다룰 핵심 reference |
