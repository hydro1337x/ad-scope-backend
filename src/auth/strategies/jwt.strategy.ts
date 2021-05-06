import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { User } from '../../users/entities/user.entity'
import { UsersService } from '../../users/users.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('APP_SECRET')
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload
    const user = await this.usersService.findOne(email)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
