import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './entities/category.entity'
import { Connection } from 'typeorm'
import { FilesService } from '../files/files.service'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
    private readonly filesService: FilesService,
    private readonly connection: Connection
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File
  ): Promise<Category> {
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

    return createdCategory
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find()
  }

  async getCategory(id: number): Promise<Category> {
    const found = await this.categoriesRepository.findOne(id)

    if (!found) {
      throw new NotFoundException()
    }

    return found
  }
}
