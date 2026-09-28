# TrainingMaterials

Training material design repository.

Workflow:

Course Design → Session Authoring → Production

현재 상태:

- Course Design: active
- Session Authoring: OOAD S01~S04 기준 예시 유지
- Production: active — `engine/production/`

Course Design:
`courses/*/course-design.md`

Session Authoring baseline:
`courses/ooad/sessions/s01.md`~`s04.md`

Reference knowledge:
`references/sw-engineering/`

Production:
`engine/production/` — Session Source Markdown을 PowerPoint로 렌더링하는 Node.js 파이프라인.

```bash
cd engine/production
node src/cli.js ../../courses/ooad/sessions/s01.md
```

각 단계의 상세 지침은 `guides/course-design-guide.md`, `guides/session-authoring-guide.md`, `guides/production-guide.md`를 따른다. Agent 작업 규칙은 `AGENTS.md`를 따른다.
