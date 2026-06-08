import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    return new Attachment(props, id)
  }
}
