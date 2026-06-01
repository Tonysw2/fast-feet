import { Injectable } from '@nestjs/common'
import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository'
import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'
import { PrismaService } from '../prisma.service'

const PAGE_SIZE = 20

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({ where: { cpf } })
    return courier ? PrismaCourierMapper.toDomain(courier) : null
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({ where: { id } })
    return courier ? PrismaCourierMapper.toDomain(courier) : null
  }

  async findMany({ page }: { page: number }): Promise<Courier[]> {
    const couriers = await this.prisma.courier.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return couriers.map(PrismaCourierMapper.toDomain)
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrismaCreate(courier)

    await this.prisma.courier.create({
      data,
    })
  }

  async save(courier: Courier): Promise<void> {
    await this.prisma.courier.update(
      PrismaCourierMapper.toPrismaUpdate(courier),
    )
  }

  async delete(courier: Courier): Promise<void> {
    await this.prisma.courier.delete({ where: { id: courier.id.toString() } })
  }
}
