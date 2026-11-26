"""위임 실습의 한 단계를 실제 코딩 에이전트로 실행하고 입력·응답·근거를 파일로 남긴다.

    python3 tools/run-delegation-turn.py <작업 공간> <대화 폴더> <단계> [codex|claude]

이 실행기는 **파일을 만들고 명령을 실행하는** 위임 실습에 쓴다. 대화창에 글만 받는 실습(설계·문서)은
실행기가 필요 없다. 작업 공간에서 코드를 쓰고 컴파일·테스트를 돌리며, 첫 단계의 thread를 이어 받아
같은 대화로 다음 단계를 실행한다.

작업 공간은 저장소 루트이고, 실행은 작업 공간 안으로 한정한다. 밖으로 나가는 통신은 막히고, 작업
공간 밖 파일 쓰기도 거절된다. 그 거절이 실습의 증거이므로 실행기는 권한을 넓히지 않는다.

도구를 적지 않으면 `codex`다 — 기존 실행 기록에 남은 3개 인자 명령을 그대로 재현한다. 도구마다
다른 것은 **명령 조립과 응답·thread를 꺼내는 자리**뿐이고(`command`·`collect`), 폴더 규칙과 남기는
근거의 모양은 같다. 어댑터 방식이며 새 계층을 만들지 않는다.

격리는 두 도구 모두 **OS가 강제한다.** codex는 `sandbox_mode="workspace-write"`로, claude는
`--settings`로 넘기는 `sandbox`(macOS는 Seatbelt)로 작업 공간 밖 쓰기를 거절한다. 자식 프로세스는
프로세스 트리로 경계를 상속하므로 셸·인터프리터·별도 JVM이 모두 같게 막힌다 — 확인한 거절은 세
경로 모두 EPERM(`Operation not permitted`)이었고 승인 프롬프트는 나오지 않았다. 쓰기는 기본 거부
(작업 공간과 임시 디렉터리만 허용), 읽기는 기본 허용이라 작업 공간 밖 읽기는 양쪽 다 통과한다.
자격 증명 파일까지 읽히므로 보호가 필요하면 `denyRead`를 더한다.

보장을 **명령으로** 세우는 것이 요점이다. claude의 `sandbox.enabled`는 기본값이 꺼짐이고 설정
파일로 끌 수 있으므로, 설정에 맡기면 조용히 비격리로 돌 수 있다. 실행 기록의 `command`에 그
인자가 남으므로, 그 기록이 어느 보장이었는지의 근거다.

claude 경로는 작업 공간이 이 저장소일 때 같은 저장소의 훅을 하위 실행에서 다시 띄운다. 그 기록과
Stop 검사가 겹칠 수 있다. 실행기는 그것을 끄지 않는다 — 추적을 끄는 쪽이 더 나쁘다. 겹침이
문제가 되면 작업 공간을 저장소 밖으로 두거나 훅 등록을 사용자가 조정한다.

폴더 규칙(`<tool>`은 `codex` 또는 `claude`):
    prompt-NN.txt                실제 입력(단계 NN)
    <tool>-response-NN.md        실제 응답(마지막 메시지)
    <tool>-thread.txt            이어 가는 thread/session id
    <tool>-input/events/stderr/metadata-NN  실행 근거
"""
from pathlib import Path
import subprocess, sys, json, datetime

TOOLS = ("codex", "claude")

CONFIG = [
    "--ignore-user-config", "--skip-git-repo-check",
    "--config", "project_doc_max_bytes=0",
    "--config", 'sandbox_mode="workspace-write"',
    "--config", 'approval_policy="never"',
]

# claude는 샌드박스를 설정에서 읽고 **기본값이 꺼짐**이다. 그래서 설정에 맡기면 보장이 없다 —
# 저장소의 `.claude/settings.local.json`이 `enabled: false`로 덮고 있고, 작업 공간에 설정이 없으면
# 기본값이 적용된다. codex가 `sandbox_mode`를 명령으로 받는 것과 같은 보장을 세우려면 명령으로
# 넘긴다. CLI 인자가 settings.local.json보다 우선하므로 사용자의 설정 파일에 손대지 않는다.
#
# 네 값이 각각 막는 것: 조용한 비격리 실행(failIfUnavailable), dangerouslyDisableSandbox 재시도
# (allowUnsandboxedCommands — 허용 목록에 걸리면 프롬프트 없이 승인된다), 비격리로 빠지는 명령
# (excludedCommands). autoAllowBashIfSandboxed는 비대화형에서 승인 게이트 때문에 실습이 멈추지
# 않게 해 경계를 OS 하나로 모은다. 확인한 거절은 셸·python3·별도 JVM 모두 EPERM이었다.
SANDBOX = json.dumps({
    "sandbox": {
        "enabled": True,
        "failIfUnavailable": True,
        "allowUnsandboxedCommands": False,
        "autoAllowBashIfSandboxed": True,
        "excludedCommands": [],
    }
}, separators=(",", ":"))


def command(tool, out, thread):
    """단계의 실행 명령. thread가 None이면 첫 단계, 아니면 그 대화를 이어 간다."""
    if tool == "codex":
        resume = ["resume", thread] if thread else []
        return ["codex", "exec", *resume, *CONFIG, "--json",
                "--output-last-message", str(out), "-"]
    # claude는 프롬프트를 표준 입력으로 받고 결과를 JSON 한 덩어리로 낸다.
    # --setting-sources project는 codex의 --ignore-user-config에 대응한다(사용자 설정을 뺀다).
    # --settings SANDBOX가 codex의 sandbox_mode에 대응한다(위 SANDBOX 주석).
    resume = ["--resume", thread] if thread else []
    return ["claude", "-p", "--output-format", "json",
            "--permission-mode", "acceptEdits", "--setting-sources", "project",
            "--settings", SANDBOX, *resume]


def collect(tool, base, turn, out):
    """실행이 남긴 출력에서 응답 본문과 이어 갈 id를 꺼낸다. 없으면 id는 None이다."""
    events = (base / f"{tool}-events-{turn}.jsonl").read_text()
    if tool == "codex":
        # codex는 --output-last-message로 응답을 이미 썼다. id는 thread.started 사건에 있다.
        for line in events.splitlines():
            event = json.loads(line) if line.strip() else {}
            if event.get("type") == "thread.started":
                return event["thread_id"]
        return None
    result = json.loads(events)
    out.write_text(result["result"])
    return result.get("session_id")


def main():
    if len(sys.argv) not in (4, 5) or (len(sys.argv) == 5 and sys.argv[4] not in TOOLS):
        raise SystemExit(__doc__)
    workspace, base, turn = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve(), sys.argv[3]
    tool = sys.argv[4] if len(sys.argv) == 5 else "codex"
    prompt = (base / f"prompt-{turn}.txt").read_text()
    out = base / f"{tool}-response-{turn}.md"
    thread_file = base / f"{tool}-thread.txt"

    thread = None if turn == "01" else thread_file.read_text().strip()
    args = command(tool, out, thread)

    started = datetime.datetime.now().astimezone().isoformat()
    (base / f"{tool}-input-{turn}.txt").write_text(prompt)
    with (base / f"{tool}-events-{turn}.jsonl").open("w") as stdout, (base / f"{tool}-stderr-{turn}.txt").open("w") as stderr:
        r = subprocess.run(args, input=prompt, text=True, stdout=stdout, stderr=stderr,
                           timeout=1800, cwd=workspace)
    (base / f"{tool}-metadata-{turn}.json").write_text(json.dumps(
        {"tool": tool, "started": started, "finished": datetime.datetime.now().astimezone().isoformat(),
         "workspace": str(workspace), "command": args, "returncode": r.returncode},
        ensure_ascii=False, indent=2) + "\n")
    if r.returncode:
        raise SystemExit(f"{tool} CLI 실패({r.returncode}) — 오류 기록을 남겼다")

    found = collect(tool, base, turn, out)
    if turn == "01" and found:
        thread_file.write_text(found + "\n")
    print("완료: " + str(out))


if __name__ == "__main__":
    main()
