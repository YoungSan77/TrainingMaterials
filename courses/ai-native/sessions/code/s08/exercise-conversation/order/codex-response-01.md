프로젝트 골격과 Gradle 빌드 구성을 만들었습니다.

- Java 17 도구체인, JUnit 5.11.4 및 JUnit Platform 테스트 실행 구성: [build.gradle](/private/tmp/s08-delegation/repo/build.gradle)
- 프로젝트 이름 설정: [settings.gradle](/private/tmp/s08-delegation/repo/settings.gradle)
- 문서 의존 규칙에 따른 7개 main/test 패키지 경로 생성 및 `check` 시 의존 규칙 검사 구성
- 업무 Java 코드는 추가하지 않았습니다.

빌드는 실행하지 않았습니다. 현재 오프라인 환경에서 필요한 항목은 다음입니다.

- Java 17 JDK (현재는 Java 26만 설치됨)
- Gradle 실행 도구 또는 Gradle Wrapper 배포 파일
- Maven Central의 `org.junit.jupiter:junit-jupiter:5.11.4` 및 전이 의존성

`git diff --check`도 통과했습니다.
