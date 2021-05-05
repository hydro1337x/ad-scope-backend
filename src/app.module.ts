import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfig } from '../config/typeorm.config'

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), UsersModule]
})
export class AppModule {}
