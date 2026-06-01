import { UniqueEntityId } from '../value-objects/unique-entity-id'

export class Entity<Props> {
  private _id: UniqueEntityId
  protected props: Props

  get id() {
    return this._id
  }

  equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id.equals(this._id)) {
      return true
    }

    return false
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }
}
