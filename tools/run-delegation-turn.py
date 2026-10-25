"""위임 실습의 한 단계를 실제 코딩 에이전트(Codex CLI)로 실행하고 입력·응답·근거를 파일로 남긴다.

    python3 tools/run-delegation-turn.py <작업 공간> <대화 폴더> <단계>

`run-exercise-turn.py`는 대화창에 글만 받는 실습(설계·문서)에 쓴다. 이 실행기는 **파일을 만들고
명령을 실행하는** 위임 실습에 쓴다. 작업 공간에서 코드를 쓰고 컴파일·테스트를 돌리며, 첫 단계의
thread를 이어 받아 같은 대화로 다음 단계를 실행한다.

작업 공간은 저장소 루트이고, sandbox는 workspace-write다. 밖으로 나가는 통신은 막히고, 작업
공간 밖 파일 쓰기도 거절된다. 그 거절이 실습의 증거이므로 실행기는 권한을 넓히지 않는다.

폴더 규칙:
    prompt-NN.txt                실제 입력(단계 NN)
    codex-response-NN.md         실제 응답(마지막 메시지)
    codex-thread.txt             이어 가는 thread id
    codex-input/events/stderr/metadata-NN  실행 근거
"""
from pathlib import Path
import subprocess, sys, json, datetime

CONFIG = [
    "--ignore-user-config", "--skip-git-repo-check",
    "--config", "project_doc_max_bytes=0",
    "--config", 'sandbox_mode="workspace-write"',
    "--config", 'approval_policy="never"',
]


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    workspace, base, turn = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve(), sys.argv[3]
    prompt = (base / f"prompt-{turn}.txt").read_text()
    out = base / f"codex-response-{turn}.md"
    thread_file = base / "codex-thread.txt"

    if turn == "01":
        args = ["codex", "exec", *CONFIG, "--json", "--output-last-message", str(out), "-"]
    else:
        thread = thread_file.read_text().strip()
        args = ["codex", "exec", "resume", thread, *CONFIG, "--json",
                "--output-last-message", str(out), "-"]

    started = datetime.datetime.now().astimezone().isoformat()
    (base / f"codex-input-{turn}.txt").write_text(prompt)
    with (base / f"codex-events-{turn}.jsonl").open("w") as stdout, (base / f"codex-stderr-{turn}.txt").open("w") as stderr:
        r = subprocess.run(args, input=prompt, text=True, stdout=stdout, stderr=stderr,
                           timeout=1800, cwd=workspace)
    (base / f"codex-metadata-{turn}.json").write_text(json.dumps(
        {"tool": "codex", "started": started, "finished": datetime.datetime.now().astimezone().isoformat(),
         "workspace": str(workspace), "command": args, "returncode": r.returncode},
        ensure_ascii=False, indent=2) + "\n")
    if r.returncode:
        raise SystemExit(f"codex CLI 실패({r.returncode}) — 오류 기록을 남겼다")

    if turn == "01":
        for line in (base / f"codex-events-{turn}.jsonl").read_text().splitlines():
            event = json.loads(line) if line.strip() else {}
            if event.get("type") == "thread.started":
                thread_file.write_text(event["thread_id"] + "\n")
                break
    print("완료: " + str(out))


main()
