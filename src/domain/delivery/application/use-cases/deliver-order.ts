import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from './errors/not-allowed'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface DeliverOrderUseCaseRequest {
  orderId: string
  courierId: string
  attachmentId: string
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly attachmentsRepo: AttachmentsRepository,
  ) {}

  async execute({
    orderId,
    courierId,
    attachmentId,
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

    const attachment = await this.attachmentsRepo.findById(attachmentId)

    if (!attachment) {
      return left(new ResourceNotFoundError())
    }

    order.deliver(new UniqueEntityId(attachmentId))

    await this.ordersRepo.save(order)

    return right({ order })
  }
}
