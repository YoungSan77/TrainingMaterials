# TrainingMaterials

Course Design에서 시작해 Session을 저작하고 Production으로 PPTX를 생성하는 교재 저작 시스템이다.

## Structure

```text
Course Design (courses/<course>/course-design.md)
→ Session Authoring (미착수)
→ Production (engine/production/**)
```

Course Design은 과정별 semantic authority다. Session Authoring은 `course-design.md`에서 시작하는 저작 단계이며 아직 산출물이 없다. Production은 Markdown을 입력받아 PPTX를 생성하는 실행 엔진이며, semantic content를 변경하지 않는다.

## Main Areas

- `courses/<course>/course-design.md`: 과정별 Course Design (11개)
- `engine/production/`: Markdown → PPTX Production 엔진
- `engine/measure.js`, `engine/plantuml/`: Production이 사용하는 저수준 측정·PlantUML 렌더링
- `references/sw-engineering/`: 공통 소프트웨어 공학 참고 자료(UML, Larman 등)

## Production 실행

```bash
npm run produce -- <input.md> --output <output.pptx> [--title <제목>] [--source <출처>]
```

Diagram/Chart는 Markdown 코드 펜스로 지정한다.

- UML: ` ```plantuml:<kind> `
- 일반 구조/흐름/관계: ` ```mermaid `
- 정량 Chart(bar/line): ` ```chart ` (JSON spec)

생성 실패 또는 검증 실패 시 기존 출력 파일은 덮어써지지 않는다(atomic replace). 재현 생성 가능한 output(PPTX 등)은 커밋하지 않는다.
