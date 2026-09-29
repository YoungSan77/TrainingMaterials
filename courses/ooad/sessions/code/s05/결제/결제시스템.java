package 결제;

// 결제 경계가 소유하는 요청 인터페이스. 결제 연동이 구현한다.
public interface 결제시스템 {
    void 환불을요청한다(금액 금액);
}
