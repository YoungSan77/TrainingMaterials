"""위임 실행기 어댑터의 회귀 검사.

    python3 tools/run-delegation-turn.test.py

CLI를 실제로 부르지 않는다 — 조립한 명령과 꺼낸 id만 본다. 고정하는 것은 두 가지다. 어댑터를
넣기 전의 codex 명령과 **한 글자도 다르지 않아야 한다**는 것, 그리고 도구를 적지 않은 기존 3개
인자 호출이 codex로 남아야 한다는 것이다.
"""
import importlib.util, json, sys, tempfile, unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "delegation", Path(__file__).with_name("run-delegation-turn.py"))
delegation = importlib.util.module_from_spec(spec)
spec.loader.exec_module(delegation)

# 어댑터를 넣기 전 실행기가 조립했던 명령. 기존 실행 기록의 metadata에 남은 모양이다.
BEFORE_FIRST = ["codex", "exec", "--ignore-user-config", "--skip-git-repo-check",
                "--config", "project_doc_max_bytes=0",
                "--config", 'sandbox_mode="workspace-write"',
                "--config", 'approval_policy="never"',
                "--json", "--output-last-message", "/w/codex-response-01.md", "-"]
BEFORE_RESUME = ["codex", "exec", "resume", "thread-9", "--ignore-user-config",
                 "--skip-git-repo-check", "--config", "project_doc_max_bytes=0",
                 "--config", 'sandbox_mode="workspace-write"',
                 "--config", 'approval_policy="never"',
                 "--json", "--output-last-message", "/w/codex-response-02.md", "-"]


class CommandTest(unittest.TestCase):
    def test_codex_command_is_byte_identical_to_before_the_adapter(self):
        self.assertEqual(delegation.command("codex", "/w/codex-response-01.md", None), BEFORE_FIRST)
        self.assertEqual(delegation.command("codex", "/w/codex-response-02.md", "thread-9"), BEFORE_RESUME)

    def test_codex_keeps_its_sandbox_and_approval_configuration(self):
        args = delegation.command("codex", "/w/out.md", None)
        self.assertIn('sandbox_mode="workspace-write"', args)
        self.assertIn('approval_policy="never"', args)
        self.assertIn("--ignore-user-config", args)

    def test_claude_command_reads_stdin_and_resumes_by_session(self):
        first = delegation.command("claude", "/w/claude-response-01.md", None)
        self.assertEqual(first[:4], ["claude", "-p", "--output-format", "json"])
        self.assertIn("--permission-mode", first)
        self.assertIn("acceptEdits", first)
        # 프롬프트는 표준 입력으로 넘기므로 "-"나 경로를 인자로 붙이지 않는다.
        self.assertNotIn("-", first[2:])
        self.assertNotIn("/w/claude-response-01.md", first)
        self.assertNotIn("--resume", first)
        resumed = delegation.command("claude", "/w/claude-response-02.md", "session-7")
        self.assertEqual(resumed[-2:], ["--resume", "session-7"])

    def test_claude_does_not_borrow_codex_only_options(self):
        args = delegation.command("claude", "/w/out.md", None)
        for codex_only in ("--ignore-user-config", "--skip-git-repo-check", "--config",
                           "--output-last-message", "--json"):
            self.assertNotIn(codex_only, args, codex_only)


class SandboxTest(unittest.TestCase):
    """격리 보장은 설정이 아니라 명령으로 선다. claude의 sandbox.enabled는 기본값이 꺼짐이고
    settings.local.json으로 끌 수 있으므로, 이 인자가 빠지면 조용히 비격리로 돈다."""

    def sandbox_of(self, args):
        self.assertIn("--settings", args)
        return json.loads(args[args.index("--settings") + 1])["sandbox"]

    def test_claude_passes_the_sandbox_on_the_command_line(self):
        for thread in (None, "session-7"):
            box = self.sandbox_of(delegation.command("claude", "/w/out.md", thread))
            self.assertIs(box["enabled"], True)

    def test_the_four_weakening_paths_are_closed(self):
        box = self.sandbox_of(delegation.command("claude", "/w/out.md", None))
        # 격리가 불가능하면 경고만 내고 비격리로 도는 기본값을 막는다.
        self.assertIs(box["failIfUnavailable"], True)
        # dangerouslyDisableSandbox 재시도를 막는다 — 허용 목록에 걸리면 프롬프트 없이 승인된다.
        self.assertIs(box["allowUnsandboxedCommands"], False)
        # 비격리로 빠지는 명령을 두지 않는다(저장소 설정에는 node가 들어 있다).
        self.assertEqual(box["excludedCommands"], [])
        # 비대화형에서 승인 게이트로 멈추지 않게 해 경계를 OS 하나로 모은다.
        self.assertIs(box["autoAllowBashIfSandboxed"], True)

    def test_filesystem_isolation_is_not_turned_off(self):
        box = self.sandbox_of(delegation.command("claude", "/w/out.md", None))
        # filesystem.disabled 는 보호 경로의 쓰기 금지까지 해제한다. 켜지 않는다.
        self.assertNotIn("disabled", box.get("filesystem", {}))

    def test_codex_keeps_its_own_sandbox_and_takes_no_settings_flag(self):
        args = delegation.command("codex", "/w/out.md", None)
        self.assertIn('sandbox_mode="workspace-write"', args)
        self.assertNotIn("--settings", args)


class CollectTest(unittest.TestCase):
    def setUp(self):
        self.base = Path(tempfile.mkdtemp())

    def test_codex_takes_the_thread_id_from_its_own_events(self):
        (self.base / "codex-events-01.jsonl").write_text(
            json.dumps({"type": "item_completed"}) + "\n"
            + json.dumps({"type": "thread.started", "thread_id": "abc-123"}) + "\n")
        out = self.base / "codex-response-01.md"
        out.write_text("이미 --output-last-message가 쓴 응답")
        self.assertEqual(delegation.collect("codex", self.base, "01", out), "abc-123")
        # codex 경로는 응답 파일을 덮어쓰지 않는다.
        self.assertEqual(out.read_text(), "이미 --output-last-message가 쓴 응답")

    def test_codex_without_a_thread_event_returns_none_instead_of_failing(self):
        (self.base / "codex-events-01.jsonl").write_text(json.dumps({"type": "item_completed"}) + "\n")
        out = self.base / "codex-response-01.md"
        out.write_text("응답")
        self.assertIsNone(delegation.collect("codex", self.base, "01", out))

    def test_claude_writes_the_response_body_and_takes_the_session_id(self):
        (self.base / "claude-events-01.jsonl").write_text(
            json.dumps({"result": "## 응답 본문", "session_id": "sess-42"}))
        out = self.base / "claude-response-01.md"
        self.assertEqual(delegation.collect("claude", self.base, "01", out), "sess-42")
        self.assertEqual(out.read_text(), "## 응답 본문")


class ArgumentTest(unittest.TestCase):
    """도구 인자의 기본값과 거절. main()은 파일을 읽으므로 인자 검사만 재현해 고정한다."""

    def tool_of(self, argv):
        if len(argv) not in (4, 5) or (len(argv) == 5 and argv[4] not in delegation.TOOLS):
            return None
        return argv[4] if len(argv) == 5 else "codex"

    def test_three_argument_call_stays_codex(self):
        self.assertEqual(self.tool_of(["x", "/w", "/c", "01"]), "codex")

    def test_explicit_tool_is_taken(self):
        self.assertEqual(self.tool_of(["x", "/w", "/c", "01", "claude"]), "claude")
        self.assertEqual(self.tool_of(["x", "/w", "/c", "01", "codex"]), "codex")

    def test_unknown_tool_and_wrong_count_are_refused(self):
        self.assertIsNone(self.tool_of(["x", "/w", "/c", "01", "gemini"]))
        self.assertIsNone(self.tool_of(["x", "/w", "/c"]))
        self.assertIsNone(self.tool_of(["x", "/w", "/c", "01", "claude", "extra"]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
