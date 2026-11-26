# OOAD 과정 재설계 상태

- **상태** — 원점 재검토 중(2026-11-26 결정). Course Design부터 교육 내용을 다시 정하고, 실습은 시나리오부터 전부 재생성한다.
- **비교 자료** — `course-design.md`, `sessions/references.md`, `sessions/s01.md`~`s14.md`를 남긴다. **현재 승인 정본이 아니다.** 무엇을 개선할지 대조하는 데 쓰고, 새 승인 정본으로 자동 승계하지 않는다.
- **기존 제작 기준선** — `AGENTS.md`의 「Session Authoring Baseline」이 `sessions/s01.md`~`s05.md`를 Deck 품질의 기준 예시로 지정했다(`s01`은 개요 세션, `s02`~`s05`는 상세 세션). 그 지정은 유지되며 이 원고들을 renderer에 맞춰 고치지 않는다.
- **승인 기록** — 이번 정리에서 확인한 자료에는 이 과정의 단계별 Human 승인 기록이 **없었다.** `checks/`에 있던 것은 실습 재정렬 검토 한 건이고 승인 근거가 아니다. 과거에 승인이 있었는지는 확인하지 못했다 — 없다고 단정하지 않는다.
- **Curriculum 부재** — 이 과정에는 `curriculum.md`가 없다. 새 절차는 Course Design 다음에 Curriculum / Session Architecture를 요구하므로 재설계에서 새로 만든다.
- **제거한 것** — PPTX·QA(각 15), 실습 실행 증거(`sessions/code/**` 229), 과거 검토 기록(`checks/exercise-realignment.md`), 그리고 git 제외였던 시각 검토 출력(`out/`의 ooad 몫).
- **복구** — 제거한 Git 추적 파일은 Git commit `79cba69`에서 꺼낸다. `out/`의 시각 검토 출력은 git 제외 대상이라 그 커밋에 **없다** — 직접 복구는 되지 않고, PPTX를 꺼내 `tools/review-pdf.sh`로 다시 만든다.
- **재설계 절차** — Course Design → Curriculum / Session Architecture → Session DD → Deck Authoring → Production. 단계마다 Human 승인을 받는다(`guides/governance.md`).

기존 파일이 있다는 사실만으로 현재 설계의 승인이나 완료를 판단하지 않는다.
