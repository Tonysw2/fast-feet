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
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EventsModule } from '../events/events.module'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'
import { ChangeCourierPasswordController } from './controllers/change-courier-password.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DeleteCourierController } from './controllers/delete-courier.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeliverOrderController } from './controllers/deliver-order.controller'
import { EditCourierController } from './controllers/edit-courier.controller'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { FetchCourierDeliveriesController } from './controllers/fetch-courier-deliveries.controller'
import { FetchCouriersController } from './controllers/fetch-couriers.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { FetchOrdersController } from './controllers/fetch-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { GetCourierController } from './controllers/get-courier.controller'
import { GetOrderController } from './controllers/get-order.controller'
import { GetRecipientController } from './controllers/get-recipient.controller'
import { MarkOrderAsWaitingController } from './controllers/mark-order-as-waiting.controller'
import { PickUpOrderController } from './controllers/pick-up-order.controller'
import { RegisterCourierController } from './controllers/register-courier.controller'
import { RegisterRecipientController } from './controllers/register-recipient.controller'
import { ReturnOrderController } from './controllers/return-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EventsModule],
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
  ],
  controllers: [
    AuthenticateCourierController,
    AuthenticateAdminController,
    RegisterCourierController,
    FetchCouriersController,
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
    FetchCourierDeliveriesController,
  ],
})
export class HttpModule {}
