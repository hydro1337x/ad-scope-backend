import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { UsersRepository } from './users.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { RegistrationCredentialsDto } from '../auth/dto/registration-credentials.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ email })
  }

  async createOne(
    registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<void> {
    return await this.usersRepository.createOne(registrationCredentialsDto)
  }
}
