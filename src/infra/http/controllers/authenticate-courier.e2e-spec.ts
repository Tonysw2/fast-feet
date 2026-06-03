import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/infra/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('AuthenticateCourierController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)
  })

  afterAll(async () => {
    await prisma.courier.deleteMany({
      where: { cpf: { in: ['98765432101', '98765432102'] } },
    })
    await app.close()
  })

  it('[POST] /sessions â€” should return 201 with an accessToken on valid credentials', async () => {
    await prisma.courier.create({
      data: {
        name: 'Test Courier',
        cpf: '98765432101',
        password: await hash('password123', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '98765432101', password: 'password123' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(typeof response.body.accessToken).toBe('string')
  })

  it('[POST] /sessions â€” should return 401 when courier does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '00000000000', password: 'password123' })

    expect(response.statusCode).toBe(401)
  })

  it('[POST] /sessions â€” should return 401 when password is wrong', async () => {
    await prisma.courier.create({
      data: {
        name: 'Test Courier 2',
        cpf: '98765432102',
        password: await hash('password123', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '98765432102', password: 'wrongpassword' })

    expect(response.statusCode).toBe(401)
  })
})
