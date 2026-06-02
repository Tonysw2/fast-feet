import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { GetCourierUseCase } from 'src/domain/delivery/application/use-cases/get-courier'

@Controller('/couriers/:id')
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
      courier: {
        id: courier.id.toString(),
        name: courier.name,
        cpf: courier.cpf.value,
      },
    }
  }
}
