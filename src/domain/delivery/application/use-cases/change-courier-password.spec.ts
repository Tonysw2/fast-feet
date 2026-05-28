import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { ChangeCourierPasswordUseCase } from './change-courier-password'
import { ResourceNotFoundError } from './errors/resource-not-found'

let couriersRepo: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let sut: ChangeCourierPasswordUseCase

describe('ChangeCourierPassword UseCase', () => {
  beforeEach(() => {
    couriersRepo = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeCourierPasswordUseCase(couriersRepo, fakeHasher)
  })

  it('should change a courier password', async () => {
    const courier = Courier.create({
      name: 'courier-1',
      cpf: CPF.create('11111111111'),
      password: 'hashed-old-password',
    })
    couriersRepo.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      password: 'new-password',
    })

    assert(result.isRight())
    expect(couriersRepo.items[0].password).toBe('hashed-new-password')
  })

  it('should return ResourceNotFoundError if courier does not exist', async () => {
    const result = await sut.execute({
      courierId: 'non-existent-id',
      password: 'any',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
