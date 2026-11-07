#!/bin/bash
# 실습 환경 설치 — macOS
# 세션 01의 「13. 실습 환경을 설치 스크립트로 갖춘다」가 안내하는 스크립트의 macOS판이다.
# 설치하는 것: Claude Code(코딩 에이전트), JDK 21, Gradle, Git, 그리고 실습 저장소 order-system.
# 이미 설치된 도구는 건너뛴다. Claude Team 로그인은 사람이 직접 한다.

set -euo pipefail

install_if_missing() {
  local command_name=$1 formula=$2 label=$3
  if command -v "$command_name" >/dev/null 2>&1; then
    echo "[건너뜀] $label 이미 설치됨"
    return
  fi
  echo "[설치] $label"
  brew install "$formula"
}

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew가 없다. https://brew.sh 의 안내로 먼저 설치한다." >&2
  exit 1
fi

install_if_missing git    git           "Git"
install_if_missing java   openjdk@21    "JDK 21"
install_if_missing gradle gradle        "Gradle"
install_if_missing claude claude-code   "Claude Code"

repo="$HOME/order-system"
if [ ! -d "$repo" ]; then
  echo "[생성] 실습 저장소 $repo"
  mkdir -p "$repo/docs"
  git -C "$repo" init >/dev/null
else
  echo "[건너뜀] 실습 저장소 이미 있음 — $repo"
fi

echo
echo "설치 확인"
git --version
java -version
gradle -v --quiet
claude --version
git -C "$repo" status --short --branch

echo
echo "남은 단계: claude 를 실행해 Claude Team 계정으로 로그인하고 대화가 되는지 확인한다."
