# Contract Alignment Status v0.2

**Status:** WORKING / NON-CANON

## 1. Claim cardinality — RESOLVED

과거 상태:

- `engine/verify.js`: Deep Source를 위해 `Claim 1:N slides` 허용
- `커리큘럼 작성 지침`: deep topic에서 1:N 허용
- `교재 작성 지침 v1.9`: `1 claim = 1 slide`가 남아 있었음

2026-08-25 사용자 수작업으로 `교재 작성 지침`을 현재 1:N 규칙에 맞게 수정했다.

### Current rule

```text
Shallow session/topic:
  claim 1:1 slide can be the normal/default mapping.

Deep-source session/topic:
  every claim must be covered by at least one slide.
  one claim may be expanded across multiple slides.
  multiple slides for one claim must have distinct roles rather than duplication.
```

### Decision

이 항목은 더 이상 Pilot blocker가 아니며 Claude Code가 수정할 작업도 아니다.

---

## 2. Visual ownership — OPEN DESIGN QUESTION

현재 Curriculum/Deck에서 visual type을 지정하는 경우가 있다. Pilot은 다음 두 종류를 구분한다.

### Semantic constraint — preserve
의미·정확성 때문에 특정 표현이 필요한 경우.

예:
- exact before/after code comparison
- UML notation
- quantitative chart
- required architecture boundary

### Presentation choice — planner candidate
내용을 이해시키는 여러 표현 중 하나를 선택하는 경우.

예:
- comparison을 side-by-side로 할지 transformation으로 할지
- causal relation을 flow/annotated diagram으로 구성할지
- 한 primary visual에 어떤 callout을 결합할지

Pilot에서는 기존 Curriculum의 explicit visual 지정을 무시하지 않는다. Semantic Plan은 이를 constraint로 받아들인다.

---

## 3. Completion state — EXISTING RULE, RECORD EXPLICITLY

교재 작성 지침은 LLM에게 제공되며 validation 실행/통과가 작업 완료 조건에 포함된다. 이번 실험에서는 새 prompt 규칙을 만드는 대신 결과 상태를 명확히 기록한다.

```text
generated  = artifact 작성 완료
validated  = deterministic validator PASS
rendered   = validated source로 PPT 생성 성공
accepted   = human review 통과
```

`generated`를 `validated`와 혼동하지 않는다.

---

## 4. Portfolio authority boundary — CONFIRMED

`course-portfolio-unified-v2.6`의 Authority Order를 따른다.

```text
Portfolio Governance
→ Course Baseline
→ Course Asset / Source Evidence
→ Audit / External or Legacy Material
```

이번 실험은 Portfolio Canon을 수정할 권한이 없다. 따라서:

- `course-portfolio-unified-v2.6` ZIP을 experiment 폴더에 복사하지 않는다.
- Course Baseline을 변경하지 않는다.
- 결과는 Working/Non-Canon으로 유지한다.
- cross-course 유효성이 확인된 뒤 Change Protocol에 따라 승격 여부를 판단한다.

---

## 5. Pilot gate

- [x] Claim cardinality 1:N 정렬
- [ ] 기존 OOAD S01 source/deck/output A baseline 보존
- [ ] Semantic IR가 Course ownership을 변경하지 않는지 확인
- [ ] Renderer에 OOAD-specific logic이 들어가지 않는지 확인
- [ ] Existing verify 우회/완화 없음
- [ ] B 결과 별도 경로 생성
- [ ] A/B evaluation 기록
