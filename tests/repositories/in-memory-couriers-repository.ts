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
}
