import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchNearbyOrdersUseCaseRequest {
  courierLatitude: number
  courierLongitude: number
  page: number
}

type FetchNearbyOrdersUseCaseResponse = Either<never, { orders: Order[] }>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    courierLatitude,
    courierLongitude,
    page,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.ordersRepo.findManyNearby({
      latitude: courierLatitude,
      longitude: courierLongitude,
      page,
    })

    return right({ orders })
  }
}
