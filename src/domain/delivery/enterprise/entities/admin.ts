import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { CPF } from './value-objects/cpf'

export interface AdminProps {
  name: string
  cpf: CPF
  password: string
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role(): 'ADMIN' {
    return 'ADMIN'
  }

  static create(props: AdminProps, id?: UniqueEntityId) {
    return new Admin(props, id)
  }
}
