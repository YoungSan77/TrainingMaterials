# S03 별첨 실습 답변 표 8pt 예외 검증

2026-11-17 사용자 지시에 따라 `guides/production-guide.md`의 「S03 제작 기준」에서 별첨 실습 답변의 표 머리글·본문 셀만 맑은 고딕8pt로 지정했다. 별첨 제목·본문·캡션과 시연 응답은10pt를 유지한다. 원고와 기존 실행 기록은 수정하지 않았다.

이번 변경 파일:

- `guides/production-guide.md`
- `engine/production/src/builder.js`
- `engine/production/src/inspect.js`
- `engine/production/src/test/s03-oq-contract.test.js`
- `courses/ai-native/sessions/s03.pptx`, `s03.qa.json` (정식 재생성)
- 이 기록과 `verify-table8.py`, `table8-verification.json`

확인 결과:

- 정식30장, 실제 변경 장28·29쪽. 생성 전 후보와 비교해 두 표의 글꼴 속성 외에는 OOXML 동일. 나머지28장은 슬라이드 XML까지 동일하다.
- 28쪽 비교표: 머리글7셀+본문28셀=35셀, 29쪽 용어표: 머리글3셀+본문27셀=30셀. 모든 실제 텍스트 run에 직접 지정된 유효 크기800(8pt), latin·ea·cs typeface 모두 `맑은 고딕`. defRPr·endParaRPr도8pt로 맞췄다. 시연 표의50셀과 별첨 표 밖의 응답 문장은10pt 유지.
- `python3 courses/ai-native/checks/s03-production-20261117/verify-table8.py` 통과. 전문 해시와 원고 발췌 일치도 재확인했다.
- `node --test engine/production/src/test/*.test.js`: 292/292 통과. 별첨 반폭·전폭 표8pt/시연 표10pt를 회귀 테스트했다. 초기 검사기가 일반 별첨에도 예외를 적용하던 문제는 실제10pt 응답 문서의 메타데이터로 범위를 한정해 수정했다.
- 정식 자동 검사: 오류0·경고61(기존과 동일). QA는 재생성했으며 전체 제작 완료를 선언하지 않는다.
- `tools/review-pdf.sh courses/ai-native/sessions/s03.md 26 28-30`: 26·28·29·30쪽4장 시각 검토. 두 표 모두 잘림·겹침 없음. 대표 상황4행 보존. 30장 구성과 페이지 배치는 그대로이며, 29쪽 용어표 뒤 설명의30쪽 이월도 기존대로 남는다. 표 글꼴 예외만 적용하고 페이지 재배치는 하지 않았다.
- 이번 작업 생성2회(검사 범위 결함 수정 후 재생성 포함), PowerPoint 렌더1회, 시각 검토4장. 렌더 증거: `out/review/s03/s03.pdf`, `p-26.png`, `p-28.png`, `p-29.png`, `p-30.png`.
