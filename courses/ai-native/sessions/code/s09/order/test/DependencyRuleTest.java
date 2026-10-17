// "09. 검증 하네스·결과 점검·피드백" — 의존 규칙 센서. 실패 메시지가 고치는 방법을 함께 알려 준다.
// 실행(code/s09/order에서): ./run-tests.sh
package test;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class DependencyRuleTest {
    // 업무 패키지는 업무 규칙을 담고, 바깥 패키지는 외부 시스템·저장과 통신한다.
    static final List<String> BUSINESS = List.of("order", "payment", "delivery", "product");
    static final Map<String, String> OUTSIDE = Map.of(
            "paymentadapter", "payment.PaymentGateway",
            "persistence", "order.OrderRepository");

    @Test @DisplayName("업무 패키지는 연동·영속을 import하지 않는다")
    void businessDependsOnInterfacesOnly() {
        List<String> violations = new ArrayList<>();
        imports().forEach((source, imported) -> {
            if (!BUSINESS.contains(packageOf(source))) return;
            for (String target : imported)
                if (OUTSIDE.containsKey(packageOf(target)))
                    violations.add(source + " → " + target + "\n"
                            + "    고치는 방법: " + packageOf(source) + "는 " + OUTSIDE.get(packageOf(target))
                            + " 인터페이스에 의존하고, " + packageOf(target) + "의 객체는 생성자로 받는다.");
        });
        assertTrue(violations.isEmpty(), "업무 패키지가 연동·영속을 import했다:\n  "
                + String.join("\n  ", violations));
    }

    @Test @DisplayName("패키지 의존에 순환이 없다")
    void noPackageCycle() {
        Map<String, Set<String>> graph = new TreeMap<>();
        imports().forEach((source, imported) -> imported.stream()
                .filter(target -> !packageOf(target).equals(packageOf(source)))
                .forEach(target -> graph.computeIfAbsent(packageOf(source), key -> new TreeSet<>())
                        .add(packageOf(target))));
        for (String start : graph.keySet()) {
            List<String> cycle = pathBackTo(start, start, graph, new LinkedHashSet<>());
            assertNull(cycle, "패키지 의존이 순환한다: " + cycle + "\n"
                    + "    고치는 방법: 한 방향의 의존만 남기고, 되돌아오는 호출은 인터페이스로 뒤집는다.");
        }
    }

    // 소스가 선언한 타입 하나가 import하는 이 저장소의 타입들. 키·값은 패키지를 포함한 이름이다.
    static Map<String, List<String>> imports() {
        Map<String, List<String>> imports = new TreeMap<>();
        Pattern declaration = Pattern.compile("(?m)^package\\s+([\\w.]+);");
        Pattern importLine = Pattern.compile("(?m)^import\\s+(?:static\\s+)?([\\w.]+);");
        try (Stream<Path> files = Files.walk(Paths.get("."))) {
            for (Path file : files.filter(path -> path.toString().endsWith(".java")).toList()) {
                String source = Files.readString(file);
                Matcher declared = declaration.matcher(source);
                if (!declared.find()) continue;
                String type = declared.group(1) + "." + file.getFileName().toString().replace(".java", "");
                List<String> targets = importLine.matcher(source).results()
                        .map(result -> result.group(1))
                        .filter(name -> BUSINESS.contains(packageOf(name)) || OUTSIDE.containsKey(packageOf(name)))
                        .toList();
                imports.put(type, targets);
            }
        } catch (IOException cannotRead) {
            fail("소스를 읽을 수 없다. code/s09/order에서 실행한다: " + cannotRead.getMessage());
        }
        return imports;
    }

    static String packageOf(String type) {
        return type.substring(0, type.lastIndexOf('.'));
    }

    // start로 돌아오는 경로가 있으면 그 경로를, 없으면 null을 돌려준다.
    static List<String> pathBackTo(String start, String current, Map<String, Set<String>> graph,
            LinkedHashSet<String> visited) {
        if (!visited.add(current)) return null;
        for (String next : graph.getOrDefault(current, Set.of())) {
            if (next.equals(start)) {
                List<String> cycle = new ArrayList<>(visited);
                cycle.add(start);
                return cycle;
            }
            List<String> cycle = pathBackTo(start, next, graph, visited);
            if (cycle != null) return cycle;
        }
        visited.remove(current);
        return null;
    }
}
