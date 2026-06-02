import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  email: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  { recipient: Recipient }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private readonly recipientsRepo: RecipientsRepository) {}

  async execute({
    recipientId,
    name,
    email,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepo.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.email = email

    await this.recipientsRepo.save(recipient)

    return right({ recipient })
  }
}
