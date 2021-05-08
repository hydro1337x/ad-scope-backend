import { IsIn, IsNotEmpty, IsOptional } from 'class-validator'
import { UserRole } from '../enum/user-role.enum'

export class UpdateUserRequestDto {
  @IsOptional()
  @IsIn([UserRole.USER, UserRole.ADMIN])
  role: UserRole

  @IsOptional()
  @IsNotEmpty()
  firstname: string
}
