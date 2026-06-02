import { Injectable } from '@nestjs/common'
import { DomainEvents } from 'src/core/events/domain-events'
import type { EventHandler } from 'src/core/events/event-handler'
import { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { OrderDeliveredEvent } from '../../enterprise/events/order-delivered-event'
import { RecipientsRepository } from '../repositories/recipients-repository'

@Injectable()
export class OnOrderDelivered implements EventHandler {
  constructor(
    private readonly recipientsRepo: RecipientsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(this.handle.bind(this), OrderDeliveredEvent.name)
  }

  private async handle({ order }: OrderDeliveredEvent) {
    const recipient = await this.recipientsRepo.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Encomenda entregue',
        content: `Sua encomenda "${order.title}" foi entregue com sucesso.`,
      })
    }
  }
}
