import { UseCaseError } from 'src/core/errors/use-case'

export class AdminAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Admin ${identifier} already exists.`)
  }
}
