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
