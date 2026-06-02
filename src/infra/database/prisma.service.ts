import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'prisma/generated/client'
import { EnvService } from '../env/env.service'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(env: EnvService) {
    const connectionString = env.get('DATABASE_URL')
    const schema = new URL(connectionString).searchParams.get('schema')

    const adapter = new PrismaPg({ connectionString }, { schema })
    super({ adapter })
  }
}
