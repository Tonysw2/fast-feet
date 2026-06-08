import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from 'src/domain/delivery/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from 'src/infra/database/mappers/prisma-attachment-mapper'
import { PrismaService } from 'src/infra/database/prisma.service'

export const makeAttachment = (
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
): Attachment => {
  return Attachment.create(
    {
      title: override.title ?? faker.system.fileName(),
      url: override.url ?? faker.internet.url(),
    },
    id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeAttachment(
    override: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(override)
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrismaCreate(attachment),
    })
    return attachment
  }
}
