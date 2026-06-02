import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

export interface RecipientProps {
  name: string
  email: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    return new Recipient(props, id)
  }
}
