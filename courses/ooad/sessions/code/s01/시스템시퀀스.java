// "01. OOAD 개요"의 「15. 시스템 시퀀스 다이어그램」 예시 코드.
// 실행: javac -encoding UTF-8 시스템시퀀스.java

interface 주문시스템 {
    void 장바구니에담는다(String 상품, int 수량);
    void 배송지를지정한다(String 주소);
    void 결제한다(String 결제수단);
}
