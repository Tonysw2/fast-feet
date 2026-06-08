import { UseCaseError } from 'src/core/errors/use-case'

export class InvalidAttachmentType extends Error implements UseCaseError {
  constructor(fileType: string) {
    super(`File type "${fileType}" is not valid.`)
  }
}
