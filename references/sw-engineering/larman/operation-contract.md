# Larman Operation Contract Baseline

중요하거나 복잡하거나 결과가 미묘한 System Operation에만 선택한다. Shared Larman canonical form은 `Operation`, optional `Cross References`, `Preconditions`, `Postconditions`다.

- `Operation`: System Operation signature
- `Cross References`: 이 operation이 발생하는 Use Case 등 관련 context. 필요할 때만 쓴다.
- `Preconditions`: operation 실행 전 참이어야 하는 조건
- `Postconditions`: operation 실행 후 domain에서 참이 된 상태

Operation이 상태 변화를 만들고 Postconditions가 그 결과의 domain state를 명시하므로 별도 `State Change` artifact/node를 만들지 않는다. Course teaching subset은 목적에 따라 optional `Cross References`를 생략하고 `Operation`, `Preconditions`, `Postconditions`만 사용할 수 있다. Shared canonical form과 Course teaching subset은 동일한 범위일 필요가 없다.

```notation-reference
{"id":"larman-operation-contract","meaning":"System Operation signature, optional Use Case cross-reference, 실행 전 조건과 실행 후 domain truth.","canonicalRepresentation":{"kind":"text","source":"Operation: placeOrder(items)\nCross References: Use Case — Place Order (optional)\nPreconditions:\n- Customer is identified.\nPostconditions:\n- A new Order was created.\n- The Order was associated with the Customer."},"commonProhibitedRealization":"모든 operation에 강제하거나 optional Cross References를 필수화하거나 별도 State Change artifact를 추가하는 것."}
```
