package order;

import payment.PaymentGateway;
import paymentadapter.CardPaymentAdapter;

/**
 * 의존 규칙을 어긴 예. 주문이 결제 연동을 직접 조립한다.
 * src/main/java에 넣고 gradle check를 돌리면 dependencyRules가 막는다(README).
 */
public final class PaymentAssembly {
    public PaymentGateway paymentGateway() {
        return new CardPaymentAdapter();
    }
}
