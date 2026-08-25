# OOAD Verified Principles & Sources Pack v2.0

> **Purpose:** OOAD 교재에서 원칙·역사적 인용을 안전하게 재사용하기 위한 검증 자산.
> **Rule:** `Verification Status = Verified/Traceable`이고 quote locator가 확인된 항목만 slide verbatim quote로 사용한다.
> **Copyright:** 각 원출처에서 짧은 문장만 사용하며 긴 본문을 복제하지 않는다.
> **Display:** Korean translation 14pt Bold 권장 / English 8–9pt / Author + Source 8pt.
> **Important:** paraphrase는 따옴표를 사용하지 않는다.


## Portfolio Evidence Classification

| Source/Claim Family | Evidence Role | Source Provenance | Evidence Strength | Transferability | Curriculum Use | BP Classification |
|---|---|---|---|---|---|---|
| Alan Kay / messaging lineage | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Wirfs-Brock / RDD | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Meyer / DbC, CQS | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| Larman / GRASP | Established Practice-Pattern | Original/Authoritative Secondary | Strong | Broad | Core | Not classified |
| Parnas / Information Hiding | Foundational/Core | Original-Foundational Author | Strong | Broad | Core | Not classified |
| GoF / design principles & patterns | Established Practice-Pattern | Original-Foundational Authors | Strong | Broad | Core | Not classified |
| Fowler / Refactoring | Established Practice-Pattern | Original-Foundational Author | Strong | Broad | Supporting | Not classified |
| Evans / DDD boundary clarification | Foundational/Core | Original-Foundational Author | Moderate | Conditional | Supporting | Not classified |

## Verification Status

- **Verified:** 원저자/공식 출판/직접 확인 가능한 본문 수준에서 claim 또는 quote를 검증했다.
- **Traceable:** 신뢰 가능한 출판 excerpt와 locator가 있으나 최종 출판본 교차 확인이 유익하다.
- **Hold:** attribution 또는 locator가 불충분하다. 강의 quote/claim 근거로 사용하지 않는다.

---

## Q01 — Alan Kay / Messaging

**Verification Status:** Verified  
**Principle:** Object = Message + Local State Protection + Late Binding  
**Recommended:** S01, S06, S11

**KO**
> 객체지향의 핵심은 메시징, 상태·프로세스의 지역적 보존과 보호, 그리고 극단적인 지연 바인딩에 있다.

**EN**
> “OOP to me means only messaging ... and extreme late-binding of all things.”

**Author:** Alan Kay  
**Source:** Email to Stefan Ram, 23 July 2003, “Clarification of object-oriented”  
**Locator:** email body  
**Source URL:** https://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_de

**Usage note:** `inheritance/polymorphism/encapsulation = OOP definition`으로 단순화하는 데 대한 counter-anchor로 사용.
번역은 educational paraphrase이며 영문 축자문과 구분한다.

---

## Q02 — Rebecca Wirfs-Brock / Responsibility-Driven Design

**Verification Status:** Verified  
**Principle:** Responsibility before implementation  
**Recommended:** S11, S12

**KO**
> 구현을 너무 일찍 바라보는 데이터 중심 설계 대신 책임 중심 설계로 캡슐화를 강화한다.

**EN**
> “We propose an alternative object-oriented design method which takes a responsibility-driven approach.”

**Authors:** Rebecca Wirfs-Brock, Brian Wilkerson  
**Source:** “Object-Oriented Design: A Responsibility-Driven Approach,” OOPSLA 1989  
**Locator:** Abstract  
**Source URL:** https://wirfs-brock.com/rebecca/papers/

**Usage note:** RDD를 단순 class-finding technique이 아니라 encapsulation을 높이는 design approach로 정박.

---

## Q03 — Bertrand Meyer / Design by Contract

**Verification Status:** Verified  
**Principle:** Responsibilities need explicit expectations and guarantees  
**Recommended:** S11, S12

**KO**
> 협력은 각 당사자의 기대와 보장을 명확히 기술한 계약에 기반해야 한다.

**EN**
> “their cooperation should be based on precise specifications — contracts — describing each party's expectations and guarantees.”

**Author:** Bertrand Meyer / Eiffel method  
**Source:** Eiffel Documentation, “Design by Contract™, Assertions and Exceptions”  
**Locator:** Design by Contract basics  
**Source URL:** https://www.eiffel.org/doc/eiffel/ET-_Design_by_Contract_%28tm%29%2C_Assertions_and_Exceptions

**Usage note:** Precondition / Postcondition / Class Invariant 설명 직전의 anchor.

---

## Q04 — Craig Larman / Information Expert

**Verification Status:** Traceable  
**Principle:** Assign responsibility to the information expert  
**Recommended:** S11, S12

**KO**
> 책임 수행에 필요한 정보를 가진 객체를 우선 책임 후보로 둔다.

**EN**
> “Assign a responsibility to the information expert—the class that has the information necessary to fulfill the responsibility.”

**Author:** Craig Larman  
**Source:** *Applying UML and Patterns*, 2nd ed., §16.6 “Information Expert (or Expert)”  
**Locator:** Chapter 16, §16.6  
**Source URL:** https://www.oreilly.com/library/view/applying-uml-and/0130925691/0130925691_ch16lev1sec7.html

**Usage note:** Expert는 단독 법칙이 아니다. Low Coupling / High Cohesion / variation과 함께 판단.

---

## Q05 — David Parnas / Information Hiding

**Verification Status:** Traceable  
**Principle:** Hide likely-to-change design decisions  
**Recommended:** S08

**KO**
> 모듈은 변경될 가능성이 있거나 어려운 설계 결정을 다른 부분으로부터 감추도록 나눈다.

**EN**
> “Each module is then designed to hide such a decision from the others.”

**Author:** D. L. Parnas  
**Source:** “On the Criteria To Be Used in Decomposing Systems into Modules,” CACM 15(12), 1972  
**Locator:** concluding design criterion; pp. 1053–1058  
**DOI:** 10.1145/361598.361623  
**Source record:** https://doi.org/10.1145/361598.361623

**Usage note:** `module = function/procedure grouping`이 아니라 change-sensitive decision hiding으로 연결.

---

## Q06 — Gang of Four / Interface

**Verification Status:** Traceable  
**Principle:** Program to an interface  
**Recommended:** S08 or S11

**KO**
> 구체 구현이 아니라 필요한 인터페이스에 의존하라.

**EN**
> “Program to an interface, not an implementation.”

**Authors:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides  
**Source:** *Design Patterns: Elements of Reusable Object-Oriented Software*  
**Locator:** Introduction, p. 18 (1995 printing)  
**Verification note:** page locator independently corroborated by multiple book references; use owned copy for final publishing proof if available.

**Usage note:** Java `interface` keyword로 축소하지 않는다. 계약/abstraction에 의존한다는 설계 원칙으로 설명.

---

## Q07 — Gang of Four / Composition

**Verification Status:** Traceable  
**Principle:** Favor composition over inheritance  
**Recommended:** S08 or S11

**KO**
> 클래스 상속보다 객체 합성을 우선 검토하라.

**EN**
> “Favor object composition over class inheritance.”

**Authors:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides  
**Source:** *Design Patterns: Elements of Reusable Object-Oriented Software*  
**Locator:** Introduction, p. 20  
**Verification source:** Erich Gamma interview and book reproductions confirm wording.

**Usage note:** `inheritance 금지`로 가르치지 않는다. 변경 가능 협력과 결합 비용의 trade-off로 설명.

---

## Q08 — Martin Fowler / Refactoring

**Verification Status:** Verified  
**Principle:** Improve internal structure without observable behavior change  
**Recommended:** S13

**KO**
> 외부에서 관찰되는 동작을 바꾸지 않고 내부 구조를 더 이해하기 쉽고 변경하기 쉽게 만든다.

**EN**
> “a change made to the internal structure of software ... without changing its observable behavior.”

**Author:** Martin Fowler  
**Source:** “Definition Of Refactoring,” martinfowler.com, 1 Sep 2004  
**Locator:** noun definition  
**Source URL:** https://martinfowler.com/bliki/DefinitionOfRefactoring.html

**Usage note:** Refactoring = cleanup 일반이 아니라 behavior-preserving structural change라는 경계에 사용.

---

## Q09 — Eric Evans / DDD is not replacement OO design

**Verification Status:** Traceable  
**Principle:** DDD builds on established OO design  
**Recommended:** S14 forward / DDD opening

**KO**
> DDD는 객체지향 설계 입문이나 새로운 설계 기초의 제안이 아니라 기존 OO 설계 위에서 초점을 이동한다.

**EN**
> “This book is not an introduction to object-oriented design. Nor does it propose radical design fundamentals.”

**Author:** Eric Evans  
**Source:** *Domain-Driven Design*, final manuscript, 15 Apr 2003  
**Locator:** Part II opening, manuscript p. 49  
**Reference evidence:** manuscript text also states reliance on Responsibility-Driven Design, Design by Contract, and Larman's OO design practices.

**Usage note:** OOAD → DDD lineage를 설명할 때 사용. DDD를 OOAD 대체물처럼 표현하지 않는다.

---

# HOLD / Do Not Use Yet

## H01 — Grady Booch exact definition
Booch의 OOA/OOD 정의와 static/dynamic model 문구는 다수의 2차 출처에서 page locator까지
일치하지만, 현재 검증 세션에서는 원저작의 공식/소유 원문을 직접 확인하지 못했다.

**Action:** 소유한 *Object-Oriented Analysis and Design with Applications*에서 문구/page를 확인한 뒤 APPROVED로 승격.
그 전까지는 Booch의 이름을 `lineage / educational paraphrase`에 사용할 수 있으나 축자 인용 slide에는 사용하지 않는다.

## H02 — Tell, Don't Ask attribution
특정 한 명의 축자 quote로 고정하지 않는다.
OO design heuristic으로 사용한다.

## H03 — Law of Demeter = “one dot per line”
사용 금지.
Law of Demeter의 정의가 아니라 후대의 heuristic과 혼동될 수 있다.

---

# Principle-to-Session Map

| Session | Primary Anchor |
|---|---|
| S01 | Alan Kay — Messaging / local state / late binding |
| S04 | Booch lineage — model/static/dynamic, quote HOLD until primary verification |
| S08 | Parnas — Information Hiding; GoF — Composition / Interface |
| S10 | DIP — principle, verbatim quote asset은 별도 primary verification 후 추가 |
| S11 | Wirfs-Brock — RDD; Larman — Information Expert; Meyer — DbC |
| S12 | Larman + Meyer applied in Order responsibility/contract workshop |
| S13 | Fowler — Refactoring |
| S14 | Evans — DDD builds on OO design |

# Production Rules

1. 세션당 quote 수를 강제하지 않는다.
2. 같은 quote를 여러 세션에서 장식적으로 반복하지 않는다.
3. `Problem → Principle → Decision → Example → Trade-off → Failure`의 판단 지점에서만 사용한다.
4. 한글은 교육용 번역이며, 축자 원문은 영어 필드가 소유한다.
5. 번역을 따옴표로 표시할 경우 반드시 원문과 함께 제공한다.
6. `Traceable` 항목도 출판 직전 owned primary copy가 있으면 최종 교차 확인한다.
7. 출처·locator가 renderer에 표시되지 않아도 source asset에는 반드시 보존한다.


---
## Unified Portfolio Alignment v2.6
- 현재 개발 완료 과정: OOAD / DDD / SW Architecture / MSA / AI-Native / Modern SWQM / Agile / DevOps / SW Project Management / SW Proposal / DT→AX.
- 현재 기준 시간: 16 / 8 / 16 / 8 / 16 / 8 / 8 / 8 / 16 / 8 / 8h.
- 현재 Candidate 없음. 신규 과정은 Course Admission Gate를 통과한 뒤 추가한다.
- 세션/도구/표준보다 Course Thesis와 Decision Ownership을 우선한다.


## Unified Baseline v2.6 Usage
Quote는 Session 장식이 아니라 `Principle → Decision → Trade-off`의 근거로만 사용한다. OOAD 16h/14-topic 가변 시간 구조와 동일하게 유지한다.
