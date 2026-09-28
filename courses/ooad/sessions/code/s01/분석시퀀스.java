// "01. OOAD 개요"의 「16. 분석 시퀀스 다이어그램」 예시 코드.
// 실행: javac -encoding UTF-8 분석시퀀스.java

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
        this.상품 = 상품;
        this.수량 = 수량;
        this.단가 = 상품.판매가();
    }
    int 금액() { return 단가 * 수량; }
}

final class 주문 {
    private final java.util.List<주문항목> 항목들 = new java.util.ArrayList<>();
    void 주문항목을추가한다(상품 상품, int 수량) {
        항목들.add(new 주문항목(상품, 수량));
    }
    int 총액을구한다() {
        int 합계 = 0;
        for (주문항목 항목 : 항목들) 합계 += 항목.금액();
        return 합계;
    }
}
