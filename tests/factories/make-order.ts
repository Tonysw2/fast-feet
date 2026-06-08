import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import {
  Order,
  OrderProps,
} from 'src/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from 'src/infra/database/mappers/prisma-order-mapper'
import { PrismaService } from 'src/infra/database/prisma.service'

export const makeOrder = (
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
): Order => {
  return Order.create(
    {
      courierId: override.courierId ?? null,
      recipientId: override.recipientId ?? new UniqueEntityId(),
      title: override.title ?? faker.lorem.text(),
      attachmentId: override.attachmentId ?? null,
      deliveryLatitude: override.deliveryLatitude ?? faker.location.latitude(),
      deliveryLongitude:
        override.deliveryLongitude ?? faker.location.longitude(),
      status: override.status,
    },
    id,
  )
}

@Injectable()
export class OrderFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeOrder(override: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(override)
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrismaCreate(order),
    })
    return order
  }
}
