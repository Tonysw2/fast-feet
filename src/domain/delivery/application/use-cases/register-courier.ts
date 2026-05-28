import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { Either, left, right } from 'src/core/either'
import { Courier } from '../../enterprise/entities/couriers'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { CouriersRepository } from '../repositories/couriers-repository'
import { CourierAlreadyExists } from './errors/courier-already-exists'

interface RegisterCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type RegisterCourierUseCaseResponse = Either<
  CourierAlreadyExists,
  { courier: Courier }
>

export class RegisterCourierUseCase {
  constructor(
    private readonly hasher: HashGenerator,
    private readonly couriersRepo: CouriersRepository,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: RegisterCourierUseCaseRequest): Promise<RegisterCourierUseCaseResponse> {
    const courierExists = await this.couriersRepo.findByCPF(cpf)

    if (courierExists) {
      return left(new CourierAlreadyExists(cpf))
    }

    const hashedPassword = await this.hasher.hash(password)

    const courier = Courier.create({
      name,
      password: hashedPassword,
      cpf: CPF.create(cpf),
    })

    await this.couriersRepo.create(courier)

    return right({ courier })
  }
}
