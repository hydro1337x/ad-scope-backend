import { IsNotEmpty } from 'class-validator'

export class CreateImageDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  url: string
}
