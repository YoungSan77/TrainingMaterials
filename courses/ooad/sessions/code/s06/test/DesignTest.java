// "06. 분석 모델에서 설계 모델로"의 초기 설계를 옮긴 코드와 의미 보존 테스트.
// 실행(code/s06에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.DesignTest
package test;

import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.PaymentGateway;
import payment.Money;
import delivery.Delivery;
import delivery.DeliveryGateway;
import deliveryadapter.DeliveryAdapter;
import product.Product;
import product.ProductNumber;
import order.*;

public class DesignTest {
    public static void main(String[] args) throws Exception {
        // 1. 의미 보존 — 단가는 주문 시점의 판매가, 주문 총액은 항목 금액의 합
        var pen = new Product(new ProductNumber("P-1"), new Money(1000));
        var order = new Order(new OrderNumber("O-1"),
                List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        pen.changeSalePrice(new Money(1500));
        check(order.totalAmount().equals(new Money(2000)));

        // 2. 의미 보존 — 주문 항목은 1개 이상, 수량은 1 이상
        rejects(() -> new Order(new OrderNumber("O-0"), List.of(), new Address("서울")));
        rejects(() -> new Quantity(0));

        // 3. 주문 서비스가 시스템 이벤트를 받아 주문에게 맡긴다
        var requests = new ArrayList<String>();
        PaymentGateway fakePayment = amount -> requests.add("환불 " + amount.won());
        DeliveryGateway fakeDelivery = number -> { requests.add("출고 중단"); return true; };
        var repository = new InMemoryOrderRepository();
        var service = new OrderService(repository);

        order.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("D-1", fakeDelivery));
        repository.save(order);
        service.cancelOrder(new OrderNumber("O-1"));
        check(repository.findBy(new OrderNumber("O-1")).status() == OrderStatus.CANCELLING);
        check(requests.equals(List.of("출고 중단", "환불 2000")));
        service.onRefundCompleted(new OrderNumber("O-1"));
        check(repository.findBy(new OrderNumber("O-1")).status() == OrderStatus.CANCELLED);

        // 4. 금지된 전이 — 배송 중인 주문은 취소할 수 없고 상태가 그대로다
        var deliveryAdapter = new DeliveryAdapter((command, number) -> "ACCEPTED", service);
        var shipped = new Order(new OrderNumber("O-2"),
                List.of(OrderItem.confirm(pen, new Quantity(1))), new Address("부산"));
        shipped.onPaid(new Payment(new Money(1500), fakePayment), new Delivery("D-2", deliveryAdapter));
        repository.save(shipped);
        deliveryAdapter.receiveNotice("IN_TRANSIT", "O-2");
        check(shipped.status() == OrderStatus.IN_DELIVERY);
        rejects(() -> service.cancelOrder(new OrderNumber("O-2")));
        check(shipped.status() == OrderStatus.IN_DELIVERY);

        // 5. 구조 제약 — 업무 패키지는 연동 패키지를 import하지 않는다
        for (String business : List.of("order", "payment", "delivery", "product"))
            try (var files = Files.list(Path.of(business))) {
                for (Path file : files.toList()) {
                    String source = Files.readString(file);
                    check(!source.contains("import paymentadapter") && !source.contains("import deliveryadapter"));
                }
            }
        System.out.println("설계 확인");
    }

    static final class InMemoryOrderRepository implements OrderRepository {
        private final Map<OrderNumber, Order> orders = new HashMap<>();

        public Order findBy(OrderNumber number) { return orders.get(number); }
        public void save(Order order) { orders.put(order.number(), order); }
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
    static void rejects(Runnable action) {
        try { action.run(); } catch (IllegalArgumentException | IllegalStateException expected) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
