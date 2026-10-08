// "02. 작업 특성에 따른 AI 활용 방식" 시연 — 주문 금액의 수용 테스트. 기대값은 업무 규칙(docs/business-rule.md)에서 왔다.
// 실행(order-demo에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.AmountTest
package test;

import java.util.List;
import order.*;
import payment.Money;
import product.*;

public class AmountTest {
    static int failed = 0;

    public static void main(String[] args) {
        // 펜 2개, 판매가 1,000원 → 주문 금액 2,000원
        var pen = new Product(new ProductNumber("P-PEN"), new Money(1_000));
        var order = new Order(List.of(OrderItem.confirm(pen, new Quantity(2))));
        check("주문 금액은 단가 × 수량의 합", order.totalAmount().equals(new Money(2_000)));

        // 주문 뒤 판매가가 1,200원으로 바뀌어도 주문 금액은 2,000원
        pen.changeSalePrice(new Money(1_200));
        check("판매가가 바뀌어도 주문 금액은 그대로", order.totalAmount().equals(new Money(2_000)));

        if (failed > 0) System.exit(1);
    }

    static void check(String name, boolean ok) {
        if (!ok) failed++;
        System.out.println((ok ? "통과  " : "실패  ") + name);
    }
}
