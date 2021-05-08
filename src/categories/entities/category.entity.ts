import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Image } from '../../files/entities/image.entity'
import { Ad } from '../../ads/entities/ad.entity'

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @Column()
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Ad, (ad) => ad.category, { cascade: true })
  ads: Ad[]

  @OneToOne(() => Image)
  @JoinColumn()
  media: Image
}
