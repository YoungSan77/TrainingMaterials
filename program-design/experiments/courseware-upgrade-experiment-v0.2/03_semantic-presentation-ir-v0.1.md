# Semantic Presentation IR v0.1

Status: EXPERIMENTAL / NON-CANON
Scope: OOAD S01 pilot only

## 1. 목적

Deep Source와 Render Deck 사이에서 LLM의 교육적·시각적 추론을 보존한다. 이 IR은 PowerPoint layout이나 PptxGenJS shape를 지정하지 않는다.

## 2. 핵심 원칙

1. `Claim`은 Curriculum owner가 소유한다.
2. IR은 Claim을 재정의하거나 새 Course concept를 만들지 않는다.
3. 한 Claim은 1개 이상의 presentation unit으로 전개될 수 있다.
4. `semantic_structure`는 의미 관계를 말한다. renderer primitive를 말하지 않는다.
5. 화면 배치는 compiler/renderer의 책임이다.
6. Visual constraint가 source/curriculum에 명시되면 이를 보존한다.

## 3. Session-level schema

```yaml
session:
  course: ooad
  no: 1
  title: "..."
  source_refs:
    curriculum: "..."
    deep_source: "..."
  narrative:
    opening_question: "..."
    progression:
      - "..."
    closing_takeaway: "..."
  units: []
```

## 4. Presentation Unit schema

```yaml
- id: U01
  claim: C3
  role: explain

  learning_intent:
    learner_should_notice: "..."
    learner_should_be_able_to: "..."

  argument:
    assertion: "..."
    reasoning:
      - "..."
    evidence_or_example:
      - "..."
    boundary_or_caveat:
      - "..."

  semantic_structure:
    kind: causal-chain
    entities:
      - "..."
    relations:
      - from: "..."
        relation: "causes"
        to: "..."

  emphasis:
    primary: "..."
    secondary:
      - "..."
    suppress:
      - "..."

  teaching_move:
    entry: "question | observation | contrast | statement | example"
    learner_action: "..."
    reveal_order:
      - "..."
    misconception_to_surface: "..."

  presentation_constraints:
    exact_code_required: false
    exact_uml_required: false
    quantitative_scale_required: false
    source_visual_hint: null

  trace:
    source_sections:
      - "..."
```

## 5. semantic_structure vocabulary — v0.1

초기에는 최소 어휘만 사용한다.

- `assertion`
- `classification`
- `comparison`
- `transformation`
- `sequence`
- `causal-chain`
- `feedback-loop`
- `hierarchy`
- `boundary`
- `dependency`
- `trade-off`
- `system-map`
- `code-contrast`
- `model-contrast`
- `evidence-pattern`

새 type은 Pilot에서 기존 어휘로 의미를 잃을 때만 추가한다.

## 6. Render Deck과의 관계

예:

```text
semantic_structure = transformation
+ exact_code_required = true
+ primary = responsibility ownership migration
```

Presentation Compiler가 이를 다음처럼 구현할 수 있다.

```text
codepair + direction cue + ownership annotation + concise foot
```

그러나 이 조합은 Semantic IR에 저장하지 않는다.

## 7. 기존 deck 필드 매핑

| Semantic IR | Existing deck |
|---|---|
| claim | claim |
| assertion / learning intent | sub/lead 후보 |
| teaching_move.entry | question/statement 구성 후보 |
| semantic_structure | visual 선택 입력 |
| emphasis.primary | visual hierarchy/foot 후보 |
| boundary_or_caveat | notes/caption/foot 후보 |
| presentation_constraints | visual hard constraint |

이 매핑은 1:1 계약이 아니다. Compiler가 문맥에 따라 조합한다.

## 8. 금지

Semantic IR에 다음을 직접 넣지 않는다.

- x/y/w/h
- font size
- color token
- `visual.type: boxes|versus|flow...`
- PptxGenJS API
- OOAD 전용 renderer instruction

## 9. 성공 판정

IR이 성공하려면:

1. 현재 Deep Source의 의미가 손실되지 않는다.
2. 동일 IR을 다른 layout/render strategy로 표현할 수 있다.
3. LLM 모델을 바꿔도 schema 의미가 유지된다.
4. 기존 Deck IR로 compile 가능하다.
5. Course Canon/ownership을 새로 정의하지 않는다.
