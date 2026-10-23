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


## 「정적 모델」 전면 작성 완료 — 2026-10-23 (Asia/Seoul)

### 내용 검토 — PASS

- 승인된 13개 목차 그룹으로 작성했다. 시간·장 수를 제한하지 않고 개념 모델과 온톨로지, 분석·설계·구현, 보편 언어·용어집, 판매가와 단가, 개념·관계·속성, 불변 조건과 시점의 조건, 구체 주문의 대입, 사람과 AI의 판단, 코드·실행 검사, 잘못된 관행과 실습을 담았다.
- 본문은 펜 2개·판매가 1,000원·총액 2,000원·서울을 유지하며 가격 변경 후 판매가 1,200원과 기존 단가 1,000원을 구별한다. 원 단위·금액 0 이상·수량 1 이상·항목 1개 이상의 교육용 가정과 용어표를 과정 설계에 기록했다. 승인 뒤 배송 요청 실패는 미정으로 유지했다.
- 인용 4개는 원문 확인 완료. lead 전체를 tools/read-leads.js로 읽어 제목·첫 문장·본문·도식의 질문을 대조했다. 요약은 소제목으로 시작하는 지침 형식이다.
- code/s04/static-model/src/의 Java 원본을 JDK 17 대상으로 컴파일·실행했다. 18개 검사 묶음 PASS. 단가×수량, 전 항목 합산(계산 입력 1~20개), 가격 변경 전후, 이후 생성 항목의 현재 가격, 관계·목록 변경 방지, 값 경계·산술 범위 초과를 확인한다. 결제·배송·상태 전이·외부 연동·영속·동시성의 완료를 뜻하지 않는다.
- 실습은 tools/run-exercise-turn.py와 Codex CLI로 실제 6회 실행했다(①~④ 각 1회, ⑤ 2회). 초기 sandbox의 상태 DB 권한 실패는 응답 생성 전 중단이며 성공 실행 횟수와 구별한다. 중복 항목의 미정을 허용으로 해석한 표현과 첫 최종화의 합계 설명을 실제 피드백으로 고쳤다. 앞 최종화는 finalization-rounds/01에 보존했다.
- 최종 MD와 codex-response-05.md의 바이트 일치 PASS. 별첨은 최종 응답 전문을 4부분·5장으로 수록했고 제목 단계·공백 정규화 후 원문 전체 일치 PASS. 원문을 PPT에 맞춰 편집하지 않았다. 학습자용 기본 문구와 실제 상세 피드백은 별개로 보존했다.

### 자동 검사 — PASS

- 최종 덱 32장, checked_blocks 77, 오류 0·경고 0. s01·s02·s03 교차 검사도 오류 0·경고 0이며 기존 덱은 덮어쓰지 않았다.
- Production 전체 테스트 182개 PASS, 실패 0. 고정 fixture 기반이며 원고를 기대값으로 쓰지 않았다. 집중 code-diagram 테스트 18개도 PASS.
- 필요한 renderer 보완: 독립된 인용 표식의 문단 경계, 0~3칸 들여쓴 fence 및 Java 발췌 대조, 표·코드가 섞인 10pt 문서 서식 유지, 짧은 코드 후속 설명의 높이 추정, 오답·대체된 enum 원본의 연속성 기준 구별과 중복 정상 원본의 값 합집합. production-guide.md와 재현 테스트 6개를 함께 갱신했다.
- 첫 시도의 CANCELLED 오답 enum은 유지했다. 정상 모델의 연속성 검사만 제외하는 이유 표식을 해당 파일에 명시했다. 이전 정적 모델·아키텍처 원본도 대체 사유를 명시했으며 코드 발췌 검사는 그대로 적용한다.
- 전체 테스트 로그: /tmp/tm-s04-production-tests-final.log. 교차 검사: /tmp/tm-s04-cross-check-final.log. lead 기록: /tmp/tm-s04-leads-final.txt.

### 제작 검증 — PASS (검토 범위: 본문·별첨)

- 실행·검토 일자: 2026-10-23 Asia/Seoul. renderer: engine/production/src/cli.js, @trainingmaterials/production 0.1.0의 현재 작업 트리. PowerPoint PDF 내보내기와 Poppler PNG로 실제 표시를 확인했다.
- 첫 35장 출력의 2~35장 34개를 /tmp/tm-s04-final-review/에서 검토했다. 인용 표식 노출, 들여쓴 text fence의 일반 문단 오인, 표 혼합 문서의 18pt 복귀, 짧은 코드 후속 설명의 불필요한 분할을 모아 한 번에 수정했다.
- 최종 32장 출력의 3~6·19~32장 18개를 /tmp/tm-s04-fixed-review/에서 재확인했다. 2·7~18장 내용과 배치는 앞 검토의 동일 본문을 유지한다. 총 시각 검토 52장(재확인 포함). 선택한 본문·도식·표·코드·별첨에서 겹침·잘림·넘침 없음. 목차 1장은 OOXML 구조로 확인했고 별도 이미지 검토는 하지 않았다.
- 실제 코드와 설명은 같은 장에 배치됐다. 「경계와 검사 범위」는 검사 대상 목록과 결과·검증 한계를 두 장에, 별첨의 조건·대표 예는 원문을 보존해 두 장에 둔다.
- 인용 4그룹 전부 OOXML a:r 단위 검사: 최종 3·4·5·6장의 한글 18pt, 영문 10pt, 출처 10pt PASS. 굵은 한글도 18pt 유지. 기록 /tmp/tm-s04-quote-runs.json. 모든 p:txBody에 a:p가 있고 표식이 본문에 남지 않음 PASS.
- 도식 최종 표시 크기 측정: 10장 PlantUML 10pt, 15장 SVG 10pt, 29장 Mermaid 7pt. 최종 PPT의 그림 크기와 소스별 단위를 반영한 pictureTextPt로 확인했다. 측정 manifest: /tmp/tm-s04-manifest.json. 세 도식 모두 최종 PNG 배치도 시각 확인했다.
- s04.qa.json의 visual_status=NOT_VERIFIED는 자동 renderer의 기본값이다. 이 기록은 실제 선택 장의 시각 검토를 별도로 증명하며 QA 원본을 수동 변경하지 않았다.
- s04 성공 렌더링 3회(초기 --check 임시 덱 1회 포함), Mermaid의 Chromium sandbox 실행 실패로 중단한 1회는 별도다. s01~s03 교차 검사 임시 렌더링은 s04 횟수에서 제외한다.

### 최종 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`: SHA-256 `b513a3da03f2f6c1ebc63f228516f320ca039704f330ecece271bad83b5e9aaa`, 수정 시각 `2026-10-23T08:45:24.648585+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`: SHA-256 `f9787d99c837efa3bb407979fe65fe1568614a1fef47e5283e64e8486e97457a`, 수정 시각 `2026-10-23T09:06:35.719084+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.qa.json`: SHA-256 `310edaa1c84deb5ab96c8c738e52b79780a0759b105fd50bb6065a05d6d9773c`, 수정 시각 `2026-10-23T09:06:35.994102+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s04/exercise-conversation/order/주문한다-정적모델.md`: SHA-256 `bbadb01c56303858af1b7e30d402d1d794d2d96deb22cf9f5de4fab821b5df88`, 수정 시각 `2026-10-23T08:45:24.648152+09:00`


## 사용자 검토 반영 — 도메인 모델 시나리오 재검토와 배치 — 2026-10-23

### 재검토와 내용 보완 — PASS

- 사용자 지적: 기존 23·24장을 통합하고, 기존 29장의 클래스 도식 배치를 바꾸며, 기존 30장을 먼저 채운 뒤 기존 31장에 나머지를 남긴다. 도메인 모델이 목표에 비해 본문에서 충분히 다뤄지지 않으므로 시나리오를 원점에서 재검토한다.
- 진단: 기존 원고에는 도메인 모델 정의와 주문·항목·상품의 개념도는 있었으나, 요구에서 모델을 도출하고 하나의 모델로 상세화·검증하는 과정이 약했다. 가격 보존과 코드가 교수 흐름의 중심이 되어 목표를 충분히 뒷받침하지 못했다. 정의가 문자 그대로 전혀 없었다고 기록하지 않는다.
- 기존 구성의 범위 안에서 「06. 도메인 모델 만들기」와 「08. 주문 도메인 모델의 검증」을 보완했다. 도메인·도메인 모델의 뜻과 정적·동적 관점을 설명하고, 작성 순서 → 요구에서 개념 후보 선택 → 관계 초안 → 관계의 문장 검토 → 속성·조건 보완 → 상세 도메인 모델 → 구체 주문 대조 → 코드·검사의 흐름을 만들었다.
- 실제 요구의 단서에서 주문·항목·상품을 선택하는 이유와 금액·수량·배송지를 값으로 다루는 이유를 밝혔다. 고객·결제·배송을 검토 없이 제거하거나 무조건 클래스로 만드는 두 오류를 피하고, 본인 확인의 식별 의미·결제 이력 구조가 미정이라는 경계를 드러냈다.
- 초안은 세 개념·두 관계만, 상세 모델은 같은 개념·관계에 속성 타입·파생 총액·가격 확정과 합계 조건을 더한다. 전체 주문 시스템의 분석이 모두 끝났다고 선언하지 않는다. 사건·전이·외부 요청의 순서는 동적 모델로 이어진다.
- 과정 설계의 세부 목차·모델에서 보완된 내용, 목표·요약과 용어표의 첫 등장 위치도 대조·갱신했다. 장 수나 시간에 맞춰 학습 내용을 줄이지 않았다.
- Larman 2004의 도메인 모델 작성 지침을 tools/verify-quote.js로 확인해 추가했다. 인용은 총 5개이며 최종 3·4·5·6·10장의 모든 인용 run이 한글 18pt·영문/출처 10pt임을 확인했다. /tmp/tm-s04-revision-quote-check.json.

### 요청한 배치 — PASS

| 기존 장 | 최종 장 | 반영 |
|---|---|---|
| 23·24 | 26 | 검사 대상 표와 후속 설명을 한 장으로 통합 |
| 29 | 31 | 클래스는 좌우, 도식과 설명은 상하 배치 |
| 30·31 | 32·33 | 32장을 표 행까지 먼저 채우고 남은 행·설명만 33장에 이어 배치 |

- 26장 통합은 문장의 의미를 보존해 반복 표현을 정리했다. 렌더링 전 계산: 표 아래 여유 172.6pt, 후속 설명 153.6pt로 한 장 적합성을 확인했다.
- 실제 LLM 응답의 Mermaid에 사용자 요청에 따른 `direction LR` 한 줄만 추가했다. 원본 최종 MD·실제 응답은 바이트 그대로 보존했다. 이 배치 지시와 제목·공백 정규화 외에는 별첨과 응답 전문 일치 PASS.
- 가로 클래스 도식에서 renderer가 다중성의 따옴표에 flowchart용 HTML 래퍼를 넣어 값·폭을 왜곡했다. classDiagram의 다중성은 원문 그대로 보존하도록 adapter를 수정했다. 기존 flowchart 캐시는 재사용한다. 최종 31장의 도식은 실제 PPT 그림 폭과 SVG 단위 기준 10pt다.
- 혼합 10pt 문서는 남은 영역에 헤더와 데이터 행이 들어가면 앞 장에 먼저 배치하고, 나머지 행을 헤더와 함께 다음 장으로 잇는다. 원본의 순서와 모든 행을 보존했다. 헤더만 남기지 않는 회귀 테스트를 추가했다.

### 검증 — PASS

- 최종 34장, 오류 0·경고 0, checked_blocks 84. 실제 응답 별첨 5장이다. QA의 visual_status는 자동 기본값 NOT_VERIFIED이며 이 기록이 선택한 실제 출력의 검토 근거다.
- renderer 전체 테스트 184개 PASS, 실패 0. 최종 로그 /tmp/tm-s04-revision-tests-latest.log. 최초 sandbox 테스트는 Chromium 실행 제한으로 실패했고 승인 후 같은 전체 테스트를 통과했다. 실행 제한 실패를 기능 회귀로 오인하거나 테스트 기대값을 바꿔 통과시키지 않았다.
- s01·s02·s03 교차 검사 오류 0·경고 0. /tmp/tm-s04-revision-cross-check-final.log. 기존 덱은 덮어쓰지 않았다. Java 원본 재실행 18개 검사 묶음 PASS, /tmp/tm-s04-revision-java.log.
- tools/read-leads.js로 최종 논지 검토: /tmp/tm-s04-revision-leads-final.txt. git diff --check PASS.
- PowerPoint PDF 내보내기 후 최종 2~3·10~21·26~34장 23개를 /tmp/tm-s04-revision-review/에서 시각 검토했다. 새 시나리오·초안·상세 모델·인스턴스·통합 장·클래스 가로 배치·표 연속 배치에서 겹침·잘림·넘침 없음. 변경하지 않은 장은 재검토하지 않았다.
- 도식 측정 데이터: /tmp/tm-s04-revision-diagram-metrics.json. 이번에 새로 그린 12·17장의 PlantUML과 31장의 Mermaid는 PPT 최종 그림 폭·소스별 단위를 반영한 측정에서 10pt다. 기존 인스턴스 SVG는 배치가 유지됐고 시각 검토했다.
- 이번 성공 렌더링 3회. 첫 두 출력의 경고(짧은 continuation, 클래스 다중성 래퍼에 의한 가로 폭 왜곡)를 모아 수정한 뒤 최종 경고 0을 확인했다. 시각 검토 23장.

### 이번 최종 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`: SHA-256 `8b458d27a139438a22c69d1a9bc9577e5ae65bde6578cf7db47129f877bba71e`, 수정 시각 `2026-10-23T14:47:49.123877+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`: SHA-256 `0f3ef2fa2a47ab85bfe3e819f9d61fcc16b54fa18520837020040b1df0c715e1`, 수정 시각 `2026-10-23T14:47:49.915142+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.qa.json`: SHA-256 `40b3ce477bbaa474aaeb504f2a0a36edab3e5970614b994b33a25fec8226f6ae`, 수정 시각 `2026-10-23T14:47:50.036537+09:00`


## 모델 관점의 공통 기준 확정 — 2026-10-23

- 사용자와 합의한 관점: 도메인 모델은 정적 구조와 동적 행위를 함께 포함하고, 설계에서 아키텍처를 포함한 소프트웨어 실현 결정을 추가한다. 용어를 개별 모델·단계처럼 사용하지 않는다.
- 혼동의 원인을 두 축으로 분리했다. 분석·설계는 결정의 대상이고, 정적·동적은 그 대상을 보는 관점이다. 도메인 모델과 설계 모델 모두 정적·동적 관점을 가진다. 아키텍처는 설계의 일부이며 중요한 구조·실행·품질·변경 결정을 다룬다.
- 원천: guides/sw-engineering-principles.md의 「도메인 모델·설계 모델과 정적·동적 관점」. 개념 모델·다이어그램·온톨로지·파일의 관계와 원전의 좁은 용례를 인용하는 범위도 여기에 정리했다. 원전의 정적 개념도 정의를 사용자와 합의한 포괄적 정의로 확대 귀속하지 않는다.
- course-design-guide.md와 session-authoring-guide.md는 이 원천을 참조하고, 세션 경계·설명 순서·내용 검토 기준에 적용한다. 의미 관계에 관한 저자 검토 계약이며 renderer 문법·배치·자동 검사 계약을 변경하지 않았다. 의미를 단어 출현 여부로 판정하는 코드·모사 테스트를 추가하지 않았다.
- ai-native·ooad의 과정 설계에 관점 대응과 원전 적용 결정을 반영했다. ai-native의 04·05는 같은 도메인 모델의 두 관점이고 06·07은 같은 설계 활동의 아키텍처·객체 설계 범위다. OOAD 기준 예시 원고는 기계적으로 수정하지 않았다.
- references/sw-engineering-approach/sw-engineering-approach.md의 「02. 결정 경계」·「15. 다이어그램 선택」·「16. 변환이 아닌 설계」를 대조했다. 업무 의미와 소프트웨어 실현을 구분하는 설명은 새 기준과 양립하므로 이 참고 원고·PPT는 수정하지 않았다. references/production은 읽거나 수정하지 않았다.
- 현재 s04는 도메인 모델의 포괄적 정의 → 정적·동적 관점과 표현 → 온톨로지와의 관계 순서로 정리했다. Larman 인용은 정적 개념 구조를 설명하는 범위를 명시했다. 저자 본문·실습 기본 문구·요약은 도메인 모델의 정적 관점을 다룬다는 이름으로 통일했다. 실제 응답·MD·별첨의 원문은 그대로 두고 용례의 관계를 실습 노트에 기록했다.
- 최종 35장, checked_blocks 87, 오류 0·경고 0. s01·s02·s03 교차 검사도 오류 0·경고 0(/tmp/tm-s04-perspective-cross-check.log). 이번 변경에 renderer·템플릿·Java 변경은 없으며 전체 회귀 테스트는 반복하지 않았다.
- 인용 5개 전체 OOXML run 검사에서 한글 18pt·영문/출처 10pt PASS. tools/read-leads.js의 논지 검토는 /tmp/tm-s04-perspective-leads-final.txt에 있다. git diff --check PASS.
- PowerPoint PDF 출력에서 변경한 2~6·21·29~30장 8개를 /tmp/tm-s04-perspective-review/에서 시각 검토했다. 도메인 모델·관점/표현·온톨로지·분석/설계의 관계, 후속 용어·실습·요약에서 겹침·잘림·넘침 없음. 기존 통합·가로 도식·앞 장 우선 채움은 유지한다. 자동 QA의 NOT_VERIFIED 값과 이 실제 검토 기록은 구별한다.
- 이번 렌더링 2회(첫 출력의 짧은 continuation 경고를 문장의 역할에 맞춰 정리한 후 최종 0), 시각 검토 8장.

### 최종 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`: SHA-256 `12dfe14e29a5ac79a6273fff472c10379c70352b949c4ff72e465a7d5212766e`, 수정 시각 `2026-10-23T15:03:27.560335+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`: SHA-256 `79f2c1e1f3f9b059f51f9d6ce75df591fa834b18c072e9ec27056fb1e49182f3`, 수정 시각 `2026-10-23T15:03:28.748719+09:00`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.qa.json`: SHA-256 `dfa1a19de785cb6f340b6ae1a7d9a96c34a8cac3583dce353cc93033d111f598`, 수정 시각 `2026-10-23T15:03:28.905546+09:00`


## 33·34장 통합 — 2026-10-23

- 요청한 조건·대표 예 두 장을 33장 한 장으로 통합했다. 최종 34장이다. 원고·실제 응답·표의 7개 데이터 행·마지막 설명·10pt 글자 크기를 유지했다.
- 10pt 혼합 문서의 전체 높이를 먼저 계산하도록 renderer를 보완했다. 다섯 블록 사이를 모두 8pt로 배치하고, 일반 본문용 여유 높이와 코드의 예비 빈 줄을 배치 높이에서 제외한다. 내용 386.4pt + 간격 32pt = 418.4pt로 가용 421.4pt 안에 들어간다. 넘치는 문서는 기존 표 분할 흐름으로 이어진다.
- production-guide.md의 배치 계약과 고정 fixture 회귀 테스트를 함께 갱신했다. 전체 테스트 185개 PASS(/tmp/tm-s04-equal-gap-tests-final.log), s01~s03 교차 검사 PASS. s04 자동 검사 오류 0·경고 0, checked_blocks 86. git diff --check PASS.
- PowerPoint PDF의 33장을 시각 검토했다(/tmp/tm-s04-equal-gap-review/p-33.png). 표 마지막 행과 하단 설명까지 포함해 겹침·잘림·넘침 없음. 첫 PDF 내보내기 오류 후 대기 시간을 늘려 재시도해 성공했다.
- 이번 s04 렌더링 1회·시각 검토 1장. 교차 검사는 임시 출력만 생성했다.

### 최종 산출물 식별

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.md`: SHA-256 `12dfe14e29a5ac79a6273fff472c10379c70352b949c4ff72e465a7d5212766e`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.pptx`: SHA-256 `2269b54c7d66f13ece80f039bcc26c27880ec07cdbcd169b347aefa7b94909f7`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s04.qa.json`: SHA-256 `1fe2765ab0cd3d69b9235ebf81d90c0fff3b723114ec10cb70a3033375917194`


### 2026-10-23 — ERD 장의 제목 수정

- 5장의 제목 「개체 관계 다이어그램과 클래스 다이어그램」이 두 줄로 넘쳐 첫 줄이 잘리고 머리말을 덮었다. 「ERD와 클래스 다이어그램」으로 줄였다. 본문 첫 문장이 용어를 정의하므로 제목의 약어는 그대로 읽힌다.
- `course-design.md`의 영한 용어집이 가리키던 topic 이름도 함께 고쳤다.
- 36장·오류 0·경고 0 유지. 렌더링 2회·시각 검토 4장(5·6·34장과 재확인).
