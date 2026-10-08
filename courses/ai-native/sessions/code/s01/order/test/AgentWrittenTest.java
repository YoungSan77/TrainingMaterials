// "01. AI 협업의 특성과 사람의 판단 책임" — 첫 시도에서 에이전트가 결제 코드와 함께 만든 테스트다.
// 업무 규칙이 아니라 자기 코드의 동작을 기대값으로 삼았으므로 모두 통과한다(PayTest와 비교).
// 실행(code/s01/order에서): javac -encoding UTF-8 -d out $(find . -name "*.java") && java -cp out test.AgentWrittenTest
package test;

import order.OrderStatus;
import payment.Money;

public class AgentWrittenTest {
    public static void main(String[] args) {
        var approved = new PayTest.Fixture(true);
        approved.pay();
        check("승인되면 결제완료", approved.order.status() == OrderStatus.PAID);

        var rejected = new PayTest.Fixture(false);
        rejected.pay();
        check("거절되면 취소된다", rejected.order.status() == OrderStatus.CANCELLED);

        var priced = new PayTest.Fixture(true);
        priced.pay();
        check("결제 금액은 판매가 × 수량", priced.approvedAmount.equals(new Money(2_000)));
    }

    static void check(String name, boolean ok) {
        System.out.println((ok ? "통과  " : "실패  ") + name);
    }
}
