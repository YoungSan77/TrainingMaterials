# 저장소 정리와 복구 기록

기준일: 2026-10-20. 규칙의 원천은 `AGENTS.md`와 `guides/`다. **세션별 진행과 검사 상태는 [`courses/ai-native/checks/redesign-map.md`](courses/ai-native/checks/redesign-map.md)가 가진다** — 이 문서는 한 번 한 정리와 그 복구 방법만 적는다.

## 지금 어디까지 왔나

11개 과정 폴더 가운데 AI-native와 OOAD에 세션 원고가 있고 나머지 아홉은 과정 설계 단계다. 설계 파일의 존재를 교재 완성으로 보지 않는다.

- **AI-native** — S01~S05는 현재 과정 설계대로 다시 썼고 자동 검사 오류·경고가 0이다. S04~S12의 내용은 앞으로 전면 재구축하며, S06~S12에 남은 옛 세션명 참조 183건은 그때 함께 고친다. 진행은 `redesign-map.md`를 본다.
- **OOAD** — 기준 품질의 예시로 유지한다. 용어("유저 스토리")는 그 과정의 전면 보완에서 바꾼다.
- **renderer** — 회귀 테스트가 모두 통과한다. 자동 검사 통과는 형식의 통과이지 교육 내용과 시각 품질의 완료가 아니다.

## 2026-10-20 정리

420개 파일, 약 7.83MiB를 작업 폴더에서 치웠다. 삭제 전에 압축본의 모든 파일 해시를 확인했고, 활성 원고·PPT·실제 대화 134개 파일의 해시가 정리 전후 같음을 확인했다.

치운 것:

- 본편에 통합된 `s01~03-add` 원고·PPT·QA와 과거 검토 기록
- 채택되지 않은 실습 1의 실험 분기, 이전 실패·레이아웃 시도 백업
- 현재 실습과 맞지 않는 오래된 대화·문제/정답 검토 문서
- 통합 전 검토본을 만들던 일회성 `build-review.py`·`extract-review.py`
- AI-native `out/`의 과거 PDF·페이지 이미지와 운영체제·Python 자동 생성 파일

남긴 것:

- 모든 과정 설계·정식 세션 원고·본편 PPT·QA, 예제 코드와 제작 검토 기록
- 실습 1~3의 실제 입력·응답·최종 MD·실행 로그(`sessions/code/sNN/exercise-conversation/`)
- S03의 `finalization-rounds` 두 차례 — 현재 최종 응답에 이르는 실제 대화에 필요하다
- 미완료 개편의 `redesign-map.md`와 후반 세션이 참조하는 기존 코드·모델 패키지
- 의존 패키지·Python 가상 환경·재사용 렌더링 캐시, `references/`의 원전 자료

이어서 2026-10-20에 정리한 것: 실습 검토용 덱 3개(본편 덱에서 장을 뽑은 편의 자료라 저장소에 두지 않는다), `sessions/`에 있던 제작 검토 기록 5개(→ `checks/`), 실습 1의 대화 기록만 한 단계 깊던 `focused-prompts/` 폴더(→ 같은 폴더로 평탄화).

## 복구 백업

로컬 백업: `.codex/archives/repository-cleanup-2026-10-20-212614.tar.gz`(약 7.27MiB). Git에서 제외되므로 이 PC에만 있다. 압축본에는 삭제 목록·이유·SHA-256을 담은 `MANIFEST.json`, 삭제 전 파일, 당시 미커밋 변경의 `working-tree.patch`가 있다.

필요한 파일만 저장소 루트에서 골라 복원한다. 현재 파일 위에 백업 전체를 덮어쓰지 않는다.

```bash
tar -tzf .codex/archives/repository-cleanup-2026-10-20-212614.tar.gz
# 위 목록에서 필요한 단일 경로를 고른 뒤 복원
tar -xzf .codex/archives/repository-cleanup-2026-10-20-212614.tar.gz courses/ai-native/sessions/s01-add.md
```
