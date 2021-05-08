import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Category } from '../../categories/entities/category.entity'
import { Image } from '../../files/entities/image.entity'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ type: 'float8' })
  price: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Category, (category) => category.ads, {
    onDelete: 'CASCADE'
  })
  category: Category

  @ManyToOne(() => User, (user) => user.ads, {
    onDelete: 'CASCADE'
  })
  user: User

  @OneToOne(() => Image)
  @JoinColumn()
  media: Image
}
