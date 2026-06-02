import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('EditOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let accessToken: string
  let courierAccessToken: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    accessToken = jwtService.sign({ sub: randomUUID(), role: 'ADMIN' })
    courierAccessToken = jwtService.sign({ sub: randomUUID(), role: 'COURIER' })
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'edit-order@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'edit-order@test.com' },
    })
    await app.close()
  })

  it('[PUT] /orders/:id — should return 204 and update the order', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'edit-order@test.com' },
    })

    const order = await prisma.order.create({
      data: {
        title: 'Original Title',
        recipientId: recipient.id,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Title',
        recipientId: recipient.id,
        deliveryLatitude: -23.6,
        deliveryLongitude: -46.7,
      })

    expect(response.statusCode).toBe(204)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.title).toBe('Updated Title')
  })

  it('[PUT] /orders/:id — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .put(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Title',
        recipientId: randomUUID(),
        deliveryLatitude: -23.6,
        deliveryLongitude: -46.7,
      })

    expect(response.statusCode).toBe(404)
  })

  it('[PUT] /orders/:id — should return 403 when authenticated as courier', async () => {
    const response = await request(app.getHttpServer())
      .put(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${courierAccessToken}`)
      .send({
        title: 'Updated Title',
        recipientId: randomUUID(),
        deliveryLatitude: -23.6,
        deliveryLongitude: -46.7,
      })

    expect(response.statusCode).toBe(403)
  })

  it('[PUT] /orders/:id — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .put(`/orders/${randomUUID()}`)
      .send({
        title: 'Updated Title',
        recipientId: randomUUID(),
        deliveryLatitude: -23.6,
        deliveryLongitude: -46.7,
      })

    expect(response.statusCode).toBe(401)
  })
})
