import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'tests/repositories/in-memory-admins-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists'
import { RegisterAdminUseCase } from './register-admin'

let fakeHasher: HashGenerator
let adminsRepo: InMemoryAdminsRepository
let sut: RegisterAdminUseCase

describe('RegisterAdmin UseCase', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    adminsRepo = new InMemoryAdminsRepository()
    sut = new RegisterAdminUseCase(fakeHasher, adminsRepo)
  })

  it('should create an admin', async () => {
    const result = await sut.execute({
      name: 'admin-1',
      password: 'admin-1-password',
      cpf: '612361236',
    })

    assert(result.isRight())
    expect(adminsRepo.items).toHaveLength(1)
    expect(adminsRepo.items[0]).toEqual(
      expect.objectContaining({
        id: result.value.admin.id,
      }),
    )
  })

  it('should hash the admin password on register', async () => {
    const result = await sut.execute({
      name: 'admin-1',
      password: 'admin-1-password',
      cpf: '612361236',
    })

    assert(result.isRight())
    expect(result.value.admin.password).toEqual(
      await fakeHasher.hash('admin-1-password'),
    )
  })

  it('should return an error if admin already exists', async () => {
    await sut.execute({
      name: 'admin-1',
      password: 'admin-1-password',
      cpf: '612361236',
    })

    const result = await sut.execute({
      name: 'admin-1',
      password: 'admin-1-password',
      cpf: '612361236',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })
})
