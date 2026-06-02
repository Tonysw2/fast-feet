import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { GetOrderUseCase } from 'src/domain/delivery/application/use-cases/get-order'
import { Roles } from 'src/infra/auth/roles.decorator'

@Controller('/orders/:id')
@Roles('ADMIN')
export class GetOrderController {
  constructor(private readonly getOrder: GetOrderUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getOrder.execute({ orderId: id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { order } = result.value

    return {
      order: {
        id: order.id.toString(),
        title: order.title,
        status: order.status,
        recipientId: order.recipientId.toString(),
        courierId: order.courierId?.toString() ?? null,
        photoUrl: order.photoUrl,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
      },
    }
  }
}
