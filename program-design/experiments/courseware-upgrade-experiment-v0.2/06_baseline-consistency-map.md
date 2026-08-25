# Baseline Consistency Map v0.2

**Status:** WORKING / NON-CANON

## 1. Why two ZIPs exist

두 ZIP은 같은 저장소에 넣기 위한 경쟁 산출물이 아니다.

| Artifact | Role | Put under `TrainingMaterials/program-design/experiments`? |
|---|---|---|
| `course-portfolio-unified-v2.6` | 11개 과정 Portfolio Canon/기준선 | **No** |
| `courseware-upgrade-experiment-v0.2` | Courseware generation 개선 실험 문서 | **Yes** |

Portfolio ZIP은 기존에 다른 세션에서 확정한 Course Portfolio 기준선이다. 이번 package가 그 내용을 복제하거나 소유하지 않는다.

## 2. Authority relation

```text
course-portfolio-unified-v2.6
  Portfolio Governance / Course Baselines
             │
             │ constrains
             ↓
TrainingMaterials
  Curriculum / Deep Source / Deck / Engine
             │
             │ extended experimentally by
             ↓
program-design/experiments/courseware-upgrade-v0.2
```

Experiment는 위 두 기준선 사이의 의미를 변경하지 않고 presentation-generation pipeline만 시험한다.

## 3. Consistency checkpoints

### Portfolio consistency
- Course Thesis/Scope/Required Decision 유지
- Concept ownership 유지
- Terminology/Principles 재정의 금지
- 특정 LLM/vendor 종속 규칙을 상위 Canon으로 올리지 않음

### TrainingMaterials consistency
- Current authoring guides 사용
- Claim 1:N current contract 사용
- Deep Source 재사용
- Existing verify 유지
- Existing generic renderer 우선 사용
- Existing OOAD S01 A artifact 보존

### Experiment isolation
- B artifact는 별도 생성
- 새 Semantic IR는 Working/Non-Canon
- Pilot 결과가 실패해도 기존 시스템 rollback이 필요 없도록 함

## 4. Promotion decision

Pilot 성공만으로 Portfolio Canon에 넣지 않는다.

다음 질문을 통과해야 한다.

1. OOAD 외 다른 과정에서도 재사용되는가?
2. Human edit cost를 실제로 줄이는가?
3. 특정 모델에서만 작동하지 않는가?
4. Course ownership과 renderer genericity를 보존하는가?
5. 기존 authoring contract로 해결 가능한 일을 중복 모델링하지 않는가?

통과하면 기존 Portfolio Change & Extension Protocol에 따라 정식 owner 위치를 결정한다.
