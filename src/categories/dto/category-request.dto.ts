import { IsNotEmpty } from 'class-validator'

export class CategoryRequestDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string
}
