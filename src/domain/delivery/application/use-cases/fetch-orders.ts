import { Either, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchOrdersUseCaseRequest {
  page: number
}

type FetchOrdersUseCaseResponse = Either<never, { orders: Order[] }>

export class FetchOrdersUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.ordersRepo.findMany({ page })

    return right({ orders })
  }
}
