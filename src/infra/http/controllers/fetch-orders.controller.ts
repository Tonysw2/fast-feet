import { Controller, Get, Query } from '@nestjs/common'
import { FetchOrdersUseCase } from 'src/domain/delivery/application/use-cases/fetch-orders'
import { Roles } from 'src/infra/auth/roles.decorator'
import z from 'zod'
import { OrderPresenter } from '../presenters/order-presenter'

@Controller('/orders')
@Roles('ADMIN')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(@Query('page') page: string) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchOrders.execute({ page: pageNumber })

    return {
      orders: result.value.orders.map(OrderPresenter.toHTTP),
    }
  }
}
