import { UserRole } from '../../users/enums/user-role.enum'

export class AuthenticatedUserDto {
  id: number
  email: string
  firstname: string
  lastname: string
  accessToken: string
  role: UserRole
}
