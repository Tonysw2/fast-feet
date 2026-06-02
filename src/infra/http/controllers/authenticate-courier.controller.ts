import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { AuthenticateCourierUseCase } from 'src/domain/delivery/application/use-cases/authenticate-courier'
import { InvalidCredentialsError } from 'src/domain/delivery/application/use-cases/errors/invalid-credentials'
import { IsPublic } from 'src/infra/auth/is-public.decorator'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const authenticateSchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

export type AuthenticateSchema = z.infer<typeof authenticateSchema>

@Controller('/sessions')
@IsPublic()
export class AuthenticateCourierController {
  constructor(
    private readonly authenticateCourier: AuthenticateCourierUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateSchema))
  async authenticate(@Body() body: AuthenticateSchema) {
    const { cpf, password } = body

    const result = await this.authenticateCourier.execute({ cpf, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError: {
          throw new UnauthorizedException(result.value.message)
        }

        default: {
          throw new BadRequestException(result.value.message)
        }
      }
    }

    return { accessToken: result.value.accessToken }
  }
}
