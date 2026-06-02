import { Optional } from 'src/core/@types/optional'
import { AggregateRoot } from 'src/core/entities/aggregate-root'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'
import { OrderDeliveredEvent } from '../events/order-delivered-event'
import { OrderPickedUpEvent } from '../events/order-picked-up-event'
import { OrderReturnedEvent } from '../events/order-returned-event'
import { OrderWaitingEvent } from '../events/order-waiting-event'

export type OrderStatus = 'WAITING' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED'

export interface OrderProps {
  title: string
  status: OrderStatus
  recipientId: UniqueEntityId
  deliveryLatitude: number
  deliveryLongitude: number
  photoUrl?: string | null
  courierId?: UniqueEntityId | null
}

export class Order extends AggregateRoot<OrderProps> {
  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
  }

  get status() {
    return this.props.status
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(value: UniqueEntityId) {
    this.props.recipientId = value
  }

  get courierId() {
    return this.props.courierId
  }

  get photoUrl() {
    return this.props.photoUrl
  }

  get deliveryLatitude() {
    return this.props.deliveryLatitude
  }

  set deliveryLatitude(value: number) {
    this.props.deliveryLatitude = value
  }

  get deliveryLongitude() {
    return this.props.deliveryLongitude
  }

  set deliveryLongitude(value: number) {
    this.props.deliveryLongitude = value
  }

  markAsWaiting() {
    this.props.status = 'WAITING'
    this.props.courierId = null
    this.addDomainEvent(new OrderWaitingEvent(this))
  }

  pickUp(courierId: UniqueEntityId) {
    this.props.status = 'PICKED_UP'
    this.props.courierId = courierId
    this.addDomainEvent(new OrderPickedUpEvent(this))
  }

  deliver(photoUrl: string) {
    this.props.status = 'DELIVERED'
    this.props.photoUrl = photoUrl
    this.addDomainEvent(new OrderDeliveredEvent(this))
  }

  returnOrder() {
    this.props.status = 'RETURNED'
    this.addDomainEvent(new OrderReturnedEvent(this))
  }

  static create(props: Optional<OrderProps, 'status'>, id?: UniqueEntityId) {
    return new Order(
      {
        ...props,
        status: props.status ?? 'WAITING',
      },
      id,
    )
  }
}
