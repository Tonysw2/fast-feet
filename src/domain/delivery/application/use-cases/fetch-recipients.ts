import { Either, right } from 'src/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface FetchRecipientsUseCaseRequest {
  page: number
}

type FetchRecipientsUseCaseResponse = Either<never, { recipients: Recipient[] }>

export class FetchRecipientsUseCase {
  constructor(private readonly recipientsRepo: RecipientsRepository) {}

  async execute({
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientsRepo.findMany({ page })

    return right({ recipients })
  }
}
