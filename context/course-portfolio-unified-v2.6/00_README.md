# Unified Course Portfolio v2.6

이 ZIP은 현재 11개 과정의 **Portfolio Canon과 운영 지원자산**을 하나의 구조로 관리한다. v2.6부터 과정 설계의 출발점을 `Learner & Context Fit`으로 명시하고, 5개 Foundational Decision Lens를 Portfolio-wide Parent로 사용한다.

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

이 Lens는 성숙도 단계나 순차 방법론이 아니며, 각 Course에서 실제 판단을 강화하는 Lens만 APPLY한다.

## Global Content Baseline

교재는 전 세계적으로 축적된 SW공학의 정본적 지식, 검증된 원칙, 경험적 근거, 영향력 있는 전문 저작 및 일반화 가능한 실무를 기본 기준으로 구성한다. 특정 국가·조직·벤더의 관행은 이 기준을 대체하지 않으며, 필요한 경우 Contextual Adaptation 또는 replaceable implementation example로 사용한다.

`Canon`은 Portfolio/Course의 승인된 정본·기준선 authority 의미로만 사용한다. 개념·원칙·패턴·저작·source의 성격은 `Foundational / Established / Authoritative / Reference / Core`로 구체화한다.

모든 LLM-integrated content는 특정 vendor/model/UI/API에 독립적이어야 한다.

## Authority Order

1. `support/01_governance/` — Portfolio-wide Canon
2. `courses/` — Course Baseline Canon
3. `support/02_course-assets/` — 과정별 Instructor/Design 지원자산
4. `support/03_source-evidence/` — 근거·출처·최신성 검증자료
5. `support/04_audit/` — 현재 릴리스 검증 기록

상위 계층과 충돌하면 상위 Canon이 우선한다.

## Change Rule

신규 과정, 중요 Course 변경, Principle/Ownership 변경은 `support/01_governance/09_portfolio-change-and-extension-protocol.md`를 따른다. 파일 위치만 유지하는 것이 아니라 **Learner Fit → Lens → Ownership → Course → Practice → Audit** 순서를 유지한다.

## Numbering Rule

- 모든 관리 폴더는 `00_MANIFEST.md`를 인덱스로 사용한다.
- 과정 관련 번호 `01–11`은 Portfolio Course ID와 동일하게 유지한다.
- Governance는 책임 순서 `01–12`를 사용한다.
- 과정별 `course-assets` 안에서는 `01`부터 자산 유형 순으로 번호를 부여한다.
- 이미 의미가 부여된 번호를 임의 재사용하지 않는다.

## Current LLM Practice Policy

- 8h: 4개
- 16h: 7–8개
- 각 20–25분 중심
- Recommended Prompt 없이 시작 → 5–10분 후 Intervention → Keep Going → 종료 후 Recommended Prompt 공개
- Prompt Engineering 자체가 아니라 각 과정의 전문적 판단과 실무 적용이 목적
- Practice detail은 `support/01_governance/12_llm-integrated-practice-standard.md`를 따른다.
