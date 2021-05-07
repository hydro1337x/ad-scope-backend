import { UserRole } from '../../users/enums/user-role.enum'
import { Expose } from 'class-transformer'

export class AuthResponseDto {
  @Expose()
  id: number

  @Expose()
  email: string

  @Expose()
  firstname: string

  @Expose()
  lastname: string

  @Expose()
  role: UserRole

  accessToken: string
}
