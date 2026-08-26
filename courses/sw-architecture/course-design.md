# SW 아키텍처 설계 실무 — Course Design

## Identity

- **Slug:** `sw-architecture`
- **Confirmed duration:** 16h
- **Lifecycle:** REQUIRED when this course is active
- **Consumer:** Curriculum LLM and Curriculum Harness

교육시간은 Portfolio fixed constraint다. 변경 필요성이 발견되면 이 문서에서 바꾸지 않고 blocker로 보고한다.

## Purpose

business goal·제약·quality attribute를 architecture driver로 만들고 구조 대안의 trade-off를 검증·기록·진화시키게 한다.

## Target Learner

layer·pattern은 알지만 왜 그 구조를 선택하고 어떻게 검증할지 설명하기 어려운 senior developer·architect

## Capability Gap

- architecture를 diagram이나 framework 조합으로 취급한다
- quality를 ‘확장성·보안이 좋아야 한다’는 단어로만 적는다
- 대안을 비교하지 않고 익숙한 style을 선택한다
- 결정을 문서화하지만 지속 검증하지 않는다

## Target Capability

과정 종료 시 학습자는 다음을 할 수 있어야 한다.

- business/technical context에서 driver와 constraint를 도출한다
- quality attribute scenario를 구체화한다
- 구조 대안과 trade-off를 비교한다
- decision과 rationale를 기록한다
- scenario/evidence/fitness function으로 architecture를 평가·진화시킨다

## Course Thesis

> Software architecture는 중요한 품질과 제약을 만족시키기 위해 구조적 선택을 하고, 그 trade-off를 evidence로 계속 관리하는 일이다.

## Core Learning Scope

- stakeholder concern과 architecture driver
- quality attribute scenario
- module/component/deployment 관점과 boundary
- architecture style/pattern을 대안으로 비교
- policy와 detail dependency
- ADR와 rationale
- scenario-based evaluation와 risk
- fitness function·evolution·technical debt

## Ownership

- **Owns:** architecture driver·quality trade-off·structural decision·evaluation·evolution

### Non-scope

- 객체 책임 설계
- domain model·bounded context 정의
- microservice implementation pattern 상세
- CI/CD pipeline 운영
- 특정 cloud/framework reference architecture 복제

### Cross-course Boundary / Handoff

- OOAD/DDD의 policy와 boundary를 입력으로 사용한다
- 분산 채택·service/data/failure 결정은 MSA로 넘긴다
- architecture conformance 실행은 DevOps/SWQM과 연결한다

다른 과정의 내용을 현재 과정의 completeness를 위해 복제하지 않는다. 필요한 최소 맥락만 recap하고 전문 판단은 owner 과정으로 넘긴다.

## Key Decisions and Trade-offs

- 어떤 concern이 실제 architecture driver인가
- quality attribute를 어떤 scenario와 measure로 표현할 것인가
- 어떤 구조 대안이 무엇을 얻고 무엇을 지불하는가
- 어떤 decision이 기록·검증돼야 하는가
- 새 evidence가 생기면 architecture를 어떻게 진화시킬 것인가

모든 결정은 얻는 가치뿐 아니라 비용, 위험, 가역성, 실패 조건과 필요한 evidence를 함께 다룬다.

## Learning Progression

1. context와 driver를 수립한다
2. quality scenario를 구체화한다
3. 구조 관점과 dependency를 모델링한다
4. 대안과 trade-off를 비교해 결정한다
5. 평가·ADR·fitness function으로 보호한다
6. 변화 evidence로 architecture를 진화시킨다

이는 Session 구조가 아니다. Curriculum LLM은 16h 안에서 중요도·난이도·실습과 feedback 필요성에 따라 시간을 비균등 배분한다.

## 핵심 실습 방향

| 실습 | 목적 | 학습자 판단 / 기대 산출물 | 실패 기준 |
|---|---|---|---|
| Quality scenario | 모호한 품질 요구를 자극·환경·response·measure로 바꿀지 판단 | quality attribute scenario 세트 | 측정·환경 없이 형용사만 남는 경우 |
| Architecture option trade-off | 동일 driver에 대한 구조 대안을 비교 | option matrix와 selected rationale | 선호 pattern을 결론으로 먼저 정하는 경우 |
| Policy/detail dependency | 변화하는 detail로부터 policy를 보호할 경계 판단 | dependency diagram과 boundary contract | layer 이름만 있고 dependency가 역전되지 않는 경우 |
| Evaluation와 ADR | 중요 위험을 scenario로 평가하고 decision을 기록 | risk findings·ADR | 결론만 있고 alternative/evidence가 없는 경우 |
| Evolution fitness | 보호할 characteristic과 자동/수동 evidence를 선택 | fitness function backlog | 모든 것을 자동화하거나 측정값이 decision과 연결되지 않는 경우 |

세부 절차, 시간, 자료 공개 순서와 평가 rubric은 Curriculum 단계에서 완성한다.

## Major Anchor Sources

| Source | Anchors | Locator | Verification |
|---|---|---|---|
| ISO/IEC/IEEE 42010:2022 | architecture description, concern, viewpoint의 표준적 경계 | ISO standard 74393 / https://www.iso.org/standard/74393.html | Verified official locator |
| SEI, Quality Attribute Workshops / ATAM resources | quality scenario와 trade-off 기반 평가 | https://www.sei.cmu.edu/our-work/software-architecture/ | Verified organizational source |
