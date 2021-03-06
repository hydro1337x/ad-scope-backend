import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../../users/entities/user.entity'

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest()
    console.log(request.user)
    return request.user
  }
)
