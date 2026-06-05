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

  it('should return all orders assigned to a courier', async () => {
    const courierId = new UniqueEntityId()
    const otherCourierId = new UniqueEntityId()

    ordersRepo.items.push(
      Order.create({
        title: 'my-delivery-picked-up',
        recipientId: new UniqueEntityId(),
        courierId,
        photoUrl: null,
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'PICKED_UP',
      }),
      Order.create({
        title: 'my-delivery-delivered',
        recipientId: new UniqueEntityId(),
        courierId,
        photoUrl: 'http://example.com/photo.jpg',
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'DELIVERED',
      }),
      Order.create({
        title: 'my-delivery-returned',
        recipientId: new UniqueEntityId(),
        courierId,
        photoUrl: null,
        deliveryLatitude: -23.5,
        deliveryLongitude: -46.6,
        status: 'RETURNED',
      }),
      Order.create({
        title: 'other-courier-delivery',
        recipientId: new UniqueEntityId(),
        courierId: otherCourierId,
        photoUrl: 'http://example.com/photo2.jpg',
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
    expect(result.value.orders).toHaveLength(3)
    expect(result.value.orders.map((o) => o.title)).toEqual(
      expect.arrayContaining([
        'my-delivery-picked-up',
        'my-delivery-delivered',
        'my-delivery-returned',
      ]),
    )
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
