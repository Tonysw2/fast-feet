import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

export interface UserPayload {
  sub: string
  role: 'ADMIN' | 'COURIER'
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest()
    return request.user as UserPayload
  },
)
