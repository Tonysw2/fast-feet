import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { InMemoryRecipientsRepository } from 'tests/repositories/in-memory-recipients-repository'
import { FetchRecipientsUseCase } from './fetch-recipients'

let recipientsRepo: InMemoryRecipientsRepository
let sut: FetchRecipientsUseCase

describe('FetchRecipients UseCase', () => {
  beforeEach(() => {
    recipientsRepo = new InMemoryRecipientsRepository()
    sut = new FetchRecipientsUseCase(recipientsRepo)
  })

  it('should fetch recipients', async () => {
    recipientsRepo.items.push(
      Recipient.create({ name: 'recipient-1', email: 'r1@example.com' }),
      Recipient.create({ name: 'recipient-2', email: 'r2@example.com' }),
    )

    const result = await sut.execute({ page: 1 })

    assert(result.isRight())
    expect(result.value.recipients).toHaveLength(2)
  })

  it('should paginate recipients', async () => {
    for (let i = 1; i <= 22; i++) {
      recipientsRepo.items.push(
        Recipient.create({
          name: `recipient-${i}`,
          email: `r${i}@example.com`,
        }),
      )
    }

    const result = await sut.execute({ page: 2 })

    assert(result.isRight())
    expect(result.value.recipients).toHaveLength(2)
  })
})
