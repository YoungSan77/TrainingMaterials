# S03 별첨 표 위아래 여백 검증

2026-11-17: 「S03 제작 기준」에 별첨 표 머리글·본문 맑은 고딕8pt, 위아래 여백 각각0.15cm(`marT=54000`, `marB=54000`), 좌우 여백 보존을 명시했다. 시연 입력·응답의 내용과 순서 및 판단표 문구 보존도 명시했다. 원고·실행 기록은 수정하지 않았다.

변경 파일: `guides/production-guide.md`, `engine/production/src/builder.js`, `engine/production/src/test/s03-oq-contract.test.js`, 재생성한 `courses/ai-native/sessions/s03.pptx`·`s03.qa.json`, 이 기록과 `verify-margin15.py`·`margin15-verification.json`.

실제 변경 장은28쪽 비교표35셀과29쪽 용어표30셀이다. 모든 머리글·본문 run의 유효 글꼴은 맑은 고딕8pt이고, 모든 셀의 `marT`·`marB`는54000이다. 좌우 셀 여백과 그 밖의 XML은 생성 전 후보와 동일하다. 시연 입력·응답의 내용·순서, 판단표 문구, 10pt 텍스트와30장 구성을 보존했다. `verify-margin15.py`가 이를 확인한다.

전체 테스트292/292 및 보강한 관련 테스트4/4 통과. 정식 생성 자동 검사 오류0·기존 경고61. `tools/review-pdf.sh courses/ai-native/sessions/s03.md 28-30`으로 영향 장28·29와 다음 장30만 렌더링해 확인했다. 잘림·겹침과 새 페이지 이월은 없으며, 용어표 뒤 설명의 기존29→30쪽 이월은 유지된다. 생성1회·렌더1회·시각 검토3장.

요청한 `s03(10).pptx`는 접근 가능한 현재 저장소에서 찾지 못했다(ignored 파일을 포함한 `references/inputs/`와 저장소 검색). 따라서 해당 파일과의 대조는 미실행이며, 사용자가 지정한 정확한 수치를 적용하고 직전 후보와 보존 검증을 수행했다. 다른 참조 파일을 그 파일로 간주하지 않았다.
