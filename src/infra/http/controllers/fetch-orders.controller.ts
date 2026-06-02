import { Controller, Get, Query } from '@nestjs/common'
import { FetchOrdersUseCase } from 'src/domain/delivery/application/use-cases/fetch-orders'
import z from 'zod'

@Controller('/orders')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(@Query('page') page: string) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchOrders.execute({ page: pageNumber })

    return {
      orders: result.value.orders.map((o) => ({
        id: o.id.toString(),
        title: o.title,
        status: o.status,
        recipientId: o.recipientId.toString(),
        courierId: o.courierId?.toString() ?? null,
        deliveryLatitude: o.deliveryLatitude,
        deliveryLongitude: o.deliveryLongitude,
      })),
    }
  }
}
