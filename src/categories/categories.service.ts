import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriesRepository } from './categories.repository'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoriesRepository.createCategory(createCategoryDto)
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
