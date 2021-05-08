import { Module } from '@nestjs/common'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { FilesModule } from '../files/files.module'

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesRepository]), FilesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
