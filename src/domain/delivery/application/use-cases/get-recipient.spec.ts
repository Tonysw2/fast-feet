import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetRecipientUseCase } from './get-recipient'

let recipientsRepo: InMemoryRecipientsRepository
let sut: GetRecipientUseCase

describe('GetRecipient UseCase', () => {
  beforeEach(() => {
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new GetRecipientUseCase(recipientsRepo)
  })

  it('should get a recipient by id', async () => {
    const recipient = Recipient.create({
      name: 'recipient-1',
      email: 'r1@example.com',
    })
    recipientsRepo.items.push(recipient)

    const result = await sut.execute({ recipientId: recipient.id.toString() })

    assert(result.isRight())
    expect(result.value.recipient.id).toEqual(recipient.id)
  })

  it('should return ResourceNotFoundError if recipient does not exist', async () => {
    const result = await sut.execute({ recipientId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
