import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('ReturnOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let courierAccessToken: string
  let courierId: string
  let otherCourierAccessToken: string
  let recipientId: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    const courier = await prisma.courier.create({
      data: { name: 'Test Courier', cpf: '21111111103', password: 'any' },
    })

    courierId = courier.id
    courierAccessToken = jwtService.sign({ sub: courier.id, role: 'COURIER' })
    otherCourierAccessToken = jwtService.sign({
      sub: randomUUID(),
      role: 'COURIER',
    })

    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'return-order@test.com' },
    })

    recipientId = recipient.id
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'return-order@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'return-order@test.com' },
    })
    await prisma.courier.deleteMany({ where: { cpf: '21111111103' } })
    await app.close()
  })

  it('[PATCH] /orders/:id/return â€” should return 204 when courier returns their own PICKED_UP order', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Test Package',
        status: 'PICKED_UP',
        courierId,
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/return`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(204)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.status).toBe('RETURNED')
  })

  it('[PATCH] /orders/:id/return â€” should return 403 when a different courier tries to return', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Another Package',
        status: 'PICKED_UP',
        courierId,
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/return`)
      .set('Authorization', `Bearer ${otherCourierAccessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[PATCH] /orders/:id/return â€” should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/return`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[PATCH] /orders/:id/return â€” should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).patch(
      `/orders/${randomUUID()}/return`,
    )

    expect(response.statusCode).toBe(401)
  })
})
