import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator'
import { UserRole } from '../enum/user-role.enum'

export class UpdateUserRequestDto {
  @IsOptional()
  @IsNotEmpty()
  firstname: string

  @IsOptional()
  @IsNotEmpty()
  lastname: string

  @IsOptional()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsEmail()
  email: string
}
