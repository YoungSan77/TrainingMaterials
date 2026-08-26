# TrainingMaterials Repository Manifest

> 현재 패키지 구성의 공식 등록부. Lifecycle과 동기화 규칙은 `portfolio/governance.md`가 소유한다. Git metadata는 등록 대상에서 제외한다. Glob 항목은 같은 role·owner·consumer·status를 가진 artifact 집합을 등록한다.

## Package Tree

```text
TrainingMaterials/
├── portfolio/
│   └── shared-cases/
├── guides/
├── courses/
│   ├── <11 course>/course-design.md
│   └── ooad/
│       ├── ooad-curriculum.md
│       ├── global_config.js
│       └── decks/01.js
├── engine/
│   ├── plantuml/
│   └── render/
├── test/
│   ├── corpus/
│   └── __snapshots__/
├── AGENTS.md
├── README.md
├── REPOSITORY_MANIFEST.md
└── package.json
```

## Root

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `.gitignore` | Repository config | Generated/local exclusion | Repository | Git | REQUIRED |
| `AGENTS.md` | Agent adapter | Current governance operation adapter | Governance | Coding agent | REQUIRED |
| `README.md` | Entry document | Package entry point | Repository | Human operator | REQUIRED |
| `REPOSITORY_MANIFEST.md` | Registry | Persistent artifact와 lifecycle 등록부 | Governance | All contributors | REQUIRED |
| `package.json` | Runtime config | Node scripts와 dependencies | Engine | npm·CI | REQUIRED |

## Portfolio

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `portfolio/governance.md` | Governance | Workflow·authority·lifecycle 정본 | Governance | All stages | REQUIRED |
| `portfolio/portfolio-context.md` | Portfolio standard | Portfolio identity와 과정 현황 | Portfolio | Course Design·Curriculum | REQUIRED |
| `portfolio/principles.md` | Portfolio standard | 공통 engineering principles | Portfolio Principles | Course Design·Curriculum | REQUIRED |
| `portfolio/terminology.md` | Portfolio standard | 공통 vocabulary와 용어 | Portfolio Terminology | All stages | REQUIRED |
| `portfolio/concept-ownership.md` | Portfolio standard | Concept owner와 cross-course boundary | Portfolio Ownership | Course Design·Curriculum | REQUIRED |
| `portfolio/evidence-policy.md` | Portfolio standard | Source verification과 evidence 사용 계약 | Portfolio Evidence | Course Design·Curriculum·Deck | REQUIRED |
| `portfolio/practice-standard.md` | Portfolio standard | 공통 실습 품질 계약 | Portfolio Practice | Course Design·Curriculum | REQUIRED |
| `portfolio/shared-cases/order-domain.md` | Shared case | OOAD·DDD·MSA가 공유하는 최소 Order 상태·규칙 | Portfolio Shared Cases | OOAD·DDD·MSA Curriculum | CONDITIONAL |

## Controlled Annexes

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `guides/과정_설계_지침.md` | Controlled annex | Course Design stage 저작 계약 | Governance | Course Design LLM | REQUIRED |
| `guides/커리큘럼_작성_지침.md` | Controlled annex | Curriculum stage 저작 계약 | Governance | Curriculum LLM | REQUIRED |
| `guides/교재_작성_지침.md` | Controlled annex | Deck stage 저작 계약 | Governance | Deck LLM | REQUIRED |

## Courses

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `courses/*/course-design.md` | Course Design set | 11개 과정의 Curriculum Guardrail | 해당 Course Design | Curriculum LLM·Harness | REQUIRED |
| `courses/ooad/ooad-curriculum.md` | Regression input | 기존 OOAD geometry baseline 재현 입력; 새 Curriculum authority 아님 | Regression Harness | OOAD legacy Deck fixture | WORKING |
| `courses/ooad/global_config.js` | Regression adapter | 기존 OOAD Deck fixture runtime config | Regression Harness | Deck loader | WORKING |
| `courses/ooad/decks/01.js` | Regression fixture | 승인 전 기존 geometry baseline의 render input | Regression Harness | Snapshot runner | WORKING |

## Engine

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `engine/*.js` | Engine core | CLI·Deck loading·schema·validation·geometry·rendering | Engine | Harness·PPT renderer | REQUIRED |
| `engine/render/*.js` | Render core | PPT page·primitive·visual rendering | Engine | PPT renderer | REQUIRED |
| `engine/plantuml/*.js` | Visual adapter | UML fetch와 rendering support | Engine | Verifier·Renderer | CONDITIONAL |

## Test

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `test/corpus.js` | Test runner | Executable failure corpus | Harness Test | npm·CI | REQUIRED |
| `test/corpus/*.js` | Test fixture set | Schema·validation·render regression cases | Harness Test | Corpus runner | REQUIRED |
| `test/corpus/**/*.js` | Test fixture set | Course-level nested regression cases | Harness Test | Corpus runner | REQUIRED |
| `test/corpus/quotes.corpus.md` | Test fixture | Quote parser·verification input | Harness Test | Corpus runner | REQUIRED |
| `test/snapshot.js` | Test runner | Geometry regression comparison | Render Harness | npm·CI | REQUIRED |
| `test/__snapshots__/geometry.json` | Approved regression baseline | Existing Deck geometry golden | Render Harness | Snapshot runner | GENERATED |

## Generated and Local Patterns

| Path | Type | Role | Owner | Consumer | Lifecycle Status |
|---|---|---|---|---|---|
| `node_modules/` | Local dependency | Package manager install tree | `package.json` | Node runtime | GENERATED |
| `engine/.cache/` | Local cache | Renderer intermediate/cache | Engine | Renderer | GENERATED |
| `courses/*/out/` | Generated output | PPTX·PDF·PNG output | Deck + Engine | Delivery·QA | GENERATED |
| `.DS_Store` under any directory | OS metadata | Finder metadata | None | None | DELETE |

## Working Exit Condition

OOAD의 세 WORKING artifact는 새 OOAD Curriculum과 Deck이 승인돼 geometry baseline을 대체하거나, regression consumer가 제거되는 변경 단위에서 GENERATED 또는 DELETE로 귀결한다. 다음 Curriculum LLM의 입력으로 사용하지 않는다.
