import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { GetCourierUseCase } from 'src/domain/delivery/application/use-cases/get-courier'
import { Roles } from 'src/infra/auth/roles.decorator'
import { CourierPresenter } from '../../presenters/courier-presenter'

@Controller('/couriers/:id')
@Roles('ADMIN')
export class GetCourierController {
  constructor(private readonly getCourier: GetCourierUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getCourier.execute({ courierId: id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { courier } = result.value

    return {
      courier: CourierPresenter.toHTTP(courier),
    }
  }
}
