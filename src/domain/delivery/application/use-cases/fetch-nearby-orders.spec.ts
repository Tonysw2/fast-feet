import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'

let ordersRepo: InMemoryOrdersRepository
let sut: FetchNearbyOrdersUseCase

describe('FetchNearbyOrders UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new FetchNearbyOrdersUseCase(ordersRepo)
  })

  it('should return waiting orders near the courier', async () => {
    // São Paulo coordinates — nearby
    ordersRepo.items.push(
      Order.create({
        title: 'nearby-order',
        recipientId: new UniqueEntityId(),
        courierId: null,
        photoUrl: null,
        deliveryLatitude: -23.5505,
        deliveryLongitude: -46.6333,
      }),
    )

    // Manaus — far away (~2800km)
    ordersRepo.items.push(
      Order.create({
        title: 'far-order',
        recipientId: new UniqueEntityId(),
        courierId: null,
        photoUrl: null,
        deliveryLatitude: -3.119,
        deliveryLongitude: -60.0217,
      }),
    )

    // Nearby but already picked up — should NOT appear
    ordersRepo.items.push(
      Order.create({
        title: 'picked-up-order',
        recipientId: new UniqueEntityId(),
        courierId: new UniqueEntityId(),
        photoUrl: null,
        deliveryLatitude: -23.55,
        deliveryLongitude: -46.63,
        status: 'PICKED_UP',
      }),
    )

    const result = await sut.execute({
      courierLatitude: -23.5489,
      courierLongitude: -46.6388,
      page: 1,
    })

    assert(result.isRight())
    expect(result.value.orders).toHaveLength(1)
    expect(result.value.orders[0].title).toBe('nearby-order')
  })
})
