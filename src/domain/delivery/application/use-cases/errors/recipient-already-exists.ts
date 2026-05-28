import { UseCaseError } from 'src/core/errors/use-case'

export class RecipientAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Recipient ${identifier} already exists.`)
  }
}
