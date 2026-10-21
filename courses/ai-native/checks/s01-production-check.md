# 세션 01 제작 검토 기록


## 실습 완성 답안 보완 — 2026-10-18T18:57:04+09:00
- 이번 기록은 위의 이전 원고 검토 이후, 현재 별첨 답안 보완 범위에 대한 기록이다.
- 최종 덱: 34장. 자동 검사 PASS, 오류 0·경고 0.
- 원고 렌더링: 이번 보완 작업에서 1회. Renderer·템플릿·예제 코드는 수정하지 않아 전체 renderer 테스트나 예제 실행을 반복하지 않음.
- 내용 검증 PASS: 추측 처리표의 금액·회차·거절·추가 규칙·상태·테스트와 여섯 작업의 활용 방식·근거가 제출 결과로 작성됨.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 변경 슬라이드 33, 34장. 겹침·잘림·순서와 완성 산출물의 가독성 확인.
- 사용자 의도 반영: 학습자가 점검 항목을 반영해 제출할 완성 산출물을 별첨에 두고, 작성·검토 방법은 강사 노트로 분리. 보완 (안)은 실제 반영 문장과 결정의 기록으로 작성.
- 도식 글자 전체의 최종 pt 정밀 계측은 NOT VERIFIED. 자동 검사와 실제 출력 검토 PASS를 전체 Production 정밀 검증 완료로 확대하지 않음.
- 과정 전체 --check는 세션 01–05 PASS. 뒤 7세션의 기존 참조 오류 183건은 과정 개편 대상. 로그: `/tmp/exercise-answers-cross-check.log`.
- 렌더 증거: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s01/`의 해당 p-NN.png 파일.
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s01.md`
  - 수정 시각: 2026-10-18T18:48:18+09:00
  - SHA-256: `a82bb686c0bb3534fffdfbfffd633487c83d3281044d3e2fc7594c624b2a917b`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s01.pptx`
  - 수정 시각: 2026-10-18T18:49:20+09:00
  - SHA-256: `9840cc5421ece03cf8c0d3d637fe9336eaf2b2d25838a756db39de98777877c5`


## S01 실습 통합 — 2026-10-19T20:19:18.095966+09:00

- 승인된 실습을 31장에 반영: 다섯 프롬프트, ②~④ 개인 보완 안내, 점검 4항목, 다음 실습의 입력인 업무 조건 메모.
- 별첨 33장: 실제 focused-prompts/codex-response-05.md를 문장·순서·강조 수정 없이 사용. 제목 단계만 Session Source에 대응. 다섯 실제 입력과 실습의 프롬프트 일치를 검사했다.
- 기존 설계·코드·테스트 생성 실습과 두 개의 종전 답안은 교체했다. 29장의 실습 출발점도 기존 쇼핑몰 연계로 맞췄다.
- 지침: 핵심 결정과 탐색 종료, 프롬프트의 목표 분량·형식 명시, 실제 실행 답변의 원문 보존. 실제 응답 표식은 별첨에서만 허용하고 강조 검사만 제외한다.
- 전체 33장. 자동 검사 PASS: 오류 0, 경고 0. 전체 Production 테스트 169개 PASS.
- PowerPoint PDF에서 변경한 29·31·33장 시각 검토 PASS: 잘림·겹침 없음.
- 검토 증거: /tmp/tm-s01-integrated-29.png, /tmp/tm-s01-integrated-31.png, /tmp/tm-s01-integrated-33.png
- 원고 SHA-256: `e7fad0e96ef0075e366608cb7dd45ac012528d5c9ab4ceb96c8aef6c4343215f`
- PPT SHA-256: `9e9c6988123425fb614cb6d2454d41da5961bdb77afad8b2f98c9778259eb61e`
- 원고 수정 시각: 2026-10-19T20:17:26.700150+09:00
- PPT 수정 시각: 2026-10-19T20:17:49.029111+09:00
- renderer: engine/production/src/cli.js (저장소 현재 작업본).
- 이번 작업 렌더링 1회, 시각 검토 3장.


## 반복 대화·최종 MD 방식 반영 — 2026-10-20 (Asia/Seoul)

- 범위: 실습 과제와 실제 최종 응답 별첨. ①~⑤는 단계이며 보완 대화와 MD 재생성을 반복한다.
- 실습 프롬프트에서 PPT 분량·폰트·배치 조건을 제거했다. 최종 MD를 다음 실습에 명시적으로 첨부한다.
- Codex CLI로 앞선 실제 합의 내용을 이어 새 ⑤를 실행했다. CLI는 도구 없이 문서 본문을 출력하고 실행기가 MD 파일로 저장했다. 대화 이력과 생성 로그는 해당 exercise-conversation 폴더에 보존한다.
- 별첨은 최종 MD 전체를 원문 그대로 사용했다. 제목 단계·목록 들여쓰기만 변환했고 도식 원본은 동일하다.
- 자동 검사 PASS: 34장, 오류 0개·경고 0개. 원고 전체를 검사했고 시각 검토는 변경 슬라이드 31·33·34에 한정했다.
- PowerPoint PDF 내보내기 후 변경 슬라이드 시각 검토 완료. 원문 설명·도식 누락 검사 통과.
- 학습자용 다섯 기본 문구가 원고와 일치하며, 실제 ⑤의 응답과 배포 MD 바이트 일치. 과거 ①~④ 입력·응답은 실행 당시 그대로 보존한다.
- renderer 회귀 테스트 173개 통과, 실패 0개. 이번 변경에 새 renderer 문법·서식은 없으며 기존 parser/builder로 구현된다. 테스트 fixture의 대화 안내·MD 재생성·원문 보존 계약을 갱신해 확인했다.

### 이번 산출물 식별

- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s01.md: SHA-256 `79333bc073d765080ac37c40fa4fbf124f648a686d2b1a89351aaa524577c7c6`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s01.pptx: SHA-256 `d13ee9cee46dc6cc98a87f8eb7cf038a15c20424d23e1e4881e3aa738633b89c`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s01/exercise-conversation/focused-prompts/정기배송-최초신청-업무조건.md: SHA-256 `d423ccc2bf312f3ebb8690cfc9b06e32148a73cd20125d5c743cf3316e0bec5e`

- 이번 작업 렌더링 2회(본편·검토용 원고 포함), 변경 슬라이드 시각 검토 3장. 


## 저장소 정리 — 2026-10-20

- 본편 반영 완료 후 중복된 s01~03-add 및 채택되지 않은 시도·검토본을 정리했다. 당시 파일은 로컬 복구 백업에 보존했다. 과거 기록의 경로는 당시 실행 경로다. 현재 원고·PPT·최종 MD와 대화 이력은 변경하지 않았다. 위치와 검사 결과는 저장소 루트 REPOSITORY-STATUS.md를 본다.
