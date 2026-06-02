import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('MarkOrderAsWaitingController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let accessToken: string
  let courierAccessToken: string
  let recipientId: string

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

    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'mark-waiting@test.com' },
    })
    recipientId = recipient.id
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'mark-waiting@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'mark-waiting@test.com' },
    })
    await app.close()
  })

  it('[PATCH] /orders/:id/waiting — should return 204 and set RETURNED order back to WAITING', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Test Package',
        status: 'RETURNED',
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/waiting`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.status).toBe('WAITING')
  })

  it('[PATCH] /orders/:id/waiting — should return 403 when order is not RETURNED', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Already Waiting Package',
        status: 'WAITING',
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/waiting`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[PATCH] /orders/:id/waiting — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/waiting`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[PATCH] /orders/:id/waiting — should return 403 when authenticated as courier', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/waiting`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[PATCH] /orders/:id/waiting — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).patch(
      `/orders/${randomUUID()}/waiting`,
    )

    expect(response.statusCode).toBe(401)
  })
})
