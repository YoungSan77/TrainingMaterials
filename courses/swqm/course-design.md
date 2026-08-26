# 현대적 SW 품질관리 실무 — Course Design

## Identity

- **Slug:** `swqm`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

품질 문제를 개인의 주의 부족이 아니라 위험·feedback·검증·측정·개선이 연결된 engineering system으로 운영하게 한다.

## Target Learner

test나 audit 활동은 수행하지만 품질 위험과 evidence를 delivery decision으로 통합하지 못하는 QA·developer·manager

## Capability Gap

- quality를 testing 또는 compliance와 동일시한다
- 모든 검사를 앞당기거나 자동화하면 좋다고 본다
- metric을 진단 도구가 아니라 목표로 사용한다
- defect를 개인 책임으로 환원하고 system cause를 놓친다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- quality stakeholder와 risk를 식별한다
- 예방·review·static analysis·test·operation evidence를 portfolio로 배치한다
- risk에 맞는 quality gate를 설계한다
- metric distortion을 진단하고 system constraint를 개선한다

## Course Thesis

> 현대적 품질관리는 defect를 뒤에서 세는 일이 아니라 위험에 맞는 예방과 evidence를 workflow에 배치하고 시스템을 지속 개선하는 일이다.

## Core Learning Scope

- quality as system property
- quality stakeholder/risk/cost of rework
- prevention vs detection
- selective shift-left
- review·static analysis·test strategy의 역할
- quality evidence와 gate
- measurement system·Goodhart risk
- root cause와 continuous improvement
- AI output을 포함한 artifact quality 판단

## Ownership

- **Owns:** quality risk·verification portfolio·quality evidence/gate·measurement·system improvement

### Non-scope

- testing technique 전수
- CI/CD pipeline ownership
- architecture evaluation ownership
- 규격 인증 실무
- AI system engineering 내부 설계

### Cross-course Boundary / Handoff

- 각 과정의 전문 품질 요구를 입력으로 받는다
- delivery performance는 DevOps, architecture fitness는 SW Architecture가 소유한다
- AI output evaluation mechanics는 AI-Native와 구분한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 가장 중요한 quality risk와 failure evidence는 무엇인가
- 어떤 예방·review·analysis·test를 어느 시점에 둘 것인가
- release/decision gate에 어떤 evidence가 충분한가
- 어떤 metric이 진단에 유용하고 목표화 시 왜곡되는가
- 현재 품질 constraint를 어떤 feedback loop로 개선할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. 품질 실패를 system과 risk로 진단한다
2. 예방·검출 수단을 비용과 feedback 기준으로 배치한다
3. test/evidence portfolio와 gate를 설계한다
4. measurement distortion을 점검한다
5. root cause와 improvement experiment를 운영한다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Quality risk system map | 반복 defect의 system cause와 feedback delay 판단 | risk/cause/feedback map | 사람 주의·교육만 대책으로 제시하는 경우 |
| Verification placement | 위험별 검증 위치와 강도를 판단 | verification portfolio와 gate | 모든 것을 shift-left/automation하는 경우 |
| Metric and improvement | metric 왜곡과 현재 constraint를 판단 | measurement contract·improvement experiment | target 달성 자체를 품질 향상으로 간주하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [SYSTEM][QUOTE][ANCHOR] | Quality is a System Issue | “94% belongs to the system (responsibility of management), 6% special.” | W. Edwards Deming, Out of the Crisis lineage | — | 품질 문제를 개인보다 system/process 관점에서 바라보는 출발점 |
| [PREVENTION][QUOTE][ANCHOR] | Build Quality In | “Cease dependence on inspection to achieve quality. Eliminate the need for inspection on a mass basis by building quality into the product in the first place.” | W. Edwards Deming, Out of the Crisis, Point 3 | — | 검사로 품질을 만들어내는 것이 아니라 처음부터 process/product에 내재화 |
| [PREVENTION][QUOTE][ANCHOR] | Inspection is Too Late | “Inspection is too late. The quality, good or bad, is already in the product.” | W. Edwards Deming, Out of the Crisis | — | 예방과 Shift-Left를 압축하는 문구 |
| [IMPROVEMENT][QUOTE][ANCHOR] | Continual Improvement | “Improve constantly and forever the system of production and service.” | W. Edwards Deming, Out of the Crisis, Point 5 | — | 품질을 지속적인 system improvement로 고정 |
| [PREVENTION][QUOTE][ANCHOR] | Do It Right vs. Do It Over | “There’s never enough time to do it right, but somehow, there’s always enough time to do it over.” | Anonymous, widely used engineering adage | — | 예방에는 시간이 없다면서 재작업에는 더 많은 시간을 쓰는 모순을 기억시키는 Anchor |
| [LEARNING][QUOTE][ANCHOR] | Experience Without Theory | “Experience without theory teaches nothing.” | W. Edwards Deming, Out of the Crisis lineage | — | 경험 자체를 지식이나 개선으로 착각하지 않도록 함 |
| [LEARNING][QUOTE][ANCHOR] | Theory Gives Experience Meaning | “Without theory, experience has no meaning. Without theory, one has no questions to ask. Hence without theory, there is no learning.” | W. Edwards Deming, The New Economics for Industry, Government, Education | — | Context/theory 없는 경험의 기계적 복제를 방지 |
| [ECONOMICS][QUOTE][ANCHOR] | Quality is Free | “Quality is free. It's not a gift, but it is free.” | Philip B. Crosby, Quality Is Free, 1979 | — | 품질을 failure/rework까지 포함한 경제 문제로 바라봄 |
| [REQUIREMENTS][QUOTE][ANCHOR] | Hardest Part of Software | “The hardest single part of building a software system is deciding precisely what to build.” | Frederick P. Brooks Jr., No Silver Bullet | — | 품질이 coding/testing보다 앞선 요구와 문제 정의에서 시작함을 고정 |
| [REQUIREMENTS][QUOTE][ANCHOR] | Requirements Emerge Through Use | “it is really impossible for a client, even working with a software engineer, to specify completely, precisely, and correctly the exact requirements of a modern software product before trying some versions of the product.” | Frederick P. Brooks Jr., No Silver Bullet | — | Feedback과 iterative discovery가 요구 품질에 필수임을 설명 |
| [TESTING][QUOTE][ANCHOR] | Limits of Testing | “Program testing can be used to show the presence of bugs, but never to show their absence.” | Edsger W. Dijkstra, Notes on Structured Programming | — | Test pass를 품질 보증 전체와 동일시하지 않게 함 |
| [MEASUREMENT][QUOTE][ANCHOR] | Goodhart's Law | “Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.” | Charles Goodhart, original formulation | — | Metric을 통제목표로 사용할 때 발생하는 왜곡을 설명 |
| [MEASUREMENT][QUOTE][ANCHOR] | Measure Becomes Target | “When a measure becomes a target, it ceases to be a good measure.” | Marilyn Strathern, “Improving Ratings”, 1997 | — | Goodhart 효과를 교육적으로 기억하기 쉬운 문장으로 고정 |
| [MEASUREMENT][QUOTE][ANCHOR] | Measurement Changes Behavior | “Tell me how you measure me, and I will tell you how I will behave.” | Eliyahu M. Goldratt, The Haystack Syndrome | — | KPI와 metric이 사람과 조직의 행동을 변화시킴을 설명 |
| [EVIDENCE][QUOTE][ANCHOR] | Don't Fool Yourself | “The first principle is that you must not fool yourself — and you are the easiest person to fool.” | Richard P. Feynman, “Cargo Cult Science”, 1974 | — | 형식적 metric·audit·certification이 실질 품질을 대신하는 것을 경계 |
| [DOMAIN][QUOTE][ANCHOR] | Domain Value | “The heart of software is its ability to solve domain-related problems for its user.” | Eric Evans, Domain-Driven Design | — | SW 품질의 최종 목적을 사용자/domain value와 연결 DDD의 Domain Value Anchor를 SWQM에서 재사용. |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [STANDARD][REFERENCE][CORE] | Software Product Quality Model | ISO/IEC 25010, SQuaRE | — | Software/Product Quality를 체계적으로 다루는 핵심 표준 Reference |
| [STANDARD][REFERENCE][CORE] | Quality Management System | ISO 9000 / ISO 9001 family | — | Customer focus, process approach, improvement, evidence-based decision making 등의 QMS 기반 Reference |
| [MATURITY][REFERENCE] | CMMI | CMMI Institute / ISACA, current CMMI model | — | 인증 단계가 아니라 process capability/improvement를 다룰 Reference |
| [DELIVERY][REFERENCE] | DORA | DORA, Software Delivery Performance research | — | Quality와 delivery feedback/performance 관계를 위한 empirical Reference DevOps의 DORA evidence를 SWQM 관점에서 재사용. |
| [TESTING][REFERENCE] | Test Strategy / Testing Pyramid | Mike Cohn lineage; Google Testing Blog | — | 다양한 test level의 feedback economics를 Curriculum에서 전개 |
