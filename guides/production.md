# Production Guide

## 입력

완성된 Session Source(Markdown + 참조 자산). Session Source의 semantic content를 바꾸지 않는다.

## 책임

parse, measure, paginate, split, layout, render, visual generation, PPTX generation,
mechanical validation.

## 하지 않는 것

내용 요약, 내용 삭제, 문장 재작성, 새 관계 추론, 교육적 강조 판단, chart type 임의 선택,
UML 의미 변경.

Content drives Renderer. Renderer must not drive Content.

## 현재 엔진

`engine/production/**`

donor(저수준 재사용): `engine/measure.js`, `engine/plantuml/**`

## Visual routing

- UML → PlantUML
- 일반 구조/흐름/관계 → Mermaid
- 정량 Chart → Python/matplotlib

## Behavior

content preservation(생성 후 재파싱해 exact match 확인), automatic pagination, code/table
split, overflow 시 split 또는 fail(내용을 자르거나 폰트를 줄여 억지로 채우지 않음),
collision/overflow validation, deterministic generation(재현 가능한 byte 출력), atomic
output replacement(실패한 생성이 기존 산출물을 덮어쓰지 않음).

## 실행

```bash
npm run produce -- <input.md> --output <output.pptx> [--title <제목>] [--source <출처>]
```

Diagram/Chart는 Markdown 코드 펜스로 지정한다.

- ` ```plantuml:<kind> ` — kind: class/usecase/sequence/communication/collaboration/state/package
- ` ```mermaid `
- ` ```chart ` — JSON spec, `type`은 `bar` 또는 `line`만 지원(자동 선택하지 않는다)
