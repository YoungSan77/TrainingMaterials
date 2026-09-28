// "01. OOAD 개요"의 「18. 상태 기계 다이어그램·19. 요구에서 테스트로」 예시 코드.
// 실행: javac -encoding UTF-8 상태기계.java && java 주문테스트

enum 주문상태 { 결제대기, 결제완료, 배송중, 배송완료, 취소됨 }

final class 주문 {
    private 주문상태 상태 = 주문상태.결제대기;

    void 결제한다() { 전이(주문상태.결제대기, 주문상태.결제완료); }
    void 배송을시작한다() { 전이(주문상태.결제완료, 주문상태.배송중); }
    void 배송을완료한다() { 전이(주문상태.배송중, 주문상태.배송완료); }
    void 취소한다() { 전이(주문상태.결제완료, 주문상태.취소됨); }

    private void 전이(주문상태 출발, 주문상태 도착) {
        if (상태 != 출발)
            throw new IllegalStateException(상태 + "에서는 " + 도착 + "이 될 수 없다");
        상태 = 도착;
    }
}

class 주문테스트 {
    public static void main(String[] args) {
        var 배송중인주문 = new 주문();
        배송중인주문.결제한다();
        배송중인주문.배송을시작한다();
        거절(배송중인주문::취소한다);

        var 취소된주문 = new 주문();
        취소된주문.결제한다();
        취소된주문.취소한다();
        거절(취소된주문::결제한다);

        System.out.println("주문 규칙 확인");
    }

    static void 거절(Runnable 행위) {
        try { 행위.run(); } catch (IllegalStateException 기대한거절) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
