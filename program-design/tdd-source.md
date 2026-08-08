# TDD 강의 소스 (교시 14 보강 정본)

> 교시 14(TDD로 설계 압력)의 코드·리팩토링 정본. Code는 이 소스로 14.js를 보강한다 — 즉석 생성 금지.
> 실습 도메인 = Order(TDD는 손으로 하는 절차). 시연 규칙 = R5·R6(취소·전이).
> 핵심 축: **Red-Green-Refactor**, 그리고 **리팩터의 방향은 RDD·GRASP·SOLID가 준다**(TDD는 안전망일 뿐).

---

## A. TDD가 무엇을 하나
- 테스트를 먼저 쓴다 → 실패(Red) → 통과 최소 구현(Green) → 구조 개선(Refactor). 한 사이클.
- **테스트가 인터페이스·계약을 앞에서 정한다** — 구현 전에 "무엇이 있어야 하고 무엇을 던져야 하나"가 선다. 이게 "설계 압력".
- 오해 교정: TDD는 테스트 기법이 아니라 **설계 기법**이다. 부산물로 테스트가 남을 뿐.

## B. 한 사이클 (R5·R6 — SHIPPED 이후 취소 불가, 전이는 전이표대로)

### Red — 실패하는 테스트 먼저
```java
@Test void cannotCancelAfterShipped() {
    Order o = anOrder(); o.pay(); o.ship();          // PENDING→PAID→SHIPPED
    assertThrows(CancelNotAllowed.class, o::cancel);  // cancel() 아직 없음 → 실패(Red)
}
```
- 계약이 선다: `cancel()`이 존재해야 하고, SHIPPED에서 `CancelNotAllowed`를 던져야 한다. **구현 전에 인터페이스가 정해졌다.**

### Green — 통과하는 최소 구현
```java
public void cancel() {
    if (status == SHIPPED || status == DELIVERED)
        throw new CancelNotAllowed(status);
    this.status = CANCELLED;         // 최소한만 — 일단 초록
}
```
- 아름답지 않아도 된다. 초록불이 먼저다. 조건이 인라인이고 전이가 setter처럼 직접이어도 지금은 통과가 목표.

### Refactor — 초록을 유지하며, 원칙이 가리키는 방향으로
```java
public void cancel() { transitionTo(CANCELLED); }
private void transitionTo(OrderStatus next) {      // 전이 규칙을 한 곳으로
    if (!ALLOWED.get(status).contains(next))
        throw new IllegalTransition(status, next);
    this.status = next;
}
```
- **왜 이 방향인가 — 리팩터의 나침반:**
  - **High Cohesion·Information Expert(GRASP)**: 전이 규칙을 상태를 가진 Order 한 곳(`transitionTo`)에 모은다.
  - **OCP(SOLID)**: 새 전이가 생겨도 `cancel()`·`pay()`를 안 고치고 전이표(ALLOWED)에 추가만.
  - **동작 불변, 구조 개선**: 테스트가 초록인 채로 옮겼다 — 깨지면 즉시 안다.

### codepair 배치
- 세 스냅샷(Red 테스트 / Green 구현 / Refactor 구현)을 대조. Green→Refactor를 codepair 2벌로 나란히 두고, marks로 "인라인 조건 → transitionTo 추출"을 짚는다.

## C. 핵심 — 원칙이 방향, 테스트가 안전망
- **어디로 리팩터할지 아는 것은 GRASP·SOLID 판단이다.** TDD가 그 판단을 대신하지 않는다.
- TDD가 주는 것: 그 이동을 **겁 없이** 할 안전망(초록이 깨지면 즉시 경보). 방향은 원칙이 준다.
- 이 분업(원칙=방향, 테스트=안전망)이 없으면 학습자는 "언제 멈추고 뭘 고칠지"를 감으로 한다.

## D. 한계·복선
- **한계**: TDD는 판단을 대체 못 한다 — 도구는 판단을 대체하지 않는다(프로그램 자세). 좋은 테스트도 나쁜 설계를 못 막는다, 방향이 없으면.
- **복선(forward-ref)**: 이 "원칙이 방향, 테스트가 안전망" 구도는 **아키텍처 과정의 스파게티→TS→리치 리팩토링에서 그대로 재등장한다** — 거기선 같은 나침반이 레이어·의존성 규칙으로 확장된다.

## 슬라이드 변환 지침
- A(설계 기법이다)로 열고, B를 Red-Green-Refactor 3스냅샷으로(codepair), C(나침반)를 강조 장으로, D로 닫는다.
- 코드는 폰트 낮춰서라도 실질. Refactor 장은 "왜 이 방향"의 원칙 3개를 반드시 붙인다 — 이게 이 교시의 핵심.
