# 11. Portfolio Governance Quality Gate v2.6

> **Status:** Portfolio Canon
> **Use:** 새 과정, 구조 변경, LLM Practice 변경, 지원자산 추가 시 릴리스 전에 적용한다.

## 1. Structure Gate

- [ ] 모든 관리 폴더에 `00_MANIFEST.md`가 있다.
- [ ] Course 관련 파일/폴더는 동일 Course ID `01–11`을 사용한다.
- [ ] Governance / Course Baseline / Course Asset / Source Evidence / Audit 역할이 섞이지 않는다.
- [ ] 임시 작업지시, migration note, 과거 audit가 current ZIP에 남지 않는다.
- [ ] 내부 참조가 실제 파일 경로와 일치한다.

## 2. Learner & Context Fit Gate

- [ ] Audience / Current Capability / Work Context가 명확하다.
- [ ] Pain / Failure Mode가 실제 업무 문제로 설명된다.
- [ ] Target Capability와 Required Decisions가 연결된다.
- [ ] 난이도와 상세도가 Decision Level(Recognize / Apply / Decide / Govern)에 맞는다.
- [ ] `Customer-centered ≠ Customer-request-driven` 원칙을 지켜 요청된 기술/과정명을 그대로 Spine으로 쓰지 않았다.
- [ ] Practice와 Evidence가 실제 업무 Transfer를 확인할 수 있다.

## 3. Foundational Decision Lens Gate

- [ ] Systems / Lean / ToC / Design / Empiricism 5개 Lens를 검토했다.
- [ ] 관련 없는 Lens를 억지로 삽입하지 않았다.
- [ ] Course-owned Principle이 관련 Parent Lens/Principle과 충돌하지 않는다.
- [ ] Local optimization, activity-over-outcome, solution-first, non-bottleneck optimization, assertion-without-evidence 같은 대표 실패를 필요한 과정에서 다룬다.

## 4. Course Canon Gate

- [ ] Course Thesis와 Problem Ownership이 명확하다.
- [ ] OWNER / RECAP / APPLY / FORWARD 경계가 기존 Portfolio와 충돌하지 않는다.
- [ ] Topic은 50분 고정이 아니며 내용과 Practice에 따라 시간이 배분된다.
- [ ] 8h는 400분, 16h는 800분 instructional baseline을 유지한다.
- [ ] 시간 부족 시 Core Practice를 우선하고 세부 설명은 Optional / Reference / Appendix로 이동한다.

## 5. LLM-Integrated Practice Gate

- [ ] 8h 과정은 3–4개, 현재 기준 4개를 사용한다.
- [ ] 16h 과정은 6–8개를 사용한다.
- [ ] 각 Practice는 15–30분, 기본 20–25분이다.
- [ ] Practice 시간은 기존 instructional budget 안에 포함된다.
- [ ] 시작 시 Recommended Prompt를 제공하지 않는다.
- [ ] 5–10분 후 Intervention을 제공하고 같은 작업을 Keep Going한다.
- [ ] 종료 시 Recommended Prompt와 설계 의도를 공개한다.
- [ ] Recommended Prompt가 정답이 아님을 명시한다.
- [ ] Prompt Engineering이 아니라 Course-owned decision과 실무 산출물을 평가한다.
- [ ] Practice별 필수 specification이 `12_llm-integrated-practice-standard.md`와 일치한다.

## 6. Course Asset Gate

- [ ] 모든 과정 폴더는 `00_MANIFEST` + `01_llm-integrated-practice-pack` 최소 구조를 갖는다.
- [ ] 추가 자산은 해당 과정에서 반복 재사용될 때만 추가한다.
- [ ] placeholder 자산을 만들지 않는다.
- [ ] 추가 자산은 Course Baseline을 재정의하지 않는다.
- [ ] Instructor-only 자산의 Intervention/Recommended Prompt가 학습자에게 조기 노출되지 않는다.

## 7. Evidence / Source / Localization Gate

- [ ] Course ID별 Source Evidence 파일이 존재한다.
- [ ] 교재의 기본 기준이 `07_evidence-source-localization-policy.md`의 Global Baseline과 일치한다.
- [ ] Source Provenance / Evidence Strength / Transferability / Curriculum Use를 서로 혼동하지 않는다.
- [ ] Source Evidence의 claim/source family에 표준 metadata가 적용되어 있다.
- [ ] BP Classification 기본값은 Not classified이며, 필요한 경우에만 Contextual/Korea BP 또는 Korea WP를 사용한다.
- [ ] Primary/Official source라는 이유만으로 generalizable practice로 승격하지 않는다.
- [ ] Foundational/Influential Work의 Concept / Principle / Pattern / Applicability를 구분한다.
- [ ] empirical research, framework definition, organizational heuristic, vendor implementation을 동일한 claim type으로 취급하지 않는다.
- [ ] 특정 조직/벤더 사례가 일반 SW공학 원칙을 단독으로 정의하지 않는다.
- [ ] 한글/한국 자료는 가능한 범위에서 원출처와 Global Baseline을 역검토한다.
- [ ] Contextual/Korea BP를 사용할 경우 Local/System Constraint와 Adaptation, Trade-off, Preferred State를 설명할 수 있다.
- [ ] Korea WP는 popularity나 비판이 아니라 명확한 failure mechanism이 있고 교육상 필요한 경우에만 사용한다.
- [ ] 국제표준은 Course Decision의 직접 대상이 아닌 한 Reference 역할을 넘어서 Curriculum Spine을 지배하지 않는다.
- [ ] 시점 의존 정보는 최신성 검증이 가능하다.
- [ ] 특정 LLM/vendor/model/UI/API에 Course Concept·Practice·Artifact가 종속되지 않는다.
- [ ] Concept / Principle / Source의 품질·권위를 `Canon` 계열 형용사로 표현하지 않는다. 문맥에 따라 Foundational / Established / Authoritative / Reference / Core로 구체화한다.
- [ ] `Canon`은 Portfolio/Course의 승인된 정본·기준선 authority 의미로만 사용한다.

## 8. Release Gate

릴리스는 다음을 모두 만족해야 한다.

1. 구조 오류 0
2. broken internal reference 0
3. Course ID 불일치 0
4. Practice count/timebox 위반 0
5. Practice 필수 field 누락 0
6. Course Ownership 충돌이 미해결 상태로 남지 않음
7. 현재 릴리스 Audit 1개만 존재
8. Learner Fit / Lens reverse audit 미해결 gap 0
