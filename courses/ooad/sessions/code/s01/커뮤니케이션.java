// "01. OOAD 개요"의 「17. 커뮤니케이션 다이어그램」 예시 코드.
// 실행: javac -encoding UTF-8 커뮤니케이션.java

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
}

final class 주문 {
    private final java.util.List<주문항목> 항목들 = new java.util.ArrayList<>();
    void 주문항목을추가한다(상품 상품, int 수량) {
        항목들.add(new 주문항목(상품, 수량));
    }
}
