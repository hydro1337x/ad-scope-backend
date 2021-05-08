import {
  Body,
  Controller,
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
}
