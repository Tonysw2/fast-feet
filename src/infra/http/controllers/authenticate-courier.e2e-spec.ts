import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { CPF } from 'src/domain/delivery/enterprise/entities/value-objects/cpf'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { CourierFactory } from 'tests/factories/make-courier'

describe('AuthenticateCourierController (E2E)', () => {
  let app: INestApplication
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    courierFactory = moduleRef.get(CourierFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /sessions – should return 201 with an accessToken on valid credentials', async () => {
    await courierFactory.makeCourier({
      cpf: CPF.create('98765432101'),
      password: await hash('password123', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '98765432101', password: 'password123' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(typeof response.body.accessToken).toBe('string')
  })
})
