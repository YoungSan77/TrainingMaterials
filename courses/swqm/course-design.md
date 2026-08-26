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

## Major Anchor Sources

| Source | Anchors | Locator | Verification |
|---|---|---|---|
| ISO/IEC 25010:2023 | product quality model의 표준 vocabulary | https://www.iso.org/standard/78176.html | Verified official locator; 표준 전문 인용 안 함 |
| W. Edwards Deming, Out of the Crisis | 품질 문제를 management system 관점에서 보는 lineage | MIT Press, 1986, ISBN 978-0262541152 | Verified bibliographic; 94% 수치 축자 사용 안 함 |
