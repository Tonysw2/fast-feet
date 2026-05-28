import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetOrderUseCase } from './get-order'

let ordersRepo: InMemoryOrdersRepository
let sut: GetOrderUseCase

describe('GetOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new GetOrderUseCase(ordersRepo)
  })

  it('should get an order by id', async () => {
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: null,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({ orderId: order.id.toString() })

    assert(result.isRight())
    expect(result.value.order.id).toEqual(order.id)
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const result = await sut.execute({ orderId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
