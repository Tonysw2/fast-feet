import { UseCaseError } from 'src/core/errors/use-case'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed.')
  }
}
