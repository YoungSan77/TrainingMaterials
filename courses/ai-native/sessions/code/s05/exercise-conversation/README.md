# 실습 5 — 현재 채택된 실제 대화

실습 2·3·4와 같은 자리에 같은 이름으로 둔다.

- `templates.json`: 수강생용 진행 단계의 기본 문구
- `prompt-01.txt`~`prompt-05.txt`: 실제 입력. ②~④에는 앞 응답을 읽고 쓴 답과 수정 요청이 들어 있다
- `codex-response-01.md`~`codex-response-03.md`, `claude-response-04.md`, `claude-response-05.md`: 실제 응답(현재 채택본)
- `정기배송-최초신청-작업명세.md`: 마지막 실제 응답과 동일한 최종 MD, 실습 6의 입력
- `codex-input-*`, `codex-events-*`, `codex-metadata-*`, `codex-stderr-*`와 같은 이름의 `claude-*`: 실행 근거
- `input-s02.md`, `input-s03.md`, `input-s04.md`: 첫 프롬프트에 붙인 실습 2·3·4의 최종 MD
- `finalization-rounds/01/`: 다시 요청한 ⑤의 첫 회차(요청과 응답을 함께 보존한다)

## 두 도구로 이어 간 기록

①~③은 **Codex**(`codex exec`)로 실행했다. ④를 같은 도구로 실행하려다 제공자의 429 응답으로 두 번 실패했고(`codex-metadata-04.json`의 `returncode: 1`, `codex-events-04.jsonl`의 오류), ④~⑤는 **Claude Code**(`claude -p`, `claude-opus-5-5`)로 이어 실행했다. 실행기가 앞 단계의 실제 입력과 응답을 모아 다음 입력으로 넘기므로 도구를 바꿔도 같은 대화가 이어진다. 어느 도구가 어느 단계를 실행했는지는 파일 이름이 밝힌다.

```bash
python3 tools/run-exercise-turn.py courses/ai-native/sessions/code/s05/exercise-conversation claude 05
```

## ⑤를 두 번 요청한 이유

첫 회차의 MD는 내용이 합의와 같았지만 문체가 "합니다"로 앞 산출물과 달랐고, 대표 값이 여덟 열 표, 작업 단위가 세 문장씩 든 표였다. 내용과 결정을 그대로 두고 형식만 고쳐 다시 요청했다(`prompt-05.txt`). 첫 회차는 `finalization-rounds/01/`에 남겼다.

## ④에서 드러난 것

④의 일관성 검토가 앞 단계의 수용 예에서 세 곳을 찾았다 — 예 4의 "추가 결제 요청 0회"는 두 번째 시도가 없어 관찰할 수 없고(`신청미완료`에서 나가는 전이가 없어 재결제 경로 자체가 없다), 예 5는 결제 요청과 결과 확인을 한 횟수로 세면 "새 청구 없음"을 판정할 수 없으며, 예 6은 Given에 넣은 누적값을 대역에 미리 넣으면 관찰값이 아니게 된다. 결과 확인 불가를 `결과확인필요`에서 다시 반영하면 상태 머신에 없는 자기 전이가 생긴다는 지적도 함께 나왔다. 셋 다 ⑤에 반영했다.

①~⑤는 대화 횟수가 아니라 단계다. 보완과 최종 MD 생성은 필요한 만큼 반복한다. 교재 원천은 `sessions/s05.md`이며 이 폴더의 파일은 그 근거다.
