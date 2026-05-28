import { Either, left, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface ReturnOrderUseCaseRequest {
  orderId: string
  courierId: string
}

type ReturnOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

export class ReturnOrderUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepo.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== 'PICKED_UP') {
      return left(new NotAllowedError())
    }

    if (order.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }

    order.status = 'RETURNED'

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
