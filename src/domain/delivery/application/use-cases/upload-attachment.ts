import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

interface UploadAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAttachmentUseCaseResponse = Either<Error, { attachment: Attachment }>

const ALLOWED_MIME_TYPES_RGX = /^image\/(png|jpg|jpeg)$/

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private readonly attachmentsRepo: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAttachmentUseCaseRequest): Promise<UploadAttachmentUseCaseResponse> {
    if (!ALLOWED_MIME_TYPES_RGX.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({ body, fileName, fileType })

    const attachment = Attachment.create({ title: fileName, url })

    await this.attachmentsRepo.create(attachment)

    return right({ attachment })
  }
}
