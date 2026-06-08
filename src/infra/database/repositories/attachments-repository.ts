import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from 'src/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from 'src/domain/delivery/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrismaCreate(attachment)
    await this.prisma.attachment.create({ data })
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    })

    if (!attachment) return null

    return PrismaAttachmentMapper.toDomain(attachment)
  }
}
