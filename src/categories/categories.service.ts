import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { CategoryRequestDto } from './dto/category-request.dto'
import { Category } from './entities/category.entity'
import { Connection } from 'typeorm'
import { FilesService } from '../files/files.service'
import { CategoryResponseDto } from './dto/category-response.dto'
import { plainToClass } from 'class-transformer'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly filesService: FilesService,
    private readonly connection: Connection
  ) {}

  async createCategory(
    createCategoryDto: CategoryRequestDto,
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

  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesRepository.find({
      relations: ['media']
    })
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
    const found = await this.categoriesRepository.findOne(id, {
      relations: ['media']
    })
    if (!found) {
      throw new NotFoundException()
    }

    const categoryResponseDto = plainToClass(CategoryResponseDto, found, {
      excludeExtraneousValues: true
    })

    return categoryResponseDto
  }
}
