import { Either, left, right } from 'src/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteRecipientUseCase {
  constructor(private readonly recipientsRepo: RecipientsRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepo.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepo.delete(recipient)

    return right({})
  }
}
