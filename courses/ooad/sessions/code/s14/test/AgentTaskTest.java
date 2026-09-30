// "14. AI-native SW공학" — 에이전트에게 맡긴 과제(중복 배송 시작 통보)를 하네스의 센서로 확인한다.
// 실행(code/s14에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.AgentTaskTest
package test;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import payment.Payment;
import payment.Money;
import paymentadapter.PaymentAdapter;
import deliveryadapter.DeliveryAdapter;
import samedaydeliveryadapter.SameDayDeliveryAdapter;
import delivery.CarrierSelector;
import delivery.DeliverySystem;
import product.Product;
import product.ProductNumber;
import persistence.*;
import order.*;

public class AgentTaskTest {
    public static void main(String[] args) throws IOException {
        // 센서 1. 회귀 — 앞 세션의 기대값이 그대로 초록이다
        FeedbackTest.main(args);

        // 센서 2. 의존 규칙 — 도메인(order)은 저장·연동 패키지를 모른다
        try (var files = Files.list(Path.of("order"))) {
            for (Path file : files.toList())
                for (String line : Files.readAllLines(file))
                    check(!line.matches("import (persistence|\\w*adapter)\\..*"));
        }

        // 조립 — FeedbackTest와 같다
        var carriers = new HashMap<String, DeliverySystem>();
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
        var o1 = new Order(new OrderNumber("O-1"), List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("부산"));
        o1.onPaid(new Payment(new Money(2000), paymentAdapter), selector.deliveryFor("D-1", "부산"));
        repository.save(o1);

        // 과제 — 배송 시스템이 배송 시작을 두 번 보내도 O-1은 한 번만 배송 중이 된다
        regular.receiveNotice("IN_TRANSIT", "O-1");
        regular.receiveNotice("IN_TRANSIT", "O-1");
        check(repository.rowOf(new OrderNumber("O-1")).status().equals("IN_DELIVERY"));
        System.out.println("과제 확인");
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
}
