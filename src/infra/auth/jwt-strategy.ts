import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from '../env/env'

export interface JwtPayload {
  sub: string
  role: 'ADMIN' | 'COURIER'
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(publicKey, 'base64'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      role: payload.role,
    }
  }
}
