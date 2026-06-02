import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface EditOrderUseCaseRequest {
  orderId: string
  title: string
  recipientId: string
  deliveryLatitude: number
  deliveryLongitude: number
}

type EditOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

@Injectable()
export class EditOrderUseCase {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async execute({
    orderId,
    title,
    recipientId,
    deliveryLatitude,
    deliveryLongitude,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepo.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.title = title
    order.recipientId = new UniqueEntityId(recipientId)
    order.deliveryLatitude = deliveryLatitude
    order.deliveryLongitude = deliveryLongitude

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
