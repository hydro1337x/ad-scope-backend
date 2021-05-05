import { EntityRepository, Repository } from 'typeorm'
import { User } from './entities/user.entity'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(): Promise<User> {
    const user = new User()
    user.name = 'Benjamin'
    await user.save()
    return user
  }
}
