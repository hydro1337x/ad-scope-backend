import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
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
import { ApiBearerAuth } from '@nestjs/swagger'
import { UpdateUserRoleRequestDto } from './dto/update-user-role-request.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { FilterUserRequestDto } from './dto/filter-user-request.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   */
  @ApiBearerAuth()
  /**
   */
  @Patch(':id/role/update')
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleRequestDto: UpdateUserRoleRequestDto
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleRequestDto)
  }

  @Get()
  getUsers(
    @Query(ValidationPipe) filterUserRequestDto: FilterUserRequestDto
  ): Promise<UserResponseDto[]> {
    return this.usersService.getUsers(filterUserRequestDto)
  }

  /**
   */
  @ApiBearerAuth()
  /**
   */
  @Patch(':id/update')
  @UseGuards(UserJwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
    @GetUser() user: User
  ) {
    this.usersService.updateUser(id, updateUserRequestDto, user)
  }

  /**
   */
  @ApiBearerAuth()
  /**
   */
  @Delete(':id')
  @UseGuards(UserJwtAuthGuard)
  deleteUser(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.usersService.deleteUser(id, user)
  }
}
