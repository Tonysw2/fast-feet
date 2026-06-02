import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchNearbyOrdersUseCase } from 'src/domain/delivery/application/use-cases/fetch-nearby-orders'
import z from 'zod'

@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private readonly fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(@Query() query: Record<string, string>) {
    const parsed = z
      .object({
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
        page: z.coerce.number().min(1).default(1),
      })
      .safeParse(query)

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten().fieldErrors)
    }

    const { latitude, longitude, page } = parsed.data

    const result = await this.fetchNearbyOrders.execute({
      courierLatitude: latitude,
      courierLongitude: longitude,
      page,
    })

    return {
      orders: result.value.orders.map((o) => ({
        id: o.id.toString(),
        title: o.title,
        status: o.status,
        recipientId: o.recipientId.toString(),
        deliveryLatitude: o.deliveryLatitude,
        deliveryLongitude: o.deliveryLongitude,
      })),
    }
  }
}
