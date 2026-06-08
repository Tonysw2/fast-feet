import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { DeleteRecipientUseCase } from 'src/domain/delivery/application/use-cases/delete-recipient'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'

@Controller('/recipients/:id')
@Roles('ADMIN')
export class DeleteRecipientController {
  constructor(private readonly deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteRecipient.execute({ recipientId: id })

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
