import { Courier } from '../../enterprise/entities/couriers'

export abstract class CouriersRepository {
	abstract findByCPF(cpf: string): Promise<Courier | null>
	abstract create(data: Courier): Promise<void>
}
