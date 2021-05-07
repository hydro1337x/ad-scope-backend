import { Expose, plainToClass, Transform, Type } from 'class-transformer'
import { ImageResponseDto } from '../../files/dto/image-response.dto'

export class CategoryResponseDto {
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
  @Type(() => ImageResponseDto)
  media: ImageResponseDto
}
