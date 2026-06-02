import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('GetOrderController (E2E)', () => {
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
        cpf: '11111111103',
        password: await hash('password123', 8),
      },
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '11111111103', password: 'password123' })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'get-order@test.com' } },
    })
    await prisma.recipient.deleteMany({ where: { email: 'get-order@test.com' } })
    await prisma.admin.deleteMany({ where: { cpf: '11111111103' } })
    await app.close()
  })

  it('[GET] /orders/:id — should return 200 with order data', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'get-order@test.com' },
    })

    const order = await prisma.order.create({
      data: {
        title: 'Test Package',
        recipientId: recipient.id,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('order')
    expect(response.body.order.id).toBe(order.id)
    expect(response.body.order.title).toBe('Test Package')
    expect(response.body.order.status).toBe('WAITING')
    expect(response.body.order.recipientId).toBe(recipient.id)
    expect(response.body.order.courierId).toBeNull()
    expect(response.body.order.photoUrl).toBeNull()
    expect(response.body.order.deliveryLatitude).toBe(-23.55052)
    expect(response.body.order.deliveryLongitude).toBe(-46.633309)
  })

  it('[GET] /orders/:id — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[GET] /orders/:id — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).get(`/orders/${randomUUID()}`)

    expect(response.statusCode).toBe(401)
  })
})
