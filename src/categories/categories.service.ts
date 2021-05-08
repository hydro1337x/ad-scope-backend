import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { CreateCategoryRequestDto } from './dto/create-category-request.dto'
import { Category } from './entities/category.entity'
import { Connection } from 'typeorm'
import { FilesService } from '../files/files.service'
import { CategoryResponseDto } from './dto/category-response.dto'
import { classToPlain, plainToClass } from 'class-transformer'
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto'
import { FilterCategoryRequestDto } from './dto/filter-category-request.dto'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly filesService: FilesService,
    private readonly connection: Connection
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryRequestDto,
    file: Express.Multer.File
  ): Promise<CategoryResponseDto> {
    const queryRunner = this.connection.createQueryRunner()
    let createdCategory: Category

    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const image = await this.filesService.uploadImage(file)
      const category = this.categoriesRepository.createCategory(
        createCategoryDto,
        image
      )

      await queryRunner.manager.save(image)
      await queryRunner.manager.save(category)

      await queryRunner.commitTransaction()

      createdCategory = category
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new ConflictException(error.message)
    } finally {
      await queryRunner.release()
    }

    const categoryResponseDto = plainToClass(
      CategoryResponseDto,
      createdCategory,
      {
        excludeExtraneousValues: true
      }
    )

    return categoryResponseDto
  }

  async getCategories(
    filterCategoryRequestDto: FilterCategoryRequestDto
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.getCategories(
      filterCategoryRequestDto
    )

    const categoriesResponseDto = plainToClass(
      CategoryResponseDto,
      categories,
      {
        excludeExtraneousValues: true
      }
    )

    return categoriesResponseDto
  }

  async getCategory(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media']
    })
    if (!category) {
      throw new NotFoundException()
    }

    const categoryResponseDto = plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true
    })

    return categoryResponseDto
  }

  async findOne(id: number): Promise<Category | undefined> {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media', 'ads']
    })

    return category
  }

  async updateCategory(
    id: number,
    updateCategoryRequestDto: UpdateCategoryRequestDto,
    file: Express.Multer.File
  ) {
    const { title, description } = updateCategoryRequestDto

    if (!title && !description && !file) {
      throw new BadRequestException('At least one field must not be empty')
    }

    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media', 'ads']
    })

    if (!category) {
      throw new NotFoundException('Can not find category for updating')
    }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    if (title) {
      category.title = title
    }

    if (description) {
      category.description = description
    }

    let imageNameForDeletion: string

    try {
      if (file) {
        const image = await this.filesService.uploadImage(file)
        const imageForDeletion = category.media
        imageNameForDeletion = category.media.name
        category.media = image
        await queryRunner.manager.save(image)
        await queryRunner.manager.save(category)
        await queryRunner.manager.remove(imageForDeletion)
      } else {
        await queryRunner.manager.save(category)
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

  async deleteCategory(id: number) {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media', 'ads']
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    await this.filesService.deleteRemoteImage(category.media.name)
    const imageForDeletion = category.media
    await this.categoriesRepository.remove(category)
    await this.filesService.removeLocalImage(imageForDeletion)
  }
}
