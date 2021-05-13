import { EntityRepository, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { RegistrationCredentialsDto } from '../auth/dto/registration-credentials.dto'
import { UserRole } from './enum/user-role.enum'
import { UpdateUserRequestDto } from './dto/update-user-request.dto'
import { last } from 'rxjs/operators'
import { FilterUserRequestDto } from './dto/filter-user-request.dto'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getUsers(filterUserRequestDto: FilterUserRequestDto): Promise<User[]> {
    const { search } = filterUserRequestDto
    const query = this.createQueryBuilder('user')
    if (search) {
      query.where(
        '(user.firstname LIKE :search OR user.lastname LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      )
    }
    return await query.getMany()
  }

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

  async updateUser(
    updateUserRequestDto: UpdateUserRequestDto,
    user: User
  ): Promise<User> {
    const { firstname, lastname, password, email } = updateUserRequestDto

    if (firstname) {
      user.firstname = firstname
    }

    if (lastname) {
      user.lastname = lastname
    }

    if (email) {
      user.email = email
    }

    if (password) {
      user.salt = await bcrypt.genSalt()
      user.password = await this.hashPassword(password, user.salt)
    }

    await user.save()

    return user
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt)
  }
}
