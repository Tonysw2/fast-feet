import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadAttachmentUseCase } from 'src/domain/delivery/application/use-cases/upload-attachment'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private readonly uploadAttachment: UploadAttachmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const result = await this.uploadAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return { attachmentId: result.value.attachment.id.toString() }
  }
}
