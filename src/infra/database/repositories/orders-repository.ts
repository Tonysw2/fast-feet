import { Injectable } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { DomainEvents } from 'src/core/events/domain-events'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from 'src/domain/delivery/application/repositories/orders-repository'
import { Order } from 'src/domain/delivery/enterprise/entities/order'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

const PAGE_SIZE = 20

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({ where: { id } })
    return order ? PrismaOrderMapper.toDomain(order) : null
  }

  async findMany({ page }: { page: number }): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyNearby({
    latitude,
    longitude,
    page,
  }: FindManyNearbyParams): Promise<Order[]> {
    const offset = (page - 1) * PAGE_SIZE
    const schema =
      new URL(process.env.DATABASE_URL!).searchParams.get('schema') ?? 'public'
    const ordersTable = Prisma.raw(`"${schema}"."orders"`)

    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string
        title: string
        status: string
        photoUrl: string | null
        deliveryLatitude: number
        deliveryLongitude: number
        recipientId: string
        courierId: string | null
        createdAt: Date
        updatedAt: Date
      }>
    >`
      SELECT id, title, status, "photoUrl", "deliveryLatitude", "deliveryLongitude",
             "recipientId", "courierId", "createdAt", "updatedAt"
      FROM ${ordersTable}
      WHERE status = 'WAITING'
        AND (
          6371 * acos(
            LEAST(1.0,
              cos(radians(${latitude})) * cos(radians("deliveryLatitude")) *
              cos(radians("deliveryLongitude") - radians(${longitude})) +
              sin(radians(${latitude})) * sin(radians("deliveryLatitude"))
            )
          )
        ) <= 50
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `

    return rows.map((row) =>
      PrismaOrderMapper.toDomain({
        ...row,
        status: row.status as any,
      }),
    )
  }

  async findManyByCourierId(
    courierId: string,
    { page }: { page: number },
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { courierId },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return orders.map(PrismaOrderMapper.toDomain)
  }

  async create(data: Order): Promise<void> {
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrismaCreate(data),
    })
  }

  async save(data: Order): Promise<void> {
    await this.prisma.order.update(PrismaOrderMapper.toPrismaUpdate(data))
    DomainEvents.dispatchEventsForAggregate(data.id)
  }

  async delete(data: Order): Promise<void> {
    await this.prisma.order.delete({ where: { id: data.id.toString() } })
  }
}
