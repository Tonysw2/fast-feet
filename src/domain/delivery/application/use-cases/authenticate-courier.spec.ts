import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { AuthenticateCourierUseCase } from './authenticate-courier'
import { InvalidCredentialsError } from './errors/invalid-credentials'

let couriersRepo: InMemoryCouriersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateCourierUseCase

describe('AuthenticateCourier UseCase', () => {
  beforeEach(() => {
    couriersRepo = new InMemoryCouriersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierUseCase(
      couriersRepo,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should authenticate a courier', async () => {
    const courier = Courier.create({
      name: 'courier-1',
      cpf: CPF.create('61236123600'),
      password: await fakeHasher.hash('courier-1-password'),
    })

    couriersRepo.items.push(courier)

    const result = await sut.execute({
      cpf: '61236123600',
      password: 'courier-1-password',
    })

    assert(result.isRight())
    expect(result.value.accessToken).toEqual(
      JSON.stringify({ sub: courier.id.toString() }),
    )
  })

  it('should return InvalidCredentialsError if courier is not found', async () => {
    const result = await sut.execute({
      cpf: '00000000000',
      password: 'any-password',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return InvalidCredentialsError if password is wrong', async () => {
    const courier = Courier.create({
      name: 'courier-1',
      cpf: CPF.create('61236123600'),
      password: await fakeHasher.hash('courier-1-password'),
    })

    couriersRepo.items.push(courier)

    const result = await sut.execute({
      cpf: '61236123600',
      password: 'wrong-password',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
