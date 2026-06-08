import { Module } from '@nestjs/common'
import { AdminsRepository } from 'src/domain/delivery/application/repositories/admins-repository'
import { AttachmentsRepository } from 'src/domain/delivery/application/repositories/attachments-repository'
import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository'
import { OrdersRepository } from 'src/domain/delivery/application/repositories/orders-repository'
import { RecipientsRepository } from 'src/domain/delivery/application/repositories/recipients-repository'
import { NotificationsRepository } from 'src/domain/notification/application/repositories/notifications-repository'
import { EnvModule } from '../env/env.module'
import { PrismaService } from './prisma.service'
import { PrismaAdminsRepository } from './repositories/admins-repository'
import { PrismaAttachmentsRepository } from './repositories/attachments-repository'
import { PrismaCouriersRepository } from './repositories/couriers-repository'
import { PrismaNotificationsRepository } from './repositories/notifications-repository'
import { PrismaOrdersRepository } from './repositories/orders-repository'
import { PrismaRecipientsRepository } from './repositories/recipients-repository'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
    { provide: CouriersRepository, useClass: PrismaCouriersRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
    { provide: RecipientsRepository, useClass: PrismaRecipientsRepository },
    { provide: AdminsRepository, useClass: PrismaAdminsRepository },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AttachmentsRepository,
    CouriersRepository,
    OrdersRepository,
    RecipientsRepository,
    AdminsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
