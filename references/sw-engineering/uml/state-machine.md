# UML State Machine Baseline

State는 rounded rectangle, initial pseudostate는 filled circle, final state는 bull's-eye다. Transition은 source→target arrow이며 canonical label은 `event [guard] / action`이다. event는 trigger, guard는 boolean 조건, action/effect는 전이 결과다. `entry / ...`, `exit / ...`는 state 진입·이탈 때 실행된다. self-transition은 같은 state로 돌아오며 exit/entry semantics가 발생할 수 있다.

```notation-reference
{"id":"uml-state-machine","meaning":"lifecycle state와 event-triggered transition.","canonicalRepresentation":{"kind":"state","source":"[*] --> Pending\nPending --> Paid : paymentCompleted [amountValid] / recordPayment\nPaid --> [*]"},"commonProhibitedRealization":"event/guard/effect를 혼동하거나 process step을 모두 state로 만드는 것."}
```
```notation-reference
{"id":"uml-state-actions","meaning":"entry/exit action과 self-transition.","canonicalRepresentation":{"kind":"state","source":"state Pending {\n entry / startTimer\n exit / stopTimer\n}\nPending --> Pending : retry [attempts < 3] / increment"},"commonProhibitedRealization":"self-transition의 exit/entry를 무시하는 것."}
```
