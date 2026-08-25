# Courseware Generation Upgrade Approach v0.2

**Status:** WORKING / NON-CANON

## 1. Problem statement

현재 시스템은 다음 영역에서 이미 강하다.

- Portfolio/Course Canon
- Curriculum 및 Deep Source
- Claim traceability
- Deterministic validation
- Generic rendering
- Regression corpus

실제 PPT 품질의 주 병목은 renderer의 존재 자체보다 `Deep Source → Render Deck` 사이에서 presentation reasoning이 너무 일찍 구체 visual type/layout으로 축약되는 데 있다.

따라서 기존 시스템을 재작성하지 않고 중간 의미 계층을 추가한다.

## 2. Target architecture

```text
Portfolio Governance
        ↓
Course Baseline
        ↓
Curriculum / Deep Source
        ↓
LLM Content Reasoning
        ↓
Semantic Presentation Plan
        ↓
Presentation Compiler / Adapter
        ↓
Existing Render Deck
        ↓
Existing Deterministic Verify
        ↓
Existing Generic Renderer
        ↓
PPTX
        ↓
Semantic + Human Evaluation
```

## 3. Responsibility boundaries

### Portfolio / Course Canon
소유권, 원칙, 과정 범위, 용어, 학습자가 내려야 할 판단을 소유한다.

### Curriculum / Deep Source
무엇을 가르쳐야 하는지, 근거와 설명 깊이, claim을 소유한다.

### Semantic Presentation Plan
학습자가 무엇을 알아차려야 하는지와 의미 관계를 표현한다. 화면 좌표와 renderer 구현은 소유하지 않는다.

### Presentation Compiler / Adapter
Semantic Plan을 현재 Render Deck contract로 변환한다. Course-specific business rule을 갖지 않는다.

### Render Deck
PPT 생성에 필요한 실행 가능한 Presentation IR이다. 최상위 의미 모델이 아니다.

### Verify
기존 deterministic contract를 유지한다. 새 기능을 통과시키기 위해 완화하지 않는다.

### Renderer
generic presentation primitives를 렌더링한다. OOAD/DDD/DevOps 등의 도메인 의미를 알지 않는다.

## 4. Change strategy

### Phase 0 — Baseline protection
- Portfolio `course-portfolio-unified-v2.6`을 기준선으로 참조한다.
- 현재 TrainingMaterials의 OOAD S01 source/deck/output을 A baseline으로 보존한다.
- 기존 validator와 renderer를 변경하지 않는 상태에서 실험을 시작한다.

### Phase 1 — Semantic IR only
OOAD S01에 대해 `Semantic Presentation Plan`을 작성한다. PPT를 먼저 고치지 않는다.

### Phase 2 — Minimal compiler/adapter
Semantic IR를 기존 deck contract로 변환하는 최소 adapter를 만든다. 새로운 visual primitive가 반드시 필요하지 않으면 renderer를 변경하지 않는다.

### Phase 3 — A/B render
A와 B를 동일 verify/renderer로 생성한다.

### Phase 4 — Evaluation
세 층으로 평가한다.

1. Deterministic: PASS/FAIL, coverage, fatal/warning, render success
2. Semantic: argument depth, learning progression, visual-semantic fit, redundancy
3. Economic: human edit cost, accepted-slide ratio, correction time

### Phase 5 — Decision
다음 중 하나를 선택한다.

- **KEEP:** Semantic layer가 품질/비용에 유의미한 개선을 준다.
- **REVISE:** 방향은 맞지만 IR/compiler가 과도하거나 부족하다.
- **DROP:** 기존 Deep Source → Deck 방식보다 비용 대비 효과가 없다.

## 5. Contract alignment status

과거 `교재 작성 지침 v1.9`에 남아 있던 `Claim 1:1` 규칙은 stale 문서였다. 현재는 사용자가 직접 `1:N` 기준으로 수정 완료했다.

따라서 현재 실험 전제는 다음이다.

```text
Shallow topic:
  claim 1:1 slide를 기본으로 사용할 수 있음

Deep topic:
  each claim coverage >= 1
  one claim may expand to N slides
  each slide must have a distinct teaching/presentation role
```

이 사항은 더 이상 선행 작업 blocker가 아니다.

## 6. Design principles

1. Semantic consistency와 layout consistency를 동일시하지 않는다.
2. Slide count가 내용을 결정하지 않는다. 내용과 학습 전개가 slide count를 결정한다.
3. `1 primary visual narrative + N supporting elements`를 허용한다.
4. 정확성이 필요한 engineering representation은 vector/code/UML/chart를 우선한다.
5. 생성 이미지는 metaphor/situation/illustrative context에 제한한다.
6. 특정 LLM의 습관을 보정하기 위한 prompt-specific 구조를 Canon으로 만들지 않는다.

## 7. Preconditions

- Deep Source가 충분한 설명 깊이를 갖는다.
- 기존 Deck/Verify/Renderer baseline을 재현할 수 있다.
- A와 B가 동일 Course meaning을 사용한다.

## 8. Trade-off

새 계층과 adapter가 추가되어 pipeline complexity가 증가한다. 대신 LLM reasoning과 renderer capability를 분리하여 교체·비교할 수 있고, visual type 증가만으로 문제를 해결하려는 비용을 줄인다.

## 9. Failure conditions

다음 중 하나가 발생하면 Pilot을 중단하거나 설계를 축소한다.

- Semantic IR가 Curriculum 내용을 다시 소유하기 시작함
- Compiler에 OOAD-specific rule이 들어감
- validator를 완화해야만 B가 통과함
- 같은 품질을 기존 deck authoring으로 더 싸게 얻을 수 있음
- human edit cost가 줄지 않음
