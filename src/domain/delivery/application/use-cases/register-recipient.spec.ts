import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists'
import { RegisterRecipientUseCase } from './register-recipient'

let recipientsRepo: InMemoryRecipientsRepository
let sut: RegisterRecipientUseCase

describe('RegisterRecipient UseCase', () => {
  beforeEach(() => {
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new RegisterRecipientUseCase(recipientsRepo)
  })

  it('should create a recipient', async () => {
    const result = await sut.execute({
      name: 'recipient-1',
      email: 'recipient-1@example.com',
    })

    assert(result.isRight())
    expect(recipientsRepo.items).toHaveLength(1)
    expect(recipientsRepo.items[0]).toEqual(result.value.recipient)
  })

  it('should return an error if recipient already exists', async () => {
    await sut.execute({
      name: 'recipient-1',
      email: 'recipient-1@example.com',
    })

    const result = await sut.execute({
      name: 'recipient-1',
      email: 'recipient-1@example.com',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })
})
