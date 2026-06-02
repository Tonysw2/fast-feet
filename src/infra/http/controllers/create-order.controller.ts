import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { CreateOrderUseCase } from 'src/domain/delivery/application/use-cases/create-order'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  title: z.string(),
  recipientId: z.string().uuid(),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
})

type Schema = z.infer<typeof schema>

@Controller('/orders')
@Roles('ADMIN')
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Body() body: Schema) {
    const result = await this.createOrder.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { orderId: result.value.order.id.toString() }
  }
}
