// "10. 기술 제약과 도메인 의미 보존"의 매핑을 옮긴 코드와 의미 보존 테스트.
// 실행(code/s10에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.MappingTest
package test;

import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.Money;
import delivery.Delivery;
import product.Product;
import product.ProductNumber;
import persistence.*;
import order.*;

public class MappingTest {
    public static void main(String[] args) throws Exception {
        var mapper = new OrderMapper();
        var pen = new Product(new ProductNumber("P-1"), new Money(1000));
        var order = new Order(new OrderNumber("O-1"),
                List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        order.onPaid(new Payment(new Money(2000), amount -> { }), new Delivery("D-1", number -> true));
        order.cancel();

        // 1. 라운드트립 — 저장했다가 복원해도 상태·단가·총액의 의미가 같다
        OrderRow row = mapper.toRow(order);
        check(row.status().equals("CANCELLING"));
        pen.changeSalePrice(new Money(1500));
        Order restored = mapper.toOrder(row);
        check(restored.status() == OrderStatus.CANCELLING);
        check(restored.totalAmount().equals(new Money(2000)));

        // 2. 복원도 불변 조건을 지킨다 — 항목 없는 행, 수량 0인 행은 주문이 되지 못한다
        rejects(() -> mapper.toOrder(new OrderRow("O-2", "PAID", "서울", List.of())));
        rejects(() -> mapper.toOrder(new OrderRow("O-3", "PAID", "서울", List.of(new ItemRow("P-1", 0, 1000)))));

        // 3. 모르는 상태 값은 기본값으로 바꾸지 않고 거절한다
        rejects(() -> mapper.toOrder(new OrderRow("O-4", "SHIPPED", "서울", List.of(new ItemRow("P-1", 1, 1000)))));

        // 4. 저장소를 바꿔도 주문 서비스의 계약은 같다
        var repository = new TableOrderRepository();
        var paid = new Order(new OrderNumber("O-5"), List.of(OrderItem.confirm(pen, new Quantity(1))), new Address("부산"));
        paid.onPaid(new Payment(new Money(1000), amount -> { }), new Delivery("D-5", number -> true));
        repository.save(paid);
        new OrderService(repository).onDeliveryStarted(new OrderNumber("O-5"));
        check(repository.findBy(new OrderNumber("O-5")).status() == OrderStatus.IN_DELIVERY);

        // 5. 구조 — 도메인 패키지는 persistence를 모른다
        for (String business : List.of("order", "payment", "delivery", "product"))
            try (var files = Files.list(Path.of(business))) {
                for (Path file : files.toList()) check(!Files.readString(file).contains("persistence"));
            }
        System.out.println("매핑 확인");
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
    static void rejects(Runnable action) {
        try { action.run(); } catch (RuntimeException expected) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
