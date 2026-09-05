# Larman Domain Model Baseline

Domain Model은 문제영역의 **conceptual perspective**다. conceptual class, attribute, meaningful association과 multiplicity를 사용하며 software class diagram이 아니다. method/operation, DB table, API/DTO, framework detail을 배제한다.

```notation-reference
{"id":"larman-domain-model","meaning":"conceptual class, attribute, association, multiplicity의 분석 모델.","canonicalRepresentation":{"kind":"class","source":"class Order {\n orderNumber\n date\n}\nclass Customer\nCustomer \"1\" -- \"0..*\" Order : places"},"commonProhibitedRealization":"operation/service/repository/DB/API/framework detail을 넣는 것."}
```

Description/Specification concept는 여러 instance가 공유하는 설명과 occurrence를 구분할 필요가 있을 때만 선택한다.

```notation-reference
{"id":"larman-description-class","meaning":"공유 description/specification과 occurrence 구분.","canonicalRepresentation":{"kind":"class","source":"ProductDescription \"1\" -- \"*\" SalesLineItem : describes"},"commonProhibitedRealization":"모든 개념에 specification class를 추가하는 것."}
```
