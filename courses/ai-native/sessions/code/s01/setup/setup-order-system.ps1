# 실습 환경 설치 — Windows PowerShell
# 세션 01의 「13. 실습 환경을 설치 스크립트로 갖춘다」가 안내하는 스크립트다.
# 설치하는 것: Claude Code(코딩 에이전트), JDK 21, Gradle, Git, 그리고 실습 저장소 order-system.
# 이미 설치된 도구는 건너뛴다. Claude Team 로그인은 사람이 직접 한다.

$ErrorActionPreference = "Stop"

function Install-IfMissing($command, $wingetId, $label) {
    if (Get-Command $command -ErrorAction SilentlyContinue) {
        Write-Host "[건너뜀] $label 이미 설치됨"
        return
    }
    Write-Host "[설치] $label"
    winget install --id $wingetId --accept-source-agreements --accept-package-agreements
}

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "winget이 없다. Windows의 App Installer를 설치하거나 각 도구를 제품 설치 파일로 설치한다."
}

Install-IfMissing "git"    "Git.Git"                  "Git"
Install-IfMissing "java"   "Microsoft.OpenJDK.21"     "JDK 21"
Install-IfMissing "gradle" "Gradle.Gradle"            "Gradle"
Install-IfMissing "claude" "Anthropic.ClaudeCode"     "Claude Code"

$repo = Join-Path $HOME "order-system"
if (-not (Test-Path $repo)) {
    Write-Host "[생성] 실습 저장소 $repo"
    New-Item -ItemType Directory -Path $repo | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $repo "docs") | Out-Null
    git -C $repo init | Out-Null
} else {
    Write-Host "[건너뜀] 실습 저장소 이미 있음 — $repo"
}

Write-Host ""
Write-Host "설치 확인"
git --version
java -version
gradle -v --quiet
claude --version
git -C $repo status --short --branch

Write-Host ""
Write-Host "남은 단계: claude 를 실행해 Claude Team 계정으로 로그인하고 대화가 되는지 확인한다."
