import { Controller, Get, Query } from '@nestjs/common'
import { FetchCouriersUseCase } from 'src/domain/delivery/application/use-cases/fetch-couriers'
import { Roles } from 'src/infra/auth/roles.decorator'
import z from 'zod'
import { CourierPresenter } from '../../presenters/courier-presenter'

@Controller('/couriers')
@Roles('ADMIN')
export class FetchCouriersController {
  constructor(private readonly fetchCouriers: FetchCouriersUseCase) {}

  @Get()
  async handle(@Query('page') page: string) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchCouriers.execute({ page: pageNumber })

    return {
      couriers: result.value.couriers.map(CourierPresenter.toHTTP),
    }
  }
}
