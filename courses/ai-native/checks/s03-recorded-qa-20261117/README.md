# S03 수정 원고 재생성 및 원문 보존7건 검증

검증일: 2026-11-17(KST). 현재 작업 트리와 활성 과정 `ai-native`, 과정별 제작 기준을 확인했다. 사용자가 수정한 `courses/ai-native/sessions/s03.md`를 입력으로 PPTX·QA를 재생성했다. 이 작업 중 MD·실행 원문을 수정하지 않았고, 시작 시 입력 스냅샷과 최종 MD의 바이트 일치를 확인했다. 기존 미커밋 변경을 보존했으며 다른 세션 제작·커밋·푸시는 하지 않았다.

## QA와 기존 원고 결함21건

최종 자동 검사: **오류0·경고0**, 30장이다. 입력·PPTX·QA의 해시·경로·수정 시각은 `verification.json`에 기록했다. QA의 자동 필드 `visual_status=NOT_VERIFIED`와 아래 실제 렌더 검증을 구분한다.

직전 `s03-warning-links-20261117/warning-audit.json`의 실제 원고 결함21건을 다시 확인했다. 저자 문장20개는 원래 문구를 보존한 핵심어 강조가 추가됐고, 요약 노트에는 모델에서 보완된 내용을 설명하는 줄이 추가됐다. **21/21 해소**다. 이전 경고 ID·현재 원고 행·수정 문장은 `verification.json`의 `resolvedOriginalDefects`에 전수 기록했다. 원문 보존 예외를 적용하기 전에도 일반 강조 경고는 실제 프롬프트2건만 남고 요약 기록 경고는0이었다. 따라서 저자 결함을 예외 처리로 숨기지 않았다.

## 원문 보존7건의 개별 판정

| ID | 현재 원고 위치 | 기록 대조 | 제외한 검사 |
|---|---|---|---|
| s03-prompt-initial | s03.md:676, 실습 첫 요청 | 실습 `prompt-01.txt`의 첫 요청 문구와 완전 일치 | `unboldedText`만 |
| s03-prompt-final | s03.md:680, 실습 최종 요청 | 실습 `prompt-03.txt` 전문과 완전 일치 | `unboldedText`만 |
| s03-demo-us01-intro | s03.md:458, US-01 ‘인수 조건:’ | 시연 응답의 같은 절·소개 문구·뒤 첫2항목 일치 | `flatGroupItems`만 |
| s03-demo-us02-intro | s03.md:468, US-02 ‘인수 조건:’ | 시연 응답의 같은 절·소개 문구·뒤 첫2항목 일치 | `flatGroupItems`만 |
| s03-demo-us03-intro | s03.md:478, US-03 ‘인수 조건:’ | 시연 응답의 같은 절·소개 문구·뒤 첫2항목 일치 | `flatGroupItems`만 |
| s03-demo-us04-intro | s03.md:488, US-04 ‘인수 조건:’ | 시연 응답의 같은 절·소개 문구·뒤 첫2항목 일치 | `flatGroupItems`만 |
| s03-answer-case-intro | s03.md:817, ‘공통 사례는 다음과 같다.’ | 실습 최종 응답의 ‘6. 대표 상황 비교’·소개 문구·뒤 첫2항목 일치 | `flatGroupItems`만 |

실행 기록의 루트는 `courses/ai-native/sessions/code/s03/exercise-conversation/production-2026-11-16/`다. 프롬프트는 `exercise/prompt-01.txt`·`prompt-03.txt`, 시연 응답은 `demo/codex-response-01.md`, 실습 최종 응답은 `exercise/codex-response-03.md`를 사용했다. 각 대상의 실제 문구·뒤 항목·블록 번호·원고 행·기록 파일 해시·문구 해시·판정 근거는 `verification.json`의 `recordedBlocks`에 있다.

판정은 **7/7 MATCH, 미일치0**이다. 시연1턴·실습3턴은 기존 종료코드0, JSONL 마지막 agent_message와 응답 전문의 일치를 다시 확인했고, 선정한 시연·별첨 발췌도 현재 MD에 그대로 있다. 새 LLM 실행은0회다.

## 검사 범위와 회귀

- 과정별 `courses/ai-native/recorded-checks.json`에 대상 세션·topic·문맥·블록 종류·기록·허용 검사 하나를 명시했다. 공통 `recordedChecks.js`가 생성 시마다 실제 파일을 읽고 대조한다. 원고나 블록 metadata는 고치지 않고, 검증한 블록 객체만 검사별 WeakSet으로 전달한다.
- 요청은 실제 요청 문구가 정확히 일치해야 한다. 응답5건은 `verbatimResponse` 표식이 있는 절에서 같은 소제목·소개 문구·뒤 첫2목록 항목의 문구·종류·들여쓰기까지 일치해야 한다. 관계없는 원문의 Markdown 들여쓰기 때문에 오판하지 않도록 대조할 절만 파싱하며 원문 파일은 수정하지 않는다.
- 파일 누락·블록 누락·모호함·문구/항목 변경은 `MISMATCH` 경고를 남기고 해당 예외를 주지 않는다. 두 검사 이외의 참조·구조·내용·폰트·여백·렌더 검사 호출은 유지했다. 실제 응답 전체나 세션 전체를 새로 검사에서 제외하지 않았다.
- 현재 S03의 메모리상 복제본에 저자 문장과 저자 목록 소개를 넣어 `unboldedText`·`flatGroupItems`가 모두 계속 경고하는 것을 확인했다. 디스크 원고에는 이 대조용 문장을 넣지 않았다.
- 신규 고정 fixture 회귀 테스트는 같은 세션의 저자 문장, 검사 간 예외 전파 금지, 잘못된 요청·응답 항목, 없는 기록, 잘못된 세션·문맥, 비기록 응답을 확인한다. 관련7테스트와 최종 전체 **314/314 테스트 통과**다.
- 공통 Production·SA 지침의 원문 대조 예외 계약과 Agentic Repository Guide의 센서 설명, AI-native 제작 기준을 구현과 함께 맞췄다.

## 최종 렌더·표 검증

최종 PPTX 전30장을 PowerPoint로1회 PDF·PNG 렌더링했다. 증거는 `out/review/s03/s03.pdf`, `p-01.png`~`p-30.png`, `s03-bbox.html`이다. 사용자 원고 수정으로 바뀐12장(2·3·4·5·6·8·13·14·15·22·24·25)과 두 연결·인접7장(16·17·18·19·28·29·30), 총 **19장**을 시각 검토했다. 누락·겹침·잘림을 발견하지 않았다.

- **US-01:** 제목·설명·인수 조건이 모두17쪽의 같은 장에 있다.
- **판매가·기록 단가 설명:** 29쪽 용어표 바로 아래 같은 열, 간격8pt다.
- **PENDING_PAYMENT:** 최종29쪽 용어표 ‘표기’ 셀에서 PDF 단어1개·줄1개로 확인됐다. 현재 표기 열 폭83.48pt에서 들어가므로 **열 너비를 추가 조정하지 않았다**.
- **표254셀:** 사방 각각54000EMU(0.15cm), 본문121셀10pt, 시연50셀·판단표18셀·별첨65셀8pt를 전수 확인했다. frame 폭=열 너비 합, frame 높이=행 높이 합도 확인했다.
- 최종 PDF에서254셀 텍스트가 PPTX와 일치하고 행 밖 넘침0, 페이지 밖 텍스트0이다. 최종 PDF·PPTX 해시, 식별자 한 줄 계측과 렌더 대조는 `render-verification.json`에 기록했다.

## 산출물과 승인 전 남은 항목

- PPTX: `courses/ai-native/sessions/s03.pptx`
- QA: `courses/ai-native/sessions/s03.qa.json`
- 개별21건 해소·원문7건 판정·원고 불변·저자 검사 대조·표 수치: `courses/ai-native/checks/s03-recorded-qa-20261117/verification.json`
- 최종 렌더·셀 텍스트·PENDING_PAYMENT 한 줄: 같은 폴더의 `render-verification.json`

이번 범위의 미해결 오류·경고·원문 대조 불일치는 없다. **Human의 최종 내용·PPTX 승인은 별도이며 아직 선언하지 않는다.** 이전 제작 기준에 이름이 남아 있는 미제공 `s03_or.pptx`와의 메모별 대조는 기존의 NOT VERIFIED 상태를 유지한다. 이번에는 현재 MD와 명시된 제작 기준·실제 렌더 결과로 확인했으며 다른 참조 파일을 그 파일로 대체하지 않았다.

작업 횟수: S03 PPTX 생성1회·최종 전30장 렌더1회·시각 검토19장, 관련 테스트1회·전체 테스트1회. 원고·실행 기록은 변경하지 않았고 다른 세션 제작·커밋·푸시는 하지 않았다.

## Human 기준본 승인 — 2026-11-17

사용자는 이 대화에서 **S03 「요구사항」의 최종 원고와 PPTX를 AI-native SW 공학 과정의 기준본으로 승인한다**고 명시했다. 승인 기록 일시는 **2026-11-17 23:11:42 KST (14:11:42 UTC)**다. 이는 앞 절의 검증 당시 미승인 상태 이후의 승인 기록이며, 다른 세션의 승인이나 제작 착수 승인을 뜻하지 않는다.

승인 대상은 아래 세 파일이며, 저장된 전체 SHA-256을 실제 파일과 `verification.json`에 대조해 모두 일치함을 확인했다. 이미 검증한 원고·PPTX·QA를 재생성하거나 수정하지 않고 그대로 승인 대상으로 사용했다.

| 기준본 파일 | 승인 SHA-256 |
|---|---|
| `courses/ai-native/sessions/s03.md` | `6b1f0ab2ec875ff1187f819c7f916601e34d74531f6a3f56fd7e2413b6a40a7a` |
| `courses/ai-native/sessions/s03.pptx` | `0f4c7f2ddafd44636ed23538b774f78a86cd4fa029b13d3433ba648a9acc0f90` |
| `courses/ai-native/sessions/s03.qa.json` | `345570e2bebfc0f00a213f6890bc1d2288e29b55a2f3c6fc9e8aca154787cadb` |

- QA는 **30장·오류0·경고0**이다. `verification.json`은 `courses/ai-native/checks/s03-recorded-qa-20261117/verification.json`이다.
- `courses/ai-native/checks/s03-recorded-qa-20261117/render-verification.json`의 `pptxSHA256`도 위 승인 PPTX와 일치한다. 최종 PowerPoint 전30장 렌더 기록이며, **29쪽 용어표의 `PENDING_PAYMENT`가 단어1개·줄1개**(`glossaryIdentifier[0].lines=1`, 표기 열83.48pt)로 확인된 것을 승인 근거로 포함한다.
- 입력과 출력의 연결·표254셀·원문 보존7건·저자 검사 대조·회귀 테스트314개 통과에 대한 앞 절의 검증 근거를 함께 보존한다. 미제공 참조 파일과의 과거 대조 미확인은 이력으로 유지하며, 이번 명시적 기준본 승인을 미승인 상태로 되돌리지 않는다.
- 이 기준본을 재현하는 데 필요한 AI-native 과정 설계·제작 기준·원문 대조 설정·공통 지침·렌더러·검사·회귀 테스트와 최종 실행 증거를 승인 범위의 커밋에 포함한다. 다른 세션 산출물·임시 출력·별개 작업은 제외한다. 이번 승인 확인에서는 PPTX 생성0회·렌더0회이며 기존 검증 결과를 사용했다.
