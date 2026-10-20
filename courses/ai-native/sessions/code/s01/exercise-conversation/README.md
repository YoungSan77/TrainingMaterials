# 실습 1 — 현재 채택된 실제 대화

현재 원천은 `focused-prompts/` 하나다.

- `templates.json`: 수강생용 진행 단계의 기본 문구
- `prompt-01.txt`~`prompt-05.txt`: 실제 입력
- `codex-response-01.md`~`codex-response-05.md`: 실제 응답
- `conversation.md`: 실제 입력과 응답 전문
- `정기배송-최초신청-업무조건.md`: 마지막 실제 응답과 동일한 최종 MD, 실습 2의 입력
- `codex-input-*`, `codex-events-*`, `codex-metadata-*`, `codex-stderr-*`: 실행 근거

①~⑤는 대화 횟수가 아니라 단계다. 보완과 최종 MD 생성은 필요한 만큼 반복한다. 이 예시는 앞선 합의 내용을 이어 새 ⑤를 실행한 사례다. `run-codex-turn.py`는 CLI 응답을 파일로 저장하며 교재 원고를 생성하지 않는다.

교재 원천은 `sessions/s01.md`다. 별도의 `s01-add` 원고는 두지 않는다. 본편 반영이 끝난 검토 분기와 폐기 시도는 로컬 정리 백업으로 옮겼다. 위치와 복구 방법은 저장소의 `REPOSITORY-STATUS.md`에 기록했다.
