import { Either, left, right } from 'src/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetRecipientUseCaseRequest {
  recipientId: string
}

type GetRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  { recipient: Recipient }
>

export class GetRecipientUseCase {
  constructor(private readonly recipientsRepo: RecipientsRepository) {}

  async execute({
    recipientId,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepo.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({ recipient })
  }
}
