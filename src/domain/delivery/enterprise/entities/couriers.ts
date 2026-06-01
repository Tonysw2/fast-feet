import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { CPF } from './value-objects/cpf'

interface CourierProps {
  name: string
  cpf: CPF
  password: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
  }

  get role(): 'COURIER' {
    return 'COURIER'
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    return new Courier(props, id)
  }
}
