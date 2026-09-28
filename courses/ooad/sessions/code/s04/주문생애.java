// "04. 동적 모델 — 상호작용과 상태"의 주문 취소 활동·시퀀스·커뮤니케이션·상태 기계를 옮긴 코드와 테스트.
// 실행: javac -encoding UTF-8 주문생애.java && java 주문생애테스트
import java.util.*;

record 금액(int 원) {}

enum 주문상태 { 결제대기, 결제완료, 배송중, 배송완료, 취소처리중, 취소됨 }

interface 배송시스템 { boolean 출고중단을요청한다(String 배송번호); }
interface 결제시스템 { void 환불을요청한다(금액 금액); }

final class 배송 {
    final String 배송번호;
    private final 배송시스템 배송시스템;

    배송(String 배송번호, 배송시스템 배송시스템) {
        this.배송번호 = 배송번호;
        this.배송시스템 = 배송시스템;
    }
    boolean 출고중단을요청한다() {
        return 배송시스템.출고중단을요청한다(배송번호);
    }
}

final class 환불 {
    private final 금액 환불금액;

    환불(금액 환불금액) { this.환불금액 = 환불금액; }
    void 요청한다(결제시스템 결제시스템) {
        결제시스템.환불을요청한다(환불금액);
    }
}

final class 결제 {
    final 금액 결제금액;
    private final 결제시스템 결제시스템;
    Optional<환불> 환불 = Optional.empty();

    결제(금액 결제금액, 결제시스템 결제시스템) {
        this.결제금액 = 결제금액;
        this.결제시스템 = 결제시스템;
    }
    void 환불을요청한다() {
        var 새환불 = new 환불(결제금액);
        환불 = Optional.of(새환불);
        새환불.요청한다(결제시스템);
    }
}

final class 주문 {
    private 결제 결제;
    private 배송 배송;
    주문상태 상태 = 주문상태.결제대기;

    void 결제되었다(결제 결제, 배송 배송) {
        전이(주문상태.결제대기, 주문상태.결제완료);
        this.결제 = 결제;
        this.배송 = 배송;
    }
    void 배송시작통보() { 전이(주문상태.결제완료, 주문상태.배송중); }
    void 배송완료통보() { 전이(주문상태.배송중, 주문상태.배송완료); }
    void 환불완료통보() { 전이(주문상태.취소처리중, 주문상태.취소됨); }

    void 취소한다() {
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

class 주문생애테스트 {
    public static void main(String[] args) {
        var 요청 = new ArrayList<String>();
        결제시스템 결제시스템 = 금액 -> 요청.add("환불 " + 금액.원());
        배송시스템 출고전 = 번호 -> 요청.add("출고 중단");

        var 주문 = new 주문();
        거절(주문::취소한다);
        주문.결제되었다(new 결제(new 금액(2000), 결제시스템),
                new 배송("배송-1", 출고전));
        주문.취소한다();
        확인(주문.상태 == 주문상태.취소처리중);
        확인(요청.equals(List.of("출고 중단", "환불 2000")));
        주문.환불완료통보();
        확인(주문.상태 == 주문상태.취소됨);

        var 배송중 = new 주문();
        배송중.결제되었다(new 결제(new 금액(1000), 결제시스템),
                new 배송("배송-2", 출고전));
        배송중.배송시작통보();
        거절(배송중::취소한다);
        System.out.println("주문 생애 확인");
    }

    static void 확인(boolean 조건) {
        if (!조건) throw new AssertionError("규칙 위반");
    }
    static void 거절(Runnable 행위) {
        try { 행위.run(); } catch (IllegalStateException 기대한거절) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
