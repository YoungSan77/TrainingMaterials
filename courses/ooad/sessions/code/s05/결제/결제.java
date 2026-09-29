package 결제;

public final class 결제 {
    private final 금액 결제금액;
    private final 결제시스템 결제시스템;

    public 결제(금액 결제금액, 결제시스템 결제시스템) {
        this.결제금액 = 결제금액;
        this.결제시스템 = 결제시스템;
    }
    public void 환불을요청한다() {
        결제시스템.환불을요청한다(결제금액);
    }
}
