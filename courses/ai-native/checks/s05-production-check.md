# 세션 05 제작 검토 기록

- 기록 시각: 2026-10-23T17:31:43+09:00
- 최종 슬라이드: 32장
- Renderer: 저장소 `engine/production/src/cli.js`. 이번 작업에서 `builder.js`와 `mermaidAdapter.js`를 고쳤다(아래 「renderer 수정」).

## 입력과 출력

- `courses/ai-native/sessions/s05.md`
  - 수정 시각: 2026-10-23T16:36:04+09:00
  - SHA-256: `352415867f93c6c62d6a27a45abd95dcff1e4952c885758d860fb4f90dd74ef6`
- `courses/ai-native/sessions/s05.pptx`
  - 수정 시각: 2026-10-23T17:25:00+09:00
  - SHA-256: `ec21244320ecade7de10496b2d38e1acd81223f34340e30a3d63d6ff2728e29c`

## 확인 결과

| 항목 | 판정 | 방법·증거 |
|---|---|---|
| 원고 자동 검사 | PASS | s05.qa.json: 32장·78블록, 오류 0·경고 0 |
| 실행 예제 | PASS | `node courses/ai-native/sessions/code/s05/dynamic-model/run.mjs` — JDK 17 컴파일 후 6개 검사 묶음 PASS(승인 뒤 상태·순서, 거절 뒤 값 보존, 재결제, 승인 전 배송 금지, 생애주기 전이, 판매가 변경 뒤 총액) |
| 실습 대화 | PASS | ①~③ Codex CLI, ④~⑤ Claude CLI로 실제 실행. ⑤는 두 회차(첫 회차는 `finalization-rounds/01`). 최종 MD는 `claude-response-05.md`와 바이트 동일 |
| 별첨과 원본 일치 | PASS | 별첨 5개 topic을 합하면 `주문한다-동적모델.md` 전문. 제목 단계·도식 제목 표식·표 제목 표식만 변환 |
| Production 전체 테스트 | PASS | `node --test engine/production/src/test/*.test.js` — 187개 통과(새 회귀 테스트 2개 포함) |
| 교차 검사 | PASS | s01~s05와 references를 `--check`: 모두 오류 0·경고 0 |
| 시각 검토 | PASS | PowerPoint PDF 출력. 32장 전체를 50DPI로 본 뒤 고친 장(28·30)과 s04의 5·6·34장을 130~300DPI로 재확인 |
| 도식 글자 정밀 계측 | NOT VERIFIED | 최종 raster 글자의 pt를 따로 재지 않았다. 자동 크기 검사와 시각 확인을 구분한다 |
| 과정 전체 참조 | FAIL(의도한 중간 상태) | `--check s*.md`에서 s06~s12의 옛 축 참조 167건. 그 세션들을 다시 쓸 때 사라진다 |

전체 Production 정밀 검증 완료로 표시하지 않는다. 위 PASS는 각 확인 범위에 한정한다.

## 시각 검토에서 찾아 고친 것

1. **별첨 「정상 승인 시퀀스」에 `**도식 — Mermaid — …**` 표식이 본문으로 찍혔다.** 문서 형식 topic을 한 장으로 합치는 경로가 표식을 거르지 않았다. renderer를 고쳤다.
2. **별첨 28·30장에서 도식이 아래 본문을 덮었다.** 도식 제목의 높이만큼 도식이 내려가는데 그 띠를 미리 비워 두지 않아 겹쳤다. renderer를 고쳤다.
3. **상태 기계의 "카드 승인 거절"이 "카드 승인 완료 / 배송 요청"에 가렸다.** Mermaid 기본 가로 간격에서 자기 전이 라벨이 19px 겹친다. 상태 기계의 `nodeSpacing`을 100으로 올려 4px 떨어뜨렸다. 세로 간격은 그대로 둬 도식이 본문과 한 장에 남는다.
4. **s04 5장의 제목이 잘려 머리말을 덮었다.** 「개체 관계 다이어그램과 클래스 다이어그램」이 두 줄로 넘쳐 첫 줄이 잘렸다. 「ERD와 클래스 다이어그램」으로 줄이고 `course-design.md`의 영한 용어집 참조도 함께 고쳤다.

## renderer 수정

- `builder.js` — 문서 형식 topic을 한 장으로 합치는 두 경로(`compactMixedDocumentPage`·`documentDiagramPage`)에 넘기는 블록에서 도식 표식을 거른다. `documentDiagramPage`는 도식 제목의 띠(`CAPTION_LEAD+CAPTION_LINE+CAPTION_GAP`)를 미리 빼고 자리를 잡는다.
- `mermaidAdapter.js` — 상태 기계에만 `state.nodeSpacing: 100`을 준다. 클래스·ER·flowchart 도식의 배치는 그대로다. 캐시 version을 `v14-state-spacing`으로 올렸다(classDiagram은 기존 version 유지).
- `test/lead-structure.test.js` — 회귀 테스트 2개를 더했다. 고치기 전 코드에서 둘 다 실패하는 것을 확인했다.

## 검토와 실행 범위

- 성공 렌더링 7회(임시 검사 렌더링 별도), 시각 검토 38장(s05 32장 + 재확인 4장 + s04 2장).
- 실습 대화는 CLI 응답의 Mermaid 원본만 받는다. 도식의 실제 표시는 Production 결과에서 따로 봤다.
- Java 예제는 동기 정상 응답만 재현한다. 미확정 응답·통신 실패·동시 통보·승인 뒤 배송 요청 실패의 운영 정책은 구현하지 않았고 미정으로 남겼다.
- `code/s05/` 바로 아래의 `AcceptanceExamples.java`·`run.mjs`·`features.json`·`README.md`는 옛 「작업 명세와 수용 기준」 세션의 자료다. `s07.md`가 아직 이 파일들을 참조하므로 지우지 않았다. s07을 다시 쓸 때 함께 정리한다.
- `code/s05/exercise-conversation/` 바로 아래의 정기배송 대화 기록도 s04와 같은 방식으로 그대로 뒀다. 이번 실습 기록은 그 아래 `order/`에 있다.

## 보존 증거

- 실습 대화: `courses/ai-native/sessions/code/s05/exercise-conversation/order/`(입력·응답·이벤트·메타데이터·`finalization-rounds/01`·`주문한다-동적모델.md`·README)
- 실행 예제: `courses/ai-native/sessions/code/s05/dynamic-model/`


### 2026-10-23 — 사용자 시각 검토 반영

사용자가 9·28·30장을 짚었다. 셋 다 고쳤다.

1. **9장 「거절과 재결제」에 시퀀스 다이어그램이 있었다.** 이 topic은 「03. 사건과 상태·전이」 그룹이고 시퀀스는 「06. 업무 상호작용」에서 처음 설명한다. 아직 읽는 법을 가르치지 않은 표기를 먼저 보이고 있었다. 같은 장면을 **상태·전이 관점의 추적 표**(순서·사건·전이·전이 뒤 상태·배송 요청 누계)로 바꾸고, 자기 전이가 되돌림이 아니라는 것과 재결제가 새 전이가 아니라는 것을 본문으로 설명했다. 참여자 사이의 전달 순서는 06에서 본다고 강사 노트에 적었다.
2. **28장의 상태 기계를 좌우 배치로 바꿨다.** 별첨의 Mermaid 원본에 `direction LR` 한 줄만 더했다(s04 클래스 도식과 같은 사용자 배치 요청이며 강사 노트에 밝혔다). 좌우로 펴지면서 자기 전이 라벨의 겹침도 사라져, 앞서 넣었던 `state.nodeSpacing` 보정을 되돌렸다 — LR에서는 기본 간격이 더 좁고 깔끔하다.
3. **30장 시퀀스의 참여자 상자가 위아래 두 군데 있었다.** mermaid의 기본값 `mirrorActors`가 아래에도 같은 상자를 한 번 더 그린다. `sequence.mirrorActors: false`로 껐다. 같은 참여자가 둘로 읽히지 않고 도식도 그만큼 낮아진다.

- 최종 32장·78블록, 오류 0·경고 0. 전체 테스트 187개 통과. s01~s05와 별첨 교차 검사 PASS.
- 이번 성공 렌더링 3회·시각 검토 4장(9·28·30과 28장 재확인).
