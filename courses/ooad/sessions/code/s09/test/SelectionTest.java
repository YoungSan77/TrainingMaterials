// "09. 설계 대안 평가"에서 선택한 대안(배송 대행사 선택기)을 옮긴 코드와 테스트.
// 실행(code/s09에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.SelectionTest
package test;

import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.PaymentGateway;
import payment.Money;
import delivery.CarrierSelector;
import delivery.DeliveryGateway;
import product.Product;
import product.ProductNumber;
import order.*;

public class SelectionTest {
    static final Product PEN = new Product(new ProductNumber("P-1"), new Money(1000));

    public static void main(String[] args) throws Exception {
        var requests = new ArrayList<String>();
        PaymentGateway fakePayment = amount -> requests.add("환불 " + amount.won());
        DeliveryGateway regular = number -> { requests.add("기존 대행사 출고 중단 " + number); return true; };
        DeliveryGateway sameDay = number -> { requests.add("당일 배송 픽업 취소 " + number); return true; };
        var selector = new CarrierSelector(regular, sameDay, "서울");

        // 선택 규칙 — 당일 배송 권역이면 당일 배송 대행사, 아니면 기존 대행사
        var seoul = newOrder("O-1", "서울 종로구");
        seoul.onPaid(new Payment(new Money(2000), fakePayment), selector.deliveryFor("D-1", "서울 종로구"));
        seoul.cancel();
        check(requests.equals(List.of("당일 배송 픽업 취소 D-1", "환불 2000")));

        requests.clear();
        var busan = newOrder("O-2", "부산 해운대구");
        busan.onPaid(new Payment(new Money(2000), fakePayment), selector.deliveryFor("D-2", "부산 해운대구"));
        busan.cancel();
        check(requests.equals(List.of("기존 대행사 출고 중단 D-2", "환불 2000")));

        // 선택의 결과만 달라지고 취소의 계약은 같다
        check(seoul.status() == OrderStatus.CANCELLING && busan.status() == OrderStatus.CANCELLING);

        // 구조 — 선택 규칙은 delivery 안에 있고, order는 선택기를 모른다
        for (String source : sources("order")) check(!source.contains("CarrierSelector"));
        for (String business : List.of("order", "payment", "delivery", "product"))
            for (String source : sources(business)) check(!source.contains("adapter"));
        System.out.println("선택 확인");
    }

    static Order newOrder(String number, String address) {
        return new Order(new OrderNumber(number), List.of(OrderItem.confirm(PEN, new Quantity(2))), new Address(address));
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
