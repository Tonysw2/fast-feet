import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { makeAttachment } from 'tests/factories/make-attachment'
import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { DeliverOrderUseCase } from './deliver-order'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

let ordersRepo: InMemoryOrdersRepository
let attachmentsRepo: InMemoryAttachmentsRepository
let sut: DeliverOrderUseCase

describe('DeliverOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    attachmentsRepo = new InMemoryAttachmentsRepository()
    sut = new DeliverOrderUseCase(ordersRepo, attachmentsRepo)
  })

  it('should deliver a picked-up order', async () => {
    const courierId = new UniqueEntityId()
    const attachment = makeAttachment()
    attachmentsRepo.items.push(attachment)

    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: courierId.toString(),
      attachmentId: attachment.id.toString(),
    })

    assert(result.isRight())
    expect(result.value.order.status).toBe('DELIVERED')
    expect(result.value.order.attachmentId?.toString()).toBe(
      attachment.id.toString(),
    )
  })

  it('should return ResourceNotFoundError if order does not exist', async () => {
    const attachment = makeAttachment()
    attachmentsRepo.items.push(attachment)

    const result = await sut.execute({
      orderId: 'non-existent-id',
      courierId: new UniqueEntityId().toString(),
      attachmentId: attachment.id.toString(),
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError if order is not picked up', async () => {
    const attachment = makeAttachment()
    attachmentsRepo.items.push(attachment)

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

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: new UniqueEntityId().toString(),
      attachmentId: attachment.id.toString(),
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return NotAllowedError if courier does not own the order', async () => {
    const attachment = makeAttachment()
    attachmentsRepo.items.push(attachment)

    const ownerCourierId = new UniqueEntityId()
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId: ownerCourierId,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: new UniqueEntityId().toString(),
      attachmentId: attachment.id.toString(),
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return ResourceNotFoundError if attachment does not exist', async () => {
    const courierId = new UniqueEntityId()
    const order = Order.create({
      title: 'order-1',
      recipientId: new UniqueEntityId(),
      courierId,
      attachmentId: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: courierId.toString(),
      attachmentId: 'non-existent-attachment-id',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
