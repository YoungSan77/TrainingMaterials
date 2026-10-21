"""실습 대화의 한 단계를 실제 CLI로 실행하고 입력·응답·근거를 파일로 남긴다.

    python3 tools/run-exercise-turn.py <대화 폴더> <codex|claude> <단계>

같은 대화를 도구를 바꿔 가며 이어 갈 수 있다. 앞 단계의 실제 입력과 응답을 모두 모아 다음
입력으로 넘기므로, 어느 도구가 어느 단계를 실행했는지는 파일 이름이 밝힌다
(`codex-response-03.md` 다음에 `claude-response-04.md`). 실행기는 교재 원고를 만들지 않는다.

폴더 규칙:
    prompt-NN.txt                실제 입력(단계 NN)
    <tool>-response-NN.md        실제 응답
    <tool>-input/events/stderr/metadata-NN  실행 근거
    finalization-rounds/NN/      ⑤를 다시 요청한 회차(앞 회차의 요청과 응답을 함께 넘긴다)
"""
from pathlib import Path
import subprocess, sys, json, datetime

TOOLS = ("codex", "claude")


def response_path(base, turn):
    for tool in TOOLS:
        p = base / f"{tool}-response-{turn}.md"
        if p.exists():
            return p
    raise SystemExit(f"{turn}단계의 응답 파일이 없다 — 앞 단계를 먼저 실행한다.")


def command(tool, out):
    if tool == "codex":
        return ["codex", "exec", "--ignore-user-config", "--ephemeral", "--sandbox", "read-only",
                "--skip-git-repo-check", "--config", "project_doc_max_bytes=0", "--json",
                "--output-last-message", str(out), "-"]
    return ["claude", "-p", "--model", "claude-opus-5-5", "--output-format", "json", "--allowed-tools", ""]


def compose(base, turn, prompt):
    if turn == "01":
        return prompt
    messages = []
    for previous in range(1, int(turn)):
        tag = f"{previous:02}"
        messages += ["[사용자]", (base / f"prompt-{tag}.txt").read_text(),
                     "[실제 응답]", response_path(base, tag).read_text()]
    rounds = base / "finalization-rounds"
    if turn == "05" and rounds.exists():
        for round_dir in sorted(rounds.glob("*")):
            if not round_dir.is_dir():
                continue
            answer = sorted(round_dir.glob("*-response-05.md"))
            messages += ["[사용자 — 이전 MD 생성 요청]", (round_dir / "prompt-05.txt").read_text(),
                         "[실제 응답 — 검토할 MD]", answer[0].read_text() if answer else ""]
    messages += ["[사용자 — 이번 피드백]", prompt]
    return "다음 실제 대화를 이어서 마지막 사용자 메시지에 답하라.\n\n" + "\n".join(messages)


def main():
    if len(sys.argv) != 4 or sys.argv[2] not in TOOLS:
        raise SystemExit(__doc__)
    base, tool, turn = Path(sys.argv[1]).resolve(), sys.argv[2], sys.argv[3]
    # ⑤만 파일 본문을 받는다. 다른 단계는 대화창에서 읽는 답과 질문이므로 그대로 저장한다.
    head = ("[실행 환경] 이 실행기는 응답을 그대로 파일로 저장한다. 도구 호출·파일 탐색·파일 쓰기를 하지 마라. "
            + ("요청된 완성된 Markdown 문서 본문 전체만 출력하고 생성 안내나 파일 링크는 붙이지 마라."
               if turn == "05" else
               "대화창에서 읽을 답을 그대로 출력하고, 도식은 Mermaid 원본으로 보여라."))
    prompt = head + "\n\n" + compose(base, turn, (base / f"prompt-{turn}.txt").read_text())

    out = base / f"{tool}-response-{turn}.md"
    args = command(tool, out)
    started = datetime.datetime.now().astimezone().isoformat()
    (base / f"{tool}-input-{turn}.txt").write_text(prompt)
    with (base / f"{tool}-events-{turn}.jsonl").open("w") as stdout, (base / f"{tool}-stderr-{turn}.txt").open("w") as stderr:
        r = subprocess.run(args, input=prompt, text=True, stdout=stdout, stderr=stderr, timeout=900)
    if tool == "claude" and not r.returncode:
        # claude -p --output-format json 은 결과를 JSON 한 덩어리로 낸다. 본문만 응답 파일로 남긴다.
        out.write_text(json.loads((base / f"{tool}-events-{turn}.jsonl").read_text())["result"])
    (base / f"{tool}-metadata-{turn}.json").write_text(json.dumps(
        {"tool": tool, "started": started, "finished": datetime.datetime.now().astimezone().isoformat(),
         "command": args, "returncode": r.returncode}, ensure_ascii=False, indent=2) + "\n")
    if r.returncode:
        raise SystemExit(f"{tool} CLI 실패({r.returncode}) — 오류 기록을 남겼다")
    print("완료: " + str(out))


main()
