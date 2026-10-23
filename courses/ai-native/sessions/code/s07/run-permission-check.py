"""Run actual macOS OS sandbox probes without invoking a model or changing user settings.

Run from the repository root:
    python3 courses/ai-native/sessions/code/s07/run-permission-check.py

Requires macOS sandbox-exec, Python 3, and JDK 17+.
Runtime support must be checked before class. Unsupported enforcement
is NOT VERIFIED, never a successful denial. Uses a disposable workspace in /tmp.
"""
import datetime
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

base = Path(__file__).resolve().parent
if sys.platform != "darwin":
    raise SystemExit("NOT VERIFIED: this demonstration requires macOS Seatbelt")
work = Path(tempfile.mkdtemp(prefix="ai-native-s07-", dir="/private/tmp" if sys.platform == "darwin" else "/tmp"))
for name in ("src", "tests", "build", "config", "secrets"):
    (work / name).mkdir()
shutil.copy(base / "probe.py", work / "probe.py")
shutil.copy(base.parent / "s05" / "AcceptanceExamples.java", work / "src" / "AcceptanceExamples.java")
(work / "config" / "payment.txt").write_text("local-test-double-only\n")
(work / "secrets" / "dummy-key.txt").write_text("NOT-A-REAL-SECRET\n")
before = hashlib.sha256((work / "config" / "payment.txt").read_bytes()).hexdigest()


profile = (base / "permissions.sb").read_text().replace("TASK_ROOT", str(work))
args = ["/usr/bin/sandbox-exec", "-p", profile, sys.executable, "probe.py"]
started = datetime.datetime.now().astimezone().isoformat()
result = subprocess.run(args, cwd=work, text=True, capture_output=True, timeout=90)
after = hashlib.sha256((work / "config" / "payment.txt").read_bytes()).hexdigest()
record = dict(started=started, command=args, workspace=str(work),
              returncode=result.returncode, stdout=result.stdout, stderr=result.stderr,
              protected_config_unchanged=before == after,
              python=sys.version.split()[0])
output = base / "demo-results"
output.mkdir(exist_ok=True)
(output / "permission-check.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
print(result.stdout)
print(result.stderr, file=sys.stderr)
print("protected config unchanged:", before == after)
print("record:", output / "permission-check.json")
raise SystemExit(result.returncode or (0 if before == after else 1))
