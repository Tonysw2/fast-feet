# Domain Implementation Checklist

## Entities

- [x] Create `Admin` — `name`, `cpf`, `password`
- [x] Create `Recipient` — `name`, `email`
- [x] Create `Order` — `title`, `status`, `recipientId`, `courierId?`, `photoUrl?`, `deliveryLatitude`, `deliveryLongitude`

## Repository Interfaces

- [x] Create `AdminsRepository` — `findByCPF`, `findById`, `create`
- [x] Update `CouriersRepository` — add `findById`, `findMany`, `save`, `delete`
- [x] Create `RecipientsRepository` — `findById`, `findByEmail`, `findMany`, `create`, `save`, `delete`
- [x] Create `OrdersRepository` — `findById`, `findMany`, `findManyNearby`, `findManyByCourierId`, `create`, `save`, `delete`

## Errors

- [x] Create `ResourceNotFoundError`
- [x] Create `NotAllowedError`

## Use Cases — Auth

- [x] `RegisterAdminUseCase`
- [x] `AuthenticateAdminUseCase`

## Use Cases — Couriers (admin)

- [x] `FetchCouriersUseCase`
- [x] `GetCourierUseCase`
- [x] `EditCourierUseCase`
- [x] `DeleteCourierUseCase`
- [x] `ChangeCourierPasswordUseCase`

## Use Cases — Recipients (admin)

- [x] `RegisterRecipientUseCase`
- [x] `FetchRecipientsUseCase`
- [x] `GetRecipientUseCase`
- [x] `EditRecipientUseCase`
- [x] `DeleteRecipientUseCase`

## Use Cases — Orders (admin)

- [x] `CreateOrderUseCase`
- [x] `FetchOrdersUseCase`
- [x] `GetOrderUseCase`
- [x] `EditOrderUseCase`
- [x] `DeleteOrderUseCase`
- [x] `MarkOrderAsWaitingUseCase`

## Use Cases — Orders (courier)

- [x] `PickUpOrderUseCase`
- [x] `DeliverOrderUseCase`
- [x] `ReturnOrderUseCase`
- [x] `FetchNearbyOrdersUseCase`
- [x] `FetchCourierDeliveriesUseCase`

# Regras de negócio

- Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- Somente o entregador que retirou a encomenda pode marcar ela como entregue
- Somente o admin pode alterar a senha de um usuário
- Não deve ser possível um entregador listar as encomendas de outro entregador
