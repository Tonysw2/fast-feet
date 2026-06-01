import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityId } from '../value-objects/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  occurredAt: Date
  private _aggregateId: UniqueEntityId

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date()
    this._aggregateId = aggregate.id
  }

  getAggregateId(): UniqueEntityId {
    return this._aggregateId
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('domain events', () => {
  beforeEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
