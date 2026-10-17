# 세션 11 문장·문맥 보완 검토

- 검토 시각: 2026-10-17T22:54:15.936954+09:00
- 입력: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s11.md
  - 수정 시각: 2026-10-17T22:52:39.670332+09:00
  - SHA-256: `15423edd888ada63fa18d92a5b9a2e02192f3c82d71e88e68e8a6b44aeb3724a`
- 출력: /Users/YoungSan/dev/TrainingMaterials/courses/ai-native/sessions/s11.pptx
  - 수정 시각: 2026-10-17T22:52:45.894177+09:00
  - SHA-256: `b08114c4a246e2b3537a14fb7527eb03814fa3862894dc868df681b23ce8a0a9`
- 생성 도구: `engine/production/src/cli.js`, Node.js v25.1.0, 현재 작업 트리의 renderer
- 최종 슬라이드 수: 20장

## 내용 검토

- PASS: 제목과 첫 문장을 이어 읽고 본문·표·실습·요약의 연결을 검토했다.
- PASS: 수정 전 원고의 영문 인용·출처 14개와 topic 제목·순서를 보존했다. 원고가 아직 Git에 등록되지 않아 작업 시작 시 저장한 `/tmp/tm-s11-before-prose.md`와 비교했다. 원전 재검증은 이번 작업에 포함하지 않았다.
- 이미 만든 코드의 테스트 반복과, 같은 시작 상태에서 에이전트에게 과제를 다시 맡기는 평가를 구분했다.
- 능력·회귀 평가의 목적과 통과율 해석을 구분하고, 과제·기대값·평가 버전의 관리 방법을 설명했다.
- 토큰 수와 실제 비용, 모델 성능 향상과 하네스 단순화의 검증 조건, 공개 형식 재사용과 교체 후 동작 검증을 구분했다.
- 실습 답에서 앞 실습에서 고친 배송중 회차의 변경을 회귀 과제로 정렬했다. 전체 과제 수는 일곱으로 유지하고 회귀 여섯·능력 하나로 표시했다.

## 자동 검사

- PASS: 오류 0개, 경고 0개. 상세 결과는 `s11.qa.json`.
- PASS: PPT의 인용 문단 14개를 OOXML에서 확인했다. 출처 레이블을 제외한 한글 run이 10pt로 잘못 분리된 사례는 0개다.
- 원고만 보완했으므로 renderer 회귀 테스트와 다른 세션 재렌더링은 실행하지 않았다.

## 시각 검토

- 방법: `tools/review-pdf.sh courses/ai-native/sessions/s11.md 2-20`로 PowerPoint에서 PDF를 내보내고 50 DPI PNG 19장을 각각 확인했다.
- 증거: `/var/folders/zx/z2gsjq092vs02_pzxm7_ccdm0000gn/T/tm-review/s11/p-02.png` ~ `p-20.png` (임시 파일).
- PASS: 슬라이드 2~20의 본문·인용·표·실습·답에서 육안상 겹침·잘림이 보이지 않았다. 목표·요약·실습은 각각 한 장이다.
- 1장 목차는 변경하지 않아 시각 검토에서 제외했다.
- NOT VERIFIED: 모든 객체의 최종 글꼴 크기 측정은 실행하지 않았다. 인용문의 한글 10pt 오분리 검사와 육안 확인을 전체 Production 검증 완료로 간주하지 않는다.

## 실행 횟수

- 렌더링 4회(중복 설명 정리와 경고 해소 포함).
- PowerPoint PDF 내보내기 1회, 시각 검토 19장.
