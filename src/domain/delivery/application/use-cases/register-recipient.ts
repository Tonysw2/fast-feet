import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists'

interface RegisterRecipientUseCaseRequest {
  name: string
  email: string
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  { recipient: Recipient }
>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private readonly recipientsRepo: RecipientsRepository) {}

  async execute({
    name,
    email,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientExists = await this.recipientsRepo.findByEmail(email)

    if (recipientExists) {
      return left(new RecipientAlreadyExistsError(email))
    }

    const recipient = Recipient.create({ name, email })

    await this.recipientsRepo.create(recipient)

    return right({ recipient })
  }
}
