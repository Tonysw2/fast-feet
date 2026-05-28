import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { EditCourierUseCase } from './edit-courier'
import { ResourceNotFoundError } from './errors/resource-not-found'

let couriersRepo: InMemoryCouriersRepository
let sut: EditCourierUseCase

describe('EditCourier UseCase', () => {
  beforeEach(() => {
    couriersRepo = new InMemoryCouriersRepository()
    sut = new EditCourierUseCase(couriersRepo)
  })

  it('should edit a courier', async () => {
    const courier = Courier.create({
      name: 'courier-1',
      cpf: CPF.create('11111111111'),
      password: 'hashed',
    })
    couriersRepo.items.push(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      name: 'courier-updated',
    })

    assert(result.isRight())
    expect(result.value.courier.name).toBe('courier-updated')
    expect(couriersRepo.items[0].name).toBe('courier-updated')
  })

  it('should return ResourceNotFoundError if courier does not exist', async () => {
    const result = await sut.execute({
      courierId: 'non-existent-id',
      name: 'any',
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
