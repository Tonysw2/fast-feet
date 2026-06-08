import { Order } from 'src/domain/delivery/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
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
}
