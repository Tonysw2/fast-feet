import type { AttachmentModel } from 'prisma/generated/models'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { Attachment } from 'src/domain/delivery/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
  static toDomain(data: AttachmentModel): Attachment {
    return Attachment.create(
      { title: data.title, url: data.url },
      new UniqueEntityId(data.id),
    )
  }

  static toPrismaCreate(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
