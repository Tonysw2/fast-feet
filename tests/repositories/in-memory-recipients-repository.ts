import { RecipientsRepository } from 'src/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from 'src/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((r) => r.id.toString() === id)

    if (!recipient) return null

    return recipient
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.items.find((r) => r.email === email)

    if (!recipient) return null

    return recipient
  }

  async findMany({ page }: { page: number }): Promise<Recipient[]> {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async create(data: Recipient): Promise<void> {
    this.items.push(data)
  }

  async save(data: Recipient): Promise<void> {
    const index = this.items.findIndex((r) => r.id.equals(data.id))
    this.items[index] = data
  }

  async delete(data: Recipient): Promise<void> {
    this.items = this.items.filter((r) => !r.id.equals(data.id))
  }
}
