import { Injectable } from '@nestjs/common'
import { DomainEvents } from 'src/core/events/domain-events'
import type { EventHandler } from 'src/core/events/event-handler'
import { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { OrderWaitingEvent } from '../../enterprise/events/order-waiting-event'
import { RecipientsRepository } from '../repositories/recipients-repository'

@Injectable()
export class OnOrderWaiting implements EventHandler {
  constructor(
    private readonly recipientsRepo: RecipientsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(this.handle.bind(this), OrderWaitingEvent.name)
  }

  private async handle({ order }: OrderWaitingEvent) {
    const recipient = await this.recipientsRepo.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Encomenda disponível para retirada',
        content: `Sua encomenda "${order.title}" está aguardando retirada.`,
      })
    }
  }
}
