import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findMany(params: { page: number }): Promise<Recipient[]>
  abstract create(data: Recipient): Promise<void>
  abstract save(data: Recipient): Promise<void>
  abstract delete(data: Recipient): Promise<void>
}
