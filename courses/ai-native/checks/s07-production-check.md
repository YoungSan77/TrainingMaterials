# 세션 07 제작 검토 기록

- 기록 시각: 2026-10-21T16:31:05.055570+09:00
- 최종 결과: 21장. 목차·실습 1장·별첨 답안 2장 포함.

## 입력과 출력

- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s07.md`
  - 수정 시각: 2026-10-21T16:27:35.748734+09:00
  - SHA-256: `94c3f97ecab45759cbddc76df301afe5d492f9e10f832b9a1a2fa866f6ea2c54`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s07.pptx`
  - 수정 시각: 2026-10-21T16:27:38.474225+09:00
  - SHA-256: `a7a07efb2e76805909e9b93b8b4fb3ef3e0cb14f694a6f762f57ee4d3a6e8dcc`
- `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s07.qa.json`
  - 수정 시각: 2026-10-21T16:27:38.550990+09:00
  - SHA-256: `7e1fb0928538ae55f844bbd9a3348f469a9f5c64eefffa3b76085ce9ea57c95f`

## 내용과 실습 투입물 재검토

- 세션 목표와 승인된 구성에 맞춰 도구·권한·상태·종료 조건 → 연결과 접근 통제 → 최소 권한·되돌림 → 위험과 강제 위치 → 실습 순으로 작성했다.
- 실습 6은 새 파일이나 구현 코드를 만들지 않는다. 별도 첨부 파일로 요구하던 해석을 버리고 실습 5의 단위 4·수용 예 6과 실습 4의 신청 저장·첫 결제 계약을 직접 읽도록 했다. 상태·규칙이 부족하면 실습 3·2를 필요한 범위만 추가로 읽는다.
- 업무 산출물에는 실행 경로·명령·권한 설정이 없으므로 강사 제공 환경을 명시했다. 앞 실습에 완성된 정기배송 코드가 있다고 가정하지 않는다.
- 실습의 출력은 다음 실행에 필요한 간결한 권한 결정·강제 수단·실제 관찰·미확인 범위다. 새 문서 체계·고정 파일명·보안 점수표를 만들지 않았다.
- 별첨은 저자 작성 예다. 실제 LLM 대화나 정기배송 구현의 수용 테스트를 실행한 것처럼 표시하지 않는다.

## 검증

| 항목 | 판정 | 근거 |
|---|---|---|
| 세션 자동 검사 | PASS | s07.qa.json: 21장·39블록·오류 0·경고 0 |
| 논지·원천 대조 | PASS | read-leads.js로 제목·첫 문장 검토. 반복 전달 응답을 실습 5 단위 4·예 6, 실습 4 연계 계약, 실습 6 근거 선별과 대조 |
| 인용 기록 | PASS | 영문 인용 4개 모두 verify-quote.js 확인. NIST 정의는 원문 확인 뒤 한국어 요약으로 표시 |
| 인용 typography | PASS | 최종 OOXML의 인용 5그룹 모두 한글 18pt·영문 및 출처 10pt 확인. NIST는 한글·출처만 있음 |
| 파일·노트 구조 | PASS | ZIP CRC 오류 없음·빈 a:txBody 없음·내용 20장에 발표자 노트 20개. 목차는 별도 자동 생성 |
| 시각 검토 | PASS | PowerPoint PDF의 1~21장. 표·도식·실습·별첨의 겹침·잘림·바닥글 침범 없음. 20장은 원본 이미지로 추가 확인 |
| 실제 접근 통제 | PASS | macOS Seatbelt 안에서 소스 쓰기·테스트 쓰기·빌드/기존 주문 테스트 허용. 보호 설정 쓰기·가짜 키 읽기·직접 통신 모두 PermissionError errno=1. 보호 파일 내용 유지 |
| 기존 업무 예 실행 | PASS | code/s05/AcceptanceExamples.java 사본을 javac·java로 실행: 승인·가격 변경·거절·재결제 4개 통과 |
| 정기배송 구현·영속 보장 | NOT VERIFIED | 해당 코드를 앞 실습에서 만들지 않았음. 제공 환경 검사를 실제 결제·저장 멱등성·동시성·원자성의 증거로 쓰지 않음 |
| 다른 플랫폼·도구 경로 | NOT VERIFIED | macOS의 선택적 파일·직접 통신 제한만 실행. 전체 호스트 읽기·MCP·내장 웹 검색·원격 도구·Git 제어는 입증하지 않음 |
| 전체 참조 | FAIL | s01~s07 오류·경고 0. 개편 전 s08~s12의 참조 문제 총 147건. 세션별 재작성 때 고치는 기존 개편 절차로 이월 |
| renderer 회귀 | NOT VERIFIED | renderer·템플릿을 바꾸지 않아 전체 테스트를 반복하지 않음 |
| 도식 글자 정밀 계측 | NOT VERIFIED | 자동 최소 크기 검사와 시각 확인을 수행. 모든 라벨의 최종 pt 정밀 계측은 별도 수행하지 않음 |

각 PASS는 위 범위에 한정한다. QA의 visual_status는 자동 생성값 NOT_VERIFIED를 유지하며, 실제 시각 검토 결과는 이 기록으로 구분한다. 전체 Production 정밀 검증을 완료했다고 표시하지 않는다.

## 실행 근거와 범위

- 실제 검사 코드: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s07/run-permission-check.py`, `probe.py`, `permissions.sb`.
- 실제 실행 기록: `/Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/code/s07/demo-results/permission-check.json`.
- 초기 도구 설정 검증에서 파일 접근 거절을 입증하지 못했다. 최종 시연은 사용자 설정에 의존하지 않는 macOS OS 샌드박스 정책으로 실행했다. 실패한 접근 통제를 성공으로 인용하지 않았다.
- 제공 정책은 지정한 파일 쓰기·비밀 읽기·직접 통신의 제약 예다. 최소 권한의 완성된 운영 정책으로 제시하지 않는다.
- 시각 근거: `/private/tmp/ai-native-s07-review/p-01.png`~`p-21.png`. 4장씩 합친 이미지로 전체 확인 후 20장 원본 추가 확인.
- 전체 참조 로그: `/private/tmp/ai-native-s07-cross-check.log`.
- 본편 렌더링 1회. 별도로 세션 단독 --check 1회, 전체 참조 --check 1회. 첫 sandbox 내부 검사 시도는 브라우저 실행 제약으로 중단되어 출력 생성 전 재실행했다.
- 시각 검토 21장(고유 장 수). renderer·템플릿·기존 세션의 원고나 덱은 이번 작업에서 수정하지 않았다.
