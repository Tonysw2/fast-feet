import type { DomainEvent } from 'src/core/events/domain-event'
import type { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import type { Order } from '../entities/order'

export class OrderPickedUpEvent implements DomainEvent {
  occurredAt: Date

  constructor(public readonly order: Order) {
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
