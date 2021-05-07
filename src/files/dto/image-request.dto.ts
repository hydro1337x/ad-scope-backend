import { IsNotEmpty } from 'class-validator'

export class ImageRequestDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  url: string
}
