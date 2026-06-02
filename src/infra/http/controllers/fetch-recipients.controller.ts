import { Controller, Get, Query } from '@nestjs/common'
import { FetchRecipientsUseCase } from 'src/domain/delivery/application/use-cases/fetch-recipients'
import z from 'zod'

@Controller('/recipients')
export class FetchRecipientsController {
  constructor(private readonly fetchRecipients: FetchRecipientsUseCase) {}

  @Get()
  async handle(@Query('page') page: string) {
    const pageNumber = z.coerce.number().min(1).default(1).parse(page)

    const result = await this.fetchRecipients.execute({ page: pageNumber })

    return {
      recipients: result.value.recipients.map((r) => ({
        id: r.id.toString(),
        name: r.name,
        email: r.email,
      })),
    }
  }
}
