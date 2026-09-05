# UML Deployment Baseline

Node는 runtime resource인 3D box다. 필요하면 hardware `«device»`와 software container `«executionEnvironment»`를 구분한다. Artifact는 deployable physical piece다. Deployment relation은 artifact→target node `«deploy»` dependency, communication path는 node 사이 solid line이다. logical component structure와 physical/runtime structure를 혼동하지 않는다.

```notation-reference
{"id":"uml-deployment","meaning":"artifact의 physical/runtime node 배치.","canonicalRepresentation":{"kind":"deployment","source":"node \"App Host\" <<device>> {\n node \"JVM\" <<executionEnvironment>>\n}\nartifact \"order-service.jar\"\n\"order-service.jar\" ..> \"JVM\" : <<deploy>>"},"commonProhibitedRealization":"logical component structure를 physical topology로 부르는 것."}
```
```notation-reference
{"id":"uml-deployment-communication","meaning":"node 사이 communication path.","canonicalRepresentation":{"kind":"deployment","source":"node \"App Host\"\nnode \"DB Host\"\n\"App Host\" -- \"DB Host\" : TLS"},"commonProhibitedRealization":"class association을 communication path로 쓰는 것."}
```
