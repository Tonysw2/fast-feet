import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('CreateOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)

    await prisma.admin.create({
      data: {
        name: 'Test Admin',
        cpf: '11111111101',
        password: await hash('password123', 8),
      },
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '11111111101', password: 'password123' })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'create-order@test.com' } },
    })
    await prisma.recipient.deleteMany({ where: { email: 'create-order@test.com' } })
    await prisma.admin.deleteMany({ where: { cpf: '11111111101' } })
    await app.close()
  })

  it('[POST] /orders — should return 201 with orderId on valid data', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'create-order@test.com' },
    })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Package',
        recipientId: recipient.id,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('orderId')
    expect(typeof response.body.orderId).toBe('string')
  })

  it('[POST] /orders — should return 404 when recipient does not exist', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Package',
        recipientId: randomUUID(),
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(404)
  })

  it('[POST] /orders — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send({
        title: 'Test Package',
        recipientId: randomUUID(),
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(401)
  })
})
