# 정기배송 시스템 — 용어집

| 용어 | 정의 | 영문명 |
|---|---|---|
| 정기배송 | 고객이 정한 주기로 상품을 받는 약정 | `Subscription` |
| 정기배송 항목 | 정기배송에 담긴 상품 하나와 그 수량·단가 | `SubscriptionItem` |
| 정기배송 상태 | 결제 대기·확정·해지됨·만료됨 | `SubscriptionStatus` |
| 배송 회차 | 배송 예정일마다 한 번의 배송 | `DeliveryRound` |
| 회차 상태 | 예정·배송 요청됨·배송중·배송됨 | `RoundStatus` |
| 배송 주기 | 배송 사이의 일수(1~28일) | `deliveryCycle` |
| 첫 배송일 | 첫 회차를 받는 날 | `firstDeliveryDate` |
| 기간 | 약정 개월 수(1~12개월) | `term` |
| 만료일 | 첫 배송일 + 기간의 전날 | `expiryDate` |
| 배송 예정일 | 회차를 받을 날 | `scheduledDate` |
| 회차 금액 | 신청 때 가격 × 수량의 합 | `roundAmount` |
| 결제 수단 | 카드, 계좌이체, 간편결제 | `PaymentMethod` |
| 신청한다 | 정기배송을 신청하고 결제하는 시스템 오퍼레이션 | `subscribe` |
| 확정 | 결제가 승인되어 정기배송이 성립함 | `confirm` |
| 배송지 | 상품을 받을 주소 | `shippingAddress` |
