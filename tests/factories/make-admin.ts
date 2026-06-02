import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import {
  Admin,
  AdminProps,
} from 'src/domain/delivery/enterprise/entities/admin'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaAdminMapper } from 'src/infra/database/mappers/prisma-admin-mapper'
import { PrismaService } from 'src/infra/database/prisma.service'

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityId,
): Admin => {
  return Admin.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? CPF.create(faker.string.numeric(11)),
      password: override.password ?? faker.internet.password(),
    },
    id,
  )
}

@Injectable()
export class AdminFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeAdmin(override: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(override)
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrismaCreate(admin),
    })
    return admin
  }
}
