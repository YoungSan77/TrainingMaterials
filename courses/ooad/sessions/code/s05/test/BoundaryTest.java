// "05. 구조적 경계와 의존성"의 패키지 경계와 의존 방향을 옮긴 코드와 테스트.
// 실행(code/s05에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.BoundaryTest
package test;

import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.PaymentGateway;
import payment.Money;
import delivery.Delivery;
import delivery.DeliveryGateway;
import deliveryadapter.DeliveryAdapter;
import deliveryadapter.DeliverySystemApi;
import order.Order;
import order.OrderStatus;

public class BoundaryTest {
    public static void main(String[] args) throws Exception {
        // 1. 연동 없이 주문 규칙을 검증한다 — 가짜 결제·배송 시스템
        var requests = new ArrayList<String>();
        PaymentGateway fakePayment = amount -> requests.add("환불 " + amount.won());
        DeliveryGateway fakeDelivery = number -> { requests.add("출고 중단"); return true; };

        var order = new Order();
        order.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("D-1", fakeDelivery));
        order.cancel();
        check(order.status() == OrderStatus.CANCELLING);
        check(requests.equals(List.of("출고 중단", "환불 2000")));

        // 2. 배송 연동은 외부 형식을 주문의 사건으로 변환한다
        var externalRequests = new ArrayList<String>();
        DeliverySystemApi api = (command, number) -> { externalRequests.add(command + " " + number); return "ACCEPTED"; };
        var adapter = new DeliveryAdapter(api);
        var shipped = new Order();
        shipped.onPaid(new Payment(new Money(1000), fakePayment), new Delivery("D-2", adapter));
        adapter.receiveNotice("PICKING", shipped);
        check(shipped.status() == OrderStatus.PAID);
        adapter.receiveNotice("IN_TRANSIT", shipped);
        check(shipped.status() == OrderStatus.IN_DELIVERY);

        // 3. 구조 제약 — 업무 패키지는 연동 패키지를 import하지 않는다
        for (String business : List.of("order", "payment", "delivery"))
            try (var files = Files.list(Path.of(business))) {
                for (Path file : files.toList()) {
                    String source = Files.readString(file);
                    check(!source.contains("import paymentadapter") && !source.contains("import deliveryadapter"));
                }
            }
        System.out.println("경계 확인");
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
}
