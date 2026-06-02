import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeliverOrderUseCaseRequest {
  orderId: string
  courierId: string
  photoUrl: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
    photoUrl,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
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

    order.deliver(photoUrl)

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
