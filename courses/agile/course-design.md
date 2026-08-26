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

## Major Anchor Sources

| Source | Anchors | Locator | Verification |
|---|---|---|---|
| Manifesto for Agile Software Development and Principles | 가치·working software·change·frequent delivery의 foundational direction | https://agilemanifesto.org/ and https://agilemanifesto.org/principles.html | Verified official |
| Ken Schwaber & Jeff Sutherland, The Scrum Guide 2020 | Scrum definition, empiricism, accountabilities/events/artifacts | https://scrumguides.org/scrum-guide.html | Verified official current version as of review |
