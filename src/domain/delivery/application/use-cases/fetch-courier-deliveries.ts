import { Either, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchCourierDeliveriesUseCaseRequest {
  courierId: string
  page: number
}

type FetchCourierDeliveriesUseCaseResponse = Either<never, { orders: Order[] }>

export class FetchCourierDeliveriesUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    courierId,
    page,
  }: FetchCourierDeliveriesUseCaseRequest): Promise<FetchCourierDeliveriesUseCaseResponse> {
    const orders = await this.ordersRepo.findManyByCourierId(courierId, {
      page,
    })

    return right({ orders })
  }
}
