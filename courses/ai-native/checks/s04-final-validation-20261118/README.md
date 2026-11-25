# S04 현재 기준 최종 검증 — 2026-11-18

최종 판정은 **FAIL**이다. 최종 검토 후보는 **37장**, 제작 오류 **0개**, 원고 참조 오류 **5개**, 경고 **35개**다. 필수 전 장 렌더 검증은 PASS이며 미실행 필수 항목은 없다. 자동 QA 오류가 남았으므로 정식 PPTX와 QA는 보존했다. 이는 제작 검증 결과이며 Human의 콘텐츠·산출물 승인과 구분한다.

## 입력·출력 식별

- 브랜치: migration/portfolio-v2.6-absorb.
- 입력: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md
- 입력 SHA-256: d55bd8d109478c7803a167db907fe52eb4efc524247287c854cb17cc08c37274
- 적용 기준: guides/production-guide.md 및 courses/ai-native/production-standard.md. 두 문서와 Session Authoring 지침의 입력 해시는 final.qa.json에 기록했다. 이번 작업에서 지침과 S04 MD를 수정하지 않았다.
- 검증한 PPTX: /Users/YoungSan/dev/TrainingMaterials/out/s04-final-validation-20261118/s04-candidate.pptx
- PPTX SHA-256: **ce1114738e2de0420763c445e78fbe6415b69d0e18506eef72adb17ec9a1fc30**
- 최종 QA: /Users/YoungSan/dev/TrainingMaterials/out/s04-final-validation-20261118/s04-candidate.qa.json
- QA 보존본: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/checks/s04-final-validation-20261118/final.qa.json
- 최종 PDF: /Users/YoungSan/dev/TrainingMaterials/out/review/s04-candidate/s04-candidate.pdf
- 전 장 이미지: out/review/s04-candidate/p-01.png~p-37.png.
- 스타일 대조본: out/s04-feedback-20261118/s04-feedback.pptx, SHA-256 f127ec441b7f96b6bae5973dfdce3c64ba595644692586f4559ee49a8c90ee06.

## 제작 결함 수정과 재검증

최초 임시 출력은 현재 입력과 직전 37장 스타일 검토본과 같은 SHA-256이었다. 현재 지침의 「소스 코드」와 대조한 QA에서 9·15·19·24장의 코드 영문 글꼴 4건이 맑은 고딕으로 출력된 결함을 확인했다(initial.qa.json).

코드 run을 Consolas로 설정해도 최종 normalizeTypography가 모든 Latin 글꼴을 맑은 고딕으로 덮어썼다. 일반 코드와 별첨 계산 예문의 Latin 글꼴은 Consolas, 한글은 맑은 고딕으로 유지하도록 고쳤다. 실제 출력 파일을 다시 읽는 inspect에 일반 코드와 단내 코드 문단의 글꼴·크기·원문 검사를 더했다. 미합의 원고 검사 예외나 완화는 추가하지 않았다.

최종 후보의 일반 코드 4블록과 단내 코드 31문단은 원문을 보존하고 글꼴 검사를 통과한다. PDF에도 Consolas가 실제 포함되어 있음을 확인했다(pdf-fonts.txt). 현재 지침을 적용한 이 글꼴 수정 이외에 37장 스타일 검토본의 장별 표시 문구와 별첨의 실제 열 너비는 동일하다.

## 필수 제작 검증

| 항목 | 결과와 근거 |
|---|---|
| 전 장 렌더 | PowerPoint PDF 37장과 PNG 37장 전체 시각 검토. 잘림·겹침·누락 발견 없음. |
| 인용 | 9곳. 표시용 한영 큰따옴표·출처 위치·무글머리표와 역할별 한글 크기/영문·출처 10pt를 전수 대조. |
| 코드·프롬프트 정렬 | 일반 목록 기준 코드 원점 93pt, 10절 번호 목록 기준 예문 원점 81.6pt 유지. 코드 선행 공백 보존. 실습 26장 프롬프트 ①/②의 첫 줄과 이어지는 줄은 PDF X=64.4pt로 일치. |
| 단내 표와 왼쪽 우선 흐름 | 원표 10개를 원표별 전체 행으로 한 번 계측한 폭 벡터를 공유. 분할 포함 표 11개, 260셀 모두 8pt, 한 단 320.4pt 이하. 왼쪽을 먼저 채우며 묶음이 부족하면 다음 단으로 옮김. |
| 내용 기반 폭 | 실제 열 너비를 37장 검토본과 모든 별첨 표에서 대조해 일치. 대표 주문 99.25394/85.25394pt, 가격 변경 97.00394/55.00394/55.00394pt. 재줄바꿈·행 높이·분할 재계측 적용. |
| 그룹·원문·생략 | 별첨 전체 문구·표 행/셀·질문 번호·코드·도식 원본과 순서를 원고에 대조. 질문 9.1~9.7의 그룹명과 원문 첫 2항목 및 .....를 실행 원문과 대조해 일치. |
| PDF 표 셀 | 전체 421셀의 표시 텍스트 일치와 행 경계 포함 여부 전수 대조. 누락·경계 초과 0건. |
| 개별 배치 | 「연관명과 다중성」 11장 한 장, 실습 문제 26장 한 장, 별첨 클래스 도식 36장 9pt 유지. |
| 전체 회귀 | 326/326 PASS. 코드 글꼴 회귀를 의도적으로 훼손하면 일반 코드/단내 코드 각각 QA가 실패하는 테스트 포함. |
| 범위 밖 임시 회귀 | AI-native S03 30장, OOAD S02 93장. 구조 오류 0개, 기존 임시 비교본 대비 장별 표시 텍스트 변경 0개. 정식 산출물은 생성·덮어쓰기하지 않음. |

## 실제 응답 참조 오류 5건

아래 원고 위치의 문장은 모두 실행 전문과 **줄 단위로 정확히 일치**한다. 전문은 courses/ai-native/sessions/code/s04/exercise-conversation/production-2026-11-17/codex-response-02.md이며 SHA-256은 ce2ac55e9ffe61701ab8f90ccf6c1c651b94053214c96768948a55bf8bd6fc0c이다. 같은 폴더의 최종 주문한다-정적모델.md와도 바이트 단위 일치한다. 원문은 수정하지 않았다.

| s04.md 행 | 원문 | 실행 전문 행 | 대조 |
|---|---|---|---|
| 868 | 이 문서는 승인된 S03 최종 정의서의 주문 기능을 수업용 최소 정적 모델로 정리한다. | 5 | 일치 |
| 882 | - **확정 업무 규칙**: 승인된 S03 최종 정의서에서 확정된 제약과 수용 기준이다. | 19 | 일치 |
| 883 | - **교육 예제 가정**: 과정 설계와 S04에서 모델 검증을 위해 명시적으로 사용하는 가정이다. 업무 정책으로 확정된 것은 아니다. | 20 | 일치 |
| 1040 | 다음은 확정 업무 정책이 아니라 과정 설계와 S04의 모델 검증을 위한 가정이다. | 176 | 일치 |
| 1056 | 다음 네 사례의 수용 기준은 S03 최종 정의서 6~7절에서 가져온다. 결제 이력이나 배송 요청을 별도 정적 개념으로 추가하지 않고, 대표 사례의 기대 결과로 확인한다. | 192 | 일치 |

판정 이유는 다섯 건 모두 같다. 현재 guides/production-guide.md의 「자동 검사 — 참조와 경고」는 S0x식 세션 참조를 오류로 중단하도록 한다. 실행 원문과 일치한다는 사실은 원문 보존의 근거이며 참조 검사 면제의 근거가 아니다. 현재 기준에는 합의·구현된 해당 참조 예외가 없고, 이번 요청도 원문 수정이나 미합의 예외를 금지했다. 따라서 **5건 모두 미해결 오류로 유지**했다. 정상 CLI --check도 오류 5개·경고 35개로 종료 코드 1이다(cli-check.log).

## 경고 35개와 범위

- 일반 표 줄바꿈: 9건
- 핵심어 강조: 20건
- 원문 목록 구조: 1건
- 강사 노트: 2건
- 요약 보완 기록: 1건
- 숫자 표기: 2건

일반 표 줄바꿈 경고는 한 줄을 우선하는 저작 기준의 경고이며, 실제 PDF에서의 누락·행 넘침과 구분했다. 실제 PDF 셀 전수 대조는 0건이다. 강조·강사 노트·숫자·원문 목록 구조를 임의로 바꾸거나 검사 예외로 숨기지 않았다. S04 원고 내용 보존 조건에 따라 모두 최종 QA에 남겼다.

## 정식 파일 보존과 변경 범위

- 정식 PPTX: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx
- 보존 SHA-256: 661279151b017f4bcbddefe0d3fa10799f572397847ad69258f183aaffeea238
- 정식 QA: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.qa.json
- 보존 SHA-256: 2e9aa4424b9e516519b516b494c12a75302bc3cc5dbd55d623cbdbff73ca8d78
- start.json의 S04 MD·정식 PPTX/QA, S01/S02의 미커밋 MD/PPTX, S03 MD/PPTX/QA와 두 제작 기준·Session Authoring 지침 해시가 종료 시점에도 모두 같다. 원고와 다른 세션 산출물을 보존했으며 커밋·푸시하지 않았다.
- 수정한 renderer: engine/production/src/builder.js, paragraphs.js, richText.js, typography.js, inspect.js. 코드 글꼴 계약과 실제 출력 검사에 한정한다.
- 추가 회귀: engine/production/src/test/code-font-contract.test.js.
- 이번 검증 기록·재현 스크립트: courses/ai-native/checks/s04-final-validation-20261118/.
- 검토용 출력만 별도 out/ 경로에 제공한다. 전체 QA 실패를 검토용 파일의 스타일 PASS로 대체하지 않는다. 일반 CLI의 발행 게이트를 수정하지 않았다.

S04 생성 3회 및 정상 CLI 임시 검사 1회, 대표 세션 임시 회귀 2회. 최종 PowerPoint 전 장 렌더 1회·시각 검토 37장.
