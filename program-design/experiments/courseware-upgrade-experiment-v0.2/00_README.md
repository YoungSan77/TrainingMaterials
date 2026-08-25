# Courseware Upgrade Experiment v0.2

**Status:** WORKING / NON-CANON  
**Date:** 2026-08-25

## 1. Repository placement

이 폴더 자체를 현재 `TrainingMaterials` 저장소 아래 다음 위치에 둔다.

```text
TrainingMaterials/
└─ program-design/
   └─ experiments/
      └─ courseware-upgrade-v0.2/
         ├─ 00_README.md
         ├─ 01_upgrade-approach.md
         ├─ 02_contract-alignment-status.md
         ├─ 03_semantic-presentation-ir-v0.1.md
         ├─ 04_ooad-s01-ab-experiment.md
         ├─ 05_claude-code-handoff.md
         └─ 06_baseline-consistency-map.md
```

ZIP 자체는 Git에 넣지 않는다. 위 폴더의 Markdown 파일만 Git 관리한다.

## 2. Baselines

이 실험은 다음 두 기준선을 **복사하지 않고 참조**한다.

- Portfolio Canon baseline: `course-portfolio-unified-v2.6`
- Engine/courseware baseline: 현재 `TrainingMaterials`

`course-portfolio-unified-v2.6` ZIP은 `experiments/`에 넣지 않는다. Portfolio authority와 course ownership을 판단할 때 참조하는 별도 정본이다.

## 3. Purpose

기존 Canon, Curriculum, Deep Source, deterministic validator, generic renderer를 보존하면서 그 사이에 `Semantic Presentation Plan`을 시험적으로 추가한다.

```text
Portfolio Canon / Course Baseline
        ↓
Curriculum / Deep Source
        ↓
Semantic Presentation Plan     ← experiment
        ↓
Presentation Compiler/Adapter  ← experiment
        ↓
Existing Render Deck Contract
        ↓
Existing Verify
        ↓
Existing Generic Renderer
        ↓
PPTX
```

주목적은 PPT 자동화가 아니라, 동일 Context와 동일 검증 조건에서 LLM의 content/presentation reasoning 가능성을 측정하는 것이다. PPT는 실험 산출물이다.

## 4. Non-goals

- Portfolio v2.6 Governance 변경
- Course ownership 변경
- Curriculum semantic rewrite
- 기존 renderer rewrite
- OOAD-specific renderer logic 추가
- validator 완화/우회
- golden snapshot 임의 갱신
- 특정 LLM에 맞춘 prompt tuning

## 5. Pilot

- Course: OOAD
- Session: 01
- A: 현재 source/deck/PPT
- B: 동일 curriculum/deep source + Semantic Presentation Plan + 기존 verify/renderer

A를 덮어쓰지 않는다.

## 6. Current contract status

`Claim 1:N slides`는 현재 정본이다.

- `커리큘럼 작성 지침`: deep topic에서 1:N 허용
- `engine/verify.js`: 동일 claim을 여러 slide가 담당하는 것을 허용하고 coverage를 검사
- `교재 작성 지침`: 2026-08-25 수작업으로 1:N 규칙에 맞게 정렬 완료

따라서 이 문제는 Claude Code 작업 항목이 아니다.

## 7. Admission rule

Pilot 결과가 유효하더라도 이 문서들을 곧바로 Portfolio Canon으로 승격하지 않는다. Cross-course 재사용성과 비용 대비 효과를 확인한 뒤, 기존 Portfolio Change Protocol에 따라 Governance 또는 engine-level standard로의 승격 여부를 결정한다.
