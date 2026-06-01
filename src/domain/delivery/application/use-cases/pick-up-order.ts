import { Either, left, right } from 'src/core/either'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface PickUpOrderUseCaseRequest {
  orderId: string
  courierId: string
}

type PickUpOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

export class PickUpOrderUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const order = await this.ordersRepo.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== 'WAITING') {
      return left(new NotAllowedError())
    }

    order.pickUp(new UniqueEntityId(courierId))

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
