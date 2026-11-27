#!/usr/bin/env bash
#
# AI-native SW Engineering — S01 환경 설정 2단계 (Git Bash)
#
# 실행 — 배포 폴더(보통 Downloads\AI_native)에서 마우스 오른쪽 "Git Bash Here":
#     ./setup.sh
#
# 갖추는 것: Temurin JDK 21 LTS · Gradle Wrapper 9.9.2 · Claude Code CLI 확인 ·
#            최소 Java 검증 프로젝트의 의존성(JUnit 6.1.3 · Checkstyle 14.4.0).
#
# 원칙:
#   - 여러 번 실행해도 안전하다. 이미 올바른 것은 건너뛴다.
#   - 내려받은 파일은 SHA-256을 확인한 것만 쓴다. 확인할 수 없으면 FAIL로 멈춘다.
#   - **설치 명령을 글로 받아 셸에 넘기지 않는다.** 실행하는 것은 무결성을 확인한 배포 파일과
#     공식 배포처의 절차뿐이다.
#   - **사용자의 전역 개발 환경을 바꾸지 않는다.** JDK·Gradle·Gradle 캐시는 모두 배포 폴더
#     안(`tools/`)에 두고, `~/.gradle`·레지스트리·시스템 PATH를 건드리지 않는다.
#   - 관리자 권한을 요구하지 않는다. 모든 설치는 배포 폴더 안에 둔다.
#   - 인증 정보를 묻거나 저장하거나 출력하지 않는다. 로그인은 3단계에서 사람이 한다.
#   - 애플리케이션 프레임워크와 CI 서버는 설치하지 않는다.

set -u
set -o pipefail

# 경로를 글로 적지 않는다 — 이 스크립트가 있는 폴더를 기준으로 모든 파일을 찾는다.
# 그래서 배포 폴더를 Downloads 어디에 풀어도, OneDrive로 옮겨져 있어도 그대로 동작한다.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OFFLINE="$ROOT/offline"

JDK_FEATURE=21
GRADLE_VERSION=9.9.2
GRADLE_DIST="gradle-${GRADLE_VERSION}-bin.zip"
GRADLE_URL="https://services.gradle.org/distributions/${GRADLE_DIST}"

FAILED=0
PATH_RISK=""

say()  { printf '\n[단계] %s\n' "$1"; }
ok()   { printf '  PASS  %s\n' "$1"; }
warn() { printf '  주의  %s\n' "$1"; }
bad()  { printf '  FAIL  %s\n' "$1"; FAILED=$((FAILED + 1)); }
tip()  { printf '        %s\n' "$1"; }

# ── 0. 실행 환경 ───────────────────────────────────────────────────────────────
say '실행 환경 확인'

case "$(uname -s 2>/dev/null)" in
  MINGW*|MSYS*|CYGWIN*) ok "Git Bash에서 실행 중 — $(uname -s)" ;;
  *) bad "Git Bash가 아니다 — $(uname -s 2>/dev/null || echo unknown)"
     tip '시작 메뉴에서 Git Bash를 열고 다시 실행한다. 먼저 bootstrap.ps1을 끝내야 한다.' ;;
esac

ok "배포 폴더 — $ROOT"

# Windows의 Downloads 아래든 어디든 이 폴더에서 그대로 실행한다. 다만 **빌드 도구가 쓸 경로**는
# ASCII·공백 없는 쪽이 안전하다 — 한글 사용자 이름(`C:\Users\홍길동`)이나 `OneDrive - 회사`처럼
# 공백이 든 경로에서 JDK·Gradle이 깨진 사례가 있다. 폴더를 옮기라고 하지 않고, 같은 폴더의
# **짧은 이름(8.3)** 을 찾아 그것으로 도구를 설치한다.
path_risky() {
  printf '%s' "$1" | LC_ALL=C grep -q '[^ -~]' && return 0
  printf '%s' "$1" | grep -q ' ' && return 0
  return 1
}

SAFE_ROOT="$ROOT"
if path_risky "$ROOT"; then
  short="$(cygpath -ms "$ROOT" 2>/dev/null || true)"
  short_unix="$([ -n "$short" ] && cygpath -u "$short" 2>/dev/null || true)"
  if [ -n "$short_unix" ] && [ -d "$short_unix" ] && ! path_risky "$short_unix"; then
    SAFE_ROOT="$short_unix"
    ok "경로에 한글·공백이 있어 짧은 이름을 쓴다 — $SAFE_ROOT"
  else
    PATH_RISK="yes"
    warn "경로에 한글이나 공백이 있고 짧은 이름을 얻지 못했다 — $ROOT"
    tip '원인 — Windows의 8.3 짧은 이름 생성이 꺼져 있으면 cygpath -ms가 같은 경로를 돌려준다.'
    tip '이 조건에서 JDK·Gradle이 동작하는지는 확인하지 않았다. 계속 진행하되 실패하면 강사에게 알린다.'
    tip '확실한 길 — 배포 폴더를 C:\\tm 처럼 한글·공백 없는 경로에 풀어 다시 실행한다.'
  fi
fi

TOOLS="$SAFE_ROOT/tools"
PROJECT="$SAFE_ROOT/project"
JDK_HOME="$TOOLS/jdk-${JDK_FEATURE}"
GRADLE_HOME_DIR="$TOOLS/gradle-${GRADLE_VERSION}"
export GRADLE_USER_HOME="$TOOLS/gradle-home"

for script in "$ROOT"/*.sh; do
  [ -f "$script" ] || continue
  if LC_ALL=C grep -q $'\r' "$script"; then
    bad "줄바꿈이 CRLF다 — $(basename "$script")"
    tip "다음 한 줄로 고친다:  sed -i 's/\\r$//' $(basename "$script")"
  fi
done

mkdir -p "$TOOLS" "$GRADLE_USER_HOME"

# ── 공용: SHA-256 확인 ────────────────────────────────────────────────────────
# $1 확인할 파일, $2 기대값이 적힌 파일. 둘째 인자가 없거나 비면 1을 돌려준다.
check_sha256() {
  local file="$1" hash_file="$2" expected actual
  [ -f "$hash_file" ] || return 1
  expected="$(LC_ALL=C grep -oE '[0-9a-fA-F]{64}' "$hash_file" | head -n 1)"
  [ -n "$expected" ] || return 1
  actual="$(sha256sum "$file" | cut -d' ' -f1)"
  [ "$(printf '%s' "$actual" | tr 'A-Z' 'a-z')" = "$(printf '%s' "$expected" | tr 'A-Z' 'a-z')" ]
}

# ── 1. Git ────────────────────────────────────────────────────────────────────
say 'Git 확인'
if command -v git >/dev/null 2>&1; then
  ok "$(git --version)"
else
  bad 'git을 찾지 못했다. bootstrap.ps1을 먼저 끝낸다.'
fi

# ── 2. JDK 21 ─────────────────────────────────────────────────────────────────
say "Temurin JDK ${JDK_FEATURE} LTS 준비"

jdk_feature_of() {
  local java_bin="$1"
  "$java_bin" -version 2>&1 | head -n 1 | LC_ALL=C sed -nE 's/.*"([0-9]+).*/\1/p'
}

if [ -x "$JDK_HOME/bin/java" ] && [ "$(jdk_feature_of "$JDK_HOME/bin/java")" = "$JDK_FEATURE" ]; then
  ok "이미 준비돼 있다 — $("$JDK_HOME/bin/java" -version 2>&1 | head -n 1)"
else
  jdk_zip="$(ls "$OFFLINE"/OpenJDK${JDK_FEATURE}U-jdk_x64_windows_hotspot_*.zip 2>/dev/null | head -n 1)"
  if [ -z "$jdk_zip" ]; then
    bad "배포 폴더에 JDK ${JDK_FEATURE} 압축 파일이 없다 — offline/OpenJDK${JDK_FEATURE}U-jdk_x64_windows_hotspot_*.zip"
    tip 'JDK는 사전 배포 항목이다. 강사에게 배포 폴더를 다시 받는다.'
  elif ! check_sha256 "$jdk_zip" "$jdk_zip.sha256"; then
    bad "JDK 압축 파일의 SHA-256을 확인하지 못했다 — $(basename "$jdk_zip")"
    tip '짝이 되는 .sha256 파일이 없거나 값이 다르다. 확인되지 않은 파일은 풀지 않는다.'
  else
    tip "무결성 확인됨 — $(basename "$jdk_zip")"
    rm -rf "$JDK_HOME.tmp" && mkdir -p "$JDK_HOME.tmp"
    if unzip -q "$jdk_zip" -d "$JDK_HOME.tmp"; then
      inner="$(ls -d "$JDK_HOME.tmp"/*/ 2>/dev/null | head -n 1)"
      rm -rf "$JDK_HOME"
      mv "${inner%/}" "$JDK_HOME"
      rm -rf "$JDK_HOME.tmp"
      if [ -x "$JDK_HOME/bin/java" ]; then
        ok "준비됨 — $("$JDK_HOME/bin/java" -version 2>&1 | head -n 1)"
      else
        bad "압축은 풀렸지만 $JDK_HOME/bin/java 가 없다"
      fi
    else
      bad "JDK 압축을 풀지 못했다 — $(basename "$jdk_zip")"
    fi
  fi
fi

if [ -x "$JDK_HOME/bin/java" ]; then
  export JAVA_HOME="$JDK_HOME"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

# ── 3. Gradle 배포본 ──────────────────────────────────────────────────────────
say "Gradle ${GRADLE_VERSION} 배포본 준비"

if [ -x "$GRADLE_HOME_DIR/bin/gradle" ]; then
  ok "이미 준비돼 있다 — $GRADLE_HOME_DIR"
else
  dist="$OFFLINE/$GRADLE_DIST"
  dist_hash="$OFFLINE/$GRADLE_DIST.sha256"
  if [ ! -f "$dist" ]; then
    tip "배포 폴더에 없다. 공식 배포처에서 내려받는다 — $GRADLE_URL"
    dist="$TOOLS/$GRADLE_DIST"
    dist_hash="$TOOLS/$GRADLE_DIST.sha256"
    curl -fsSL -o "$dist" "$GRADLE_URL" || bad "Gradle 배포본을 내려받지 못했다 — 네트워크나 프록시를 확인한다"
    curl -fsSL -o "$dist_hash" "$GRADLE_URL.sha256" || bad 'Gradle 배포본의 공식 SHA-256을 받지 못했다'
  fi

  if [ -f "$dist" ] && check_sha256 "$dist" "$dist_hash"; then
    tip "무결성 확인됨 — $(basename "$dist")"
    rm -rf "$GRADLE_HOME_DIR"
    if unzip -q "$dist" -d "$TOOLS"; then
      ok "준비됨 — $GRADLE_HOME_DIR"
    else
      bad 'Gradle 압축을 풀지 못했다'
    fi
  else
    bad "Gradle 배포본의 SHA-256을 확인하지 못했다 — $GRADLE_DIST"
    tip '확인되지 않은 배포본은 쓰지 않는다. 오프라인 배포 폴더의 파일과 .sha256을 강사에게 받는다.'
  fi
fi

# ── 4. Gradle Wrapper ─────────────────────────────────────────────────────────
say 'Gradle Wrapper 생성'

if [ ! -d "$PROJECT" ]; then
  bad "검증 프로젝트 폴더가 없다 — $PROJECT"
elif [ -x "$PROJECT/gradlew" ] && [ -f "$PROJECT/gradle/wrapper/gradle-wrapper.jar" ]; then
  ok '이미 있다 — project/gradlew'
elif [ -x "$GRADLE_HOME_DIR/bin/gradle" ] && [ -n "${JAVA_HOME:-}" ]; then
  if (cd "$PROJECT" && "$GRADLE_HOME_DIR/bin/gradle" --no-daemon --quiet wrapper --gradle-version "$GRADLE_VERSION"); then
    chmod +x "$PROJECT/gradlew" 2>/dev/null || true
    ok "생성됨 — project/gradlew (Gradle ${GRADLE_VERSION})"
  else
    bad 'Gradle Wrapper를 생성하지 못했다'
    tip '위의 Gradle 배포본과 JDK 단계가 PASS인지 먼저 확인한다.'
  fi
else
  bad 'Gradle 배포본이나 JDK가 준비되지 않아 Wrapper를 만들 수 없다'
fi

# ── 5. 빌드가 쓸 JDK 고정 ─────────────────────────────────────────────────────
say '빌드가 쓸 JDK 고정'
if [ -n "${JAVA_HOME:-}" ]; then
  gradle_java_home="$(cygpath -m "$JAVA_HOME" 2>/dev/null || printf '%s' "$JAVA_HOME")"
  {
    printf '# setup.sh가 생성한다. 손으로 고치지 않는다.\n'
    printf 'org.gradle.java.installations.paths=%s\n' "$gradle_java_home"
  } > "$GRADLE_USER_HOME/gradle.properties"
  ok "toolchain 경로를 등록했다 — $gradle_java_home"

  {
    printf '# setup.sh가 생성한다. verify.sh가 읽는다. 경로는 이 PC에서 해석한 값이다.\n'
    printf 'export JAVA_HOME="%s"\n' "$JAVA_HOME"
    printf 'export GRADLE_USER_HOME="%s"\n' "$GRADLE_USER_HOME"
    printf 'export TM_PROJECT="%s"\n' "$PROJECT"
    printf 'export PATH="$JAVA_HOME/bin:$PATH"\n'
  } > "$ROOT/env.sh"
  ok '환경 파일을 만들었다 — env.sh'
else
  bad 'JDK가 준비되지 않아 환경 파일을 만들지 않았다'
fi

# ── 6. 의존성 준비 ────────────────────────────────────────────────────────────
say '검증 프로젝트의 의존성 준비 (JUnit 6.1.3 · Checkstyle 14.4.0)'
if [ -d "$OFFLINE/gradle-home" ]; then
  tip '오프라인 의존성 캐시를 복사한다.'
  cp -R "$OFFLINE/gradle-home/." "$GRADLE_USER_HOME/" 2>/dev/null || warn '캐시 복사가 일부 실패했다.'
fi

if [ -x "$PROJECT/gradlew" ] && [ -n "${JAVA_HOME:-}" ]; then
  resolved=0
  for configuration in testRuntimeClasspath checkstyle; do
    if (cd "$PROJECT" && ./gradlew --no-daemon --quiet dependencies --configuration "$configuration" > /dev/null); then
      resolved=$((resolved + 1))
    else
      bad "의존성을 받지 못했다 — $configuration"
      tip '사내 프록시가 Maven Central을 막으면 오프라인 캐시(offline/gradle-home)가 필요하다. 강사에게 알린다.'
    fi
  done
  [ "$resolved" -eq 2 ] && ok 'JUnit과 Checkstyle 의존성을 모두 받았다'
else
  bad 'Wrapper가 없어 의존성을 준비하지 못했다'
fi

# ── 7. Claude Code CLI ────────────────────────────────────────────────────────
say 'Claude Code CLI 확인'
if command -v claude >/dev/null 2>&1; then
  ok "설치돼 있다 — $(claude --version 2>&1 | head -n 1)"
else
  # 배포 폴더의 **설치 파일**만 실행한다. 설치 명령을 글로 받아 셸에 넘기지 않는다 —
  # 그 글이 무엇이든 실행되므로, 배포 폴더가 바뀌면 임의의 명령이 수강생 PC에서 돈다.
  installer="$(ls "$OFFLINE"/ClaudeCode*.exe "$OFFLINE"/claude-code*.exe 2>/dev/null | head -n 1)"
  if [ -z "$installer" ]; then
    bad 'Claude Code CLI가 없고 배포 폴더에 확인된 설치 파일도 없다'
    tip 'README.md의 「Claude Code 설치」를 따른다. 설치 절차는 제품과 함께 바뀌므로 강사가 파일럿에서 확정한 공식 절차를 쓴다.'
  elif ! check_sha256 "$installer" "$installer.sha256"; then
    bad "설치 파일의 SHA-256을 확인하지 못했다 — $(basename "$installer")"
    tip '짝이 되는 .sha256 파일이 없거나 값이 다르다. 확인되지 않은 설치 파일은 실행하지 않는다.'
  else
    tip "무결성 확인됨 — $(basename "$installer"). 설치 창이 열리면 안내대로 끝낸다."
    "$installer"
    if command -v claude >/dev/null 2>&1; then
      ok "설치됨 — $(claude --version 2>&1 | head -n 1)"
    else
      bad '설치가 끝났지만 claude를 찾지 못했다'
      tip 'Git Bash를 닫고 다시 열어 ./verify.sh 로 확인한다. PATH는 새 창에서 반영된다.'
    fi
  fi
fi

# ── 요약 ──────────────────────────────────────────────────────────────────────
printf '\n=== 2단계 요약 ===\n'
[ -n "$PATH_RISK" ] && printf '주의: 한글·공백이 든 경로에서 돌렸다. 이 조건은 검증되지 않았다.\n'
if [ "$FAILED" -eq 0 ]; then
  printf '모두 준비됐다. 다음은 로그인과 검증이다.\n'
  tip 'claude          (브라우저가 열리면 로그인하고 창을 닫는다)'
  tip './verify.sh'
  exit 0
else
  printf 'FAIL %d건이다. 위의 FAIL 줄과 조치를 강사에게 그대로 보여 준다.\n' "$FAILED"
  printf '20분 안에 해결되지 않으면 휴식 시간에 이어서 하고, 그래도 안 되면 대화형 Claude로 실습에 참여한다.\n'
  exit 1
fi
