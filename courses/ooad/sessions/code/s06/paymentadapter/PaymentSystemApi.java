package paymentadapter;

// 결제 시스템이 정한 요청 형식. 이 형식은 결제 연동 밖으로 나가지 않는다.
public interface PaymentSystemApi {
    void request(String command, int amount);
}
