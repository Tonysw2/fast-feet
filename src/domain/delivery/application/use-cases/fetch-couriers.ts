import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { Courier } from '../../enterprise/entities/couriers'
import { CouriersRepository } from '../repositories/couriers-repository'

interface FetchCouriersUseCaseRequest {
  page: number
}

type FetchCouriersUseCaseResponse = Either<never, { couriers: Courier[] }>

@Injectable()
export class FetchCouriersUseCase {
  constructor(private readonly couriersRepo: CouriersRepository) {}

  async execute({
    page,
  }: FetchCouriersUseCaseRequest): Promise<FetchCouriersUseCaseResponse> {
    const couriers = await this.couriersRepo.findMany({ page })

    return right({ couriers })
  }
}
