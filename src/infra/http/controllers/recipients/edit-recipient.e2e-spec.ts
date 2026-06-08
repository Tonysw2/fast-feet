import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('EditRecipientController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[PUT] /recipients/:id', async () => {
    const admin = await adminFactory.makeAdmin()
    const recipient = await recipientFactory.makeRecipient()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Updated Name', email: 'updated@example.com' })

    expect(response.statusCode).toBe(204)
  })
})
