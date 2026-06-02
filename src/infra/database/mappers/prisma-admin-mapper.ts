import type { AdminModel } from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Admin } from 'src/domain/delivery/enterprise/entities/admin'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'

export class PrismaAdminMapper {
  static toDomain(data: AdminModel): Admin {
    return Admin.create(
      { name: data.name, cpf: CPF.create(data.cpf), password: data.password },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.value,
      password: admin.password,
    }
  }
}
