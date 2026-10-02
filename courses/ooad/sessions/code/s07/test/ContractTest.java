// "07. 책임·협력·계약"의 정제된 설계를 옮긴 코드와 계약 테스트.
// 실행(code/s07에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.ContractTest
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

public class ContractTest {
    static final Product PEN = new Product(new ProductNumber("P-1"), new Money(1000));

    public static void main(String[] args) throws Exception {
        var requests = new ArrayList<String>();
        PaymentGateway fakePayment = amount -> requests.add("환불 " + amount.won());
        DeliveryGateway accepts = number -> { requests.add("출고 중단"); return true; };
        DeliveryGateway refuses = number -> { requests.add("출고 중단"); return false; };

        // 1. 사전조건 — 결제 전 주문은 취소를 거절하고 아무것도 요청하지 않는다
        var pending = newOrder("O-1");
        rejects(pending::cancel);
        check(pending.status() == OrderStatus.PENDING_PAYMENT && requests.isEmpty());

        // 2. 사전조건 — 출고 중단이 거절되면 환불을 요청하지 않고 상태도 그대로다
        var dispatched = newOrder("O-2");
        dispatched.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("D-2", refuses));
        rejects(dispatched::cancel);
        check(dispatched.status() == OrderStatus.PAID);
        check(requests.equals(List.of("출고 중단")));

        // 3. 사후조건 — 취소 처리 중이 되고, 출고 중단과 환불을 이 순서로 요청했다
        requests.clear();
        var paid = newOrder("O-3");
        paid.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("D-3", accepts));
        paid.cancel();
        check(paid.status() == OrderStatus.CANCELLING);
        check(requests.equals(List.of("출고 중단", "환불 2000")));

        // 4. 불변 조건 — 주문 항목 1개 이상, 수량 1 이상, 금액 0 이상
        rejects(() -> new Order(new OrderNumber("O-0"), List.of(), new Address("서울")));
        rejects(() -> new Quantity(0));
        rejects(() -> new Money(-1));

        // 5. 의존 역전 — 연동은 통보 약속(OrderNotice)만 알면 된다
        var notices = new ArrayList<OrderNumber>();
        OrderNotice fakeNotice = new OrderNotice() {
            public void onDeliveryStarted(OrderNumber number) { notices.add(number); }
            public void onRefundCompleted(OrderNumber number) { }
        };
        new DeliveryAdapter((command, number) -> "ACCEPTED", fakeNotice).receiveNotice("IN_TRANSIT", "O-3");
        check(notices.equals(List.of(new OrderNumber("O-3"))));

        // 6. 구조 — 연동은 OrderService를 import하지 않고, 업무 패키지는 연동을 import하지 않는다
        for (String adapter : List.of("paymentadapter", "deliveryadapter"))
            for (String source : sources(adapter)) check(!source.contains("import order.OrderService"));
        for (String business : List.of("order", "payment", "delivery", "product"))
            for (String source : sources(business))
                check(!source.contains("import paymentadapter") && !source.contains("import deliveryadapter"));
        System.out.println("계약 확인");
    }

    static Order newOrder(String number) {
        return new Order(new OrderNumber(number), List.of(OrderItem.confirm(PEN, new Quantity(2))), new Address("서울"));
    }
    static List<String> sources(String dir) throws Exception {
        try (var files = Files.list(Path.of(dir))) {
            var out = new ArrayList<String>();
            for (Path file : files.toList()) out.add(Files.readString(file));
            return out;
        }
    }
    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
    static void rejects(Runnable action) {
        try { action.run(); } catch (IllegalArgumentException | IllegalStateException expected) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
