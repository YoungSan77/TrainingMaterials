# UML Activity Baseline

Action은 rounded rectangle, control flow는 arrow, initial은 filled circle, final은 bull's-eye다. Decision은 하나의 incoming을 guard별 alternative outgoing으로 나누고 Merge는 alternatives를 합치는 diamond다. Fork는 하나를 concurrent flows로 나누고 Join은 concurrent flows를 동기화하는 thick bar다. diamond와 bar를 서로 대신하지 않는다. 책임과 action/control semantics가 없는 일반 Process Flowchart 대용으로 남용하지 않는다.

```notation-reference
{"id":"uml-activity-decision","meaning":"action/control flow와 decision/merge.","canonicalRepresentation":{"kind":"activity","source":"start\n:Validate order;\nif (valid?) then (yes)\n :Accept;\nelse (no)\n :Reject;\nendif\nstop"},"commonProhibitedRealization":"decision을 fork처럼 쓰거나 일반 flowchart로 남용하는 것."}
```
```notation-reference
{"id":"uml-activity-concurrency","meaning":"fork와 join에 의한 병행과 동기화.","canonicalRepresentation":{"kind":"activity","source":"fork\n :Reserve inventory;\nfork again\n :Authorize payment;\nend fork"},"commonProhibitedRealization":"배타 선택을 fork/join으로 표현하는 것."}
```
