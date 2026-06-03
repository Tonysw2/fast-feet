import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { EditOrderUseCase } from 'src/domain/delivery/application/use-cases/edit-order'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  title: z.string(),
  recipientId: z.string().uuid(),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
})

type Schema = z.infer<typeof schema>

@Controller('/orders/:id')
@Roles('ADMIN')
export class EditOrderController {
  constructor(private readonly editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.editOrder.execute({ orderId: id, ...body })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
