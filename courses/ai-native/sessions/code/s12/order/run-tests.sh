#!/bin/sh
# 컴파일하고 JUnit 5 테스트(수용 테스트·의존 규칙 센서)를 모두 실행한다.
# JUnit은 code/s09/lib/에 둔다(git 제외). 없으면 Maven Central에서 받는다:
#   curl -L -o ../lib/junit-platform-console-standalone-1.13.4.jar \
#     https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.13.4/junit-platform-console-standalone-1.13.4.jar
cd "$(dirname "$0")"
JUNIT=../lib/junit-platform-console-standalone-1.13.4.jar
rm -rf out && javac -encoding UTF-8 -cp "$JUNIT" -d out $(find . -name "*.java" -not -path "./out/*") &&
  java -jar "$JUNIT" execute --class-path out --scan-class-path --disable-banner --disable-ansi-colors --details=tree 2>&1 | grep -v "^WARNING"
