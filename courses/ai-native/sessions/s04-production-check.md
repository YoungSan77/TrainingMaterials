# 세션 04 제작 검토 기록

- 기록 시각: 2026-10-18T18:23:39+09:00
- 최종 슬라이드: 22장
- Renderer: 저장소 `engine/production/src/cli.js`, PlantUML MIT light 1.2026.0. 이 세션 작업에서는 renderer를 수정하지 않음.

## 입력과 출력

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`
  - 수정 시각: 2026-10-18T18:22:42+09:00
  - SHA-256: `ba27a3fdfbc5dc7fe58cdf1763d590146683ae575a51acd64c1b9fe22a1c938d`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`
  - 수정 시각: 2026-10-18T18:22:48+09:00
  - SHA-256: `fc2ca00aa611b29856cceb1d7d11525e0c3f3709bd8f67e93248c503d200c380`

## 확인 결과

| 항목 | 판정 | 방법·증거 |
|---|---|---|
| 원고 자동 검사 | PASS | s04.qa.json: 56블록, 오류 0·경고 0 |
| 인용문 typography | PASS | 원고 인용 4그룹 전체를 OOXML run과 대조. 한글 18pt, 영문·출처 10pt. bold와 한글 쉼표 뒤 영역 포함 |
| 실행 예제 | PASS | architecture/run.mjs가 javac 컴파일 후 거절·재결제 승인·금액·배송지·배송 순서·횟수를 검사 |
| 의존 검사 | PASS | jdeps 정상 구조 통과. 직접 import·완전한 이름의 영속 의존·패키지 순환 fixture를 컴파일해 탐지 및 CLI 종료 코드 1 확인 |
| 시각 검토 | PASS | PowerPoint PDF 출력 50DPI. 초안 23장 전체 확인 후 최종 변경 8·15·19장 재확인. 최종 22장의 내용에 대응하며 중복 설명 장 하나 병합 |
| 도식 글자 정밀 계측 | NOT VERIFIED | 최종 배치 raster 글자 전체의 pt 크기를 별도 계측하지 않음. 자동 크기 검사와 실제 출력 시각 확인을 구분 |
| 과정 전체 참조 | FAIL | --check로 12세션 검사. 세션 01–04 PASS, 뒤 8세션의 기존 참조 오류 194건. 기존 뒤 세션 덱을 덮어쓰지 않음 |

전체 Production 정밀 검증 완료로 표시하지 않는다. 위 PASS는 각 확인 범위에 한정한다.

## 검토와 실행 범위

- 원고 렌더링 3회. 별도로 과정 전체 --check 1회.
- 초안 23장 시각 검토, 수정 3장 재검토(총 26장 열람). 최종본은 22장.
- 불필요한 continuation과 긴 제목 겹침을 중복 설명 제거·제목 보완으로 수정했다. 상품 포트의 금액 타입 의존을 패키지 도식에 반영했다.
- 인용과 용어·사례의 원천은 현재 과정 설계와 작성 지침이다. 외부 제공자 API가 없으므로 주소·인증·실패 정책을 추측하지 않았다.
- 코드 예제는 결제대기 주문의 승인·거절 경로를 다룬다. 실제 API 연동·영속 DB·통신 실패·중복 승인·배송 요청 실패 복구는 구현하지 않음.
- 정적 의존 검사는 리플렉션·동적 로딩·업무 의미를 판정하지 않는다.
- renderer를 수정하지 않아 전체 renderer 테스트를 다시 실행하지 않음. 현재 예제의 실행과 구조 검사만 수행함.

## 보존 증거

review-pdf.sh는 재실행 때 앞 이미지를 정리하므로 현재 남은 증거는 최종 수정한 다음 3장이다.

- `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s04/p-08.png`
- `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s04/p-15.png`
- `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s04/p-19.png`
- 과정 참조 검사 로그: `/tmp/ai-native-s04-cross-check.log`
- 실행 원본·명령: `courses/ai-native/sessions/code/s04/architecture/README.md`


## 실습 완성 답안 보완 — 2026-10-18T18:57:04+09:00
- 이번 기록은 위의 이전 원고 검토 이후, 현재 별첨 답안 보완 범위에 대한 기록이다.
- 최종 덱: 22장. 자동 검사 PASS, 오류 0·경고 0.
- 원고 렌더링: 이번 보완 작업에서 1회. Renderer·템플릿·예제 코드는 수정하지 않아 전체 renderer 테스트나 예제 실행을 반복하지 않음.
- 내용 검증 PASS: 책임 배치·의존 방향·금지 의존·순환 금지, 상품/결제/배송 업무 계약, 미제공 API에 대한 담당·보류 결정, 대역과 예상 결과가 작성됨.
- 시각 검토 PASS: PowerPoint PDF 출력 50DPI, 변경 슬라이드 19, 20, 21, 22장. 겹침·잘림·순서와 완성 산출물의 가독성 확인.
- 사용자 의도 반영: 학습자가 점검 항목을 반영해 제출할 완성 산출물을 별첨에 두고, 작성·검토 방법은 강사 노트로 분리. 보완 (안)은 실제 반영 문장과 결정의 기록으로 작성.
- 도식 글자 전체의 최종 pt 정밀 계측은 NOT VERIFIED. 자동 검사와 실제 출력 검토 PASS를 전체 Production 정밀 검증 완료로 확대하지 않음.
- 과정 전체 --check는 세션 01–05 PASS. 뒤 7세션의 기존 참조 오류 183건은 과정 개편 대상. 로그: `/tmp/exercise-answers-cross-check.log`.
- 렌더 증거: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s04/`의 해당 p-NN.png 파일.
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`
  - 수정 시각: 2026-10-18T18:49:19+09:00
  - SHA-256: `1390b53b8f2d5f680027ff1631f42eeb8919cbba4d30cf6c77b0a8c864495768`
- 현재 파일: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`
  - 수정 시각: 2026-10-18T18:49:24+09:00
  - SHA-256: `9e450b7edc16f70cfe59243d396ea2cf2868b4a81720fe041c2e0549403c8f5f`
