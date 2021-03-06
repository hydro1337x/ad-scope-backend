import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { RegistrationCredentialsDto } from './dto/registration-credentials.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '../users/entities/user.entity'
import { AuthResponseDto } from './dto/auth-response.dto'
import { UsersService } from '../users/users.service'
import { plainToClass } from 'class-transformer'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(
    registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<{ message: string }> {
    await this.usersService.createUser(registrationCredentialsDto)
    return { message: 'Successfully registered' }
  }

  async login(user: User): Promise<AuthResponseDto> {
    const email = user.email
    const payload: JwtPayload = { email } // Add roles etc, but not sensitive information
    const accessToken = await this.jwtService.sign(payload)

    const authenticatedUserDto = plainToClass(AuthResponseDto, user, {
      excludeExtraneousValues: true
    })

    authenticatedUserDto.accessToken = accessToken

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
