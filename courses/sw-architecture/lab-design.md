# SW 아키텍처 실습 설계 (자산 형식 원본)

## 이 문서의 위상
- 아키텍처 부2·3의 실습을 코드까지 완전히 내린 것. 나머지 3과정(OOAD·DDD·MSA)은 이 **형식**을 복제한다.
- Order 도메인 하나로 관통. 코드는 핵심 로직만(프레임워크 배선 생략).

## 실습 3층 (대상 혼합 대응)
| 층 | 대상 | 활동 |
|---|---|---|
| 판단 | 전원 | 도표·상태표로 "규칙이 어디 살아야 하나" 결정 |
| **코드 대면** | 전원(비코더 포함) | 코드를 **읽고 비교**. 규칙이 어디로 갔는지 손가락으로 짚는다 |
| 코드 작성 | 코더 | 같은 전환을 빈칸 채우기로 직접 리팩터링 |
- 코드 대면 층이 핵심 표적 장치다: "스파게티가 당연"하다 아는 척 주도하는 부류는 판단 도표에선 "그건 안다"며 빠져나가지만, 자기가 옹호하던 코드를 리치 옆에 놓고 보면 빠져나갈 데가 없다.

## 두 대조 방식
- **(a) 스니펫 대조 — 기본**: 전환 한 조각을 두 버전으로. 짧고 많게. 물음 = "이 규칙이 어디로 갔나".
- **(b) 통짜 대조 — 보강**: 유스케이스 하나를 3벌(스파게티/TS/리치)로. 세션 매듭에서. 물음 = "왜 이 구조가 이기나".
- 흐름: (a) 여러 개로 조각을 심고 → 매듭에서 (b) 하나로 "조각들이 한 몸이 된다"를 보인다.

---

## 부 2 · 스파게티 → TS (5–7교시)
전환의 본질 = **구조·일관성**(규칙은 아직 서비스에). (a)는 "인프라·흐름·경계가 어디로 정리됐나".

### (a) 스니펫 쌍

**쌍 2-1 · 영속성이 어디로 갔나**
```java
// 스파게티 — 컨트롤러에 DB·흐름·응답이 다 있다
Object place(Req req) {
    var rows = jdbc.query("SELECT * FROM orders WHERE ...");   // DB 직접
    // 검증·계산·INSERT 인라인
    jdbc.update("INSERT INTO orders ...");
    return rows;                                               // row 그대로 응답
}
```
```java
// TS — 영속성은 Repository 뒤, 경계는 DTO
OrderDto execute(PlaceOrderCommand cmd) {          // application
    Order o = new Order(cmd.customerId(), cmd.lines());
    repository.save(o);                            // SQL은 adapter 구현에
    return OrderDto.from(o);
}
```
짚기: DB 접근이 컨트롤러 → Repository 뒤로. 응답이 row → DTO로. 규칙은 아직 안 옮겼다(의도).

**쌍 2-2 · 흐름이 어디로 갔나** — 스파게티: 한 컨트롤러 메서드에 검증·계산·저장·응답 뒤엉킴 → TS: `PlaceOrderScript` 하나의 절차로 정렬. (코드 형식은 2-1과 동형, 흐름 정리에 초점)

**쌍 2-3 · 경계가 어디로 갔나** — 스파게티: 도메인/row를 그대로 노출 → TS: `OrderDto`로 변환해 도메인 유출 차단.

### (b) 통짜 대조 (부2 매듭, 2벌)
- 유스케이스: **AddOrderLine**. 스파게티(컨트롤러 통짜) vs TS(Script+Repository+DTO). 
- 물음: 기능은 같은데 무엇이 어디로 갔나 — 짜임새가 유지보수에 무엇을 주나.

---

## 부 3 · TS → 리치 (8–12교시)
전환의 본질 = **규칙이 서비스 → 애그리거트로 이동, 의존 역전**. (a)는 "이 규칙(R#)이 어디로 갔나".

### (a) 스니펫 쌍

**쌍 3-1 · R4(라인 변경은 PENDING만)가 어디로 갔나**
```java
// TS — 규칙이 서비스 if에
void execute(AddLineCommand c) {                   // application
    Order o = repository.findById(c.orderId());
    if (o.getStatus() != PENDING)                  // R4 — 서비스에
        throw new IllegalStateException("modify only when PENDING");
    o.getLines().add(new OrderLine(c.product(), c.qty(), c.price()));
    repository.save(o);
}
```
```java
// 리치 — 규칙이 애그리거트에
void execute(AddLineCommand c) {                   // application — 흐름만
    Order o = repository.findById(c.orderId());
    o.addLine(c.product(), c.qty(), c.price());     // 규칙은 안으로
    repository.save(o);
}
// Order (domain) — R4 소유
void addLine(ProductId p, Quantity q, Money price) {
    if (status != PENDING) throw new OrderModificationNotAllowed(status);  // R4
    lines.add(new OrderLine(p, q, price));          // R2는 Quantity VO가 이미 보장
}
```
짚기: R4 검사가 서비스 메서드 → `Order.addLine` 안으로. 이제 **어느 경로로 라인을 추가해도** R4가 강제된다. R2는 `Quantity` VO 생성자가 이미 지킨다(서비스가 몰라도 됨).

**쌍 3-2 · R5·R6(취소·전이)가 어디로 갔나**
```java
// TS — 상태 분기 + setter가 서비스에
void execute(OrderId id) {
    Order o = repository.findById(id);
    if (o.getStatus() == SHIPPED || o.getStatus() == DELIVERED)  // R5
        throw new IllegalStateException("too late");
    o.setStatus(CANCELLED);                         // 전이가 밖에서 (setter)
    repository.save(o);
}
```
```java
// 리치 — 전이 규칙이 애그리거트에, setter 소멸
void execute(OrderId id) {
    Order o = repository.findById(id);
    o.cancel();                                     // R5·R6 안으로
    repository.save(o);
}
// Order (domain)
void cancel() {
    if (status == SHIPPED || status == DELIVERED)   // R5
        throw new CancelNotAllowed(status);
    transitionTo(CANCELLED);                        // R6
}
private void transitionTo(OrderStatus next) {       // R6 소유 — 전이표
    if (!ALLOWED.get(status).contains(next))
        throw new IllegalTransition(status, next);
    this.status = next;
}
```
짚기: **setter가 사라진 게 핵심.** 상태는 이제 전이 메서드로만 바뀐다 — 불법 전이(R6) 경로가 원천 차단.

**쌍 3-3 · R1(합계)가 어디로 갔나** — TS: 서비스가 라인 순회 합산 → 리치: `order.total()`이 `Money` VO로 반환. 계산 지식이 서비스 → 애그리거트로.

**쌍 3-4 · 의존이 어디로 뒤집혔나(포트)**
```java
// TS — 서비스가 구체 결제에 결합
class PayOrderScript {
    KakaoPayClient pay = new KakaoPayClient();      // 구체 new — 밖을 안다
    void execute(OrderId id) { /* ... */ pay.charge(amount); }
}
```
```java
// 리치 — 포트로 역전 (DIP)
interface PaymentPort { PaymentResult charge(Money amount); }   // application(안)
class PayOrderUseCase {
    private final PaymentPort payment;              // 인터페이스에 의존
    void execute(OrderId id) {
        Order o = repository.findById(id);
        if (payment.charge(o.total()).isSuccess())  // R1 사용
            o.markPaid();                           // PENDING→PAID (R6)
        repository.save(o);
    }
}
// KakaoPayAdapter implements PaymentPort           // adapter(밖)
```
짚기: 결제 구체 클래스가 서비스 안 `new` → `PaymentPort` 뒤로. **의존 방향이 뒤집혔다** = 12교시 재정박(포트=DIP). Application이 인터페이스를 소유, adapter가 구현.

### (b) 통짜 3벌 (부3 매듭) · 유스케이스 = CancelOrder
R5·R6가 다 걸려 대조가 가장 선명하다.
```java
// 스파게티 — 컨트롤러 통짜
Object cancel(String id) {
    var row = jdbc.query("SELECT status FROM orders WHERE id=?", id);
    String s = row.get("status");
    if (s.equals("SHIPPED") || s.equals("DELIVERED")) return error("too late");
    if (s.equals("CANCELLED")) return error("already");
    jdbc.update("UPDATE orders SET status='CANCELLED' WHERE id=?", id);
    return ok();                        // 규칙·DB·응답 전부 여기
}
```
```java
// TS — 구조는 정리, 규칙은 서비스
void execute(OrderId id) {
    Order o = repository.findById(id);
    if (o.getStatus() == SHIPPED || o.getStatus() == DELIVERED)
        throw new IllegalStateException("too late");    // R5 서비스에
    o.setStatus(CANCELLED);                             // 전이 밖에서
    repository.save(o);
}
```
```java
// 리치 — 규칙은 애그리거트, 흐름만 유스케이스
void execute(OrderId id) {
    Order o = repository.findById(id);
    o.cancel();                                         // R5·R6 안으로
    repository.save(o);
}
```
물음(전원): 세 벌 다 "주문을 취소한다". 규칙(R5·R6)이 각각 어디 사는가? 새 규칙(예: PAID 취소 시 환불 이벤트)이 생기면 어느 벌이 가장 적게 다치나?

---

## 코더 층 (빈칸 채우기)
- (a)마다: TS 스니펫을 주고 **리치 애그리거트 메서드의 빈칸**을 채우게. 예 — `Order.cancel()`의 R5 가드와 `transitionTo` 호출만 비워 제공.
- (b)마다: 유스케이스 하나(예: Ship — R7 결제 선행)를 TS까지만 주고 **리치로 직접 리팩터링**.
- 정적 검사를 초록불 게이트로(부3):
  - ArchUnit — 도메인이 프레임워크·adapter를 import하면 실패(의존 방향).
  - **캡슐화 커스텀 린터 — 도메인에 `@Setter`·`@Data`·public setter·`@AllArgsConstructor`가 있으면 빌드 실패.** 빈혈 회귀를 원천 차단.
  - 순서: **코드 대면에서 "setter가 왜 빈혈을 부르나"를 먼저 눈으로** → 그다음 게이트가 못 어기게 잠근다(룰부터 주면 이해 없이 우회). 비코더는 위반 전/후 도표로 이해, 룰 실행은 코더 층.

## Order 코드 자산 목록 (준비물)
- 스니펫 쌍: 2-1~2-3(부2), 3-1~3-4(부3) = 7쌍. 각 2~3벌.
- 통짜: AddOrderLine(2벌), CancelOrder(3벌), Ship(코더용 미완성 1벌) = 3세트.
- 공유: 이 자산은 네 과정이 같은 Order를 쓰니 재사용된다(OOAD 개념·DDD 경계·MSA 분해가 같은 코드를 다른 렌즈로).

## 나머지 3과정 복제 지침
- **형식만 복제**: 3층 + (a)기본/(b)보강 + 코더 빈칸. 내용은 각 과정 렌즈로.
- OOAD: (a) = 절차적 코드 vs 책임 분배(GRASP), 규칙 이동이 아니라 책임 이동. (b) = 유스케이스 하나를 절차 vs 객체 협력.
- DDD: 코드 대면보다 **모델 대면**(스토밍 결과·애그리거트 도표 비교)이 (a). 코드는 최소.
- MSA: (a) = 인프로세스 이벤트 vs 메시지, 로컬 호출 vs 원격 포트. (b) = 한 유스케이스를 모놀리스 vs 서비스 분리.
