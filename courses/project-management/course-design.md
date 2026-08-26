# SW 프로젝트 관리 실무 — PMBOK Guide 8 기반 — Course Design

## Identity

- **Slug:** `project-management`
- **Confirmed duration:** 16h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

software project의 가치·governance·stakeholder·scope·일정·자원·위험·변경을 하나의 decision system으로 통합하게 한다.

## Target Learner

계획·보고·통제 업무를 수행하지만 artifact 관리와 outcome governance를 구분하기 어려운 PM·lead·delivery manager

## Capability Gap

- schedule과 status report를 project management의 중심으로 둔다
- predictive/adaptive 접근을 이념적으로 선택한다
- scope·resource·risk·stakeholder 변경의 상호 영향을 분리해서 본다
- process 준수를 success evidence로 오해한다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- project value와 success criteria를 정의한다
- 맥락에 맞는 development/management approach를 tailor한다
- decision rights·stakeholder engagement·scope·schedule·resource·risk를 통합한다
- forecast와 evidence로 변경·escalation 결정을 내린다

## Course Thesis

> 프로젝트 관리는 계획서를 유지하는 일이 아니라 제한된 조건에서 가치 실현 가능성을 지속 판단하고 통합된 결정을 내리는 governance system이다.

## Core Learning Scope

- value와 success criteria
- governance·decision rights·accountability
- stakeholder engagement
- development approach와 lifecycle tailoring
- scope·schedule·resource planning
- risk/uncertainty response
- measurement·forecast·reporting
- integrated change and learning
- PMBOK 8 principles/domains/focus areas의 실무 적용

## Ownership

- **Owns:** project value·governance·stakeholder/scope/schedule/resource/risk 통합·tailoring

### Non-scope

- Agile/Scrum 상세 교육
- engineering architecture 결정
- DevOps pipeline
- proposal win strategy
- PMP 시험 대비와 process 암기

### Cross-course Boundary / Handoff

- 수주 전 customer decision은 SW Proposal에서 받는다
- engineering/delivery evidence는 전문 과정에서 받는다
- adaptive delivery는 Agile, transformation portfolio는 DT→AX와 연결한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 무엇을 project value와 success evidence로 볼 것인가
- 어떤 lifecycle/management approach가 uncertainty에 맞는가
- 누가 어떤 결정을 내리고 언제 escalation하는가
- scope·schedule·resource·risk trade-off를 어떻게 통합할 것인가
- 새 evidence가 forecast와 change decision을 어떻게 바꾸는가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. value/context와 approach를 정한다
2. governance와 stakeholder system을 설계한다
3. scope·schedule·resource를 통합 계획한다
4. risk와 uncertainty response를 설계한다
5. evidence·forecast·change control로 운영한다
6. 관리 system을 맥락에 맞게 tailor한다

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Value and approach | success criteria와 lifecycle approach 판단 | value map·approach rationale | 고객 요구·납기만 success로 두는 경우 |
| Governance rights | decision·approval·escalation 구조 판단 | governance map | 모든 결정을 PM이나 committee에 집중하는 경우 |
| Integrated baseline | scope·schedule·resource 상호 영향을 판단 | integrated plan과 assumptions | 세 계획을 독립 최적화하는 경우 |
| Risk response | 위험별 회피·완화·전가·수용 판단 | risk response portfolio | risk register 작성이 끝인 경우 |
| Forecast/change | 새 evidence의 통합 영향을 판단 | forecast·change recommendation | status 색상만 보고하거나 sunk cost를 무시하는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Anchors and References

### Anchors

| Tag | Anchor | Exact Original Text / Definition | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|---|
| [DEFINITION][ANCHOR][CORE] | Project | “A temporary initiative in a unique context undertaken to create value.” | PMI, PMI Lexicon / PMBOK Guide – Eighth Edition lineage | — | [Project를 단순 temporary endeavor가 아니라 unique context에서 value를 만드는 initiative로 고정. (프로젝트 관리 협회)](https://www.pmi.org/-/media/pmi/documents/registered/pdf/pmbok-standards/pmi-lexicon-pm-terms.pdf?rev=447328d841c249af985d14177ddd5f95\&utm_source=chatgpt.com "PMI Lexicon of Project Management Terms") |
| [PRINCIPLE][01][ANCHOR] | Adopt a Holistic View | “Adopt a Holistic View” | PMI, PMBOK Guide – Eighth Edition, §3.3 | — | 프로젝트를 scope/schedule/cost의 개별 최적화가 아니라 조직·환경·상호작용을 포함한 전체 system으로 판단 |
| [PRINCIPLE][02][ANCHOR] | Focus on Value | “Focus on Value” | PMI, PMBOK Guide – Eighth Edition, §3.4 | — | 프로젝트 성공의 중심을 deliverable completion이 아니라 value에 둠 |
| [PRINCIPLE][03][ANCHOR] | Embed Quality | “Embed Quality Into Processes and Deliverables” | PMI, PMBOK Guide – Eighth Edition, §3.5 | — | Quality를 마지막 inspection이 아니라 process와 deliverable 내부에 내재화 |
| [PRINCIPLE][04][ANCHOR] | Accountable Leadership | “Be an Accountable Leader” | PMI, PMBOK Guide – Eighth Edition, §3.6 | — | PM의 역할을 행정적 coordination보다 ownership과 accountability의 문제로 고정 |
| [PRINCIPLE][05][ANCHOR] | Sustainability | “Integrate Sustainability Within All Project Areas” | PMI, PMBOK Guide – Eighth Edition, §3.7 | — | Sustainability를 별도 activity가 아니라 project decision 전반의 고려사항으로 봄 |
| [PRINCIPLE][06][ANCHOR] | Empowered Culture | “Build an Empowered Culture” | PMI, PMBOK Guide – Eighth Edition, §3.8 | — | command-and-control보다 역량 있는 팀과 책임 있는 의사결정을 지원하는 환경을 강조 |

### Core References

| Tag | Reference | Author / Source | Source / Locator | Educational Role |
|---|---|---|---|---|
| [BOOK][REFERENCE][BACKBONE] | PMBOK Guide – Eighth Edition | Project Management Institute, A Guide to the Project Management Body of Knowledge (PMBOK® Guide)—Eighth Edition, 2025 | — | [과정 전체의 primary backbone. 6 Principles를 중심으로 modern project management의 판단 체계를 제공. PMI도 8판의 핵심을 6 principles와 7 performance domains로 설명한다. (프로젝트 관리 협회)](https://www.pmi.org/es-es/standards/pmbok?utm_source=chatgpt.com "PMBOK Guide") |
| [BOOK][REFERENCE][CORE] | Software Project Survival Guide | Steve McConnell, Software Project Survival Guide, Microsoft Press, 1997 | — | [SW 프로젝트 관리의 실무적 핵심 Reference. Planning, Requirements, QA, Architecture, Design, Construction, Testing, Release를 프로젝트 관리와 SW engineering의 한 흐름으로 연결. (Microsoft Press Store)](https://www.microsoftpressstore.com/store/software-project-survival-guide-9780735637382?utm_source=chatgpt.com "Software Project Survival Guide") |
