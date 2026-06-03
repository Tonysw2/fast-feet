import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('DeleteOrderController (E2E)', () => {
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
      where: { recipient: { email: 'delete-order@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'delete-order@test.com' },
    })
    await app.close()
  })

  it('[DELETE] /orders/:id â€” should return 204 and remove the order', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'delete-order@test.com' },
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
      .delete(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const deleted = await prisma.order.findUnique({ where: { id: order.id } })
    expect(deleted).toBeNull()
  })

  it('[DELETE] /orders/:id â€” should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[DELETE] /orders/:id â€” should return 403 when authenticated as courier', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[DELETE] /orders/:id â€” should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).delete(
      `/orders/${randomUUID()}`,
    )

    expect(response.statusCode).toBe(401)
  })
})
