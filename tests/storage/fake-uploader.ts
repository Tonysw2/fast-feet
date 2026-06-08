import {
  Uploader,
  UploaderParams,
} from 'src/domain/delivery/application/storage/uploader'

export class FakeUploader implements Uploader {
  public uploads: UploaderParams[] = []

  async upload(params: UploaderParams): Promise<{ url: string }> {
    this.uploads.push(params)
    return { url: `https://example.com/${params.fileName}` }
  }
}
