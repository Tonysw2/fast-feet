import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { ResourceNotFoundError } from './errors/resource-not-found'

let ordersRepo: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('DeleteOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new DeleteOrderUseCase(ordersRepo)
  })

  it('should delete an order', async () => {
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
    expect(ordersRepo.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const result = await sut.execute({ orderId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
