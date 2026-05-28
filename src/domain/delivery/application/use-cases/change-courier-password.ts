import { HashGenerator } from 'src/core/cryptography/hash-generator'
import { Either, left, right } from 'src/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface ChangeCourierPasswordUseCaseRequest {
  courierId: string
  password: string
}

type ChangeCourierPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  object
>

export class ChangeCourierPasswordUseCase {
  constructor(
    private readonly couriersRepo: CouriersRepository,
    private readonly hasher: HashGenerator,
  ) {}

  async execute({
    courierId,
    password,
  }: ChangeCourierPasswordUseCaseRequest): Promise<ChangeCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepo.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.password = await this.hasher.hash(password)

    await this.couriersRepo.save(courier)

    return right({})
  }
}
