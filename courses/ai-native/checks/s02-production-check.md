# 세션 02 제작 검토 기록


## 실습 완성 답안 보완 — 2026-10-18T18:57:04+09:00
- 이번 기록은 위의 이전 원고 검토 이후, 현재 별첨 답안 보완 범위에 대한 기록이다.
- 최종 덱: 23장. 자동 검사 PASS, 오류 0·경고 0.
- 원고 렌더링: 이번 보완 작업에서 3회. Renderer·템플릿·예제 코드는 수정하지 않아 전체 renderer 테스트나 예제 실행을 반복하지 않음.
- 내용 검증 PASS: 요청/회의 메모 근거, 가치가 있는 세 스토리와 수용 값, 회차·거절·재결제의 확정 답, 남은 질문의 담당·처리 범위, 제외 기능이 작성됨.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 변경 슬라이드 21, 22, 23장. 겹침·잘림·순서와 완성 산출물의 가독성 확인.
- 사용자 의도 반영: 학습자가 점검 항목을 반영해 제출할 완성 산출물을 별첨에 두고, 작성·검토 방법은 강사 노트로 분리. 보완 (안)은 실제 반영 문장과 결정의 기록으로 작성.
- 도식 글자 전체의 최종 pt 정밀 계측은 NOT VERIFIED. 자동 검사와 실제 출력 검토 PASS를 전체 Production 정밀 검증 완료로 확대하지 않음.
- 과정 전체 --check는 세션 01–05 PASS. 뒤 7세션의 기존 참조 오류 183건은 과정 개편 대상. 로그: `/tmp/exercise-answers-cross-check.log`.
- 22장 질문·답의 계층을 보완해 소제목과 내용의 단 분리를 수정하고 해당 장만 재검토함. review-pdf.sh 재실행으로 현재 보존 이미지는 p-22.png 한 장이며, 21·23장은 직전 출력으로 검토함.
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.md`
  - 수정 시각: 2026-10-18T18:56:20+09:00
  - SHA-256: `fc7e5a82afe96aaaf8bde61700759b999f40ff14598b76f6ea7b2b0f4bca3c6e`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.pptx`
  - 수정 시각: 2026-10-18T18:56:21+09:00
  - SHA-256: `60df1f97cd41f2e9ef8397df378b3ce4c95976a58e8545fa9cf2ff3b5805885c`


## S02 사용자 이야기·품질·실제 실습 통합 — 2026-10-19T23:19:36.277810+09:00

- 최종 원고: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.md
- 최종 PPT: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.pptx
- renderer: engine/production/src/cli.js, 저장소 현재 작업본. 총 25장.
- 사용자 이야기와 요구사항 정의서의 관계를 먼저 설명하는 12장을 추가했다. 최초 신청은 고객 가치가 있는 이야기 하나로 다룬다.
- 품질 토픽 15~16장: 필요한 속성만 선택하고 시험 조건·합격 기준으로 적으며 구현 수단은 설계에서 정한다. 교육용 성능 수치는 실제 운영 보장으로 설명하지 않는다.
- 실습 22장: 승인한 5개 프롬프트. ②~④는 앞선 질문의 답과 추가 질문·수정 요청을 붙이는 안내. 기본 업무·품질 조건과 실제 피드백은 코드 자료에 보존했다.
- 별첨 24~25장: code/s02/exercise-conversation/codex-response-05.md의 실제 최종 응답. 제목 단계·들여쓰기 외 문장·순서·강조 편집 없음. 별도 Q&A·중복 요약·임의 모범 답안 없음.
- 검토 전 ④의 날짜 해석 모호함은 before-date-review/에 기록하고 실제 피드백에 포함 기준을 명시해 재실행했다. ⑤는 해당 최종 대화에서 실행했다.
- 자동 검사 PASS: 오류 0, 경고 0. 참조 검사: s01·s03·s05 PASS. renderer·템플릿은 변경하지 않아 전체 Production 테스트는 재실행하지 않았다.
- 실습 1 메모의 입력 파일 일치, 다섯 실제 입력의 기본 프롬프트 일치, 이전 실제 응답의 연속 전달, 최종 응답 원문과 원고·PPT의 문장 보존을 검사했다. 배송 7회와 마지막 배송 2028-01-26을 검산했다.
- PowerPoint PDF로 변경한 1·2·12·15·16·22·23·24·25장 시각 검토 PASS. 표·목록·두 단의 겹침 및 잘림 없음. 증거: /tmp/tm-s02-final-01.png, -02.png, -12.png, -15.png, -16.png, -22.png, -23.png, -24.png, -25.png
- 최종 강사 노트만 보완한 재생성 전후 전체 슬라이드 XML의 바이트 단위 동일성을 확인했다. 따라서 같은 시각 검토 증거가 최종 슬라이드 본문에도 적용된다.
- 최종 원고 SHA-256: `c8f61db9cd871462d9074844f1e07f9b8e706b8e2477188488e66000cd1f0555`
- 최종 PPT SHA-256: `8e72d9c5436e3ee73066ac77905bdd3bc0ab0c809bb589416b614b45664876ad`
- 실제 최종 응답 SHA-256: `e316c1987c56b0839782160f251b6be3f4b879c1b224773745c5e80a9725402e`
- 원고 수정 시각: 2026-10-19T23:18:24.698756+09:00
- PPT 수정 시각: 2026-10-19T23:18:25.741566+09:00
- 이번 작업 렌더링: 본편 4회·검토 원고 2회, 합계 6회. 최종 시각 검토 9장.


## 반복 대화·최종 MD 방식 반영 — 2026-10-20 (Asia/Seoul)

- 범위: 실습 과제와 실제 최종 응답 별첨. ①~⑤는 단계이며 보완 대화와 MD 재생성을 반복한다.
- 실습 프롬프트에서 PPT 분량·폰트·배치 조건을 제거했다. 최종 MD를 다음 실습에 명시적으로 첨부한다.
- Codex CLI로 앞선 실제 합의 내용을 이어 새 ⑤를 실행했다. CLI는 도구 없이 문서 본문을 출력하고 실행기가 MD 파일로 저장했다. 대화 이력과 생성 로그는 해당 exercise-conversation 폴더에 보존한다.
- 별첨은 최종 MD 전체를 원문 그대로 사용했다. 제목 단계·목록 들여쓰기만 변환했고 도식 원본은 동일하다.
- 자동 검사 PASS: 25장, 오류 0개·경고 0개. 원고 전체를 검사했고 시각 검토는 변경 슬라이드 22·24·25에 한정했다.
- PowerPoint PDF 내보내기 후 변경 슬라이드 시각 검토 완료. 원문 설명·도식 누락 검사 통과.
- 학습자용 다섯 기본 문구가 원고와 일치하며, 실제 ⑤의 응답과 배포 MD 바이트 일치. 과거 ①~④ 입력·응답은 실행 당시 그대로 보존한다.
- renderer 회귀 테스트 173개 통과, 실패 0개. 이번 변경에 새 renderer 문법·서식은 없으며 기존 parser/builder로 구현된다. 테스트 fixture의 대화 안내·MD 재생성·원문 보존 계약을 갱신해 확인했다.

### 이번 산출물 식별

- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.md: SHA-256 `f845f3acb92f399a0f69b0f366023e83c0a3f3de702c87daff8c8e2d7ae5fd3a`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.pptx: SHA-256 `adbef2b5cb9ea2fcd818d02a7ef98b4fb0ae0059c36ab1d7ed966d27bc06dfdf`
- /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s02/exercise-conversation/정기배송-최초신청-요구사항.md: SHA-256 `f7405de67f790dfc5692fc64ceea8e45535872416a6738940f50e6adb2a82bb9`

- 이번 작업 렌더링 2회(본편·검토용 원고 포함), 변경 슬라이드 시각 검토 3장. 


## 저장소 정리 — 2026-10-20

- 본편 반영 완료 후 중복된 s01~03-add 및 채택되지 않은 시도·검토본을 정리했다. 당시 파일은 로컬 복구 백업에 보존했다. 과거 기록의 경로는 당시 실행 경로다. 현재 원고·PPT·최종 MD와 대화 이력은 변경하지 않았다. 위치와 검사 결과는 저장소 루트 REPOSITORY-STATUS.md를 본다.

## 라벨 들여쓰기 반영 — 2026-10-21

- s05의 시각 검토에서 나온 같은 위반을 s01~s05에서 찾아 반영한 결과다. s02는 「08. 시연 — LLM이 쓴 요구 초안」의 「초안이 쓴 것」 한 topic이다.
- `**용어**`·`**사용자 이야기**`·`**업무 규칙**`·`**미정 질문 15가지**`를 상위 bullet으로 바꾸고 항목을 하위 bullet으로 들여썼다(`session-authoring-guide.md`의 「6. 표와 목록」).
- 렌더링 1회, 자동 검사 PASS·오류 0·경고 0, 25장. 시각 검토 2장 — 19(바뀐 장), 20(뒤 장의 밀림 확인).

---

## LLM이라는 재료 — 2026-10-22 (Asia/Seoul)

- 범위: 승인된 구성안으로 세션 02 전면 작성. 목차 10개, 본문 16항목(그룹 4개), 별첨 2절. 최종 22장.
- 내용 검토 PASS: 성질 → 비용 → 작업 특성 → 형태 선택 → 자율성 → 실제 기록 → 관행 → 실습의 논지를 `tools/read-leads.js`로 확인했다. 반복 결과가 반드시 달라진다거나 입력만 과금된다는 오해를 막도록 lead를 정확하게 다듬었다.
- 인용 15건(독립 10·bullet 5): 기존 `references/verified.json`의 원문 확인 기록을 사용했다. 새 인용을 만들거나 원전 캐시를 직접 읽지 않았다. 레이블·번역·확인 범위를 대조했다.
- 시연 수치 PASS: `code/s01/demo/demo-results/results.json`과 README 대조. 에이전트 입력 339,270 = 캐시 생성 19,110 + 캐시 읽기 320,142 + 일반 입력 18. 본문은 2026-10 기준, 노트는 실제 실행일 2026-10-07·Claude Code 2.1.292·claude-opus-5-5·OpenJDK 26을 밝힌다. 한 번의 관찰이며 현재 도구 재실행이나 보편 성능 비교로 해석하지 않는다.
- 실습 PASS: `code/s02/exercise-conversation/order/`에서 ①~⑤를 실제 실행. ④의 요청 제한·Claude 세션 한도 실패 근거와 이후 Codex 성공 기록을 함께 보존했다. 최종 MD 바이트 일치, 별첨 전문은 제목 단계·목록 들여쓰기 제외 문장·순서·강조 일치를 스크립트로 확인했다. 원본의 공통 전환 조건은 별첨의 독립 절로 대응했다.
- 자동 검사 PASS: 최종 `node engine/production/src/cli.js courses/ai-native/sessions/s02.md`와 `--check` 모두 오류 0·경고 0. `.qa.json`: 22장. 참조하는 완성 원고 s01도 `--check` 오류 0·경고 0. 아직 개편 전인 원고의 옛 참조는 재설계 기록대로 남겨 두었고 과정 전체를 다시 검사하지 않았다.
- 렌더링: s02 성공 6회(산출물 생성 3회 + `--check` 임시 생성 3회). 별도 실패 2회(샌드박스 브라우저 시작 차단 1, 실제 응답 목록의 3칸 들여쓰기 파싱 1). s01 참조 검사 임시 렌더링 1회는 위 6회에서 제외한다.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI. 본문 초판 4~19장 16장, 최종 변경 4·6·10·11 및 별첨 21·22장 6장, 합계 22장(서로 다른 장 18장). 겹침·잘림·넘침과 실습·별첨의 읽기 순서를 확인했다. 두 lead의 짧은 꼬리를 정리하고 워크플로/에이전트 도식을 좌우로 비교했다. 내용이 그대로인 장을 다시 보지 않았다.
- 시각 증거: 최종 변경 장은 `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s02/`의 p-04·06·10·11·21·22.png. `review-pdf.sh`가 폴더 이미지를 교체하므로 1차 16장 이미지는 도구 실행·검토 기록에만 남고 디스크에는 유지되지 않는다.
- 인용 typography PASS: OOXML의 15개 인용 문단 전체를 확인했다. 독립 인용 한글 18pt(괄호 14pt), 하위 bullet 한글 16pt, 영문·레이블 10pt. 강조 run도 같은 크기다.
- 도식 글자 최종 표시 크기 정밀 측정 NOT VERIFIED: 자동 검사 7pt 하한은 통과했지만 내장 PNG의 글자 크기 전체를 별도로 계측하지 않았다. `.qa.json`의 visual_status는 NOT_VERIFIED를 유지하며 전체 Production 정밀 검증 완료로 확대하지 않는다.
- Renderer·템플릿·테스트는 수정하지 않았다. 새 예시 코드도 없으므로 전체 renderer 테스트·다른 세션 덱 재생성은 하지 않았다.
- `rewrite-pending.json`에서 `sessions/s02.md`를 제거하고 `redesign-map.md`에 진행 기록을 더했다.

### 최종 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.md`: SHA-256 `77a77e3e7f4455231f6bdb0ed81edac022db5e2310064f6a5360ae322bd0d232` / 수정 시각 2026-10-22T11:48:29.911676+09:00
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.pptx`: SHA-256 `0ad58112129f2b96b39feb7965a7c171181d683d397841014e034b0b8007a199` / 수정 시각 2026-10-22T11:48:30.453972+09:00
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s02/exercise-conversation/order/활용-방식-판단.md`: SHA-256 `5cc7131a7b301f95eff6ddd457fddb591066bc67f22c290c0bfa87c45d659591` / 수정 시각 2026-10-22T11:47:49.201459+09:00


## 활용 방식 두 항목 통합 — 2026-10-22 (Asia/Seoul)

- 요청 반영: 「증강 LLM과 4가지 방식」을 「LLM 활용의 4가지 방식」으로 바꾸고 lead를 “수작업에서 에이전트로 갈수록 **작업 순서 결정이** 사람에서 LLM으로 옮겨 간다”로 정련했다.
- 네 방식의 비교는 작업 순서 결정과 사례에 집중했다. 증강 LLM 도식은 검색·도구·기억과 LLM의 구성만 보여 주고 워크플로·에이전트 경로 설명의 중복을 뺐다.
- 「워크플로와 에이전트」는 앞 표와 겹치던 두 정의 인용을 제거하고 이미 원문 확인한 적합성 비교 인용을 유지했다. 경로의 예측 가능성과 실행 중 판단의 유연성을 비교하며, 테스트 실패 뒤 수정·재검사도 코드로 정하면 워크플로라는 설명을 더했다.
- 한 장씩 통합 PASS: OOXML 제목으로 현재 8장 「LLM 활용의 4가지 방식」과 9장 「워크플로와 에이전트」가 continuation 없이 각각 한 장임을 확인했다. 덱은 22 → **20장**.
- 공간 계산: Production의 textHeightPt·naturalSize로 글 높이와 도식의 실제 표시 크기를 계산했다. 가로로 나란히 놓은 비교 도식은 7.2in 패널의 최소 글자 크기에서 폭을 넘겨, 위아래 배치로 조정했다. Renderer·템플릿은 수정하지 않았다.
- 자동 검사 PASS: 최종 Production 실행 오류 0·경고 0, 검사 블록 40개. 기존 인용의 선택·배치만 바꾸었으며 새 원문 확인이 필요한 인용은 없다. 목차·topic 번호를 바꾸지 않아 다른 세션 검사나 전체 테스트는 하지 않았다.
- 시각 검토 PASS: PowerPoint PDF의 변경 8·9장만 확인. 본문·도식·표의 겹침·잘림·쪽 번호 침범 없음. 그림 `/tmp/tm-s02-compact-review/p-08.png`, `/tmp/tm-s02-compact-review/p-09.png`.
- 이번 작업 렌더링 **3회**, 시각 검토 **2장**. 전체 도식 글자 크기의 별도 정밀 계측은 수행하지 않았으며 자동 검사 하한 통과와 구분한다.

### 이번 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.md`: SHA-256 `1b872b7260f765ea4e92fd5b29702810614239917a565040caaf98f3123103f3` / 수정 시각 2026-10-22T12:53:17.475921+09:00
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s02.pptx`: SHA-256 `d07430eb4176e80b1307f26bfd5dc98093af13c8ae4db8bef668532d7aa52363` / 수정 시각 2026-10-22T12:53:20.769264+09:00
