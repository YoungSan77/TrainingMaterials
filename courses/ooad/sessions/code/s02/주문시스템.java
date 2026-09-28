// "02. 요구 분석과 유스케이스"의 SSD·오퍼레이션 계약 예시 코드 전체.
// 슬라이드는 이 파일에서 도식이 표현하는 부분만 발췌한다.
// 실행: javac -encoding UTF-8 주문시스템.java && java 결제계약테스트
import java.util.*;

final class 상품 {
    private final String 상품명;
    private final int 판매가;

    상품(String 상품명, int 판매가) { this.상품명 = 상품명; this.판매가 = 판매가; }
    int 판매가() { return 판매가; }
}

interface 주문시스템 {
    List<상품> 상품을조회한다(String 검색조건);
    void 장바구니에담는다(상품 상품, int 수량);
    void 배송지를지정한다(String 주소);
    void 결제한다(String 결제수단);
}

interface 상품시스템 {
    List<상품> 상품정보를조회한다(String 검색조건);
    boolean 재고차감을요청한다(상품 상품, int 수량);
}
interface 결제시스템 {
    String 결제승인을요청한다(int 금액, String 결제수단);
}
interface 배송시스템 {
    void 배송을요청한다(String 주문번호, String 배송지);
}
interface 회계시스템 {
    void 입금처리를요청한다(String 승인번호);
    void 영수증발행을요청한다(String 주문번호, String 승인번호);
}

record 외부시스템(상품시스템 상품, 결제시스템 결제, 배송시스템 배송, 회계시스템 회계) {}

final class 주문시스템구현 implements 주문시스템 {
    private final String 주문번호;
    private final 외부시스템 외부;
    private final Map<상품, Integer> 장바구니 = new LinkedHashMap<>();
    private String 배송지;
    String 상태 = "결제 대기", 승인번호;

    주문시스템구현(String 주문번호, 외부시스템 외부) {
        this.주문번호 = 주문번호;
        this.외부 = 외부;
    }
    public List<상품> 상품을조회한다(String 검색조건) {
        return 외부.상품().상품정보를조회한다(검색조건);
    }
    public void 장바구니에담는다(상품 상품, int 수량) {
        장바구니.merge(상품, 수량, Integer::sum);
    }
    public void 배송지를지정한다(String 주소) { 배송지 = 주소; }

    public void 결제한다(String 결제수단) {
        if (!상태.equals("결제 대기") || 배송지 == null) throw new IllegalStateException("사전조건 위반");
        int 금액 = 0;
        for (var 항목 : 장바구니.entrySet()) 금액 += 항목.getKey().판매가() * 항목.getValue();
        승인번호 = 외부.결제().결제승인을요청한다(금액, 결제수단);
        if (승인번호 == null) throw new IllegalStateException("승인 거절 — 정책 미확정");
        장바구니.forEach((상품, 수량) -> {
            if (!외부.상품().재고차감을요청한다(상품, 수량)) throw new IllegalStateException("재고 부족 — 정책 미확정");
        });
        외부.배송().배송을요청한다(주문번호, 배송지);
        외부.회계().입금처리를요청한다(승인번호);
        외부.회계().영수증발행을요청한다(주문번호, 승인번호);
        상태 = "결제 완료";
    }
}

// 요청을 기록하는 가짜 외부 시스템.
class 가짜외부 implements 상품시스템, 결제시스템, 배송시스템, 회계시스템 {
    final List<String> 요청 = new ArrayList<>();
    public List<상품> 상품정보를조회한다(String 조건) {
        return List.of(new 상품("펜", 1000));
    }
    public boolean 재고차감을요청한다(상품 상품, int 수량) {
        return 요청.add("재고 차감");
    }
    public String 결제승인을요청한다(int 금액, String 수단) {
        요청.add("결제 승인 " + 금액);
        return "승인-1";
    }
    public void 배송을요청한다(String 주문, String 배송지) { 요청.add("배송"); }
    public void 입금처리를요청한다(String 승인) { 요청.add("입금 처리"); }
    public void 영수증발행을요청한다(String 주문, String 승인) {
        요청.add("영수증 발행");
    }
}

class 결제계약테스트 {
    public static void main(String[] args) {
        var 가짜 = new 가짜외부();
        var 시스템 = new 주문시스템구현("주문-1", new 외부시스템(가짜, 가짜, 가짜, 가짜));
        시스템.장바구니에담는다(시스템.상품을조회한다("펜").get(0), 2);
        거절(() -> 시스템.결제한다("카드"));

        시스템.배송지를지정한다("서울");
        시스템.결제한다("카드");
        확인(시스템.상태.equals("결제 완료"));
        확인(가짜.요청.equals(List.of("결제 승인 2000", "재고 차감", "배송", "입금 처리", "영수증 발행")));
        System.out.println("결제 계약 확인");
    }

    static void 확인(boolean 조건) {
        if (!조건) throw new AssertionError("사후조건 위반");
    }
    static void 거절(Runnable 행위) {
        try { 행위.run(); } catch (IllegalStateException 기대한거절) { return; }
        throw new AssertionError("거절되어야 한다");
    }
}
