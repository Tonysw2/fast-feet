import type { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract create(notification: Notification): Promise<void>
}
