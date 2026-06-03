import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { CourierFactory } from 'tests/factories/make-courier'
import { OrderFactory } from 'tests/factories/make-order'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('ReturnOrderController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let courierFactory: CourierFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourierFactory, OrderFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    courierFactory = moduleRef.get(CourierFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[PATCH] /orders/:id/return', async () => {
    const courier = await courierFactory.makeCourier()
    const recipient = await recipientFactory.makeRecipient()
    const order = await orderFactory.makeOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: 'PICKED_UP',
    })

    const accessToken = await jwtService.signAsync({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/return`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })
})
