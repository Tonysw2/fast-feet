import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let ordersRepo: InMemoryOrdersRepository
let sut: FetchOrdersUseCase

describe('FetchOrders UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new FetchOrdersUseCase(ordersRepo)
  })

  it('should fetch orders', async () => {
    ordersRepo.items.push(
      Order.create({
        title: 'order-1',
        recipientId: new UniqueEntityId(),
        courierId: null,
        attachmentId: null,
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
      }),
      Order.create({
        title: 'order-2',
        recipientId: new UniqueEntityId(),
        courierId: null,
        attachmentId: null,
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
      }),
    )

    const result = await sut.execute({ page: 1 })

    assert(result.isRight())
    expect(result.value.orders).toHaveLength(2)
  })

  it('should paginate orders', async () => {
    for (let i = 1; i <= 22; i++) {
      ordersRepo.items.push(
        Order.create({
          title: `order-${i}`,
          recipientId: new UniqueEntityId(),
          courierId: null,
          attachmentId: null,
          deliveryLatitude: -23.5,
          deliveryLongitude: -46.6,
        }),
      )
    }

    const result = await sut.execute({ page: 2 })

    assert(result.isRight())
    expect(result.value.orders).toHaveLength(2)
  })
})
