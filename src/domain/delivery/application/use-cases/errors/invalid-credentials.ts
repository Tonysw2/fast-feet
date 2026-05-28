import { UseCaseError } from 'src/core/errors/use-case'

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Invalid credentials.')
  }
}
