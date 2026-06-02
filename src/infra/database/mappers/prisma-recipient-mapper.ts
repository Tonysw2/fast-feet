import type { RecipientModel } from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'

export class PrismaRecipientMapper {
  static toDomain(data: RecipientModel): Recipient {
    return Recipient.create(
      { name: data.name, email: data.email },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
    }
  }

  static toPrismaUpdate(recipient: Recipient) {
    return {
      where: { id: recipient.id.toString() },
      data: { name: recipient.name, email: recipient.email },
    }
  }
}
