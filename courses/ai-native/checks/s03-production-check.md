# 세션 03 제작 검토 기록

- 실행·기록 시각: 2026-10-18T18:01:00+09:00
- 최종 슬라이드: 25장
- Renderer: `engine/production/src/cli.js` (Node.js 저장소 파이프라인), PlantUML MIT light 1.2026.0

## 입력과 출력

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.md`
  - 수정 시각: 2026-10-18T18:00:00+09:00
  - SHA-256: `64113c1e997ad9787098c537e00d6a5010ae0ea39336b14083c7214b19749a91`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.pptx`
  - 수정 시각: 2026-10-18T18:00:01+09:00
  - SHA-256: `a96b4891237a5a2e0f955f956d74033c466c3351adf64004b239553104b6aba5`

## 확인 결과

| 항목 | 판정 | 방법과 근거 |
|---|---|---|
| 원고 자동 검사 | PASS | 최종 s03.qa.json: 61블록, 오류 0·경고 0 |
| 인용문 typography | PASS | 입력 4그룹과 OOXML 대조. 4그룹 전체 run: 한글 18pt, 영문·출처 10pt. bold 포함 |
| 코드 | PASS | javac 컴파일 후 main 실행. 금액 보존·승인·거절·재결제 네 대표 예 통과 |
| Renderer 회귀 | PASS | 전체 158테스트 통과. 상태 자기 전이와 라벨의 음수 좌표 잘림 회귀 추가 |
| 시각 검토 | PASS | PowerPoint PDF 출력 50DPI, 1–25장 확인. 수정 후 상태 도식 10·16·23장 재확인. 본문·표·코드의 겹침·잘림 및 순서 확인 |
| 상태 자기 전이 | PASS | 최종 16장: PENDING_PAYMENT 자기 전이의 거절 라벨·화살표 전체 표시. 10·23장도 표시 확인 |
| 도식 글자 크기 정밀 계측 | NOT VERIFIED | raster 글자 전부의 최종 pt 크기는 별도 계측하지 않음. 자동 최소 크기 검사와 실제 출력 시각 검토를 구분함 |
| 과정 전체 참조 | FAIL | 개편 중인 뒤 9세션의 기존 참조 오류 198건. 세션 01–03은 PASS. 기존 덱은 덮어쓰지 않고 --check로 검사 |

전체 Production 정밀 검증 완료로 표시하지 않는다. 위 PASS는 각 검사 범위에 한정한다.

## 실행과 증거

- 원고 렌더링 호출 5회(초기 PlantUML 문법 오류로 중단한 1회 포함). 별도로 과정 전체 --check 2회.
- 시각 검토한 고유 슬라이드 25장, 수정한 3장 재검토(총 28장 열람).
- review-pdf.sh는 재실행 때 앞 이미지를 정리하므로 현재 보존된 증거는 아래 3장이다.
  - `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s03/p-10.png`
  - `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s03/p-16.png`
  - `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s03/p-23.png`
- 회귀 로그: `/tmp/ai-native-s03-regression.log`
- 최종 과정 검사 로그: `/tmp/ai-native-s03-cross-check-final.log`
- renderer 보완: 상태 도식에도 SVG viewport 확장을 적용하고, 글자의 실제 font-size로 상단 경계를 계산한다. 원고의 전이·라벨은 유지했다.


## 실습 완성 답안 보완 — 2026-10-18T18:57:04+09:00
- 이번 기록은 위의 이전 원고 검토 이후, 현재 별첨 답안 보완 범위에 대한 기록이다.
- 최종 덱: 25장. 자동 검사 PASS, 오류 0·경고 0.
- 원고 렌더링: 이번 보완 작업에서 1회. Renderer·템플릿·예제 코드는 수정하지 않아 전체 renderer 테스트나 예제 실행을 반복하지 않음.
- 내용 검증 PASS: 판매가/단가 용어, 항목·회차의 다중성, 결제 대기 자기 전이·승인 후 회차 생성, 7회×10000원, 제외 규칙, 실제 반영 문장이 작성됨.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 변경 슬라이드 21, 22, 23, 24, 25장. 겹침·잘림·순서와 완성 산출물의 가독성 확인.
- 사용자 의도 반영: 학습자가 점검 항목을 반영해 제출할 완성 산출물을 별첨에 두고, 작성·검토 방법은 강사 노트로 분리. 보완 (안)은 실제 반영 문장과 결정의 기록으로 작성.
- 도식 글자 전체의 최종 pt 정밀 계측은 NOT VERIFIED. 자동 검사와 실제 출력 검토 PASS를 전체 Production 정밀 검증 완료로 확대하지 않음.
- 과정 전체 --check는 세션 01–05 PASS. 뒤 7세션의 기존 참조 오류 183건은 과정 개편 대상. 로그: `/tmp/exercise-answers-cross-check.log`.
- 렌더 증거: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s03/`의 해당 p-NN.png 파일.
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.md`
  - 수정 시각: 2026-10-18T18:49:19+09:00
  - SHA-256: `3e956f6c44874f9161328914248ab784650887ed5dc5663de3d402519b5fe5b1`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.pptx`
  - 수정 시각: 2026-10-18T18:49:24+09:00
  - SHA-256: `10fd19e6bd049494a5b9b6ba7a28b8468f375e96bbaeabf55ac0d24012bc0fe7`


## 반복 대화·최종 MD 방식 반영 — 2026-10-20 (Asia/Seoul)

- 범위: 실습 과제와 실제 최종 응답 별첨. ①~⑤는 단계이며 보완 대화와 MD 재생성을 반복한다.
- 실습 프롬프트에서 PPT 분량·폰트·배치 조건을 제거했다. 최종 MD를 다음 실습에 명시적으로 첨부한다.
- Codex CLI로 앞선 실제 합의 내용을 이어 새 ⑤를 실행했다. CLI는 도구 없이 문서 본문을 출력하고 실행기가 MD 파일로 저장했다. 대화 이력과 생성 로그는 해당 exercise-conversation 폴더에 보존한다.
- 별첨은 최종 MD 전체 또는 강사 노트에 명시한 발췌 범위를 원문 그대로 사용했다. 제목 단계·목록 들여쓰기만 변환했고 도식 원본은 동일하다.
- 자동 검사 PASS: 24장, 오류 0개·경고 0개. 원고 전체를 검사했고 시각 검토는 변경 슬라이드 19·21·22·23·24에 한정했다.
- PowerPoint PDF 내보내기 후 변경 슬라이드 시각 검토 완료. 원문 설명·도식 누락 검사 통과.
- 학습자용 다섯 기본 문구가 원고와 일치하며, 실제 ⑤의 응답과 배포 MD 바이트 일치. 과거 ①~④ 입력·응답은 실행 당시 그대로 보존한다.
- renderer 회귀 테스트 173개 통과, 실패 0개. 이번 변경에 새 renderer 문법·서식은 없으며 기존 parser/builder로 구현된다. 테스트 fixture의 대화 안내·MD 재생성·원문 보존 계약을 갱신해 확인했다.

### 이번 산출물 식별

- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.md: SHA-256 `93cdd798211f92aa9ce9f682a819b5a29f78b517a8aec18b49c92ae6756e8925`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s03.pptx: SHA-256 `4798ea71c6099402acdcaf5b28f00519b25cdaf06ee1d8c7e5de31923465bb1c`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s03/exercise-conversation/정기배송-최초신청-도메인모델.md: SHA-256 `722d0af2504cab8c9dd0edc192c5f4c7729472efb2abba51404b89b1a0362d77`

- 이번 작업 렌더링 4회(본편·검토용 원고 포함), 변경 슬라이드 시각 검토 5장. 렌더링 4회 중 1회는 중간 응답의 도식 문법 오류로 중단했으며 최종 원고·검토용 원고는 모두 오류·경고 0개다. 최종 MD 생성은 ⑤를 3회 실행한 실제 보완 사례다.


## 저장소 정리 — 2026-10-20

- 본편 반영 완료 후 중복된 s01~03-add 및 채택되지 않은 시도·검토본을 정리했다. 당시 파일은 로컬 복구 백업에 보존했다. 과거 기록의 경로는 당시 실행 경로다. 현재 원고·PPT·최종 MD와 대화 이력은 변경하지 않았다. 위치와 검사 결과는 저장소 루트 REPOSITORY-STATUS.md를 본다.
