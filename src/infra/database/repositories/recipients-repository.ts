import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from 'src/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaService } from '../prisma.service'

const PAGE_SIZE = 20

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({ where: { id } })
    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { email },
    })
    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async findMany({ page }: { page: number }): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    })
    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async create(data: Recipient): Promise<void> {
    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrismaCreate(data),
    })
  }

  async save(data: Recipient): Promise<void> {
    await this.prisma.recipient.update(
      PrismaRecipientMapper.toPrismaUpdate(data),
    )
  }

  async delete(data: Recipient): Promise<void> {
    await this.prisma.recipient.delete({ where: { id: data.id.toString() } })
  }
}
