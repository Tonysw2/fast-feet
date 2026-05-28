import { AdminsRepository } from 'src/domain/delivery/application/repositories/admins-repository'
import { Admin } from 'src/domain/delivery/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async create(data: Admin): Promise<void> {
    this.items.push(data)
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((a) => a.cpf.value === cpf)

    if (!admin) return null

    return admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.items.find((a) => a.id.toString() === id)

    if (!admin) return null

    return admin
  }
}
