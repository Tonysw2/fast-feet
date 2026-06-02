import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeleteCourierUseCaseRequest {
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteCourierUseCase {
  constructor(private readonly couriersRepo: CouriersRepository) {}

  async execute({
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepo.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepo.delete(courier)

    return right({})
  }
}
