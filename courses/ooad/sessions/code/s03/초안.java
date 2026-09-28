// "03. 정적 모델 — 도메인 개념과 관계"의 도메인 모델 초안을 옮긴 코드.
// 실행: javac -encoding UTF-8 초안.java
import java.util.List;

class 고객 { 장바구니 장바구니; }
class 장바구니 { List<장바구니항목> 항목들; }
class 장바구니항목 { 상품 상품; }
class 상품 {}
class 주문 { 고객 고객; List<주문항목> 항목들; 결제 결제; 배송 배송; }
class 주문항목 { 상품 상품; }
class 결제 { 환불 환불; }
class 환불 {}
class 배송 {}
