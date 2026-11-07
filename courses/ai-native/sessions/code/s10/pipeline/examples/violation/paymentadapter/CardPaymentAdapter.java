package paymentadapter;

import payment.CardApprovalRequest;
import payment.CardApprovalResult;
import payment.PaymentGateway;

/** 결제 포트의 연동 구현. 연동이 업무 포트를 아는 것은 허용된 방향이다. */
public final class CardPaymentAdapter implements PaymentGateway {

    @Override
    public CardApprovalResult approve(CardApprovalRequest request) {
        throw new UnsupportedOperationException("개발 환경에서는 호출하지 않는다");
    }
}
