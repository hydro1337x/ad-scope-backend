import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersModule } from '../users/users.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.register({
      secret: '1798f83f7897',
      signOptions: {
        expiresIn: 3600
      }
    }),
    PassportModule,
    UsersModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
