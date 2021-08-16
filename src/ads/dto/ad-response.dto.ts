import { Expose, Transform, Type } from 'class-transformer'
import { CreateImageResponseDto } from '../../files/dto/create-image-response.dto'

export class AdResponseDto {
  @Expose()
  id: number

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  price: number

  @Expose()
  @Transform((data) => {
    console.log('Category Transform: ', data)
    data.obj.category.id
  })
  categoryId: number

  @Expose()
  @Transform((data) => {
    console.log('User Transform: ', data)
    data.obj.user.id
  })
  userId: number

  @Expose()
  @Type(() => CreateImageResponseDto)
  media: CreateImageResponseDto

  @Expose()
  @Transform((data) => Math.floor(new Date(data.value).getTime() / 1000))
  createdAt: number

  @Expose()
  @Transform((data) => Math.floor(new Date(data.value).getTime() / 1000))
  updatedAt: number
}
