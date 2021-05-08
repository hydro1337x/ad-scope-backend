import { UserRole } from '../enum/user-role.enum'
import { Expose, Transform } from 'class-transformer'

export class UserResponseDto {
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

  @Expose()
  createdAt: number

  @Expose()
  @Transform((data) => Math.floor(new Date(data.value).getTime() / 1000))
  updatedAt: number
}
