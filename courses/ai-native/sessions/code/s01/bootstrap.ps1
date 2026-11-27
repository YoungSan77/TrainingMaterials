#Requires -Version 5.1
<#
    AI-native SW Engineering — S01 환경 설정 1단계 (Windows PowerShell)

    하는 일은 하나다: Git for Windows를 확보해 Git Bash를 쓸 수 있게 한다.
    .sh를 실행할 셸이 Git과 함께 설치되므로, 이 한 단계만 PowerShell로 한다.

    실행 — 배포 폴더(보통 Downloads\AI_native)를 탐색기에서 열고, 주소창에
    powershell 을 입력해 그 폴더에서 PowerShell을 연 뒤:
        powershell -ExecutionPolicy Bypass -File bootstrap.ps1

    경로를 글로 적지 않는다 — 이 스크립트가 있는 폴더($PSScriptRoot)를 기준으로 찾으므로
    Downloads가 OneDrive로 옮겨져 있어도, 폴더를 다른 곳에 풀어도 그대로 동작한다.

    원칙:
      - 관리자 권한을 요구하지 않는다. 사용자 범위 설치를 먼저 시도한다.
      - 이미 올바르게 설치돼 있으면 건드리지 않는다(여러 번 실행해도 안전하다).
      - 설치 파일은 무결성(SHA-256)을 확인한 것만 실행한다.
      - 인증 정보를 묻거나 저장하거나 출력하지 않는다. 로그인은 2단계 이후 사람이 한다.
#>
[CmdletBinding()]
param(
    # 배포 폴더. 기본값은 이 스크립트가 있는 폴더다.
    [string] $Root = $PSScriptRoot,

    # 설치하지 않고 현재 상태만 본다.
    [switch] $CheckOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8

$MinGitVersion = [version] '2.40.0'
$OfflineDir = Join-Path $Root 'offline'

function Write-Step  { param([string] $Text) Write-Host "`n[단계] $Text" -ForegroundColor Cyan }
function Write-Ok    { param([string] $Text) Write-Host "  PASS  $Text" -ForegroundColor Green }
function Write-Warn2 { param([string] $Text) Write-Host "  주의  $Text" -ForegroundColor Yellow }
function Write-Fail  { param([string] $Text) Write-Host "  FAIL  $Text" -ForegroundColor Red }

function Write-Guide {
    param([string[]] $Lines)
    foreach ($line in $Lines) { Write-Host "        $line" -ForegroundColor Gray }
}

# Git 실행 파일을 PATH와 표준 설치 경로에서 찾는다.
function Find-GitExe {
    $cmd = Get-Command git.exe -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA 'Programs\Git\cmd\git.exe'),
        (Join-Path $env:ProgramFiles 'Git\cmd\git.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Git\cmd\git.exe')
    )
    foreach ($path in $candidates) {
        if ($path -and (Test-Path -LiteralPath $path)) { return $path }
    }
    return $null
}

function Get-GitVersion {
    param([string] $GitExe)
    $raw = & $GitExe --version 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $raw) { return $null }
    $match = [regex]::Match([string] $raw, '(\d+)\.(\d+)\.(\d+)')
    if (-not $match.Success) { return $null }
    return [version] $match.Value
}

# git.exe 위치에서 Git Bash를 찾는다. 버전을 물어볼 수 있는 bash.exe를 먼저 찾고,
# 창을 띄우는 git-bash.exe는 마지막에 둔다 — 실행 가능성을 확인해야 하기 때문이다.
function Find-GitBash {
    param([string] $GitExe)
    $gitRoot = Split-Path -Parent (Split-Path -Parent $GitExe)
    foreach ($relative in @('bin\bash.exe', 'usr\bin\bash.exe', 'git-bash.exe')) {
        $path = Join-Path $gitRoot $relative
        if (Test-Path -LiteralPath $path) { return $path }
    }
    return $null
}

# 찾은 bash가 실제로 실행되는지 본다. 경로가 있다는 것과 실행된다는 것은 다르다.
function Test-BashRuns {
    param([string] $BashExe)
    if ($BashExe -notmatch 'bash\.exe$') { return $null }  # 런처는 버전을 묻지 못한다
    try {
        $raw = & $BashExe -c 'echo $BASH_VERSION' 2>$null
        if ($LASTEXITCODE -eq 0 -and $raw) { return ([string] $raw).Trim() }
        return ''
    }
    catch { return '' }
}

# 배포 폴더의 설치 파일을 SHA-256으로 확인한다. 같은 이름의 .sha256 파일이 짝이다.
function Test-FileHash256 {
    param([string] $FilePath)
    $hashFile = "$FilePath.sha256"
    if (-not (Test-Path -LiteralPath $hashFile)) { return $null }
    $expected = ((Get-Content -LiteralPath $hashFile -Raw) -split '\s+' |
        Where-Object { $_ -match '^[0-9a-fA-F]{64}$' } | Select-Object -First 1)
    if (-not $expected) { return $null }
    $actual = (Get-FileHash -LiteralPath $FilePath -Algorithm SHA256).Hash
    return ($actual -ieq $expected)
}

function Install-GitFromOffline {
    $installer = Get-ChildItem -LiteralPath $OfflineDir -Filter 'Git-*-64-bit.exe' -ErrorAction SilentlyContinue |
        Sort-Object Name | Select-Object -Last 1
    if (-not $installer) { return $false }

    $verified = Test-FileHash256 -FilePath $installer.FullName
    if ($verified -eq $false) {
        Write-Fail "설치 파일의 SHA-256이 짝 파일과 다르다: $($installer.Name)"
        Write-Guide @('배포 폴더를 다시 받는다. 확인되지 않은 설치 파일은 실행하지 않는다.')
        return $false
    }
    if ($null -eq $verified) {
        Write-Fail "무결성을 확인할 수 없다: $($installer.Name).sha256 이 없다"
        Write-Guide @('강사에게 알린다. 확인되지 않은 설치 파일은 실행하지 않는다.')
        return $false
    }

    Write-Host "        무결성 확인됨: $($installer.Name)"
    $arguments = '/VERYSILENT /NORESTART /NOCANCEL /SP- /COMPONENTS="gitlfs,assoc_sh"'
    $process = Start-Process -FilePath $installer.FullName -ArgumentList $arguments -PassThru -Wait
    return ($process.ExitCode -eq 0)
}

function Install-GitFromWinget {
    if (-not (Get-Command winget.exe -ErrorAction SilentlyContinue)) { return $false }
    Write-Host '        winget으로 사용자 범위 설치를 시도한다.'
    & winget.exe install --id Git.Git --scope user --accept-source-agreements --accept-package-agreements --silent
    return ($LASTEXITCODE -eq 0)
}

Write-Host '=== S01 환경 설정 1단계 — Git과 Git Bash ===' -ForegroundColor White
Write-Host "배포 폴더: $Root"

Write-Step 'Windows와 실행 조건 확인'
$osVersion = [System.Environment]::OSVersion.Version
Write-Ok "Windows $osVersion / PowerShell $($PSVersionTable.PSVersion) / 아키텍처 $env:PROCESSOR_ARCHITECTURE"
if ($env:PROCESSOR_ARCHITECTURE -notin @('AMD64', 'ARM64')) {
    Write-Warn2 '64비트가 아닌 환경이다. 배포한 설치 파일이 맞지 않을 수 있으니 강사에게 알린다.'
}
# 실제 Downloads 위치는 레지스트리의 known folder가 정본이다 — OneDrive로 옮겨졌을 수 있으므로
# C:\Users\<이름>\Downloads 라고 가정하지 않는다. 확인만 하고 동작은 $PSScriptRoot로 한다.
$downloads = $null
try {
    $key = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
    $raw = (Get-ItemProperty -Path $key -Name '{374DE290-123F-4565-9164-39C4925E467B}' -ErrorAction Stop).'{374DE290-123F-4565-9164-39C4925E467B}'
    $downloads = [Environment]::ExpandEnvironmentVariables($raw)
}
catch { $downloads = $null }

if ($downloads) {
    Write-Ok "Downloads 폴더 — $downloads"
    if (-not $Root.StartsWith($downloads, [StringComparison]::OrdinalIgnoreCase)) {
        Write-Host "        배포 폴더는 Downloads 밖에 있다. 그대로 진행한다 — 위치는 상관없다."
    }
}
else {
    Write-Warn2 'Downloads 위치를 확인하지 못했다. 배포 폴더의 현재 위치로 그대로 진행한다.'
}

if ($Root -match '[^\u0000-\u007F]' -or $Root -match '\s') {
    Write-Warn2 "배포 폴더 경로에 한글이나 공백이 있다: $Root"
    Write-Guide @(
        'Git 설치에는 영향이 없다. 다음 단계의 setup.sh가 같은 폴더의 짧은 이름(8.3)을 찾아 쓴다.',
        '짧은 이름을 얻지 못하면 setup.sh가 그 사실과 원인을 알려 준다.'
    )
}

Write-Step 'Git 설치 확인'
$gitExe = Find-GitExe
$gitVersion = if ($gitExe) { Get-GitVersion -GitExe $gitExe } else { $null }

if ($gitVersion -and $gitVersion -ge $MinGitVersion) {
    Write-Ok "이미 설치돼 있다 — git $gitVersion ($gitExe)"
}
elseif ($CheckOnly) {
    Write-Fail 'Git이 없거나 너무 낮은 버전이다. -CheckOnly 이므로 설치하지 않는다.'
}
else {
    if ($gitVersion) { Write-Warn2 "git $gitVersion 은 이 과정의 하한 $MinGitVersion 보다 낮다. 다시 설치한다." }
    else { Write-Host '        Git이 없다. 설치한다.' }

    $installed = Install-GitFromOffline
    if (-not $installed) { $installed = Install-GitFromWinget }

    if ($installed) {
        $gitExe = Find-GitExe
        $gitVersion = if ($gitExe) { Get-GitVersion -GitExe $gitExe } else { $null }
        if ($gitVersion) { Write-Ok "설치됨 — git $gitVersion ($gitExe)" }
        else { Write-Fail '설치가 끝났지만 git.exe를 찾지 못했다. PowerShell 창을 닫고 다시 열어 실행한다.' }
    }
    else {
        Write-Fail 'Git을 설치하지 못했다.'
        Write-Guide @(
            '원인은 보통 세 가지다.',
            '  1) 배포 폴더의 offline\Git-*-64-bit.exe 가 없다 — 강사에게 배포 폴더를 다시 받는다.',
            '  2) 사내 네트워크가 winget 저장소를 막는다 — 오프라인 설치 파일을 쓴다.',
            '  3) 설치 권한이 없다 — 강사에게 알리고 대화형 Claude 경로로 참여한다.'
        )
    }
}

Write-Step 'Git Bash 실행 확인'
$bash = if ($gitExe) { Find-GitBash -GitExe $gitExe } else { $null }
if (-not $bash) {
    Write-Fail 'Git Bash(bash.exe)를 찾지 못했다. 다음 단계의 .sh를 실행할 수 없다.'
}
else {
    $bashVersion = Test-BashRuns -BashExe $bash
    if ($bashVersion) {
        Write-Ok "실행된다 — bash $bashVersion ($bash)"
    }
    elseif ($null -eq $bashVersion) {
        Write-Warn2 "런처만 찾았다 — $bash. 시작 메뉴의 Git Bash로 다음 단계를 진행한다."
    }
    else {
        Write-Fail "찾았지만 실행되지 않는다 — $bash"
        Write-Guide @('설치가 끝나지 않았거나 보안 정책이 실행을 막는다. 강사에게 알린다.')
        $bash = $null
    }
}

Write-Host "`n=== 1단계 요약 ===" -ForegroundColor White
if ($gitVersion -and $bash) {
    # Git Bash의 경로 표기로 바꿔 준다 — 드라이브 문자만 소문자로 하고 나머지는 그대로 둔다
    # (폴더 이름을 소문자로 바꾸면 한글·대문자 폴더에서 cd가 실패한다).
    $unixRoot = [regex]::Replace($Root, '^([A-Za-z]):', { '/' + $args[0].Groups[1].Value.ToLower() }).Replace('\', '/')
    Write-Host '다음은 Git Bash에서 한다.' -ForegroundColor Green
    Write-Guide @(
        '이 폴더에서 마우스 오른쪽 → "Git Bash Here" 를 고르고',
        '  ./setup.sh',
        '',
        '시작 메뉴에서 Git Bash를 열었다면 먼저 폴더로 이동한다',
        "  cd '$unixRoot'",
        '  ./setup.sh'
    )
    exit 0
}
else {
    Write-Host '1단계를 끝내지 못했다. 위의 FAIL 줄과 조치를 강사에게 그대로 보여 준다.' -ForegroundColor Red
    Write-Host '20분 안에 해결되지 않으면 휴식 시간에 이어서 하고, 그래도 안 되면 대화형 Claude로 실습에 참여한다.'
    exit 1
}
