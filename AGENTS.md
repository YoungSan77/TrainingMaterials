# TrainingMaterials Agent Rules

## Architecture

Course Design → Curriculum / Session Architecture → Session Authoring → Production

`guides/governance.md`가 단계별 정본·승인·변경 통제·협업 책임을 정한다. 상세 계약은 `guides/course-design-guide.md`, `guides/curriculum-guide.md`(Curriculum / Session Architecture), `guides/session-authoring-guide.md`, `guides/production-guide.md`를 따른다. 현재 Markdown 입력과 PPTX Renderer는 `engine/production/`에 있다.

기존 과정 작업은 기록에 연결된 승인 기준선에서 재개한다. 과정의 현재 상태와 남은 자료의 성격은 그 과정의 `checks/STATUS.md`가 적는다.

`guides/agentic-repository-guide.md`는 **이 저장소 자체를 agentic 시스템으로 운영하는 계약**이다. 저장소의 구성 요소를 맥락·가드레일·하네스·추적으로 가르고, 금지를 환경으로 옮기는 기준과 센서를 더하는 규칙을 정한다. 교재의 내용은 정하지 않는다.

모든 과정은 `guides/sw-engineering-principles.md`의 SW 공학 기본 원칙을 따른다. 설명·사례는 `references/sw-engineering-approach/`에 있다.

## Course Design Authority

과정의 목적·범위·공통 전제는 Course Design, 세션 간 경계·시간·목표·Anchor Message는 Curriculum, 세션의 교수 흐름과 교육 내용은 그 세션의 Session Source를 확인한다.

## Session Authoring Baseline

`courses/ooad/sessions/s01.md`~`s05.md`는 Session Authoring의 목표 품질을 보여주는 현재 기준 예시다. `s01`은 개요 세션, `s02`~`s05`는 상세 세션의 수준이다.

삭제하거나 renderer에 맞춰 수정하지 않는다.

- 관통 사례의 공통 식별자(용어·상태 값·흐름 번호·이벤트 이름·외부 시스템)는 `course-design.md`의 공통 전제가 원천이다. 세션이 발견해 더한 값은 진화, 다른 이름·규칙은 오류다(`guides/sw-engineering-principles.md`).
- 예시 코드의 전체 원본은 `courses/<course>/sessions/code/sNN/`에 두고 컴파일·실행으로 확인한다. 슬라이드의 코드는 그 발췌다.
- 기준 품질은 Production 검사의 **오류·경고 0개**를 포함한다.

Deck의 필수 설계 입력과 산출물은 Governance의 단계 계약을 따른다.

## Production

`engine/production/`이 현재 사용 중인 renderer다.

실행은 **저장소 루트에서 한 줄**로 한다. `cd`로 디렉터리를 옮기지 않는다 — 복합 명령은 허용 목록(`.claude/settings.json`)과 어긋나 실행마다 승인을 요구한다.

```bash
node engine/production/src/cli.js courses/ooad/sessions/s01.md
node engine/production/src/cli.js --check courses/ooad/sessions/s01.md
node --test engine/production/src/test/*.test.js
```

Production — renderer 코드, 템플릿(`engine/production/template/`), 테스트 — 은 LLM이 지침에 맞춰 관리한다. 사용자의 승인을 기다리는 별도 자산이 없으며, 지침을 구현하는 데 필요한 변경은 코드·템플릿·테스트를 함께 고친다.

Session Source Markdown 하나를 입력받아 같은 디렉터리에 같은 basename의 `.pptx`를 생성한다. 상세 계약(Typography, TOC 생성, visual 처리, pagination, 검증 절차 등)은 `guides/production-guide.md`를 따른다.

Content drives Renderer.
Renderer must not drive Content.

renderer 한계 때문에 Session Source를 수정하지 않는다. 지원되지 않는 Markdown/visual type이 필요하면 renderer를 확장한다.

## 규칙의 원천

공통 규칙은 이 파일과 `guides/`에, 과정 고유의 정책·제작 기준은 해당 `courses/<course>/`에 두고 과정 설계에서 참조한다. 과거의 산출물은 비교하거나 복원할 기준이 아니다.

- Curriculum은 세션 편성의 정본이고 Session Source는 교육 내용의 정본이다. **세션의 상세 설계는 Session Authoring의 구성안 검토로 하고 별도 정본 문서로 만들지 않는다.** 별도 중복 정본의 기준은 Governance를 따른다.
- 예전에 생성한 PPT, git history의 이전 원고·지침은 내용·시각의 기준이 아니다. 현재 지침과 다르면 지침을 따른다.
- Production의 뼈대는 `engine/production/template/` 하나다. 외부 승인 템플릿이나 고정 페이지 레이아웃 설정을 두지 않는다.
- `references/production/`은 사용자가 참고하려고 보관하는 폴더다(`approved.pptx` 원본). LLM은 이 폴더를 읽거나 비교·복사·복원의 근거로 쓰지 않고, 수정·삭제하지도 않는다. 이 금지는 글이 아니라 환경이 막는다 — `tools/protected-path-hook.js`가 그 경로에 닿는 도구 호출을 **읽기까지** 거절한다(hook 등록은 사용자가 `.claude/settings.json`에서 한다). 거절되면 다른 방법으로 돌아가지 않고, 필요한 것이 무엇인지 사용자에게 말한다.
- renderer의 회귀는 참조 폴더와의 비교가 아니라 테스트로 막는다(`guides/production-guide.md`의 「Regression」).

## 변경 시 확인할 것

- `engine/production/`을 수정하면 `node --test engine/production/src/test/*.test.js`로 전체 테스트를 통과시킨다. 테스트는 과정 원고가 아니라 고정 fixture를 쓰므로 원고 수정이 테스트를 깨뜨리지 않는다. 테스트 범위와 실패 시 대응은 `guides/production-guide.md`의 「Regression」을 따른다.
- 실행 계약이 바뀌면 지침에 요구사항과 현재 구현 상태를 구분해 기록한다. 구현이 작업 범위에 포함될 때 Renderer와 테스트를 함께 갱신한다.
- 지침을 이동하거나 이름을 바꾸면 참조를 함께 갱신한다.
- hook·권한·센서·기록을 더하거나 바꾸면 `guides/agentic-repository-guide.md`의 해당 표를 함께 갱신한다. 그 문서에 적히지 않은 계약은 다음 수정에서 근거 없이 사라진다.
- 기본 원칙을 바꾸면 그 원칙을 적용하는 지침(과정 설계·세션 작성)의 해당 항목과 참조 자료도 함께 점검한다.

## 작업 운영

같은 품질을 적은 반복으로 낸다. 다시 만들기·전체 재확인·원전 재탐색이 작업 비용의 대부분이었다.

- **선행 실습 산출물을 읽는다** — 후속 세션의 실습 투입물은 `guides/agentic-repository-guide.md`의 「선행 실습 산출물 찾기」에 따라 저장소의 과정 기록에서 찾아 읽는다.
- **실습 실행·검증 요청은** `guides/session-authoring-guide.md`의 「실습 검증과 Production 연결」을 따른다. 제작까지 요청받으면 해당 절의 코드 대조와 Production 검증도 수행한다.
- **작업할 과정을 먼저 확정한다** — `courses/ACTIVE` 한 줄이 지금 작업하는 과정이다. 세션 번호만 있는 지시("S06 시작")는 그 파일과 그 과정의 `checks/` 진행 파일(`rewrite-pending.json`, 검토 기록)로 확정한 뒤에 시작한다. 기억이나 **다른 과정의 진행 기록으로 추정하지 않는다**. `courses/ACTIVE`는 사용자의 지시로만 바꾼다. 다른 과정의 파일을 쓰려 하면 `tools/active-course-hook.js`가 거절한다(읽기는 막지 않는다).
- **보고에는 과정 경로를 쓴다** — 두 과정에 같은 파일명(`s04.pptx`)이 있어 번호만 쓰면 어느 과정인지 알 수 없다. 장수·검사 결과를 말할 때 `courses/<course>/sessions/sNN`을 함께 적는다.
- **지침을 먼저 읽는다** — Governance에서 대상 변경의 소유 단계와 승인 입력을 확인하고 해당 단계 지침을 읽는다. 세션 원고 작업에서는 승인 Curriculum·Course Design과 Session Authoring·Production 지침을 대조한다.
- **인용은 원문 확인부터** — 구성안을 보이기 전에 `node tools/verify-quote.js`로 영문 인용을 확인하고 출처 레이블을 확정한다. 웹 검색 요약이나 기억으로 인용·출처를 적지 않는다. 확인하지 않은 인용은 Production이 경고하며 완료 기준을 넘지 못한다.
- **승인과 피드백** — Governance의 단계별 게이트와 변경 범위를 따른다. 명시적인 보완 지시는 그 범위 작업의 근거로 기록한다. 상위 기준과 충돌하거나 의미가 불분명하면 영향과 대안을 알리고 필요한 판정을 받는다. **무엇을 묻고 무엇을 묻지 않는지는 Governance 「책임과 승인」의 두 목록을 따른다** — 설계·의미·범위의 확정과 변경, 최종 수용, 되돌리기 어려운 일과 상위 계약 충돌은 승인을 받고, 승인 범위 안의 작성·제작·검사·오류 수정·표현 개선과 기계적 후속은 묻지 않고 수행한 뒤 보고한다. 이미 승인된 같은 범위의 확인을 반복하지 않는다.
- **커밋** — 사용자가 명시적으로 요청할 때만 한다. 작업 종료 시 커밋 여부를 묻지 않는다.
- **승인 창을 만들지 않는 명령** — 승인 창의 대부분은 질문이 아니라 **허용 목록에 걸리지 않는 Bash 명령**에서 나온다(`.claude/settings.json`). 다음을 지킨다(2026-10-24).
  - **파일을 고치는 일은 Edit·Write 도구로 한다.** `python3 - <<EOF`, `cat > 파일 <<EOF`, `sed -i`로 원고·지침·코드를 고치지 않는다 — 여러 줄 명령은 허용 목록이 알아보지 못해 실행마다 승인을 요구한다. 치환이 많아도 Edit를 여러 번 부르는 쪽이 승인 창이 없다.
  - **Bash는 허용 목록에 있는 명령 하나로 쓴다.** `&&`로 잇지 않고, `set -e`·`for`·변수 대입 같은 여러 줄 스크립트를 쓰지 않으며, `OUT=…` 같은 환경 변수 접두어와 `cd`를 붙이지 않는다.
  - 같은 도구를 여러 입력에 돌릴 때는 **인자를 여러 개 주는 한 번의 명령**으로 한다(`node engine/production/src/cli.js a.md b.md c.md`). 반복이 필요하면 `tools/`에 스크립트를 두고 한 줄로 부른다.
  - 허용 목록에 없어 승인이 뜬 명령은 작업 끝에 보고하고, 필요한 줄을 사용자가 `.claude/settings.json`에 더하게 한다. LLM은 그 파일을 고치지 않으며, `tools/protected-path-hook.js`가 그 파일을 **쓰는** 호출을 거절한다. 읽기는 막지 않는다 — 지금 무엇이 허용돼 있는지는 알아야 한다.
- **모아서 한 번에** — 검토에서 찾은 문제는 목록으로 모아 한 번에 고치고 한 번 렌더링한다. 문제마다 렌더링하지 않는다.
- **수치가 답이면 먼저 잰다** — 글 높이·비율·장 수처럼 계산으로 나오는 결정은 스크립트로 재서 값을 정한 뒤 렌더링한다. 고치고 렌더링해 보고 다시 고치는 순서로 경계값을 찾지 않는다.
- **범위만큼 검사** — 원고만 바꾸면 그 세션만 렌더링한다. topic 번호를 바꿨으면 그 세션을 참조하는 원고를 `node src/cli.js --check <원고…>`로 검사만 한다. 전체 테스트와 모든 세션의 재렌더링은 renderer·템플릿을 바꿨을 때만 한다.
- **수정 중에는 필요한 장, 최종에는 전 장 검토** — Production 제작 검증의 수정 반복에서는 `tools/review-pdf.sh <원고> <장…>`으로 도식·표·코드가 있는 장과 바뀐 장만 보고, 최종 PPTX는 같은 입력 버전으로 전 장을 렌더링해 확인한다. 자동 검사의 오류·경고와 실제 렌더 검증을 구분하고 미해결·미확인 항목을 기록한다. SA 완료의 선행 조건은 아니며, 확인하지 않은 필수 항목이 있으면 제작 검증 미완료로 보고한다. 이미지는 **눈으로만 알 수 있는 것**(겹침·잘림·넘침·배치)에 쓴다.
- **이미지 대신 파일로 확인** — 장 수·단 수·어느 장이 바뀌었는지는 `.pptx`를 풀어 좌표를 grep하면 알 수 있다(두 단의 왼쪽 단은 `x="233172"`, 오른쪽 단은 `x="4572000"`). `.qa.json`과 `--check`의 출력도 이미지보다 먼저 본다. 분량·도식 수는 `node tools/slide-density.js <원고.pptx…>`로 재고, 도식이 잘렸는지·상자가 겹쳤는지처럼 **눈으로만 아는 것**에만 이미지를 쓴다.
- **원문 확인은 PC에서** — 인용이 원전에 있는지는 `node tools/verify-quote.js <원전|URL|캐시 이름> "<영문 인용>"`로 확인하고 결과 한 줄만 본다. 원전 텍스트는 `references/sources/`(git 제외)에 한 번만 추출한다(예: `larman-2004`). "있음"은 `references/verified.json`에 기록되고, 기록에 없는 영문 인용은 Production이 경고한다. 원고에 쓰지 않을 조사용 조회(장 제목·용어 확인)는 `--check`로 해 기록하지 않는다. 원전 캐시는 직접 읽지 않는다 — 후보 문장을 `--check`로 확인하고, "없음"이면 함께 출력되는 가장 가까운 원문 조각으로 문구를 고친다. 인용 여러 개는 한 번에 넘긴다(`verify-quote.js <원전> "<인용1>" "<인용2>" …`, 원전을 한 번만 읽는다). 자동 접근이 막힌 원문은 사용자가 `references/inputs/`(git 제외)에 넣고, 그 파일 경로로 확인한다. TrainingMaterials 밖의 폴더는 읽지 않는다.
- **인용은 기록부터** — 새 인용을 찾기 전에 `node tools/citations.js courses/<course> <저자·원문>`으로 이미 확인한 인용을 찾는다. 원전 PDF는 텍스트로 한 번 추출해 grep으로 문장만 찾는다.
- **필요한 범위만 읽기** — 긴 원고는 `grep -n "^## "`로 위치를 찾고 그 범위만 읽는다.
- **기계적 수정은 도구로** — topic 삽입과 번호·참조 갱신은 `tools/insert-topic.py`를 쓴다.
- **일의 종류로 모델을 고른다** — 판단이 드는 일(구성안·원고 집필과 보완·인용과 사례 결정·renderer 설계)은 기본 모델로 한다. 규칙이 `guides/`에 명시돼 판단 여지가 작은 기계적 반복(렌더링·검사·치환·번호 갱신·검토 기록 작성·읽기 전용 조사)은 Sonnet으로 내린다. 실행 한두 번 때문에 세션을 새로 열지는 않는다 — 묶어서 할 양이 있을 때만 나눈다.
- **작업 단위로 세션을 연다** — 대화가 길어질수록 턴마다 전체 대화를 다시 싣는다. 끝난 작업은 세션을 닫고 새 작업은 새 세션에서 시작한다. 맥락은 `courses/<course>/checks/`의 검토 기록과 진행 기록이 잇는다.
- **끝에 한 줄 보고** — 작업을 마칠 때 렌더링 횟수와 시각 검토한 장 수를 함께 보고한다.
