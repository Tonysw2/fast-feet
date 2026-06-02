import { Module } from '@nestjs/common'
import { CouriersRepository } from 'src/domain/delivery/application/repositories/couriers-repository'
import { EnvModule } from '../env/env.module'
import { PrismaService } from './prisma.service'
import { PrismaCouriersRepository } from './repositories/couriers-repository'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    { provide: CouriersRepository, useClass: PrismaCouriersRepository },
  ],
  exports: [PrismaService, CouriersRepository],
})
export class DatabaseModule {}
