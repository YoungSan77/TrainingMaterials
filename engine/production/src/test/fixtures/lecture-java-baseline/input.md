### 1. MVC (Model-View-Controller) 패턴과 Presentation 계층

현대 백엔드(REST API) 환경에서 MVC는 시스템 전체를 관통하는 아키텍처가 아니라, 클라이언트의 요청을 수신하고 응답을 반환하는 **표현 계층(Presentation Layer) 내부의 역할을 분리하는 디자인 패턴**이다.

- **Controller:** HTTP 요청을 수신하여 입력값을 검증하고, 하위 계층(Service/UseCase)으로 비즈니스 로직 수행을 위임하는 흐름 제어(Routing)를 담당한다.
- **Model:** 하위 계층으로 전달하거나(Request DTO), 하위 계층으로부터 반환받아 화면에 맞게 가공한 데이터 객체(Response DTO)다. 비즈니스 로직을 포함하지 않는다.
- **View:** 서버 사이드 렌더링(JSP, Thymeleaf)이 아닌 현대적인 REST API 기반 구조에서는, JSON 등 직렬화된 응답 데이터 포맷 자체가 클라이언트(프론트엔드/모바일) 측으로 이관된 View의 역할을 대체한다.

이어지는 모든 아키텍처 스타일의 진입점은 이 **MVC 패턴의 Controller**가 담당한다.

### 2. 공통 인프라, 도메인 모델 및 DTO (Common Context)

모든 아키텍처 스타일은 아래의 데이터베이스 스키마와 영속성 인터페이스, 도메인 모델 및 공통 요청 DTO를 기본적으로 공유한다. (단, Anemic Domain Model 스타일은 예외적으로 빈약한 모델을 사용한다.)

#### 2.1 공통 인프라 (DB Schema & MyBatis)

SQL

```
CREATE TABLE products (id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), stock INT);
CREATE TABLE orders (id BIGINT AUTO_INCREMENT PRIMARY KEY, status VARCHAR(50));

```

Java

```
@Mapper
public interface ProductMapper {
    @Select("SELECT * FROM products WHERE id = #{id}")
    ProductEntity findById(Long id);
    @Update("UPDATE products SET stock = #{stock} WHERE id = #{id}")
    void updateStock(@Param("id") Long id, @Param("stock") int stock);
}

```

#### 2.2 공통 도메인 모델 (Rich Domain Model)

Java

```
// domain/Product.java (Layered(Rich), Hexagonal, Clean 아키텍처에서 공통 사용)
public class Product {
    private Long id;
    private int stock;

    public Product(Long id, int stock) { 
        this.id = id; 
        this.stock = stock; 
    }

    // 객체 스스로가 비즈니스 로직(상태 변경)을 캡슐화하여 처리
    public void decreaseStock(int quantity) {
        if (this.stock < quantity) throw new IllegalStateException("재고 부족");
        this.stock -= quantity;
    }
    
    public Long getId() { return id; }
    public int getStock() { return stock; }
}

```

#### 2.3 공통 요청 DTO

Java

```
// presentation/dto/OrderRequest.java (Layered, Hexagonal 아키텍처에서 공통 사용)
@Getter
public class OrderRequest {
    private Long productId;
    private int quantity;
}

```

### 3. Layered Architecture (Anemic Domain Model & Transaction Script)

데이터(상태)와 로직(행위)이 분리되어, 도메인은 데이터만 담고(Anemic) Service가 모든 비즈니스 로직을 통제(Transaction Script)한다.

**디렉토리 구조**

Plaintext

```
src/main/java/com/example/order
├── presentation           // [MVC 계층] Controller 존재
│   └── OrderController.java
├── service                // [비즈니스 계층] Service 로직 집중
│   └── OrderService.java
├── domain                 // [Anemic 도메인] Entity
│   └── ProductEntity.java
└── infrastructure         // [영속성 계층] Mapper
    └── mapper
        └── ProductMapper.java

```

**주요 구현 코드**

Java

```
// 3-1. Domain (Anemic - 로직 없음, 상태만 존재)
@Getter @Setter
public class ProductEntity {
    private Long id;
    private int stock;
}

// 3-2. Controller (MVC - Presentation)
@RestController
public class OrderController {
    private final OrderService orderService; // 구체 클래스 직접 주입

    @PostMapping("/orders")
    public void placeOrder(@RequestBody OrderRequest request) {
        orderService.placeOrder(request.getProductId(), request.getQuantity());
    }
}

// 3-3. Service (Business)
@Service
@Transactional
public class OrderService {
    private final ProductMapper productMapper;

    public void placeOrder(Long productId, int quantity) {
        ProductEntity product = productMapper.findById(productId);
        
        // Service가 비즈니스 규칙(재고 판단 및 차감)을 직접 통제
        if (product.getStock() < quantity) throw new IllegalStateException("재고 부족");
        product.setStock(product.getStock() - quantity);
        
        productMapper.updateStock(product.getId(), product.getStock());
    }
}

```

### 4. Layered Architecture (Rich Domain Model)

비즈니스 로직을 도메인 객체가 담당하며, Service는 흐름만 제어하는 오케스트레이터 역할을 수행한다.

**디렉토리 구조**

Plaintext

```
src/main/java/com/example/order
├── presentation           // [MVC 계층] Controller
│   └── OrderController.java
├── application            // [비즈니스 계층] 흐름 제어(Orchestrator)
│   └── OrderService.java
├── domain                 // [Rich 도메인] 비즈니스 로직 포함
│   └── Product.java       // (2.2 공통 모델 참조)
└── infrastructure         // [영속성 계층] Repository
    └── repository
        └── ProductRepository.java

```

**주요 구현 코드**

Java

```
// 4-1. Repository Interface (Domain/Infrastructure)
public interface ProductRepository {
    Product findById(Long id);
    void save(Product product);
}

// 4-2. Controller (MVC - Presentation)
@RestController
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/orders")
    public void placeOrder(@RequestBody OrderRequest request) {
        orderService.placeOrder(request.getProductId(), request.getQuantity());
    }
}

// 4-3. Service (Application)
@Service
@Transactional
public class OrderService {
    private final ProductRepository productRepository;

    public void placeOrder(Long productId, int quantity) {
        Product product = productRepository.findById(productId);
        
        // 검증 및 상태 변경 로직을 Rich Domain 객체에게 위임
        product.decreaseStock(quantity); 
        
        productRepository.save(product);
    }
}

```

### 5. Hexagonal Architecture (Ports and Adapters)

Service(코어)는 외부 기술을 모르며 내부 포트(인터페이스)만 제공한다. MVC Controller는 인바운드 어댑터로서 이 포트를 호출한다.

**디렉토리 구조**

Plaintext

```
src/main/java/com/example/order
├── domain                            // [Rich 도메인]
│   └── Product.java
├── application                       // [코어 계층]
│   ├── port
│   │   ├── in                        // Inbound Port
│   │   │   └── PlaceOrderUseCase.java
│   │   └── out                       // Outbound Port
│   │       └── ProductPort.java
│   └── service
│       └── OrderService.java         // Port 구현체
└── adapter                           // [어댑터 계층]
    ├── in
    │   └── web                       // [MVC 계층]
    │       └── OrderController.java
    └── out
        └── persistence               // [DB 계층]
            └── ProductPersistenceAdapter.java

```

**주요 구현 코드**

Java

```
// 5-1. Inbound Port (인터페이스)
public interface PlaceOrderUseCase {
    void placeOrder(Long productId, int quantity);
}

// 5-2. Outbound Port (인터페이스)
public interface ProductPort {
    Product load(Long productId);
    void save(Product product);
}

// 5-3. Controller (MVC - Inbound Adapter)
@RestController
public class OrderController {
    private final PlaceOrderUseCase placeOrderUseCase; // 인터페이스(Port)에 의존

    @PostMapping("/orders")
    public void placeOrder(@RequestBody OrderRequest request) {
        placeOrderUseCase.placeOrder(request.getProductId(), request.getQuantity());
    }
}

// 5-4. Service (Application Core)
@Service
@Transactional
public class OrderService implements PlaceOrderUseCase { // Inbound Port 구현
    private final ProductPort productPort; // 인터페이스(Outbound Port)에 의존

    @Override
    public void placeOrder(Long productId, int quantity) {
        Product product = productPort.load(productId);
        product.decreaseStock(quantity); // Rich Domain 로직 활용
        productPort.save(product);
    }
}

```

### 6. Clean Architecture

Hexagonal과 구조는 유사하나, 계층 간 통신 시 **반드시 DTO를 사용하여** 도메인 모델이 외부(Controller, DB Mapper)로 누출되는 것을 철저히 차단한다.

**디렉토리 구조**

Plaintext

```
src/main/java/com/example/order
├── domain                            // [Entity 계층]
│   └── Product.java
├── application                       // [UseCase 계층]
│   ├── dto                           // 유스케이스 전용 DTO
│   │   ├── OrderRequestDto.java
│   │   └── OrderResponseDto.java
│   ├── port
│   │   ├── in
│   │   │   └── PlaceOrderUseCase.java
│   │   └── out
│   │       └── OrderRepository.java
│   └── service
│       └── PlaceOrderInteractor.java // UseCase 구현체
└── interface_adapter                 // [Adapter 계층]
    ├── controller                    // [MVC 계층]
    │   └── OrderController.java
    └── gateway                       // 영속성 구현체
        └── OrderMybatisGateway.java

```

**주요 구현 코드**

Java

```
// 6-1. UseCase DTOs
@Getter
public class OrderRequestDto {
    private Long productId;
    private int quantity;
}

@Getter @AllArgsConstructor
public class OrderResponseDto {
    private Long productId;
    private String status;
}

// 6-2. Outbound Port
public interface OrderRepository {
    Product findById(Long productId);
    void save(Product product);
}

// 6-3. Inbound Port
public interface PlaceOrderUseCase {
    OrderResponseDto placeOrder(OrderRequestDto request);
}

// 6-4. Controller (MVC - Interface Adapter)
@RestController
public class OrderController {
    private final PlaceOrderUseCase placeOrderUseCase; // 인터페이스 의존

    @PostMapping("/orders")
    public OrderResponseDto placeOrder(@RequestBody OrderRequestDto request) {
        // 도메인 유출 방지. 철저히 DTO로만 통신
        return placeOrderUseCase.placeOrder(request); 
    }
}

// 6-5. Service (UseCase Interactor)
@Service
@Transactional
public class PlaceOrderInteractor implements PlaceOrderUseCase {
    private final OrderRepository orderRepository; 

    @Override
    public OrderResponseDto placeOrder(OrderRequestDto request) {
        Product product = orderRepository.findById(request.getProductId());
        product.decreaseStock(request.getQuantity());
        
        orderRepository.save(product);
        
        // 반환값 역시 순수 도메인 객체가 아닌 DTO로 매핑하여 반환
        return new OrderResponseDto(product.getId(), "SUCCESS");
    }
}

```

### 7. 아키텍처 스타일 종합 비교표

| **비교 항목**               | **Layered (Anemic)**                       | **Layered (Rich)**                         | **Hexagonal**                     | **Clean**                                        |
| ----------------------- | ------------------------------------------ | ------------------------------------------ | --------------------------------- | ------------------------------------------------ |
| **MVC(Controller) 의존성** | `Service` (구체 클래스 직접 의존)                   | `Service` (구체 클래스 직접 의존)                   | `UseCase` (Inbound Port 인터페이스)    | `UseCase` (Inbound Port 인터페이스)                   |
| **비즈니스 로직의 위치**         | Service 계층 (Tx Script)                     | Domain 계층 (`Product`)                      | Domain 계층 (`Product`)             | Domain 계층 (`Product`)                            |
| **Service 계층의 역할**      | 도메인 상태 추출 및 비즈니스 연산 직접 수행                  | 비즈니스 로직을 도메인에 위임 (Orchestrator)            | Inbound Port 구현, 도메인 위임           | Inbound Port 구현, DTO 변환 및 도메인 위임                 |
| **MVC와 도메인의 결합도**       | 공유 (Entity/DTO 혼용)                         | 공유 가능 (Domain 객체 직접 사용)                    | 단절됨 (Adapter로 격리)                 | **가장 강력한 단절** (DTO 강제)                           |
| **의존성(화살표) 방향**         | MVC $\rightarrow$ Service $\rightarrow$ DB | MVC $\rightarrow$ Service $\rightarrow$ DB | 외부(MVC/DB) $\rightarrow$ 내부 코어    | 외부 계층 $\rightarrow$ UseCase $\rightarrow$ Domain |
| **테스트 용이성**             | Service 단위 테스트 시 DB Mocking 필수             | Domain 단독 테스트 용이. Service는 DB Mocking 필요   | 인/아웃바운드 포트를 통한 빠르고 독립적인 코어 테스트 가능 | Hexagonal과 동일하며 DTO 매핑 테스트가 추가됨                  |