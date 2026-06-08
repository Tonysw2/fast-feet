import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { EditOrderUseCase } from './edit-order'
import { ResourceNotFoundError } from './errors/resource-not-found'

let ordersRepo: InMemoryOrdersRepository
let sut: EditOrderUseCase

describe('EditOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new EditOrderUseCase(ordersRepo)
  })

  it('should edit an order', async () => {
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: null,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
    })
    ordersRepo.items.push(order)

    const newRecipientId = new UniqueEntityId()

    const result = await sut.execute({
      orderId: order.id.toString(),
      title: 'order-updated',
      recipientId: newRecipientId.toString(),
      deliveryLatitude: -10.0,
      deliveryLongitude: -20.0,
    })

    assert(result.isRight())
    expect(result.value.order.title).toBe('order-updated')
    expect(result.value.order.deliveryLatitude).toBe(-10.0)
    expect(ordersRepo.items[0].title).toBe('order-updated')
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const result = await sut.execute({
      orderId: 'non-existent-id',
      title: 'any',
      recipientId: new UniqueEntityId().toString(),
      deliveryLatitude: 0,
      deliveryLongitude: 0,
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
