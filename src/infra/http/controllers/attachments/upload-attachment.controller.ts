import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { InvalidAttachmentType } from 'src/domain/delivery/application/use-cases/errors/invalid-attachment-type'
import { UploadAttachmentUseCase } from 'src/domain/delivery/application/use-cases/upload-attachment'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(private readonly uploadAttachment: UploadAttachmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const result = await this.uploadAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentType: {
          throw new BadRequestException(error.message)
        }

        default: {
          throw new BadRequestException(error.message)
        }
      }
    }

    return { attachmentId: result.value.attachment.id.toString() }
  }
}
