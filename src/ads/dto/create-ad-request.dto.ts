import { IsInt, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateAdRequestDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  price: number

  @IsNotEmpty()
  categoryId: number
}
