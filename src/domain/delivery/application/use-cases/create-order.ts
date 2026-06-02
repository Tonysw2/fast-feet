import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface CreateOrderUseCaseRequest {
  title: string
  recipientId: string
  deliveryLatitude: number
  deliveryLongitude: number
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly recipientsRepo: RecipientsRepository,
  ) {}

  async execute({
    title,
    recipientId,
    deliveryLatitude,
    deliveryLongitude,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepo.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = Order.create({
      title,
      recipientId: new UniqueEntityId(recipientId),
      courierId: null,
      photoUrl: null,
      deliveryLatitude,
      deliveryLongitude,
    })

    await this.ordersRepo.create(order)

    return right({ order })
  }
}
