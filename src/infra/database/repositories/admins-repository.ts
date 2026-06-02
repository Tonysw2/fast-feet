import { Injectable } from '@nestjs/common'
import { AdminsRepository } from 'src/domain/delivery/application/repositories/admins-repository'
import { Admin } from 'src/domain/delivery/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { cpf } })
    return admin ? PrismaAdminMapper.toDomain(admin) : null
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { id } })
    return admin ? PrismaAdminMapper.toDomain(admin) : null
  }

  async create(data: Admin): Promise<void> {
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrismaCreate(data),
    })
  }
}
