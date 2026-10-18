package paymentadapter;

import payment.Money;
import payment.PaymentGateway;
import payment.PaymentMethod;

// 결제 시스템과 통신하는 연동. 업무 패키지는 payment.PaymentGateway만 알고 이 클래스를 알지 않는다.
public class PaymentAdapter implements PaymentGateway {
    // 바깥으로 요청을 보내는 통로. 수업 환경에서는 결제 테스트 대역이 받는다.
    public interface Sender {
        String send(String request);
    }

    private final Sender sender;

    public PaymentAdapter(Sender sender) {
        this.sender = sender;
    }

    @Override
    public boolean requestApproval(Money amount, PaymentMethod method) {
        String response = sender.send("approval amount=" + amount.won() + " method=" + method.value());
        return "APPROVED".equals(response);
    }
}
