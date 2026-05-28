import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { CourierAlreadyExists } from './errors/courier-already-exists'
import { RegisterCourierUseCase } from './register-courier'

let fakeHasher: HashGenerator
let couriersRepo: InMemoryCouriersRepository
let sut: RegisterCourierUseCase

describe('RegisterCourier UseCase', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    couriersRepo = new InMemoryCouriersRepository()
    sut = new RegisterCourierUseCase(fakeHasher, couriersRepo)
  })

  it('should create a courier', async () => {
    const result = await sut.execute({
      name: 'courier-1',
      password: 'courier-1-password',
      cpf: '612361236',
    })

    assert(result.isRight())
    expect(couriersRepo.items).toHaveLength(1)
    expect(couriersRepo.items[0]).toEqual(
      expect.objectContaining({
        id: result.value.courier.id,
      }),
    )
  })

  it('should hash the courier password on register', async () => {
    const result = await sut.execute({
      name: 'courier-1',
      password: 'courier-1-password',
      cpf: '612361236',
    })

    assert(result.isRight())
    expect(result.value.courier.password).toEqual(
      await fakeHasher.hash('courier-1-password'),
    )
  })

  it('should return an error if courier already exists', async () => {
    await sut.execute({
      name: 'courier-1',
      password: 'courier-1-password',
      cpf: '612361236',
    })

    const result = await sut.execute({
      name: 'courier-1',
      password: 'courier-1-password',
      cpf: '612361236',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(CourierAlreadyExists)
  })
})
