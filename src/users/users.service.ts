import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { User } from './entities/user.entity'
import { UsersRepository } from './users.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { RegistrationCredentialsDto } from '../auth/dto/registration-credentials.dto'
import { UpdateUserRequestDto } from './dto/update-user-request.dto'
import { UserRole } from './enum/user-role.enum'
import { UpdateUserRoleRequestDto } from './dto/update-user-role-request.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { plainToClass } from 'class-transformer'
import { AuthResponseDto } from '../auth/dto/auth-response.dto'
import { FilterUserRequestDto } from './dto/filter-user-request.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ email }, { relations: ['ads'] })
  }

  async createUser(
    registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<void> {
    return await this.usersRepository.createOne(registrationCredentialsDto)
  }

  async getUsers(
    filterUserRequestDto: FilterUserRequestDto
  ): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.getUsers(filterUserRequestDto)

    const userResponseDtos = plainToClass(UserResponseDto, users, {
      excludeExtraneousValues: true
    })

    return userResponseDtos
  }

  formatCurrentUserResponse(user: User): UserResponseDto {
    const userResponseDto = plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: true
    })
    return userResponseDto
  }

  async updateUserRole(
    id: number,
    updateUserRoleRequestDto: UpdateUserRoleRequestDto
  ) {
    const { role } = updateUserRoleRequestDto
    const user = await this.usersRepository.findOne(id)

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    user.role = role

    await this.usersRepository.save(user)
  }

  async updateUser(
    id: number,
    updateUserRequestDto: UpdateUserRequestDto,
    user: User
  ): Promise<UserResponseDto> {
    const { firstname, lastname, email, password } = updateUserRequestDto

    if (!firstname && !lastname && !email && !password) {
      throw new BadRequestException('At least one field must not be empty')
    }

    if (user.role !== UserRole.ADMIN && user.id !== id) {
      throw new BadRequestException()
    }

    const foundUser = await this.usersRepository.findOne(id)

    if (!foundUser) {
      throw new NotFoundException()
    }

    const updatedUser = await this.usersRepository.updateUser(
      updateUserRequestDto,
      foundUser
    )

    const userResponseDto = plainToClass(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true
    })

    return userResponseDto
  }

  async deleteUser(id: number, user: User) {
    const userForDeletion = await this.usersRepository.findOne(id, {
      relations: ['ads']
    })

    if (!userForDeletion) {
      throw new NotFoundException('User not found')
    }

    if (userForDeletion.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new BadRequestException()
    }

    await this.usersRepository.remove(userForDeletion)
  }
}
