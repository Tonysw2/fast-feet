import { Courier } from '../../enterprise/entities/couriers'

export abstract class CouriersRepository {
  abstract findByCPF(cpf: string): Promise<Courier | null>
  abstract findById(id: string): Promise<Courier | null>
  abstract findMany(params: { page: number }): Promise<Courier[]>
  abstract create(data: Courier): Promise<void>
  abstract save(data: Courier): Promise<void>
  abstract delete(data: Courier): Promise<void>
}
