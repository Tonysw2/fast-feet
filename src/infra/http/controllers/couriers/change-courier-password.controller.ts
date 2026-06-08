import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ChangeCourierPasswordUseCase } from 'src/domain/delivery/application/use-cases/change-courier-password'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({ password: z.string().min(6) })
type Schema = z.infer<typeof schema>

@Controller('/couriers/:id/password')
@Roles('ADMIN')
export class ChangeCourierPasswordController {
  constructor(
    private readonly changeCourierPassword: ChangeCourierPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.changeCourierPassword.execute({
      courierId: id,
      password: body.password,
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
