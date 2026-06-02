import { DomainEvents } from 'src/core/events/domain-events'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from 'src/domain/delivery/application/repositories/orders-repository'
import { Order } from 'src/domain/delivery/enterprise/entities/order'

function getDistanceInKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((o) => o.id.toString() === id)

    if (!order) return null

    return order
  }

  async findMany({ page }: { page: number }): Promise<Order[]> {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({
    latitude,
    longitude,
    page,
  }: FindManyNearbyParams): Promise<Order[]> {
    return this.items
      .filter(
        (o) =>
          o.status === 'WAITING' &&
          getDistanceInKm(
            latitude,
            longitude,
            o.deliveryLatitude,
            o.deliveryLongitude,
          ) <= 50,
      )
      .slice((page - 1) * 20, page * 20)
  }

  async findManyByCourierId(
    courierId: string,
    { page }: { page: number },
  ): Promise<Order[]> {
    return this.items
      .filter(
        (o) =>
          o.status === 'DELIVERED' && o.courierId?.toString() === courierId,
      )
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Order): Promise<void> {
    this.items.push(data)
  }

  async save(data: Order): Promise<void> {
    const index = this.items.findIndex((o) => o.id.equals(data.id))
    this.items[index] = data
    DomainEvents.dispatchEventsForAggregate(data.id)
  }

  async delete(data: Order): Promise<void> {
    this.items = this.items.filter((o) => !o.id.equals(data.id))
  }
}
