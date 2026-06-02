import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { PrismaCourierMapper } from 'src/infra/database/mappers/prisma-courier-mapper'
import { PrismaService } from 'src/infra/database/prisma.service'

interface MakeCourierProps {
  name?: string
  cpf?: CPF
  password?: string
}

export const makeCourier = (
  override: MakeCourierProps = {},
  id?: UniqueEntityId,
): Courier => {
  return Courier.create(
    {
      name: override.name ?? faker.person.fullName(),
      cpf: override.cpf ?? CPF.create(faker.string.numeric(11)),
      password: override.password ?? faker.internet.password(),
    },
    id,
  )
}

@Injectable()
export class CourierFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeCourier(override: MakeCourierProps = {}): Promise<Courier> {
    const courier = makeCourier(override)
    await this.prisma.courier.create({
      data: PrismaCourierMapper.toPrismaCreate(courier),
    })
    return courier
  }
}
