import { IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class UpdateAdRequestDto {
  @IsOptional()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform((value) => Number.parseFloat(value.value))
  price: number

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform((value) => Number.parseInt(value.value))
  categoryId: number
}
