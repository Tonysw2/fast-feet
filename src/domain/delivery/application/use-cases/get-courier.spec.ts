import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetCourierUseCase } from './get-courier'

let couriersRepo: InMemoryCouriersRepository
let sut: GetCourierUseCase

describe('GetCourier UseCase', () => {
  beforeEach(() => {
    couriersRepo = new InMemoryCouriersRepository()
    sut = new GetCourierUseCase(couriersRepo)
  })

  it('should get a courier by id', async () => {
    const courier = Courier.create({
      name: 'courier-1',
      cpf: CPF.create('11111111111'),
      password: 'hashed',
    })
    couriersRepo.items.push(courier)

    const result = await sut.execute({ courierId: courier.id.toString() })

    assert(result.isRight())
    expect(result.value.courier.id).toEqual(courier.id)
  })

  it('should return ResourceNotFoundError if courier does not exist', async () => {
    const result = await sut.execute({ courierId: 'non-existent-id' })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
