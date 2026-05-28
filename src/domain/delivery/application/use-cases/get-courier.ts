import { Either, left, right } from 'src/core/either'
import { Courier } from '../../enterprise/entities/couriers'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetCourierUseCaseRequest {
  courierId: string
}

type GetCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>

export class GetCourierUseCase {
  constructor(private readonly couriersRepo: CouriersRepository) {}

  async execute({
    courierId,
  }: GetCourierUseCaseRequest): Promise<GetCourierUseCaseResponse> {
    const courier = await this.couriersRepo.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    return right({ courier })
  }
}
