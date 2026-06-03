import { Courier } from 'src/domain/delivery/enterprise/entities/couriers'

export class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf.value,
    }
  }
}
