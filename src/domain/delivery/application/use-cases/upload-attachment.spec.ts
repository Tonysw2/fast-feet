import { InMemoryAttachmentsRepository } from 'tests/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'tests/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { UploadAttachmentUseCase } from './upload-attachment'

let attachmentsRepo: InMemoryAttachmentsRepository
let uploader: FakeUploader
let sut: UploadAttachmentUseCase

describe('UploadAttachment UseCase', () => {
  beforeEach(() => {
    attachmentsRepo = new InMemoryAttachmentsRepository()
    uploader = new FakeUploader()
    sut = new UploadAttachmentUseCase(attachmentsRepo, uploader)
  })

  it('should upload an attachment and return it', async () => {
    const result = await sut.execute({
      fileName: 'photo.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from('fake-content'),
    })

    assert(result.isRight())
    expect(result.value.attachment.title).toBe('photo.jpg')
    expect(result.value.attachment.url).toBe('https://example.com/photo.jpg')
    expect(attachmentsRepo.items).toHaveLength(1)
    expect(uploader.uploads).toHaveLength(1)
  })

  it('should return error for invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      body: Buffer.from('fake-content'),
    })

    assert(result.isLeft())
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
    expect(attachmentsRepo.items).toHaveLength(0)
  })
})
