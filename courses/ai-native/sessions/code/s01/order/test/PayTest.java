// "01. AI 협업의 특성과 사람의 판단 책임" — 공통 전제의 규칙을 기대값으로 LLM 초안(OrderService.pay)을 확인한다.
// 실행(code/s01/order에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.PayTest
// 초안은 세 가지를 추측했으므로 세 테스트가 실패하는 것이 기대 결과다.
package test;

import java.util.*;
import delivery.*;
import order.*;
import payment.*;
import product.*;

public class PayTest {
    static int failed = 0;

    public static void main(String[] args) {
        // 승인되면 결제완료 — 초안도 지킨다
        var approved = new Fixture(true);
        approved.pay();
        check("승인되면 결제완료", approved.order.status() == OrderStatus.PAID);

        // ① 단가는 주문 시점에 확정한다 — 주문 뒤 판매가가 1,200원으로 바뀌어도 결제 금액은 2,000원
        var priced = new Fixture(true);
        priced.pen.changeSalePrice(new Money(1_200));
        priced.pay();
        check("결제 금액은 확정한 단가로 2,000원", priced.approvedAmount.equals(new Money(2_000)));

        // ② 배송 요청은 결제 승인 뒤에만
        var rejected = new Fixture(false);
        rejected.pay();
        check("거절되면 배송을 요청하지 않는다", rejected.deliveryRequests == 0);

        // ③ 결제가 거절되면 결제대기를 유지한다
        check("거절되면 결제대기 유지", rejected.order.status() == OrderStatus.PENDING_PAYMENT);

        System.out.println(failed == 3 ? "기대대로 초안의 추측 세 곳에서 실패" : "실패 " + failed + "건");
    }

    static void check(String name, boolean ok) {
        if (!ok) failed++;
        System.out.println((ok ? "통과  " : "실패  ") + name);
    }

    // 주문 O-1 — 펜 2개, 판매가 1,000원, 총액 2,000원, 배송지 서울
    static class Fixture implements OrderRepository, ProductGateway, PaymentGateway, DeliveryGateway {
        final Product pen = new Product(new ProductNumber("P-PEN"), new Money(1_000));
        final Order order = new Order(new OrderNumber("O-1"),
                List.of(OrderItem.confirm(pen, new Quantity(2))), new Address("서울"));
        final boolean approve;
        Money approvedAmount;
        int deliveryRequests;

        Fixture(boolean approve) { this.approve = approve; }

        void pay() { new OrderService(this, this, this, this).pay(order.number(), new PaymentMethod("카드")); }

        public Order findBy(OrderNumber number) { return order; }
        public void save(Order o) {}
        public Money salePriceOf(ProductNumber number) { return pen.salePrice(); }
        public boolean requestApproval(Money amount, PaymentMethod method) { approvedAmount = amount; return approve; }
        public void requestDelivery(String orderNumber, Address address) { deliveryRequests++; }
    }
}
