import { Either, left, right } from 'src/core/either'
import { Courier } from '../../enterprise/entities/couriers'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface EditCourierUseCaseRequest {
  courierId: string
  name: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>

export class EditCourierUseCase {
  constructor(private readonly couriersRepo: CouriersRepository) {}

  async execute({
    courierId,
    name,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepo.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name

    await this.couriersRepo.save(courier)

    return right({ courier })
  }
}
