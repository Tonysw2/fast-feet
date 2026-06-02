import { Controller, Get, Query } from '@nestjs/common'
import { FetchCourierDeliveriesUseCase } from 'src/domain/delivery/application/use-cases/fetch-courier-deliveries'
import {
  CurrentUser,
  type UserPayload,
} from 'src/infra/auth/current-user.decorator'
import z from 'zod'

@Controller('/couriers/me/deliveries')
export class FetchCourierDeliveriesController {
  constructor(
    private readonly fetchCourierDeliveries: FetchCourierDeliveriesUseCase,
  ) {}

  @Get()
  async handle(@Query('page') page: string, @CurrentUser() user: UserPayload) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchCourierDeliveries.execute({
      courierId: user.sub,
      page: pageNumber,
    })

    return {
      orders: result.value.orders.map((o) => ({
        id: o.id.toString(),
        title: o.title,
        status: o.status,
        recipientId: o.recipientId.toString(),
        photoUrl: o.photoUrl,
        deliveryLatitude: o.deliveryLatitude,
        deliveryLongitude: o.deliveryLongitude,
      })),
    }
  }
}
