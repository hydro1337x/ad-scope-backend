import { Controller, Get } from '@nestjs/common'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  createUser(): Promise<User> {
    return this.usersService.createUser()
  }
}
