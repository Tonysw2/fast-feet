# Domain Implementation Checklist

## Entities

- [x] Create `Admin` — `name`, `cpf`, `password`
- [ ] Create `Recipient` — `name`, `email`
- [ ] Create `Order` — `title`, `status`, `recipientId`, `courierId?`, `photoUrl?`, `deliveryLatitude`, `deliveryLongitude`

## Repository Interfaces

- [x] Create `AdminsRepository` — `findByCPF`, `findById`, `create`
- [ ] Update `CouriersRepository` — add `findById`, `findMany`, `save`, `delete`
- [ ] Create `RecipientsRepository` — `findById`, `findByEmail`, `findMany`, `create`, `save`, `delete`
- [ ] Create `OrdersRepository` — `findById`, `findMany`, `findManyNearby`, `findManyByCourierId`, `create`, `save`, `delete`

## Errors

- [ ] Create `ResourceNotFoundError`
- [ ] Create `NotAllowedError`

## Use Cases — Auth

- [x] `RegisterAdminUseCase`
- [x] `AuthenticateAdminUseCase`

## Use Cases — Couriers (admin)

- [ ] `FetchCouriersUseCase`
- [ ] `GetCourierUseCase`
- [ ] `EditCourierUseCase`
- [ ] `DeleteCourierUseCase`
- [ ] `ChangeCourierPasswordUseCase`

## Use Cases — Recipients (admin)

- [ ] `RegisterRecipientUseCase`
- [ ] `FetchRecipientsUseCase`
- [ ] `GetRecipientUseCase`
- [ ] `EditRecipientUseCase`
- [ ] `DeleteRecipientUseCase`

## Use Cases — Orders (admin)

- [ ] `CreateOrderUseCase`
- [ ] `FetchOrdersUseCase`
- [ ] `GetOrderUseCase`
- [ ] `EditOrderUseCase`
- [ ] `DeleteOrderUseCase`
- [ ] `MarkOrderAsWaitingUseCase`

## Use Cases — Orders (courier)

- [ ] `PickUpOrderUseCase`
- [ ] `DeliverOrderUseCase`
- [ ] `ReturnOrderUseCase`
- [ ] `FetchNearbyOrdersUseCase`
- [ ] `FetchCourierDeliveriesUseCase`
