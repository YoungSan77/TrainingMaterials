# TrainingMaterials Repository Manifest

현재 실제로 존재하는 패키지 구성의 등록부.

## Package Tree

```text
TrainingMaterials/
├── AGENTS.md
├── README.md
├── REPOSITORY_MANIFEST.md
├── package.json
├── package-lock.json
├── .gitignore
├── courses/
│   └── <11 course>/course-design.md
├── engine/
│   ├── measure.js
│   ├── plantuml/
│   │   ├── fetch.js
│   │   └── render.js
│   └── production/
│       ├── cli.js
│       ├── markdown.js
│       ├── geometry.js
│       ├── paginate.js
│       ├── render.js
│       ├── validate.js
│       ├── normalize.js
│       ├── mermaidAdapter.js
│       ├── mermaid_worker.mjs
│       ├── chartAdapter.js
│       └── chart_worker.py
└── references/
    └── sw-engineering/
        ├── modeling-conventions.md
        ├── uml/*.md
        ├── larman/*.md
        └── communication.md
```

## Root

| Path | Role | Lifecycle Status |
|---|---|---|
| `.gitignore` | Generated/local exclusion | REQUIRED |
| `AGENTS.md` | Agent 작업 규칙 | REQUIRED |
| `README.md` | Package entry point | REQUIRED |
| `REPOSITORY_MANIFEST.md` | 이 등록부 | REQUIRED |
| `package.json` | Production 실행 스크립트·dependencies | REQUIRED |
| `package-lock.json` | Dependency lock | REQUIRED |

## Courses

| Path | Role | Lifecycle Status |
|---|---|---|
| `courses/*/course-design.md` | 11개 과정의 Course Design | REQUIRED |

## Production Engine

| Path | Role | Lifecycle Status |
|---|---|---|
| `engine/production/**` | Markdown → PPTX Production 엔진(from-scratch, 자체 완결) | REQUIRED |
| `engine/measure.js` | Production이 사용하는 텍스트 폭·줄 수 측정 | REQUIRED |
| `engine/plantuml/{fetch,render}.js` | Production이 사용하는 PlantUML jar 실행/캐시 | REQUIRED |

## Shared Software Engineering References

| Path | Role | Lifecycle Status |
|---|---|---|
| `references/sw-engineering/**` | 공통 UML·Larman·modeling 참고 자료 | REQUIRED |

## Generated and Local Patterns

| Path | Role | Lifecycle Status |
|---|---|---|
| `node_modules/` | Package manager install tree | GENERATED |
| `engine/.cache/` | Production 렌더 중간/캐시 파일 | GENERATED |
| `.DS_Store` under any directory | Finder metadata | DELETE |
