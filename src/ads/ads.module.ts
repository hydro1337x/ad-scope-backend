import { Module } from '@nestjs/common'
import { AdsController } from './ads.controller'
import { AdsService } from './ads.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdsRepository } from './ads.repository'
import { CategoriesModule } from '../categories/categories.module'
import { FilesModule } from '../files/files.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AdsRepository]),
    CategoriesModule,
    FilesModule
  ],
  controllers: [AdsController],
  providers: [AdsService]
})
export class AdsModule {}
