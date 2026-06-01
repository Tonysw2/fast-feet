import {
  CourierCreateInput,
  CourierModel,
  CourierUpdateArgs,
} from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'

export class PrismaCourierMapper {
  static toDomain(data: CourierModel): Courier {
    return Courier.create(
      {
        name: data.name,
        cpf: CPF.create(data.cpf),
        password: data.password,
      },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(data: Courier): CourierCreateInput {
    return {
      id: data.id.toString(),
      cpf: data.cpf.value,
      name: data.name,
      password: data.password,
    }
  }

  static toPrismaUpdate(courier: Courier): CourierUpdateArgs {
    return {
      where: {
        id: courier.id.toString(),
      },

      data: {
        name: courier.name,
        password: courier.password,
      },
    }
  }
}
