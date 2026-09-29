package 주문;

import 결제.결제;
import 배송.배송;

public final class 주문 {
    private 주문상태 상태 = 주문상태.결제대기;
    private 결제 결제;
    private 배송 배송;

    public 주문상태 상태() { return 상태; }

    public void 결제되었다(결제 결제, 배송 배송) {
        전이(주문상태.결제대기, 주문상태.결제완료);
        this.결제 = 결제;
        this.배송 = 배송;
    }
    public void 배송시작통보() { 전이(주문상태.결제완료, 주문상태.배송중); }
    public void 환불완료통보() { 전이(주문상태.취소처리중, 주문상태.취소됨); }

    public void 취소한다() {
        if (상태 != 주문상태.결제완료)
            throw new IllegalStateException(상태 + "에서는 취소할 수 없다");
        if (!배송.출고중단을요청한다())
            throw new IllegalStateException("이미 출고되었다");
        결제.환불을요청한다();
        전이(주문상태.결제완료, 주문상태.취소처리중);
    }

    private void 전이(주문상태 출발, 주문상태 도착) {
        if (상태 != 출발)
            throw new IllegalStateException(상태 + "에서는 " + 도착 + "이 될 수 없다");
        상태 = 도착;
    }
}
