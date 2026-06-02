import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { GetRecipientUseCase } from 'src/domain/delivery/application/use-cases/get-recipient'
import { Roles } from 'src/infra/auth/roles.decorator'

@Controller('/recipients/:id')
@Roles('ADMIN')
export class GetRecipientController {
  constructor(private readonly getRecipient: GetRecipientUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getRecipient.execute({ recipientId: id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { recipient } = result.value

    return {
      recipient: {
        id: recipient.id.toString(),
        name: recipient.name,
        email: recipient.email,
      },
    }
  }
}
