import { DomainEvents } from 'src/core/events/domain-events'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository'
import { InMemoryOrdersRepository } from 'tests/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { PickUpOrderUseCase } from '../use-cases/pick-up-order'
import { OnOrderPickedUp } from './on-order-picked-up'

let ordersRepo: InMemoryOrdersRepository
let recipientsRepo: InMemoryRecipientsRepository
let notificationsRepo: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase
let pickUpOrder: PickUpOrderUseCase

describe('OnOrderPickedUp', () => {
  beforeEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()

    ordersRepo = new InMemoryOrdersRepository()
    recipientsRepo = new InMemoryRecipientsRepository()
    notificationsRepo = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(notificationsRepo)
    pickUpOrder = new PickUpOrderUseCase(ordersRepo)

    new OnOrderPickedUp(recipientsRepo, sendNotification)
  })

  it('should send a notification when an order is picked up', async () => {
    const recipient = Recipient.create({ name: 'John', email: 'john@example.com' })
    recipientsRepo.items.push(recipient)

    const order = Order.create({
      title: 'Caixa de livros',
      recipientId: recipient.id,
      courierId: null,
      photoUrl: null,
      deliveryLatitude: -23.5,
      deliveryLongitude: -46.6,
    })
    ordersRepo.items.push(order)

    const courierId = new UniqueEntityId()

    await pickUpOrder.execute({
      orderId: order.id.toString(),
      courierId: courierId.toString(),
    })

    expect(notificationsRepo.items).toHaveLength(1)
    expect(notificationsRepo.items[0].recipientId.toString()).toBe(
      recipient.id.toString(),
    )
    expect(notificationsRepo.items[0].title).toBe('Encomenda saiu para entrega')
  })
})
