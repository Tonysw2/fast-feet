import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { InMemoryCouriersRepository } from 'tests/repositories/in-memory-couriers-repository'
import { FetchCouriersUseCase } from './fetch-couriers'

let couriersRepo: InMemoryCouriersRepository
let sut: FetchCouriersUseCase

describe('FetchCouriers UseCase', () => {
  beforeEach(() => {
    couriersRepo = new InMemoryCouriersRepository()
    sut = new FetchCouriersUseCase(couriersRepo)
  })

  it('should fetch couriers', async () => {
    couriersRepo.items.push(
      Courier.create({
        name: 'courier-1',
        cpf: CPF.create('11111111111'),
        password: 'hashed',
      }),
      Courier.create({
        name: 'courier-2',
        cpf: CPF.create('22222222222'),
        password: 'hashed',
      }),
    )

    const result = await sut.execute({ page: 1 })

    assert(result.isRight())
    expect(result.value.couriers).toHaveLength(2)
  })

  it('should paginate couriers', async () => {
    for (let i = 1; i <= 22; i++) {
      couriersRepo.items.push(
        Courier.create({
          name: `courier-${i}`,
          cpf: CPF.create(String(i).padStart(11, '0')),
          password: 'hashed',
        }),
      )
    }

    const result = await sut.execute({ page: 2 })

    assert(result.isRight())
    expect(result.value.couriers).toHaveLength(2)
  })
})
