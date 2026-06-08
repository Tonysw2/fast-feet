import { Controller, Get, Query } from '@nestjs/common'
import { FetchRecipientsUseCase } from 'src/domain/delivery/application/use-cases/fetch-recipients'
import { Roles } from 'src/infra/auth/roles.decorator'
import z from 'zod'
import { RecipientPresenter } from '../../presenters/recipient-presenter'

@Controller('/recipients')
@Roles('ADMIN')
export class FetchRecipientsController {
  constructor(private readonly fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle(@Query('page') page: string) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchRecipients.execute({ page: pageNumber })

    return {
      recipients: result.value.recipients.map(RecipientPresenter.toHTTP),
    }
  }
}
