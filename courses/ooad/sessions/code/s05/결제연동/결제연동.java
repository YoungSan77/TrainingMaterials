package 결제연동;

import 결제.결제시스템;
import 결제.금액;
import 주문.주문;

// 결제 시스템과 주고받는 형식을 주문 시스템의 의미로 옮긴다.
public final class 결제연동 implements 결제시스템 {
    private final 결제시스템API api;

    public 결제연동(결제시스템API api) { this.api = api; }

    @Override
    public void 환불을요청한다(금액 금액) {
        api.요청("REFUND", 금액.원());
    }

    // 결제 시스템의 환불 통보를 주문의 사건으로 옮긴다.
    public void 통보를받는다(String 결과코드, 주문 주문) {
        if (결과코드.equals("REFUNDED")) 주문.환불완료통보();
    }
}
