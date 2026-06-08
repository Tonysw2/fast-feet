import { Controller, Get, Query } from '@nestjs/common'
import { FetchCourierDeliveriesUseCase } from 'src/domain/delivery/application/use-cases/fetch-courier-deliveries'
import {
  CurrentUser,
  type UserPayload,
} from 'src/infra/auth/current-user.decorator'
import z from 'zod'
import { OrderPresenter } from '../../presenters/order-presenter'

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
      orders: result.value.orders.map(OrderPresenter.toHTTP),
    }
  }
}
