# TrainingMaterials Agent Rules

## Architecture

Course Design → Session Authoring → Production

세 단계 모두 현재 repository에 실제로 구현되어 있다.

- **Course Design**: `courses/<course>/course-design.md`. 여러 과정(ooad, ddd, msa, devops 등)에 존재한다.
- **Session Authoring**: Session Source Markdown. `courses/ooad/sessions/s01.md`가 목표 품질의 기준 예시다.
- **Production**: `engine/production/`. Session Source Markdown을 실제 PowerPoint(.pptx)로 렌더링하는 Node.js 파이프라인이며, 자동 테스트(`engine/production/src/test/`)를 갖추고 있다.

세 지침 파일이 각 단계의 상세 계약을 정의한다: `guides/course-design-guide.md`, `guides/session-authoring-guide.md`, `guides/production-guide.md`.

그 위에서 `guides/sw-engineering-principles.md`가 모든 과정·세션이 따르는 **SW 공학의 기본 원칙**(결정과 검증, 이벤트 관점, 성숙도와 불확실성, 작게 끝까지, 북·스트리트 스마트, KISS·DRY·YAGNI, 적정 수준)을 정한다. 세 지침은 "어떻게"를, 원칙 문서는 "왜"를 정한다. 원칙의 설명·사례는 참조 자료 `references/sw-engineering-approach/`에 있으며 규칙이 아니다.

## Course Design Authority

각 `courses/<course>/course-design.md`는 다음을 정의한다.

- 총 교육시간
- 대상 / 선수지식
- 과정 목표
- 목차 / 세부 목차
- 세션별 시간
- 세션별 목표
- Anchor Message

별도 Curriculum artifact를 만들지 않는다.
Session DD를 만들지 않는다.

## Session Authoring Baseline

`courses/ooad/sessions/s01.md`는
Session Authoring의 목표 품질을 보여주는 현재 기준 예시다.

삭제하거나 renderer에 맞춰 수정하지 않는다.

Session Authoring은 Course Design을 입력으로
최종 Session Source를 직접 작성한다.

불필요한 중간 artifact를 만들지 않는다.

## Production

`engine/production/`이 현재 사용 중인 renderer다.

```bash
cd engine/production
node src/cli.js ../../courses/ooad/sessions/s01.md
```

Session Source Markdown 하나를 입력받아 같은 디렉터리에 같은 basename의 `.pptx`를 생성한다. 상세 계약(Typography, TOC 생성, visual 처리, pagination, 검증 절차 등)은 `guides/production-guide.md`를 따른다.

`references/production/lecture-java-baseline/`은 `~/dev/lecture-ppt-java`(검증된 Markdown → PowerPoint 동작을 가진 Java 원본)에서 이식한 behavior를 regression baseline으로 보존한 것이다. 새 기능을 추가할 때 이 baseline이 깨지지 않는지 확인한다.

Content drives Renderer.
Renderer must not drive Content.

renderer 한계 때문에 Session Source를 수정하지 않는다. 지원되지 않는 Markdown/visual type이 필요하면 renderer를 확장한다.

## 변경 시 확인할 것

- `engine/production/`을 수정하면 `cd engine/production && node --test src/test/*.test.js`로 전체 테스트를 통과시킨다.
- `guides/*.md` 중 하나의 내용(수동 목차 정책, 의미 표식 문법, typography 규칙 등)을 바꾸면, 그 계약을 실제로 구현하는 `engine/production/src/`의 코드와 테스트도 함께 갱신한다. 지침 문서 수정만으로 구현이 완료됐다고 간주하지 않는다.
- 세 지침 파일과 `sw-engineering-principles.md`는 서로를 파일명으로 참조한다. 파일을 이동·rename하면 상호 참조도 함께 갱신한다.
- 기본 원칙을 바꾸면 그 원칙을 적용하는 지침(과정 설계·세션 작성)의 해당 항목과 참조 자료도 함께 점검한다.
