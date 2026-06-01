import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/value-objects/unique-entity-id'

export type OrderStatus = 'WAITING' | 'PICKED_UP' | 'DELIVERED' | 'RETURNED'

interface OrderProps {
  title: string
  status: OrderStatus
  recipientId: UniqueEntityId
  courierId: UniqueEntityId | null
  photoUrl: string | null
  deliveryLatitude: number
  deliveryLongitude: number
}

export class Order extends Entity<OrderProps> {
  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
  }

  get status() {
    return this.props.status
  }

  set status(value: OrderStatus) {
    this.props.status = value
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

  set courierId(value: UniqueEntityId | null) {
    this.props.courierId = value
  }

  get photoUrl() {
    return this.props.photoUrl
  }

  set photoUrl(value: string | null) {
    this.props.photoUrl = value
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

  static create(
    props: Omit<OrderProps, 'status'> & { status?: OrderStatus },
    id?: UniqueEntityId,
  ) {
    return new Order({ ...props, status: props.status ?? 'WAITING' }, id)
  }
}
