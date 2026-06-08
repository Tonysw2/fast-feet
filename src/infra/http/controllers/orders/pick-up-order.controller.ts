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
import { PickUpOrderUseCase } from 'src/domain/delivery/application/use-cases/pick-up-order'
import {
  CurrentUser,
  type UserPayload,
} from 'src/infra/auth/current-user.decorator'

@Controller('/orders/:id/pick-up')
export class PickUpOrderController {
  constructor(private readonly pickUpOrder: PickUpOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    const result = await this.pickUpOrder.execute({
      orderId: id,
      courierId: user.sub,
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
