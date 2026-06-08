import { AttachmentsRepository } from 'src/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from 'src/domain/delivery/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }

  async findById(id: string): Promise<Attachment | null> {
    return this.items.find((a) => a.id.toString() === id) ?? null
  }
}
