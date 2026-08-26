# TrainingMaterials

Portfolio Guardrail에서 Course Design, Curriculum과 Deck을 생성하고 Harness와 Engine으로 검증·렌더링하는 교육자료 저작 시스템이다.

## Authoritative Workflow

```text
User Intent
→ Portfolio ↔ Current Course Design
→ Curriculum LLM → Curriculum Harness
→ Deck LLM → Deck Harness
→ Engine / PPT
```

Workflow, authority와 artifact lifecycle의 정본은 `portfolio/governance.md`, 현재 패키지 등록부는 `REPOSITORY_MANIFEST.md`다. 저작 방법은 `guides/`의 controlled annex를 따른다.

## Main Areas

- `portfolio/`: Governance와 Portfolio Common Standards
- `courses/<course>/course-design.md`: 과정별 Curriculum Guardrail
- `guides/`: Course Design, Curriculum, Deck stage annex
- `engine/`: executable validation과 PPTX rendering
- `test/`: regression harness와 승인된 baseline

Curriculum, Deck과 generated output은 Manifest의 lifecycle status에 따라 존재한다. 과거 구조나 Git history는 live authority가 아니다.

## Commands

```bash
npm run doctor
npm run check -- <deck>
npm run build -- <deck>
npm run course -- <course-directory>
npm run corpus
npm test
```

PPTX·PDF·PNG 등 재생성 가능한 output은 승인된 regression baseline이 아니면 커밋하지 않는다.
