import { EntityRepository, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { RegistrationCredentialsDto } from '../auth/dto/registration-credentials.dto'
import { UserRole } from './enum/user-role.enum'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createOne(
    registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<void> {
    const { email, password, firstname, lastname } = registrationCredentialsDto

    const user = new User()
    user.email = email
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)
    user.firstname = firstname
    user.lastname = lastname
    user.role = UserRole.USER

    try {
      await user.save()
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Duplicate email')
      } else {
        throw new InternalServerErrorException() // Unexpected error, case not handeled
      }
    }
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt)
  }
}
