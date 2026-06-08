import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/infra/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AdminFactory } from 'tests/factories/make-admin'
import { CourierFactory } from 'tests/factories/make-courier'

describe('GetCourierController (E2E)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let adminFactory: AdminFactory
  let courierFactory: CourierFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, CourierFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    jwtService = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    courierFactory = moduleRef.get(CourierFactory)
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /couriers/:id', async () => {
    const admin = await adminFactory.makeAdmin()
    const courier = await courierFactory.makeCourier()

    const accessToken = await jwtService.signAsync({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/couriers/${courier.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        courier: expect.objectContaining({ id: courier.id.toString() }),
      }),
    )
  })
})
