// "11. 통합 설계와 적정 모델링"의 통합 — 주문 O-1의 취소가 요구부터 저장·연동까지 이어지는지 확인한다.
// 실행(code/s11에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.IntegrationTest
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

public class IntegrationTest {
    public static void main(String[] args) {
        // 조립 — 외부 시스템은 요청을 기록하는 가짜 API다
        var external = new ArrayList<String>();
        var carriers = new HashMap<String, DeliveryGateway>();
        var paymentApi = (paymentadapter.PaymentSystemApi) (command, amount) -> external.add(command + " " + amount);
        var repository = new TableOrderRepository(new OrderMapper(new DeferredPayment(), carriers));
        var service = new OrderService(repository);
        var paymentAdapter = new PaymentAdapter(paymentApi, service);
        DeferredPayment.target = paymentAdapter;
        var regular = new DeliveryAdapter((command, number) -> { external.add(command + " " + number); return "ACCEPTED"; }, service);
        var sameDay = new SameDayDeliveryAdapter(id -> { external.add("cancelPickup " + id); return true; }, service);
        carriers.put("REGULAR", regular);
        carriers.put("SAME_DAY", sameDay);
        var selector = new CarrierSelector(regular, sameDay, "서울");

        // 요구 — 고객이 결제한 주문 O-1(펜 2개, 서울)을 취소한다
        var pen = new Product(new ProductNumber("P-1"), new Money(1000));
        var o1 = new Order(new OrderNumber("O-1"), List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        o1.onPaid(new Payment(new Money(2000), paymentAdapter), selector.deliveryFor("D-1", "서울"));
        repository.save(o1);

        // 시스템 오퍼레이션 — 저장소에서 다시 읽은 O-1을 취소한다
        service.cancelOrder(new OrderNumber("O-1"));
        check(external.equals(List.of("cancelPickup D-1", "REFUND 2000")));
        check(repository.rowOf(new OrderNumber("O-1")).status().equals("CANCELLING"));

        // 외부 통보 — 환불 완료가 오면 취소됨으로 저장된다
        paymentAdapter.receiveNotice("REFUNDED", "O-1");
        check(repository.rowOf(new OrderNumber("O-1")).status().equals("CANCELLED"));

        // 저장된 대행사 — 선택 규칙이 바뀌어도 이미 정한 대행사는 그대로다
        check(repository.rowOf(new OrderNumber("O-1")).carrier().equals("SAME_DAY"));
        System.out.println("통합 확인");
    }

    // 결제 연동은 주문 서비스가 있어야 만들 수 있고, 매퍼는 결제 약속이 있어야 만들 수 있다.
    // 조립 순서의 고리를 끊기 위한 테스트용 위임.
    static final class DeferredPayment implements payment.PaymentGateway {
        static payment.PaymentGateway target;
        public void requestRefund(Money amount) { target.requestRefund(amount); }
    }

    static void check(boolean condition) {
        if (!condition) throw new AssertionError("규칙 위반");
    }
}
