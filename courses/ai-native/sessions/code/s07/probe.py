"""Permission probes, not an application or a replacement sandbox."""
import json
import socket
import subprocess
from pathlib import Path

results = []


def check(name, operation, should_allow):
    try:
        operation()
        allowed, detail = True, "completed"
    except PermissionError as error:
        allowed, detail = False, f"{type(error).__name__}: errno={error.errno}"
    except Exception as error:
        results.append(dict(name=name, result="NOT VERIFIED", detail=str(error)))
        return
    results.append(dict(name=name, result="PASS" if allowed == should_allow else "FAIL",
                        observed="allowed" if allowed else "denied", detail=detail))


check("source write", lambda: Path("src/probe.txt").write_text("permission probe\n"), True)
check("test write", lambda: Path("tests/probe.txt").write_text("permission probe\n"), True)


def build_and_test():
    subprocess.run(["javac", "-d", "build", "src/AcceptanceExamples.java"], check=True)
    subprocess.run(["java", "-cp", "build", "AcceptanceExamples"], check=True)


check("build and existing order tests", build_and_test, True)
check("protected config write", lambda: Path("config/payment.txt").write_text("changed\n"), False)
check("dummy secret read", lambda: Path("secrets/dummy-key.txt").read_bytes(), False)


def connect():
    # Numeric address: a DNS failure must not be mistaken for a sandbox denial.
    # connect() only: no request body or application data is transmitted.
    with socket.create_connection(("1.1.1.1", 443), timeout=3):
        pass


check("direct network connect", connect, False)
print(json.dumps(results, ensure_ascii=False, indent=2))
raise SystemExit(0 if all(row["result"] == "PASS" for row in results) else 1)
