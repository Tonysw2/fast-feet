import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common'
import { EditCourierUseCase } from 'src/domain/delivery/application/use-cases/edit-courier'
import { ResourceNotFoundError } from 'src/domain/delivery/application/use-cases/errors/resource-not-found'
import { Roles } from 'src/infra/auth/roles.decorator'
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe'
import z from 'zod'

const schema = z.object({ name: z.string() })
type Schema = z.infer<typeof schema>

@Controller('/couriers/:id')
@Roles('ADMIN')
export class EditCourierController {
  constructor(private readonly editCourier: EditCourierUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(schema))
  async handle(@Param('id') id: string, @Body() body: Schema) {
    const result = await this.editCourier.execute({
      courierId: id,
      name: body.name,
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
