import { IsNotEmpty, IsOptional } from 'class-validator'

export class FilterUserRequestDto {
  @IsOptional()
  @IsNotEmpty()
  search: string
}
