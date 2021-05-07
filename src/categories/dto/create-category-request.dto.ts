import { IsNotEmpty } from 'class-validator'

export class CreateCategoryRequestDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string
}
