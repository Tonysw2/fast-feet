import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('FetchNearbyOrdersController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let accessToken: string
  let recipientId: string

  // SÃ£o Paulo coordinates
  const SP_LATITUDE = -23.55052
  const SP_LONGITUDE = -46.633309

  // Rio de Janeiro coordinates (~360km away from SP â€” outside 50km radius)
  const RJ_LATITUDE = -22.906847
  const RJ_LONGITUDE = -43.172897

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    accessToken = jwtService.sign({ sub: randomUUID(), role: 'COURIER' })

    const recipient = await prisma.recipient.create({
      data: { name: 'Test Recipient', email: 'nearby-orders@test.com' },
    })

    recipientId = recipient.id
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'nearby-orders@test.com' } },
    })
    await prisma.recipient.deleteMany({
      where: { email: 'nearby-orders@test.com' },
    })
    await app.close()
  })

  it('[GET] /orders/nearby â€” should return only WAITING orders within 50km', async () => {
    // Near order (SÃ£o Paulo) â€” should appear
    await prisma.order.create({
      data: {
        title: 'Nearby Package',
        status: 'WAITING',
        recipientId,
        deliveryLatitude: SP_LATITUDE,
        deliveryLongitude: SP_LONGITUDE,
      },
    })

    // Far order (Rio de Janeiro) â€” should NOT appear
    await prisma.order.create({
      data: {
        title: 'Far Package',
        status: 'WAITING',
        recipientId,
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

  it('[GET] /orders/nearby â€” should return empty list when no orders within 50km', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: RJ_LATITUDE, longitude: RJ_LONGITUDE })

    expect(response.statusCode).toBe(200)
    expect(response.body.orders).toHaveLength(0)
  })

  it('[GET] /orders/nearby â€” should return 400 when coordinates are missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)
  })

  it('[GET] /orders/nearby â€” should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .query({ latitude: SP_LATITUDE, longitude: SP_LONGITUDE })

    expect(response.statusCode).toBe(401)
  })
})
