import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AdsRepository } from './ads.repository'
import { CreateAdRequestDto } from './dto/create-ad-request.dto'
import { CategoriesService } from '../categories/categories.service'
import { Ad } from './entities/ad.entity'
import { Connection } from 'typeorm'
import { FilesService } from '../files/files.service'
import { plainToClass } from 'class-transformer'
import { CategoryResponseDto } from '../categories/dto/category-response.dto'
import { AdResponseDto } from './dto/ad-response.dto'
import { FilterAdRequestDto } from './dto/filter-ad-request.dto'
import { filter } from 'rxjs/operators'

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(AdsRepository)
    private readonly adsRepository: AdsRepository,
    private readonly categoriesService: CategoriesService,
    private readonly filesService: FilesService,
    private readonly connection: Connection
  ) {}

  async createAd(
    createAdRequestDto: CreateAdRequestDto,
    file: Express.Multer.File
  ): Promise<AdResponseDto> {
    const { categoryId } = createAdRequestDto

    const category = await this.categoriesService.findOne(categoryId)

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const queryRunner = this.connection.createQueryRunner()
    let createdAd: Ad

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const image = await this.filesService.uploadImage(file)
      const ad = this.adsRepository.createAd(
        createAdRequestDto,
        category,
        image
      )

      await queryRunner.manager.save(image)
      await queryRunner.manager.save(ad)

      await queryRunner.commitTransaction()

      createdAd = ad
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new ConflictException(error.message)
    } finally {
      await queryRunner.release()
    }

    const adResponseDto = plainToClass(AdResponseDto, createdAd, {
      excludeExtraneousValues: true
    })

    return adResponseDto
  }

  async getAds(
    filterAdRequestDto: FilterAdRequestDto
  ): Promise<AdResponseDto[]> {
    const ads = await this.adsRepository.getAds(filterAdRequestDto)

    const adsResponseDto = plainToClass(AdResponseDto, ads, {
      excludeExtraneousValues: true
    })

    return adsResponseDto
  }

  async getAd(id: number): Promise<AdResponseDto> {
    const ad = await this.adsRepository.findOne(id, {
      relations: ['media', 'category']
    })

    if (!ad) {
      throw new NotFoundException('Ad not found')
    }

    const adResponseDto = plainToClass(AdResponseDto, ad, {
      excludeExtraneousValues: true
    })

    return adResponseDto
  }
}
