import {
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
import { CreateCategoryResponseDto } from './dto/create-category-response.dto'
import { plainToClass } from 'class-transformer'
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto'

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
  ): Promise<CreateCategoryResponseDto> {
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
      CreateCategoryResponseDto,
      createdCategory,
      {
        excludeExtraneousValues: true
      }
    )

    return categoryResponseDto
  }

  async getCategories(): Promise<CreateCategoryResponseDto[]> {
    const categories = await this.categoriesRepository.find({
      relations: ['media']
    })
    const categoriesResponseDto = plainToClass(
      CreateCategoryResponseDto,
      categories,
      {
        excludeExtraneousValues: true
      }
    )

    return categoriesResponseDto
  }

  async getCategory(id: number): Promise<CreateCategoryResponseDto> {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media']
    })
    if (!category) {
      throw new NotFoundException()
    }

    const categoryResponseDto = plainToClass(
      CreateCategoryResponseDto,
      category,
      {
        excludeExtraneousValues: true
      }
    )

    return categoryResponseDto
  }

  async updateCategory(
    id: number,
    updateCategoryRequestDto: UpdateCategoryRequestDto,
    file: Express.Multer.File
  ) {
    const category = await this.categoriesRepository.findOne(id, {
      relations: ['media']
    })

    if (!category) {
      throw new NotFoundException('Can not find category for updating')
    }

    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    Object.entries(updateCategoryRequestDto).forEach((entry) => {
      const [key, value] = entry
      if (value != null) {
        console.log('categoryKey: ', category[key])
        console.log('value: ', value)
        category[key] = value
      }
    })

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
      relations: ['media']
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
