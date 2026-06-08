import { join } from 'node:path'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'

describe('UploadAttachmentController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /attachments - should upload a file and return attachmentId', async () => {
    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', join(__dirname, '../../../../tests/assets/img1-min.png'))

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        attachmentId: expect.any(String),
      }),
    )
  })

  it('[POST] /attachments - should return 400 when no file is sent', async () => {
    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)
  })

  it('[POST] /attachments - should return 400 when file type is invalid', async () => {
    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('fake-pdf-content'), {
        filename: 'document.pdf',
        contentType: 'application/pdf',
      })

    expect(response.statusCode).toBe(400)
  })
})
