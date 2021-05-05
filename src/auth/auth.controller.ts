import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { User } from './entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private usersService: AuthService) {}

  @Get()
  createUser(): Promise<User> {
    return this.usersService.createUser()
  }
}
