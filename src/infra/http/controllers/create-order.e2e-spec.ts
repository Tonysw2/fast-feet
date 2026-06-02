import { randomUUID } from 'node:crypto'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'
import { CourierFactory } from 'tests/factories/make-courier'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('CreateOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService
  let recipientFactory: RecipientFactory
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    recipientFactory = new RecipientFactory(prisma)
    adminFactory = new AdminFactory(prisma)
    courierFactory = new CourierFactory(prisma)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /orders — should return 201 with orderId on valid data', async () => {
    const recipient = await recipientFactory.makeRecipient()
    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Package',
        recipientId: recipient.id.toString(),
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('orderId')
    expect(typeof response.body.orderId).toBe('string')
  })

  it('[POST] /orders — should return 404 when recipient does not exist', async () => {
    const admin = await adminFactory.makeAdmin()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Package',
        recipientId: randomUUID(),
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(404)
  })

  it('[POST] /orders — should return 403 when authenticated as courier', async () => {
    const courier = await courierFactory.makeCourier()

    const accessToken = await jwtService.signAsync({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Package',
        recipientId: randomUUID(),
        deliveryLatitude: -23.55052,
        deliveryLongitude: -46.633309,
      })

    expect(response.statusCode).toBe(403)
  })

  it('[POST] /orders — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).post('/orders').send({
      title: 'Test Package',
      recipientId: randomUUID(),
      deliveryLatitude: -23.55052,
      deliveryLongitude: -46.633309,
    })

    expect(response.statusCode).toBe(401)
  })
})
