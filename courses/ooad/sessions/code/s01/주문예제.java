// "01. OOAD 개요"의 모델·코드·테스트 관통 예제.
// 실행: javac -encoding UTF-8 -d /tmp/s01-code 주문예제.java
//       java -cp /tmp/s01-code 주문예제
// 외부 연동·저장·비동기 환불은 생략한 업무 규칙 예제다.
import java.util.List;
import java.util.ArrayList;

final class 고객 {
    private final String 이름;
    고객(String 이름) { this.이름 = 이름; }
}
final class 상품 {
    private final String 상품명;
    private final int 판매가;
    상품(String 상품명, int 판매가) { this.상품명 = 상품명; this.판매가 = 판매가; }
    int 판매가() { return 판매가; }
}
final class 주문항목 {
    private final 상품 상품;
    private final int 수량;
    private final int 단가;
    주문항목(상품 상품, int 수량) {
        if (수량 < 1) throw new IllegalArgumentException("수량은 1 이상");
        this.상품 = 상품;
        this.수량 = 수량;
        this.단가 = 상품.판매가();
    }
    int 금액을구한다() { return 단가 * 수량; }
}
enum 주문상태 { 결제대기, 결제완료, 배송중, 배송완료, 취소됨 }
final class 주문 {
    private final String 주문번호;
    private final 고객 고객;
    private final List<주문항목> 항목들;
    private 주문상태 상태 = 주문상태.결제대기;
    주문(String 주문번호, 고객 고객, List<주문항목> 항목들) {
        if (항목들.isEmpty()) throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.주문번호 = 주문번호;
        this.고객 = 고객;
        this.항목들 = List.copyOf(항목들);
    }
    int 총액을구한다() {
        int 합계 = 0;
        for (주문항목 항목 : 항목들) 합계 += 항목.금액을구한다();
        return 합계;
    }
    void 결제한다() { 전이(주문상태.결제대기, 주문상태.결제완료); }
    void 배송을시작한다() { 전이(주문상태.결제완료, 주문상태.배송중); }
    void 배송을완료한다() { 전이(주문상태.배송중, 주문상태.배송완료); }
    void 취소한다() { 전이(주문상태.결제완료, 주문상태.취소됨); }
    주문상태 상태() { return 상태; }
    private void 전이(주문상태 출발, 주문상태 도착) {
        if (상태 != 출발) throw new IllegalStateException("허용되지 않은 상태 전이");
        상태 = 도착;
    }
}
interface 주문시스템 {
    void 장바구니에담는다(String 상품, int 수량);
    void 배송지를지정한다(String 주소);
    void 결제한다(String 결제수단);
}
// SSD 경계 호출의 실행 확인용 대역이다. 실제 결제·배송을 구현하지 않는다.
final class 주문시스템대역 implements 주문시스템 {
    private final List<String> 호출 = new ArrayList<>();
    public void 장바구니에담는다(String 상품, int 수량) { 호출.add(상품 + " " + 수량); }
    public void 배송지를지정한다(String 주소) { 호출.add(주소); }
    public void 결제한다(String 결제수단) { 호출.add(결제수단); }
    List<String> 호출기록() { return List.copyOf(호출); }
}
class 주문예제 {
    static 주문 예시주문() {
        return new 주문("주문-001", new 고객("고객1"),
            List.of(new 주문항목(new 상품("펜", 1000), 2)));
    }
    public static void main(String[] args) {
        var 경계 = new 주문시스템대역();
        경계.장바구니에담는다("펜", 2);
        경계.배송지를지정한다("서울");
        경계.결제한다("카드");
        같음(List.of("펜 2", "서울", "카드"), 경계.호출기록());
        var 주문 = 예시주문();
        같음(2000, 주문.총액을구한다());
        주문.결제한다();
        주문.취소한다();
        같음(주문상태.취소됨, 주문.상태());
        배송중취소거절();
        var 취소된주문 = 예시주문();
        취소된주문.결제한다();
        취소된주문.취소한다();
        거절(IllegalStateException.class, 취소된주문::결제한다);
        같음(주문상태.취소됨, 취소된주문.상태());
        var 배송완료주문 = 예시주문();
        배송완료주문.결제한다();
        배송완료주문.배송을시작한다();
        배송완료주문.배송을완료한다();
        거절(IllegalStateException.class, 배송완료주문::취소한다);
        같음(주문상태.배송완료, 배송완료주문.상태());
        거절(IllegalArgumentException.class,
            () -> new 주문("주문-001", new 고객("고객1"), List.of()));
        거절(IllegalArgumentException.class,
            () -> new 주문항목(new 상품("펜", 1000), 0));
        System.out.println("예시 주문: 2,000원 / 경계 호출·상태 전이·거절 뒤 상태 유지·다중성 PASS");
    }
    static void 배송중취소거절() {
        var 주문 = 예시주문();
        주문.결제한다();
        주문.배송을시작한다();
        거절(IllegalStateException.class, 주문::취소한다);
        같음(주문상태.배송중, 주문.상태());
    }
    static void 같음(Object 기대, Object 실제) {
        if (!기대.equals(실제)) throw new AssertionError(기대 + " != " + 실제);
    }
    static void 거절(Class<? extends RuntimeException> 예외, Runnable 행위) {
        try { 행위.run(); }
        catch (RuntimeException e) {
            if (예외.isInstance(e)) return;
            throw e;
        }
        throw new AssertionError("거절되어야 한다");
    }
}
