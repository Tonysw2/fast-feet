import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'

describe('AuthenticateAdminController (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    adminFactory = moduleRef.get(AdminFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /sessions/admin', async () => {
    await adminFactory.makeAdmin({
      cpf: CPF.create('12345678901'),
      password: await hash('password123', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({
        cpf: '12345678901',
        password: 'password123',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })
})
