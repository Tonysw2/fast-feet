import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { EditRecipientUseCase } from 'src/domain/delivery/application/use-cases/edit-recipient'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
})

type Schema = z.infer<typeof schema>

@Controller('/recipients/:id')
@Roles('ADMIN')
export class EditRecipientController {
  constructor(private readonly editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.editRecipient.execute({
      recipientId: id,
      name: body.name,
      email: body.email,
    })

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
