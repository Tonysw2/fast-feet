import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { CreateOrderUseCase } from './create-order'
import { ResourceNotFoundError } from './errors/resource-not-found'

let ordersRepo: InMemoryOrdersRepository
let recipientsRepo: InMemoryRecipientsRepository
let sut: CreateOrderUseCase

describe('CreateOrder UseCase', () => {
  beforeEach(() => {
    ordersRepo = new InMemoryOrdersRepository()
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new CreateOrderUseCase(ordersRepo, recipientsRepo)
  })

  it('should create an order', async () => {
    const recipient = Recipient.create({
      name: 'recipient-1',
      email: 'r1@example.com',
    })
    recipientsRepo.items.push(recipient)

    const result = await sut.execute({
      title: 'order-1',
      recipientId: recipient.id.toString(),
      deliveryLatitude: -23.5505,
      deliveryLongitude: -46.6333,
    })

    assert(result.isRight())
    expect(ordersRepo.items).toHaveLength(1)
    expect(ordersRepo.items[0].status).toBe('WAITING')
    expect(ordersRepo.items[0].courierId).toBeNull()
  })

  it('should return ResourceNotFoundError if recipient does not exist', async () => {
    const result = await sut.execute({
      title: 'order-1',
      recipientId: 'non-existent-id',
      deliveryLatitude: -23.5505,
      deliveryLongitude: -46.6333,
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
