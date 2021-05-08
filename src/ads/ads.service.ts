import {
  BadRequestException,
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
import { classToPlain, plainToClass } from 'class-transformer'
import { AdResponseDto } from './dto/ad-response.dto'
import { FilterAdRequestDto } from './dto/filter-ad-request.dto'
import { UpdateAdRequestDto } from './dto/update-ad-request.dto'
import { Category } from '../categories/entities/category.entity'

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

  async updateAd(
    id: number,
    updateAdRequestDto: UpdateAdRequestDto,
    file: Express.Multer.File
  ) {
    const { title, description, price, categoryId } = updateAdRequestDto

    if (!title && !description && price && !categoryId && !file) {
      throw new BadRequestException('At least one field must not be empty')
    }

    const ad = await this.adsRepository.findOne(id, {
      relations: ['media', 'category']
    })

    if (!ad) {
      throw new NotFoundException('Ad not found')
    }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    if (title) {
      ad.title = title
    }

    if (description) {
      ad.description = description
    }

    if (price) {
      ad.price = price
    }

    if (categoryId) {
      const categoryForUpdate = await this.categoriesService.findOne(categoryId)
      if (!categoryForUpdate) {
        throw new NotFoundException('Selected category for update not found')
      }
      ad.category = categoryForUpdate
    }

    let imageNameForDeletion: string

    try {
      if (file) {
        const image = await this.filesService.uploadImage(file)
        const imageForDeletion = ad.media
        imageNameForDeletion = ad.media.name
        ad.media = image
        await queryRunner.manager.save(image)
        await queryRunner.manager.save(ad)
        await queryRunner.manager.remove(imageForDeletion)
      } else {
        await queryRunner.manager.save(ad)
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new ConflictException(error.message)
    } finally {
      await queryRunner.release()
    }

    if (imageNameForDeletion) {
      await this.filesService.deleteRemoteImage(imageNameForDeletion)
    }
  }

  async deleteAd(id: number) {
    const ad = await this.adsRepository.findOne(id, {
      relations: ['media', 'category']
    })

    if (!ad) {
      throw new NotFoundException('Ad not found')
    }

    await this.filesService.deleteRemoteImage(ad.media.name)
    const imageForDeletion = ad.media
    await this.adsRepository.remove(ad)
    await this.filesService.removeLocalImage(imageForDeletion)
  }
}
