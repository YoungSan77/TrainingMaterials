#!/bin/sh
# 수용 테스트를 컴파일·실행한다.
rm -rf out && javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.AmountTest
