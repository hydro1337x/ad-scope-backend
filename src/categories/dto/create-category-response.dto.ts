import { Expose, plainToClass, Transform, Type } from 'class-transformer'
import { CreateImageResponseDto } from '../../files/dto/create-image-response.dto'

export class CreateCategoryResponseDto {
  @Expose()
  id: number

  @Expose()
  title: string

  @Expose()
  description: string

  @Expose()
  @Transform((data) => Math.floor(new Date(data.value).getTime() / 1000))
  createdAt: number

  @Expose()
  @Transform((data) => Math.floor(new Date(data.value).getTime() / 1000))
  updatedAt: number

  @Expose()
  @Type(() => CreateImageResponseDto)
  media: CreateImageResponseDto
}
