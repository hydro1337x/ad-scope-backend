import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { RegistrationCredentialsDto } from './dto/registration-credentials.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '../users/entities/user.entity'
import { AuthenticatedUserDto } from './dto/authenticated-user.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(
    registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<{ message: string }> {
    await this.usersService.createOne(registrationCredentialsDto)
    return { message: 'Successfully registered' }
  }

  async login(user: User): Promise<AuthenticatedUserDto> {
    const email = user.email
    const payload: JwtPayload = { email } // Add roles etc, but not sensitive information
    const accessToken = await this.jwtService.sign(payload)

    const { password, salt, ...result } = user
    let authenticatedUserDto = new AuthenticatedUserDto()
    authenticatedUserDto = { ...result, accessToken }

    return authenticatedUserDto
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(email)
    if (user && (await user.validatePassword(password))) {
      return user
    } else {
      return null
    }
  }
}
