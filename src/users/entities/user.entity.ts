import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserRole } from '../enum/user-role.enum'
import * as bcrypt from 'bcrypt'
import { Ad } from '../../ads/entities/ad.entity'

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Ad, (ad) => ad.user, { cascade: true })
  ads: Ad[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
