import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'
import { OrderFactory } from 'tests/factories/make-order'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('FetchOrdersController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let adminFactory: AdminFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, OrderFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /orders', async () => {
    const admin = await adminFactory.makeAdmin()
    const recipient = await recipientFactory.makeRecipient()

    await orderFactory.makeOrder({ recipientId: recipient.id })
    await orderFactory.makeOrder({ recipientId: recipient.id })

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({ id: expect.any(String) }),
        ]),
      }),
    )
    expect(response.body.orders).toHaveLength(2)
  })
})
