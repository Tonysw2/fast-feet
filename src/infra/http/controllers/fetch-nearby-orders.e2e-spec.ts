import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('FetchNearbyOrdersController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

  // São Paulo coordinates
  const SP_LATITUDE = -23.55052
  const SP_LONGITUDE = -46.633309

  // Rio de Janeiro coordinates (~360km away from SP — outside 50km radius)
  const RJ_LATITUDE = -22.906847
  const RJ_LONGITUDE = -43.172897

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
        cpf: '11111111107',
        password: await hash('password123', 8),
      },
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '11111111107', password: 'password123' })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'nearby-orders@test.com' } },
    })
    await prisma.recipient.deleteMany({ where: { email: 'nearby-orders@test.com' } })
    await prisma.admin.deleteMany({ where: { cpf: '11111111107' } })
    await app.close()
  })

  it('[GET] /orders/nearby — should return only WAITING orders within 50km', async () => {
    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'nearby-orders@test.com' },
    })

    // Near order (São Paulo) — should appear
    await prisma.order.create({
      data: {
        title: 'Nearby Package',
        status: 'WAITING',
        recipientId: recipient.id,
        deliveryLatitude: SP_LATITUDE,
        deliveryLongitude: SP_LONGITUDE,
      },
    })

    // Far order (Rio de Janeiro) — should NOT appear
    await prisma.order.create({
      data: {
        title: 'Far Package',
        status: 'WAITING',
        recipientId: recipient.id,
        deliveryLatitude: RJ_LATITUDE,
        deliveryLongitude: RJ_LONGITUDE,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: SP_LATITUDE, longitude: SP_LONGITUDE })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('orders')
    expect(Array.isArray(response.body.orders)).toBe(true)

    const titles = response.body.orders.map((o: { title: string }) => o.title)
    expect(titles).toContain('Nearby Package')
    expect(titles).not.toContain('Far Package')
  })

  it('[GET] /orders/nearby — should return empty list when no orders within 50km', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: RJ_LATITUDE, longitude: RJ_LONGITUDE })

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(0)
  })

  it('[GET] /orders/nearby — should return 400 when coordinates are missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)
  })

  it('[GET] /orders/nearby — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .query({ latitude: SP_LATITUDE, longitude: SP_LONGITUDE })

    expect(response.statusCode).toBe(401)
  })
})
