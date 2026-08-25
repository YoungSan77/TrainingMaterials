# Unified Course Portfolio v2.6 — Portfolio Context & Catalog

> **Legacy migration provenance:** legacy context v2.6의 README와 course catalog를 흡수했다. 정본 11개 과정 목록은 이 문서가 최종 snapshot으로 소유하며 legacy 자료는 현재 의존성이 아니다.

---

# Part A — Program Overview

이 저장소는 현재 11개 과정의 **Portfolio Canon과 운영 지원자산**을 하나의 구조로 관리한다. 과정 설계의 출발점은 `Learner & Context Fit`이며, 5개 Foundational Decision Lens를 Portfolio-wide Parent로 사용한다.

## Design Order

```text
Learner / Customer Context
→ Desired Outcome / Capability Gap
→ Required Decisions
→ Foundational Decision Lenses
→ Course-owned Principles / Content
→ LLM-integrated Practice
→ Evidence / Transfer
```

`Customer-centered ≠ Customer-request-driven`이다. 고객 요청이나 우리가 알고 있는 Body of Knowledge를 그대로 Curriculum Spine으로 사용하지 않는다.

## Foundational Decision Lenses

1. Systems Thinking
2. Lean Thinking
3. Theory of Constraints
4. Design Thinking
5. Empiricism / Scientific Thinking

이 Lens는 성숙도 단계나 순차 방법론이 아니며, 각 Course에서 실제 판단을 강화하는 Lens만 APPLY한다. 상세 정의는 `principles.md`가 소유한다.

## Global Content Baseline

교재는 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작 및 일반화 가능한 실무를 기본 기준으로 구성한다. 특정 국가·조직·벤더의 관행은 이 기준을 대체하지 않으며, 필요한 경우 Contextual Adaptation 또는 replaceable implementation example로 사용한다. 상세는 `evidence-policy.md`가 소유한다.

`Canon`은 Portfolio/Course의 승인된 정본·기준선 authority 의미로만 사용한다. 개념·원칙·패턴·저작·source의 성격은 `Foundational / Established / Authoritative / Reference / Core`로 구체화한다.

모든 LLM-integrated content는 특정 vendor/model/UI/API에 독립적이어야 한다.

## Authority Order

```text
Portfolio Governance (portfolio/)
        ↓
Course Baseline (courses/<slug>/design/course-context.md, practice-design.md)
        ↓
Course References (courses/<slug>/design/references/)
        ↓
Curriculum / Deck (courses/<slug>/curriculum.md, decks/)
```

상위 계층과 충돌하면 상위 Canon이 우선한다.

## Change Rule

신규 과정, 중요 Course 변경, Principle/Ownership 변경은 `governance.md`(Part B — Change & Extension Protocol)를 따른다. 파일 위치만 유지하는 것이 아니라 **Learner Fit → Lens → Ownership → Course → Practice → Audit** 순서를 유지한다.

## Current LLM Practice Policy

- 8h: 4개
- 16h: 7–8개
- 각 20–25분 중심
- Recommended Prompt 없이 시작 → 5–10분 후 Intervention → Keep Going → 종료 후 Recommended Prompt 공개
- Prompt Engineering 자체가 아니라 각 과정의 전문적 판단과 실무 적용이 목적
- Practice detail은 `practice-standard.md`를 따른다.

---

# Part B — Course Portfolio Catalog v2.6

## B1. Developed Baseline — 정본 11개 과정

| # | Course | Slug | Time | Category | Status |
|---:|---|---|---:|---|---|
| 1 | 객체지향 분석과 설계 실무 (OOAD) | `ooad` | 16h | Engineering Foundations | Baseline |
| 2 | 도메인 주도 설계 개요와 실무 (DDD) | `ddd` | 8h | Engineering Foundations | Baseline |
| 3 | SW 아키텍처 설계 실무 | `sw-architecture` | 16h | Architecture & Evolution | Baseline |
| 4 | 마이크로서비스 아키텍처(MSA) 개요와 설계 원칙 | `msa` | 8h | Architecture & Distribution | Baseline |
| 5 | AI-Native Software Engineering | `ai-native` | 16h | AI Engineering | Baseline |
| 6 | 현대적 SW 품질관리 실무 (Modern SWQM) | `swqm` | 8h | Cross-Cutting Quality | Baseline |
| 7 | 애자일 개발 도입 실무 — Scrum 기반 단계적 적용 | `agile` | 8h | Adaptive Delivery | Baseline |
| 8 | DevOps 개요와 SW Delivery 실무 | `devops` | 8h | Delivery & Operations | Baseline |
| 9 | SW 프로젝트 관리 실무 — PMBOK® Guide 8 기반 | `project-management` | 16h | Project Governance & Control | Baseline |
| 10 | SW 제안 전략과 제안서 작성 실무 | `sw-proposal` | 8h | Business Development / Proposal | Baseline |
| 11 | 디지털 전환에서 AI 전환으로: 전략과 실행 | `dt-to-ax` | 8h | Transformation Strategy | Baseline |

이 11개가 Portfolio의 유일한 정식 과정이다. 11개 밖 과정(과거 `agentic`/`ai-assisted`/`qm` 등)은 이 Catalog의 대상이 아니다.

## B2. Portfolio Time Rule

- Topic은 50분 고정 Session이 아니다.
- 8h 과정은 총 운영시간 480분 이내, 권장 순수 학습 약 400분.
- 16h 과정은 총 운영시간 960분 이내, 권장 순수 학습 약 800분.
- 50분 학습 + 10분 휴식은 운영 리듬일 뿐 Topic boundary가 아니다.
- 시간은 내용·난이도·실습·토론량에서 파생한다.

## B3. Portfolio Rules

1. One Concept, One Owner.
2. 다른 과정의 개념은 RECAP / APPLY / EXTEND / BRIDGE / FORWARD로 사용한다.
3. Framework/Tool/Standard 이름이 Curriculum Spine이 되지 않는다.
4. Course Thesis와 learner decision이 산출물보다 우선한다.
5. 주요 practice에는 전제, trade-off, failure condition, evidence를 둔다.
6. Awareness Topic은 통상 1~5분 수준으로만 소개한다.
7. Source/Evidence는 Course Spine을 만들지 않고 정본 주장과 구분을 검증한다.
8. 새 과정은 Course Admission Gate(`governance.md` Part B7)를 통과한 뒤 Baseline으로 승격한다.

## B4. Current Development Status

11개 과정 모두 **Course Baseline + Curriculum Backbone 수준**까지 Governance 상 완료했다. LLM-integrated Practice Pack은 11개 과정 모두 존재한다(`courses/<slug>/design/practice-design.md`). 실제 상세 deck/instructor guide는 과정별 curriculum 개발 시 추가한다.

기존 실제 Curriculum이 이미 존재하는 과정(OOAD·DDD·SW Architecture·MSA·SWQM)은 그 Curriculum이 이 저장소의 정본이며, 이 Catalog의 "Baseline" 표기는 Course Design(Governance) 차원의 완료를 뜻할 뿐 Curriculum을 재생성하라는 뜻이 아니다.
