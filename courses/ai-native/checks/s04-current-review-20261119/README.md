# 현재 S04 원고 재제작·검증 — 2026-11-19

`migration/portfolio-v2.6-absorb`의 `courses/ai-native/sessions/s04.md`와 현재 공통 `guides/session-authoring-guide.md`, `guides/production-guide.md`, 과정별 `courses/ai-native/production-standard.md`를 적용했다. Session Source·공통 두 가이드·과정별 기준과 다른 세션·정식 산출물은 바꾸지 않았다. 과정 파일 전체와 가이드의 시작 해시를 저장하고, 의도적으로 보강한 센서 등록 문서(`guides/agentic-repository-guide.md`) 외 **1,141개 파일 보존**을 종료 시 대조했다. 커밋·푸시는 하지 않았다.

## 판정과 파일

- **Production PASS**: 현재 PowerPoint에서 최종 후보 전 37장 렌더·시각 검토 완료. 누락·잘림·겹침 발견 없음. PDF 전체 24표·421셀 원문·경계·영문 식별자 줄 분리 검사 PASS.
- **자동 원고 QA 오류 0·경고 24**: 생성 전후 경고 배열이 동일하다. SA 완료나 Human 콘텐츠/최종 PPT 승인으로 간주하지 않는다.
- 최종 검토 PPTX: `out/s04-current-review-20261119/s04-review.pptx`
- 대응 QA: `out/s04-current-review-20261119/s04-review.qa.json` 및 이 폴더의 `final.qa.json`
- 최종 PPTX SHA-256: **`813e3b88fa7067f457045ded82e773ca114e30feeabfbfef10b943e0c166544c`**
- 원고 SHA-256: `4bad044f07189f01fb7801c534ca7e8c95fd76ac155b95be800701c5630804e1`
- 전 장 렌더: `out/review/s04-current-20261119/s04-review.pdf`, `p-01.png`~`p-37.png`, `contact-01.jpg`~`contact-10.jpg`. 원래 도구 출력 폴더에서 이 검토용 고유 폴더로 같은 파일을 복사했다. 파일 SHA-256은 QA에서 재대조했다.
- 정식 `courses/ai-native/sessions/s04.pptx`는 SHA-256 `ce1114738e2de0420763c445e78fbe6415b69d0e18506eef72adb17ec9a1fc30`을 유지한다. 정식 QA도 보존했다(`completion.json`).

## 원고·실행 기록 대조

목차 16개와 본문 번호 제목 16개의 문구·번호·순서가 일치한다. 세션명·세션/topic 참조 오류는 0개다. 저자 본문과 출처가 검증된 실제 응답 범위를 구분하는 기존 공통 QA를 적용했다. 결제·배송 설명과 표는 ‘사례’를 사용한다. 특히 544행 설명과 553~554행 표 제목/머리글은 「결제와 배송 요청을 확인하는 사례」다. `시나리오`는 현재 원고에 없다.

실습 프롬프트 ①은 `production-2026-11-17/prompt-01.txt` 첫 문장과 정확히 일치한다. ②의 기본 문구는 같은 실행의 `prompt-02.txt`에 그대로 있으며 실제 발견 문제와 근거를 채운 후속 요청이다. 수업용 기본 문구와 채워 넣은 실제 요청을 같은 길이의 원문이라고 판정하지 않았다. 두 실제 요청·메타데이터·이벤트·응답은 모두 보존했다.

실행 입력 `input-s03.md`는 승인 커밋 `038cb6ffb291d741e643425ea19bf75f0ccf2c75`의 S03 `exercise/주문한다-요구사항-정의서.md`와 바이트 단위 일치한다. 입력 SHA-256은 `29483a53927b58c30a0fb2592899c49f08f725213bdb8a74ee003f33ca23d29a`다.

실제 응답 전문은 `courses/ai-native/sessions/code/s04/exercise-conversation/production-2026-11-17/codex-response-02.md`이며, 같은 폴더의 `주문한다-정적모델.md`와 바이트 단위 일치한다. SHA-256 `ce2ac55e9ffe61701ab8f90ccf6c1c651b94053214c96768948a55bf8bd6fc0c`. 별첨의 **262개 항목·9개 생략 범위**가 문구·순서·강조·코드·도식 원본을 보존하며 전문과 대조된다. 대응 원문 행과 생략 위치는 QA `response_excerpts`에 있다. 원문을 수정하거나 현재 약칭 규칙으로 바꾸지 않았다.

Java 발췌는 원본 검사 오류 0개다. 기존 진입점 `node courses/ai-native/sessions/code/s04/static-model/run.mjs`를 실행해 **18 checks PASS, external calls=0**을 확인했다. `--release 17`로 컴파일하며 현재 판매가 1,200원, 기존 단가 1,000원, 기존 주문 금액 2,000원, 복수 항목 합계(계산 입력 1~20개), 빈 주문 거절, 0/음수 수량, 음수 금액, 0원 경계와 산술 범위 초과를 실제 검사했다. 결제·배송 동작이나 재결제의 주문 번호 유지는 검사하지 않았다.

교정용 `==…==`, `~~…~~`, ins/del과 원고용 의미 표식이 슬라이드 텍스트에 남지 않았음을 확인했다. 의도된 ‘검토할 모델’과 잘못된 모델 문장은 수업 문제이며 교정 표식이나 실제 응답으로 표시하지 않았다. 근거와 위치는 `source-and-layout.json`에 있다.

## 발견한 제작 결함과 공통 수정

수정 전 현재 원고를 생성한 `s04-before.pptx`의 19장 모델 문장 4개는 실제 OOXML에서 `spcBef=600`, `spcAft=600`, 즉 각각 **6pt**였다. 현재 Production Guide 「목록 본문 정렬」은 문장으로 쓴 수업용 검토 예의 문단 앞뒤를 **3pt**로 정한다.

세션 번호·고정 좌표·개별 문장 예외 없이, 저자가 명시한 ‘검토할 모델/검토용 모델/검토할 예문·예시’ 그룹의 일반 문장·목록에 공통 역할을 부여했다. 번호 질문·다음 그룹·코드에서는 범위를 끝내며 실제 응답은 변경하지 않는다.

| 변경 파일 | 수정 내용 |
|---|---|
| `engine/production/src/contentRoles.js` | 저자 검토 예의 문장 범위/역할 판정 |
| `engine/production/src/parse.js` | 파싱 후 공통 역할 연결, 원문 변경 없음 |
| `engine/production/src/paragraphs.js` | 해당 문장 앞뒤 3pt와 최종 검사 manifest 기록 |
| `engine/production/src/builder.js` | 같은 역할의 문단 간격을 분량 계측에도 반영 |
| `engine/production/src/inspect.js` | 최종 PPTX의 앞뒤 3pt를 다시 검사 |
| `engine/production/src/test/review-example-spacing.test.js` | 임의 세션 역할·범위 종료·실제 응답 보존·Java 내부 간격·변조 검출 회귀 3개 |
| `guides/agentic-repository-guide.md` | 기존 공통 3pt 규칙을 구현한 역할/센서 등록 |

공통 두 제작/저작 가이드의 규칙을 중복 정의하거나 수정하지 않았다. 원고도 바꾸지 않았다.

최종 19장 모델 문장 4개는 각각 앞뒤 **3pt**다. 실제 Java 코드와 별첨 계산 예문을 포함한 Consolas 문단 52개의 원문·글꼴·크기·문단 간격은 수정 전 출력과 동일하다. Java 내부 문단 간격은 기존 0pt를 유지한다. PDF에서 4개 문장의 글자 상자 위치와 겹침 없음을 대조했으며, 글자 상자 간격을 문단 속성 3pt와 같은 수치로 오인하지 않았다(`review-paragraph-render.json`).

## 최종 제작 검증

전 37장 시각 검토로 읽기 순서, 본문과 표/도식의 연결, 잘림·겹침·이어지는 장의 연결을 확인했다. 10절 문제와 「연관명과 다중성」, 실습 문제는 각각 한 장으로 유지된다. 인용 9곳의 표시용 한글·영문 따옴표, 출처·무글머리표와 역할별 크기는 기존 QA와 렌더에서 확인했다.

별첨 28~37장 10장의 슬라이드 XML은 정식 스타일 기준선과 비교해 **명시적인 영문 줄바꿈 금지 속성 외 바이트 단위 동일**하다. 8pt 표 260셀, 내용 기반 열 너비와 분할 간 공유, 왼쪽 우선 배치, 실제 응답의 그룹명·첫 두 항목·`.....`, 계산식·클래스 다이어그램을 보존한다. 모든 별첨 표의 열 너비는 기준선과 동일하며, 전체 표 421셀의 실제 PDF 대조도 문제 0건이다.

## 테스트·대표 회귀

- 전체 `node --test engine/production/src/test/*.test.js`: **341/341 통과, 실패 0**(`tests.log`).
- `courses/ai-native/sessions/s03`: 임시 재생성 30장, 출력 QA 오류 0. 직전 검증본과 전 장 슬라이드 XML 변경 0개, PPTX 전체 SHA-256도 동일(`40989a652fd208870759d203dea072a3e1d24fa08c0dc06afb874c07ddeac536`).
- `courses/ooad/sessions/s02`: 임시 재생성 93장, 출력 QA 오류 0. 직전 검증본과 전 장 슬라이드 XML 변경 0개, PPTX 전체 SHA-256도 동일(`5d653063cdecc74e04d9864f456e728c3f7feba04201cc12b2efe2f4b610f5d4`).
- 두 회귀 덱은 바이트 단위 동일하므로 직전 PDF/표 검증(각각 254셀·715셀 PASS)을 재사용했다. 이번에 두 덱을 새로 PDF 내보냈다고 보고하지 않는다(`regression.json`, `completion.json`). S03·OOAD 원고/정식 PPTX는 수정하지 않았다.

## 원고 판단·미완료 범위

원고 경고 24개는 일반 표 줄바꿈 9, 강조 11, 실제 응답 목록 구조 1, 강사 노트 누락 2, 한글 수량 1이다. 검사를 면제하지 않았으며 문구를 임의로 고치지 않았다. 전체 경고는 최종 QA, 작성자에게 전달할 위치/이유는 `source-feedback.md`에 있다.

특히 **725행**의 결제 거절·재결제 주문 번호 검사는 실제 Java 실행 범위와 구별할 필요가 있다. 강의의 합성과 별첨 실제 응답의 일반 연관 차이도 기존 기록에 근거해 보존했으며, 설명 연결 여부를 검토 피드백으로 남겼다. 이는 원문 변조나 이번 제작 결함이 아니다. 콘텐츠 승인은 새로 판정하지 않았고 SA 완료 기준(경고 0개)에는 미달한다. 요청한 현재 PowerPoint 제작 검증에는 남은 실패·미확인 항목이 없다.

첫 sandbox 원고 검사에서는 Chromium 실행이 차단돼 Mermaid 생성 전에 중단됐으며, 동일 검사를 권한을 높여 성공시켰다. 이 실패를 QA 결함이나 성공 실행으로 세지 않았다. 이후 생성·전체 회귀도 필요한 렌더 권한으로 수행했다. 권한 설정 파일은 바꾸지 않았다.

S04 성공 생성 3회(점검용 1회 포함), S03·OOAD 임시 생성 각 1회. 최종 전 장 PDF 내보내기 1회·시각 검토 37장.
