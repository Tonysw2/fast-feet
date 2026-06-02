import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { RecipientAlreadyExistsError } from 'src/domain/delivery/application/use-cases/errors/recipient-already-exists'
import { RegisterRecipientUseCase } from 'src/domain/delivery/application/use-cases/register-recipient'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
})

type Schema = z.infer<typeof schema>

@Controller('/recipients')
export class RegisterRecipientController {
  constructor(private readonly registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Body() body: Schema) {
    const result = await this.registerRecipient.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { recipientId: result.value.recipient.id.toString() }
  }
}
