import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('PickUpOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let courierAccessToken: string
  let courierId: string
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
      data: { name: 'Test Courier', cpf: '21111111101', password: 'any' },
    })

    courierId = courier.id
    courierAccessToken = jwtService.sign({ sub: courier.id, role: 'COURIER' })

    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'pick-up-order@test.com' },
    })

    recipientId = recipient.id
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'pick-up-order@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'pick-up-order@test.com' },
    })
    await prisma.courier.deleteMany({ where: { cpf: '21111111101' } })
    await app.close()
  })

  it('[PATCH] /orders/:id/pick-up — should return 204 and assign courier to WAITING order', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Test Package',
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/pick-up`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(204)

    const updated = await prisma.order.findUnique({ where: { id: order.id } })
    expect(updated?.status).toBe('PICKED_UP')
    expect(updated?.courierId).toBe(courierId)
  })

  it('[PATCH] /orders/:id/pick-up — should return 403 when order is not WAITING', async () => {
    const order = await prisma.order.create({
      data: {
        title: 'Already Picked Package',
        status: 'PICKED_UP',
        courierId,
        recipientId,
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      },
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id}/pick-up`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[PATCH] /orders/:id/pick-up — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/orders/${randomUUID()}/pick-up`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[PATCH] /orders/:id/pick-up — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).patch(
      `/orders/${randomUUID()}/pick-up`,
    )

    expect(response.statusCode).toBe(401)
  })
})
