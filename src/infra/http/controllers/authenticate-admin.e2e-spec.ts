import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('AuthenticateAdminController (E2E)', () => {
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
    await prisma.admin.deleteMany({
      where: { cpf: { in: ['12345678901', '12345678902'] } },
    })
    await app.close()
  })

  it('[POST] /sessions/admin — should return 201 with an accessToken on valid credentials', async () => {
    await prisma.admin.create({
      data: {
        name: 'Test Admin',
        cpf: '12345678901',
        password: await hash('password123', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '12345678901', password: 'password123' })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('accessToken')
    expect(typeof response.body.accessToken).toBe('string')
  })

  it('[POST] /sessions/admin — should return 401 when admin does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '00000000000', password: 'password123' })

    expect(response.statusCode).toBe(401)
  })

  it('[POST] /sessions/admin — should return 401 when password is wrong', async () => {
    await prisma.admin.create({
      data: {
        name: 'Test Admin 2',
        cpf: '12345678902',
        password: await hash('password123', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '12345678902', password: 'wrongpassword' })

    expect(response.statusCode).toBe(401)
  })
})
