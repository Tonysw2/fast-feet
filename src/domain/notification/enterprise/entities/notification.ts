import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Omit<NotificationProps, 'readAt' | 'createdAt'> & {
      readAt?: Date | null
      createdAt?: Date
    },
    id?: UniqueEntityId,
  ) {
    return new Notification(
      {
        ...props,
        readAt: props.readAt ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
