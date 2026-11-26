# AI-native 과정 재설계 상태

- **상태** — 원점 재검토 중(2026-11-26 결정). Course Design부터 교육 내용을 다시 정하고, 실습은 시나리오부터 전부 재생성한다.
- **비교 자료** — `course-design.md`, `curriculum.md`, `production-standard.md`, `sessions/*.md`를 남긴다. **현재 승인 정본이 아니다.** 무엇을 개선할지 대조하는 데 쓰고, 새 승인 정본으로 자동 승계하지 않는다.
- **과거 승인** — Course Design과 Curriculum은 2026-11-25에 Human 승인을 받았다. 승인 범위·결정 7건과 SHA-256은 Git `79cba69`의 `checks/ai-native-transition.md`에 있다. 이번 재검토에서 효력을 다시 정한다.
- **기존 원고의 알려진 결함** — 자동 검사를 통과하지 않는다. 실습 좌우 2단이 한 장에 들어가지 않는 세션 8개(S01·S06~S12, 최소 초과 3.0~167.4pt), 실제 응답 발췌의 출처 문제 2건(S02 모호·S03 제목 불일치), 경고 41건(S04 25·S05 16). 비교용이며 제작 대상이 아니다.
- **실제 LLM 응답 검증** — `recorded-responses.json`·`recorded-checks.json`을 제거했다. 원고에 `**실제 LLM 응답**` 범위가 표시돼 있으면 재등록 전까지 `execution provenance missing or ambiguous`로 **중단된다.** 검사의 결함이 아니라 등록부 부재다. 새 실습의 실행 원본과 SHA-256으로 다시 등록한다.
- **복구** — 제거한 Git 추적 파일(실행 증거·PPTX·QA·검토 기록·등록부)은 `79cba69`에서 꺼낸다. **`out/`의 시각 검토 출력은 git 제외 대상이라 그 커밋에 없다** — 직접 복구는 되지 않고, 필요하면 PPTX를 꺼내 `tools/review-pdf.sh`로 다시 만든다.
- **재설계 절차** — Course Design → Curriculum / Session Architecture → Session DD → Deck Authoring → Production. 단계마다 Human 승인을 받는다(`guides/governance.md`).

기존 파일이 있다는 사실만으로 현재 설계의 승인이나 완료를 판단하지 않는다.
