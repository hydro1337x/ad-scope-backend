import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from '../config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    AuthModule,
    UsersModule,
    CategoriesModule
  ]
})
export class AppModule {}
