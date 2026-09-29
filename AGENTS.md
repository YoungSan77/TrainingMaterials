# TrainingMaterials Agent Rules

## Architecture

Course Design → Session Authoring → Production

- **Course Design**: `courses/<course>/course-design.md`. 여러 과정(ooad, ddd, msa, devops 등)에 존재한다.
- **Session Authoring**: Session Source Markdown. `courses/ooad/sessions/s01.md`~`s05.md`가 목표 품질의 기준 예시다(s01 개요, s02~s05 상세).
- **Production**: `engine/production/`. Session Source Markdown을 실제 PowerPoint(.pptx)로 렌더링하는 Node.js 파이프라인이며, 자동 테스트(`engine/production/src/test/`)를 갖추고 있다.

세 지침 파일이 각 단계의 상세 계약을 정의한다: `guides/course-design-guide.md`, `guides/session-authoring-guide.md`, `guides/production-guide.md`.

그 위에서 `guides/sw-engineering-principles.md`가 모든 과정·세션이 따르는 **SW 공학의 기본 원칙**(결정과 검증, 이벤트 관점, 성숙도와 불확실성, 작게 끝까지, 북·스트리트 스마트, KISS·DRY·YAGNI, 적정 수준)을 정한다. 세 지침은 "어떻게"를, 원칙 문서는 "왜"를 정한다. 원칙의 설명·사례는 참조 자료 `references/sw-engineering-approach/`에 있으며 규칙이 아니다.

## Course Design Authority

각 `courses/<course>/course-design.md`는 과정 전체의 의미 구조와 세션 경계를 정의한다. 필수 항목(교육시간, 대상·선수지식, 과정 목표, 과정의 맥락, 관통 사례와 **공통 전제**, 목차·세부 목차, 세션별 시간·목표, Anchor Message 등)은 `guides/course-design-guide.md`의 「필수 항목」이 정한다.

## Session Authoring Baseline

`courses/ooad/sessions/s01.md`~`s05.md`는 Session Authoring의 목표 품질을 보여주는 현재 기준 예시다. `s01`은 개요 세션, `s02`~`s05`는 상세 세션의 수준이다.

삭제하거나 renderer에 맞춰 수정하지 않는다.

- 관통 사례의 공통 식별자(용어·상태 값·흐름 번호·이벤트 이름·외부 시스템)는 `course-design.md`의 공통 전제가 원천이다. 세션이 발견해 더한 값은 진화, 다른 이름·규칙은 오류다(`guides/sw-engineering-principles.md`).
- 예시 코드의 전체 원본은 `courses/<course>/sessions/code/sNN/`에 두고 컴파일·실행으로 확인한다. 슬라이드의 코드는 그 발췌다.
- 기준 품질은 Production 검사의 **오류·경고 0개**를 포함한다.

Session Authoring은 Course Design을 입력으로
최종 Session Source를 직접 작성한다.

불필요한 중간 artifact를 만들지 않는다.

## Production

`engine/production/`이 현재 사용 중인 renderer다.

```bash
cd engine/production
node src/cli.js ../../courses/ooad/sessions/s01.md
```

Production — renderer 코드, 템플릿(`engine/production/template/`), 테스트 — 은 LLM이 지침에 맞춰 관리한다. 사용자의 승인을 기다리는 별도 자산이 없으며, 지침을 구현하는 데 필요한 변경은 코드·템플릿·테스트를 함께 고친다.

Session Source Markdown 하나를 입력받아 같은 디렉터리에 같은 basename의 `.pptx`를 생성한다. 상세 계약(Typography, TOC 생성, visual 처리, pagination, 검증 절차 등)은 `guides/production-guide.md`를 따른다.

Content drives Renderer.
Renderer must not drive Content.

renderer 한계 때문에 Session Source를 수정하지 않는다. 지원되지 않는 Markdown/visual type이 필요하면 renderer를 확장한다.

## 과거 방식으로 되돌리지 않기

현재 규칙은 이 파일과 `guides/`의 지침에만 있다. 과거의 산출물은 비교하거나 복원할 기준이 아니다.

- 제거한 중간 산출물 — 과정별 Curriculum(`<course>-curriculum.md`)과 세션 상세 설계(Session DD, `sNN-detailed-design.md`) — 을 다시 만들지 않는다. Session Authoring은 `course-design.md`에서 Session Source로 바로 간다.
- 예전에 생성한 PPT, git history의 이전 원고·지침은 내용·시각의 기준이 아니다. 현재 지침과 다르면 지침을 따른다.
- 제거한 renderer 부분 — 외부 승인 템플릿(`approved.pptx`), 고정 페이지 레이아웃(`--layout compact|reference`, `layout-profile.xml`) — 을 되살리지 않는다. 뼈대는 `engine/production/template/` 하나다.
- `references/production/`은 사용자가 참고하려고 보관하는 폴더다(`approved.pptx` 원본). LLM은 이 폴더를 읽거나 비교·복사·복원의 근거로 쓰지 않고, 수정·삭제하지도 않는다.
- renderer의 회귀는 참조 폴더와의 비교가 아니라 테스트로 막는다(`guides/production-guide.md`의 「Regression」).

## 변경 시 확인할 것

- `engine/production/`을 수정하면 `cd engine/production && node --test src/test/*.test.js`로 전체 테스트를 통과시킨다. 테스트는 과정 원고가 아니라 고정 fixture를 쓰므로 원고 수정이 테스트를 깨뜨리지 않는다. 테스트 범위와 실패 시 대응은 `guides/production-guide.md`의 「Regression」을 따른다.
- `guides/*.md` 중 하나의 내용(수동 목차 정책, 의미 표식 문법, typography 규칙 등)을 바꾸면, 그 계약을 실제로 구현하는 `engine/production/src/`의 코드와 테스트도 함께 갱신한다. 지침 문서 수정만으로 구현이 완료됐다고 간주하지 않는다.
- 세 지침 파일과 `sw-engineering-principles.md`는 서로를 파일명으로 참조한다. 파일을 이동·rename하면 상호 참조도 함께 갱신한다.
- 기본 원칙을 바꾸면 그 원칙을 적용하는 지침(과정 설계·세션 작성)의 해당 항목과 참조 자료도 함께 점검한다.
