import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { DeliverOrderUseCase } from 'src/domain/delivery/application/use-cases/deliver-order'
import { NotAllowedError } from 'src/domain/delivery/application/use-cases/errors/not-allowed'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import {
  CurrentUser,
  type UserPayload,
} from 'src/infra/auth/current-user.decorator'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({ attachmentId: z.string().uuid() })
type Schema = z.infer<typeof schema>

@Controller('/orders/:id/deliver')
export class DeliverOrderController {
  constructor(private readonly deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.deliverOrder.execute({
      orderId: id,
      courierId: user.sub,
      attachmentId: body.attachmentId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
