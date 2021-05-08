import { IsIn, IsInt, IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateAdRequestDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  @IsNumber()
  @Transform((value) => Number.parseFloat(value.value))
  price: number

  @IsNotEmpty()
  @IsInt()
  @Transform((value) => Number.parseInt(value.value))
  categoryId: number
}
