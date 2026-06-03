import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthenticateAdminUseCase } from 'src/domain/delivery/application/use-cases/authenticate-admin'
import { InvalidCredentialsError } from 'src/domain/delivery/application/use-cases/errors/invalid-credentials'
import { IsPublic } from 'src/infra/auth/is-public.decorator'
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type Schema = z.infer<typeof schema>

@Controller('/sessions/admin')
@IsPublic()
export class AuthenticateAdminController {
  constructor(private readonly authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Body() body: Schema) {
    const result = await this.authenticateAdmin.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { accessToken: result.value.accessToken }
  }
}
