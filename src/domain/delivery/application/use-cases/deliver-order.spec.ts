import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { DeliverOrderUseCase } from './deliver-order'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

let ordersRepo: InMemoryOrdersRepository
let sut: DeliverOrderUseCase

describe('DeliverOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    sut = new DeliverOrderUseCase(ordersRepo)
  })

  it('should deliver a picked-up order', async () => {
    const courierId = new UniqueEntityId()
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: courierId.toString(),
      photoUrl: 'http://example.com/photo.jpg',
    })

    assert(result.isRight())
    expect(result.value.order.status).toBe('DELIVERED')
    expect(result.value.order.photoUrl).toBe('http://example.com/photo.jpg')
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const result = await sut.execute({
      orderId: 'non-existent-id',
      courierId: new UniqueEntityId().toString(),
      photoUrl: 'http://example.com/photo.jpg',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError if order is not picked up', async () => {
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: null,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'WAITING',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: new UniqueEntityId().toString(),
      photoUrl: 'http://example.com/photo.jpg',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return NotAllowedError if courier does not own the order', async () => {
    const ownerCourierId = new UniqueEntityId()
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: ownerCourierId,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: new UniqueEntityId().toString(),
      photoUrl: 'http://example.com/photo.jpg',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
