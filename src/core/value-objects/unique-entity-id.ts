export class UniqueEntityId {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  equals(id: UniqueEntityId) {
    return this.value === id.toValue()
  }

  constructor(value?: string) {
    this.value = value ?? crypto.randomUUID()
  }
}
