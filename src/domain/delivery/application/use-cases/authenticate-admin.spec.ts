import { Admin } from 'src/domain/delivery/enterprise/entities/admin'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { InvalidCredentialsError } from './errors/invalid-credentials'

let adminsRepo: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateAdminUseCase

describe('AuthenticateAdmin UseCase', () => {
  beforeEach(() => {
    adminsRepo = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminUseCase(adminsRepo, fakeHasher, fakeEncrypter)
  })

  it('should authenticate an admin', async () => {
    const admin = Admin.create({
      name: 'admin-1',
      cpf: CPF.create('61236123600'),
      password: await fakeHasher.hash('admin-1-password'),
    })

    adminsRepo.items.push(admin)

    const result = await sut.execute({
      cpf: '61236123600',
      password: 'admin-1-password',
    })

    assert(result.isRight())
    expect(result.value.accessToken).toEqual(
      JSON.stringify({ sub: admin.id.toString(), role: 'ADMIN' }),
    )
  })

  it('should return InvalidCredentialsError if admin is not found', async () => {
    const result = await sut.execute({
      cpf: '00000000000',
      password: 'any-password',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return InvalidCredentialsError if password is wrong', async () => {
    const admin = Admin.create({
      name: 'admin-1',
      cpf: CPF.create('61236123600'),
      password: await fakeHasher.hash('admin-1-password'),
    })

    adminsRepo.items.push(admin)

    const result = await sut.execute({
      cpf: '61236123600',
      password: 'wrong-password',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
