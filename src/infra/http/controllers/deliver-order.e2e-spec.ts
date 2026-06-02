import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('DeliverOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let courierAccessToken: string
  let courierId: string
  let otherCourierAccessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)

    const courier = await prisma.courier.create({
      data: {
        name: 'Test Courier',
        cpf: '21111111102',
        password: await hash('password123', 8),
      },
    })

    courierId = courier.id

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '21111111102', password: 'password123' })

    courierAccessToken = loginResponse.body.accessToken

    await prisma.courier.create({
      data: {
        name: 'Other Courier',
        cpf: '21111111109',
        password: await hash('password123', 8),
      },
    })

    const otherLoginResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({ cpf: '21111111109', password: 'password123' })

    otherCourierAccessToken = otherLoginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'deliver-order@test.com' } },
    })
    await prisma.recipient.deleteMany({ where: { email: 'deliver-order@test.com' } })
    await prisma.courier.deleteMany({ where: { cpf: { in: ['21111111102', '21111111109'] } } })
    await app.close()
  })

  it('[PATCH] /orders/:id/deliver — should return 204 when courier delivers their own order', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'deliver-order@test.com' },
    })

    const order = await prisma.order.create({
      data: {
        title: 'Test Package',
        status: 'PICKED_UP',
        courierId,
        recipientId: recipient.id,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/deliver`)
      .set('Authorization', `Bearer ${courierAccessToken}`)
      .send({ photoUrl: 'https://example.com/photo.jpg' })

    expect(response.statusCode).toBe(204)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.status).toBe('DELIVERED')
    expect(updated?.photoUrl).toBe('https://example.com/photo.jpg')
  })

  it('[PATCH] /orders/:id/deliver — should return 403 when a different courier tries to deliver', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Another Package',
        status: 'PICKED_UP',
        courierId,
        recipient: { connect: { email: 'deliver-order@test.com' } },
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/deliver`)
      .set('Authorization', `Bearer ${otherCourierAccessToken}`)
      .send({ photoUrl: 'https://example.com/photo.jpg' })

    expect(response.statusCode).toBe(403)
  })

  it('[PATCH] /orders/:id/deliver — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/deliver`)
      .set('Authorization', `Bearer ${courierAccessToken}`)
      .send({ photoUrl: 'https://example.com/photo.jpg' })

    expect(response.statusCode).toBe(404)
  })

  it('[PATCH] /orders/:id/deliver — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/deliver`)
      .send({ photoUrl: 'https://example.com/photo.jpg' })

    expect(response.statusCode).toBe(401)
  })
})
