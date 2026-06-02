import { Module } from '@nestjs/common'
import { OnOrderDelivered } from 'src/domain/delivery/application/subscribers/on-order-delivered'
import { OnOrderPickedUp } from 'src/domain/delivery/application/subscribers/on-order-picked-up'
import { OnOrderReturned } from 'src/domain/delivery/application/subscribers/on-order-returned'
import { OnOrderWaiting } from 'src/domain/delivery/application/subscribers/on-order-waiting'
import { SendNotificationUseCase } from 'src/domain/notification/application/use-cases/send-notification'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    SendNotificationUseCase,
    OnOrderDelivered,
    OnOrderPickedUp,
    OnOrderReturned,
    OnOrderWaiting,
  ],
})
export class EventsModule {}
