package paymentadapter;
import payment.Money;
import payment.PaymentDecision;
import payment.PaymentGateway;
import payment.PaymentMethod;

// 교육용 연결 구현. 실제 외부 프로토콜은 주입받은 연결 함수가 맡는다.
public final class PaymentAdapter implements PaymentGateway {
    private final PaymentGateway connection;
    public PaymentAdapter(PaymentGateway connection) { this.connection = connection; }
    public PaymentDecision requestApproval(Money amount, PaymentMethod method) {
        return connection.requestApproval(amount, method);
    }
}
