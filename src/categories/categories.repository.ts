import { EntityRepository, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    const { title, description } = createCategoryDto
    const category = new Category()
    category.title = title
    category.description = description

    await category.save()

    return category
  }
}
