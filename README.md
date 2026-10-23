# TrainingMaterials

SW 공학 교육과정의 설계·원고·PowerPoint를 관리한다.

**Course Design → Session Authoring → Production**

| 구분 | 원천과 산출물 |
|---|---|
| 과정 설계 | `courses/<course>/course-design.md` |
| 세션 원고 | `courses/<course>/sessions/sNN.md` |
| 제작 결과 | 원고 옆의 `sNN.pptx`, `sNN.qa.json` |
| 실습 근거 | `sessions/code/sNN/exercise-conversation/`의 실제 대화와 최종 MD |
| 제작 기록 | `courses/<course>/checks/sNN-production-check.md` |

규칙은 [AGENTS.md](AGENTS.md)와 [guides/](guides/)가 정한다. 작성 기준 예시는 OOAD의 `s01.md`~`s05.md`다. 과거 산출물과 검토 기록은 규칙의 원천이 아니다.

저장소 루트에서 실행한다.

```bash
node engine/production/src/cli.js courses/ai-native/sessions/s01.md
node engine/production/src/cli.js --check courses/ai-native/sessions/s01.md
node --test engine/production/src/test/*.test.js
```

실습은 대화로 검토·보완하고 최종 MD를 다음 실습에 첨부한다. 수강생에게 교재 renderer는 필요하지 않다. 교재 슬라이드는 최종 MD와 별도로 제작한다.

세션별 진행과 검사 상태는 [redesign-map.md](courses/ai-native/checks/redesign-map.md), 저장소 정리와 복구 방법은 [REPOSITORY-STATUS.md](REPOSITORY-STATUS.md)를 본다. AI-native 전체를 완료 상태로 간주하지 않는다.
