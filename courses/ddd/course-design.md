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

## Major Anchor Sources

| Source | Anchors | Locator | Verification |
|---|---|---|---|
| Eric Evans, Domain-Driven Design | Ubiquitous Language, Aggregate, Bounded Context의 원전 lineage | Addison-Wesley, 2003, ISBN 978-0321125217 | Verified bibliographic; exact quote 미사용 |
| Martin Fowler, “BoundedContext” | 모델의 적용 범위와 Context 경계 설명 | https://martinfowler.com/bliki/BoundedContext.html | Verified web locator |
