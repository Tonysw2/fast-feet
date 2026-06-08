import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { MarkOrderAsWaitingUseCase } from './mark-order-as-waiting'

let ordersRepo: InMemoryOrdersRepository
let sut: MarkOrderAsWaitingUseCase

describe('MarkOrderAsWaiting UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new MarkOrderAsWaitingUseCase(ordersRepo)
  })

  it('should mark a returned order as waiting', async () => {
    const courierId = new UniqueEntityId()
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'RETURNED',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({ orderId: order.id.toString() })

    assert(result.isRight())
    expect(result.value.order.status).toBe('WAITING')
    expect(result.value.order.courierId).toBeNull()
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const result = await sut.execute({ orderId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError if order is not returned', async () => {
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: null,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'WAITING',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({ orderId: order.id.toString() })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
