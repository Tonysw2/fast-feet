import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { CourierAlreadyExists } from 'src/domain/delivery/application/use-cases/errors/courier-already-exists'
import { RegisterCourierUseCase } from 'src/domain/delivery/application/use-cases/register-courier'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string().min(6),
})

type Schema = z.infer<typeof schema>

@Controller('/couriers')
@Roles('ADMIN')
export class RegisterCourierController {
  constructor(private readonly registerCourier: RegisterCourierUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Body() body: Schema) {
    const result = await this.registerCourier.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CourierAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { courierId: result.value.courier.id.toString() }
  }
}
