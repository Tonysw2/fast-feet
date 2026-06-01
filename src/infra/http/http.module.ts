import { Module } from '@nestjs/common'
import { AuthenticateCourierUseCase } from 'src/domain/delivery/application/use-cases/authenticate-courier'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'

@Module({
  imports: [CryptographyModule],
  providers: [AuthenticateCourierUseCase],
  controllers: [AuthenticateCourierController],
})
export class HttpModule {}
