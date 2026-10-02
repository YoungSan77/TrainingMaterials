// "08. 변화 대응과 변이 설계"의 변경 요청을 옮긴 코드와 테스트.
// 실행(code/s08에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.ChangeTest
package test;

import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.PaymentGateway;
import payment.Money;
import delivery.Delivery;
import delivery.DeliveryGateway;
import samedaydeliveryadapter.SameDayDeliveryAdapter;
import product.Product;
import product.ProductNumber;
import order.*;

public class ChangeTest {
    static final Product PEN = new Product(new ProductNumber("P-1"), new Money(1000));

    public static void main(String[] args) throws Exception {
        var requests = new ArrayList<String>();
        PaymentGateway fakePayment = amount -> requests.add("환불 " + amount.won());

        // 변경 요청 1 — 결제 전 취소: 취소됨이 되고 외부에 아무것도 요청하지 않는다
        var pending = newOrder("O-1");
        pending.cancel();
        check(pending.status() == OrderStatus.CANCELLED && requests.isEmpty());

        // 변경 요청 1 — 결제 완료의 취소 계약은 그대로다
        DeliveryGateway accepts = number -> { requests.add("출고 중단"); return true; };
        var paid = newOrder("O-2");
        paid.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("D-2", accepts));
        paid.cancel();
        check(paid.status() == OrderStatus.CANCELLING);
        check(requests.equals(List.of("출고 중단", "환불 2000")));

        // 변경 요청 2 — 당일 배송 대행사: 새 연동만 더하고 주문·배송은 그대로 쓴다
        requests.clear();
        var notices = new ArrayList<OrderNumber>();
        OrderNotice fakeNotice = new OrderNotice() {
            public void onDeliveryStarted(OrderNumber number) { notices.add(number); }
            public void onRefundCompleted(OrderNumber number) { }
        };
        var sameDay = new SameDayDeliveryAdapter(id -> { requests.add("픽업 취소 " + id); return true; }, fakeNotice);
        var fast = newOrder("O-3");
        fast.onPaid(new Payment(new Money(2000), fakePayment), new Delivery("S-3", sameDay));
        fast.cancel();
        check(fast.status() == OrderStatus.CANCELLING);
        check(requests.equals(List.of("픽업 취소 S-3", "환불 2000")));
        sameDay.receiveEvent("OUT_FOR_DELIVERY", "O-4");
        check(notices.equals(List.of(new OrderNumber("O-4"))));

        // 구조 — 업무 패키지는 어느 연동도 import하지 않는다
        for (String business : List.of("order", "payment", "delivery", "product"))
            for (String source : sources(business))
                check(!source.contains("adapter"));
        System.out.println("변경 확인");
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
}
