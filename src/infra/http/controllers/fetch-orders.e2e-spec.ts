import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('FetchOrdersController (E2E)', () => {
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
      where: { recipient: { email: 'fetch-orders@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'fetch-orders@test.com' },
    })
    await app.close()
  })

  it('[GET] /orders — should return 200 with orders list', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'fetch-orders@test.com' },
    })

    await prisma.order.createMany({
      data: [
        {
          title: 'Package A',
          recipientId: recipient.id,
          deliveryLatitude: -23.55052,
          deliveryLongitude: -46.633309,
        },
        {
          title: 'Package B',
          recipientId: recipient.id,
          deliveryLatitude: -23.56,
          deliveryLongitude: -46.64,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('orders')
    expect(Array.isArray(response.body.orders)).toBe(true)
    expect(response.body.orders.length).toBeGreaterThanOrEqual(2)

    const order = response.body.orders[0]
    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('title')
    expect(order).toHaveProperty('status')
    expect(order).toHaveProperty('recipientId')
    expect(order).toHaveProperty('deliveryLatitude')
    expect(order).toHaveProperty('deliveryLongitude')
  })

  it('[GET] /orders?page=2 — should return empty list when there are fewer than 20 orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders?page=2')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(0)
  })

  it('[GET] /orders — should return 403 when authenticated as courier', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${courierAccessToken}`)

    expect(response.statusCode).toBe(403)
  })

  it('[GET] /orders — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).get('/orders')

    expect(response.statusCode).toBe(401)
  })
})
