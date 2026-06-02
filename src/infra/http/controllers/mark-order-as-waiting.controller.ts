import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { NotAllowedError } from 'src/domain/delivery/application/use-cases/errors/not-allowed'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { MarkOrderAsWaitingUseCase } from 'src/domain/delivery/application/use-cases/mark-order-as-waiting'

@Controller('/orders/:id/waiting')
export class MarkOrderAsWaitingController {
  constructor(private readonly markOrderAsWaiting: MarkOrderAsWaitingUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.markOrderAsWaiting.execute({ orderId: id })

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
