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

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [DEFINITION][ANCHOR][CORE] | Microservice Architecture | “In short, the microservice architectural style is an approach to developing a single application as a suite of small services, each running in its own process and communicating with lightweight mechanisms, often an HTTP resource API. These services are built around business capabilities and independently deployable by fully automated deployment machinery.” | James Lewis, Martin Fowler, “Microservices”, 2014 | https://martinfowler.com/microservices/?lang=en | MSA의 대표적 정의. service, business capability, independent deployment가 한 문맥에 들어 있음. (martinfowler.com) |
| [DEFINITION][ANCHOR][CORE] | Microservices | “Microservices are independently deployable services modelled around a business domain.” | Sam Newman, Building Microservices | — | micro보다 independent deployability와 business domain을 핵심으로 고정 |
| [FOUNDATION][QUOTE][ANCHOR] | Distributed System | “A distributed system is one in which the failure of a computer you didn't even know existed can render your own computer unusable.” | Leslie Lamport, DEC SRC, 1987 | — | Microservices는 결국 distributed system이라는 사실을 기억시키는 고전적 문구 |
| [TRADE-OFF][QUOTE][ANCHOR] | Distribution Cost | “Distributed systems are harder to program, since remote calls are slow and are always at risk of failure.” | Martin Fowler, “Microservice Trade-Offs”, 2015 | https://martinfowler.com/articles/microservice-trade-offs.html | 분산을 선택하면 latency와 failure가 설계 문제로 들어온다는 것을 한 문장으로 고정. (martinfowler.com) |
| [TRADE-OFF][QUOTE][ANCHOR] | Distribution is Always a Cost | “But distribution is always a cost. I'm always reluctant to play the distribution card, and think too many people go distributed too quickly because they underestimate the problems.” | Martin Fowler, “Microservice Trade-Offs”, 2015 | https://martinfowler.com/articles/microservice-trade-offs.html | MSA를 default architecture로 선택하는 태도를 경계하는 대표 문구. (martinfowler.com) |
| [DDD][BOUNDARY][ANCHOR] | Bounded Context and Microservices | “This process is useful for both monolithic and microservice architectures, but there is a natural correlation between service and context boundaries” | James Lewis, Martin Fowler, “Microservices”, 2014 | https://martinfowler.com/articles/microservices.html?trk=public_post_comment-text | DDD의 Bounded Context가 MSA service boundary와 연관되지만, 동일 개념은 아님을 직접 MSA 문맥에서 표현. (martinfowler.com) |
| [DDD][COMMENT][ANCHOR] | DDD is Necessary but Insufficient | “while (logical) design techniques such as DDD domain modeling concepts, loose coupling and high cohesion are essential for creating good software, they are insufficient when designing a microservice architecture.” | Chris Richardson, “DDD, necessary but insufficient: physical design principles for microservices” | https://microservices.io/post/architecture/2024/03/18/exploreddd-physical-design-principles-for-microservices.html | DDD가 MSA boundary 설계에 중요하지만, team/process/transaction/network 같은 physical constraint까지 고려해야 한다는 매우 직접적인 문구. (microservices.io) |
| [BOUNDARY][QUOTE][ANCHOR] | Wrong Boundaries are Expensive | “Getting service boundaries wrong can be expensive. It can lead to a larger number of cross-service changes, overly coupled components, and in general could be worse than just having a single monolithic system.” | Sam Newman, “Microservices For Greenfield?”, 2015 | — | MSA의 핵심 난제가 service count가 아니라 boundary correctness임을 고정 |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][CORE] | Building Microservices | Sam Newman, Building Microservices | — | MSA Curriculum의 핵심 reference |
| [BOOK][REFERENCE][CORE] | Microservices Patterns | Chris Richardson, Microservices Patterns | — | decomposition, data, consistency, messaging, operation 관련 Curriculum reference |
| [REFERENCE][FOUNDATION] | Fallacies of Distributed Computing | Peter Deutsch et al. | — | distributed-system의 잘못된 전제를 Curriculum에서 다루기 위한 foundational reference |
