import { Order } from '../../enterprise/entities/order'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
  page: number
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: { page: number }): Promise<Order[]>
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>
  abstract findManyByCourierId(
    courierId: string,
    params: { page: number },
  ): Promise<Order[]>
  abstract create(data: Order): Promise<void>
  abstract save(data: Order): Promise<void>
  abstract delete(data: Order): Promise<void>
}
