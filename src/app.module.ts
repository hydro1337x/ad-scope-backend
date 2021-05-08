import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from '../config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'
import { FilesModule } from './files/files.module'
import { ConfigModule } from '@nestjs/config'
import { AdsModule } from './ads/ads.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(TypeOrmConfig),
    AuthModule,
    UsersModule,
    CategoriesModule,
    FilesModule,
    AdsModule
  ]
})
export class AppModule {}
