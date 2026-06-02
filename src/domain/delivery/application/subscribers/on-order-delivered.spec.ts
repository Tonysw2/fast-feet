import { DomainEvents } from 'src/core/events/domain-events'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { DeliverOrderUseCase } from '../use-cases/deliver-order'
import { OnOrderDelivered } from './on-order-delivered'

let ordersRepo: InMemoryOrdersRepository
let recipientsRepo: InMemoryRecipientsRepository
let notificationsRepo: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let deliverOrder: DeliverOrderUseCase

describe('OnOrderDelivered', () => {
  beforeEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()

    ordersRepo = new InMemoryOrdersRepository()
    recipientsRepo = new InMemoryRecipientsRepository()
    notificationsRepo = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(notificationsRepo)
    deliverOrder = new DeliverOrderUseCase(ordersRepo)

    new OnOrderDelivered(recipientsRepo, sendNotification)
  })

  it('should send a notification when an order is delivered', async () => {
    const recipient = Recipient.create({
      name: 'Jane',
      email: 'jane@example.com',
    })
    recipientsRepo.items.push(recipient)

    const courierId = new UniqueEntityId()
    const order = Order.create({
      title: 'Notebook',
      recipientId: recipient.id,
      courierId,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
      status: 'PICKED_UP',
    })
    ordersRepo.items.push(order)

    await deliverOrder.execute({
      orderId: order.id.toString(),
      courierId: courierId.toString(),
      photoUrl: 'proof.jpg',
    })

    expect(notificationsRepo.items).toHaveLength(1)
    expect(notificationsRepo.items[0].recipientId.toString()).toBe(
      recipient.id.toString(),
    )
    expect(notificationsRepo.items[0].title).toBe('Encomenda entregue')
  })
})
