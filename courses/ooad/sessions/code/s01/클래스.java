// "01. OOAD 개요"의 「14. 클래스 다이어그램」 예시 코드.
// 실행: javac -encoding UTF-8 클래스.java

import java.util.List;

final class 고객 {
    private final String 이름;
    고객(String 이름) { this.이름 = 이름; }
}

final class 주문 {
    private final String 주문번호;
    private final 고객 고객;
    private final List<주문항목> 항목들;
    주문(String 주문번호, 고객 고객, List<주문항목> 항목들) {
        if (항목들.isEmpty())
            throw new IllegalArgumentException("주문 항목은 1개 이상");
        this.주문번호 = 주문번호;
        this.고객 = 고객;
        this.항목들 = List.copyOf(항목들);
    }
}

final class 주문항목 {
    private final 상품 상품;
    private final int 수량;
    private final int 단가;
    주문항목(상품 상품, int 수량, int 단가) {
        if (수량 < 1)
            throw new IllegalArgumentException("수량은 1 이상");
        this.상품 = 상품;
        this.수량 = 수량;
        this.단가 = 단가;
    }
}

final class 상품 {
    private final String 상품명;
    private final int 판매가;
    상품(String 상품명, int 판매가) { this.상품명 = 상품명; this.판매가 = 판매가; }
}
