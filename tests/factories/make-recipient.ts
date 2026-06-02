import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from 'src/domain/delivery/enterprise/entities/recipient'
import { PrismaRecipientMapper } from 'src/infra/database/mappers/prisma-recipient-mapper'
import { PrismaService } from 'src/infra/database/prisma.service'

export const makeRecipient = (
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) => {
  return Recipient.create(
    {
      name: override.name ?? faker.person.fullName(),
      email: override.email ?? faker.internet.email(),
    },
    id,
  )
}

@Injectable()
export class RecipientFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeRecipient(
    override: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(override)
    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrismaCreate(recipient),
    })
    return recipient
  }
}
