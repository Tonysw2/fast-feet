import { InMemoryNotificationsRepository } from 'tests/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepo: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('SendNotification UseCase', () => {
  beforeEach(() => {
    notificationsRepo = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepo)
  })

  it('should send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      title: 'Encomenda entregue',
      content: 'Sua encomenda foi entregue.',
    })

    assert(result.isRight())
    expect(notificationsRepo.items).toHaveLength(1)
    expect(notificationsRepo.items[0]).toEqual(result.value.notification)
  })
})
