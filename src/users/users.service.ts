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
import { classToPlain } from 'class-transformer'

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

  async updateUser(id: number, updateUserRequestDto: UpdateUserRequestDto) {
    console.log(updateUserRequestDto)
    const values = classToPlain(updateUserRequestDto)

    if (Object.keys(values).length === 0) {
      throw new BadRequestException('At least one field must not be empty')
    }

    const user = await this.usersRepository.findOne(id)

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    for (const key in values) {
      user[key] = values[key]
    }

    await this.usersRepository.save(user)
  }
}
