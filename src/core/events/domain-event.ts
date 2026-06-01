import type { UniqueEntityId } from '../value-objects/unique-entity-id'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityId
}
