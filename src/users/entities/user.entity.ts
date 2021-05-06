import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserRole } from '../enums/user-role.enum'
import * as bcrypt from 'bcrypt'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column()
  role: UserRole

  @Column()
  salt: string

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}