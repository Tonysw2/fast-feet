import { type Either, right } from 'src/core/either'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import type { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<never, { notification: Notification }>

export class SendNotificationUseCase {
  constructor(private readonly notificationsRepo: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationsRepo.create(notification)

    return right({ notification })
  }
}
