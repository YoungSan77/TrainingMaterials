package 배송연동;

import 배송.배송시스템;
import 주문.주문;

// 배송 시스템과 주고받는 형식을 주문 시스템의 의미로 옮긴다.
public final class 배송연동 implements 배송시스템 {
    private final 배송시스템API api;

    public 배송연동(배송시스템API api) { this.api = api; }

    @Override
    public boolean 출고중단을요청한다(String 배송번호) {
        return api.요청("STOP", 배송번호).equals("ACCEPTED");
    }

    // 배송 시스템의 통보를 주문의 사건으로 옮긴다.
    public void 통보를받는다(String 상태코드, 주문 주문) {
        if (상태코드.equals("DISPATCHED")) 주문.배송시작통보();
        // PICKING·PACKED 같은 배송 시스템 내부 상태는 주문으로 옮기지 않는다.
    }
}
