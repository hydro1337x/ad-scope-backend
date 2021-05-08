import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserRole } from '../../users/enum/user-role.enum'

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('jwt') {
  authorizedRoles: UserRole[] = [UserRole.USER, UserRole.ADMIN]

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (!this.authorizedRoles.includes(user.role)) {
      throw new UnauthorizedException()
    }
    return user
  }
}
