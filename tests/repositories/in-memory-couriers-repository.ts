import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository'
import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'

export class InMemoryCouriersRepository implements CouriersRepository {
  public items: Courier[] = []

  async create(data: Courier): Promise<void> {
    this.items.push(data)
  }

  async findByCPF(cpf: string): Promise<Courier | null> {
    const courier = this.items.find((c) => c.cpf.value === cpf)

    if (!courier) return null

    return courier
  }

  async findById(id: string): Promise<Courier | null> {
    const courier = this.items.find((c) => c.id.toString() === id)

    if (!courier) return null

    return courier
  }

  async findMany({ page }: { page: number }): Promise<Courier[]> {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async save(data: Courier): Promise<void> {
    const index = this.items.findIndex((c) => c.id.equals(data.id))
    this.items[index] = data
  }

  async delete(data: Courier): Promise<void> {
    this.items = this.items.filter((c) => !c.id.equals(data.id))
  }
}
