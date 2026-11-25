# S03 실습·실습 답 편집 구조 검증 — 2026-11-16

## 범위와 판정

후속 지시로 범위를 `courses/ai-native/sessions/s03`의 실습 한 장·실습 답 두 장으로 한정했다. 현재 작업 트리의 변경을 재사용했다. 기준은 `guides/production-guide.md`의 「S03 제작 기준」과 `references/inputs/s03-op.pptx`의 11~13장이다. 조정본은 부분 덱이므로 제목과 내용으로 대응했다.

**대상 23·25·26장 제작 검증 PASS. 전체 26장 Production 검증은 이번 범위에서 선언하지 않는다.** 자동 검사 PASS는 오류 0개이며 경고 40개는 남아 있다. SA 완료·Human 승인을 뜻하지 않는다. 원고와 조정본은 수정하지 않았다.

## 변경

- `engine/production/src/builder.js`: 두 원고 페이지를 각 페이지의 제목 경계에서 두 열로 나눈다. 첫 장은 스토리·주문 생성·금액 / 결제·배송, 둘째 장은 재결제 사례·표 / 성능·배송 실패로 구성한다. 실습 답의 2pt 문단 간격을 표 앞 텍스트의 실제 배치 높이에도 동일하게 반영했다.
- `engine/production/src/columnLayout.js`: 원고의 사건 번호를 native PowerPoint 번호 목록으로 보존한다. 시작 번호와 이어지는 줄의 본문 정렬을 유지한다.
- `engine/production/src/test/uo-contract.test.js`, `engine/production/src/test/practice.test.js`: 두 페이지 원고의 열 분리, 표 유지, 모든 그룹·소속 문단의 14/12pt, 그룹 Bold·무글머리표, 프롬프트 목록, 사건 번호 보존을 검사한다.
- `courses/ai-native/sessions/s03.pptx`, `s03.qa.json`: 현재 원고에서 재생성했다.

범위 확정 전의 변경(`paragraphs.js`의 S03 간격 전달, `builder.js`의 실제 문단 간격 측정, `guides/production-guide.md`의 S03 간격 기록 포함)은 보존했다. 다른 기존 미커밋 변경을 되돌리지 않았다.

## OOXML 전수 확인

증거: `out/s03-op-20261116/audit.py`, `out/s03-op-20261116/audit.json`. 좌표 단위는 EMU다.

| 출력 장 | 편집 구조 | 확인 결과 |
|---|---|---|
| 23 — 실습 | Shape 8 상단 전체 폭 목적, Shape 9 좌측 14문단, Shape 10 우측 2문단 | 좌측 투입물·진행 방법·프롬프트·점검 항목, 우측 결과물. 두 프롬프트는 `a:buChar` 목록이며 생략 위치를 유지한다. |
| 25 — 실습 답 1/2 | Shape 8 좌측 15문단, Shape 9 우측 12문단 | 각 열에 편집 가능한 텍스트 개체 하나. 왼쪽 스토리·생성·금액, 오른쪽 결제·배송. 원고가 선택한 항목과 `…..`를 유지한다. |
| 26 — 실습 답 2/2 | Shape 8 좌측 사례 10문단, Shape 9 native table, Shape 10 표 뒤 생략 1문단, Shape 11 우측 14문단 | 표 때문에 왼쪽 텍스트만 앞뒤로 나뉜다. 오른쪽은 편집 개체 하나. 표는 6행×3열이며 이미지가 아니다. 사건은 `a:buAutoNum` 시작값 1·2·3, 내어쓰기로 이어지는 줄을 정렬한다. |

- 세 장의 열 본문 **68문단 전수**: 그룹 16문단은 14pt Bold·`buNone`, 나머지 52문단은 12pt. 위반 0개. 상단 목적은 별도 14pt다. 표 셀은 공통 표 계약의 10pt다.
- 열 시작 X=365760 / 4709160. 본문 `marL=360363`; 목록은 음수 indent로 첫 글자 이후 줄을 맞춘다. 그룹은 `marL=0`, glyph 없음. 사건 번호 1~3 및 실습 점검 번호 1~4는 native 번호 목록이다.
- 슬라이드·노트 601문단의 맑은 고딕·줄간격 100% 검사 위반 0개. 이 검사는 전체 가독성 검증을 대신하지 않는다.

## 실제 렌더와 테스트

- Microsoft PowerPoint → `tools/review-pdf.sh courses/ai-native/sessions/s03.md 23 25-26` → PDF·50dpi PNG. PowerPoint 앱 버전은 수집하지 않았다. Renderer는 작업 트리의 Production 0.1.0, Node v25.1.0.
- 최종 PDF: `out/review/s03/s03.pdf`. 최종 화면: `out/review/s03/p-23.png`, `p-25.png`, `p-26.png`. 대응 조정본 화면: `out/review/s03-op/p-11.png`~`p-13.png`.
- 세 장의 열 읽기 순서·본문·표·번호·줄바꿈·끝줄을 확인했다. 겹침·잘림·넘침을 발견하지 않았다. 조정본 안의 `== … ==`는 출력하지 않았다. 조정본과 원고의 발췌 내용 차이는 최신 원고를 따른다.
- 관련 테스트 24/24 PASS 후 최종 전체 회귀 **277/277 PASS**, 실패 0개. `git diff --check` 통과.
- 자동 검사: **오류 0·경고 40**. 표 여러 줄 4, 강조 34, 요약 노트 1, `.DS_Store` 1. 미승인 원고 보완을 자동 반영하지 않았다.

## 입력·출력 식별

전체 경로는 저장소 루트 `/Users/YoungSan/dev/TrainingMaterials/` 기준이다. 수정 시각은 KST다.

| 파일 | 수정 시각 | SHA-256 |
|---|---|---|
| `courses/ai-native/sessions/s03.md` | 2026-11-16 11:00:27 | `4daecd9c9570dfdc7b7df019f67a032a9253c9ad5ca355d55dd98c10851ffcda` |
| `references/inputs/s03-op.pptx` | 2026-11-16 10:36:47 | `667697842a039badb65cbeffc41806ab38fe2fa93c1cd95f54aab85ab1a96e24` |
| `courses/ai-native/sessions/s03.pptx` | 2026-11-16 17:23:40 | `460467de1a47255b75bd0cf3caf1ccb063201d32e50b11421c49e3630fe5336e` |
| `courses/ai-native/sessions/s03.qa.json` | 2026-11-16 17:23:40 | `d467ed3a1d7c247d9addd15022a28a0c54adbde85b5f76f63062e02008f4b5b0` |

## 다음 항목

이번 범위 밖인 시연의 명시적 10pt 문서 서식과 나머지 장의 최종 제작 검증, 기존 경고 40개를 별도 처리한다. 원고의 새 실습 프롬프트에 대한 실제 실행 결과 미확보도 기존 내용 검토 항목으로 남는다.

범위 확정 후 PPTX 재생성 1회·PowerPoint PDF 렌더링 1회·최종 시각 검토 3장(조정본 대응 3장 별도). GUI 내보내기는 sandbox 외 실행 승인을 사용했다. 기존 허용 목록의 명령이며 `.claude/settings.json`은 수정하지 않았다.
