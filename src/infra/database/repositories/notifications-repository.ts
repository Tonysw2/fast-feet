import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from 'src/domain/notification/application/repositories/notifications-repository'
import { Notification } from 'src/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrismaCreate(data),
    })
  }
}
