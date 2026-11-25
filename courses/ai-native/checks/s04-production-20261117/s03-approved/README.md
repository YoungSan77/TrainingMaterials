# 이번 제작의 시연·실습 3 실제 실행 기록

2026-11-16 KST. 대상: `courses/ai-native/sessions/s03.md`. 이전 응답을 재사용하지 않고 이번 제작에서 시연 1회와 실습 3의 초안→보완→최종 3턴을 실행했다. 교육 내용의 최종 Human 승인을 뜻하지 않는다.

## 입력·응답 전문

| 실행 | 실제 요청 | 실행기에 전달된 전체 입력 | 실제 응답 전문 |
|---|---|---|---|
| 시연 | `demo/prompt-01.txt` | `demo/codex-input-01.txt` | `demo/codex-response-01.md` |
| 실습 초안 | `exercise/prompt-01.txt` | `exercise/codex-input-01.txt` | `exercise/codex-response-01.md` |
| 실습 보완 | `exercise/prompt-02.txt` | `exercise/codex-input-02.txt` | `exercise/codex-response-02.md` |
| 실습 최종 | `exercise/prompt-03.txt` | `exercise/codex-input-03.txt` | `exercise/codex-response-03.md` |

실습 1·2의 실제 투입물은 `exercise/주문한다-업무조건.md`, `exercise/활용-방식-판단.md`에 원본 바이트 그대로 복사했다. 첫 요청은 최신 원고의 첫 요청과 같고, 최종 요청도 최신 원고 문장 그대로다. 후속 답변은 실제 첫 응답을 읽고 재고 확인 시점의 임의 확정을 지적한 뒤 원고 강사 노트·Course Design에서 확인된 조건만 제공했다. 질문과 미정의 의미를 보존한 보완 응답을 확인한 후 최종 요청을 실행했다. `exercise/주문한다-요구사항-정의서.md`는 최종 응답의 바이트 단위 복사본이다.

## 실행 증거

각 턴의 `codex-events-NN.jsonl`, `codex-stderr-NN.txt`, `codex-metadata-NN.json`에 이벤트·오류·명령·시각·종료 코드가 있다. 성공 4턴 모두 종료 코드 0, 응답 외 도구 실행 이벤트 0개다.

- 시연: 18:20:33~18:21:27.
- 실습 초안: 18:20:37~18:21:33.
- 실습 보완: 18:25:37~18:27:09.
- 실습 최종: 18:27:39~18:28:30.

실행기는 `tools/run-exercise-turn.py`, 도구는 Codex CLI 0.149.1이다. 매 턴 독립 CLI에 해당 실행의 앞선 실제 대화를 재구성해 입력했다. `--ignore-user-config --ephemeral --sandbox read-only --skip-git-repo-check --config project_doc_max_bytes=0 --json`을 사용했다. 모델·temperature·seed는 별도 지정하지 않았으므로 특정 모델 버전까지 고정한 실험으로 설명하지 않는다. PPT 장수·글자 크기·배치 조건은 프롬프트에 넣지 않았다.

초기 샌드박스의 상태 DB 쓰기·in-process app-server 초기화 실패는 `demo-initial-failure/`, `exercise-initial-failure/`에 따로 보존했다. 응답이 없는 실패이며 성공 횟수에 포함하지 않는다. 권한 승인 후 동일 입력으로 실행했다.

## 원고·PPT 반영

시연과 최종 응답 **전체**를 첫 제목·첫 문단부터 반영했다. 발췌·생략·요약은 없다. Session Source의 제목 단계와 목록 들여쓰기만 변환했고, 문장·섹션 번호·순서·강조·표·Mermaid 원본은 보존했다. 실행 원문은 변환하지 않았다.

최종 `courses/ai-native/sessions/s03.pptx`는 38장이다. 시연 응답 17~24쪽, 판단표 25쪽, 실습 문제 29쪽, 실습 답 31~38쪽이다. 원래 26장 덱에서 교체한 응답 장 이외의 승인 22장은 내용·서식·배치를 보존했다. 전문을 담기 위해 두 응답이 각각 8장으로 늘었다.

시연 판단표는 새 응답과 5행이 불일치한다. 지침대로 업무 결정을 임의로 바꾸지 않고 `courses/ai-native/checks/s03-demo-judgment-feedback.md`에 대응 근거와 작성자용 수정안을 남겼다. 검토 상태와 최종 제작 증거는 `courses/ai-native/checks/s03-production-check-20261116-live.md`를 따른다.

다음 내용 작업은 판단표 수정안의 작성자 검토·반영이다. 이 기록의 실제 응답은 계속 원본으로 보존한다.
