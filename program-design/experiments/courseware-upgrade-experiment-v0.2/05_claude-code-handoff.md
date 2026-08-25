# Claude Code Handoff — OOAD S01 Semantic Presentation Pilot v0.2

**Status:** EXECUTION CONTRACT / NON-CANON

## Objective

현재 TrainingMaterials와 Portfolio v2.6의 의미를 보존한 상태에서 OOAD Session 01에 `Semantic Presentation Plan`을 추가하고, 기존 Deck/Verify/Renderer와 비교 가능한 B artifact를 만든다.

좋은 PPT를 자유롭게 재설계하는 작업이 아니다. 기존 architecture를 보존한 controlled experiment다.

## Authoritative inputs

1. Current `TrainingMaterials` repository
2. `program-design/experiments/courseware-upgrade-v0.2/*`
3. Portfolio baseline `course-portfolio-unified-v2.6` — reference only
4. Existing OOAD Session 01 curriculum/deep source/deck/output
5. Current authoring guides

상충 시 Portfolio/Course authority와 현재 authoring contract를 우선한다. Experiment 문서는 Canon을 재정의하지 않는다.

## Important resolved item

`Claim 1:N slides` 정렬은 이미 완료됐다. `교재 작성 지침`을 다시 수정하지 말고 현재 repository 내용을 정본으로 사용한다.

## Work sequence

### 1. Baseline inspection
- current OOAD S01 curriculum/source/deck/output 경로 확인
- current verify/renderer 실행 경로 확인
- `git status` 확인
- 실험 전에 기존 파일을 임의 수정하지 않음

### 2. Preserve A
기존 OOAD S01 source/deck/PPT를 A baseline으로 기록한다. 기존 산출물을 overwrite하지 않는다.

### 3. Create experiment workspace
권장 위치:

```text
program-design/experiments/courseware-upgrade-v0.2/runs/ooad-s01/
```

실제 generated artifact가 기존 repository convention상 다른 위치가 더 적절하면, 기존 구조를 우선하되 A와 B가 명확히 분리되어야 한다.

### 4. Produce Semantic Presentation Plan
`03_semantic-presentation-ir-v0.1.md`를 적용하여 OOAD S01의 의미와 teaching intent를 표현한다.

금지:
- Curriculum claim 재작성
- Course ownership 변경
- 단순히 현재 deck을 YAML로 옮기기
- visual type부터 선택하기

### 5. Compile/Adapt to current Render Deck
최소한의 generic compiler/adapter를 사용한다.

원칙:
- existing visual primitives를 우선 재사용
- OOAD-specific rendering code 금지
- renderer API/validator contract를 불필요하게 변경하지 않음
- 새 primitive가 꼭 필요하면 먼저 generic necessity와 cross-course reuse 가능성을 보고함

### 6. Validate and repair
현재 authoring guide의 Definition of Done을 따른다.

```text
generate → verify → repair → verify → ... → PASS → render
```

- validator를 우회/완화하지 않는다.
- validator/test를 변경해서 artifact를 통과시키지 않는다.
- PASS를 만든 최종 source와 PPT가 대응해야 한다.

### 7. Produce B without replacing A
B output과 validation log를 별도 보존한다.

### 8. Evaluate A/B
다음을 근거와 함께 비교한다.

- Concept correctness
- Argument depth
- Learning progression
- Claim-to-slide fidelity
- Visual-semantic fit
- Purposeful visual variety
- Redundancy
- Information density
- Instructor usability
- Human edit cost proxy

단순 미학 점수만 사용하지 않는다.

## Required deliverables

최소 다음을 남긴다.

```text
semantic-plan.yaml
compiled-deck.*
validation.txt
B-output.pptx
comparison.md
run-manifest.json
```

`run-manifest.json`에는 가능한 범위에서 다음을 기록한다.

```text
portfolio baseline
engine/repository commit
curriculum/source/deck identifiers or hashes
model/provider
run date
validator result
render result
human edits if any
```

## Do not

- rewrite engine architecture
- add OOAD-specific renderer rules
- weaken validation
- overwrite A/golden without explicit instruction
- change curriculum semantics
- modify Portfolio v2.6 Canon
- tune the experiment around Claude-specific quirks
- report completion before deterministic PASS and successful render

## Completion report

마지막 보고는 다음 순서로 한다.

1. Files created/changed
2. Existing files intentionally untouched
3. Validation result
4. A/B result
5. Remaining limitations
6. Recommendation: KEEP / REVISE / DROP
