"""Codex CLI의 세션 rollout을 단계별 실행 기록으로 나눈다.

    python3 tools/split-codex-rollout.py <rollout.jsonl> <대화 폴더>

`codex exec`가 남기는 rollout(~/.codex/sessions/…)은 한 세션의 모든 단계를 시간순으로 담는다.
이 실행기는 그것을 단계(task)마다 나누어 `run-delegation-turn.py`가 남기는 것과 같은 모양으로
되돌린다 — 입력·응답·이벤트·metadata. 이미 끝난 실행의 근거를 보존할 때 쓴다.

응답은 rollout의 `task_complete.last_agent_message`를 그대로 쓰고, 이벤트는 `item_completed`를
`codex exec --json`의 item 모양으로 옮긴다. 원본 rollout도 `codex-session.jsonl`로 함께 둔다.
"""
from pathlib import Path
import json, sys

KIND = {
    "AgentMessage": "agent_message",
    "Reasoning": "reasoning",
    "CommandExecution": "command_execution",
    "FileChange": "file_change",
}


def text_of(item):
    return "".join(part.get("text", "") for part in item.get("content", []))


def convert(item):
    kind = KIND[item["type"]]
    if kind == "agent_message":
        return {"type": "agent_message", "text": text_of(item)}
    if kind == "reasoning":
        return {"type": "reasoning", "text": "\n".join(item.get("summary_text") or [])}
    if kind == "command_execution":
        return {"type": "command_execution", "command": " ".join(item.get("command", [])),
                "aggregated_output": item.get("aggregated_output", ""),
                "exit_code": item.get("exit_code"), "status": item.get("status")}
    changes = item.get("changes", {})
    return {"type": "file_change", "status": "completed",
            "changes": [{"path": p, "kind": c.get("type")} for p, c in changes.items()]}


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    rollout, out = Path(sys.argv[1]), Path(sys.argv[2])
    lines = [json.loads(line) for line in rollout.read_text().splitlines() if line.strip()]
    thread = next(e["payload"]["session_id"] for e in lines if e["type"] == "session_meta")

    turns, current = [], None
    for event in lines:
        payload = event.get("payload", {})
        if event["type"] == "event_msg" and payload.get("type") == "task_started":
            current = {"start": event["timestamp"], "items": []}
            turns.append(current)
        elif current is None:
            continue
        elif event["type"] == "event_msg" and payload.get("type") == "item_completed":
            current["items"].append(payload["item"])
        elif event["type"] == "event_msg" and payload.get("type") == "task_complete":
            current["finish"] = event["timestamp"]
            current["last"] = payload.get("last_agent_message", "")

    (out / "codex-session.jsonl").write_text(rollout.read_text())
    (out / "codex-thread.txt").write_text(thread + "\n")
    for number, turn in enumerate(turns, 1):
        tag = f"{number:02}"
        events = [{"type": "thread.started", "thread_id": thread}, {"type": "turn.started"}]
        for item in turn["items"]:
            if item["type"] == "UserMessage":
                continue
            events.append({"type": "item.completed", "item": convert(item)})
        events.append({"type": "turn.completed"})
        (out / f"codex-events-{tag}.jsonl").write_text(
            "".join(json.dumps(e, ensure_ascii=False) + "\n" for e in events))
        (out / f"codex-response-{tag}.md").write_text(turn.get("last", "").rstrip() + "\n")
        (out / f"codex-metadata-{tag}.json").write_text(json.dumps(
            {"tool": "codex", "started": turn["start"], "finished": turn.get("finish"),
             "source": "codex rollout에서 단계별로 나눔", "thread_id": thread,
             "item_count": len(turn["items"])}, ensure_ascii=False, indent=2) + "\n")
        print(f"{tag}: {len(turn['items'])} items, {len(turn.get('last', ''))} chars")


main()
