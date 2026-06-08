import type { OrderModel } from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import {
  Order,
  type OrderStatus,
} from 'src/domain/delivery/enterprise/entities/order'

export class PrismaOrderMapper {
  static toDomain(data: OrderModel): Order {
    return Order.create(
      {
        title: data.title,
        status: data.status as OrderStatus,
        recipientId: new UniqueEntityId(data.recipientId),
        courierId: data.courierId ? new UniqueEntityId(data.courierId) : null,
        attachmentId: data.attachmentId
          ? new UniqueEntityId(data.attachmentId)
          : null,
        deliveryLatitude: data.deliveryLatitude,
        deliveryLongitude: data.deliveryLongitude,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(order: Order) {
    return {
      id: order.id.toString(),
      title: order.title,
      status: order.status,
      recipientId: order.recipientId.toString(),
      courierId: order.courierId?.toString() ?? null,
      attachmentId: order.attachmentId?.toString() ?? null,
      deliveryLatitude: order.deliveryLatitude,
      deliveryLongitude: order.deliveryLongitude,
    }
  }

  static toPrismaUpdate(order: Order) {
    return {
      where: { id: order.id.toString() },
      data: {
        title: order.title,
        status: order.status,
        recipientId: order.recipientId.toString(),
        courierId: order.courierId?.toString() ?? null,
        attachmentId: order.attachmentId?.toString() ?? null,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
      },
    }
  }
}
