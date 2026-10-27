# 주문한다

외부 의존성 없이 설치된 JDK로 컴파일하고 테스트를 실행한다. Java 26을 사용하더라도 `--release 17`로 Java 17 호환 바이트코드를 만든다.

```sh
mkdir -p build/classes
javac --release 17 -d build/classes $(find src/main/java src/test/java -name '*.java')
java -ea -cp build/classes order.OrderApplicationServiceTest
```

테스트는 JUnit을 내려받지 않는 환경을 위해 `main` 메서드와 자체 검증 코드로 실행한다.
