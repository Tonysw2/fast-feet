import { Either, left, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface MarkOrderAsWaitingUseCaseRequest {
  orderId: string
}

type MarkOrderAsWaitingUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

export class MarkOrderAsWaitingUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    orderId,
  }: MarkOrderAsWaitingUseCaseRequest): Promise<MarkOrderAsWaitingUseCaseResponse> {
    const order = await this.ordersRepo.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== 'RETURNED') {
      return left(new NotAllowedError())
    }

    order.status = 'WAITING'
    order.courierId = null

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
