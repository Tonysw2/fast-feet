import type { NotificationsRepository } from 'src/domain/notification/application/repositories/notifications-repository'
import { Notification } from 'src/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}
