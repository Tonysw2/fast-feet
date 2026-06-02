import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma.service'
import request from 'supertest'

describe('DeleteOrderController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accessToken: string

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
        cpf: '11111111105',
        password: await hash('password123', 8),
      },
    })

    const loginResponse = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({ cpf: '11111111105', password: 'password123' })

    accessToken = loginResponse.body.accessToken
  })

  afterAll(async () => {
    await prisma.order.deleteMany({
      where: { recipient: { email: 'delete-order@test.com' } },
    })
    await prisma.recipient.deleteMany({ where: { email: 'delete-order@test.com' } })
    await prisma.admin.deleteMany({ where: { cpf: '11111111105' } })
    await app.close()
  })

  it('[DELETE] /orders/:id — should return 204 and remove the order', async () => {
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

  it('[DELETE] /orders/:id — should return 404 when order does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/orders/${randomUUID()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  it('[DELETE] /orders/:id — should return 401 when not authenticated', async () => {
    const response = await request(app.getHttpServer()).delete(`/orders/${randomUUID()}`)

    expect(response.statusCode).toBe(401)
  })
})
