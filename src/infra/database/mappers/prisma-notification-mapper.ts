import type { NotificationModel } from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Notification } from 'src/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  static toDomain(data: NotificationModel): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityId(data.recipientId),
        title: data.title,
        content: data.content,
        readAt: data.readAt,
        createdAt: data.createdAt,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(notification: Notification) {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
    }
  }
}
