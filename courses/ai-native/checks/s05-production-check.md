# 세션 05 제작 검토 기록

- 기록 시각: 2026-10-18T18:40:00+09:00
- 최종 슬라이드: 23장
- Renderer: 저장소 `engine/production/src/cli.js`. 이번 세션 작업에서는 renderer·템플릿을 수정하지 않음.

## 입력과 출력

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.md`
  - 수정 시각: 2026-10-18T18:36:42+09:00
  - SHA-256: `64eb5c7805ea2764a087ed9611884c4ae79551ca99da0f37086a4e0f1013fac0`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.pptx`
  - 수정 시각: 2026-10-18T18:36:44+09:00
  - SHA-256: `639a7953c73be4d9cac44134621613ee2ee712ce24522e937119bb2c1896f429`

## 확인 결과

| 항목 | 판정 | 방법·증거 |
|---|---|---|
| 원고 자동 검사 | PASS | s05.qa.json: 68블록, 오류 0·경고 0 |
| 인용문 typography | PASS | 원고 인용 5그룹 전체를 OOXML run과 대조. 한글 18pt, 영문·출처 10pt. bold 및 한글 쉼표 뒤 영역 포함 |
| 코드 실행 | PASS | run.mjs가 javac 컴파일 후 Java main 실행. 승인·가격 변경·거절·재결제 네 예 통과 |
| 기능 목록 | PASS | 실행 전 passes=false로 초기화, 네 PASS 확인 후 features.json의 네 항목을 true로 갱신 |
| 시연 원본 대조 | PASS | code/s04/demo-results/A의 테스트·diff에서 추가 예외·새 주소 확인. A와 B 실행 로그에서 사람의 수용 테스트 각 4개 통과 확인 |
| 시각 검토 | PASS | PowerPoint PDF 출력 50DPI, 1–23장 전체 열람. 명세서·GWT·코드·표·실습 답의 순서·겹침·잘림 확인 |
| 도식 최종 글자 크기 정밀 계측 | NOT VERIFIED | raster 글자 전체의 최종 pt 크기를 별도 계측하지 않음. 자동 최소 크기 검사와 실제 출력 시각 확인을 구분 |
| 과정 전체 참조 | FAIL | --check 12세션. 세션 01–05 PASS, 뒤 7세션의 기존 참조 오류 183건. 기존 뒤 세션 덱은 덮어쓰지 않음 |

전체 Production 정밀 검증 완료로 표시하지 않는다. PASS는 각 확인 범위에 한정한다.

## 검토 범위와 증거

- 원고 렌더링 2회, 별도로 과정 전체 --check 1회.
- 시각 검토한 고유 슬라이드 23장. 추가 렌더링이나 재검토 없이 최종 유지.
- 이미지: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s05/p-01.png`부터 `p-23.png`까지.
- 과정 참조 검사 로그: `/tmp/ai-native-s05-cross-check.log`
- lead 읽기 결과: `/tmp/ai-native-s05-leads.log` (첫 원고 기준, 최종 변화는 질문 표기·오타 보완)
- 코드 원본·명령: `courses/ai-native/sessions/code/s05/README.md`
- 실제 시연은 2026-10-08의 저장된 두 실행이다. 새 LLM 실행을 하지 않았으며 현재 Java 예의 PASS와 과거 실행 결과를 구분했다.
- 네 테스트는 테스트 대역을 쓰는 대표 예다. 실제 API·영속·동시성·중복 승인·미정인 실패 복구를 검사한 것은 아니다.
- 실제 API와 정적 구조 검사는 이번 실행 예의 대상이 아니다. renderer를 수정하지 않았으므로 전체 renderer 회귀 테스트는 다시 실행하지 않았다.


## 실습 완성 답안 보완 — 2026-10-18T18:57:04+09:00
- 이번 기록은 위의 이전 원고 검토 이후, 현재 별첨 답안 보완 범위에 대한 기록이다.
- 최종 덱: 24장. 자동 검사 PASS, 오류 0·경고 0.
- 원고 렌더링: 이번 보완 작업에서 2회. Renderer·템플릿·예제 코드는 수정하지 않아 전체 renderer 테스트나 예제 실행을 반복하지 않음.
- 내용 검증 PASS: 실제 값과 범위를 가진 작업 명세, 독립 전제의 Given–When–Then 네 시나리오, 관찰 가능한 완료 조건을 가진 네 작업 단위와 반영 결과가 작성됨.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 변경 슬라이드 20, 21, 22, 23, 24장. 겹침·잘림·순서와 완성 산출물의 가독성 확인.
- 사용자 의도 반영: 학습자가 점검 항목을 반영해 제출할 완성 산출물을 별첨에 두고, 작성·검토 방법은 강사 노트로 분리. 보완 (안)은 실제 반영 문장과 결정의 기록으로 작성.
- 도식 글자 전체의 최종 pt 정밀 계측은 NOT VERIFIED. 자동 검사와 실제 출력 검토 PASS를 전체 Production 정밀 검증 완료로 확대하지 않음.
- 과정 전체 --check는 세션 01–05 PASS. 뒤 7세션의 기존 참조 오류 183건은 과정 개편 대상. 로그: `/tmp/exercise-answers-cross-check.log`.
- 렌더 증거: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s05/`의 해당 p-NN.png 파일.
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.md`
  - 수정 시각: 2026-10-18T18:52:04+09:00
  - SHA-256: `ea6145e7c21c2b4ce3e9bb35e82110b7c7f365a2943356cc3a0306b9267dcfc3`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.pptx`
  - 수정 시각: 2026-10-18T18:52:06+09:00
  - SHA-256: `72a8365a2addcedef4757e23650a8e88aa301be1377218932622fd02c22d9349`

## 실습 5 전면 보완 — 2026-10-21T09:04:00+09:00

- 이번 기록은 실습 5를 대화창 ①~⑤ 방식으로 바꾸고 별첨을 ⑤의 결과로 교체한 범위다.
- 최종 덱: 24장. 자동 검사 PASS, 오류 0·경고 0(`s05.qa.json`: 69블록).
- 원고 렌더링: 이번 작업에서 4회(첫 렌더에서 별첨 「작업 명세서」의 꼬리 continuation 경고 1건, 다음 렌더에서 해소. 수용 예 topic이 두 장씩 나뉘어 두 번 더 고쳤다).
- 실습 대화: `tools/run-exercise-turn.py`로 ①~⑤를 실제 실행. ①~③ Codex(`codex exec`), ④~⑤ Claude Code(`claude -p`, `claude-opus-5-5`). ④의 Codex 실행은 제공자의 429로 두 번 실패했고 그 기록도 남겼다. ⑤는 문체·표 모양만 고쳐 두 번 요청, 첫 회차는 `finalization-rounds/01/`.
- 보존 경로: `courses/ai-native/sessions/code/s05/exercise-conversation/`. 최종 MD는 `정기배송-최초신청-작업명세.md`이며 별첨 다섯 장의 원본이다.
- 옛 값 교정 PASS: 별첨에 남아 있던 일시불 70,000원·만료일 2월 2일·같은 신청의 재결제를 실습 2·3이 정한 값(첫 회차 10,000원을 신청 시 결제, 계약 종료일 2028-02-03 제외, 실패 확정 뒤에는 별개 신규 신청)으로 바꿨다. 본편 「05. 예시에서 테스트로」·「06. 작업 단위」·「09. 시연」은 강의 사례(주문)라 값이 바뀌지 않으며, 「06. 작업 단위」 강사 노트의 실습 분할 예시만 새 네 단위로 고쳤다.
- 「보완」 장 이전 PASS: 별첨의 옛 「보완」 장을 없애고 되돌림을 실습 topic의 강사 노트(반영·기록만)로 옮겼다.
- 코드 실행 PASS: `node courses/ai-native/sessions/code/s05/run.mjs` — javac 컴파일 후 네 예(승인·가격 변경·거절·재결제) PASS. 강의 사례 코드라 이번 보완으로 바뀌지 않았다.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 바뀐 6장(18, 20–24). 실습 한 장, 별첨 다섯 장의 순서·겹침·잘림·두 단 흐름 확인. 수용 예 세 장은 Scenario 줄을 쓴 두 블록이 한 장에 들어간다.
- 도식 글자 최종 pt 정밀 계측은 NOT VERIFIED(이번 범위에 새 도식 없음).
- 과정 전체 `--check` FAIL(변화 없음): 세션 01–05 PASS, 뒤 7세션의 기존 참조 오류 183건으로 보완 전과 같다. s06 이후 원고의 "실습 3의 작업 명세서"·"실습 5의 맥락 패키지" 같은 옛 실습 번호는 그 세션을 보완할 때 고친다.
- 렌더 증거: `/Users/YoungSan/Library/Application Support/Claude/side-session-notes/local_93e5f8f3-42b7-4aaf-bd58-2ec77c4ba4c9/s05-review2/`의 p-18·p-20~p-24.png
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.md`
  - 수정 시각: 2026-10-21T09:02:47+09:00
  - SHA-256: `02a6e9c42f7e8a152210ec4e66a4fca3f35a544b5c55789f66a2e7de2902ca18`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s05.pptx`
  - 수정 시각: 2026-10-21T09:02:47+09:00
  - SHA-256: `12481d834a8786a40bd01decc10d31ec01b6c5357c20c4313f799ab1d4c3cbe4`

## 시각 검토 지적 반영 — 2026-10-21

- 범위는 사용자가 지적한 세 가지다. 다른 장의 내용은 바꾸지 않았다.
- **라벨 들여쓰기** — 「주문한다의 작업 명세서」(4장)의 `**업무 규칙과 예**`·`**범위**`·`**미정**`·`**참조**`를 독립 bold 줄에서 상위 bullet으로 바꾸고 항목을 하위 bullet으로 들여썼다(`session-authoring-guide.md`의 「6. 표와 목록」). 같은 위반을 s01~s05 전체에서 찾아 s02의 「초안이 쓴 것」 네 곳만 더 나왔고 함께 고쳤다. s06~s12와 ooad에는 같은 위반이 없다.
- **기록 조건** — 날짜·도구 버전·모델은 출처·범위라 강사 노트로 옮겼다(「6. 표와 목록」의 설명을 위한 설명). 본문 bullet은 표에서 읽어야 할 판단인 `**검토 결과**`(명세에 없는 중복 결제 방지 예외가 기대값으로 들어왔다)로 바꿨다.
- **A·B 기호 이름 제거** — 표의 열 이름을 `구현과 테스트 작성 요청`·`사람의 수용 테스트 제공`으로, 16장 표 제목을 `구현과 테스트를 함께 맡긴 결과의 검토`로 바꿨다. 저장된 기록 폴더 이름(`demo-results/A`·`B`)은 원본이라 그대로 두고 강사 노트의 경로로만 남겼다.
- 처음 고친 뒤 bullet이 하나 늘어 시연 topic이 표만 있는 장과 bullet만 있는 장으로 갈렸다(25장). 표가 이미 보여 주는 `**비교 방법**` bullet을 지워 한 장으로 되돌렸다(24장).
- 렌더링 2회(s05), 자동 검사 PASS·오류 0·경고 0, 24장.
- 시각 검토 4장 — 4(라벨 들여쓰기), 15(시연 표와 bullet), 16·17(분할 확인과 되돌린 결과).

## 두 단의 왼쪽을 끝까지 채운다 — 2026-10-21

- 4장에서 왼쪽 단이 76%만 차고 `참조`가 오른쪽으로 넘어간 것은 원고가 아니라 renderer의 문제였다. 왼쪽 단만 글 높이 추정의 여유 없이(1.0배) 재고 있었는데, 추정은 실제 출력보다 넉넉해서 들어가는 항목이 밀려났다.
- `styleFit.js`의 `ANSWER_STYLE`에 왼쪽 단만의 여유 `leftFit`을 두고 1.04배로 맞췄다(`builder.js`의 `styledPage`). 실제 출력으로 잡은 값이다 — 1.0배면 s05 4장(추정 1.022배)이 밀려나고, 오른쪽 단과 같은 1.1배로 열면 s04 22장 「연계 계약」(추정 1.072배)의 글이 쪽 번호를 덮는다.
- `**문서 형식 — 10pt**`는 `fit`과 같은 0.9배를 유지한다. 1.04배를 물려받자 s01 34장이 한두 줄짜리 이어지는 장이 되어 Production이 경고했다.
- 지침: `production-guide.md`의 「문서 형식」·「실습 슬라이드」·「별첨 — 참고 자료」 항목에 `leftFit`과 값을 적었다. 테스트: `practice.test.js`에 여유 안(1.023배)은 한 단, 여유 밖(1.073배)은 두 단으로 가는 장을 고정했다.
- 전체 회귀 174개 통과. s01~s05 다시 렌더링, 모두 자동 검사 PASS·오류 0·경고 0(34·25·24·23·24장).
- 배치가 바뀐 장은 두 곳뿐이다 — s05 4장, s02 19장. 나머지 두 단 장(s01 33, s02 24·25, s03 21, s04 21·22, s05 20·24)은 보완 전과 같은 배치다.
- 시각 검토 9장 — s05 4·20·24, s04 21·22, s02 19·24·25, s03 21, s01 33·34. 왼쪽 단이 차는지와 쪽 번호를 덮지 않는지를 봤다.
