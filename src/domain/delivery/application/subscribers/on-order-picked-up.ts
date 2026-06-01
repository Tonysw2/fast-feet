import { DomainEvents } from 'src/core/events/domain-events'
import type { EventHandler } from 'src/core/events/event-handler'
import type { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { OrderPickedUpEvent } from '../../enterprise/events/order-picked-up-event'
import type { RecipientsRepository } from '../repositories/recipients-repository'

export class OnOrderPickedUp implements EventHandler {
  constructor(
    private readonly recipientsRepo: RecipientsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(this.handle.bind(this), OrderPickedUpEvent.name)
  }

  private async handle({ order }: OrderPickedUpEvent) {
    const recipient = await this.recipientsRepo.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Encomenda saiu para entrega',
        content: `Sua encomenda "${order.title}" foi retirada e está a caminho.`,
      })
    }
  }
}
