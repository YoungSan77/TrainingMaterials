// "12. 구현·검증·DevOps와 SW공학 피드백" — 운영에서 본 증상(중복 환불 통보)을 테스트로 먼저 재현한다.
// 실행(code/s12에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.FeedbackTest
package test;

import java.util.*;
import payment.Payment;
import payment.Money;
import paymentadapter.PaymentAdapter;
import deliveryadapter.DeliveryAdapter;
import samedaydeliveryadapter.SameDayDeliveryAdapter;
import delivery.CarrierSelector;
import delivery.DeliveryGateway;
import product.Product;
import product.ProductNumber;
import persistence.*;
import order.*;

public class FeedbackTest {
    public static void main(String[] args) {
        // 1. 회귀 — 리팩터링 뒤에도 통합 테스트가 초록이다
        IntegrationTest.main(args);

        // 조립 — IntegrationTest와 같다
        var carriers = new HashMap<String, DeliveryGateway>();
        var repository = new TableOrderRepository(new OrderMapper(new IntegrationTest.DeferredPayment(), carriers));
        var service = new OrderService(repository);
        var paymentAdapter = new PaymentAdapter((command, amount) -> {}, service);
        IntegrationTest.DeferredPayment.target = paymentAdapter;
        var regular = new DeliveryAdapter((command, number) -> "ACCEPTED", service);
        var sameDay = new SameDayDeliveryAdapter(id -> true, service);
        carriers.put("REGULAR", regular);
        carriers.put("SAME_DAY", sameDay);
        var selector = new CarrierSelector(regular, sameDay, "서울");

        var pen = new Product(new ProductNumber("P-1"), new Money(1000));
        var o1 = new Order(new OrderNumber("O-1"), List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        o1.onPaid(new Payment(new Money(2000), paymentAdapter), selector.deliveryFor("D-1", "서울"));
        repository.save(o1);
        service.cancelOrder(new OrderNumber("O-1"));

        // 2. 중복 통보 — 결제 시스템이 환불 완료를 두 번 보내도 O-1은 한 번만 취소됨이 된다
        paymentAdapter.receiveNotice("REFUNDED", "O-1");
        paymentAdapter.receiveNotice("REFUNDED", "O-1");
        check(repository.rowOf(new OrderNumber("O-1")).status().equals("CANCELLED"));
        System.out.println("피드백 확인");
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
}
