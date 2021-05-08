import { IsNotEmpty, IsOptional } from 'class-validator'

export class FilterCategoryRequestDto {
  @IsOptional()
  @IsNotEmpty()
  search: string
}
