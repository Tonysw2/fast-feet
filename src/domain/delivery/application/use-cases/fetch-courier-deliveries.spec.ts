import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { FetchCourierDeliveriesUseCase } from './fetch-courier-deliveries'

let ordersRepo: InMemoryOrdersRepository
let sut: FetchCourierDeliveriesUseCase

describe('FetchCourierDeliveries UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new FetchCourierDeliveriesUseCase(ordersRepo)
  })

  it('should return delivered orders for a courier', async () => {
    const courierId = new UniqueEntityId()
    const otherCourierId = new UniqueEntityId()

    ordersRepo.items.push(
      Order.create({
        title: 'my-delivery-1',
        recipientId: new UniqueEntityId(),
        courierId,
        photoUrl: 'http://example.com/photo1.jpg',
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'DELIVERED',
      }),
      Order.create({
        title: 'my-delivery-2',
        recipientId: new UniqueEntityId(),
        courierId,
        photoUrl: 'http://example.com/photo2.jpg',
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'DELIVERED',
      }),
      Order.create({
        title: 'other-delivery',
        recipientId: new UniqueEntityId(),
        courierId: otherCourierId,
        photoUrl: 'http://example.com/photo3.jpg',
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'DELIVERED',
      }),
    )

    const result = await sut.execute({
      courierId: courierId.toString(),
      page: 1,
    })

    assert(result.isRight())
    expect(result.value.orders).toHaveLength(2)
    expect(result.value.orders[0].title).toBe('my-delivery-1')
    expect(result.value.orders[1].title).toBe('my-delivery-2')
  })

  it('should paginate deliveries', async () => {
    const courierId = new UniqueEntityId()

    for (let i = 1; i <= 22; i++) {
      ordersRepo.items.push(
        Order.create({
          title: `delivery-${i}`,
          recipientId: new UniqueEntityId(),
          courierId,
          photoUrl: `http://example.com/photo${i}.jpg`,
          deliveryLatitude: -23.5,
          deliveryLongitude: -46.6,
          status: 'DELIVERED',
        }),
      )
    }

    const result = await sut.execute({
      courierId: courierId.toString(),
      page: 2,
    })

    assert(result.isRight())
    expect(result.value.orders).toHaveLength(2)
  })
})
