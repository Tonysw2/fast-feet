import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { ResourceNotFoundError } from './errors/resource-not-found'

let recipientsRepo: InMemoryRecipientsRepository
let sut: EditRecipientUseCase

describe('EditRecipient UseCase', () => {
  beforeEach(() => {
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new EditRecipientUseCase(recipientsRepo)
  })

  it('should edit a recipient', async () => {
    const recipient = Recipient.create({
      name: 'recipient-1',
      email: 'r1@example.com',
    })
    recipientsRepo.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'recipient-updated',
      email: 'updated@example.com',
    })

    assert(result.isRight())
    expect(result.value.recipient.name).toBe('recipient-updated')
    expect(result.value.recipient.email).toBe('updated@example.com')
    expect(recipientsRepo.items[0].name).toBe('recipient-updated')
  })

  it('should return ResourceNotFoundError if recipient does not exist', async () => {
    const result = await sut.execute({
      recipientId: 'non-existent-id',
      name: 'any',
      email: 'any@example.com',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
