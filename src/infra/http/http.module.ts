import { Module } from '@nestjs/common'
import { AuthenticateCourierUseCase } from 'src/domain/delivery/application/use-cases/authenticate-courier'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [AuthenticateCourierUseCase],
  controllers: [AuthenticateCourierController],
})
export class HttpModule {}
