import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './infra/auth/auth.module'
import { DatabaseModule } from './infra/database/database.module'
import { envSchema } from './infra/env/env'
import { EnvModule } from './infra/env/env.module'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    HttpModule,
    AuthModule,
    EnvModule,
    DatabaseModule,
  ],
})
export class AppModule {}
