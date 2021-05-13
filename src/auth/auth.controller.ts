import {
  Body,
  Controller,
  Request,
  Post,
  ValidationPipe,
  UseGuards,
  Get
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegistrationCredentialsDto } from './dto/registration-credentials.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { LocalAuthGuard } from './guards/local-auth-guard'
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth-guard'
import { GetUser } from './decorators/get-user.decorator'
import { ApiBody } from '@nestjs/swagger'
import { LoginCredentialsDto } from './dto/login-credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body(ValidationPipe) registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<{ message: string }> {
    return this.authService.register(registrationCredentialsDto)
  }

  @ApiBody({
    type: LoginCredentialsDto
  })
  /**
   * @documentation
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@GetUser() user): Promise<AuthResponseDto> {
    return this.authService.login(user)
  }
}
