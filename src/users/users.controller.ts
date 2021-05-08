import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UpdateUserRequestDto } from './dto/update-user-request.dto'
import { UsersService } from './users.service'
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth-guard'
import { UserJwtAuthGuard } from '../auth/guards/user-jwt-auth-guard'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRequestDto: UpdateUserRequestDto
  ) {
    return this.usersService.updateUser(id, updateUserRequestDto)
  }

  @Delete(':id')
  @UseGuards(UserJwtAuthGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.usersService.deleteUser(id, user)
  }
}
