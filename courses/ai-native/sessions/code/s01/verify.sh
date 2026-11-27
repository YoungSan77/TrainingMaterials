#!/usr/bin/env bash
#
# AI-native SW Engineering — S01 환경 설정 4단계 (Git Bash)
#
# 실행 — 배포 폴더에서 마우스 오른쪽 "Git Bash Here":
#     ./verify.sh            설치와 로컬 품질 게이트를 확인한다
#     ./verify.sh --prove    품질 게이트가 결함을 실제로 잡는지 복사본에서 확인한다
#
# 판정은 세 가지다.
#   PASS   이번 실행에서 실제로 확인했다.
#   FAIL   이번 실행에서 확인했고 통과하지 못했다.
#   미검증  이번 실행이 판정하지 못한 항목이다. PASS로 바꾸지 않는다.
#
# 판정의 근거는 **이번 실행의 종료 상태와 이번 실행이 만든 증거**뿐이다. 그래서 검사 전에
# build/를 지운다 — 지난 실행이 남긴 클래스 파일과 보고서가 현재 결과로 읽히면 안 된다.
#
# 설치 여부와 코드 품질 검사 결과를 섞지 않는다. 앞은 도구가 실행되는지, 뒤는 프로젝트가
# 품질 게이트를 통과하는지다.
#
# 이 과정은 CI 파이프라인을 만들지 않는다. 모두 PASS여도 「CI 통과」가 아니라 **실행한 검사가
# 통과했다는 증거**, 곧 「로컬 품질 게이트 PASS」다.

set -u
set -o pipefail

# 경로를 글로 적지 않는다 — 이 스크립트가 있는 폴더를 기준으로 찾는다. setup.sh가 만든 env.sh에
# 이 PC에서 해석한 경로(한글·공백이 있으면 짧은 이름)가 들어 있으므로 그것을 먼저 읽는다.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$ROOT/env.sh" ] && . "$ROOT/env.sh"

PROJECT="${TM_PROJECT:-$ROOT/project}"
LOG_DIR="$(dirname "$PROJECT")/tools"
LOG="$LOG_DIR/verify-check.log"

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

pass() { printf '  PASS   %-22s %s\n' "$1" "${2:-}"; PASS_COUNT=$((PASS_COUNT + 1)); }
fail() { printf '  FAIL   %-22s %s\n' "$1" "${2:-}"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
skip() { printf '  미검증 %-22s %s\n' "$1" "${2:-}"; SKIP_COUNT=$((SKIP_COUNT + 1)); }
tip()  { printf '         %s\n' "$1"; }

# Checkstyle 보고서에서 특정 파일에 대한 위반이 있는지 본다.
style_errors_for() {
  local report="$1" name="$2"
  [ -f "$report" ] || return 1
  LC_ALL=C grep -c "<error[^>]*" "$report" > /dev/null 2>&1 || return 1
  LC_ALL=C tr '\n' ' ' < "$report" |
    LC_ALL=C grep -qE "name=\"[^\"]*${name}\"[^<]*(<[^/][^>]*>)*[[:space:]]*<error"
}

# JUnit 결과 XML에서 실패·오류 건수를 더한다.
test_failures_in() {
  local pattern="$1"
  ls $pattern > /dev/null 2>&1 || return 1
  LC_ALL=C grep -ho 'failures="[0-9]*"\|errors="[0-9]*"' $pattern |
    LC_ALL=C grep -oE '[0-9]+' | awk '{ sum += $1 } END { print sum + 0 }'
}

# ── --prove: 품질 게이트가 결함을 잡는지 복사본에서 확인한다 ───────────────────
if [ "${1:-}" = '--prove' ]; then
  printf '=== 품질 게이트 검출 확인 (프로젝트 복사본에서 실행한다) ===\n'
  if [ ! -x "$PROJECT/gradlew" ]; then
    printf '  FAIL   Wrapper가 없다. setup.sh를 먼저 끝낸다.\n'
    exit 1
  fi
  for sample in BadStyle.java.txt FailingTest.java.txt; do
    if [ ! -f "$ROOT/samples/$sample" ]; then
      printf '  FAIL   예시 파일이 없다 — samples/%s\n' "$sample"
      exit 1
    fi
  done

  work="$(mktemp -d)"
  cp -R "$PROJECT/." "$work/"
  rm -rf "$work/build"
  prove_failed=0

  printf '\n[0] 손대지 않은 복사본이 통과하는지 먼저 본다 (통과해야 맞다)\n'
  if (cd "$work" && ./gradlew --no-daemon --quiet check > /dev/null 2>&1); then
    printf '  PASS   기준선이 통과한다. 아래 두 확인의 결과를 믿을 수 있다.\n'
  else
    printf '  FAIL   기준선이 이미 실패한다. 아래 결과는 결함 검출의 증거가 되지 못한다.\n'
    rm -rf "$work"
    exit 1
  fi

  printf '\n[1] 규칙을 어긴 코드를 넣는다 — Checkstyle이 그 파일을 지목해야 맞다\n'
  cp "$ROOT/samples/BadStyle.java.txt" "$work/src/main/java/order/BadStyle.java"
  rm -rf "$work/build"
  (cd "$work" && ./gradlew --no-daemon --quiet checkstyleMain > /dev/null 2>&1)
  style_status=$?
  if [ "$style_status" -eq 0 ]; then
    printf '  FAIL   checkstyleMain이 통과했다. 규칙이 이 위반을 보지 못한다.\n'
    prove_failed=1
  elif style_errors_for "$work/build/reports/checkstyle/main.xml" 'BadStyle.java'; then
    printf '  PASS   checkstyleMain이 실패했고 보고서가 BadStyle.java의 위반을 지목했다.\n'
  else
    printf '  FAIL   checkstyleMain이 실패했지만 BadStyle.java의 위반이 보고서에 없다.\n'
    tip '다른 이유로 실패한 것이다. 이 실패를 검출의 증거로 쓰지 않는다.'
    prove_failed=1
  fi
  rm -f "$work/src/main/java/order/BadStyle.java"

  printf '\n[2] 틀린 기대값의 테스트를 넣는다 — JUnit이 그 테스트를 실패로 적어야 맞다\n'
  cp "$ROOT/samples/FailingTest.java.txt" "$work/src/test/java/order/FailingTest.java"
  rm -rf "$work/build"
  (cd "$work" && ./gradlew --no-daemon --quiet test > /dev/null 2>&1)
  test_status=$?
  failing="$(test_failures_in "$work/build/test-results/test/TEST-order.FailingTest.xml")"
  if [ "$test_status" -eq 0 ]; then
    printf '  FAIL   test가 통과했다. 틀린 기대값을 잡지 못한다.\n'
    prove_failed=1
  elif [ -n "$failing" ] && [ "$failing" -gt 0 ]; then
    printf '  PASS   test가 실패했고 order.FailingTest의 실패가 결과에 기록됐다.\n'
  else
    printf '  FAIL   test가 실패했지만 order.FailingTest의 실패 기록이 없다.\n'
    tip '컴파일 오류 등 다른 이유로 멈춘 것이다. 이 실패를 검출의 증거로 쓰지 않는다.'
    prove_failed=1
  fi

  rm -rf "$work"
  printf '\n'
  if [ "$prove_failed" -eq 0 ]; then
    printf '두 항목이 모두 PASS다 — 로컬 품질 게이트가 실제로 결함을 막는다.\n'
    exit 0
  fi
  printf '검출 확인에 실패했다. 규칙 파일과 build.gradle의 게이트 연결을 점검한다.\n'
  exit 1
fi

# ── 설치 확인 ─────────────────────────────────────────────────────────────────
printf '=== S01 환경 검증 ===\n\n[설치]\n'

if command -v java >/dev/null 2>&1; then
  java_line="$(java -version 2>&1 | head -n 1)"
  java_feature="$(printf '%s' "$java_line" | LC_ALL=C sed -nE 's/.*"([0-9]+).*/\1/p')"
  if [ "$java_feature" = '21' ]; then
    pass 'Java 21' "$java_line"
  else
    fail 'Java 21' "$java_line"
    tip 'setup.sh가 만든 env.sh를 읽지 못했다. 배포 폴더에서 ./verify.sh 로 실행한다.'
  fi
else
  fail 'Java 21' 'java를 찾지 못했다'
fi

if command -v git >/dev/null 2>&1; then
  pass 'Git' "$(git --version)"
else
  fail 'Git' 'git을 찾지 못했다'
fi

if command -v claude >/dev/null 2>&1; then
  pass 'Claude Code CLI' "$(claude --version 2>&1 | head -n 1)"
  skip '로그인 상태' '사람이 확인한다 — claude를 실행해 대화가 시작되면 된 것이다'
else
  fail 'Claude Code CLI' 'claude를 찾지 못했다'
  skip '로그인 상태' 'CLI가 없어 확인 자체가 불가능하다'
fi

wrapper_ok=0
if [ -x "$PROJECT/gradlew" ] && [ -f "$PROJECT/gradle/wrapper/gradle-wrapper.jar" ]; then
  wrapper_line="$( (cd "$PROJECT" && ./gradlew --no-daemon --quiet --version 2>/dev/null) | LC_ALL=C grep -E '^Gradle ' | head -n 1)"
  if [ -n "$wrapper_line" ]; then
    pass 'Gradle Wrapper' "$wrapper_line"
    wrapper_ok=1
  else
    fail 'Gradle Wrapper' 'gradlew --version 이 실행되지 않았다'
  fi
else
  fail 'Gradle Wrapper' 'project/gradlew 또는 wrapper jar가 없다'
fi

# ── 로컬 품질 게이트 ──────────────────────────────────────────────────────────
printf '\n[로컬 품질 게이트 — ./gradlew check]\n'

if [ "$wrapper_ok" -ne 1 ]; then
  skip 'check 실행'   'Wrapper가 없어 실행하지 못했다'
  skip '컴파일'       '실행하지 않았다'
  skip 'Checkstyle'   '실행하지 않았다'
  skip 'JUnit'        '실행하지 않았다'
else
  # 지난 실행의 산출물을 지운다 — 아래 판정은 이번 실행의 증거만 본다.
  rm -rf "$PROJECT/build"
  mkdir -p "$LOG_DIR"
  (cd "$PROJECT" && ./gradlew --no-daemon check) > "$LOG" 2>&1
  check_status=$?

  if [ "$check_status" -eq 0 ]; then
    pass 'check 실행' '종료 코드 0'
  else
    fail 'check 실행' "종료 코드 $check_status"
  fi

  if ls "$PROJECT"/build/classes/java/main/order/*.class > /dev/null 2>&1; then
    pass '컴파일' '이번 실행에서 클래스를 생성했다'
  else
    fail '컴파일' '클래스가 생성되지 않았다'
  fi

  style_report="$PROJECT/build/reports/checkstyle/main.xml"
  if [ -f "$style_report" ]; then
    style_errors="$(LC_ALL=C grep -c '<error ' "$style_report" 2>/dev/null)"
    if [ "${style_errors:-0}" -eq 0 ]; then
      pass 'Checkstyle' '위반 0건 (14.4.0)'
    else
      fail 'Checkstyle' "위반 ${style_errors}건 — build/reports/checkstyle/main.html 을 본다"
    fi
  else
    skip 'Checkstyle' '보고서가 없다 — 이번 실행에서 검사가 돌지 않았다'
  fi

  failures="$(test_failures_in "$PROJECT/build/test-results/test/TEST-*.xml")"
  if [ -n "$failures" ]; then
    ran="$(LC_ALL=C grep -ho 'tests="[0-9]*"' "$PROJECT"/build/test-results/test/TEST-*.xml |
      LC_ALL=C grep -oE '[0-9]+' | awk '{ sum += $1 } END { print sum + 0 }')"
    if [ "$failures" -eq 0 ] && [ "${ran:-0}" -gt 0 ]; then
      pass 'JUnit' "${ran}건 통과 (6.1.3)"
    elif [ "$failures" -gt 0 ]; then
      fail 'JUnit' "${failures}건 실패 — build/reports/tests/test/index.html 을 본다"
    else
      skip 'JUnit' '실행된 테스트가 없다'
    fi
  else
    skip 'JUnit' '테스트 결과가 없다 — 이번 실행에서 테스트가 돌지 않았다'
  fi

  if [ "$check_status" -ne 0 ]; then
    printf '\n  check 명령의 마지막 출력:\n'
    tail -n 12 "$LOG" | sed 's/^/    /'
    tip "전체 출력은 $LOG 에 있다."
  fi
fi

# ── 요약 ──────────────────────────────────────────────────────────────────────
printf '\n=== 요약 ===\n'
printf 'PASS %d · FAIL %d · 미검증 %d\n' "$PASS_COUNT" "$FAIL_COUNT" "$SKIP_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf 'FAIL 항목의 조치를 따른다. 20분 안에 끝나지 않으면 휴식 시간에 이어서 한다.\n'
  printf '그래도 준비되지 않으면 대화형 Claude로 이후 실습에 참여한다 — 그 경우 실제 빌드·정적 검사·테스트 실행은 수행되지 않는다.\n'
  exit 1
fi

if [ "$SKIP_COUNT" -gt 1 ]; then
  printf '필수 검사에 미검증이 남았다. 미검증은 PASS가 아니다 — 위 목록에서 무엇이 돌지 않았는지 확인한다.\n'
  exit 2
fi

printf '로컬 품질 게이트 PASS — 이번 실행에서 컴파일·Checkstyle·JUnit이 통과했다.\n'
printf '실행한 검사가 통과했다는 증거다. CI 파이프라인은 이 과정에서 만들지 않으므로 「CI 통과」가 아니다.\n'
printf '로그인 상태는 미검증이다. claude를 실행해 대화가 시작되는지 직접 확인한다.\n'
exit 0
