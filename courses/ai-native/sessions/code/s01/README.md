# S01 실습 환경 — Windows 설치·검증 자산

`"세션 01. AI-native SW 공학 개요"`의 환경 설정 20분에 수강생이 실행하는 스크립트와, 그 환경이 실제로 동작하는지 확인하는 최소 Java 프로젝트다. 수강생 PC는 전원 Microsoft Windows이며, 다른 운영체제의 경로는 설계하지 않는다.

슬라이드에는 실행 순서와 명령만 싣는다. 스크립트 전문과 실패 대응은 이 폴더가 소유한다.

## 수강생에게 배포하는 폴더

강사가 아래 모양으로 묶어 **`AI_native`** 라는 이름으로 사전에 배포한다. 수강생은 그 폴더를 자신의 **다운로드 폴더**에 복사하고, **옮기지 않고 그 자리에서** 실행한다. 폴더 이름은 슬라이드·스크립트·이 문서에서 모두 `AI_native`다.

**Downloads의 실제 위치를 가정하지 않는다** — OneDrive로 옮겨져 `C:\Users\<이름>\Downloads`가 아닌 PC가 있다. 세 스크립트는 모두 **자기 파일의 위치**(`$PSScriptRoot` · `BASH_SOURCE`)를 기준으로 형제 파일을 찾으므로, 폴더가 어디에 있어도 경로를 입력할 일이 없다. `bootstrap.ps1`은 레지스트리의 known folder로 실제 Downloads 위치를 확인해 출력하고, 배포 폴더가 그 밖에 있어도 그대로 진행한다.

```text
Downloads\AI_native\
  bootstrap.ps1          1단계 (PowerShell) — Git과 Git Bash 확보
  setup.sh               2단계 (Git Bash)  — JDK·Gradle·의존성·Claude Code
  verify.sh              4단계 (Git Bash)  — 설치와 로컬 품질 게이트 확인
  README.md              이 문서
  project\               최소 Java 검증 프로젝트
  samples\               품질 게이트 검출 확인용 예시 파일
  offline\               사전 배포 설치 파일 (강사가 채운다)
  tools\                 setup.sh가 만든다 (JDK·Gradle·Gradle 캐시)
  env.sh                 setup.sh가 만든다 (JAVA_HOME 등)
```

## 실행 순서

작업 폴더는 **다운로드 폴더의 `AI_native`** 하나이고, 모든 단계를 그 폴더에서 한다. 탐색기에서 그 폴더를 열고 **그 폴더에서** 셸을 띄운다 — 주소창에 `powershell`을 입력하면 PowerShell이, 마우스 오른쪽의 `Git Bash Here`를 고르면 Git Bash가 그 폴더에서 열린다. 경로를 타이핑하지 않는다.

| 단계 | 터미널 | 실행 명령 | 확인할 결과 |
|---|---|---|---|
| 1 | — | 받은 `AI_native` 폴더를 다운로드 폴더에 복사 | 폴더 안에 `bootstrap.ps1`·`setup.sh`·`verify.sh`가 있다 |
| 2 | PowerShell | `powershell -ExecutionPolicy Bypass -File bootstrap.ps1` | 마지막 줄이 Git과 Git Bash의 PASS다 |
| 3 | Git Bash | `./setup.sh` | 마지막 줄이 `FAIL 0`이다 |
| 4 | Git Bash | `claude` | 브라우저에서 로그인하면 대화가 시작된다 |
| 5 | Git Bash | `./verify.sh` | 마지막 줄이 `FAIL 0`이고 요약이 PASS다 |

3~5단계는 **같은 Git Bash 창**에서 이어 한다.

Windows가 내려받은 파일을 차단해 두는 경우가 있다. `-ExecutionPolicy Bypass -File` 형태로 실행하면 실행 정책에 걸리지 않으며, 그래도 막히면 배포 폴더의 파일을 선택해 속성에서 `차단 해제`를 체크한다.

`bootstrap.ps1`을 PowerShell로 시작하는 이유는 하나다 — **`.sh`를 실행할 Git Bash가 Git과 함께 설치되므로, Git을 깔기 전에는 셸이 없다.** 그 한 단계 뒤는 모두 `.sh`다.

세 스크립트 모두 **여러 번 실행해도 안전하다.** 이미 올바르게 설치된 도구는 건너뛰고, 기존 설치를 지우거나 덮지 않는다. 인증 정보는 묻지도 저장하지도 출력하지 않는다 — 로그인은 사람이 브라우저에서 한다.

## 사전 배포 항목과 외부 다운로드 항목

**이 저장소에는 설치 파일이 없다.** 아래 「사전 배포」 항목은 강사가 `offline\`에 채워 넣어야 하며, 넣지 않으면 `setup.sh`가 그 단계를 FAIL로 보고한다. 확인되지 않은 파일을 실행하지 않도록, 설치 파일마다 **같은 이름의 `.sha256` 파일**을 짝으로 둔다.

| 항목 | 조달 | 비고 |
|---|---|---|
| Git for Windows | **사전 배포** `offline\Git-*-64-bit.exe` + `.sha256` | 없으면 `winget install --id Git.Git --scope user`로 넘어간다 |
| Temurin JDK 21 LTS | **사전 배포** `offline\OpenJDK21U-jdk_x64_windows_hotspot_*.zip` + `.sha256` | 대체 경로 없음. 없으면 FAIL |
| Gradle 9.9.2 배포본 | 사전 배포 `offline\gradle-9.9.2-bin.zip` + `.sha256`, 없으면 **외부 다운로드** | 공식 배포처의 `.sha256`으로 확인한다 |
| JUnit 6.1.3 · Checkstyle 14.4.0 | **외부 다운로드** (Maven Central) | 프록시가 막으면 `offline\gradle-home\` 캐시가 필요하다 |
| Claude Code CLI | 사전 배포 `offline\ClaudeCode*.exe` + `.sha256`, 또는 **외부 다운로드** | 아래 「Claude Code 설치」 |

**오프라인 배포 방안** — 교육장 네트워크가 패키지 저장소를 막는 경우가 가장 흔한 실패다. 그때는 강사가 사내망 밖에서 한 번 준비해 폴더째 배포한다.

1. 깨끗한 Windows PC에서 `bootstrap.ps1`과 `setup.sh`를 끝까지 실행한다.
2. `tools\gradle-home\` 전체를 `offline\gradle-home\`으로 복사한다 — JUnit·Checkstyle·Gradle 배포본 캐시가 여기에 모인다.
3. Git 설치 파일과 JDK 압축 파일을 `offline\`에 넣고, 각각 `certutil -hashfile <파일> SHA256`의 값을 `.sha256` 파일로 저장한다.
4. 폴더 전체를 압축해 배포한다. 수강생 PC에서는 `setup.sh`가 `offline\`만 보고 네트워크를 쓰지 않는다.

**`offline\`에 넣을 파일** — 이름이 아래 모양과 맞아야 `setup.sh`가 찾는다. 해시는 `certutil -hashfile <파일> SHA256`의 값을 같은 이름 + `.sha256`으로 저장한다.

| 파일 이름 | 받는 곳 | 없으면 |
|---|---|---|
| `Git-*-64-bit.exe` · `.sha256` | Git for Windows 공식 배포 | `winget install --id Git.Git --scope user`로 넘어간다 |
| `OpenJDK21U-jdk_x64_windows_hotspot_*.zip` · `.sha256` | Temurin(Adoptium) 공식 배포 | **FAIL** — 대체 경로가 없다 |
| `gradle-9.9.2-bin.zip` · `.sha256` | Gradle 공식 배포처 | 공식 배포처에서 내려받고 그곳의 `.sha256`으로 확인한다 |
| `ClaudeCode*.exe` · `.sha256` | 제품의 공식 안내(파일럿에서 확정) | **FAIL** — 추측한 명령을 실행하지 않는다 |
| `gradle-home\` (폴더) | 준비용 PC의 `tools\gradle-home\`을 복사 | Maven Central에서 내려받는다(프록시가 막으면 FAIL) |

**수강생에게 미리 보낼 것** — ① 배포 폴더 압축 파일 ② **Downloads에 `AI_native`로 풀고 옮기지 말라는 안내** ③ Claude 계정 로그인 확인. 설치 자체를 미리 요구하지는 않는다.

## Claude Code 설치

**[확정 필요]** Claude Code CLI의 Windows 설치 절차는 제품과 함께 바뀐다. 이 폴더는 명령을 하드코딩하지 않는다.

- `setup.sh`는 먼저 `claude`가 PATH에 있는지 본다. 있으면 그대로 쓴다.
- 없으면 `offline\ClaudeCode*.exe`(또는 `claude-code*.exe`)를 찾아 **SHA-256을 확인한 뒤 그 파일을 실행**한다.
- 그 파일이 없거나 해시가 맞지 않으면 FAIL로 보고하고 이 문서를 가리킨다. **추측한 명령을 실행하지 않는다.**

**설치 명령을 글로 받아 실행하지 않는다.** 이전 설계는 강사가 적어 둔 한 줄을 셸에 넘겼는데, 그러면 배포 폴더가 바뀔 때 어떤 명령이든 수강생 PC에서 실행된다. 지금은 **무결성을 확인한 배포 파일**과 공식 절차만 쓴다. 강사가 파일럿에서 공식 안내를 확인해 설치 파일을 `offline\`에 넣고 `certutil -hashfile <파일> SHA256`의 값을 `.sha256`으로 저장한다.

로그인은 스크립트가 하지 않는다. 수강생이 `claude`를 실행하고 브라우저에서 계정으로 로그인한다. 과정은 API Key를 쓰지 않으므로, 설정 전에 `ANTHROPIC_API_KEY`가 설정돼 있지 않은지 확인한다.

## 흔한 실패와 조치

| 증상 | 원인 | 조치 |
|---|---|---|
| `./setup.sh: bad interpreter` | `.sh`가 CRLF로 체크아웃됐다 | `sed -i 's/\r$//' setup.sh verify.sh` |
| `bootstrap.ps1`이 실행되지 않는다 | 실행 정책 | 명령에 `-ExecutionPolicy Bypass`가 있는지 확인한다 |
| JDK·Gradle 경로 오류 | 경로에 한글·공백이 있고 짧은 이름을 얻지 못했다 | 아래 「경로에 한글이나 공백이 있을 때」 |
| `winget`을 찾지 못한다 | Windows 버전이 낮거나 앱 설치 관리자가 없다 | `offline\`의 Git 설치 파일을 쓴다 |
| 의존성을 받지 못한다 | 프록시가 Maven Central을 막는다 | `offline\gradle-home\` 캐시를 배포한다 |
| 설치 권한이 없다 | 사내 보안 정책 | 교육 시간에 풀지 않는다. 대화형 Claude 경로로 참여한다 |

## 경로에 한글이나 공백이 있을 때

Downloads는 보통 사용자 폴더 아래이므로 **사용자 이름이 한글이면 경로에 한글이 들어간다**(`C:\Users\홍길동\Downloads\…`). OneDrive로 옮겨진 경우에는 `OneDrive - 회사`처럼 공백도 들어간다. 폴더를 옮기라고 요구하지 않고 스크립트가 처리한다.

1. `setup.sh`가 경로를 보고, 한글이나 공백이 있으면 `cygpath -ms`로 **같은 폴더의 짧은 이름(8.3)** 을 얻는다. 얻으면 그 이름으로 JDK·Gradle·캐시를 설치하고 `env.sh`에 그 경로를 적는다. `verify.sh`는 `env.sh`를 읽으므로 같은 경로를 쓴다.
2. 짧은 이름을 얻지 못하면(Windows의 8.3 이름 생성이 꺼져 있는 경우) **그 사실과 원인을 출력하고 계속 진행한다.** 이 조건에서 JDK·Gradle이 동작하는지는 **확인하지 않았다** — 실패하면 그 자리에서 알리고, 확실한 길은 배포 폴더를 `C:\tm`처럼 한글·공백 없는 경로에 풀어 다시 실행하는 것이다.
3. 읽기만 하는 `offline\`은 원래 경로에서 그대로 쓴다. 짧은 이름은 **빌드 도구가 쓸 경로**에만 적용한다.

**전역 환경은 건드리지 않는다** — JDK·Gradle·Gradle 캐시는 모두 배포 폴더 안(`tools\`)에 설치하고, 시스템 `PATH`·`JAVA_HOME`·사용자의 `~/.gradle`은 바꾸지 않는다. 배포 폴더를 지우면 환경이 함께 사라진다.

**대체 경로** — 20분에 끝나지 않으면 이어지는 **휴식 10분**에 계속한다. 그래도 준비되지 않으면 **대화형 Claude로 이후 실습에 참여한다.** 공식 경로이며 예외 처리가 아니다. 다만 그 경우 **실제 Java 빌드·Checkstyle·JUnit 실행은 수행되지 않는다** — 산출물에 실행 검증이 없다는 뜻이고, 수강생 본인이 그것을 알고 있어야 한다.

## 로컬 품질 게이트

검증 진입점은 **`./gradlew check` 하나**다. `project/build.gradle`이 컴파일·Checkstyle·JUnit을 모두 이 태스크에 매달아 두었다. 무엇이 매달려 있는지는 `./gradlew showGate`로 볼 수 있다.

- Linter는 **Checkstyle 하나**다. 규칙은 명명·import·공백·중괄호까지로 좁혔고 `severity=error`, `ignoreFailures=false`, `maxWarnings=0`이다 — 위반이 경고로 남아 통과하는 일이 없다.
- 이후 구현 실습에서 Claude Code는 각 수강생 PC에서 **생성 → `check` → 실패 수정 → 재검증**을 수행하고, PASS인 코드와 실행 증거를 남긴다.
- **이 과정은 CI 파이프라인을 만들지 않는다.** 모두 PASS여도 「CI 통과」가 아니라 **「로컬 품질 게이트 PASS」**다. 검사 설정이 저장소 안에 있고 진입점이 한 명령이므로, 나중에 CI를 붙이면 같은 명령을 호출하면 된다.

**게이트가 결함을 실제로 잡는지 확인** — `./verify.sh --prove`는 프로젝트 **복사본**에서 세 단계를 거친다. ① 손대지 않은 복사본이 `check`를 통과하는지 먼저 본다(기준선). ② 규칙을 어긴 코드(`samples/BadStyle.java.txt`)를 넣고 `checkstyleMain`이 실패하는지, **그 보고서가 그 파일의 위반을 지목했는지** 본다. ③ 틀린 기대값의 테스트(`samples/FailingTest.java.txt`)를 넣고 `test`가 실패하는지, **결과 XML에 그 테스트의 실패가 기록됐는지** 본다. 원본 프로젝트는 건드리지 않는다.

**명령이 실패했다는 사실만으로 검출 성공을 선언하지 않는다.** 컴파일 오류처럼 다른 이유로 멈춘 실패는 증거가 아니므로, 의도한 검사가 그 결함을 지목했는지까지 확인한다.

**`verify.sh`의 판정 근거** — 검사 전에 `project/build`를 지운다. 지난 실행이 남긴 클래스 파일과 보고서를 현재 결과로 읽으면 안 되기 때문이다. 최종 판정은 **이번 실행의 `./gradlew check` 종료 코드**와 이번 실행이 만든 보고서에만 근거한다. 보고서가 없는 항목은 **미검증**이고, 미검증이 남으면 전체를 PASS로 보고하지 않는다(종료 코드 2).

## 버전 조합

Java 21 LTS · Gradle Wrapper 9.9.2 · JUnit 6.1.3 · Checkstyle 14.4.0. 호환 근거와 확인 경위는 `courses/ai-native/course-design.md`의 공통 기술 전제에 있다.

Gradle Wrapper의 `gradlew`·`gradlew.bat`·`gradle-wrapper.jar`는 **생성물이므로 이 저장소에 없다.** `setup.sh`가 확인된 배포본으로 `gradle wrapper --gradle-version 9.9.2`를 한 번 실행해 만든다.

## 미검증 항목

작성 시점(2026-11-26)에 **Windows 실기에서 실행하지 못한 것**이다. 파일럿에서 확인한다.

- `bootstrap.ps1` 전체 — PowerShell 실행, winget 설치, 오프라인 설치 파일 실행, Git Bash 탐색
- `setup.sh`의 Windows 경로 처리 — `cygpath -ms`의 짧은 이름, JDK 압축 해제, `tools\` 경로
- **한글·공백이 든 Downloads 경로에서의 빌드** — 짧은 이름을 얻는 경우와 얻지 못하는 경우 모두 확인하지 않았다
- 탐색기 주소창의 `powershell`과 `Git Bash Here`가 교육장 PC에서 동작하는지, 내려받은 파일의 차단 해제가 필요한지
- Claude Code CLI의 설치와 로그인
- 사내 프록시·방화벽에서의 다운로드
- 20분 안에 끝나는지 — 시간 배분은 추정이다
