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
import { AuthenticatedUserDto } from './dto/authenticated-user.dto'
import { LocalAuthGuard } from './guards/local-auth-guard'
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth-guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body(ValidationPipe) registrationCredentialsDto: RegistrationCredentialsDto
  ): Promise<{ message: string }> {
    return this.authService.register(registrationCredentialsDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() request): Promise<AuthenticatedUserDto> {
    return this.authService.login(request.user)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  fakeFunction() {
    return 'Authorized'
  }
}
