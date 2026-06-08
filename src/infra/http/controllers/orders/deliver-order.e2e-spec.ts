import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AttachmentFactory } from 'tests/factories/make-attachment'
import { CourierFactory } from 'tests/factories/make-courier'
import { OrderFactory } from 'tests/factories/make-order'
import { RecipientFactory } from 'tests/factories/make-recipient'

describe('DeliverOrderController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let courierFactory: CourierFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        CourierFactory,
        OrderFactory,
        RecipientFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    courierFactory = moduleRef.get(CourierFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[PATCH] /orders/:id/deliver', async () => {
    const courier = await courierFactory.makeCourier()
    const recipient = await recipientFactory.makeRecipient()
    const order = await orderFactory.makeOrder({
      courierId: courier.id,
      recipientId: recipient.id,
      status: 'PICKED_UP',
    })
    const attachment = await attachmentFactory.makeAttachment()

    const accessToken = await jwtService.signAsync({
      sub: courier.id.toString(),
      role: courier.role,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ attachmentId: attachment.id.toString() })

    expect(response.statusCode).toBe(204)
  })
})
