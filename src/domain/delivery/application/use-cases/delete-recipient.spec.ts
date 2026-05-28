import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { ResourceNotFoundError } from './errors/resource-not-found'

let recipientsRepo: InMemoryRecipientsRepository
let sut: DeleteRecipientUseCase

describe('DeleteRecipient UseCase', () => {
  beforeEach(() => {
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new DeleteRecipientUseCase(recipientsRepo)
  })

  it('should delete a recipient', async () => {
    const recipient = Recipient.create({
      name: 'recipient-1',
      email: 'r1@example.com',
    })
    recipientsRepo.items.push(recipient)

    const result = await sut.execute({ recipientId: recipient.id.toString() })

    assert(result.isRight())
    expect(recipientsRepo.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if recipient does not exist', async () => {
    const result = await sut.execute({ recipientId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
