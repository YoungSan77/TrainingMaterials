# DevOps 개요와 SW Delivery 실무 — Course Design

## Identity

- **Slug:** `devops`
- **Confirmed duration:** 8h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

개발부터 운영까지 delivery system의 흐름·feedback·deployability·recovery를 함께 개선하게 한다.

## Target Learner

CI/CD 도구를 사용하거나 Dev/Ops 협업을 추진하지만 병목과 운영 feedback을 end-to-end로 보지 못하는 engineer·lead

## Capability Gap

- DevOps를 toolchain 또는 배포 자동화로 축소한다
- 개발과 운영의 local metric을 각각 최적화한다
- pipeline 성공을 production outcome으로 오해한다
- 장애 복구와 학습을 delivery 바깥으로 둔다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- end-to-end value stream과 constraint를 진단한다
- CI feedback을 빠르고 신뢰 가능하게 설계한다
- reproducible artifact와 deployable state를 만든다
- deployment/release를 위험에 맞게 분리한다
- observability·recovery·learning evidence로 delivery system을 개선한다

## Course Thesis

> DevOps는 개발과 운영을 합치는 구호가 아니라 변경을 안전하고 반복 가능하게 production outcome으로 전달하고 학습하는 delivery system이다.

## Core Learning Scope

- value stream·flow·WIP·constraint
- version control와 continuous integration
- build/test feedback placement
- artifact/environment reproducibility
- continuous delivery와 deployment/release 구분
- deployment risk·rollback/recovery
- operational telemetry와 incident learning
- delivery performance evidence와 improvement

## Ownership

- **Owns:** delivery flow·CI/CD·deployability·recovery·operational learning

### Non-scope

- architecture style 선택
- test strategy 전체
- cloud/Kubernetes 제품 교육
- project governance
- 조직 transformation portfolio

### Cross-course Boundary / Handoff

- architecture와 quality guardrail을 입력으로 받는다
- service failure concern은 MSA에서 받는다
- quality evidence는 SWQM과 공유하되 delivery metric owner를 유지한다
- enterprise scale은 DT→AX로 넘긴다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 현재 delivery constraint와 feedback delay는 어디인가
- 어떤 검증을 local/CI/pre-deploy/post-deploy 어디에 둘 것인가
- 무엇이 reproducible/deployable state를 증명하는가
- release risk에 어떤 deployment/recovery 전략이 필요한가
- 어떤 operational evidence로 다음 개선을 선택할 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. delivery value stream을 진단한다
2. CI와 fast feedback을 설계한다
3. artifact/environment를 재현 가능하게 만든다
4. delivery/deployment/release 흐름을 설계한다
5. observe·recover·learn loop로 개선한다

이는 Session 구조가 아니다. Curriculum LLM은 8h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Delivery constraint map | end-to-end 병목과 local optimization을 판단 | value stream map·constraint hypothesis | Dev/Ops 각각의 utilization만 보는 경우 |
| CI evidence path | 검증 위치·속도·신뢰도를 판단 | feedback pipeline과 failure policy | 검사를 무조건 CI에 쌓는 경우 |
| Deploy/recover improvement | release 위험과 recovery evidence를 판단 | deployment/recovery plan·improvement experiment | deployment frequency만 목표화하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [CI][DEFINITION][ANCHOR] | Continuous Integration | “Continuous Integration is a software development practice where members of a team integrate their work frequently, usually each person integrates at least daily — leading to multiple integrations per day. Each integration is verified by an automated build (including test) to detect integration errors as quickly as possible.” | Martin Fowler, “Continuous Integration” | — | CI를 Jenkins 설치나 pipeline 실행이 아니라 frequent integration + automated verification + rapid feedback으로 고정 |
| [CI][QUOTE][ANCHOR] | Fix the Build Immediately | “The whole point of Continuous Integration is to provide rapid feedback. Nothing sucks the blood of a CI activity more than a broken build that isn't fixed promptly.” | Martin Fowler, “Continuous Integration” | — | CI의 핵심이 build 횟수가 아니라 빠른 feedback과 즉각적인 repair discipline임을 고정 |
| [CD][DEFINITION][ANCHOR] | Continuous Delivery | “Continuous Delivery is the ability to get changes of all types—including new features, configuration changes, bug fixes and experiments—into production, or into the hands of users, safely and quickly in a sustainable way.” | Jez Humble, Continuous Delivery | — | CD를 자동배포 tool이 아니라 changes를 safely, quickly, sustainably 전달할 수 있는 capability로 정의 |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][BACKBONE] | The DevOps Handbook | Gene Kim, Jez Humble, Patrick Debois, John Willis, The DevOps Handbook | — | DevOps 과정의 핵심 backbone. Flow, Feedback, continual learning, delivery pipeline, operations를 하나의 system으로 연결 |
| [FOUNDATION][REFERENCE][CORE] | The Three Ways | Gene Kim et al., The DevOps Handbook / The Phoenix Project lineage | — | Flow → Feedback → Continual Learning and Experimentation을 DevOps 전체 사고구조로 사용. 단순 slogan 암기가 아니라 Curriculum spine |
| [AUTOMATION][REFERENCE][CORE] | Infrastructure as Code | Kief Morris, Infrastructure as Code | — | Operations 환경을 수동 작업이 아니라 versioned, repeatable, testable engineering artifact로 만드는 reference |
| [MEASUREMENT][REFERENCE][CORE] | Accelerate | Nicole Forsgren, Jez Humble, Gene Kim, Accelerate, 2018 | — | DevOps practice와 software delivery/organizational performance 관계를 empirical evidence로 설명하는 핵심 reference |
| [MEASUREMENT][REFERENCE] | DORA Software Delivery Performance | DORA, current research | — | 현재 delivery performance metrics와 capability evidence를 설명. 개인·팀 productivity KPI로 사용하지 않음 |
| [OPERATIONS][REFERENCE] | Site Reliability Engineering | Google, Site Reliability Engineering | — | Reliability, automation, observability, operational feedback을 engineering 문제로 다루는 reference. DevOps와 SRE를 동일시하지 않음 |
