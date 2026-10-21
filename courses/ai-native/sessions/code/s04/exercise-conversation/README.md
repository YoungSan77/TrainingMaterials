# 실습 4 — 현재 채택된 실제 대화

실습 2·3과 같은 자리에 같은 이름으로 둔다.

- `templates.json`: 수강생용 진행 단계의 기본 문구
- `prompt-01.txt`~`prompt-05.txt`: 실제 입력. ②~④에는 앞 응답을 읽고 쓴 답과 수정 요청이 들어 있다
- `claude-response-01.md`~`claude-response-05.md`: 실제 응답(현재 채택본)
- `정기배송-최초신청-아키텍처.md`: 마지막 실제 응답과 동일한 최종 MD, 실습 5의 입력
- `claude-input-*`, `claude-events-*`, `claude-metadata-*`, `claude-stderr-*`: 실행 근거
- `input-s02.md`, `input-s03.md`: 첫 프롬프트에 붙인 실습 2·3의 최종 MD

## 두 도구로 이어 간 기록

①~③은 먼저 **Codex**(`codex exec`)로 실행했고 그 결과가 `codex-response-01.md`~`codex-response-03.md`에 남아 있다. 이어서 같은 프롬프트를 **Claude Code**(`claude -p`, `claude-opus-5-5`)로 다시 실행해 ①~⑤를 한 대화로 완성했다. Codex 기록은 출발점으로 남기고 교재에는 현재 채택본인 `claude-response-*`를 쓴다.

실행기는 저장소 공용이다. 어느 단계를 어느 도구로 돌리든 앞 단계의 실제 입력과 응답을 모아 다음 입력으로 넘기므로, 중간에 도구를 바꿔도 같은 대화가 이어진다. 어느 도구가 어느 단계를 실행했는지는 파일 이름이 밝힌다.

```bash
python3 tools/run-exercise-turn.py courses/ai-native/sessions/code/s04/exercise-conversation claude 04
```

①~③을 처음 실행한 `run-codex-turn.py`는 그때의 실행 방법으로 남겨 둔다.

## 두 도구의 답이 갈린 곳

Codex는 모듈 안을 `application`·`domain`·`infrastructure` 셋으로 나눴고, Claude는 **신청 업무·정기배송 규칙·쇼핑몰 연계·신청 저장** 넷으로 나누되 포트로 의존을 뒤집었다. 교재는 뒤의 것을 쓴다 — 실행 중 호출 방향과 코드 의존이 반대라는 점이 도식과 설명에 드러나고, 강의의 주문 사례(업무 패키지와 연동·영속의 분리)와 읽는 법이 같기 때문이다.

①~⑤는 대화 횟수가 아니라 단계다. 보완과 최종 MD 생성은 필요한 만큼 반복한다. 교재 원천은 `sessions/s04.md`이며 이 폴더의 파일은 그 근거다.
