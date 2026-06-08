import { Module } from '@nestjs/common'
import { AuthenticateAdminUseCase } from 'src/domain/delivery/application/use-cases/authenticate-admin'
import { AuthenticateCourierUseCase } from 'src/domain/delivery/application/use-cases/authenticate-courier'
import { ChangeCourierPasswordUseCase } from 'src/domain/delivery/application/use-cases/change-courier-password'
import { CreateOrderUseCase } from 'src/domain/delivery/application/use-cases/create-order'
import { DeleteCourierUseCase } from 'src/domain/delivery/application/use-cases/delete-courier'
import { DeleteOrderUseCase } from 'src/domain/delivery/application/use-cases/delete-order'
import { DeleteRecipientUseCase } from 'src/domain/delivery/application/use-cases/delete-recipient'
import { DeliverOrderUseCase } from 'src/domain/delivery/application/use-cases/deliver-order'
import { EditCourierUseCase } from 'src/domain/delivery/application/use-cases/edit-courier'
import { EditOrderUseCase } from 'src/domain/delivery/application/use-cases/edit-order'
import { EditRecipientUseCase } from 'src/domain/delivery/application/use-cases/edit-recipient'
import { FetchCourierDeliveriesUseCase } from 'src/domain/delivery/application/use-cases/fetch-courier-deliveries'
import { FetchCouriersUseCase } from 'src/domain/delivery/application/use-cases/fetch-couriers'
import { FetchNearbyOrdersUseCase } from 'src/domain/delivery/application/use-cases/fetch-nearby-orders'
import { FetchOrdersUseCase } from 'src/domain/delivery/application/use-cases/fetch-orders'
import { FetchRecipientsUseCase } from 'src/domain/delivery/application/use-cases/fetch-recipients'
import { GetCourierUseCase } from 'src/domain/delivery/application/use-cases/get-courier'
import { GetOrderUseCase } from 'src/domain/delivery/application/use-cases/get-order'
import { GetRecipientUseCase } from 'src/domain/delivery/application/use-cases/get-recipient'
import { MarkOrderAsWaitingUseCase } from 'src/domain/delivery/application/use-cases/mark-order-as-waiting'
import { PickUpOrderUseCase } from 'src/domain/delivery/application/use-cases/pick-up-order'
import { RegisterCourierUseCase } from 'src/domain/delivery/application/use-cases/register-courier'
import { RegisterRecipientUseCase } from 'src/domain/delivery/application/use-cases/register-recipient'
import { ReturnOrderUseCase } from 'src/domain/delivery/application/use-cases/return-order'
import { UploadAttachmentUseCase } from 'src/domain/delivery/application/use-cases/upload-attachment'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EventsModule } from '../events/events.module'
import { StorageModule } from '../storage/storage.module'
import { UploadAttachmentController } from './controllers/attachments/upload-attachment.controller'
import { AuthenticateAdminController } from './controllers/auth/authenticate-admin.controller'
import { AuthenticateCourierController } from './controllers/auth/authenticate-courier.controller'
import { ChangeCourierPasswordController } from './controllers/couriers/change-courier-password.controller'
import { DeleteCourierController } from './controllers/couriers/delete-courier.controller'
import { EditCourierController } from './controllers/couriers/edit-courier.controller'
import { FetchCourierDeliveriesController } from './controllers/couriers/fetch-courier-deliveries.controller'
import { FetchCouriersController } from './controllers/couriers/fetch-couriers.controller'
import { GetCourierController } from './controllers/couriers/get-courier.controller'
import { RegisterCourierController } from './controllers/couriers/register-courier.controller'
import { CreateOrderController } from './controllers/orders/create-order.controller'
import { DeleteOrderController } from './controllers/orders/delete-order.controller'
import { DeliverOrderController } from './controllers/orders/deliver-order.controller'
import { EditOrderController } from './controllers/orders/edit-order.controller'
import { FetchNearbyOrdersController } from './controllers/orders/fetch-nearby-orders.controller'
import { FetchOrdersController } from './controllers/orders/fetch-orders.controller'
import { GetOrderController } from './controllers/orders/get-order.controller'
import { MarkOrderAsWaitingController } from './controllers/orders/mark-order-as-waiting.controller'
import { PickUpOrderController } from './controllers/orders/pick-up-order.controller'
import { ReturnOrderController } from './controllers/orders/return-order.controller'
import { DeleteRecipientController } from './controllers/recipients/delete-recipient.controller'
import { EditRecipientController } from './controllers/recipients/edit-recipient.controller'
import { FetchRecipientsController } from './controllers/recipients/fetch-recipients.controller'
import { GetRecipientController } from './controllers/recipients/get-recipient.controller'
import { RegisterRecipientController } from './controllers/recipients/register-recipient.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EventsModule, StorageModule],
  providers: [
    // Use cases — auth
    AuthenticateCourierUseCase,
    AuthenticateAdminUseCase,

    // Use cases — couriers
    RegisterCourierUseCase,
    FetchCouriersUseCase,
    GetCourierUseCase,
    EditCourierUseCase,
    DeleteCourierUseCase,
    ChangeCourierPasswordUseCase,

    // Use cases — recipients
    RegisterRecipientUseCase,
    FetchRecipientsUseCase,
    GetRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,

    // Use cases — orders
    CreateOrderUseCase,
    FetchOrdersUseCase,
    GetOrderUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    MarkOrderAsWaitingUseCase,
    PickUpOrderUseCase,
    DeliverOrderUseCase,
    ReturnOrderUseCase,
    FetchNearbyOrdersUseCase,
    FetchCourierDeliveriesUseCase,

    // Use cases — attachments
    UploadAttachmentUseCase,
  ],
  controllers: [
    AuthenticateCourierController,
    AuthenticateAdminController,
    RegisterCourierController,
    FetchCouriersController,
    FetchCourierDeliveriesController,
    GetCourierController,
    EditCourierController,
    DeleteCourierController,
    ChangeCourierPasswordController,
    RegisterRecipientController,
    FetchRecipientsController,
    GetRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    CreateOrderController,
    FetchOrdersController,
    FetchNearbyOrdersController,
    GetOrderController,
    EditOrderController,
    DeleteOrderController,
    MarkOrderAsWaitingController,
    PickUpOrderController,
    DeliverOrderController,
    ReturnOrderController,
    UploadAttachmentController,
  ],
})
export class HttpModule {}
