# 마이크로서비스 아키텍처 개요와 설계 원칙 — Course Design

## Identity

- **Slug:** `msa`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

분산이 실제로 필요한지 판단하고, 필요할 때 서비스·데이터·계약·일관성·실패·운영 경계를 함께 설계하게 한다.

## Target Learner

모놀리스 한계를 느끼거나 MSA 전환을 검토하지만 분산 비용과 운영 책임을 충분히 계산하지 못하는 architect·developer

## Capability Gap

- microservice를 기술 현대화의 기본 목표로 둔다
- Bounded Context를 곧바로 service로 변환한다
- network·consistency·failure·observability 비용을 뒤늦게 발견한다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- 분산의 독립 가치와 비용을 비교한다
- module/service boundary와 data ownership을 판단한다
- sync/event contract와 compatibility를 설계한다
- consistency·failure·retry·idempotency·observability를 하나의 운영 결정으로 본다

## Course Thesis

> MSA는 작은 서비스의 모음이 아니라 독립 변화·배포 가치가 분산 비용을 넘어설 때 선택하는 운영 가능한 architecture다.

## Core Learning Scope

- distribute-or-not decision
- modular monolith as cheaper boundary test
- service boundary와 data ownership
- API/event contract와 compatibility
- distributed consistency, saga/outbox/idempotency 개념
- partial failure, timeout/retry/circuit considerations
- observability와 operational cost
- incremental extraction과 rollback

## Ownership

- **Owns:** 분산 채택·서비스와 데이터 소유·distributed consistency·failure/observability cost

### Non-scope

- DDD bounded context 정의
- 일반 architecture process 전수
- message broker 제품 교육
- Kubernetes 운영
- CI/CD pipeline 설계

### Cross-course Boundary / Handoff

- DDD의 의미 경계와 SW Architecture의 driver를 입력으로 받는다
- delivery automation/recovery 실행은 DevOps로 넘긴다
- quality evidence 체계는 SWQM과 연결한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 왜 지금 분산해야 하며 modular monolith로는 부족한가
- 서비스와 데이터의 독립 소유 경계는 어디인가
- 어떤 상호작용과 consistency가 필요한가
- 실패·중복·지연을 어떤 contract와 evidence로 다룰 것인가
- 운영 복잡성을 감당할 capability가 있는가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 분산 필요성을 진단한다
2. 저비용 module boundary로 가설을 시험한다
3. service/data boundary를 정한다
4. contract와 consistency를 설계한다
5. failure·observability·operational readiness를 검증한다
6. incremental migration 결정을 만든다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Distribute or not | 독립 배포 가치와 분산 비용을 비교 | decision memo와 blocker | ‘요즘 표준’ 또는 팀 수만으로 MSA를 선택하는 경우 |
| Order service/data boundary | 서비스와 데이터 owner를 판단 | boundary map·data ownership·rejected split | entity/table 단위로 서비스를 나누는 경우 |
| Consistency and failure | 업무 일관성과 partial failure 대응을 선택 | interaction contract·failure table·evidence | Saga/Outbox/Retry 이름만 나열하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Major Anchor Sources

| Source | Anchors | Locator | Verification |
|---|---|---|---|
| Martin Fowler & James Lewis, “Microservices” | microservice 특성과 독립 배포·business capability 논의 | https://martinfowler.com/articles/microservices.html | Verified web locator |
| Chris Richardson, Microservices Patterns | Saga, transactional outbox, idempotent consumer의 pattern lineage | Manning, 2018, ISBN 978-1617294549 | Verified bibliographic; exact quote 미사용 |
