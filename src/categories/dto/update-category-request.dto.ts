import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateCategoryRequestDto {
  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string
}
