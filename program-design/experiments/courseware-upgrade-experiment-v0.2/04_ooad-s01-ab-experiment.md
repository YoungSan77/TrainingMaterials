# OOAD Session 01 — A/B Pilot Experiment

Status: EXPERIMENTAL / NON-CANON

## 1. 목적

현재 pipeline의 문제를 추정으로 고치지 않고, OOAD S01에서 Semantic Presentation Plan 추가가 실제 품질을 개선하는지 확인한다.

## 2. 비교군

### A — Current Baseline

`OOAD curriculum/deep source → current deck generation contract → verify → renderer → current PPT`

기존 `courses/ooad/decks/01.js`와 `out/Course_Session01_Output.pptx`를 보존한다.

### B — Semantic Pilot

`same curriculum/deep source → Semantic Presentation IR → Presentation Compiler → existing deck contract → existing verify → existing renderer → pilot PPT`

## 3. 통제 변수

동일하게 유지:

- Portfolio v2.6
- OOAD Course ownership/scope
- OOAD S01 curriculum/deep source
- quotes/evidence
- existing renderer
- existing deterministic validator
- slide theme/style tokens

변경 변수:

- Deep Source와 Deck 사이 Semantic Presentation Plan 존재 여부

## 4. 측정

### Deterministic

- verify PASS/FAIL
- fatal/warning count
- claim coverage
- render success

### Semantic reviewer rubric

각 항목 1–5, 점수와 반드시 evidence 기록.

- Concept correctness
- Argument depth
- Learning progression
- Claim-to-slide fidelity
- Visual-semantic fit
- Visual variety with purpose
- Redundancy
- Information density
- Instructor usability

### Human edit cost

가장 중요한 실용 지표.

- text edits count
- structural slide edits count
- visual replacement count
- slides accepted unchanged / total
- approximate edit minutes

## 5. 성공 조건

B를 채택하려면 최소 다음을 만족한다.

1. deterministic quality는 A보다 나빠지지 않는다.
2. Course/claim meaning drift가 없다.
3. visual-semantic fit과 argument depth가 명확히 개선된다.
4. human structural/visual edit cost가 감소한다.
5. 새 규칙이 OOAD-specific하지 않다.

단순히 slide가 더 화려해진 것은 성공이 아니다.

## 6. 실패/중단 조건

- Semantic IR가 기존 deck보다 더 verbose하지만 추가 판단 정보를 주지 못함
- compiler가 course-specific conditional로 오염됨
- visual diversity를 위해 의미 없는 layout variation을 생성함
- 기존 renderer/verify를 대규모 rewrite해야만 작동함
- human edit cost가 증가함

## 7. Pilot 산출물

```text
experiment/ooad-s01-semantic/
  semantic-plan.yaml
  compiled-deck.js
  validation.txt
  output.pptx
  evaluation.md
  run-manifest.json
```

원본 `courses/ooad/decks/01.js`와 `out/`은 수정하지 않는다.
