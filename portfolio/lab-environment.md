# 실습 환경 셋업 명세 — Windows 포터블 번들

## 위상
- 네 과정 공통 실습 환경. **오프라인·무설치·무관리자권한**. 수강생은 압축 풀고 실행만.
- 스택은 순수 JVM(Java·Gradle·JUnit·ArchUnit·커스텀 린터) — 컨테이너 불필요.
- 편집기는 제외한다. 수강생이 쓰던 편집기로 빈칸을 채우고, 번들은 **빌드·검증만** 책임진다.
- 강의장은 **오픈 환경(사내 백신·방화벽 없음)** 전제. 그래서 사전 점검은 긴 경로 하나로 족하다.

## 번들 구성
```
order-labs/                 # 이 폴더 전체를 zip
├─ jdk/                     # Windows x64 JDK 21 (설치 아님, 압축 해제만)
├─ .gradle-cache/           # 오프라인 의존성 캐시 (GRADLE_USER_HOME)
├─ project/
│  ├─ src/main/java/...     # 스파게티/TS/리치 3벌 + 빈칸
│  ├─ src/test/java/...     # ArchUnit 룰 · 캡슐화 린터 룰 · 유닛 테스트
│  ├─ build.gradle
│  ├─ gradlew.bat
│  └─ gradle/wrapper/...
├─ run.bat                  # 진입점
└─ README.txt              # 3단계 안내
```

`run.bat` (경로를 박지 않는다 — 어디에 풀어도 동작):
```bat
@echo off
set "JAVA_HOME=%~dp0jdk"
set "GRADLE_USER_HOME=%~dp0.gradle-cache"
cd /d "%~dp0project"
call gradlew.bat test --offline
pause
```

## 저작자 굽기 절차 (한 번, 온라인 1회만)
1. **JDK 동봉**: Temurin(Adoptium) Windows x64 **zip**을 받아 `jdk/`에 압축 해제. (설치본 아님)
2. **의존성 캐시 굽기**: 프로젝트에서 아래를 한 번 실행 — 이때만 인터넷.
   ```
   set GRADLE_USER_HOME=..\.gradle-cache
   gradlew.bat test        (--offline 없이, 온라인)
   ```
   의존성과 Gradle 배포본이 `.gradle-cache/`에 담긴다.
3. **오프라인 검증**: 인터넷을 끊고 `run.bat` 실행 → `--offline`으로 빌드가 성공해야 완성.
4. **패키징**: `order-labs/` 전체를 zip. 이게 배포물.

굽기 총비용 ≈ 반나절. 이후 매 강의 재배포는 zip 복사만.

## 수강생 3단계 (README.txt)
1. zip을 **`C:\labs` 처럼 짧은 경로**에 압축 해제. (긴 경로는 Gradle 캐시에서 오류 — 바탕화면 깊은 폴더 금지)
2. `run.bat` **더블클릭**. (오픈 환경·백신 없음 전제. 개인 PC에서 SmartScreen이 뜨면 "추가 정보 → 실행")
3. 콘솔 확인:
   - `BUILD SUCCESSFUL` = 초록. 빈칸을 옳게 채웠고 규칙을 통과했다.
   - `BUILD FAILED` = 빨강. 어느 룰(의존 방향/캡슐화/테스트)이 왜 깨졌는지 메시지에 나온다.

## 검증 게이트 (test 태스크가 함께 실행)
- **ArchUnit**: 도메인이 프레임워크·adapter를 import하면 실패(의존 방향).
- **캡슐화 커스텀 린터**: 도메인에 `@Setter`·`@Data`·public setter·`@AllArgsConstructor`가 있으면 실패(빈혈 회귀 차단).
- **유닛 테스트**: R1~R7 규칙과 상태 전이가 옳게 동작하는지.
- 셋을 다 통과해야 초록. "완성하여 통과하는 코드" 실습의 실체가 이 게이트다.

## MSA 예외 처리
- MSA 실습의 브로커·DB는 **인메모리 스텁**으로 번들 안에서 오프라인 성립:
  - 메시지 = 인메모리 큐(발행/구독을 같은 프로세스에서), Outbox = 인메모리 테이블.
  - Repository = 인메모리 맵.
- 실제 브로커/외부 DB는 쓰지 않는다 — 교육 목적엔 스텁으로 충분하고, 번들의 무설치·오프라인을 지킨다.

## 실패 조건 · 사전 체크리스트
- **긴 경로**: `C:\labs` 등 짧은 경로에 풀게 안내(README 첫 줄). 안 지키면 캐시 경로 오류.
- **네이티브 의존성 금지**: OS별 `.dll` 섞이면 캐시가 깨진다 — JVM 전용 라이브러리만 사용(JUnit·ArchUnit·Gradle). 이 전제가 지켜지는 한 안전.
- **다른 JDK 간섭**: `run.bat`이 `JAVA_HOME`을 번들 JDK로 강제하므로 PC에 다른 자바가 있어도 무관.

## 갱신
- JDK·의존성 버전을 올릴 때만 재굽기(온라인 1회 → 재zip).
- 교재 코드만 바뀌면 `project/`만 교체, 캐시·JDK는 유지.
