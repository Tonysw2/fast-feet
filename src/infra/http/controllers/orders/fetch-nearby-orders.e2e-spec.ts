import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { CourierFactory } from 'tests/factories/make-courier'
import { OrderFactory } from 'tests/factories/make-order'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('FetchNearbyOrdersController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let courierFactory: CourierFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory

  const SP_LATITUDE = -23.55052
  const SP_LONGITUDE = -46.633309
  const RJ_LATITUDE = -22.906847
  const RJ_LONGITUDE = -43.172897

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

  it('[GET] /orders/nearby', async () => {
    const courier = await courierFactory.makeCourier()
    const recipient = await recipientFactory.makeRecipient()

    await orderFactory.makeOrder({
      recipientId: recipient.id,
      deliveryLatitude: SP_LATITUDE,
      deliveryLongitude: SP_LONGITUDE,
    })

    await orderFactory.makeOrder({
      recipientId: recipient.id,
      deliveryLatitude: RJ_LATITUDE,
      deliveryLongitude: RJ_LONGITUDE,
    })

    const accessToken = await jwtService.signAsync({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ latitude: SP_LATITUDE, longitude: SP_LONGITUDE })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
        ]),
      }),
    )
    expect(response.body.orders).toHaveLength(1)
  })
})
