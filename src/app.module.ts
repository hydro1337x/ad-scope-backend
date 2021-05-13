import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'
import { FilesModule } from './files/files.module'
import { ConfigModule } from '@nestjs/config'
import { AdsModule } from './ads/ads.module'
import * as Joi from '@hapi/joi'
import { TypeOrmConfigService } from './config/type-orm-config.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        JWT_EXPIRATION: Joi.number().default(3600)
      })
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    FilesModule,
    AdsModule
  ]
})
export class AppModule {}
